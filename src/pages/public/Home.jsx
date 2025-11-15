import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Users, Award, ArrowRight, PawPrint } from 'lucide-react';
import { petAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { PetCardSkeleton } from '../../components/ui/LoadingSkeleton';

const Home = () => {
  const { data: petsData, isLoading } = useQuery({
    queryKey: ['pets', { limit: 6 }],
    queryFn: () => petAPI.getAllPets({ limit: 6 })
  });

  const categories = [
    { name: 'Dogs', icon: '🐕', count: '150+' },
    { name: 'Cats', icon: '🐱', count: '120+' },
    { name: 'Rabbits', icon: '🐰', count: '45+' },
    { name: 'Birds', icon: '🐦', count: '30+' },
    { name: 'Fish', icon: '🐠', count: '25+' },
    { name: 'Others', icon: '🐾', count: '20+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-yellow-300">Furry Friend</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect with loving pets in need of forever homes. Every adoption saves a life and creates an unbreakable bond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pets">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Browse Pets
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/donations">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Support a Cause
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Happy pets"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="text-red-500" size={24} />
                  <div>
                    <p className="font-bold">500+ Pets</p>
                    <p className="text-sm text-gray-600">Successfully Adopted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find the perfect companion that matches your lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/pets?category=${category.name.toLowerCase()}`}
                className="group bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Featured Pets
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              These adorable companions are looking for their forever homes
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <PetCardSkeleton key={i} />
              ))}
            </div>
          ) : petsData?.data && petsData.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {petsData.data.slice(0, 6).map((pet) => (
                <div key={pet._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pet.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {pet.age} years old • {pet.category}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      📍 {pet.location}
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">No pets available at the moment. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/pets">
              <Button size="lg">
                View All Pets
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PawPrint size={64} className="mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Change a Life?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Every pet deserves a loving home. By adopting, you're not just gaining a companion – 
            you're saving a life and making room for another pet in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pets">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Adopting Today
              </Button>
            </Link>
            <Link to="/donations">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Support Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About PawsHome
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                PawsHome is more than just a pet adoption platform – we're a community dedicated to 
                connecting loving families with pets in need. Our mission is to reduce pet homelessness 
                and ensure every animal finds their perfect match.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Through our platform, we've facilitated hundreds of successful adoptions and raised 
                thousands of dollars for pet care and medical treatments. Join us in making a difference, 
                one paw at a time.
              </p>
              <Link to="/about">
                <Button variant="outline">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900 rounded-xl">
                <Users size={48} className="mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">500+</h3>
                <p className="text-gray-600 dark:text-gray-300">Happy Families</p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900 rounded-xl">
                <Heart size={48} className="mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">750+</h3>
                <p className="text-gray-600 dark:text-gray-300">Pets Adopted</p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900 rounded-xl">
                <Award size={48} className="mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$50K+</h3>
                <p className="text-gray-600 dark:text-gray-300">Funds Raised</p>
              </div>
              <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900 rounded-xl">
                <PawPrint size={48} className="mx-auto mb-4 text-yellow-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24/7</h3>
                <p className="text-gray-600 dark:text-gray-300">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from families who found their perfect companions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah & Max",
                story: "Max was shy when we first met, but now he's the most loving dog. He's brought so much joy to our family!",
                image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "John & Luna",
                story: "Luna was a rescue cat who needed special care. Thanks to PawsHome, we found each other and she's thriving!",
                image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Emma & Buddy",
                story: "Buddy has been the perfect addition to our family. The adoption process was smooth and supportive.",
                image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-3">
                  {story.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center italic">
                  "{story.story}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
