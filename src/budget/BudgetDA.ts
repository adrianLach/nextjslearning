import { ObjectId } from 'mongodb'
import dbConnect from 'src/dbConnect'
import clientPromise from 'src/mongodb'
import { IBudget } from 'src/types'

const find = async (q?: {name?: string, id?: string}) => {

    await dbConnect()
    const client = await clientPromise

    if(!q){
        const documents = await client.db().collection('budget').find().toArray()
        return documents
    }
    else if(q.id) {
        const documents = await client.db().collection('budget').find({_id: new ObjectId(q.id)}).toArray()
        return documents
    }
    else if(q.name) {
        const documents = await client.db().collection('budget').find({name: q.name}).toArray()
        return documents
    }
    else {
        const documents = await client.db().collection('budget').find().toArray()
        return documents
    }

}

const save = async (budget: IBudget) => {

    await dbConnect()
    const client = await clientPromise

    const insert = await client.db().collection('budget').insertOne(budget)
    return insert
}

const update = async (id: string, budget: IBudget) => {

    await dbConnect()
    const client = await clientPromise

    const insert = await client.db().collection('budget').replaceOne({_id: new ObjectId(id)}, budget)
    return insert

}

const remove = async (id: string) => {

    await dbConnect()
    const client = await clientPromise

    const insert = await client.db().collection('budget').deleteOne({_id: new ObjectId(id)})
    return insert

}

export { find, save, update, remove }