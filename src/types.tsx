import { WithId } from 'mongodb'

export interface IBudget extends WithId<Document> {
    name: string,
    budgets: { name: string, amount: number }[],
    credit: boolean
}