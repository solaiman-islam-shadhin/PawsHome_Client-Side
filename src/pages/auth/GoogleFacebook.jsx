
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { Facebook } from 'lucide-react'; // Using Lucide React for the Facebook icon

export const GoogleFacebook = () => {
    // Assuming useAuth now provides loginWithFacebook
    const { loginWithGoogle, loginWithFacebook ,loading, setLoading} = useAuth(); 
  

    const navigate = useNavigate();
    const location = useLocation();

    // Determine the redirect path after successful login
    const from = location.state?.from?.pathname || '/';

    // Handler for Google Login
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Login successful!');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    // Handler for Facebook Login
    const handleFacebookLogin = async () => {
        setLoading(true);
        try {
            // Check if loginWithFacebook function is available
            if (!loginWithFacebook) {
                throw new Error("Facebook login is not configured in AuthContext.");
            }
            await loginWithFacebook();
            toast.success('Login successful!');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message || 'Facebook login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Google Login Button (Styled as outline button, using DaisyUI btn-outline class) */}
            <Button
                type="button"
                // Assuming variant="outline" provides a button with a border and no background
                variant="outline" 
                className="w-full btn btn-outline border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleLogin}
                disabled={loading}
            >
                {/* Google SVG Icon */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </Button>
            
            {/* Facebook Login Button (Styled with brand blue color) */}
            <Button
                type="button"
                className="w-full btn bg-[#1877F2] hover:bg-[#156cdb] text-white border-0"
                onClick={handleFacebookLogin}
                disabled={loading}
            >
                <Facebook className="w-5 h-5 mr-2" />
                Continue with Facebook
            </Button>
        </div>
    );
};