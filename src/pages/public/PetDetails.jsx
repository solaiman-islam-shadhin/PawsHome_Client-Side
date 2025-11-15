import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Calendar, MapPin, User, Heart, ArrowLeft } from 'lucide-react';
import { petAPI, adoptionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { ProfileSkeleton } from '../../components/ui/LoadingSkeleton';

const adoptionSchema = yup.object({
  phoneNumber: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
});

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: pet, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petAPI.getPetById(id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(adoptionSchema),
  });

  const adoptMutation = useMutation({
    mutationFn: (data) => adoptionAPI.createAdoptionRequest({
      petId: id,
      ...data
    }),
    onSuccess: () => {
      toast.success('Adoption request submitted successfully!');
      setShowAdoptModal(false);
      reset();
      queryClient.invalidateQueries(['adoptions']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit adoption request');
    },
  });

  const onSubmitAdoption = (data) => {
    adoptMutation.mutate(data);
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

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Pet not found
          </h1>
          <Link to="/pets">
            <Button>Back to Pet Listing</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && pet.owner._id === user.id;
  const canAdopt = user && !isOwner && !pet.adopted;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/pets"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Pet Listing
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pet Image */}
            <div className="relative">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-96 lg:h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  pet.adopted 
                    ? 'bg-red-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}>
                  {pet.adopted ? 'Adopted' : 'Available'}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {pet.category}
                </span>
              </div>
            </div>

            {/* Pet Details */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {pet.name}
              </h1>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar size={20} className="mr-3 text-blue-600" />
                  <span>{pet.age} years old</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin size={20} className="mr-3 text-blue-600" />
                  <span>{pet.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <User size={20} className="mr-3 text-blue-600" />
                  <div className="flex items-center space-x-2">
                    <img
                      src={pet.owner.photoURL || '/default-avatar.png'}
                      alt={pet.owner.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{pet.owner.name}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  About {pet.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {pet.shortDescription}
                </p>
              </div>

              {canAdopt && (
                <Button
                  onClick={() => setShowAdoptModal(true)}
                  className="w-full mb-4"
                  size="lg"
                >
                  <Heart size={20} className="mr-2" />
                  Adopt {pet.name}
                </Button>
              )}

              {pet.adopted && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    This pet has already been adopted and found their forever home! 🏠❤️
                  </p>
                </div>
              )}

              {!user && (
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 mb-2">
                    Want to adopt {pet.name}?
                  </p>
                  <Link to="/login">
                    <Button variant="outline" className="mr-2">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Long Description */}
          <div className="p-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              More About {pet.name}
            </h3>
            <div 
              className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: pet.longDescription }}
            />
          </div>
        </div>

        {/* Adoption Modal */}
        <Modal
          isOpen={showAdoptModal}
          onClose={() => setShowAdoptModal(false)}
          title={`Adopt ${pet.name}`}
          size="md"
        >
          <form onSubmit={handleSubmit(onSubmitAdoption)} className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    {pet.name}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {pet.category} • {pet.age} years old
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Your Name"
              value={user?.displayName || ''}
              disabled
              className="bg-gray-100 dark:bg-gray-700"
            />

            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              className="bg-gray-100 dark:bg-gray-700"
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                placeholder="Enter your full address"
                rows={3}
                {...register('address')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.address && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdoptModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={adoptMutation.isPending}
                className="flex-1"
              >
                {adoptMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default PetDetails;
