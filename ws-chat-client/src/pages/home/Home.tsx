type Props = React.ComponentProps<'div'>
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useChatConnection, Message } from '../../hooks/useChatConnection';
import { formCss, formRowCss } from './Home.css';

export const Home = (Props) => {
    const connectionId = useMemo(() => { return Math.random().toString(36).slice(-8)}, [])
    const userToken = useMemo(() => { return Math.random().toString(36).slice(-8)}, [])
    const [state, setState] = useState({
      message: "",
      roomId: "",
    });

    const {openWs, isConnected, sendMessage, messages } = useChatConnection(userToken)
    const renderMessages = useCallback(() =>  {
        return <>
          {messages.forEach((msg) => {
            // TDDO: 後で分岐考える
            if (userToken === msg.senderId) {
                <div>{ msg.body }</div>
            } else {
                <div>{ msg.body }</div>
            }
          })}
        </>
    }, [messages]);

    const renderRoomIdForm = () => {
      if (!isConnected) {
        return <>
         <form onSubmit={handleConnectSubmit} >
            <label>
              RoomId:
              <input
                type="text"
                name="roomId"
                value={state.roomId}
                onChange={handleChange}
              />
              <button type='submit'>通信開始</button>
            </label>
          </form>
        </>      
      } else {
        return <>
          RoomId: { state.roomId } 
        </>
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
      setState({...state, [event.target.name]: event.target.value });
    }

    const handleConnectSubmit = useCallback((e) => {
      e.preventDefault();
      openWs(wsHost, state.roomId)
    }, [state.roomId])

    const handleSubmit = useCallback((e) => {
      if (e) e.preventDefault();
      sendMessage({
        senderId: undefined,
        body: state.message,
        roomId: state.roomId,
        attachments: []
      });
      setState({...state, message: ""});
    }, [state, sendMessage])

    return <>
      <main>
        <div className={formRowCss}>
            <div>
              ID: {userToken}
            </div>
            <div>
              { renderRoomIdForm() }
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
        <div>{renderMessages()}</div>
      </main>
    </> 
}