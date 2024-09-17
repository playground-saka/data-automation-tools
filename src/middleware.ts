import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkPermissionMiddleware, getDynamicPermission } from "./utils/permissions";

export function middleware(request: NextRequest) {
  
  const token = request.cookies.get("auth.token")?.value || null;
  const userPermissions = request.cookies.get("auth.permissions");
  const permissions = userPermissions ? JSON.parse(userPermissions.value) : [];
  const url = request.nextUrl.pathname;

  const { pathname } = request.nextUrl;
  console.log(`Requested URL: ${pathname}`);
  console.log(`User Permissions: ${JSON.stringify(permissions)}`);

  if (pathname === "/login" && request.cookies.has("auth.token") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    if (
      (!request.cookies.has("auth.token") && pathname !== "/login") ||
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    if(!(["/", "/login", "/dashboard", "/403"].includes(pathname))){
      
      // Cek apakah ada permission yang sesuai
      const requiredPermissions: { [key: string]: string } = {
        "/master/user": "master.user.",
        "/master/logsheet": "master.logsheet.",
        "/master/logsheet/upload/:type/:id": "master.logsheet.upload",
        "/master/formula": "master.formula.",
        "/master/pelanggan": "master.pelanggan.",
        "/master/kategori": "master.kategori.",
        "/analisis-data/selisih": "analisis_data.selisih.",
        "/analisis-data/selisih/:id": "analisis_data.selisish.view",
        "/acl/role": "acl.role.",
      };
  
      const requiredPermission = getDynamicPermission(url, requiredPermissions);      
      
      // Jika tidak ada permission yang sesuai, redirect ke halaman 403
      if (!requiredPermission || !checkPermissionMiddleware(permissions, requiredPermission)) {
        return NextResponse.redirect(new URL("/403", request.url)); // Redirect ke halaman 403 Forbidden
      }
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/","/login", "/dashboard/:path*", "/master/:path*","/analisis-data/:path*", "/acl/:path*"],
};
