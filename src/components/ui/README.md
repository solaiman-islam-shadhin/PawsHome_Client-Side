# UI Components Guide

## Loading Components

### LoadingScreen.jsx

Three loader variants for different use cases:

#### 1. FullPageLoader
Fixed overlay loader for critical operations.
```jsx
import { FullPageLoader } from './LoadingScreen';

<FullPageLoader />
```

#### 2. PageLoader
Full-page centered loader for route transitions.
```jsx
import { PageLoader } from './LoadingScreen';

if (isLoading) {
  return <PageLoader />;
}
```

#### 3. InlineLoader
Small inline loader for buttons and actions.
```jsx
import { InlineLoader } from './LoadingScreen';

<Button disabled={isLoading}>
  {isLoading ? <InlineLoader text="Saving..." /> : 'Save'}
</Button>
```

### LoadingSkeleton.jsx

Skeleton loaders matching different layouts:

#### PetCardSkeleton
Single pet card skeleton.
```jsx
import { PetCardSkeleton } from './LoadingSkeleton';

<PetCardSkeleton />
```

#### PetGridSkeleton
Grid of pet cards (default 6).
```jsx
import { PetGridSkeleton } from './LoadingSkeleton';

<PetGridSkeleton count={9} />
```

#### TableSkeleton
Table rows skeleton (default 5 rows, 4 cols).
```jsx
import { TableSkeleton } from './LoadingSkeleton';

<TableSkeleton rows={10} cols={6} />
```

#### ProfileSkeleton
User profile skeleton.
```jsx
import { ProfileSkeleton } from './LoadingSkeleton';

<ProfileSkeleton />
```

#### FormSkeleton
Form fields skeleton.
```jsx
import { FormSkeleton } from './LoadingSkeleton';

<FormSkeleton />
```

#### DetailPageSkeleton
Detail page layout skeleton.
```jsx
import { DetailPageSkeleton } from './LoadingSkeleton';

<DetailPageSkeleton />
```

#### CardListSkeleton
List of cards skeleton (default 3).
```jsx
import { CardListSkeleton } from './LoadingSkeleton';

<CardListSkeleton count={5} />
```

## Usage Pattern

```jsx
import { useQuery } from '@tanstack/react-query';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  // Loading state
  if (isLoading) {
    return <TableSkeleton rows={5} cols={4} />;
  }

  // Error state
  if (error) {
    return <div className="text-red-600">Error loading data</div>;
  }

  // Empty state
  if (!data || data.length === 0) {
    return <div className="text-center">No data available</div>;
  }

  // Success state
  return <div>{/* render data */}</div>;
};
```

## Dark Mode

All loaders automatically support dark mode through the `useTheme()` hook:
- Light mode: Gray-100 base, Gray-200 highlight
- Dark mode: Gray-700 base, Gray-800 highlight

No additional configuration needed!

## Performance Tips

1. Use skeletons that match your final layout
2. Keep skeleton counts reasonable (3-10 items)
3. Use InlineLoader for quick actions
4. Use PageLoader for full-page transitions
5. Always provide error and empty states
