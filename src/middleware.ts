import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req, res) {
        if (req.nextUrl.pathname === '/' && req.nextauth.token?.access_token !== undefined) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        } else if (req.nextUrl.pathname.startsWith('/dashboard') && req.nextauth.token?.access_token === undefined) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: () => true,
        }
    }
)


export const config = {
    matcher: [
        '/dashboard/:path*', '/'
    ],
}