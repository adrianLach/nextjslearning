import { PlusSquareIcon } from '@chakra-ui/icons'
import { Button, Flex, Heading, Spacer, Stack, Td, Text, Th, Tr } from '@chakra-ui/react'
import TableCard from 'components/TableCard'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { find } from 'src/budget/BudgetDA'
import { IBudget } from 'src/types'

const BudgetView = (props: { data: string }) => {

    const data = JSON.parse(props.data) as IBudget[]

    const currency = (num: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num)
    }

    const budgetsNegative = data.filter(e => !e.credit).map((e) => { return { name: e.name, amount: e.budgets?.reduce((a, b) => a + b.amount, 0) || 0 } })
    const budgetsPositive = data.filter(e => e.credit).map((e) => { return { name: e.name, amount: e.budgets?.reduce((a, b) => a + b.amount, 0) || 0 } })

    const difference = budgetsPositive.reduce((a, b) => a + b.amount, 0) - budgetsNegative.reduce((a, b) => a + b.amount, 0)

    return (
        <Stack>
            <Stack direction={'row'}>
                <Flex w={'100%'}>
                    <Spacer></Spacer>
                    <Link href={'/budgets/new'}>
                        <Button leftIcon={<PlusSquareIcon />} variant='ghost'>
                            New
                        </Button>
                    </Link>
                </Flex>
            </Stack>
            <TableCard
                title={<Heading size={'md'}>Total</Heading>}
                th={
                    <>
                        <Td>Budget</Td>
                        <Td isNumeric>Amount</Td>
                        <Td isNumeric>Total</Td>
                    </>}
                trs={
                    <>
                        {budgetsPositive.map((e, i) => {
                            return (
                                <Tr key={i}>
                                    <Td>{e.name}</Td>
                                    <Td isNumeric color={'green'}>{currency(e.amount)}</Td>
                                    <Td isNumeric color={'green'}></Td>
                                </Tr>
                            )
                        })}
                        {budgetsPositive &&
                            <Tr>
                                <Td><Text as={'b'}>Credit Total</Text></Td>
                                <Td isNumeric color={'green'}></Td>
                                <Td isNumeric color={'green'}><Text as={'b'}>{currency(budgetsPositive.reduce((a, b) => a + b.amount, 0))}</Text></Td>
                            </Tr>
                        }
                        {budgetsNegative.map((e, i) => {
                            return (
                                <Tr key={i}>
                                    <Td>{e.name}</Td>
                                    <Td isNumeric color={'red'}>{currency(e.amount)}</Td>
                                    <Td isNumeric color={'red'}></Td>
                                </Tr>
                            )
                        })}
                        {budgetsNegative &&
                            <Tr>
                                <Td><Text as={'b'}>Budget Total</Text></Td>
                                <Td isNumeric color={'red'}></Td>
                                <Td isNumeric color={'red'}><Text as={'b'}>{currency(budgetsNegative.reduce((a, b) => a + b.amount, 0))}</Text></Td>
                            </Tr>
                        }
                        {budgetsNegative && budgetsPositive &&
                            <Tr>
                                <Td><Text as={'b'}>Difference</Text></Td>
                                <Td isNumeric color={'red'}></Td>
                                <Td isNumeric color={difference >= 0 ? 'green' : 'red'}><Text as={'b'}>{currency(difference)}</Text></Td>
                            </Tr>
                        }
                    </>
                }
            />
            {data.map((e, i) => (
                <>
                    <TableCard key={i}
                        title={<Link href={`/budgets/${e.name}`}><Heading size={'md'}>{e.name}</Heading></Link>}
                        th={<><Th>Description</Th><Th isNumeric>Amount</Th></>}
                        trs={
                            <>
                                {e.budgets && e.budgets.map(((e, i) => (
                                    <Tr key={i}>
                                        <Td>{e.name}</Td>
                                        <Td isNumeric>{currency(e.amount)}</Td>
                                    </Tr>
                                )))}
                            </>
                        }
                        footerText={<Text>{'Total: ' + currency(e.budgets?.reduce((a, b) => a + b.amount, 0) || 0)}</Text>}
                    />
                </>
            ))}
        </Stack>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {

    const docs = await find()

    return {
        props: {
            data: JSON.stringify(docs)
        }
    }

}

export default BudgetView
