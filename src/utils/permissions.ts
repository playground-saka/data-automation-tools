export const checkPermission = (permission: string) => {
  const permissions = localStorage.getItem("permissions");
  if (permissions) {
    const parsedPermissions = JSON.parse(permissions) as string[];
    return parsedPermissions.includes(permission);
  }
  return false;
}

export const checkPermissionMiddleware = (
  permissions: string[],
  requiredPermission: string
): boolean => {
  const normalizedRequiredPermission = requiredPermission.trim().toLowerCase();

  // Ensure there's a strict match, and prevent incorrect partial matches
  return permissions.some((permission) => {
    const normalizedPermission = permission.trim().toLowerCase();
    return (
      normalizedPermission === normalizedRequiredPermission ||
      normalizedPermission.startsWith(`${normalizedRequiredPermission}.`)
    );
  });
};

export function getDynamicPermission(
  url: string,
  requiredPermissions: { [key: string]: string }
) {
  // Match against the dynamic pattern
  const dynamicPatterns = Object.keys(requiredPermissions).filter((pattern) =>
    pattern.includes(":")
  );

  for (const pattern of dynamicPatterns) {
    const regex = new RegExp(
      pattern.replace(/:[^\/]+/g, "([^/]+)") // Replace :dynamic segments with regex wildcards
    );
    const match = url.match(regex);

    if (match) {
      return requiredPermissions[pattern];
    }
  }

  // If no dynamic match is found, fall back to exact match
  return requiredPermissions[url];
}