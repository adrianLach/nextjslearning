import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Divider, Flex, FormControl, FormHelperText, FormLabel, IconButton, Input, Spacer, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IBudget } from 'src/types'

const BudgetView = () => {

    const currency = (num: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num)
    }

    const [rows, setRows] = useState<{ name: string, amount: number }[]>()

    const [name, setName] = useState('')

    const [credit, setCredit] = useState(false)

    const [budgetName, setBudgetName] = useState('')
    const [amount, setAmount] = useState(0)

    const [deleteName, setDeleteName] = useState('')

    const router = useRouter()

    const getRowIndex = (n: string) => {
        if (!rows)
            return -1

        const el = rows.find((e) => e.name === n)

        if (!el)
            return -1

        return rows.indexOf(el)
    }

    const addRow = () => {

        if (budgetName === '' || amount === 0)
            return

        if (!rows) {
            setRows([{ name: budgetName, amount }])
        }
        else {
            if (getRowIndex(budgetName) >= 0)
                return
            setRows([...rows, { name: budgetName, amount }])
        }

        setBudgetName('')
        setAmount(0)
    }

    const save = async () => {
        const res = await fetch('/api/budgets', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                budgets: rows,
                credit: credit
            } as IBudget)
        })

        if (res.ok) {
            router.push('/budgets')
        }
    }

    useEffect(() => {
        if (!rows || deleteName === '')
            return

        const ind = getRowIndex(deleteName)
        const _rows = rows
        _rows.splice(ind, 1)
        setRows(_rows)
        setDeleteName('')
    }, [deleteName])

    const canSave = rows !== undefined && rows.length > 0 && name !== ''
    const canAddRow = budgetName !== '' && amount !== 0

    return (
        <Stack>
            <Card variant={'outline'}>
                <CardHeader>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={name} onChange={(e) => setName(e.target.value)} type='text' />
                        <FormHelperText>This is the name for your Budget</FormHelperText>
                    </FormControl>
                    <FormControl w={'100%'}>
                        <Flex>
                            <Spacer></Spacer>
                            <Checkbox checked={credit} onChange={() => setCredit(!credit)}>Credit Account</Checkbox>
                        </Flex>
                    </FormControl>
                </CardHeader>
                <CardBody>
                    <TableContainer>
                        <Table variant={'striped'} size={'sm'}>
                            <Thead>
                                <Tr>
                                    <Th>Budget</Th>
                                    <Th isNumeric>Amount</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {rows && rows.map((e, i) => {
                                    return (<>
                                        <Tr>
                                            <Td key={e.name}>{e.name}</Td>
                                            <Td isNumeric key={i}>{currency(e.amount)}</Td>
                                            <Td isNumeric>
                                                <IconButton
                                                    onClick={() => setDeleteName(e.name)}
                                                    icon={<CloseIcon />}
                                                    size={'sm'}
                                                    variant='solid'
                                                    colorScheme='red'
                                                    aria-label='' />
                                            </Td>
                                        </Tr>
                                    </>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <Divider></Divider>
                    <Stack>
                        <Flex gap={1}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input value={budgetName} onChange={(e) => setBudgetName(e.target.value)} type='text' />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Amount</FormLabel>
                                <Input value={amount == 0 ? '' : amount} onChange={(e) => setAmount(+e.target.value)} type='number' />
                            </FormControl>
                        </Flex>
                        <Button colorScheme='green' onClick={addRow} isDisabled={!canAddRow}>Add</Button>
                    </Stack>
                </CardBody>
                <CardFooter>
                    <Flex w={'100%'} gap={1}>
                        <Button leftIcon={<DeleteIcon />} variant='solid' colorScheme='red' isDisabled>
                            Delete
                        </Button>
                        <Spacer></Spacer>
                        <Button leftIcon={<CheckIcon />} variant='solid' colorScheme='green' isDisabled={!canSave} onClick={() => save()}>
                            Save
                        </Button>
                        <Link href={'/budgets'}>
                            <Button leftIcon={<CloseIcon />} variant='solid' colorScheme='orange'>
                                Cancel
                            </Button>
                        </Link>
                    </Flex>
                </CardFooter>
            </Card>
        </Stack >
    )
}

export default BudgetView
