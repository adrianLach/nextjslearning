import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { Session } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import TwitchProvider from 'next-auth/providers/twitch'
import clientPromise from '../../../src/mongodb'
import User from 'next-auth'

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        TwitchProvider({
            clientId: process.env.TWITCH_ID || '',
            clientSecret: process.env.TWITCH_SECRET || '',
        }),
    ],
    callbacks: {
        session: async ({ session, user }: {
            session: Session
            token: unknown
            user: User
        }) => {
            if (session?.user) {
                session.user.id = user.id
            }
            return session
        },
    },
    adapter: MongoDBAdapter(clientPromise),
}

export default NextAuth(authOptions)