import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Shield, Ban } from 'lucide-react';
import { userAPI } from '../../../services/api';
import Button from '../../../components/ui/Button';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';

const AdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: userAPI.getAllUsers,
  });

  const makeAdminMutation = useMutation({
    mutationFn: userAPI.makeAdmin,
    onSuccess: () => {
      toast.success('User promoted to admin successfully');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to promote user');
    },
  });

  const banUserMutation = useMutation({
    mutationFn: userAPI.banUser,
    onSuccess: () => {
      toast.success('User banned successfully');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to ban user');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        </div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage user roles and permissions across the platform
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.photoURL || '/default-avatar.png'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy='no-referrer'
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.isActive ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {user.role !== 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => makeAdminMutation.mutate(user._id)}
                          disabled={makeAdminMutation.isPending}
                          className="flex items-center space-x-1"
                        >
                          <Shield size={14} />
                          <span>Make Admin</span>
                        </Button>
                      )}
                      
                      {user.isActive ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => banUserMutation.mutate(user._id)}
                          disabled={banUserMutation.isPending}
                          className="flex items-center space-x-1"
                        >
                          <Ban size={14} />
                          <span>Ban</span>
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Banned
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Total users: {users?.length || 0}
            </span>
            <div className="flex space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Admins: {users?.filter(u => u.role === 'admin').length || 0}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                Active: {users?.filter(u => u.isActive).length || 0}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                Banned: {users?.filter(u => !u.isActive).length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Guidelines */}
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Admin Guidelines
        </h3>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
          <li>• Only promote trusted users to admin status</li>
          <li>• Banned users cannot log in or access the platform</li>
          <li>• Admin actions are logged and monitored</li>
          <li>• Contact support for any user-related issues</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminUsers;
