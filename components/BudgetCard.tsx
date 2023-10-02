import { CheckIcon, EditIcon } from '@chakra-ui/icons'
import { Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Input, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import { IBudget } from 'src/types'

export interface BudgetCardProps {
    budget: IBudget,
}

const BudgetCard = (props: BudgetCardProps) => {

    const [isEditMode, setEditMode] = useState(false)
    const [name, setName] = useState(props.budget.name)
    const [rows, setRows] = useState<{ name: string, amount: number }[]>(props.budget.budgets)
    const [credit, setCredit] = useState(props.budget.credit)

    const [budgetName, setBudgetName] = useState('')
    const [amount, setAmount] = useState(0)

    const [deleteName, setDeleteName] = useState('')

    const currency = (num: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num)
    }

    return <Card variant={'outline'} height={'100%'} minWidth={'400px'}>
        <CardHeader>
            <Flex width={'100%'} justifyContent={'space-between'} minHeight={'32px'}>
                {!isEditMode &&
                    <>
                        <Heading size={'md'}>{props.budget.name}</Heading>
                        {props.budget &&
                            <IconButton
                                aria-label='Search database'
                                size={'sm'}
                                onClick={() => setEditMode(true)}
                                icon={<EditIcon />} />
                        }
                    </>
                }
                {isEditMode &&
                    <>
                        <Input value={name} onChange={(e) => setName(e.target.value)} size={'sm'} type='text' />
                        <IconButton
                            aria-label='Search database'
                            size={'sm'}
                            onClick={() => setEditMode(false)}
                            icon={<CheckIcon />} />
                    </>
                }
            </Flex>
        </CardHeader>
        <CardBody >
            <TableContainer>
                <Table variant={'striped'} size={'sm'}>
                    <Thead>
                        <Tr>
                            <Th>Description</Th>
                            <Th isNumeric>Amount</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {props.budget.budgets && props.budget.budgets.map(((e, i) => (
                            <Tr key={i}>
                                <Td>{e.name}</Td>
                                <Td isNumeric>{currency(e.amount)}</Td>
                            </Tr>
                        )))}
                    </Tbody>
                </Table>
            </TableContainer>
        </CardBody>
        <CardFooter>
            <Flex w={'100%'}>
                <Spacer></Spacer>
                <Text as={'b'}>{'Total: ' + currency(props.budget.budgets?.reduce((a, b) => a + b.amount, 0) || 0)}</Text>
            </Flex>
        </CardFooter>
    </Card >
}

export default BudgetCard