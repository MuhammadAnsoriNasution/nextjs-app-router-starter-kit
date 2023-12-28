'use client'
import { setCredentialRequest } from '@/utils/axiosInstance'
import { useSession } from 'next-auth/react'
import React, { ReactNode, useEffect, useState } from 'react'

interface Props {
    children: ReactNode
}

export default function Layout({ children }: Props) {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user.access_token !== undefined) {
            setCredentialRequest({ token: session.user.access_token }).then(() => setLoading(false))
        }
    }, [session])

    if (loading) {
        return <span>Loading...</span>
    }
    return children
}
