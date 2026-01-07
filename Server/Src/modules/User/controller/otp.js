import speakeasy from "speakeasy";
import { asyncHandler } from "../../../utils/errorHandling.js";
import twilio from "twilio";
import nodemailer from "nodemailer";

// Store OTPs temporarily (in production, use Redis or DB)
const otpStore = new Map();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate and send OTP via WhatsApp or Email
export const sendPhoneOTP = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;
  const { id } = req.user;

  if (!phone) {
    return next(new Error("Phone number is required", { cause: 400 }));
  }

  // Validate Egyptian phone number format
  const cleanPhone = phone.replace(/^\+20/, "").replace(/^0+/, "");
  const phoneRegex = /^(10|11|12|15)\d{8}$/;

  if (!phoneRegex.test(cleanPhone)) {
    return next(
      new Error(
        "رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون 11 رقم",
        { cause: 400 }
      )
    );
  }

  // Import user model
  const userModel = (await import("../../../DB/modules/User.model.js")).default;
  const user = await userModel.findById(id);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Check if user changed phone in last 48 hours
  if (user.lastPhoneChangeDate) {
    const hoursSinceLastChange =
      (Date.now() - new Date(user.lastPhoneChangeDate).getTime()) /
      (1000 * 60 * 60);

    if (hoursSinceLastChange < 48) {
      const hoursRemaining = Math.ceil(48 - hoursSinceLastChange);
      return next(
        new Error(
          `يمكنك تغيير رقم الموبايل مرة كل 48 ساعة. متاح التغيير خلال ${hoursRemaining} ساعة | You can change your phone number once every 48 hours. Available in ${hoursRemaining} hours`,
          { cause: 429 }
        )
      );
    }
  }

  // --- Daily Limit Logic ---
  const today = new Date();
  const lastOtpDate = user.lastOtpDate ? new Date(user.lastOtpDate) : null;

  // Reset count if it's a new day
  if (
    !lastOtpDate ||
    lastOtpDate.getDate() !== today.getDate() ||
    lastOtpDate.getMonth() !== today.getMonth() ||
    lastOtpDate.getFullYear() !== today.getFullYear()
  ) {
    user.dailyOtpCount = 0;
  }

  // Generate 6-digit OTP
  const otp = speakeasy.totp({
    secret: process.env.OTP_SECRET || "BOOKING_SYSTEM_SECRET_KEY",
    encoding: "base32",
    digits: 6,
    step: 300, // Valid for 5 minutes
  });

  // Store OTP with phone and user ID
  otpStore.set(`${id}-${phone}`, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  let sentMethod = "whatsapp";

  try {
    if (user.dailyOtpCount < 3) {
      // Send via Twilio WhatsApp
      const message = await twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phone}`,
        body: `🔐 كود التأكيد الخاص بك: ${otp}\n\nالكود صالح لمدة 5 دقائق.\nلا تشارك هذا الكود مع أي شخص.`,
      });
      console.log(`\n✅ OTP sent to ${phone} via WhatsApp: ${otp}\n`);
      console.log("Twilio Message SID:", message.sid);
      sentMethod = "whatsapp";
    } else {
      // Send via Email
      await transporter.sendMail({
        from: `"Booking System" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "🔐 كود تغيير رقم الموبايل",
        text: `كود التأكيد الخاص بك هو: ${otp}\n\nصلاحية الكود 5 دقائق.`,
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
            <h2>تغيير رقم الموبايل</h2>
            <p>لقد طلبت تغيير رقم الموبايل الخاص بك.</p>
            <p>استخدم الكود التالي لإتمام العملية:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
            <p>هذا الكود صالح لمدة 5 دقائق.</p>
            <hr />
            <p style="font-size: 12px; color: #666;">إذا لم تطلب هذا التغيير، يرجى تجاهل هذه الرسالة.</p>
          </div>
        `,
      });
      console.log(`\n✅ OTP sent to ${user.email} via Email: ${otp}\n`);
      sentMethod = "email";
    }

    // Update user stats
    user.dailyOtpCount += 1;
    user.lastOtpDate = new Date();
    await user.save();

    return res.status(200).json({
      message:
        sentMethod === "whatsapp"
          ? "تم إرسال كود التأكيد على واتساب"
          : "تم تجاوز الحد اليومي للواتساب. تم إرسال الكود على الإيميل",
      sentMethod,
      // In development, return OTP (REMOVE IN PRODUCTION!)
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error(`Error sending via ${sentMethod}:`, error.message);

    // Fallback: Log OTP in console for development
    console.log(`\n🔐 OTP for ${phone}: ${otp}\n`);

    return res.status(200).json({
      message: "تم إنشاء كود التأكيد (تحقق من الـ Console)",
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  }
});

// Verify OTP and update phone
export const verifyPhoneOTP = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;
  const { id } = req.user;

  if (!phone || !otp) {
    return next(new Error("Phone and OTP are required", { cause: 400 }));
  }

  // Get stored OTP
  const stored = otpStore.get(`${id}-${phone}`);

  if (!stored) {
    return next(new Error("OTP not found or expired", { cause: 400 }));
  }

  // Check if expired
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(`${id}-${phone}`);
    return next(new Error("OTP expired", { cause: 400 }));
  }

  // Verify OTP
  if (stored.otp !== otp) {
    return next(new Error("Invalid OTP", { cause: 400 }));
  }

  // OTP is valid, delete it
  otpStore.delete(`${id}-${phone}`);

  // Import user model
  const userModel = (await import("../../../DB/modules/User.model.js")).default;

  // Check if phone already exists for another user
  const existingUser = await userModel.findOne({ phone, _id: { $ne: id } });
  if (existingUser) {
    return next(new Error("Phone number already in use", { cause: 409 }));
  }

  // Update user phone and lastPhoneChangeDate
  const user = await userModel.findById(id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  user.phone = phone;
  user.lastPhoneChangeDate = new Date();
  await user.save();

  return res.status(200).json({
    message: "تم تحديث رقم الموبايل بنجاح",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userName: user.userName,
      role: user.role,
      userImage: user.userImage,
      lastPhoneChangeDate: user.lastPhoneChangeDate,
    },
  });
});
