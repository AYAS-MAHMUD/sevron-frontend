import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/axios/jwtUtils";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/axios/authUtils";
import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from "./services/auth.service";
import { isTokenExpiringSoon } from "./lib/tokenUtils";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  console.log(request);
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

    if (
      isValidAccesstoken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken))
    ) {
      const requestHeaders = new Headers(request.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);

        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }

    if (isAuth && isValidAccesstoken) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      if (accessToken && email) {
        const userInfo = await getUserInfo();

        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }
    }

    if (routeOwner === null) {
      return NextResponse.next();
    }

    if (!accessToken || !isValidAccesstoken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (accessToken) {
      const userInfo = await getUserInfo();

      if (userInfo) {
        
        // need email verification scenario
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }

          return NextResponse.next();
        }

        if (userInfo.emailVerified && pathname === "/verify-email") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }

        // need password change scenario
        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }

          return NextResponse.next();
        }

        if (!userInfo.needPasswordChange && pathname === "/reset-password") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }
    }




    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }

    if (
      routeOwner === "ADMIN" ||
      routeOwner === "DOCTOR" ||
      routeOwner === "PATIENT"
    ) {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
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
