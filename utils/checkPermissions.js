import { UnauthenticatedError } from "../errors/index.js";

export const checkPermissions = (reqUser, resourceUserId) => {
  // ** we do not have roles right now, but users with 'admin' role will be allowed to have master access
  // if (reqUser.role === "admin") return;
  if (reqUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError("Not authorized to access this");
};
