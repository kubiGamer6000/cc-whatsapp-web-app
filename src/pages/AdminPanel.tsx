import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';
import { Shield } from 'lucide-react';
import { formatTimestamp } from '../utils';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers: User[] = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() } as User);
        });
        
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserRole = async (userId: string, currentRole: 'user' | 'admin') => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        role: newRole
      });
      
      setUsers(users.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
        <Shield className="h-8 w-8 text-purple-500" />
        <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">User Management</h2>
        <p className="text-gray-400 mb-6">
          Manage user roles and permissions. Admins have full access to all features.
        </p>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-700">
                    <td className="px-4 py-3 flex items-center">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || ''} 
                          className="h-8 w-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-600 mr-2 flex items-center justify-center">
                          <span className="text-gray-300">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-300">{user.displayName}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-900 text-purple-200' 
                          : 'bg-blue-900 text-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {formatTimestamp(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleUserRole(user.uid, user.role)}
                        className={`px-3 py-1 rounded text-xs ${
                          user.role === 'admin'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-purple-700 text-purple-100 hover:bg-purple-600'
                        }`}
                      >
                        {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;