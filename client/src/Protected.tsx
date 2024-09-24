import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSession } from './state/Auth';
import Config from '../config';

const serverUrl = `${Config.serverUrl}/users/auth/verify-token`;

const Protected = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const authSession = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          authSession.logout();
          setIsAuthenticated(false);
        } else {
          const res = await axios.get(serverUrl, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });

          if (res.data.isAuth === true) {
            authSession.authenticate();
            setIsAuthenticated(true);
          } else {
            authSession.logout();
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error(error);
        authSession.logout();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Display a loading message or spinner while verifying the token
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, navigate to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default Protected;
