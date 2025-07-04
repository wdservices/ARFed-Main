import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getCookie, removeCookies } from 'cookies-next';
import { toast } from '@/components/ui/use-toast';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Define token and id here to ensure they are in scope for useEffect dependencies
  const token = getCookie('token');
  const id = getCookie('id');

  const fetchUser = async () => {
    setLoading(true);
    if (token && id) {
      try {
        const userRes = await axios.get(`https://arfed-api.onrender.com/api/user/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'auth-token': token,
          },
        });
        setUser(userRes.data || null); // Accepts either an object or null
      } catch (error) {
        console.error('Error fetching user data in UserProvider:', error);
        // Don't show toast error on initial load to avoid spam
        if (user) {
          toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
        }
        setUser(null); // Ensure user is null on error
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null); // No token/id, so no user data
      setLoading(false);
    }
  };

  const logoutUser = () => {
    removeCookies('token');
    removeCookies('id');
    setUser(null); // Clear user state immediately
    setLoading(false); // Set loading to false after logout
  };

  useEffect(() => {
    // This effect runs on initial mount and whenever token or id (from getCookie) changes.
    // It should trigger fetchUser.
    fetchUser();
  }, [token, id]); // Depend on token and id from the component's scope

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