import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom"; // Changed from useNavigate to useHistory
import * as auth from "../_redux/auth-redux";

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory(); // Changed from navigate to history
  
  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    
    // Clear Redux store by dispatching logout action
    dispatch(auth.actions.logout());
    
    // Redirect to login page
    history.push("/auth/login"); // Changed from navigate() to history.push()
    
    console.log("User logged out successfully");
  }, [dispatch, history]); // Updated dependency array

  // Return loading indicator or null while the redirect is happening
  return <div>Logging out...</div>;
};

export default Logout;
