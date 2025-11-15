import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { petAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PetCardSkeleton } from '../../components/ui/LoadingSkeleton';

const PetListing = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '' });

  const {
    items: pets,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteScroll(
    ['pets', filters],
    ({ pageParam = 1 }) => petAPI.getAllPets({ 
      page: pageParam, 
      search: filters.search, 
      category: filters.category 
    })
  );

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'cat', label: 'Cats' },
    { value: 'dog', label: 'Dogs' },
    { value: 'rabbit', label: 'Rabbits' },
    { value: 'fish', label: 'Fish' },
    { value: 'bird', label: 'Birds' },
    { value: 'other', label: 'Others' }
  ];

  const handleSearch = () => {
    setFilters({ search, category });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Pet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Browse through our available pets looking for loving homes
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search pets by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <Button onClick={handleSearch} className="md:w-auto">
              <Filter size={20} className="mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Pet Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No pets found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or check back later for new pets.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet) => (
                <div key={pet._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {pet.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pet.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600 dark:text-gray-300 flex items-center">
                        <span className="mr-2">🎂</span>
                        {pet.age} years old
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 flex items-center">
                        <span className="mr-2">📍</span>
                        {pet.location}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {pet.shortDescription}
                    </p>
                    
                    <Link to={`/pets/${pet._id}`}>
                      <Button className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <PetCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    Scroll down to load more pets...
                  </div>
                )}
              </div>
            )}

            {!hasNextPage && pets.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  You've seen all available pets! Check back later for new additions.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PetListing;
