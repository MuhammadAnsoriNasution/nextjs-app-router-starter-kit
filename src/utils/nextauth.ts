import { loginService, refreshTokenService } from "@/service/auth";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: 'credentials',
            type: "credentials",
            credentials: {
                email: { label: "email", type: "email", required: true },
                password: { label: "password", type: "text", required: true },
            },
            async authorize(credentials, req) {
                try {
                    const response = await loginService({
                        email: credentials!.email,
                        password: credentials!.password,
                    })

                    var expires_in = new Date();
                    expires_in.setMinutes(expires_in.getMinutes() + response.expires_in);
                    return {
                        id: '',
                        access_token: response.access_token,
                        refresh_token: response.refresh_token,
                        expires: expires_in.getTime(),
                        email: credentials!.email,
                    }
                } catch (error: any) {
                    console.log(error)
                    throw new Error(JSON.stringify({
                        statusCode: error.response.status,
                        data: error.response.data
                    }))
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            var sekarang = new Date();
            if (trigger === "update") {
                token.access_token = session.access_token
                token.refresh_token = session.refresh_token
                token.email = session.email
                var expires_in = new Date();
                expires_in.setMinutes(expires_in.getMinutes() + parseInt(session.expires_in));
                token.expires = expires_in.getTime()
                return token
            } else if (user) {
                token.access_token = user.access_token
                token.refresh_token = user.refresh_token
                token.expires = user.expires
                token.email = user.email
                return token
            } else if (sekarang.getTime() < token.expires) {
                return token
            } else {
                try {
                    const response = await refreshTokenService({ refresh_token: token.refresh_token!, email: token.email!, token: token.access_token! })
                    var expires_in = new Date();
                    expires_in.setMinutes(expires_in.getMinutes() + response.expires_in);
                    return {
                        access_token: response.access_token,
                        refresh_token: response.refresh_token,
                        expires: expires_in.getTime(),
                        email: token.email
                    }
                } catch (error: any) {
                    return { ...token, error: "RefreshAccessTokenError" as const }
                }
            }
        },
        async session({ session, token, user }) {
            session.user = token
            return session
        }
    }
}