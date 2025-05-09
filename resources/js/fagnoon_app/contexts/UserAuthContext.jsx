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

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // Actual API call to Laravel Breeze login endpoint
      const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");
      
      // First, ensure session cookie is set up by calling /sanctum/csrf-cookie
      await fetch("/sanctum/csrf-cookie");

      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // After successful login, fetch the user data
        const userResponse = await fetch("/api/user", {
          headers: {
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken, // May not be needed for GET if session is established
          },
        });
        if (userResponse.ok) {
          const user = await userResponse.json();
          setCurrentUser(user);
          // No need to manually store token for web auth with Breeze, session cookie handles it.
          // localStorage.setItem("authToken", mockResponse.token); 
          return { success: true, user };
        } else {
          setCurrentUser(null);
          return { success: false, error: "Failed to fetch user data after login." };
        }
      } else {
        setCurrentUser(null);
        const errorData = await response.json();
        return { success: false, error: errorData.message || "Invalid email or password" };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setCurrentUser(null);
      return { success: false, error: "Authentication failed" };
    } finally {
      setLoading(false);
    }
  };

  // Actual API function for sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");
      await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
          "Accept": "application/json",
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if logout API fails, clear client-side state
    } finally {
      setCurrentUser(null);
      // localStorage.removeItem("authToken"); // No longer needed with session cookies
      setLoading(false);
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setLoading(true);
        // Fetch user data to verify session
        const userResponse = await fetch("/api/user", {
          headers: {
            "Accept": "application/json",
            // CSRF token might not be strictly necessary for a GET request if session is valid,
            // but including it doesn't harm and can be good practice depending on backend setup.
            // "X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content"),
          },
        });

        if (userResponse.ok) {
          const user = await userResponse.json();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth state check error:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Remove fakeAuthApi function as it's no longer needed
  // const fakeAuthApi = (email, password) => { ... };

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
