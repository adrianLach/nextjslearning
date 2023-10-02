import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import TwitchProvider from 'next-auth/providers/twitch'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '../../../src/mongodb'
import User from 'next-auth'
import bcrypt from 'bcrypt'
import dbConnect from 'src/dbConnect'

export const authOptions = {
    // Configure one or more authentication providers
    session: {
        strategy: 'jwt'
    },
    debug: true,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: 'E-Mail', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Add logic here to look up the user from the credentials supplied
                console.log(credentials)

                if(!credentials?.email)
                    return null

                if(!credentials?.password)
                    return null

                await dbConnect()
                const client = await clientPromise
                const user = await client.db().collection('users').findOne({email: credentials.email})
                
                if(!user)
                    return null
            
                user.id = user._id.toString()

                if (await bcrypt.compare(credentials.password, user.hash)) {
                // Any object returned will be saved in `user` property of the JWT
                    return user as User
                } else {
                // If you return null then an error will be displayed advising the user to check their details.
                    return null
        
                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        TwitchProvider({
            clientId: process.env.TWITCH_ID || '',
            clientSecret: process.env.TWITCH_SECRET || '',
            authorization: { params: { scope: 'openid user:read:email channel:moderate chat:read chat:edit moderator:manage:banned_users' } }
        }),
    ],
    callbacks: {
        async jwt({token,user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        session: async (session: { user: { id: string } }, token: { id: string }) => {
            if (session?.user) {
                session.user.id = token.id
            }
            return session
        },
    },
    adapter: MongoDBAdapter(clientPromise),
}

export default NextAuth(authOptions)