import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../../context/ThemeContext';

export const PetCardSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <SkeletonTheme baseColor={isDark ? "#374151" : "#f3f4f6"} highlightColor={isDark ? "#4b5563" : "#e5e7eb"}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <Skeleton height={200} />
        <div className="p-4 space-y-2">
          <Skeleton height={20} width="70%" />
          <Skeleton height={16} width="50%" />
          <Skeleton height={16} width="60%" />
          <Skeleton height={36} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  const { isDark } = useTheme();
  
  return (
    <SkeletonTheme baseColor={isDark ? "#374151" : "#f3f4f6"} highlightColor={isDark ? "#4b5563" : "#e5e7eb"}>
      <div className="space-y-2">
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
    </SkeletonTheme>
  );
};

export const ProfileSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <SkeletonTheme baseColor={isDark ? "#374151" : "#f3f4f6"} highlightColor={isDark ? "#4b5563" : "#e5e7eb"}>
      <div className="flex items-center space-x-4">
        <Skeleton circle height={40} width={40} />
        <div className="space-y-1">
          <Skeleton height={16} width={120} />
          <Skeleton height={14} width={80} />
        </div>
      </div>
    </SkeletonTheme>
  );
};
