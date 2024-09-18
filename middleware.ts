import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    // If the user is authenticated and trying to access the login page,
    // redirect them to the home page
    if (req.nextUrl.pathname === "/signin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
    // For all other routes, allow the request to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/signin',
    },
  }
)

export const config = {
  matcher: ['/a/((?!api|_next/static|_next/image|favicon.ico).*)'],
}