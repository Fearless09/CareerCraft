import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.isAdmin === true;

    // If the path is /admin or /api/admin, require isAdmin
    const path = req.nextUrl.pathname;
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      if (!isAdmin) {
        if (path.startsWith("/api/")) {
          return new NextResponse(
            JSON.stringify({ error: "Unauthorized: Admin access required" }),
            { status: 403, headers: { "Content-Type": "application/json" } },
          );
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
