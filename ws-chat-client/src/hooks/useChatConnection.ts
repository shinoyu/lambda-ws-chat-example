import { useCallback, useEffect, useMemo, useState, } from "react"
import { w3cwebsocket, IMessageEvent }  from 'websocket'

export type Message = {
    senderId: string | undefined
    body: string,
    roomId: string
    attachments: Attachemnt[] 
}

export type Attachemnt = {
    contentType: string,
    url: string
}
const eventToMessage = (event: IMessageEvent): Message => {
    switch(typeof event.data) {
        case 'string': {
            return JSON.parse(event.data)
        }
        default: {
            return JSON.parse(event.data.toString())
        }
    }
}

export const useChatConnection = (userToken: string) => {
    const [senderId, _setSenderId ] = useState(userToken)
    const [messages, setMessages ] = useState(() => { return [] as Message[]})
    const [isConnected, setIsConnected] = useState(false)
    const [client, setClient] = useState(null as unknown as w3cwebsocket)

    const openWs = useCallback((ws: string, roomId: string) => {
        const url = `${ws}?roomId=${roomId}`
        const wsc = new w3cwebsocket(url)

        wsc.onerror = errorHandle
        wsc.onopen = openHandle
        wsc.onmessage = reciveHandle
        wsc.onclose = () => {
            console.log('echo-protocol Client Closed');
            setIsConnected(false);
        };
        setClient(wsc)
    }, [client])

    const errorHandle = useCallback((error: Error) => {
        console.log("Error: '" + error.message)
    }, [client]);

    const openHandle = useCallback(() => { 
        console.log('connected!!')

        setIsConnected(true)
    }, [client])
    
    const reciveHandle = useCallback((event: IMessageEvent) => {
        const message = eventToMessage(event);
        console.log("Received: '" + message.body + "'")
        const list = [...messages, message]
        setMessages(list)
    }, [client, setMessages])

    const sendMessage = useCallback((message: Message) => {
        const data = JSON.stringify({
            ...message,
            senderId: senderId,
            action: 'sendmessage'
        })
        client.send(data)
    }, [client])
    
    return {
        openWs,
        messages,
        sendMessage,
        isConnected
    }
}