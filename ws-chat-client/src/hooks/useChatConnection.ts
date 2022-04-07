import { useCallback, useEffect, useMemo, useState, } from "react"
import { w3cwebsocket, IMessageEvent }  from 'websocket'

export type Message = {
    body: string,
    senderId: string,
    roomId: string
    attachments: Attachemnt[] 
}
export type Attachemnt = {
    contentType: string,
    url: string
}

export const useChatConnection = () => {
    const [connectionId, setConnectionId ] = useState(null)
    const [messages, setMessages ] = useState([] as Message[])
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
    
    const reciveHandle = useCallback((message: IMessageEvent) => {
        // TODO: received message action
        if (typeof message.data === 'string') {
          console.log("Received: '" + message.data + "'")
        }
    }, [client])

    const sendMessage = useCallback((message: Message) => {
        const data = JSON.stringify(message)
        client.send(data)
    }, [client])
    
    return {
        openWs,
        connectionId,
        messages,
        sendMessage,
        isConnected
    }
}