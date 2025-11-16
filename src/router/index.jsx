import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { DashboardLayout } from "../layout/DashboardLayout";

// Public Pages
import Home from "../pages/public/Home";
import PetListing from "../pages/public/PetListing";
import PetDetails from "../pages/public/PetDetails";
import DonationCampaigns from "../pages/public/DonationCampaigns";
import DonationDetails from "../pages/public/DonationDetails";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Dashboard Pages
import AddPet from "../pages/dashboard/AddPet";
import MyPets from "../pages/dashboard/MyPets";
import UpdatePet from "../pages/dashboard/UpdatePet";
import AdoptionRequests from "../pages/dashboard/AdoptionRequests";
import CreateDonation from "../pages/dashboard/CreateDonation";
import MyDonationCampaigns from "../pages/dashboard/MyDonationCampaigns";
import EditDonation from "../pages/dashboard/EditDonation";
import MyDonations from "../pages/dashboard/MyDonations";
import RefundRequests from "../pages/dashboard/RefundRequests";

// Admin Pages
import AdminUsers from "../pages/dashboard/admin/AdminUsers";
import AdminPets from "../pages/dashboard/admin/AdminPets";
import AdminDonations from "../pages/dashboard/admin/AdminDonations";

// Protected Route Components
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "pets",
        Component: PetListing
      },
      {
        path: "pets/:id",
        Component: PetDetails
      },
      {
        path: "donations",
        Component: DonationCampaigns
      },
      {
        path: "donations/:id",
        Component: DonationDetails
      }
    ]
  },
  {
    path: "login",
    Component: Login
  },
  {
    path: "register",
    Component: Register
  },
  {
    path: "dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        Component: AddPet
      },
      {
        path: "add-pet",
        Component: AddPet
      },
      {
        path: "my-pets",
        Component: MyPets
      },
      {
        path: "update-pet/:id",
        Component: UpdatePet
      },
      {
        path: "adoption-requests",
        Component: AdoptionRequests
      },
      {
        path: "create-donation",
        Component: CreateDonation
      },
      {
        path: "my-donations",
        Component: MyDonationCampaigns
      },
      {
        path: "edit-donation/:id",
        Component: EditDonation
      },
      {
        path: "donations-made",
        Component: MyDonations
      },
      {
        path: "refund-requests",
        Component: RefundRequests
      },
      {
        path: "admin/users",
        element: <AdminRoute><AdminUsers /></AdminRoute>
      },
      {
        path: "admin/pets",
        element: <AdminRoute><AdminPets /></AdminRoute>
      },
      {
        path: "admin/donations",
        element: <AdminRoute><AdminDonations /></AdminRoute>
      }
    ]
  }
]);

export default router;