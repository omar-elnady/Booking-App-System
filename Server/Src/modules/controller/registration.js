import { asyncHandler } from "../../utils/errorHandling.js";
import sendEmail from "../../utils/email.js";
import { hash, compare } from "../../utils/HashAndCompare.js";
import userModel from "../../DB/modules/User.model.js";
import {
  generateToken,
  verifyToken,
} from "../../utils/GenerateAndVerifyToken.js";
import { confirmationEmailTemplate } from "../../utils/emailTemplates.js";

export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (await userModel.findOne({ email: email.toLowerCase() })) {
    return next(new Error("Email exist", { cause: 409 }));
  }

  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 5,
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
    return next(new Error("Email rejected", { cause: 400 }));
  }

  const hashPassword = hash({ plaintext: password });

  const { _id } = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res.status(201).json({ message: "User Register Successfully", _id });
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
    return res.status(200).redirect(`${process.env.FE_URL}`);
  } else {
    // return res.status(200).redirect(`${process.env.FE_URL}` /NotRegisterAccount)
    return res.status(200).json({ message: "Not register account" });
  }
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
    expiresIn: 60 * 30 * 24,
  });

  const refresh_token = generateToken({
    payload: { id: user._id, role: user.role, userName: user.userName },
    expiresIn: 60 * 60 * 24 * 365,
  });

  return res
    .status(200)
    .json({ message: "User Login Successfully", access_token, refresh_token });
});
