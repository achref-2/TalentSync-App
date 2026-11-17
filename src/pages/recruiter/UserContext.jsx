import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../../config";

// Create the UserContext with a more specific name
export const RecruiterContext = createContext();

// Define the UserProviderRec component
export function UserProviderRec({ children }) {
  const [profilePic, setProfilePic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [jobPostings, setJobPostings] = useState([]);

const fetchUserData = useCallback(async (forceRefresh = false) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Only use cached data if not forcing refresh
    const storedData = sessionStorage.getItem("userData");
    if (!forceRefresh && storedData) {
      const { profilePic, firstName, lastName, email, companyName, jobPostings } = JSON.parse(storedData);
      setProfilePic(profilePic);
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setCompanyName(companyName);
      setJobPostings(jobPostings);
      setIsLoading(false);
      return;
    }

    // If forceRefresh or no stored data, get fresh data from server
    const response = await axios.get(API_URL + "/api/recruiters/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API profile response:", response.data);

    // Extract the recruiter object from the response
    const { recruiter } = response.data;
    
    if (!recruiter) {
      console.error("No recruiter data in API response");
      setIsLoading(false);
      return;
    }

    const {
      profilePic = (import.meta.env.BASE_URL + "img/team/01.jpg"),
      firstName = "First Name",
      lastName = "Last Name",
      email = "example@example.com",
      companyName = "N/A",
      jobPostings = [],
    } = recruiter;

    const userData = { profilePic, firstName, lastName, email, companyName, jobPostings };

    setProfilePic(profilePic);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
    setCompanyName(companyName);
    setJobPostings(jobPostings);

    // Clear existing and set new data
    sessionStorage.removeItem("userData");
    sessionStorage.setItem("userData", JSON.stringify(userData));
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  } finally {
    setIsLoading(false);
  }
}, []);
  // Function to update user profile
  // Make this small update to your updateUserProfile function
const updateUserProfile = useCallback(async (updatedData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return false;
    }

    // Debug what's being sent
    console.log("Sending update data:", updatedData instanceof FormData 
      ? "FormData object" 
      : updatedData);

    // Send update to API
    const response = await axios.put(
      API_URL + "/api/recruiters/profile",
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": updatedData instanceof FormData ? "multipart/form-data" : "application/json"
        }
      }
    );

    // Debug response
    console.log("Profile update response:", response.data);

    // Check if update was successful
    if (response.status === 200 && response.data.recruiter) {
      // Extract the updated recruiter data
      const { 
        profilePic: newProfilePic, 
        firstName: newFirstName, 
        lastName: newLastName, 
        email: newEmail,
        companyName: newCompanyName 
      } = response.data.recruiter;
      
      // Update state with new data - always update with the returned values
      setProfilePic(newProfilePic || profilePic);
      setFirstName(newFirstName || firstName);
      setLastName(newLastName || lastName);
      setEmail(newEmail || email);
      setCompanyName(newCompanyName || companyName);
      
      // Create updated user data object with the new values
      const userData = {
        profilePic: newProfilePic || profilePic,
        firstName: newFirstName || firstName,
        lastName: newLastName || lastName,
        email: newEmail || email,
        companyName: newCompanyName || companyName,
        jobPostings
      };
      
      // Clear existing userData and store the new data
      sessionStorage.removeItem("userData");
      sessionStorage.setItem("userData", JSON.stringify(userData));
      
      console.log("Profile updated successfully - new data:", userData);
      return true;
    }
    
    console.error("Profile update failed or invalid response format");
    return false;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}, [profilePic, firstName, lastName, email, companyName, jobPostings]);
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

 return (
  <RecruiterContext.Provider
    value={{
      profilePic,
      setProfilePic,
      firstName,
      setFirstName,
      lastName,
      setLastName,
      email,
      setEmail,
      companyName,
      setCompanyName,
      jobPostings,
      setJobPostings,
      isLoading,
      updateUserProfile,
      refreshUserData: (forceRefresh = true) => fetchUserData(forceRefresh)
    }}
  >
    {children}
  </RecruiterContext.Provider>
  );
}

// This ensures backward compatibility
export const UserContext = RecruiterContext;

// For module stability with Fast Refresh
export default UserProviderRec;