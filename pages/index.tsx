import { Button, Heading } from '@chakra-ui/react'
import { useState } from 'react'

const Index = () => {

    const [status, setStatus] = useState(false)

    const startServer = async () => {
        const res = await fetch('/api/server/1', {
            method: 'POST'
        }).then(e => e.json())

        setStatus(res.alive)
    }

    const updateServer = async () => {
        const res = await fetch('/api/server/1', {
            method: 'GET'
        }).then(e => e.json())

        setStatus(res.alive)
    }

    return (
        <>
            <Button variant={'outline'} onClick={() => startServer()}>
                Start Server
            </Button>
            <Heading>{status ? 'Online' : 'Offline'}</Heading>
            <Button variant={'outline'} onClick={() => updateServer()}>
                Update Status
            </Button>
        </>
    )
}

export default Index