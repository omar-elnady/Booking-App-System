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
import i18next from "i18next";

const successfullRedirectUrl =
  process.env.FE_URL || "https://www.facebook.com/omarahmedelnadey";

export const register = asyncHandler(async (req, res, next) => { 
   const { userName, email, password } = req.body;

  if (await userModel.findOne({ email: email.toLowerCase() })) {
    return next(new Error(req.t("errors.emailExist"), { cause: 409 }));
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
    return next(new Error(req.t("errors.sendEmailError"), { cause: 400 }));
  }

  const hashPassword = hash({ plaintext: password });

  const { _id } = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res.status(201).json({
    message: req.t("messages.userRegistredSuccessfully"),
    _id,
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
    // return res.status(200).redirect(`${process.env.FE_URL}` /NotRegisterAccount)
    return res
      .status(200)
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
    return next(new Error(req.t("errors.sendEmailError"), { cause: 400 }));
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
    return next(new Error(req.t("errors.invalidLoginData"), { cause: 400 }));
  }
  const access_token = generateToken({
    payload: { id: user._id, role: user.role, userName: user.userName },
    expiresIn: 60 * 60 * 24,
  });

  const refresh_token = generateToken({
    payload: { id: user._id, role: user.role, userName: user.userName },
    expiresIn: 60 * 60 * 24 * 365,
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
  const forgetCode = nanoId();
  const user = await userModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { forgetCode, forgetCodeExpires: expiresAt },
    { new: true }
  );
  const expiresAt = Date.now() + 15 * 60 * 1000;
  if (!user) {
    return next(new Error(req.t("errors.notRegisterAccount"), { cause: 404 }));
  }
  const html = sendForgetCodeTemplate(user.userName, forgetCode);
  if (!(await sendEmail({ to: email, subject: "Forget Password", html }))) {
    return next(new Error(req.t("errors.sendEmailError"), { cause: 400 }));
  }
  return res
    .status(200)
    .json({ message: req.t("messages.resendVerificationCode") });
});

export const changeForgetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error(req.t("errors.notRegisterAccount"), { cause: 404 }));
  }
  if (user.forgetCode != forgetCode) {
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
