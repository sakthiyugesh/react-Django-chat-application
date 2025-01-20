import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ChatInbox from "../components/ChatInbox";

const ChatDetailView = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  const [message, setMessage] = useState([""]);
  const [newMessage, setNewMessage] = useState("");
  const { sender, receiver, name } = useParams();
  const UserData = localStorage.getItem("authTokens");
  let [user, setUser] = useState(
    UserData ? jwtDecode(UserData) : "No user Found"
  );
  const message_ids = useMemo(() => message.map((msg) => msg.id), [message]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    getMessage();
    console.log(message);
    const ws = new WebSocket(
      `ws://54.196.229.75:8000/ws/chat/${sender}/${receiver}/`
    );
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage((prev) => [...prev, data]);
    };

    ws.onopen = () => {
      console.log("Connection success!");
    };

    setSocket(ws);
    return () => ws.close();
  }, [sender, receiver]);

  const getMessage = async () => {
    const response = await axios.get(`${backendUrl}/api/all-message/${sender}/${receiver}/`);
    setMessage(response.data);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && newMessage.trim()) {
      const messageData = {
        sender: user.user_id,
        receiver: receiver == user.user_id ? sender : receiver,
        message: newMessage,
      };
      socket.send(JSON.stringify(messageData));
      setNewMessage("");
    }
  };

  const filteredMessageIds = useMemo(() => {
    return message
      .filter((msg) => msg.receiver === user.user_id) // Only messages where the user is the receiver
      .map((msg) => msg.id);
  }, [message, user.user_id]);

  useEffect(() => {
    console.log(filteredMessageIds);
    const markMessagesAsRead = async () => {
      if (filteredMessageIds.length > 0) {
        await axios.post(`${backendUrl}/api/read-messages/`, {
          msg_ids: filteredMessageIds,
        });
        // console.log("Messages marked as read");
      }
    };

    markMessagesAsRead();
  }, [filteredMessageIds]);

  return (
    <div className="container py-4">
      <div
        className="card chat-container border-round"
        style={{ height: "80vh" }}
      >
        <div className="header">
          <p className="p-3 bg-header rounded text-white">{name}</p>
        </div>
        <div
          className="card-body chat-messages overflow-auto"
          style={{ height: "calc(100% - 60px)" }}
        >
          {message.length > 0 ? (
            message.map((msg, index) => (
              <div
                key={index}
                className={`d-flex mb-2 ${
                  msg.sender === user.user_id ? "justify-content-end" : ""
                }`}
              >
                <div
                  className={`chat-bubble p-3 rounded ${
                    msg.sender === user.user_id
                      ? "bg-dark text-white"
                      : "bg-secondary text-white"
                  }`}
                  style={{
                    maxWidth: "75%",
                    minWidth: "25%",
                    wordBreak: "break-word",
                  }}
                >
                  <p className="mb-0">{msg.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-5">No Messages Found..!</p>
          )}
        </div>

        <form
          className="card-footer chat-input d-flex"
          style={{ position: "sticky", bottom: 0 }}
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            name="message"
            className="form-control me-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" className="btn btn-success">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDetailView;
