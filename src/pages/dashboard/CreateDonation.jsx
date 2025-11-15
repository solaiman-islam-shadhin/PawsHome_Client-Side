import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { donationAPI, uploadImage } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = yup.object({
  petName: yup.string().required('Pet name is required'),
  maxAmount: yup.number().min(1, 'Amount must be at least $1').required('Maximum amount is required'),
  lastDate: yup.date().min(new Date(), 'End date must be in the future').required('End date is required'),
  shortDescription: yup.string().max(200, 'Short description must be under 200 characters').required('Short description is required'),
});

const CreateDonation = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const createDonationMutation = useMutation({
    mutationFn: donationAPI.createCampaign,
    onSuccess: () => {
      toast.success('Donation campaign created successfully!');
      queryClient.invalidateQueries(['donations']);
      navigate('/dashboard/my-donations');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      toast.error('Please select a pet image');
      return;
    }

    if (!longDescription.trim()) {
      toast.error('Please provide a detailed description');
      return;
    }

    try {
      const imageUrl = await uploadImage(imageFile);
      
      const campaignData = {
        ...data,
        petImage: imageUrl,
        longDescription,
      };

      createDonationMutation.mutate(campaignData);
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Donation Campaign</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Start a fundraising campaign to help a pet in need
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pet Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pet Image *
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Pet preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload size={32} className="text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload a photo of the pet
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Pet Name"
              placeholder="Enter pet's name"
              {...register('petName')}
              error={errors.petName?.message}
            />

            <Input
              label="Maximum Donation Amount ($)"
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter target amount"
              {...register('maxAmount')}
              error={errors.maxAmount?.message}
            />
          </div>

          <Input
            label="Campaign End Date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...register('lastDate')}
            error={errors.lastDate?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Short Description *
            </label>
            <textarea
              placeholder="Brief description about why this pet needs help (max 200 characters)"
              rows={3}
              maxLength={200}
              {...register('shortDescription')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.shortDescription && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detailed Campaign Story *
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <MDEditor
                value={longDescription}
                onChange={setLongDescription}
                preview="edit"
                height={300}
                data-color-mode="auto"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tell the story of why this pet needs help. Include medical conditions, treatment costs, or other relevant details.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Campaign Guidelines
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Be honest and transparent about the pet's needs</li>
              <li>• Provide clear information about how funds will be used</li>
              <li>• Upload recent photos of the pet</li>
              <li>• Set a realistic fundraising goal</li>
              <li>• Keep donors updated on the pet's progress</li>
            </ul>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/my-donations')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createDonationMutation.isPending}
              className="flex-1"
            >
              {createDonationMutation.isPending ? 'Creating Campaign...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonation;
