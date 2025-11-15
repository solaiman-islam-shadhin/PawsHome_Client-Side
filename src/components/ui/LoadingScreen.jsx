import { useTheme } from '../../context/ThemeContext';

export const FullPageLoader = () => {
  const { isDark } = useTheme();

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'} z-50`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className={`absolute inset-0 rounded-full border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin`}></div>
        </div>
        <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading...</p>
      </div>
    </div>
  );
};

export const PageLoader = () => {
  const { isDark } = useTheme();

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className={`absolute inset-0 rounded-full border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin`}></div>
        </div>
        <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading...</p>
      </div>
    </div>
  );
};

export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
};
