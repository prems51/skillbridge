import { useEffect, useState } from "react";
import { listenToConnections } from "../services/connections";


export default function ConnectionsList({ userId }) {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToConnections(userId, (data) => {
      setConnections(data);
    });
    return unsubscribe;
  }, [userId]);

  return (
    <div>
      {connections.map(conn => (
        <div key={conn.id}>
          <p>To: {conn.receiverId}</p>
          <p>Status: {conn.status}</p>
        </div>
      ))}
    </div>
  );
}