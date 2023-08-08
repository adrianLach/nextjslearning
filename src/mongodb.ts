// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri)
console.log('Connection created')
const clientPromise = client.connect()

export default clientPromise