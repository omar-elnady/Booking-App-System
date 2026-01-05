import { asyncHandler } from "../../../utils/errorHandling.js";
import sendEmail from "../../../utils/email.js";
import { hash, compare } from "../../../utils/HashAndCompare.js";
import userModel from "../../../DB/modules/User.model.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import {
  confirmationEmailTemplate,
  resendConfirmEmailTemplate,
  sendForgetCodeTemplate,
} from "../../../utils/emailTemplates.js";
import { customAlphabet } from "nanoid";

const successfullRedirectUrl = process.env.FE_URL || "http://localhost:5173";

export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password, firstName, lastName } = req.body;

  if (await userModel.findOne({ email: email.toLowerCase() })) {
    return next(new Error(req.t("errors.emailExist"), { cause: 409 }));
  }

  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 15, // 15 minutes
  });
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 60 * 24, // 24 hours
  });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const rfLink = `${req.protocol}://${req.headers.host}/auth/NewConfirmEmail/${refreshToken}`;

  const html = confirmationEmailTemplate({ link, rfLink });

  if (!(await sendEmail({ to: email, subject: "Confirmation-Email", html }))) {
    return next(new Error(req.t("errors.sendEmailError"), { cause: 500 }));
  }

  const hashPassword = hash({ plaintext: password });

  // Handle pending organizer request at registration
  const organizerRequestStatus =
    req.body.requestOrganizer === true ? "pending" : "none";
  const organizerSummary = req.body.organizerSummary || "";

  const newUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
    firstName,
    lastName,
    organizerRequestStatus,
    organizerSummary,
  });

  return res.status(201).json({
    message: req.t("messages.userRegistredSuccessfully"),
    _id: newUser._id,
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
  if (!email) {
    return next(new Error(req.t("errors.tokenPayload"), { cause: 400 }));
  }
  const user = await userModel.updateOne(
    { email: email.toLowerCase() },
    { confirmEmail: true }
  );
  if (user.matchedCount) {
    return res.status(200).redirect(successfullRedirectUrl);
  } else {
    return res
      .status(404)
      .json({ message: req.t("errors.notRegisterAccount") });
  }
});

export const requestNewConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
  if (!email) {
    return next(new Error(req.t("errors.tokenPayload"), { cause: 400 }));
  }
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error(req.t("errors.notRegisterAccount"), { cause: 404 }));
  }
  if (user.confirmEmail) {
    return res.status(200).redirect(`${successfullRedirectUrl}`);
  }

  const newToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 15,
  });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;

  const html = resendConfirmEmailTemplate(link);
  if (
    !(await sendEmail({
      to: email,
      subject: "Resend Confirmation-Email",
      html,
    }))
  ) {
    return next(new Error(req.t("errors.sendEmailError"), { cause: 500 }));
  }

  return res.status(200).json({
    message: req.t("messages.resendConfirmEmail"),
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error(req.t("errors.notRegisterAccount"), { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(
      new Error(req.t("errors.confirmYouEmailFirst"), { cause: 400 })
    );
  }

  if (!compare({ plaintext: password, hashValue: user.password })) {
    return next(new Error(req.t("errors.invalidLoginData"), { cause: 401 }));
  }

  // Check if user is blocked or inactive
  if (user.status === "blocked" || user.status === "inactive") {
    return next(new Error(req.t("errors.accountBlocked"), { cause: 403 }));
  }

  // 2FA Logic
  if (user.twoFactorEnabled) {
    const { code } = req.body;

    if (!code) {
      const nanoId = customAlphabet("123456789", 6);
      const twoFactorCode = nanoId();

      user.twoFactorCode = twoFactorCode;
      await user.save();

      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Two-Factor Authentication</h2>
          <p>Your login verification code is:</p>
          <h1 style="color: #4F46E5;">${twoFactorCode}</h1>
          <p>This code is valid for this login attempt.</p>
        </div>
      `;

      await sendEmail({ to: email, subject: "Login Verification Code", html });

      return res.status(200).json({
        message: "2FA Code sent to your email",
        twoFactor: true,
        email: user.email,
      });
    }

    // Verify Code
    if (user.twoFactorCode !== code) {
      return next(new Error("Invalid 2FA Code", { cause: 400 }));
    }

    // Clear code after success
    user.twoFactorCode = null;
    await user.save();
  }

  const tokenPayload = {
    id: user._id,
    role: user.role,
    userName: user.userName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    firstName: user.firstName,
    lastName: user.lastName,
    userImage: user.userImage,
  };

  const access_token = generateToken({
    payload: tokenPayload,
    expiresIn: 60 * 60 * 24, // 24 hours
  });

  const refresh_token = generateToken({
    payload: { id: user._id, role: user.role },
    expiresIn: 60 * 60 * 24 * 365, // 1 year
  });

  return res.status(200).json({
    message: req.t("messages.userLoginSuccessfully"),
    access_token,
    refresh_token,
  });
});

export const getForgetPasswordCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const nanoId = customAlphabet("123456789", 6);
  const forgetCode = parseInt(nanoId(), 10);
  const expiresAt = Date.now() + 15 * 60 * 1000;

  const user = await userModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { forgetCode, forgetCodeExpires: expiresAt },
    { new: true }
  );

  if (!user) {
    return next(new Error(req.t("errors.notRegisterAccount"), { cause: 404 }));
  }

  const html = sendForgetCodeTemplate(user.userName, forgetCode);
  if (!(await sendEmail({ to: email, subject: "Forget Password", html }))) {
    return next(new Error(req.t("errors.sendEmailError"), { cause: 500 }));
  }

  return res
    .status(200)
    .json({ message: req.t("messages.resendVerificationCode") });
});

export const verifyForgetPasswordCode = asyncHandler(async (req, res, next) => {
  const { email, forgetCode } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error(req.t("errors.notRegisterAccount"), { cause: 404 }));
  }

  // Check code equality
  if (String(user.forgetCode) !== String(forgetCode)) {
    return next(new Error(req.t("errors.invalidResetCode"), { cause: 400 }));
  }

  // Check expiration
  if (user.forgetCodeExpires < Date.now()) {
    return next(new Error(req.t("errors.resetCodeExpired"), { cause: 400 }));
  }

  return res.status(200).json({
    message:
      req.t("messages.codeVerifiedSuccessfully") ||
      "Code verified successfully",
  });
});

export const changeForgetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error(req.t("errors.notRegisterAccount"), { cause: 404 }));
  }

  // Check code again for security (stateless verification)
  if (String(user.forgetCode) !== String(forgetCode)) {
    return next(new Error(req.t("errors.invalidResetCode"), { cause: 400 }));
  }

  if (user.forgetCodeExpires < Date.now()) {
    return next(new Error(req.t("errors.resetCodeExpired"), { cause: 400 }));
  }

  user.password = hash({ plaintext: password });
  user.forgetCode = null;
  user.forgetCodeExpires = null;
  user.changePasswordTime = Date.now();
  await user.save();

  return res
    .status(200)
    .json({ message: req.t("messages.passwordChangedSuccessfully") });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // Assumes auth middleware populates req.user

  const user = await userModel.findById(id);
  if (!user) {
    return next(new Error(req.t("errors.userNotFound"), { cause: 404 }));
  }

  if (!compare({ plaintext: oldPassword, hashValue: user.password })) {
    return next(new Error(req.t("errors.oldPasswordInvalid"), { cause: 400 }));
  }

  user.password = hash({ plaintext: newPassword });
  user.changePasswordTime = Date.now();
  await user.save();

  return res
    .status(200)
    .json({ message: req.t("messages.passwordChangedSuccessfully") });
});
