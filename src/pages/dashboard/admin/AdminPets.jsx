import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { petAPI } from '../../../services/api';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';

const AdminPets = () => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pet: null });
  const queryClient = useQueryClient();

  const { data: pets, isLoading } = useQuery({
    queryKey: ['admin-pets'],
    queryFn: petAPI.getAllPetsAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: petAPI.deletePet,
    onSuccess: () => {
      toast.success('Pet deleted successfully');
      queryClient.invalidateQueries(['admin-pets']);
      setDeleteModal({ isOpen: false, pet: null });
    },
    onError: () => {
      toast.error('Failed to delete pet');
    },
  });

  const adoptMutation = useMutation({
    mutationFn: petAPI.markAsAdopted,
    onSuccess: () => {
      toast.success('Pet adoption status updated');
      queryClient.invalidateQueries(['admin-pets']);
    },
    onError: () => {
      toast.error('Failed to update adoption status');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage All Pets</h1>
        </div>
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage All Pets</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Oversee all pets across the platform
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pets?.map((pet) => (
                <tr key={pet._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {pet.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {pet.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <img
                        src={pet.owner?.photoURL || '/default-avatar.png'}
                        alt={pet.owner?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {pet.owner?.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {pet.owner?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {pet.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {pet.age} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pet.adopted 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {pet.adopted ? 'Adopted' : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/pets/${pet._id}`, '_blank')}
                        className="flex items-center space-x-1"
                      >
                        <Edit size={14} />
                        <span>View</span>
                      </Button>
                      
                      <Button
                        variant={pet.adopted ? 'secondary' : 'success'}
                        size="sm"
                        onClick={() => adoptMutation.mutate(pet._id)}
                        disabled={adoptMutation.isPending}
                        className="flex items-center space-x-1"
                      >
                        {pet.adopted ? <X size={14} /> : <Check size={14} />}
                        <span>{pet.adopted ? 'Unadopt' : 'Adopt'}</span>
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteModal({ isOpen: true, pet })}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </Button>
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
              Total pets: {pets?.length || 0}
            </span>
            <div className="flex space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Available: {pets?.filter(p => !p.adopted).length || 0}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                Adopted: {pets?.filter(p => p.adopted).length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, pet: null })}
        title="Delete Pet"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{deleteModal.pet?.name}</strong>? 
            This action cannot be undone and will remove all associated data.
          </p>
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">
              <strong>Warning:</strong> This will also delete any adoption requests for this pet.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, pet: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(deleteModal.pet._id)}
              disabled={deleteMutation.isPending}
              className="flex-1"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Pet'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPets;
