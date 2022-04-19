type Props = React.ComponentProps<'div'>
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useChatConnection, Message } from '../../hooks/useChatConnection';
import { formCss, formRowCss } from './Home.css';

export const Home = (Props) => {
    const wsHost =  import.meta.env.VITE_WS_CHANNEL_URL
    const [state, setState] = useState({
      message: "",
      roomId: "",
      userToken: ""
    });

    const {openWs, isConnected, sendMessage, messages } = useChatConnection(state.userToken)
    const renderMessages = useCallback(() =>  {
        return <>
          {messages.map((msg) => {
            if (state.userToken === msg.senderId) {
              return <div>
                { `${msg.senderId}(my): ${msg.body}` }
              </div>
            } else {
              return <div>
                { `${msg.senderId}: ${msg.body}` }                 
              </div>            }
          })}
        </>
    }, [messages]);

    const renderRoomIdForm = () => {
      if (!isConnected) {
        return <>
         <form onSubmit={handleConnectSubmit} >
           <div>
            <label>
                user:
                <input
                  type="text"
                  name="userToken"
                  value={state.userToken}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                RoomId:
                <input
                  type="text"
                  name="roomId"
                  value={state.roomId}
                  onChange={handleChange}
                />
              </label>
            </div>
            <button type='submit'>通信開始</button>
          </form>
        </>      
      } else {
        return <>
          <p>
            user: { state.userToken }<br/>
            RoomId: { state.roomId } 
          </p>
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
        senderId: state.userToken,
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
