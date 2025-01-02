import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;
const protectedRoutes = ["/dashboard", "/profile", "/report/daily-report", "/user"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  console.log("Token:", request.nextUrl.pathname);

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Kiểm tra nếu route cần bảo vệ
  console.log(token, request.nextUrl.pathname.startsWith("/login"));

  // Nếu người dùng đã đăng nhập và cố truy cập /login, chuyển hướng sang dashboard
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    console.log("Redirect from /login to / because user already logged in");
    //return NextResponse.redirect(new URL("/report/daily-report", request.url));
  }

  // Nếu người dùng chưa đăng nhập và cố truy cập route bảo vệ, chuyển hướng sang login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Cấu hình matcher để bảo vệ các route động
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    ...protectedRoutes,
  ],
};
