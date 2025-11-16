import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Check, X, Phone, MapPin, Mail, User } from 'lucide-react';
import { adoptionAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const AdoptionRequests = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['adoption-requests'],
    queryFn: adoptionAPI.getRequestsForMyPets,
  });

  const requests = Array.isArray(response) ? response : (Array.isArray(response?.data) ? response.data : []);

  const acceptMutation = useMutation({
    mutationFn: adoptionAPI.acceptRequest,
    onSuccess: () => {
      toast.success('Adoption request accepted!');
      queryClient.invalidateQueries({ queryKey: ['adoption-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-pets'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: adoptionAPI.rejectRequest,
    onSuccess: () => {
      toast.success('Adoption request rejected');
      queryClient.invalidateQueries({ queryKey: ['adoption-requests'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Adoption Requests</h1>
        </div>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Adoption Requests</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage adoption requests for your pets
        </p>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No adoption requests yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            When people request to adopt your pets, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={request.petImage}
                        alt={request.petName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold  text-gray-900 dark:text-white">
                          {request.petName}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          request.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : request.status === 'accepted'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <User size={16} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Adopter</p>
                            <p>{request.adopterName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <Mail size={16} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p>{request.adopterEmail}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <Phone size={16} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p>{request.adopterPhone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <MapPin size={16} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p>{request.adopterAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex space-x-3 mt-4 lg:mt-0 lg:ml-6">
                      <Button
                        variant="success"
                        onClick={() => acceptMutation.mutate(request._id)}
                        disabled={acceptMutation.isPending || rejectMutation.isPending}
                        className="flex items-center space-x-2"
                      >
                        <Check size={16} />
                        <span>Accept</span>
                      </Button>
                      
                      <Button
                        variant="danger"
                        onClick={() => rejectMutation.mutate(request._id)}
                        disabled={acceptMutation.isPending || rejectMutation.isPending}
                        className="flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Reject</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdoptionRequests;
