import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { donationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import DonationForm from '../../components/forms/DonationForm';
import { ProfileSkeleton, PetCardSkeleton } from '../../components/ui/LoadingSkeleton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DonationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showDonateModal, setShowDonateModal] = useState(false);

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['donation', id],
    queryFn: () => donationAPI.getCampaignById(id),
  });

  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['donation-recommendations', id],
    queryFn: () => donationAPI.getRecommendations(id),
    enabled: !!campaign,
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Campaign not found
          </h1>
          <Link to="/donations">
            <Button>Back to Campaigns</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = user && campaign.creator === user.uid;
  const progressPercentage = getProgressPercentage(campaign.currentAmount, campaign.maxAmount);
  const daysLeft = getDaysLeft(campaign.lastDate);
  const isExpired = daysLeft === 0;
  const isPaused = campaign.isPaused;
  const canDonate = !isExpired && !isPaused && !isCreator;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/donations"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Campaigns
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={campaign.petImage}
                alt={campaign.petName}
                className="w-full h-96 lg:h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                {isPaused ? (
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Paused
                  </span>
                ) : isExpired ? (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Expired
                  </span>
                ) : (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Help {campaign.petName}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {campaign.shortDescription}
              </p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(campaign.currentAmount)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    of {formatCurrency(campaign.maxAmount)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {progressPercentage.toFixed(1)}% funded • {campaign.donations?.length || 0} donors
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Calendar size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm">Days left</p>
                    <p className="font-semibold">{daysLeft}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Users size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm">Donors</p>
                    <p className="font-semibold">{campaign.donations?.length || 0}</p>
                  </div>
                </div>
              </div>

              {isCreator && (
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    This is your campaign. You cannot donate to your own campaign.
                  </p>
                </div>
              )}

              {canDonate ? (
                <Button
                  onClick={() => setShowDonateModal(true)}
                  className="w-full mb-4"
                  size="lg"
                >
                  Donate Now
                </Button>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-center">
                    {isPaused ? 'This campaign is currently paused' : isExpired ? 'This campaign has ended' : ''}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={campaign.creator?.photoURL || '/default-avatar.png'}
                  alt={campaign.creator?.name}
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy='no-referrer'
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {campaign.creator?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Campaign organizer
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Campaign Story
            </h3>
            <div 
              className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: campaign.longDescription }}
            />
          </div>

          {campaign.donations && campaign.donations.length > 0 && (
            <div className="p-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Donors
              </h3>
              <div className="space-y-3">
                {campaign.donations.slice(0, 5).map((donation, index) => (
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
            </div>
          )}
        </div>

        {recommendations && recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Other Campaigns You Might Like
            </h2>
            
            {loadingRecommendations ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PetCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((rec) => (
                  <div key={rec._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <img
                      src={rec.petImage}
                      alt={rec.petName}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {rec.petName}
                      </h3>
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${getProgressPercentage(rec.currentAmount, rec.maxAmount)}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {formatCurrency(rec.currentAmount)} of {formatCurrency(rec.maxAmount)}
                        </p>
                      </div>
                      <Link to={`/donations/${rec._id}`}>
                        <Button size="sm" className="w-full">
                          View Campaign
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={showDonateModal}
          onClose={() => setShowDonateModal(false)}
          title={`Donate to ${campaign.petName}`}
          size="md"
        >
          <Elements stripe={stripePromise}>
            <DonationForm
              campaign={campaign}
              onSuccess={() => setShowDonateModal(false)}
            />
          </Elements>
        </Modal>
      </div>
    </div>
  );
};

export default DonationDetails;
