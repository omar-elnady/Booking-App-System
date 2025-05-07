import { asyncHandler } from "../../utils/errorHandling.js";
import sendEmail from "../../utils/email.js";
import { hash, compare } from "../../utils/HashAndCompare.js";
import userModel from "../../DB/modules/User.model.js";
import {
  generateToken,
  verifyToken,
} from "../../utils/GenerateAndVerifyToken.js";
import {
  confirmationEmailTemplate,
  resendConfirmEmailTemplate,
  sendForgetCodeTemplate,
} from "../../utils/emailTemplates.js";
import { customAlphabet } from "nanoid";

const successfullRedirectUrl =
  process.env.FE_URL || "https://www.facebook.com/omarahmedelnadey";

export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password, cPassword } = req.body;

  if (cPassword !== password) {
    return next(new Error("In-valid confirm password", { cause: 400 }));
  }
  if (await userModel.findOne({ email: email.toLowerCase() })) {
    return next(new Error("Email exist", { cause: 409 }));
  }

  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 15,
  });
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 60 * 24,
  });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const rfLink = `${req.protocol}://${req.headers.host}/auth/NewConfirmEmail/${refreshToken}`;

  const html = confirmationEmailTemplate({ link, rfLink });

  if (!(await sendEmail({ to: email, subject: "Confirmation-Email", html }))) {
    return next(
      new Error("Failed to send email. Please try again later.", { cause: 400 })
    );
  }

  const hashPassword = hash({ plaintext: password });

  const { _id } = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res.status(201).json({
    message: "User Register Successfully , Please check your email",
    _id,
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
  if (!email) {
    return next(new Error("In-valid token payload", { cause: 400 }));
  }
  const user = await userModel.updateOne(
    { email: email.toLowerCase() },
    { confirmEmail: true }
  );
  if (user.matchedCount) {
    return res.status(200).redirect(successfullRedirectUrl);
  } else {
    // return res.status(200).redirect(`${process.env.FE_URL}` /NotRegisterAccount)
    return res.status(200).json({ message: "Not register account" });
  }
});

export const requestNewConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
  if (!email) {
    return next(new Error("In-valid token payload", { cause: 400 }));
  }
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error("Not register account", { cause: 404 }));
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
    return next(new Error("Email rejected", { cause: 400 }));
  }

  return res.status(200).json({
    message: "Email Verification Link Sent , Please check your email",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error("Not register account", { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(new Error("Please confirm your email first", { cause: 400 }));
  }

  if (!compare({ plaintext: password, hashValue: user.password })) {
    return next(new Error("In-valid login data", { cause: 400 }));
  }
  const access_token = generateToken({
    payload: { id: user._id, role: user.role, userName: user.userName },
    expiresIn: 60 * 60 * 24,
  });

  const refresh_token = generateToken({
    payload: { id: user._id, role: user.role, userName: user.userName },
    expiresIn: 60 * 60 * 24 * 365,
  });

  return res
    .status(200)
    .json({ message: "User Login Successfully", access_token, refresh_token });
});

export const getForgetPasswordCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const nanoId = customAlphabet("123456789", 6);
  const forgetCode = nanoId();
  const user = await userModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { forgetCode, forgetCodeExpires: expiresAt },
    { new: true }
  );
  const expiresAt = Date.now() + 15 * 60 * 1000;
  if (!user) {
    return next(new Error("Not register account", { cause: 404 }));
  }
  const html = sendForgetCodeTemplate(user.userName, forgetCode);
  if (!(await sendEmail({ to: email, subject: "Forget Password", html }))) {
    return next(new Error("Email rejected", { cause: 400 }));
  }
  return res.status(200).json({ message: "Code Sent. Check your email" });
});

export const changeForgetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error("Not register account", { cause: 404 }));
  }
  if (user.forgetCode != forgetCode) {
    return next(new Error("In-valid reset code", { cause: 400 }));
  }

  if (user.forgetCodeExpires < Date.now()) {
    return next(new Error("Reset code has expired", { cause: 400 }));
  }

  user.password = hash({ plaintext: password });
  user.forgetCode = null;
  user.forgetCodeExpires = null;
  user.changePasswordTime = Date.now();
  await user.save();
  return res.status(200).json({ message: "Password Changed Successfully" });
});
