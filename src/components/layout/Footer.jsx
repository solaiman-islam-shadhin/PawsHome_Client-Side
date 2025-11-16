import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-base-300 to-base-200 text-base-content relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🐕</div>
        <div className="absolute top-20 right-20 text-4xl">🐱</div>
        <div className="absolute bottom-20 left-1/4 text-5xl">🐾</div>
        <div className="absolute bottom-10 right-1/3 text-3xl">❤️</div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="bg-primary text-primary-content py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-heading font-bold mb-4">Stay Connected</h3>
            <p className="text-lg font-body mb-6 opacity-90">
              Get updates on new pets, adoption success stories, and ways to help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input input-bordered flex-1 text-base-content" 
              />
              <button className="btn btn-secondary">
                <Send size={16} className="mr-2" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10 max-w-7xl mx-auto">
          <aside className="max-w-sm">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🐾</span>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PawsHome
              </span>
            </div>
            <p className="font-body text-base-content/80 leading-relaxed mb-4">
              Connecting loving families with pets in need. Every adoption saves a life and creates a forever bond filled with unconditional love.
            </p>
            <div className="flex items-center space-x-2 font-body">
              <Heart size={16} className="text-error animate-pulse" />
              <span className="text-sm font-medium">Made with love for our furry friends</span>
            </div>
          </aside>
          
          <nav>
            <h6 className="footer-title font-heading text-lg mb-4">Quick Links</h6>
            <Link to="/" className="link link-hover font-body hover:text-primary transition-colors">🏠 Home</Link>
            <Link to="/pets" className="link link-hover font-body hover:text-primary transition-colors">🐕 Pet Listing</Link>
            <Link to="/donations" className="link link-hover font-body hover:text-primary transition-colors">💝 Donations</Link>
            <Link to="/about" className="link link-hover font-body hover:text-primary transition-colors">ℹ️ About Us</Link>
            <Link to="/contact" className="link link-hover font-body hover:text-primary transition-colors">📞 Contact</Link>
          </nav>
          
          <nav>
            <h6 className="footer-title font-heading text-lg mb-4">Get In Touch</h6>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 font-body hover:text-primary transition-colors cursor-pointer">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Mail size={16} className="text-primary" />
                </div>
                <span>info@pawshome.com</span>
              </div>
              <div className="flex items-center space-x-3 font-body hover:text-primary transition-colors cursor-pointer">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Phone size={16} className="text-primary" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 font-body hover:text-primary transition-colors cursor-pointer">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin size={16} className="text-primary" />
                </div>
                <span>123 Pet Street, Animal City</span>
              </div>
            </div>
          </nav>

          <nav>
            <h6 className="footer-title font-heading text-lg mb-4">Follow Us</h6>
            <div className="flex space-x-3">
              <a href="#" className="btn btn-circle btn-outline btn-sm hover:btn-primary transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="btn btn-circle btn-outline btn-sm hover:btn-primary transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="btn btn-circle btn-outline btn-sm hover:btn-primary transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="btn btn-circle btn-outline btn-sm hover:btn-primary transition-all">
                <Youtube size={16} />
              </a>
            </div>
            <div className="mt-4 space-y-2 font-body text-sm">
              <p className="text-base-content/70">📊 <span className="font-semibold text-success">500+</span> Pets Adopted</p>
              <p className="text-base-content/70">💰 <span className="font-semibold text-info">$50K+</span> Raised</p>
              <p className="text-base-content/70">👥 <span className="font-semibold text-warning">1000+</span> Happy Families</p>
            </div>
          </nav>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-base-content/10">
          <div className="footer footer-center p-6 bg-base-300/50">
            <aside className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl">
              <div className="flex items-center space-x-4 font-body">
                <p>© 2024 PawsHome. All rights reserved.</p>
                <div className="badge badge-primary badge-outline">
                  <Heart size={12} className="mr-1" />
                  Nonprofit
                </div>
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0 font-body">
                <Link to="/privacy" className="link link-hover hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="link link-hover hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="link link-hover hover:text-primary transition-colors">Cookie Policy</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;