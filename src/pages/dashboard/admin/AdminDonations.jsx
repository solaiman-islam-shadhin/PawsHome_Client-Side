import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Edit, Trash2, Pause, Play, Eye } from 'lucide-react';
import { donationAPI } from '../../../services/api';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';

const AdminDonations = () => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, campaign: null });
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-donations'],
    queryFn: donationAPI.getAllCampaignsAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: donationAPI.deleteCampaign,
    onSuccess: () => {
      toast.success('Campaign deleted successfully');
      queryClient.invalidateQueries(['admin-donations']);
      setDeleteModal({ isOpen: false, campaign: null });
    },
    onError: () => {
      toast.error('Failed to delete campaign');
    },
  });

  const pauseMutation = useMutation({
    mutationFn: donationAPI.pauseCampaign,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['admin-donations']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update campaign');
    },
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  const getDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage All Donations</h1>
        </div>
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage All Donations</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Oversee all donation campaigns across the platform
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Days Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns?.map((campaign) => {
                const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.maxAmount);
                const daysLeft = getDaysLeft(campaign.lastDate);
                const isExpired = daysLeft === 0;
                
                return (
                  <tr key={campaign._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={campaign.petImage}
                          alt={campaign.petName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {campaign.petName}
                          </p>
                       
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <img
                          src={campaign.creator?.photoURL || '/default-avatar.png'}
                          alt={campaign.creator?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {campaign.creator?.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {campaign.creator?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                          <span>{formatCurrency(campaign.currentAmount)}</span>
                          <span>{formatCurrency(campaign.maxAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {progressPercentage.toFixed(1)}% • {campaign.donations?.length || 0} donors
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.isPaused 
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : isExpired
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {campaign.isPaused ? 'Paused' : isExpired ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {daysLeft > 0 ? `${daysLeft} days` : 'Ended'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/donations/${campaign._id}`, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Eye size={12} />
                        </Button>
                        
                        <Button
                          variant={campaign.isPaused ? 'success' : 'secondary'}
                          size="sm"
                          onClick={() => pauseMutation.mutate(campaign._id)}
                          disabled={pauseMutation.isPending || isExpired}
                          className="flex items-center space-x-1"
                        >
                          {campaign.isPaused ? <Play size={12} /> : <Pause size={12} />}
                        </Button>
                        
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteModal({ isOpen: true, campaign })}
                          className="flex items-center space-x-1"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Total campaigns: {campaigns?.length || 0}
            </span>
            <div className="flex space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Active: {campaigns?.filter(c => !c.isPaused && getDaysLeft(c.lastDate) > 0).length || 0}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                Paused: {campaigns?.filter(c => c.isPaused).length || 0}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                Total Raised: {formatCurrency(
                  campaigns?.reduce((sum, c) => sum + c.currentAmount, 0) || 0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, campaign: null })}
        title="Delete Campaign"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete the campaign for <strong>{deleteModal.campaign?.petName}</strong>? 
            This action cannot be undone.
          </p>
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">
              <strong>Warning:</strong> This will also remove all donation records and cannot be reversed.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, campaign: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(deleteModal.campaign._id)}
              disabled={deleteMutation.isPending}
              className="flex-1"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Campaign'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDonations;
