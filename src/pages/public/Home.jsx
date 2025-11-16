import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Users, Award, ArrowRight, PawPrint, Star, Shield, Clock } from 'lucide-react';
import { petAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { PetCardSkeleton } from '../../components/ui/LoadingSkeleton';

// Counter component
const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={counterRef} className="stat-value font-heading">
      {count}{suffix}
    </span>
  );
};

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=400&fit=crop'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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
      <div className="hero py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content flex-col lg:flex-row max-w-7xl gap-12">
          <div className="lg:w-3/5 relative order-2 lg:order-1">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Pet ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    index === currentImageIndex 
                      ? 'opacity-100 blur-0 scale-100' 
                      : 'opacity-0 blur-sm scale-105'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
          <div className="lg:w-2/5 text-center lg:text-left text-primary-content order-1 lg:order-2">
            <div className="badge badge-outline mb-4">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ families
            </div>
            <h1 className="text-5xl font-heading font-bold mb-6">
              Your Perfect Pet Awaits
            </h1>
            <p className="py-6 font-body text-lg">
              Discover loving companions ready to become part of your family. Every adoption creates a beautiful story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/pets">
                <Button  className="btn-accent">
                  <PawPrint className="mr-2" size={20} />
                  Find Your Pet
                </Button>
              </Link>
              <Link to="/donations">
                <Button  variant="outline">
                  Support Rescue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-base-content mb-4">
              Why Choose PawsHome?
            </h2>
            <p className="text-xl text-base-content/70 font-body">
              We make pet adoption safe, simple, and meaningful for everyone involved.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Pets",
                description: "All pets are health-checked and verified by our trusted partners"
              },
              {
                icon: Heart,
                title: "Perfect Matches",
                description: "Our smart matching system helps you find the ideal companion"
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Get help anytime during your adoption journey and beyond"
              }
            ].map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-primary flex justify-center items-center text-primary-content rounded-full w-16">
                      <feature.icon size={40} />
                    </div>
                  </div>
                  <h3 className="card-title font-heading">{feature.title}</h3>
                  <p className="font-body">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pet Categories */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-base-content mb-4">
              Find by Category
            </h2>
            <p className="text-xl text-base-content/70 font-body">
              Discover the perfect companion that matches your lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/pets?category=${category.name.toLowerCase()}`}
                className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
              >
                <div className="card-body items-center text-center p-6">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="font-heading font-bold">{category.name}</h3>
                  <p className="text-sm text-base-content/70 font-body">{category.count} available</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-base-content mb-4">
              Meet Our Stars
            </h2>
            <p className="text-xl text-base-content/70 font-body">
              These amazing pets are ready to steal your heart
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
                <div key={pet._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <figure className="h-64">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="badge badge-primary">{pet.category}</div>
                    <h3 className="card-title font-heading">{pet.name}</h3>
                    <div className="flex items-center text-base-content/70 mb-4 font-body">
                      <span className="mr-4">🎂 {pet.age} years</span>
                      <span>📍 {pet.location}</span>
                    </div>
                    <div className="card-actions justify-end">
                      <Link to={`/pets/${pet._id}`}>
                        <Button>
                          <Heart className="mr-2" size={18} />
                          Meet {pet.name}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐾</div>
              <p className="text-base-content/70 text-lg font-body">
                No pets available at the moment. Check back soon!
              </p>
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

      {/* Stats Section */}
      <section className="py-20 bg-neutral text-neutral-content">
        <div className="max-w-7xl mx-auto px-4">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Heart size={32} />
              </div>
              <div className="stat-title">Pets Adopted</div>
              <Counter end={750} suffix="+" />
            </div>
            
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users size={32} />
              </div>
              <div className="stat-title">Happy Families</div>
              <Counter end={500} suffix="+" />
            </div>
            
            <div className="stat">
              <div className="stat-figure text-accent">
                <Award size={32} />
              </div>
              <div className="stat-title">Funds Raised</div>
              <Counter end={50} suffix="K+" />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-base-content mb-4">
              About PawsHome
            </h2>
            <p className="text-xl text-base-content/70 font-body max-w-3xl mx-auto">
              PawsHome is a passionate community dedicated to connecting loving families with pets in need of a forever home. Our mission is to make pet adoption a simple, joyful, and safe experience for everyone.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop" 
                alt="Happy dog" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div className="lg:w-1/2 font-body text-lg text-base-content/80">
              <p className="mb-4">
                We believe every pet deserves a second chance. Our platform features pets from trusted shelters and rescue organizations. We provide detailed profiles and a seamless adoption process to help you find your perfect match.
              </p>
              <p>
                Beyond adoption, PawsHome is a hub for pet lovers. You can support our cause through donation campaigns, ensuring that every animal receives the care it needs until it finds its family. Join us in making a difference, one paw at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero py-20 bg-gradient-to-r from-secondary to-accent">
        <div className="hero-content text-center text-secondary-content">
          <div className="max-w-md">
            <PawPrint size={64} className="mx-auto mb-6" />
            <h2 className="text-4xl font-heading font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="py-6 font-body">
              Every adoption saves a life and creates space for another rescue. 
              Start your journey to finding the perfect companion today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pets">
                <Button size="lg" className="btn-neutral">
                  <Heart className="mr-2" size={20} />
                  Adopt Now
                </Button>
              </Link>
              <Link to="/donations">
                <Button size="lg" variant="outline">
                  Donate Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;