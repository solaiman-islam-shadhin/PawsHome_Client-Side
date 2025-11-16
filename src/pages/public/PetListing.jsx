import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MapPin, Calendar, Grid, List } from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { petAPI } from '../../services/api';
import { generateMockPets } from '../../utils/mockData';
import Button from '../../components/ui/Button';
import { PetCardSkeleton } from '../../components/ui/LoadingSkeleton';

const PetListing = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [viewMode, setViewMode] = useState('grid');

  const {
    items: pets,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref
  } = useInfiniteScroll(
    ['pets', filters],
    ({ pageParam = 1 }) => {
      console.log('Fetching page:', pageParam, 'with filters:', filters);
      return petAPI.getAllPets({ 
        page: 1, 
        search: filters.search, 
        category: filters.category,
        sort: 'createdAt',
        order: 'desc'
      }).then(response => {
        // Create infinite scroll with real data by cycling through items
        const realData = response.data || [];
        if (realData.length === 0) return { data: [], nextPage: null };
        
        // Show all database items and duplicate them for infinite scroll
        const pageData = realData.map((item, index) => ({
          ...item,
          // Keep original _id for routing, but add unique key for React
          displayId: `${item._id}-page${pageParam}-${index}`,
          // Keep original name without page numbers
        }));
        
        return {
          data: pageData,
          nextPage: pageParam + 1 // Always has next page for infinite scroll
        };
      });
    }
  );

  console.log('Infinite scroll state:', { pets: pets.length, isLoading, isFetchingNextPage, hasNextPage });

  const categories = [
    { value: '', label: 'All Categories', icon: '🐾' },
    { value: 'cat', label: 'Cats', icon: '🐱' },
    { value: 'dog', label: 'Dogs', icon: '🐕' },
    { value: 'rabbit', label: 'Rabbits', icon: '🐰' },
    { value: 'fish', label: 'Fish', icon: '🐠' },
    { value: 'bird', label: 'Birds', icon: '🦜' },
    { value: 'other', label: 'Others', icon: '🦎' }
  ];

  const handleSearchChange = (value) => {
    setSearch(value);
    setFilters({ search: value, category });
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setFilters({ search, category: value });
  };

  return (
    <div className="min-h-screen bg-base-200 font-body">
      {/* Hero Header */}
      <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-heading font-bold mb-4">
              Find Your Perfect Match
            </h1>
            <p className="text-xl font-body">
              Discover amazing pets waiting for their forever homes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="card bg-base-100 shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              <input
                type="text"
                placeholder="Search by name, breed, or description..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="input input-bordered w-full pl-12 font-body"
              />
            </div>
            
            {/* Category Filter */}
            <div className="w-full lg:w-64">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="select select-bordered w-full font-body"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="join">
              <button
                onClick={() => setViewMode('grid')}
                className={`btn join-item ${viewMode === 'grid' ? 'btn-active' : ''}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn join-item ${viewMode === 'list' ? 'btn-active' : ''}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && pets.length > 0 && (
          <div className="mb-6">
            <p className="text-base-content/70 font-body">
              Found {pets.length} amazing pets waiting for homes
            </p>
          </div>
        )}

        {/* Pet Grid/List */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 9 }).map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-3xl font-heading font-bold text-base-content mb-3">
              No pets found
            </h3>
            <p className="text-lg text-base-content/70 font-body max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new arrivals.
            </p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {pets.map((pet, index) => (
                viewMode === 'grid' ? (
                  // Grid View Card
                  <div key={pet.displayId || pet._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <figure className="h-64">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </figure>
                    
                    <div className="card-body">
                      <div className="badge badge-primary">{pet.category}</div>
                      <h3 className="card-title font-heading">{pet.name}</h3>
                      
                      <div className="space-y-2 mb-4 font-body text-base-content/70">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-3 text-primary" />
                          <span>{pet.age} years old</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-3 text-primary" />
                          <span>{pet.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-base-content/70 mb-6 line-clamp-2 font-body text-sm">
                        {pet.shortDescription}
                      </p>
                      
                      <div className="card-actions justify-end">
                        <Link to={`/pets/${pet._id}`}>
                          <Button className="flex items-center gap-2">
                            <Heart size={18} />
                            Meet {pet.name}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View Card
                  <div key={pet.displayId || pet._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="card-body">
                      <div className="flex flex-col md:flex-row gap-6">
                        <figure className="md:w-64 h-48 md:h-auto">
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </figure>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="badge badge-primary mb-2">{pet.category}</div>
                            <h3 className="card-title font-heading mb-3">{pet.name}</h3>
                            
                            <div className="flex flex-wrap gap-4 mb-4 font-body text-base-content/70">
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-2 text-primary" />
                                <span>{pet.age} years old</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin size={16} className="mr-2 text-primary" />
                                <span>{pet.location}</span>
                              </div>
                            </div>
                            
                            <p className="text-base-content/70 font-body mb-4">
                              {pet.shortDescription}
                            </p>
                          </div>
                          
                          <div className="card-actions justify-end">
                            <Link to={`/pets/${pet._id}`}>
                              <Button className="flex items-center gap-2">
                                <Heart size={18} />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="flex justify-center py-12">
              {isFetchingNextPage ? (
                <div className={`grid gap-6 w-full ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
                </div>
              ) : hasNextPage ? (
                <div className="text-center">
                  <div className="text-2xl mb-4">🐾</div>
                  <p className="text-base-content/70 font-body text-lg">
                    Scroll to discover more amazing pets...
                  </p>
                </div>
              ) : null}
            </div>

            {!hasNextPage && pets.length > 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-6">❤️</div>
                <h3 className="text-2xl font-heading font-bold text-base-content mb-2">
                  You've seen them all!
                </h3>
                <p className="text-base-content/70 font-body text-lg">
                  Check back soon for new arrivals looking for homes.
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