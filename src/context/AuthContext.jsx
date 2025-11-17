import { createContext, useContext, useEffect, useState } from 'react';

import {

    signInWithEmailAndPassword,

    createUserWithEmailAndPassword,

    signOut,

    onAuthStateChanged,

    GoogleAuthProvider,

    signInWithPopup,

    updateProfile,
    FacebookAuthProvider

} from 'firebase/auth';

import { auth } from '../config/firebase';

import { authAPI } from '../services/api';



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



                try {

                    const dbUser = await authAPI.getMe();

                    setUser({

                        ...firebaseUser,

                        role: dbUser.role,

                        uid: firebaseUser.uid

                    });

                } catch (error) {

                    console.error('Error fetching user role:', error);

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



        const token = await result.user.getIdToken();

        localStorage.setItem('token', token);



        try {

            await authAPI.register({

                name,

                email,

                photoURL,

                role: 'user'

            });

        } catch (error) {

            console.error('Error saving user to database:', error);

        }



        return result;

    };



    const loginWithGoogle = async () => {

        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider);
        const token = await result.user.getIdToken();
        localStorage.setItem('token', token);
        try {

            await authAPI.register({
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                role: 'user'
            });

        } catch (error) {
            console.error('Error saving user to database:', error);

        }
        return result;

    };


const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider); 
    const token = await result.user.getIdToken();
    localStorage.setItem('token', token);
    
    try {
      await authAPI.register({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: 'user' 
      });
    } catch (error) {
      console.error('Error saving user to database after Facebook login:', error);
    }

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

        loading,
        setLoading,
        loginWithFacebook

    };



    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

};