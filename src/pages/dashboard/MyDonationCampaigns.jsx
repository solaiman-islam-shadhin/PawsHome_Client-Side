import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Edit, Pause, Play, Users, Eye } from 'lucide-react';
import { donationAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const MyDonationCampaigns = () => {
  const [donatorsModal, setDonatorsModal] = useState({ isOpen: false, campaign: null });
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['my-donation-campaigns'],
    queryFn: donationAPI.getMyCampaigns,
  });

  const campaigns = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);

  const pauseMutation = useMutation({
    mutationFn: donationAPI.pauseCampaign,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['my-donation-campaigns']);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Donation Campaigns</h1>
        </div>
        <TableSkeleton rows={3} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Donation Campaigns</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your fundraising campaigns
          </p>
        </div>
        <Link to="/dashboard/create-donation">
          <Button>Create New Campaign</Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No campaigns yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start your first donation campaign to help a pet in need.
          </p>
          <Link to="/dashboard/create-donation">
            <Button>Create Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.maxAmount);
            const daysLeft = getDaysLeft(campaign.lastDate);
            const isExpired = daysLeft === 0;
            
            return (
              <div key={campaign._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Campaign Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={campaign.petImage}
                          alt={campaign.petName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {campaign.petName}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              campaign.isPaused 
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                : isExpired
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {campaign.isPaused ? 'Paused' : isExpired ? 'Expired' : 'Active'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span>Raised: {formatCurrency(campaign.currentAmount)}</span>
                          <span>Goal: {formatCurrency(campaign.maxAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{progressPercentage.toFixed(1)}% funded</span>
                          <span>{campaign.donations?.length || 0} donors</span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {campaign.shortDescription}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6 lg:w-48">
                      <Link to={`/dashboard/edit-donation/${campaign._id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </Link>
                      
                      <Button
                        variant={campaign.isPaused ? 'success' : 'secondary'}
                        size="sm"
                        onClick={() => pauseMutation.mutate(campaign._id)}
                        disabled={pauseMutation.isPending || isExpired}
                        className="w-full"
                      >
                        {campaign.isPaused ? (
                          <>
                            <Play size={16} className="mr-2" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause size={16} className="mr-2" />
                            Pause
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDonatorsModal({ isOpen: true, campaign })}
                        className="w-full"
                      >
                        <Users size={16} className="mr-2" />
                        View Donors
                      </Button>
                      
                      <Link to={`/donations/${campaign._id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye size={16} className="mr-2" />
                          View Public
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Donors Modal */}
      <Modal
        isOpen={donatorsModal.isOpen}
        onClose={() => setDonatorsModal({ isOpen: false, campaign: null })}
        title={`Donors for ${donatorsModal.campaign?.petName}`}
        size="lg"
      >
        <div className="space-y-4">
          {donatorsModal.campaign?.donations?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💝</div>
              <p className="text-gray-600 dark:text-gray-300">
                No donations yet. Share your campaign to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {donatorsModal.campaign?.donations?.map((donation, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={donation.donor?.photoURL || '/default-avatar.png'}
                      alt={donation.donor?.name}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy='no-referrer'
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {donation.donor?.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(donation.donatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(donation.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">
                Total Raised:
              </span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(donatorsModal.campaign?.currentAmount || 0)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyDonationCampaigns;
