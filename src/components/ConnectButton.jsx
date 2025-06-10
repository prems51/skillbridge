import { sendRequest } from "../services/connections";

export default function ConnectButton({ currentUserId, targetUserId }) {
  const handleConnect = async () => {
    await sendRequest(currentUserId, targetUserId);
    alert("Request sent!");
  };

  return (
    <button onClick={handleConnect} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
      Connect
    </button>
  );
}