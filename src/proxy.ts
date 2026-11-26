import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/axios/jwtUtils";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/axios/authUtils";

export async function proxy(request: NextRequest) {
  console.log(request)
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const decodedAccesstoken =
      accessToken &&
      verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;
    const isValidAccesstoken =
      accessToken &&
      verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

    let userRole: UserRole | null = null;

    if (decodedAccesstoken) {
      userRole = decodedAccesstoken.role as UserRole;
    }
    const routeOwner = getRouteOwner(pathname);

    const utifySuperAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
    userRole = utifySuperAdminRole;
    const isAuth = isAuthRoute(pathname);
    if (isAuth && isValidAccesstoken) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    if(routeOwner === null){
        return NextResponse.next();
    }

    if(!accessToken || !isValidAccesstoken){
        const loginUrl = new URL("/login",request.url);
        loginUrl.searchParams.set("redirect",pathname);
        return NextResponse.redirect(loginUrl)
    }
    if(routeOwner === "COMMON"){
        return NextResponse.next();

    }

    if(routeOwner === "ADMIN" || routeOwner === "DOCTOR" || routeOwner === "PATIENT"){
        if(routeOwner !== userRole){
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole),request.url));
            
        }
    }

    return NextResponse.next();


  } catch (error) {}
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
