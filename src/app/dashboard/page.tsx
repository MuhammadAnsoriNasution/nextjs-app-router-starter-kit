'use client'
import { getProfileService } from '@/service/auth'
import { useQuery } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
    const router = useRouter()
    const logout = async () => {
        await signOut({ redirect: false })
        router.replace('/')
    }

    const query = useQuery({
        queryFn: getProfileService,
        queryKey: ['profile']
    })

    return (
        <div className=' min-h-screen w-screen flex justify-center items-center flex-col gap-3'>

            <h1 className=' font-bold text-4xl'>Halo: {query.data?.data.email}</h1>
            <button className=' bg-sky-500 px-40 py-2 rounded-md' onClick={logout}>Logout</button>
        </div>
    )
}
