import React, { useState, useEffect } from "react";
import './Chat.css';

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);
    console.log(socket)

    socket.onmessage = (event) => {
      console.log(event);
      const recievedObj = {
        ...JSON.parse(event.data),
        alignLeft: true
      }
      console.log(recievedObj)
      setMessages((prev) => [...prev, recievedObj])
    }

    socket.onclose = () => console.log("Websocket disconnected")

    return () => socket.close();
  }, [])
 
  const sendMessage = () => {
    console.log('send message')
    if (ws && message.trim() !== "") {
      console.log(message)
      let obj = {
        text: message
      }
      ws.send(JSON.stringify(obj));
      setMessages((prev) => [...prev, obj]);
      setMessage('');
    }
  }

  return (
    <div className="chat-container">
      {/* Chat Heading */}
      <h2 className="chat-heading">Chat Assignment - Gnani.ai</h2>

      {/* Chat Messages */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.alignLeft ? 'align-start' : ''}`}>{msg.text}</div>
        ))}
      </div>

      {/* Input and Button */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="chat-send-button">
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat;

