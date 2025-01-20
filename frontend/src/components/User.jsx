import { useEffect, useState } from "react";

function User() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/user") 
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Data: {JSON.stringify(data)}</h1>
    </div>
  );
}

export default User;
