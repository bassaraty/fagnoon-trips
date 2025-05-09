// src/contexts/UserAuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const UserAuthContext = createContext();

// Custom hook to use the context
// eslint-disable-next-line react-refresh/only-export-components
export const useUserAuth = () => {
  return useContext(UserAuthContext);
};

export const UserAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock API function for sign in
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // Mock API call response
      // In real implementation, this would be replaced with actual API call:
      // const response = await fetch('api/auth/signin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();

      // Using mock data for now
      const mockResponse = fakeAuthApi(email, password);

      if (mockResponse.success) {
        // Set user in state
        setCurrentUser(mockResponse.user);

        // Store token in localStorage for session persistence
        localStorage.setItem("authToken", mockResponse.token);
        return { success: true, user: mockResponse.user };
      } else {
        return { success: false, error: mockResponse.error };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "Authentication failed" };
    } finally {
      setLoading(false);
    }
  };

  // Mock API function for sign out
  const signOut = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          // Mock API call to validate token
          // In real implementation, this would verify the token with the backend:
          // const response = await fetch('api/auth/verify', {
          //   headers: { 'Authorization': `Bearer ${token}` }
          // });
          // const data = await response.json();

          // Using mock data for now
          const mockUser = {
            id: "1",
            name: "Mahmoud Ragab",
            email: "mahmoud@gmail.com",
            role: "admin",
          };

          setCurrentUser(mockUser);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Fake authentication API function with four roles
  const fakeAuthApi = (email, password) => {
    // This is a mock function that simulates an API response
    const users = {
      "admin@example.com": {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        password: "password",
      },
      "moa@example.com": {
        id: "2",
        name: "MOA User",
        email: "moa@example.com",
        role: "MOA",
        password: "password",
      },
      "ho@example.com": {
        id: "3",
        name: "HO User",
        email: "ho@example.com",
        role: "HO",
        password: "password",
      },
      "partyleader@example.com": {
        id: "4",
        name: "Party Leader",
        email: "partyleader@example.com",
        role: "party leader",
        password: "password",
      },
    };

    const user = users[email];

    if (user && user.password === password) {
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: `fake-jwt-token-for-${user.role}`,
      };
    } else {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signOut,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};
