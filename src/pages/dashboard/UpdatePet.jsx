import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { petAPI, uploadImage } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ProfileSkeleton } from '../../components/ui/LoadingSkeleton';

const schema = yup.object({
  name: yup.string().required('Pet name is required'),
  age: yup.number().positive('Age must be positive').required('Age is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  shortDescription: yup.string().max(200, 'Short description must be under 200 characters').required('Short description is required'),
});

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [longDescription, setLongDescription] = useState('');

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petAPI.getPetById(id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (pet) {
      reset({
        name: pet.name,
        age: pet.age,
        category: pet.category,
        location: pet.location,
        shortDescription: pet.shortDescription,
      });
      setLongDescription(pet.longDescription);
      setImagePreview(pet.image);
    }
  }, [pet, reset]);

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }) => petAPI.updatePet(id, data),
    onSuccess: () => {
      toast.success('Pet updated successfully!');
      queryClient.invalidateQueries(['pets']);
      queryClient.invalidateQueries(['pet', id]);
      navigate('/dashboard/my-pets');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update pet');
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
    if (!longDescription.trim()) {
      toast.error('Please provide a detailed description');
      return;
    }

    try {
      let imageUrl = pet.image;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const petData = {
        ...data,
        image: imageUrl,
        longDescription,
      };

      updatePetMutation.mutate({ id, data: petData });
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const categories = [
    { value: 'Cat', label: 'Cat' },
    { value: 'Dog', label: 'Dog' },
    { value: 'Rabbit', label: 'Rabbit' },
    { value: 'Fish', label: 'Fish' },
    { value: 'Bird', label: 'Bird' },
    { value: 'Other', label: 'Other' }
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Update Pet</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Update {pet?.name}'s information
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Pet Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pet Image
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
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload a new photo (optional)
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
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="Age (years)"
              type="number"
              min="0"
              step="0.1"
              placeholder="Enter pet's age"
              {...register('age')}
              error={errors.age?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <Input
              label="Location"
              placeholder="Where can the pet be picked up?"
              {...register('location')}
              error={errors.location?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Short Description
            </label>
            <textarea
              placeholder="Brief description about the pet (max 200 characters)"
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
              Detailed Description
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
          </div>

          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/my-pets')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePetMutation.isPending}
              className="flex-1"
            >
              {updatePetMutation.isPending ? 'Updating...' : 'Update Pet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePet;
