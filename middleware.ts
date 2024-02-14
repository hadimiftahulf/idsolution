import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log(req.nextauth.token);
  },
  {
    secret: process.env.NEXT_KEY,
    callbacks: {
      authorized: ({ token }) => {
        // console.log("====");
        // console.log(token?.accessToken);
        if (!token) {
          return false;
        }
        return true;
      },
    },
  }
);

export const config = { matcher: ["/dashboard", "/employee", "/role"] };
