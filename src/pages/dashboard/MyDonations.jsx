import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';
import { donationAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const MyDonations = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['my-donations'],
    queryFn: donationAPI.getMyDonations,
  });

  // Extract user's donations from campaigns
  const campaigns = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
  const donations = campaigns.flatMap(campaign => 
    campaign.donations?.map(donation => ({
      campaignId: campaign._id,
      petName: campaign.petName,
      petImage: campaign.petImage,
      creator: campaign.creator,
      amount: donation.amount,
      donatedAt: donation.donatedAt
    })) || []
  );

  const refundMutation = useMutation({
    mutationFn: donationAPI.refundDonation,
    onSuccess: () => {
      toast.success('Refund processed successfully');
      queryClient.invalidateQueries(['my-donations']);
      queryClient.invalidateQueries(['donations']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process refund');
    },
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Donations</h1>
        </div>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Donations</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Track your donations and request refunds if needed
        </p>
      </div>

      {donations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No donations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start making a difference by donating to pet campaigns.
          </p>
          <Button onClick={() => window.location.href = '/donations'}>
            Browse Campaigns
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Campaign Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {donations.map((donation) => (
                  <tr key={donation.campaignId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={donation.petImage}
                          alt={donation.petName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {donation.petName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <img
                          src={donation.creator?.photoURL || '/default-avatar.png'}
                          alt={donation.creator?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {donation.creator?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(donation.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(donation.donatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refundMutation.mutate(donation.campaignId)}
                        disabled={refundMutation.isPending}
                        className="flex items-center space-x-2"
                      >
                        <RefreshCw size={16} />
                        <span>Request Refund</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total donations: {donations?.length || 0}
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total donated: {formatCurrency(
                  donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Refund Policy */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Refund Policy
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Refunds can be requested within 30 days of donation</li>
          <li>• Refunds are processed back to your original payment method</li>
          <li>• Processing time: 5-10 business days</li>
          <li>• Contact support if you have any issues with refunds</li>
        </ul>
      </div>
    </div>
  );
};

export default MyDonations;
