import { Card, CardBody, CardFooter, CardHeader, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { WithId } from 'mongodb'
import { GetServerSideProps } from 'next'
import dbConnect from 'src/dbConnect'
import clientPromise from 'src/mongodb'

const TableView = (props: {table: string, data: string}) => {

    const data = JSON.parse(props.data) as WithId<Document>[]

    return (
        <>
            <Card>
                <CardHeader>
                    <Heading size='md'>Client Report</Heading>
                </CardHeader>
                <CardBody overflow={'scroll'} maxH={'400'}>
                    <TableContainer>
                        <Table variant={'striped'} size={'sm'}>
                            <Thead>
                                <Tr>
                                    {Object.keys(data[0]).map((e) => <Th key={e}>{e}</Th>)}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map(e => <Tr key={e._id.toString()}>
                                    {Object.keys(e).map((c) => <Td key={c}>{e[c]}</Td>)}
                                </Tr>)}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </CardBody>

                <CardFooter>
                    <Text>Table Contents for <b>{props.table}</b></Text>
                </CardFooter>
            </Card>
        </>
    )
}

export default TableView

export const getServerSideProps: GetServerSideProps = async (context) => {

    await dbConnect()
    const client = await clientPromise

    const data = JSON.stringify(await client.db().collection(context.params?.table as string).find().toArray())

    return {
        props: {
            table: context.params?.table,
            data: data
        }
    }

}