// Role constants
export const ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  ORGANIZER: "organizer",
  USER: "user",
  GUEST: "guest",
};

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.ORGANIZER]: 2,
  [ROLES.USER]: 1,
  [ROLES.GUEST]: 0,
};

/**
 * Check if user has a specific role
 */
export const hasRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

/**
 * Check if user has at least the required role level
 */
export const hasMinimumRole = (userRole, minimumRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= requiredLevel;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (userRole, allowedRoles = []) => {
  return allowedRoles.includes(userRole);
};

/**
 * Get dashboard route based on role
 */
export const getDashboardRoute = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "/super-admin/dashboard";
    case ROLES.ADMIN:
      return "/admin/dashboard";
    case ROLES.ORGANIZER:
      return "/organizer/dashboard";
    case ROLES.USER:
      return "/user/dashboard";
    default:
      return "/";
  }
};

/**
 * Check if route is accessible by role
 */
export const canAccessRoute = (route, userRole) => {
  if (route.startsWith("/super-admin")) {
    return hasRole(userRole, ROLES.SUPER_ADMIN);
  }
  if (route.startsWith("/admin")) {
    return hasAnyRole(userRole, [ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  }
  if (route.startsWith("/organizer")) {
    return hasAnyRole(userRole, [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.ORGANIZER,
    ]);
  }
  if (route.startsWith("/user")) {
    return hasAnyRole(userRole, [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.ORGANIZER,
      ROLES.USER,
    ]);
  }
  return true; // Public routes
};
