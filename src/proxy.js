import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
 const privetRoutes = [
    "/privet",
    "/dashboard",
    "/secret"
 ]
// This function can be marked `async` if using `await` inside
export async function proxy(req) {
const token = await getToken({req});
// console.log("totke", token.role)

const reqPath = req.nextUrl.pathname;
const isAuthenticated =Boolean(token)
const isUser = token?.role === "user";
const isPrivate = privetRoutes.some(route => reqPath.startsWith(route));

if (!isAuthenticated && isPrivate) {
const loginUrl = new URL("/api/auth/signin", req,null);
loginUrl.searchParams.set("callback")
return NextResponse.redirect(loginUrl);
}


console.log({isAuthenticated, isUser, reqPath, isPrivate})
//   return NextResponse.redirect(new URL('/home', request.url))
return NextResponse.next();
}
 
// Alternatively, you can use a default export:
// export default function proxy(request) { ... }
 
export const config = {
  matcher: ["/privet/:path*", "/dashboard/:path*", "/secret/:path*"]
}