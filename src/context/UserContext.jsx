import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../lib/firebaseClient";
import { toast } from '@/components/ui/use-toast';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const fetchUser = async (firebaseUser) => {
    setLoading(true);
    if (firebaseUser) {
      try {
        console.log("[UserContext] Fetching user data for UID:", firebaseUser.uid);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("[UserContext] User data fetched successfully:", userData);
          setUser(userData);
        } else {
          console.log("[UserContext] User document does not exist");
          setUser(null);
        }
      } catch (error) {
        console.error('[UserContext] Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("[UserContext] No Firebase user, setting user to null");
      setUser(null);
      setLoading(false);
    }
  };

  const logoutUser = () => {
    auth.signOut().then(() => {
      console.log("[UserContext] User signed out successfully");
      setUser(null);
      setLoading(false);
    }).catch((error) => {
      console.error("[UserContext] Error signing out:", error);
    });
  };

  useEffect(() => {
    console.log("[UserContext] Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("[UserContext] Auth state changed:", firebaseUser ? `User logged in (${firebaseUser.uid})` : "User logged out");
      if (firebaseUser) {
        fetchUser(firebaseUser);
      } else {
        console.log("[UserContext] No Firebase user, clearing user state");
        setUser(null);
        setLoading(false);
      }
    });
    
    return () => {
      console.log("[UserContext] Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, logoutUser, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 