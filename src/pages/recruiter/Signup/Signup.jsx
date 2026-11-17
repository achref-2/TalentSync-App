import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Moon, Sun } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDarkMode } from "../../../components/DarkModeProvider";
import { Check } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { API_URL } from "../../../config";

const Signup = ({ onClose, openLoginModal }) => {
  const [data, setData] = useState({
    firstName: "",
    email: "",
    password: "",
    companyName: "", 
    role: "recruiter"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const navigation = [
    { name: "Pricing", href: "#" },
    { name: "Blog", href: "#" },
    { name: "About", href: "#" },
  ];


const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null); // Clear previous errors
  
  try {
    // Ensure all required fields are included in the request
    const signupData = {
      firstName: data.firstName,
      email: data.email,
      password: data.password,
      companyName: data.companyName || "", // Ensure companyName is always sent
      role: 'recruiter'
    };
    
    console.log("Sending signup data:", signupData); // Debug log
    
    const response = await axios.post(API_URL + "/api/recruiters/signup", signupData);
    
    // Check the response for user status
    if (response.data.userExists) {
      const userStatus = response.data.status;
      
      // Store data about the existing user
      localStorage.setItem('recruiterEmail', data.email);
      localStorage.setItem('recruiterName', data.firstName || response.data.firstName);
      localStorage.setItem('recruiterStatus', userStatus);
      localStorage.setItem('recruiterCompany', data.companyName || ""); // Store company name
      
      if (userStatus === 'approved') {
        // User is approved, show message that they should login
        setMessage("Your account is already active. Please login to access your dashboard.");
        setError(null);
        
        // If used in a modal context, switch to login modal after delay
        if (typeof onClose === 'function' && typeof openLoginModal === 'function') {
          setTimeout(() => {
            onClose();
            openLoginModal();
          }, 3000);
        }
      } else if (userStatus === 'pending') {
        // User is pending, store relevant info and redirect to confirmation
        localStorage.setItem('signupSuccess', 'true');
        localStorage.setItem('signupMessage', response.data.message || "Your account is awaiting approval.");
        
        // Navigate to confirmation page
        navigate('/dashboard/recuiter/confirmation');
      } else {
        // User is rejected, store relevant info and redirect to rejection page
        localStorage.setItem('signupSuccess', 'true');
        localStorage.setItem('signupMessage', response.data.message || "Your account application was rejected. Please contact support.");
        
        // Navigate to rejected page
        navigate('/dashboard/recuiter/rejected');
      }
    } else {
      // User created successfully
      setMessage(response.data.message || "Account created successfully!");
      
      // Store the signup result in state or localStorage for the confirmation page
      localStorage.setItem('signupSuccess', 'true');
      localStorage.setItem('recruiterEmail', data.email);
      localStorage.setItem('recruiterName', data.firstName);
      localStorage.setItem('recruiterCompany', data.companyName || ""); 
      localStorage.setItem('signupMessage', response.data.message || "Your account has been created successfully!");
      localStorage.setItem('recruiterStatus', 'pending');
      
      // Reset form data
      setData({
        firstName: '',
        email: '',
        password: '',
        companyName: '',
        role: 'recruiter'
      });
      
      // If in modal context, show success message then switch to login modal
      if (typeof onClose === 'function' && typeof openLoginModal === 'function') {
        setTimeout(() => {
          onClose();
          openLoginModal();
        }, 3000); // Show success message for 3 seconds
      } else {
        // Navigate to confirmation page if not in modal
        navigate('/dashboard/recuiter/confirmation');
      }
    }
  } catch (error) {
    console.error("Error during signup:", error);
    console.log("Error response:", error.response?.data); // Add detailed debugging
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      // User already exists with approved status
      setError("This email is already registered and approved. Please log in instead.");
    } else {
      // Extract generic error message
      const errorMessage = error.response?.data?.message || "An error occurred during registration";
      setError(errorMessage);
      
      // Set specific validation error handling
      if (error.response?.status === 400 && error.response.data.field) {
        setFieldErrors(prev => ({
          ...prev,
          [error.response.data.field]: error.response.data.message
        }));
      }
    }
  } finally {
    setIsSubmitting(false);
  }
};
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const clientId =
    "9748260171-v0tq98gnchgvvr9v6jvblpivlbina5q9.apps.googleusercontent.com";

  const handleLoginSuccess = async (response) => {
  try {
    console.log("Google Token:", response.credential);
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    const res = await axios.post(API_URL + "/api/recruiters/auth/google", {
      token: response.credential,
    });

    console.log("Google Auth Success:", res.data);
    
    // Check the response for user status
    if (res.data.userExists) {
      const userStatus = res.data.status;
      
      // Store data about the existing user
      localStorage.setItem('recruiterEmail', res.data.user.email);
      localStorage.setItem('recruiterName', res.data.user.firstName);
      localStorage.setItem('recruiterStatus', userStatus);
      
      if (userStatus === 'approved') {
        // User is approved, store token and navigate to dashboard
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful! Redirecting to your dashboard...");
        navigate('/dashboard/recruiter'); // Adjust path as needed
      } else if (userStatus === 'pending') {
        // User is pending, store relevant info and redirect to confirmation
        localStorage.setItem('signupSuccess', 'true');
        localStorage.setItem('signupMessage', res.data.message || "Your account is awaiting approval.");
        
        // Navigate to confirmation page
        navigate('/dashboard/recuiter/confirmation');
      } else {
        // User is rejected, store relevant info and redirect to rejected page
        localStorage.setItem('signupSuccess', 'true');
        localStorage.setItem('signupMessage', res.data.message || "Your account application was rejected. Please contact support.");
        
        // Navigate to rejected page
        navigate('/dashboard/recuiter/rejected');
      }
    } else {
      // New user created successfully via Google
      setMessage(res.data.message || "Account created successfully!");
      
      // Store the signup result in localStorage for the confirmation page
      localStorage.setItem('signupSuccess', 'true');
      localStorage.setItem('recruiterEmail', res.data.user.email);
      localStorage.setItem('recruiterName', res.data.user.firstName);
      localStorage.setItem('signupMessage', res.data.message || "Your account has been created successfully!");
      localStorage.setItem('recruiterStatus', 'pending');
      
      // Navigate to confirmation page
      navigate('/dashboard/recuiter/confirmation');
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      // User exists but with a different role
      setError(error.response.data.message || "This Google account is registered with a different role.");
    } else if (error.response?.status === 409) {
      // User already exists with approved status
      setError("This Google account is already registered and approved. Please log in instead.");
    } else {
      // Extract generic error message
      const errorMessage = error.response?.data?.message || "An error occurred during Google authentication";
      setError(errorMessage);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const handleLoginError = () => {
    console.error("Google Auth Failed");
  };

  const { isDarkMode } = useDarkMode();

  return (
    <div>
      <div>
      <img
          alt="TalentSync"
          src="img/Logo.png"
          className="w-14 h-14 text-gray-600  p-0 dark:text-white transition-all duration-300 ease-in-out z-30 mx-auto "
          />
        <h2 className="my-1 text-center text-2xl font-semibold tracking-tight  ">
          Sign Up
        </h2>
        <p className="text-center  font-thin tracking-tight border-b  border-zinc-300 text-zinc-500 dark:border-zinc-700 pb-7">
          Ready to ace your next Candidate ?
        </p>
     

        <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="  w-full max-w-md  relative">
            

            {/* First Name 
        <div className="mb-4">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
            value={data.firstName}
            required
            className="w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>
*/}
            {/* Last Name */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className="block w-[90%] mx-auto rounded-md  bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
              />
            </div>
           <div className="mb-4">
  
  <input
    id="companyName"
    type="text"
    placeholder="Enter your company name"
    name="companyName"
    onChange={handleChange}
    value={data.companyName}
    required
    aria-required="true"
    aria-invalid={!!fieldErrors?.companyName}
    aria-describedby={fieldErrors?.companyName ? "companyName-error" : undefined}
    className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border outline-1 outline-gray-300 focus:outline-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
  />
 
</div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="hello@example.com"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="block w-[90%] mx-auto rounded-md  bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
              />
            </div>
           
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                autoComplete="current-password"
                className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-950  dark:text-gray-400  hover:text-gray-600"
              >
                {showPassword ?   <EyeOff size={20}/> : <Eye size={20} /> }
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-[90%] mx-auto py-2 px-4 mb-5 bg-zinc-300 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded hover:bg-zinc-400 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
            >
              Sign Up
            </button>
{message && (
  <div className="w-[90%] mx-auto mb-5 px-4 py-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center">
    <Check size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mr-2" />
    <span className="text-sm text-green-800 dark:text-green-300">{message}</span>
  </div>
)}

            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a
                href={import.meta.env.BASE_URL + "candidate/login"}
                className="text-blue-500 hover:text-blue-600"
              >
                Log In
              </a>
            </div>

            {/* Or Divider */}
            <div className="flex items-center  my-4 w-[90%] mx-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="w-[90%] mx-auto">
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
