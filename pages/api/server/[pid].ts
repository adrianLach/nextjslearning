import { NextApiRequest, NextApiResponse } from 'next'
import {client as WebSocketClient} from 'websocket'

const parseMessage = (message: string) => {
    const parsedMessage: {
        tags?: string,
        source?: {
            nick?: string,
            host?: string
        },
        command?: {
            command?: string,
            channel?: string
        },
        parameters?: string
    } = {
    }

    const messageInfo = message.split(':')[1]
    const messageText = message.split(':')[2]
    console.log(messageInfo)
    console.log(messageText)

    const host = messageInfo.split(' ')[0]
    const command = messageInfo.split(' ')[1]
    const channel = messageInfo.split(' ')[2]

    parsedMessage.parameters = messageText
    parsedMessage.source = {
        host: host,
        nick: ''
    }
    parsedMessage.command = {
        command: command,
        channel: channel
    }

    if(host.indexOf('!') >= 0) {
        parsedMessage.source.nick = host.split('!')[0]
    }
    if(message.split(':')[0] !== '')
        parsedMessage.command.command = message.split(':')[0].trim()

    return parsedMessage
}
    
const channel = '#Nadari'
const account = 'Nadari'
const password = 'oauth:8tisyu7xjdjmkeonvwflayxwu9rude'
let client: WebSocketClient

const setupWebSocketClient = () => {
    client = new WebSocketClient()
    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString())
    })
    client.on('connect', function(connection) {

        console.log('WebSocket Client Connected')
        
        connection.sendUTF(`PASS ${password}`) 
        connection.sendUTF(`NICK ${account}`)

        connection.on('error', function(error) {
            console.log('Connection Error: ' + error.toString())
        })

        connection.on('close', function() {
            console.log('Connection Closed')
            console.log(`close description: ${connection.closeDescription}`)
            console.log(`close reason code: ${connection.closeReasonCode}`)
        })

        connection.on('message', function(ircMessage) {
            
            if (ircMessage.type === 'utf8') {
                const rawIrcMessage = ircMessage.utf8Data.trimEnd()
                console.log(`Message received (${new Date().toISOString()}): '${rawIrcMessage}'\n`)
                const messages = rawIrcMessage.split('\r\n')  // The IRC message may contain one or more messages.
                messages.forEach(message => { 
                    const parsedMessage = parseMessage(message)
                    console.log(parsedMessage)

                    switch (parsedMessage.command?.command) {
                        case 'PRIVMSG' :
                            break
                        case 'PING':
                            connection.sendUTF('PONG ' + parsedMessage.parameters)
                            break
                        case '001':
                            connection.sendUTF(`JOIN ${channel}`) 
                            break 
                        case 'PART':
                            console.log('The channel must have banned (/ban) the bot.')
                            connection.close()
                            break
                        case 'NOTICE': 
                            if ('Login authentication failed' === parsedMessage.parameters) {
                                console.log(`Authentication failed; left ${channel}`)
                                connection.sendUTF(`PART ${channel}`)
                            }
                            else if ('You don`t have permission to perform that action' === parsedMessage.parameters) {
                                console.log(`No permission. Check if the access token is still valid. Left ${channel}`)
                                connection.sendUTF(`PART ${channel}`)
                            }
                            break
                        default:
                            break
                    }

                })
            }
        })

    })
    
    client.connect('ws://irc-ws.chat.twitch.tv:80')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const pid = req.query.pid as string
    console.log(pid)

    if(req.method === 'POST') {
        if(!client) {
            setupWebSocketClient()
        }
        res.status(200).send({alive: !!client})
    }
    if(req.method === 'GET') {
        res.status(200).send({alive: !!client})
    }
}
