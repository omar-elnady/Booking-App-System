import userModel from "../../../DB/modules/User.model.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const googleLogin = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  const googleResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!googleResponse.ok) {
    return next(new Error("Invalid Google Token", { cause: 401 }));
  }

  const payload = await googleResponse.json();
  const { email, name, picture, sub: googleId } = payload;

  let user = await userModel.findOne({ email });

  if (!user) {
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "";

    const userName = (firstName + lastName + Math.floor(Math.random() * 1000))
      .toLowerCase()
      .replace(/\s/g, "");

    user = await userModel.create({
      firstName,
      lastName,
      userName,
      email,
      password: "GOOGLE_AUTH_PLACEHOLDER_PASSWORD",
      provider: "google",
      googleId,
      confirmEmail: true,
      status: "active",
      userImage: { secure_url: picture },
    });
  } else {
    if (!user.googleId) {
      user.googleId = googleId;
      if (user.provider === "local") {
        user.provider = "google";
      }
      await user.save();
    }
  }

  // Check if user is blocked or inactive
  if (user.status === "blocked" || user.status === "inactive") {
    return next(
      new Error("Your account is not active. Please contact support.", {
        cause: 403,
      })
    );
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
    expiresIn: 60 * 60 * 24,
  });

  const refresh_token = generateToken({
    payload: { id: user._id, role: user.role },
    expiresIn: 60 * 60 * 24 * 365,
  });

  return res.status(200).json({
    message: "Login successful",
    access_token,
    refresh_token,
  });
});
