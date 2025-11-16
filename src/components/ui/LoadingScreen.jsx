export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-100 z-50">
      <div className="flex flex-col items-center space-y-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-lg font-medium text-base-content font-body">Loading...</p>
      </div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="flex flex-col items-center space-y-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-lg font-medium text-base-content font-body">Loading...</p>
      </div>
    </div>
  );
};

export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="loading loading-spinner loading-sm text-primary"></span>
      <span className="text-sm text-base-content/70 font-body">{text}</span>
    </div>
  );
};