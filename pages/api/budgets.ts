import { NextApiRequest, NextApiResponse } from 'next'
import { find, remove, save, update } from 'src/budget/BudgetDA'
import { IBudget } from 'src/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const body = JSON.parse(req.body) as IBudget
        console.log(body)

        if(!body.name)
            return res.status(422).send({errors: [{error: 'Name is required!'}]})

        if(!body.budgets)
            return res.status(422).send({errors: [{error: 'At least one budget is required!'}]})
    
        const budget = await find({name: body.name})
    
        if (budget.length !== 0)
            return res.status(422).send({errors: [{error: `Budget ${body.name} already exists!`}]})
    
        const doc = await save(body)

        if (doc.acknowledged)
            return res.status(200).send({status: `Budget created: _id: ${doc.insertedId}`})
        
    }

    if (req.method === 'PUT') {
        
        const {id, budget} = JSON.parse(req.body) as {id: string, budget: IBudget}

        console.log({id, budget})

        if(!budget.name)
            return res.status(422).send({errors: [{error: 'Name is required!'}]})

        if(!budget.budgets)
            return res.status(422).send({errors: [{error: 'At least one budget is required!'}]})
    
        const budgets = await find({id: id})
    
        if (budgets.length === 0 || budgets === undefined)
            return res.status(422).send({errors: [{error: `Budget ${budget.name} does not exists!`}]})
    
        const doc = await update(id, budget)

        if (doc.acknowledged)
            return res.status(200).send({status: `Budget updated: _id: ${doc.upsertedId}`})
    }

    if (req.method === 'DELETE') {
        
        const {id} = JSON.parse(req.body) as {id: string}

        console.log({id})

        if(!id)
            return res.status(422).send({errors: [{error: 'ID is required!'}]})

        const doc = await remove(id)

        if (doc.acknowledged)
            return res.status(200).send({status: `Budget deleted: Count: ${doc.deletedCount}`})
    }

    return res.status(405).send({errors: [{error: `Method ${req.method} not supported!`}]})

}