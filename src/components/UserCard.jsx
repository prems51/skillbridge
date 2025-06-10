import { Link } from "react-router-dom";


export default function UserCard({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-100 rounded-full h-12 w-12 flex items-center justify-center mr-4">
            <span className="text-indigo-600 font-medium">
              {user.name.charAt(0)}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Can teach:</h4>
          <div className="flex flex-wrap">
            {user.skillsHave && user.skillsHave.map(skill => (
              <span key={`have-${skill}`} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Wants to learn:</h4>
          <div className="flex flex-wrap">
            {user.skillsWant && user.skillsWant.map(skill => (
              <span key={`want-${skill}`} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <Link to={`/user/${user.id}`} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
          View Profile
        </Link>
      </div>
    </div>
  );
}