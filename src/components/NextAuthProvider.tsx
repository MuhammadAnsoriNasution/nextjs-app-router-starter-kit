'use client'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function NextAuthProvider({ children }: Props) {
    return (
        <SessionProvider refetchOnWindowFocus={false}>
            {children}
        </SessionProvider>
    )
}
