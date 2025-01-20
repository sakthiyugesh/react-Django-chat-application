import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";

const ChatInbox = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const UserData = localStorage.getItem("authTokens");
  const [user, setUser] = useState(UserData ? jwtDecode(UserData) : null);
  const [userlist, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    fetchInboxMessages();
    fetchUser();
  }, []);

  const fetchInboxMessages = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `${backendUrl}/api/my-message/${user.user_id}/`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching inbox messages:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/`);
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching user lists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const ws = new WebSocket(
        `ws://54.196.229.75:8000/ws/chat/inbox/${user.user_id}/`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNewMessages((prevMessages) => {
          const isDuplicate = prevMessages.some((msg) => msg.id === data.id);
          return isDuplicate ? prevMessages : [...prevMessages, data];
        });
      };

      ws.onopen = () => console.log("WebSocket connection established");
      ws.onerror = (error) => console.error("WebSocket error:", error);

      return () => ws.close();
    }
  }, [user]);

  const allMessages = [...messages, ...newMessages];

  const latestMessages = Object.values(
    allMessages.reduce((acc, message) => {
      const contactKey =
        message.sender === user.user_id ? message.receiver : message.sender;

      if (
        !acc[contactKey] ||
        new Date(message.date_time) > new Date(acc[contactKey].date_time)
      ) {
        acc[contactKey] = message;
      }
      return acc;
    }, {})
  );

  const sortedMessages = latestMessages.sort(
    (a, b) => new Date(b.date_time) - new Date(a.date_time)
  );

  const fuse = new Fuse(userlist, {
    keys: ["username", "email"], // Fields to search
    threshold: 0.4, // Adjust for more/less fuzziness
  });

  const filteredUsers = searchUser
    ? fuse.search(searchUser).map((result) => result.item)
    : userlist.filter((u) => u.id !== user.user_id);

  return (
    <div className="container mt-4">
      <div>
        {/* <h3 className="text-center mb-4">Inbox</h3> */}
        {loading ? (
          <div className="text-center">
            <p>Loading messages...</p>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="text-center">
            <p>No messages available.</p>
          </div>
        ) : (
          <div className="list-group">
            {sortedMessages.map((msg) => {
              const contactName =
                msg.sender === user.user_id
                  ? msg.receiver_profile.username
                  : msg.sender_profile.username;

              return (
                <Link
                  key={msg.id}
                  to={`chat/${msg.sender}/${msg.receiver}/${contactName}`}
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{contactName}</h5>
                    {user.user_id === msg.receiver && msg.unread_count > 0 && (
                      <span className="badge bg-success p-2 rounded-pill">
                        {msg.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="mb-1 text-muted">{msg.message}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="list-group text-center  mt-3">
        <div>
          <h3 className="p-3">
            User Lists <small>(available)</small>
          </h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search users..."
            className="form-control mb-3"
          />
        </form>
        <div>
          {filteredUsers.length > 0 ? (
            filteredUsers
              .filter((u) => u.id !== user.user_id)
              .map((u) => (
                <Link
                  to={`chat/${user.user_id}/${u.id}/${u.username}`}
                  key={u.id}
                  className="list-group-item list-group-item-action"
                >
                  {u.username} ({u.email})
                </Link>
              ))
          ) : (
            <p className="text-muted">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInbox;
