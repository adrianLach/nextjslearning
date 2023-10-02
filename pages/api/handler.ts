import { NextApiRequest, NextApiResponse } from 'next'
import { find, remove, save, update } from 'src/booking/BookingDA'
import { IBooking } from 'src/types'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const body = JSON.parse(req.body) as IBooking
        console.log(body)

        if (!body.budgetId)
            return res.status(422).send({ errors: [{ error: 'Budget is required!' }] })

        if (!body.amount)
            return res.status(422).send({ errors: [{ error: 'Amount is required!' }] })

        if (!body.date)
            return res.status(422).send({ errors: [{ error: 'Date is required!' }] })

        const doc = await save(body)

        if (doc.acknowledged)
            return res.status(200).send({ status: `Booking created: _id: ${doc.insertedId}` })

    }

    if (req.method === 'PUT') {

        const { id, booking } = JSON.parse(req.body) as { id: string; booking: IBooking; }

        console.log({ id, booking })

        if (!booking._id)
            return res.status(422).send({ errors: [{ error: 'ID is required!' }] })

        const budgets = await find({ id: id })

        if (budgets.length === 0 || budgets === undefined)
            return res.status(422).send({ errors: [{ error: `Booking ${booking._id} does not exists!` }] })

        const doc = await update(id, booking)

        if (doc.acknowledged)
            return res.status(200).send({ status: `Booking updated: _id: ${doc.upsertedId}` })
    }

    if (req.method === 'DELETE') {

        const { id } = JSON.parse(req.body) as { id: string; }

        console.log({ id })

        if (!id)
            return res.status(422).send({ errors: [{ error: 'ID is required!' }] })

        const doc = await remove(id)

        if (doc.acknowledged)
            return res.status(200).send({ status: `Booking deleted: Count: ${doc.deletedCount}` })
    }

    return res.status(405).send({ errors: [{ error: `Method ${req.method} not supported!` }] })

}
