import { useState } from 'react';
import Navbar from '../components/Navbar';
import ConnectionsList from '../components/ConnectionLists';
import { useAuth } from '../context/AuthContext';



export default function DashboardPage() {

  const {user:currUser} = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your skills and find peers to learn from or teach
          </p>
        </div>
        {/*  */}
        <ConnectionsList userId={currUser.uid} />
      </div>
    </div>
  );
}