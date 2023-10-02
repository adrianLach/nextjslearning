import { Card, CardBody, CardFooter, CardHeader, Center, Flex, Spacer, Table, TableContainer, Tbody, Thead, Tr } from '@chakra-ui/react'
import { ReactElement } from 'react'

export interface TableCardProps {
    title: ReactElement,
    th: ReactElement,
    trs: ReactElement,
    footerText?: ReactElement
}

const TableCard = (props: TableCardProps) => {

    return <Card variant={'outline'} height={'100%'} minWidth={'400px'}>
        <CardHeader>
            <Flex width={'100%'} justifyContent={'space-between'} minHeight={'32px'}>
                {props.title}
            </Flex>
        </CardHeader>
        <CardBody >
            <TableContainer>
                <Table variant={'striped'} size={'sm'}>
                    <Thead>
                        <Tr>
                            {props.th}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {props.trs}
                    </Tbody>
                </Table>
            </TableContainer>
        </CardBody>
        <CardFooter>
            <Flex w={'100%'}>
                <Spacer></Spacer>
                {props.footerText}
            </Flex>
        </CardFooter>
    </Card>
}

export default TableCard