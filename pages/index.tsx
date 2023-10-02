import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Card, CardBody, CardFooter, Flex, FormControl, FormLabel, Input, Select, Stack } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import { find } from 'src/budget/BudgetDA'
import { IBooking, IBudget } from 'src/types'

export const getServerSideProps: GetServerSideProps = async () => {

    const docs = await find()

    return {
        props: {
            budgets: JSON.stringify(docs)
        }
    }

}
const Index = (props: { budgets: string }) => {

    const budgets = JSON.parse(props.budgets) as IBudget[]

    const [selectedBudgetId, setSelectedBudgetId] = useState('')
    const [selectedBudget, setSelectedBudget] = useState<IBudget>()
    const [selectedSubBudget, setSelectedSubBudget] = useState('')

    const [amount, setAmount] = useState(0)

    const [date, setDate] = useState('')

    useEffect(() => {

        setSelectedBudget(budgets.find((e) => e._id.toString() === selectedBudgetId))

    }, [selectedBudgetId])

    useEffect(() => {

        setSelectedSubBudget('')

    }, [selectedBudget])

    useEffect(() => {
        selectedBudget && setAmount(selectedBudget.budgets.find(e => e.name == selectedSubBudget)?.amount || 0)
    }, [selectedSubBudget])

    const save = async () => {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            body: JSON.stringify({
                budgetId: selectedBudgetId,
                budgetName: selectedSubBudget,
                amount: amount,
                date: new Date(Date.parse(date))
            } as IBooking)
        })
    }

    const canSave = selectedBudget !== undefined && selectedSubBudget !== '' && amount !== 0 && date !== ''

    return (
        <>
            <Stack>
                <Accordion allowToggle defaultIndex={[0]}>
                    <AccordionItem>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                                Add New Booking
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Card variant={'outline'}>
                                <CardBody>
                                    <FormControl>
                                        <FormLabel>Budget</FormLabel>
                                        <Select placeholder='Select a budget' value={selectedBudgetId} onChange={(e) => setSelectedBudgetId(e.target.value)}>
                                            {budgets && budgets.map((e, i) => <option key={i} value={e._id.toString()}>{e.name}</option>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Sub Budget</FormLabel>
                                        <Select placeholder='Select a sub budget' isDisabled={!selectedBudget} value={selectedSubBudget} onChange={(e) => setSelectedSubBudget(e.target.value)}>
                                            {selectedBudget && selectedBudget.budgets.map((e, i) => <option key={i} value={e.name}>{e.name}</option>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date</FormLabel>
                                        <Input placeholder="Select Date and Time" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Amount</FormLabel>
                                        <Input value={amount == 0 ? '' : amount} onChange={(e) => setAmount(+e.target.value)} type='number' />
                                    </FormControl>
                                </CardBody>
                                <CardFooter>
                                    <Flex w={'100%'}>
                                        <Button w={'100%'} colorScheme='green' isDisabled={!canSave} onClick={() => save()}>Save Booking</Button>
                                    </Flex>
                                </CardFooter>
                            </Card>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Stack>
        </>
    )
}

export default Index