import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { donationAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const RefundRequests = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['refund-requests'],
    queryFn: donationAPI.getMyCampaigns,
  });

  const campaigns = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
  
  const refundRequests = campaigns.flatMap(campaign =>
    campaign.donations
      ?.filter(d => d.refundRequested)
      .map(donation => ({
        campaignId: campaign._id,
        petName: campaign.petName,
        petImage: campaign.petImage,
        donorName: donation.donorName,
        amount: donation.amount,
        donatedAt: donation.donatedAt,
        donor: donation.donor
      })) || []
  );

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Refund Requests</h1>
        </div>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Refund Requests</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            You haven't created any campaigns yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create a donation campaign to start receiving refund requests from donors.
          </p>
          <Link to="/dashboard/create-donation">
            <Button>Create Campaign</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Refund Requests</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          View and manage refund requests from donors on your campaigns
        </p>
      </div>

      {!refundRequests || refundRequests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No refund requests
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            All donations on your campaigns are going smoothly!
          </p>
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
                    Donor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Donated Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {refundRequests.map((request, idx) => (
                  <tr key={`${request.campaignId}-${request.donor}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={request.petImage}
                          alt={request.petName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {request.petName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.donorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                        {formatCurrency(request.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(request.donatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-900 dark:text-white">
                        {request.donor.substring(0, 8)}...
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total refund requests: {refundRequests?.length || 0}
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total amount: {formatCurrency(
                  refundRequests?.reduce((sum, req) => sum + req.amount, 0) || 0
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundRequests;
