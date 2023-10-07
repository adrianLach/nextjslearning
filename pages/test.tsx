import { Button, Flex, Spacer, Stack, Td, Th, Tr } from '@chakra-ui/react'
import { PlusSquareIcon } from '@chakra-ui/icons'

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
            </Stack>
        </>
    )
}

export default Test