import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-base-100 font-body">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};