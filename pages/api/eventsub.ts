import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase()
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase()
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase()
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase()

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification'
const MESSAGE_TYPE_NOTIFICATION = 'notification'
const MESSAGE_TYPE_REVOCATION = 'revocation'

const HMAC_PREFIX = 'sha256='

function getSecret() {
    return 'secret123123123'
}

function getHmacMessage(request: NextApiRequest) {

    const messId = (request.headers[TWITCH_MESSAGE_ID] || '') as string
    const timestamp = (request.headers[TWITCH_MESSAGE_TIMESTAMP] || '') as string

    return (messId +
        timestamp +
        JSON.stringify(request.body))
}
function getHmac(secret: crypto.BinaryLike | crypto.KeyObject, message: crypto.BinaryLike) {
    return crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex')
}

function verifyMessage(hmac: string, verifySignature: string) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature))
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    const secret = getSecret()
    const message = getHmacMessage(req)
    const hmac = HMAC_PREFIX + getHmac(secret, message)

    console.log(hmac)
    console.log(req.headers[TWITCH_MESSAGE_SIGNATURE])

    if (true === verifyMessage(hmac, (req.headers[TWITCH_MESSAGE_SIGNATURE] || '') as string)) {
        console.log('signatures match')

        // Get JSON object from body, so you can process the message.
        const notification = req.body

        if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
            // TODO: Do something with the event's data.

            console.log(`Event type: ${notification.subscription.type}`)
            console.log(JSON.stringify(notification.event, null, 4))

            res.status(204).end()
        }
        else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
            res.status(200).send(notification.challenge)
        }
        else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
            res.status(204).end()

            console.log(`${notification.subscription.type} notifications revoked!`)
            console.log(`reason: ${notification.subscription.status}`)
            console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`)
        }
        else {
            res.status(204).end()
            console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`)
        }
    }
    else {
        console.log('403')    // Signatures didn't match.
        res.status(403).end()
    }
}