import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import Select from 'react-select';
import { petAPI, uploadImage } from '../../services/api';

const schema = yup.object({
  name: yup.string().required('Pet name is required'),
  age: yup.number().typeError('Age must be a number').positive('Age must be positive').required('Age is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  shortDescription: yup.string().max(200, 'Short description must be under 200 characters').required('Short description is required'),
});

const categories = [
  { value: 'Cat', label: 'Cat' },
  { value: 'Dog', label: 'Dog' },
  { value: 'Rabbit', label: 'Rabbit' },
  { value: 'Fish', label: 'Fish' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Other', label: 'Other' }
];

// UPDATED STYLES FOR SOLID BACKGROUNDS
const reactSelectStyles = (hasError) => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: '48px',
    fontSize: '1rem',
    borderRadius: 'var(--rounded-btn, 0.5rem)',
    borderWidth: '1px',
    borderColor: hasError ? 'var(--p)' : 'hsl(var(--bc))',
    boxShadow: state.isFocused ? '0 0 0 1px var(--p)' : 'none',
    '&:hover': {
      borderColor: hasError ? 'var(--p)' : 'hsl(var(--bc))',
    },
    backgroundColor: 'hsl(var(--b1))', // Input field background
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'hsl(var(--bc))',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'hsl(var(--bc) / 0.4)',
  }),
  
  // CRITICAL FIX: Ensure solid background and high z-index
  menu: (provided) => ({
    ...provided,
    borderRadius: 'var(--rounded-box, 0.5rem)',
    zIndex: 9999, // High z-index to ensure it is above everything
    backgroundColor: 'hsl(var(--b1))', // Guaranteed background color
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  }),

  // CRITICAL FIX: Ensure options are visible
  option: (provided, state) => ({
    ...provided,
    fontSize: '0.875rem',
    color: state.isSelected ? 'hsl(var(--pc))' : 'hsl(var(--bc))',
    
    // Ensure solid, non-transparent option background
    backgroundColor: state.isSelected
      ? 'hsl(var(--p))'
      : state.isFocused
      ? 'hsl(var(--b3))' // Base-300 color when focused
      : 'hsl(var(--b1))', // Base-100 color when not focused/selected
      
    '&:hover': {
      backgroundColor: 'hsl(var(--b3))',
    },
    padding: '0.75rem 1rem',
    transition: 'background-color 0.2s, color 0.2s',
  }),
  
  // FIX: Ensure the dropdown indicator and clear button are visible
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'hsl(var(--bc) / 0.6)', // Base content color, slightly faded
    '&:hover': {
      color: 'hsl(var(--bc))',
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'hsl(var(--bc) / 0.6)',
    '&:hover': {
      color: 'hsl(var(--bc))',
    },
  }),
});


const AddPet = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: '',
      name: '',
      age: '',
      location: '',
      shortDescription: '',
    },
  });

  const addPetMutation = useMutation({
    mutationFn: petAPI.createPet,
    onSuccess: () => {
      toast.success('Pet added successfully!');
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      navigate('/dashboard/my-pets');
    },
    onError: (error) => {
      // Access error response data
      toast.error(error.response?.data?.message || 'Failed to add pet');
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
      
      const petData = {
        ...data,
        image: imageUrl,
        longDescription,
      };

      addPetMutation.mutate(petData);
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-base-content">Add a Pet 🐾</h1>
        <p className="text-content/70 mt-2">
          Help a pet find their forever home by adding them to our platform
        </p>
      </div>

      {/* DaisyUI Card Component */}
      <div className="card w-full bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Pet Image Upload */}
            <div>
              <label className="label">
                <span className="label-text font-bold text-lg">Pet Image *</span>
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center overflow-hidden bg-base-200">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Pet preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload size={32} className="text-base-content/50" />
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
                  <p className="text-sm text-base-content/70">
                    Click to upload a photo of your pet
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Pet Name and Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text">Pet Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter pet's name"
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  {...register('name')}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </label>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Age (years) *</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter pet's age"
                  className={`input input-bordered w-full ${errors.age ? 'input-error' : ''}`}
                  {...register('age')}
                />
                {errors.age && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.age.message}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Category (react-select) and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category: Using react-select with Controller */}
              <div>
                <label className="label">
                  <span className="label-text">Category *</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categories}
                      value={categories.find((c) => c.value === field.value)}
                      onChange={(option) => field.onChange(option.value)}
                      styles={reactSelectStyles(!!errors.category)}
                      placeholder="Select a Category"
                    />
                  )}
                />
                {errors.category && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.category.message}</span>
                  </label>
                )}
              </div>
              
              {/* Location */}
              <div>
                <label className="label">
                  <span className="label-text">Location *</span>
                </label>
                <input
                  type="text"
                  placeholder="Where can the pet be picked up?"
                  className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
                  {...register('location')}
                />
                {errors.location && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.location.message}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="label">
                <span className="label-text">Short Description * (max 200 characters)</span>
              </label>
              <textarea
                placeholder="Brief description about the pet"
                rows={3}
                maxLength={200}
                className={`textarea textarea-bordered w-full ${errors.shortDescription ? 'textarea-error' : ''}`}
                {...register('shortDescription')}
              />
              {errors.shortDescription && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.shortDescription.message}</span>
                </label>
              )}
            </div>

            {/* Detailed Description (MDEditor) */}
            <div>
              <label className="label">
                <span className="label-text font-bold text-lg">Detailed Description * (Markdown Editor)</span>
              </label>
              {/* Note: Keeping the basic border for MDEditor, as it's a third-party component */}
              <div className="border border-base-300 rounded-lg overflow-hidden">
                <MDEditor
                  value={longDescription}
                  onChange={setLongDescription}
                  preview="edit"
                  height={300}
                  data-color-mode="auto" // Detects DaisyUI theme changes
                />
              </div>
              <p className="text-sm text-base-content/70 mt-2">
                Provide detailed information about the pet's personality, health, and care requirements.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/my-pets')}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addPetMutation.isPending}
                className={`btn btn-primary flex-1 ${addPetMutation.isPending ? 'loading' : ''}`}
              >
                {addPetMutation.isPending ? 'Adding Pet...' : 'Add Pet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;