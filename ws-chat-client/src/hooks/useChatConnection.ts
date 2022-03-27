import { useCallback, useEffect, useMemo, useState, } from "react"
import { w3cwebsocket as W3cWebSocket, IMessageEvent }  from 'websocket'

export type Message = {
    body: string,
    senderId: string,
    attachments: Attachemnt[] 
}

export type Attachemnt = {
    contentType: string,
    url: string
}

export const useChatConnection = (ws: string) => {
    const [connectionId, setConnectionId ] = useState(null)
    const [messages, setMessages ] = useState([] as Message[])

    const client = useMemo(() => new W3cWebSocket(ws) , [ws])
    const errorHandle = useCallback((error: Error) => {

    }, [client]);
    const openHandle = useCallback(() => { 
        console.log('connected!!')
    }, [client])
    
    const reciveHandle = useCallback((message: IMessageEvent) => {
        // TODO: received message action
        if (typeof message.data === 'string') {
          console.log("Received: '" + message.data + "'");
        }
    }, [client, messages])

    const sendMessage = useCallback((message: Message) => {
        client.send('test');
    }, [client, messages]);

    useEffect(() => {
        client.onerror = errorHandle
        client.onopen = openHandle
        client.onmessage = reciveHandle
        client.onclose = () => {
            console.log('echo-protocol Client Closed');
        };
    }, [ws])    
    
    return {
        connectionId,
        messages,
        sendMessage,
    }
}