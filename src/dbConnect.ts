import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

async function dbConnect() {

    const promise = mongoose.connect(MONGODB_URI || '').then(mongoose => {
        return mongoose
    })

    const conn = await promise
    return conn
}

export default dbConnect