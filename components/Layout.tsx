import { Flex, Center, Card, CardHeader, Button, CardBody } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

    const { data: session } = useSession()

    const LogInOut = () => {
        if (!session)
            return <Button onClick={() => signIn()}>Sign In</Button>
        return <Button onClick={() => signOut()}>Sign Out</Button>
    }

    return (
        <>
            <Flex direction={'column'} h={'100vh'} pt={'5px'}>
                <Center flex={1}>
                    <LogInOut></LogInOut>
                </Center>
                <Flex h={'100%'}>
                    <Card flex={1} variant={'unstyled'} p={'5px'}>
                        <CardHeader>
                        </CardHeader>
                        <CardBody>
                            {children}
                        </CardBody>
                    </Card>
                </Flex>
            </Flex>
        </>
    )
}

export default Layout