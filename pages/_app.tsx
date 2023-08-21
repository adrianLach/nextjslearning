import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from 'components/Layout'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <ChakraProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </SessionProvider>
    )
}