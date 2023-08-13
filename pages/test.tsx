import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Card, CardBody, CardFooter, CardHeader, Center, Checkbox, Flex, IconButton, Show } from '@chakra-ui/react'
import {ArrowLeftIcon} from '@chakra-ui/icons'
import { signIn, signOut, useSession } from 'next-auth/react'

const Test = () => {

    const {data: session} = useSession()

    const LogInOut = () => {
        if(!session)
            return <Button onClick={() => signIn()}>Sign In</Button>
        return <Button onClick={() => signOut()}>Sign Out</Button>
    }

    return (
        <>
            <Flex direction={'column'} h={'100vh'} p={'5px'} pt={'0px'}>
                <Center flex={1}>
                    <LogInOut></LogInOut>
                </Center>
                <Flex h={'100%'}>
                    <Flex direction={'column'}>
                        <Box flex={1}>
                            <Show breakpoint='(min-width: 600px)'>
                                <Center border={'1px'} w={'300px'}>Nav</Center>
                            </Show>
                        </Box>
                        <IconButton aria-label='toggle-menu' icon={<ArrowLeftIcon/>}></IconButton>
                    </Flex>
                    <Card flex={1}>
                        <CardHeader>
                            <Center>
                                <Breadcrumb>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href='#'>Test</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem isCurrentPage>
                                        <BreadcrumbLink href='#'>Utils</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </Center>
                        </CardHeader>
                        <CardBody>
                            <Checkbox>Checkbox</Checkbox>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </Flex>
            </Flex>
        </>
    )
}

export default Test