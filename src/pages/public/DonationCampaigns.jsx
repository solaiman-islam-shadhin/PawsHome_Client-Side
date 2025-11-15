import { Link } from 'react-router-dom';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { donationAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { PetCardSkeleton } from '../../components/ui/LoadingSkeleton';

const DonationCampaigns = () => {
  const {
    items: campaigns,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteScroll(
    ['donations'],
    ({ pageParam = 1 }) => donationAPI.getAllCampaigns({ page: pageParam })
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Donation Campaigns
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Help pets in need by supporting their medical care and well-being
          </p>
        </div>

        {/* Campaigns Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No active campaigns
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Check back later for new donation campaigns.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => {
                const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.maxAmount);
                const isExpired = new Date(campaign.lastDate) < new Date();
                
                return (
                  <div key={campaign._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={campaign.petImage}
                        alt={campaign.petName}
                        className="w-full h-48 object-cover"
                      />
                      {isExpired && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Expired
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {campaign.petName}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {campaign.shortDescription}
                      </p>
                      
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {progressPercentage.toFixed(1)}% funded
                        </p>
                      </div>
                      
                      {/* Days Left */}
                      <div className="mb-4">
                        {!isExpired ? (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Ends: {new Date(campaign.lastDate).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Campaign ended
                          </p>
                        )}
                      </div>
                      
                      <Link to={`/donations/${campaign._id}`}>
                        <Button className="w-full" disabled={isExpired}>
                          {isExpired ? 'Campaign Ended' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <PetCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    Scroll down to load more campaigns...
                  </div>
                )}
              </div>
            )}

            {!hasNextPage && campaigns.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  You've seen all active campaigns! Thank you for your support.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonationCampaigns;
