import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';

const USERS_PER_PAGE = 10; // Adjust this number based on your preference

export default function SuggestionsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  // Fetch initial users
  const fetchUsers = useCallback(async (isLoadMore = false) => {
    if (!currentUser?.uid) return;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setUsers([]);
        setLastDoc(null);
        setHasMore(true);
      }

      // Build query to exclude current user and order by creation date
      let q = query(
        collection(db, 'users'),
        where('uid', '!=', currentUser.uid),
        orderBy('uid'), // Need to order by the field we're filtering on first
        orderBy('createdAt', 'desc'),
        limit(USERS_PER_PAGE)
      );

      // If loading more, start after the last document
      if (isLoadMore && lastDoc) {
        q = query(
          collection(db, 'users'),
          where('uid', '!=', currentUser.uid),
          orderBy('uid'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(USERS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      const newUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isLoadMore) {
        setUsers(prevUsers => [...prevUsers, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      // Update pagination state
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === USERS_PER_PAGE);

      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      
      // If it's a permission error with the compound query, try a simpler approach
      if (err.code === 'failed-precondition') {
        console.log('Compound query failed, trying simpler query...');
        await fetchUsersSimple(isLoadMore);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentUser?.uid, lastDoc]);

  // Fallback method with simpler query (in case compound index isn't set up)
  const fetchUsersSimple = async (isLoadMore = false) => {
    try {
      let q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(USERS_PER_PAGE + 1) // Get one extra to filter out current user
      );

      if (isLoadMore && lastDoc) {
        q = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(USERS_PER_PAGE + 1)
        );
      }

      const snapshot = await getDocs(q);
      let newUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.uid !== currentUser.uid)
        .slice(0, USERS_PER_PAGE);

      if (isLoadMore) {
        setUsers(prevUsers => [...prevUsers, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      setLastDoc(snapshot.docs[Math.min(newUsers.length, snapshot.docs.length - 1)]);
      setHasMore(newUsers.length === USERS_PER_PAGE);
    } catch (err) {
      console.error('Simple query also failed:', err);
      throw err;
    }
  };

  // Load more users
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchUsers(true);
    }
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 // Load more when 1000px from bottom
    ) {
      loadMore();
    }
  }, [loadingMore, hasMore]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [currentUser?.uid]);

  // Retry function
  const retryFetch = () => {
    setError(null);
    fetchUsers();
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Suggested Connections</h1>
            <p className="mt-1 text-sm text-gray-600">
              Find peers who match your skills and learning goals
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Suggestions</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={retryFetch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // console.log(users)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Suggested Connections</h1>
          <p className="mt-1 text-sm text-gray-600">
            Find peers who match your skills and learning goals
          </p>
          {users.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Showing {users.length} users
            </p>
          )}
        </div>
        
        {users.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">Check back later for new connections!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  Loading more users...
                </div>
              </div>
            )}

            {/* Load more button (fallback for manual loading) */}
            {!loadingMore && hasMore && users.length >= USERS_PER_PAGE && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Load More Users
                </button>
              </div>
            )}

            {/* End of results */}
            {!hasMore && users.length > 0 && (
              <div className="mt-8 text-center text-gray-500 text-sm">
                You've reached the end of suggestions!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}