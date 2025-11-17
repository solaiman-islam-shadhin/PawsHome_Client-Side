import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { donationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const schema = yup.object({
  amount: yup.number().min(1, 'Minimum donation is $1').required('Amount is required'),
});

const DonationForm = ({ campaign, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { amount: 10 }
  });

  const amount = watch('amount');

  const donateMutation = useMutation({
    mutationFn: donationAPI.donate,
    onSuccess: () => {
      toast.success('Thank you for your donation!');
      queryClient.invalidateQueries(['donation', campaign._id]);
      queryClient.invalidateQueries(['donations']);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Donation failed');
    },
  });

  const onSubmit = async (data) => {
    if (!stripe || !elements || !user) {
      toast.error('Please sign in to make a donation');
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      // Process donation
      await donateMutation.mutateAsync({
        campaignId: campaign._id,
        amount: data.amount,
        paymentMethodId: paymentMethod.id,
      });

    } catch (error) {
      console.error('Donation error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'white',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Campaign Info */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <img
            src={campaign.petImage}
            alt={campaign.petName}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              {campaign.petName}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Goal: ${campaign.maxAmount} • Raised: ${campaign.currentAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Donation Amount */}
      <div>
        <Input
          label="Donation Amount ($)"
          type="number"
          min="1"
          step="0.01"
          placeholder="Enter amount"
          {...register('amount')}
          error={errors.amount?.message}
        />
        
        {/* Quick Amount Buttons */}
        <div className="flex space-x-2 mt-2">
          {[5, 10, 25, 50, 100].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => register('amount').onChange({ target: { value: quickAmount } })}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                amount == quickAmount
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>

      {/* Card Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Donor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          value={user?.displayName || ''}
          disabled
          className="bg-gray-100 dark:bg-gray-600"
        />
        <Input
          label="Email"
          value={user?.email || ''}
          disabled
          className="bg-gray-100 dark:bg-gray-600"
        />
      </div>

      {/* Summary */}
      {amount && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-white">
              Total Donation:
            </span>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              ${amount}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Your donation will help {campaign.petName} get the care they need.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || processing || donateMutation.isPending}
        className="w-full"
        size="lg"
      >
        {processing || donateMutation.isPending 
          ? 'Processing...' 
          : `Donate $${amount || 0}`
        }
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Your payment is secure and encrypted. You can request a refund within 30 days.
      </p>
    </form>
  );
};

export default DonationForm;
