import { Button, Flex, Spacer, Stack, Td, Th, Tr } from '@chakra-ui/react'
import { PlusSquareIcon } from '@chakra-ui/icons'
import TableCard from 'components/TableCard'

const Test = () => {

    const currency = (num: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num)
    }

    return (
        <>
            <Stack>
                <Stack direction={'row'}>
                    <Flex w={'100%'}>
                        <Spacer></Spacer>
                        <Button leftIcon={<PlusSquareIcon />} variant='ghost'>
                            New
                        </Button>
                    </Flex>
                </Stack>
                <TableCard
                    title='Income'
                    th={<><Th>Description</Th><Th isNumeric>Amount</Th></>}
                    trs={
                        <>
                            <Tr>
                                <Td>Salary</Td>
                                <Td isNumeric>{currency(2050)}</Td>
                            </Tr>
                            <Tr>
                                <Td>Papa</Td>
                                <Td isNumeric>{currency(400)}</Td>
                            </Tr>
                        </>
                    }
                    footerText={'Total: ' + currency(2450)}
                />
                <TableCard
                    title='Apartment'
                    th={<><Th>Description</Th><Th isNumeric>Amount</Th></>}
                    trs={
                        <>
                            <Tr>
                                <Td>Rent</Td>
                                <Td isNumeric>{currency(958.44)}</Td>
                            </Tr>
                            <Tr>
                                <Td>Electricity</Td>
                                <Td isNumeric>{currency(53)}</Td>
                            </Tr>
                            <Tr>
                                <Td>Internet Provider</Td>
                                <Td isNumeric>{currency(59.70)}</Td>
                            </Tr>
                            <Tr>
                                <Td>ARD</Td>
                                <Td isNumeric>{currency(18.36)}</Td>
                            </Tr>
                        </>
                    }
                    footerText={'Total: ' + currency(1089.50)}
                />
            </Stack>
        </>
    )
}

export default Test