import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactUS = () => {

      const contactInfo = [
    { 
      label: 'Email Address',
      detail: 'support@pawshome.com', 
      icon: Mail, 
      link: 'mailto:support@pawshome.com',
      color: 'text-blue-500'
    },
    { 
      label: 'Phone Number',
      detail: '+880 1882808656', 
      icon: Phone, 
      
      color: 'text-green-500'
    },
    { 
      label: 'Office Address',
      detail: '108/2, Green Road, Dhaka, Bangladesh', 
      icon: MapPin, 
      color: 'text-red-500'
    },
  ];

    return (
        <div>
            <div className="min-h-screen flex items-start justify-center bg-base-200 py-16 px-4">
                {/* DaisyUI Card Component */}
                <div className="card w-full max-w-lg bg-accent-content shadow-xl rounded-2xl border border-base-content/20">

                    <div className="card-body p-8 sm:p-10 text-center">
                        <h1 className="card-title justify-center text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                            Contact Us
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-10">
                            We are here to help and answer any questions you might have.
                        </p>

                        <div className="space-y-8">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-inner transition hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 duration-300">

                                    {/* Icon */}
                                    <item.icon className={`w-8 h-8 ${item.color} mb-3`} />

                                    {/* Label */}
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {item.label}
                                    </h3>

                                    {/* Detail/Link */}
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {item.detail}
                                        </a>
                                    ) : (
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            {item.detail}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="divider text-gray-400 dark:text-gray-600 my-8">
                            --- Office Hours ---
                        </div>

                        <div className="space-y-2 text-gray-700 dark:text-gray-300">
                            <p className="font-medium">Mon - Fri: 9:00 AM - 5:00 PM</p>
                            <p className="font-medium">Saturday: 10:00 AM - 2:00 PM</p>
                            <p className="text-sm">Sunday: Closed</p>
                        </div>

                    </div>
                </div>
            </div>
    </div>
    )
}
