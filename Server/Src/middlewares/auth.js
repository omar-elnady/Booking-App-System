import userModel from "../DB/modules/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};
export const auth = (accessRoles = []) => {
  const bearerKey = process.env.BEARER_KEY;
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      console.log(authorization)
      return next(new Error("In-valid Bearer Key", { cause: 400 }));
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return next(new Error("In-valid token", { cause: 400 }));
    }
    const decoded = verifyToken({ token });
    return console.log(decoded);
    if (!decoded?.id) {
      return next(new Error ("In-valid token payload", { cause: 400 }));
    }
    const user = await userModel
      .findById(decoded.id)
      .select("userName email image role changePasswordTime ");
    if (!user) {
      return next(new Error("Not register user", { cause: 401 }));
    }
    if (parseInt(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
      return next(new Error("Expired token", { cause: 400 }));
    }

    if (!accessRoles.includes(user.role)) {
      return next(new Error("Not authorized user", { cause: 403 }));
    }
    req.user = user;
    return next();
  });
};
