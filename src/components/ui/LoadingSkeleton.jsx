import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonWrapper = ({ children }) => {
  return (
    <SkeletonTheme baseColor="hsl(var(--b2))" highlightColor="hsl(var(--b3))">
      {children}
    </SkeletonTheme>
  );
};

export const PetCardSkeleton = () => {
  return (
    <SkeletonWrapper>
      <div className="card bg-base-100 shadow-xl">
        <Skeleton height={200} />
        <div className="card-body space-y-2">
          <Skeleton height={20} width="70%" />
          <Skeleton height={16} width="50%" />
          <Skeleton height={16} width="60%" />
          <Skeleton height={36} />
        </div>
      </div>
    </SkeletonWrapper>
  );
};

export const PetGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PetCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <SkeletonWrapper>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              {Array.from({ length: cols }).map((_, j) => (
                <div key={j} className="flex-1">
                  <Skeleton height={40} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SkeletonWrapper>
  );
};

export const ProfileSkeleton = () => {
  return (
    <SkeletonWrapper>
      <div className="flex items-center space-x-4">
        <Skeleton circle height={40} width={40} />
        <div className="space-y-1">
          <Skeleton height={16} width={120} />
          <Skeleton height={14} width={80} />
        </div>
      </div>
    </SkeletonWrapper>
  );
};

export const FormSkeleton = () => {
  return (
    <SkeletonWrapper>
      <div className="space-y-4">
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={100} />
        <Skeleton height={40} width="30%" />
      </div>
    </SkeletonWrapper>
  );
};

export const DetailPageSkeleton = () => {
  return (
    <SkeletonWrapper>
      <div className="space-y-6">
        <Skeleton height={300} />
        <div className="space-y-4">
          <Skeleton height={24} width="60%" />
          <Skeleton height={16} width="40%" />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={40} width="30%" />
        </div>
      </div>
    </SkeletonWrapper>
  );
};

export const CardListSkeleton = ({ count = 3 }) => {
  return (
    <SkeletonWrapper>
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl">
            <div className="card-body space-y-3">
              <Skeleton height={20} width="50%" />
              <Skeleton height={16} width="70%" />
              <Skeleton height={16} width="60%" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonWrapper>
  );
};