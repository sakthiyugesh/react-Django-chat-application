import React, { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import ChatInbox from "../components/ChatInbox";

const Home = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow-sm">
            {!user ? (
              <div className="text-center">
                <p>No User Found..!</p>
                <a className="btn btn-success mt-2" href="login">
                  Go to Login
                </a>
              </div>
            ) : (
              <div>
                <h3 className="mb-3 p-3 bg-success ">Welcome, {user.first_name}!</h3>
                <p className="mb-3">
                  <strong>Email:</strong> {user.email}
                </p>
                <button className="btn btn-danger" onClick={logoutUser}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!user ? (
        <div>
          <div className="chat-column mt-5">
            <h2 className="text-center mb-3 ">Chat Inbox</h2>
          </div>
          <p className="text-center  m-3 p-3">No Chats are available..!</p>
        </div>
      ) : (
        <div className="chat-column mt-5">
          <h2 className="text-center mb-3 ">
            Chat Inbox <small>(recent Chats)</small>
          </h2>
          <ChatInbox />
        </div>
      )}
    </div>
  );
};

export default Home;
