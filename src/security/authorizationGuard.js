import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
} from "../auth/permissionMatrix.js";

import { AuthorizationError } from "./authorizationError.js";

export function requirePermission(user, module, action) {
  if (!user) {
    throw new AuthorizationError("Authentication required");
  }

  if (!hasPermission(user.role, module, action)) {
    throw new AuthorizationError(
      `Permission denied: ${module}.${action}`
    );
  }

  return true;
}

export function requireAnyPermission(user, module, actions = []) {
  if (!user) {
    throw new AuthorizationError("Authentication required");
  }

  if (!hasAnyPermission(user.role, module, actions)) {
    throw new AuthorizationError(
      `Permission denied: ${module}`
    );
  }

  return true;
}

export function requireAllPermissions(user, module, actions = []) {
  if (!user) {
    throw new AuthorizationError("Authentication required");
  }

  if (!hasAllPermissions(user.role, module, actions)) {
    throw new AuthorizationError(
      `Permission denied: ${module}`
    );
  }

  return true;
}
