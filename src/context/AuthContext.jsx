import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI, uploadImage } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('token', token);
        
        // Get user data from backend
        try {
          const response = await authAPI.getMe();
          setUser({ ...firebaseUser, ...response.data });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(firebaseUser);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  const register = async (email, password, name, photoURL) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(result.user, {
      displayName: name,
      photoURL: photoURL
    });

    // Save user to backend
    const token = await result.user.getIdToken();
    localStorage.setItem('token', token);
    
    await authAPI.register({
      name,
      email,
      photoURL,
      role: 'user'
    });

    return result;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Save user to backend if new
    const token = await result.user.getIdToken();
    localStorage.setItem('token', token);
    
    await authAPI.register({
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      role: 'user'
    });

    return result;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
