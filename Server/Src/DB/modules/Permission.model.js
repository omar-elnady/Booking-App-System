import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
  {
    rolePermissions: {
      type: Map,
      of: [String],
      default: {
        "super-admin": [
          "/dashboard",
          "/users",
          "/events",
          "/bookings",
          "/categories",
          "/roles",
          "/profile",
          "/security",
        ],
        admin: [
          "/dashboard",
          "/events",
          "/categories",
          "/profile",
          "/security",
        ],
        organizer: [
          "/dashboard",
          "/events",
          "/bookings",
          "/profile",
          "/security",
        ],
        user: ["/dashboard", "/bookings", "/profile", "/security"],
      },
    },
  },
  { timestamps: true }
);

export default model("Permission", permissionSchema);
