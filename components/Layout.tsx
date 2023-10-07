import { HamburgerIcon } from '@chakra-ui/icons'
import { Flex, Center, Card, CardHeader, CardBody, Box, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { LuUser } from 'react-icons/lu'

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

    const router = useRouter()
    const { data: session } = useSession()

    return (
        <>
            <Box position={'sticky'} top={'0px'} width={'100%'} zIndex={'100'} bg={'white'} borderBottom={'1px solid black'}>
                <Flex padding={'10px'} width={'100%'} justifyContent={'space-between'}>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label='Options'
                            icon={<HamburgerIcon />}
                            variant='outline'
                        />
                        <MenuList>
                            <MenuItem onClick={() => router.push('/')}>
                                Home
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label='Options'
                            icon={<LuUser />}
                            variant='outline'
                        />
                        <MenuList>
                            {session &&
                                <>
                                    <MenuItem>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => signOut()}>
                                        Sign out
                                    </MenuItem>
                                    <MenuItem>
                                        Settings
                                    </MenuItem>
                                </>
                            }
                            {!session &&
                                <>
                                    <MenuItem onClick={() => signIn()}>
                                        Sign in
                                    </MenuItem>
                                </>
                            }
                        </MenuList>
                    </Menu>
                </Flex>
            </Box>
            <Flex direction={'column'} h={'100vh'} pt={'5px'}>
                <Center flex={1}>
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