'use client'
import { setCredentialRequest } from '@/utils/axiosInstance'
import { MutationCache, Query, QueryCache, QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { AxiosError } from 'axios'
import { getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useRef, useState } from 'react'
import { toast } from 'react-toastify'

interface Props {
    children: ReactNode
}
export default function QueryProvider({ children }: Props) {
    const ref = useRef(0)
    const refQuery = useRef<Query<unknown, unknown, unknown, QueryKey>[]>([])

    const router = useRouter()
    const [queryClient] = useState(() => new QueryClient({
        queryCache: new QueryCache({
            async onError(error, query) {
                try {
                    var axiosEror: AxiosError = error as AxiosError
                    if (axiosEror.response?.status === 401) {
                        if (ref.current === 0) {
                            ref.current++
                            toast.error('Reautenthicated')
                            const getSessionServer = await getSession()
                            if (getSessionServer?.user === undefined || getSessionServer?.user.error === "RefreshAccessTokenError") {
                                toast.error("Please relogin")
                                signOut({ redirect: false }).then(() => {
                                    router.push('/')
                                })
                            } else {
                                setCredentialRequest({
                                    token: getSessionServer!.user.access_token!,
                                }).then(() => {
                                    query.fetch()
                                    refQuery.current.map((q) => q.fetch())
                                    ref.current = 0
                                })
                            }
                        } else {
                            refQuery.current.push(query)
                        }
                    }
                } catch (error) {
                    toast.error("Please relogin")
                    signOut({ redirect: false }).then(() => {
                        router.push('/')
                    })
                }
            },
        }),
        mutationCache: new MutationCache({
            async onError(error, variables, context, mutation) {
                try {
                    var axiosEror: AxiosError = error as AxiosError
                    if (axiosEror.response?.status === 401) {
                        const getSessionServer = await getSession()
                        if (getSessionServer?.user === undefined || getSessionServer?.user.error === "RefreshAccessTokenError") {
                            toast.error("Please relogin")
                            signOut({ redirect: false }).then(() => {
                                router.push('/')
                            })
                        } else {
                            setCredentialRequest({
                                token: getSessionServer!.user.access_token!,
                            })
                                .then(() => {
                                    mutation.execute(variables)
                                })
                        }
                    }
                } catch (error) {
                    toast.error("Please relogin")
                    signOut({ redirect: false }).then(() => {
                        router.push('/')
                    })
                }
            },
        }),
        defaultOptions: {
            queries: {
                retry: 0,
                gcTime: 0,
                staleTime: 0,
                networkMode: 'offlineFirst',
                refetchOnWindowFocus: false
            },
        }
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
                {children}
            </ReactQueryStreamedHydration>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
