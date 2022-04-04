type Props = React.ComponentProps<'div'>
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useChatConnection, Message } from '../../hooks/useChatConnection';
import { formCss, formRowCss } from './Home.css';

export const Home = (Props) => {
    const wsHost = "";
    const roomId =  "room1";
    const connectionId = useMemo(() => { return Math.random().toString(36).slice(-8)}, [])
    const [state, setState] = useState({
      message: "",
    });

    const { sendMessage, messages } = useChatConnection(wsHost, roomId)

    const renderMessages = useCallback(() =>  {
        return <>
          {messages.forEach((msg) => {
            // TDDO: 後で分岐考える
            if (msg.senderId === connectionId) {
                <div>{ msg.body }</div>
            } else {
                <div>{ msg.body }</div>
            }
          })}
        </>
    }, [messages]);

    const handleChange = useCallback((event) => {
        setState({...state, [event.target.name]: event.target.value });
    }, []);

    const handleSubmit = useCallback((e) => {
      if (e) e.preventDefault();
      sendMessage({
        senderId: connectionId,
        body: state.message,
        attachments: []
      });
    }, [state, sendMessage])

    return <>
      <main>
        <div>{renderMessages()}</div>
        <div className={formRowCss}>
            <div>
              ID: {connectionId}
            </div>
            <div>
              RoomId: {roomId}
            </div>
        </div>
        <form className={formCss} onSubmit={handleSubmit} >
          <div className={formRowCss}>
            <label>
                Message:
                <input
                    type="text"
                    name="message"
                    value={state.message}
                    onChange={handleChange}
                />
            </label>
          </div>
          <button type='submit'>Send</button>
        </form>
      </main>
    </> 
}