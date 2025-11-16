import { Link } from 'react-router-dom';
import { Heart, Target, Clock, Users, TrendingUp, Gift } from 'lucide-react';
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

  const getDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-base-200 font-body">
      {/* Hero Header */}
      <div className="hero bg-gradient-to-r from-secondary to-accent text-secondary-content py-16">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="badge badge-outline mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Make a difference today
            </div>
            <h1 className="text-5xl font-heading font-bold mb-4">
              Support Pet Care
            </h1>
            <p className="text-xl font-body">
              Help pets in need by supporting their medical care, rescue operations, and finding forever homes
            </p>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-figure text-error">
                <Heart size={32} />
              </div>
              <div className="stat-title">Total Raised</div>
              <div className="stat-value font-heading">$125K+</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-info">
                <Users size={32} />
              </div>
              <div className="stat-title">Donors</div>
              <div className="stat-value font-heading">2,500+</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-success">
                <Target size={32} />
              </div>
              <div className="stat-title">Success Rate</div>
              <div className="stat-value font-heading">89%</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-warning">
                <Gift size={32} />
              </div>
              <div className="stat-title">Pets Helped</div>
              <div className="stat-value font-heading">150+</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Active Campaigns Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-base-content mb-4">
            Active Campaigns
          </h2>
          <p className="text-xl text-base-content/70 font-body">
            Every donation makes a real difference in a pet's life
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
          <div className="text-center py-20">
            <div className="text-6xl mb-6">💝</div>
            <h3 className="text-3xl font-heading font-bold text-base-content mb-3">
              No active campaigns
            </h3>
            <p className="text-lg text-base-content/70 font-body max-w-md mx-auto">
              Check back later for new donation campaigns to support.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => {
                const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.maxAmount);
                const daysLeft = getDaysLeft(campaign.lastDate);
                const isExpired = daysLeft === 0;
                
                return (
                  <div key={campaign._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <figure className="h-64 relative">
                      <img
                        src={campaign.petImage}
                        alt={campaign.petName}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {isExpired ? (
                          <div className="badge badge-error">Expired</div>
                        ) : campaign.isPaused ? (
                          <div className="badge badge-warning">Paused</div>
                        ) : (
                          <div className="badge badge-success">Active</div>
                        )}
                      </div>

                      {/* Urgency Indicator */}
                      {!isExpired && daysLeft <= 7 && (
                        <div className="absolute top-4 left-4">
                          <div className="badge badge-error animate-pulse">
                            🔥 {daysLeft} days left
                          </div>
                        </div>
                      )}
                    </figure>
                    
                    <div className="card-body">
                      <h3 className="card-title font-heading">
                        Help {campaign.petName}
                      </h3>
                      
                      <p className="text-base-content/70 mb-6 line-clamp-2 font-body">
                        {campaign.shortDescription}
                      </p>
                      
                      {/* Progress Section */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center text-base-content/70">
                            <TrendingUp size={16} className="mr-2 text-success" />
                            <span className="font-body font-semibold">
                              {formatCurrency(campaign.currentAmount)} raised
                            </span>
                          </div>
                          <div className="flex items-center text-base-content/70">
                            <Target size={16} className="mr-2 text-info" />
                            <span className="font-body">
                              {formatCurrency(campaign.maxAmount)} goal
                            </span>
                          </div>
                        </div>
                        
                        <progress 
                          className="progress progress-primary w-full" 
                          value={progressPercentage} 
                          max="100"
                        ></progress>
                        
                        <div className="flex justify-between text-sm font-body mt-2">
                          <span className="text-base-content/70">
                            {progressPercentage.toFixed(1)}% funded
                          </span>
                          <span className="text-base-content/70">
                            {campaign.donations?.length || 0} donors
                          </span>
                        </div>
                      </div>
                      
                      {/* Time Left */}
                      <div className="mb-6 flex items-center text-base-content/70 font-body">
                        <Clock size={16} className="mr-2 text-warning" />
                        {isExpired ? (
                          <span className="text-error font-semibold">Campaign ended</span>
                        ) : (
                          <span>{daysLeft} days remaining</span>
                        )}
                      </div>
                      
                      <div className="card-actions justify-end">
                        <Link to={`/donations/${campaign._id}`}>
                          <Button className="flex items-center gap-2">
                            <Heart size={18} />
                            Donate Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="flex justify-center py-12">
              {isFetchingNextPage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
                </div>
              ) : hasNextPage ? (
                <div className="text-center">
                  <div className="text-2xl mb-4">💝</div>
                  <p className="text-base-content/70 font-body text-lg">
                    Scroll to discover more campaigns...
                  </p>
                </div>
              ) : null}
            </div>

            {!hasNextPage && campaigns.length > 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-6">🎉</div>
                <h3 className="text-2xl font-heading font-bold text-base-content mb-2">
                  You've seen all campaigns!
                </h3>
                <p className="text-base-content/70 font-body text-lg">
                  Check back soon for new campaigns to support.
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