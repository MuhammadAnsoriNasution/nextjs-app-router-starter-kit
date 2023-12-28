import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"



declare module "next-auth" {
    interface User extends DefaultUser {
        access_token: string,
        refresh_token?: string,
        expires: number,
    }

    interface Session extends DefaultSession {
        user: {
            access_token: string,
            refresh_token?: string,
            expires: number,
            error?: "RefreshAccessTokenError",
        },
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        access_token: string,
        refresh_token?: string,
        expires: number,
        error?: "RefreshAccessTokenError",
    }
}