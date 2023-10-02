import { WithId } from 'mongodb'

export interface IBudget extends WithId<Document> {
    name: string
    budgets: { name: string, amount: number }[]
    credit: boolean
}

export interface IBooking extends WithId<Document> {
    budgetId: string
    budgetName?: string
    amount: number
    date: Date
    notes: string
}