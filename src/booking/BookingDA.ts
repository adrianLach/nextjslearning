import { ObjectId } from 'mongodb'
import dbConnect from 'src/dbConnect'
import clientPromise from 'src/mongodb'
import { IBooking } from 'src/types'

const find = async (q?: {id?: string}) => {

    await dbConnect()
    const client = await clientPromise

    if(!q){
        const documents = await client.db().collection('booking').find().toArray()
        return documents
    }
    else if(q.id) {
        const documents = await client.db().collection('booking').find({_id: new ObjectId(q.id)}).toArray()
        return documents
    }
    else {
        const documents = await client.db().collection('booking').find().toArray()
        return documents
    }

}

const save = async (booking: IBooking) => {

    await dbConnect()
    const client = await clientPromise

    const insert = await client.db().collection('booking').insertOne(booking)
    return insert
}

const update = async (id: string, booking: IBooking) => {

    await dbConnect()
    const client = await clientPromise

    const insert = await client.db().collection('booking').replaceOne({_id: new ObjectId(id)}, booking)
    return insert

}

const remove = async (id: string) => {

    await dbConnect()
    const client = await clientPromise

    const insert = await client.db().collection('booking').deleteOne({_id: new ObjectId(id)})
    return insert

}

export { find, save, update, remove }