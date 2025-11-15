import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FullPageLoader } from './components/ui/LoadingScreen';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import PetListing from './pages/public/PetListing';
import PetDetails from './pages/public/PetDetails';
import DonationCampaigns from './pages/public/DonationCampaigns';
import DonationDetails from './pages/public/DonationDetails';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import AddPet from './pages/dashboard/AddPet';
import MyPets from './pages/dashboard/MyPets';
import UpdatePet from './pages/dashboard/UpdatePet';
import AdoptionRequests from './pages/dashboard/AdoptionRequests';
import CreateDonation from './pages/dashboard/CreateDonation';
import MyDonationCampaigns from './pages/dashboard/MyDonationCampaigns';
import EditDonation from './pages/dashboard/EditDonation';
import MyDonations from './pages/dashboard/MyDonations';
import RefundRequests from './pages/dashboard/RefundRequests';

// Admin Pages
import AdminUsers from './pages/dashboard/admin/AdminUsers';
import AdminPets from './pages/dashboard/admin/AdminPets';
import AdminDonations from './pages/dashboard/admin/AdminDonations';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Routes>
                <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                <Route path="/pets" element={<><Navbar /><PetListing /><Footer /></>} />
                <Route path="/pets/:id" element={<><Navbar /><PetDetails /><Footer /></>} />
                <Route path="/donations" element={<><Navbar /><DonationCampaigns /><Footer /></>} />
                <Route path="/donations/:id" element={<><Navbar /><DonationDetails /><Footer /></>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<AddPet />} />
                  <Route path="add-pet" element={<AddPet />} />
                  <Route path="my-pets" element={<MyPets />} />
                  <Route path="update-pet/:id" element={<UpdatePet />} />
                  <Route path="adoption-requests" element={<AdoptionRequests />} />
                  <Route path="create-donation" element={<CreateDonation />} />
                  <Route path="my-donations" element={<MyDonationCampaigns />} />
                  <Route path="edit-donation/:id" element={<EditDonation />} />
                  <Route path="donations-made" element={<MyDonations />} />
                  <Route path="refund-requests" element={<RefundRequests />} />
                  <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                  <Route path="admin/pets" element={<AdminRoute><AdminPets /></AdminRoute>} />
                  <Route path="admin/donations" element={<AdminRoute><AdminDonations /></AdminRoute>} />
                </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
