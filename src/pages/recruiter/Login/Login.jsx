import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../components/DarkModeProvider";
import { toast } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { API_URL } from "../../../config";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    setError(null); // Clear previous errors
    setLoading(true); // Show loading indicator
    
    try {
      const response = await axios.post(
        API_URL + "/api/recruiters/login",
        data // Use the form data
      );
      
      const { user, token, recruiter, message } = response.data;
  
      // Check user status before proceeding
      if (user.status === "pending") {
        setError("Your account is pending approval by an administrator. You will be notified when your account is approved.");
        localStorage.setItem("pendingApproval", "true");
        navigate("/dashboard/recuiter/PendingApproval", { state: { email: data.email } });
        setLoading(false);
        return;
      } 
      
      if (user.status === "rejected") {
        setError("Your account application has been rejected. Please contact support for more information.");
        setLoading(false);
        return;
      }
  
      // Only store data and navigate if approved
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userType", "recruiter");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("recruiterId", recruiter.id);
      localStorage.setItem("userName", user.firstName);
      localStorage.setItem("companyName", recruiter.companyName || "");
      
      // Show success message
      toast.success(message || "Logged in successfully");
      
      // Navigate to recruiter dashboard (fixed typo in "recruiter")
      navigate("/dashboard/recuiter/");
      
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        switch (status) {
          case 400:
            setError(errorData.message || "Please provide both email and password");
            break;
          case 401:
            setError("Invalid email or password");
            break;
          case 403:
            setError(errorData.message || "Account access restricted");
            
            if (errorData.status === "pending") {
              localStorage.setItem("pendingApproval", "true");
              navigate("/dashboard/recuiter/PendingApproval", { state: { email: data.email } });
            }
            break;
          case 404:
            setError("Account not found");
            break;
          default:
            setError(errorData.message || "Login failed. Please try again later.");
        }
      } else if (error.request) {
        // Request made but no response received
        setError("No response from server. Please check your internet connection.");
      } else {
        // Something else caused the error
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const [landingPageData, setLandingPageData] = useState({});
  const clientId = "9748260171-v0tq98gnchgvvr9v6jvblpivlbina5q9.apps.googleusercontent.com";

  const navigate = useNavigate(); // Hook for navigation

const handleLoginSuccess = async (response) => {
  console.log("Google Login Response:", response);
  
  setError(null);
  setLoading(true);
  
  try {
    const res = await axios.post(
      API_URL + "/api/recruiters/auth/google",
      {
        token: response.credential,
      }
    );
    
    console.log("Google Auth Response:", res.data);
    
    // Check if we have a new registration or existing user
    if (res.data.userExists) {
      // This is an existing user - check their status
      const userStatus = res.data.status;
      
      if (userStatus === "pending") {
        setError("Your account is pending approval by an administrator.");
        localStorage.setItem("pendingApproval", "true");
        localStorage.setItem("pendingEmail", res.data.user?.email || '');
        
        // Navigate to pending approval page with correct path
        navigate("/dashboard/recruiter/PendingApproval", { 
          state: { email: res.data.user?.email || data.email } 
        });
        return;
      } 
      
      if (userStatus === "rejected") {
        localStorage.setItem('signupSuccess', 'true');
        localStorage.setItem('recruiterEmail', res.data.user?.email || '');
        localStorage.setItem('recruiterName', res.data.user?.firstName || '');
        localStorage.setItem('signupMessage', res.data.message || "Your account application has been rejected.");
        localStorage.setItem('recruiterStatus', 'rejected');
        
        // Navigate to rejection page with correct path
        navigate('/dashboard/recruiter/rejected');
        return;
      }
      
      // If we're here, the user is approved
      const { user, token, recruiter, message } = res.data;
      
      // Store data and navigate if approved
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("recruiterId", recruiter._id);
      localStorage.setItem("userName", user.firstName);
      localStorage.setItem("companyName", recruiter.companyName || "");
      localStorage.setItem("userType", "recruiter");
      // Show success message
      toast.success(message || "Logged in successfully");
      localStorage.setItem("token", res.data.token);
      // Navigate to recruiter dashboard with correct path
      navigate("/dashboard/recruiter/");
    } else {
      // This is a new registration
      // Store the signup result in localStorage for the confirmation page
      localStorage.setItem('signupSuccess', 'true');
      localStorage.setItem('recruiterEmail', res.data.user?.email || '');
      localStorage.setItem('recruiterName', res.data.user?.firstName || '');
      localStorage.setItem('signupMessage', res.data.message || "Your account has been created successfully!");
      localStorage.setItem('recruiterStatus', 'pending');
      
       
      

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard/recuiter");
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 400:
          setError(errorData.message || "Invalid Google authentication");
          break;
        case 401:
          setError("Authentication failed");
          break;
        case 403:
          setError(errorData.message || "Account access restricted");
          break;
        case 404:
          setError("Account not found");
          break;
        case 409:
          setError(errorData.message || "Account exists with a different role");
          break;
        default:
          setError(errorData.message || "Authentication failed. Please try again later.");
      }
    } else if (error.request) {
      setError("No response from server. Please check your internet connection.");
    } else {
      setError("An error occurred. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};
  const handleLoginError = () => {
    console.error("Google Login Failed");
  };

  const { isDarkMode } = useDarkMode();
// First, add this state at the top of your component with other state variables
const [showPassword, setShowPassword] = useState(false);

// Add this function to toggle password visibility
const togglePasswordVisibility = () => {
  setShowPassword(prevState => !prevState);
};

// Then update your password input field and container
  return (
    <div>
      <div>
      <img
          alt="TalentSync"
          src="img/Logo.png"
          className="w-14 h-14 text-gray-600  p-0 dark:text-white transition-all duration-300 ease-in-out z-30 mx-auto "
          />
        <h2 className="my-1 text-center text-2xl font-semibold tracking-tight  ">
          Sign In
        </h2>
        <p className="text-center  font-thin tracking-tight border-b  border-zinc-300 text-zinc-500 dark:border-zinc-700 pb-7">
          Ready to ace your next Candidate ?
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm ">
        <form
          className="flex flex-col items-center justify-center space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="w-[80%] max-w-md">
            <label
              htmlFor="email"
              className="block text-sm w-[90%] mx-auto font-medium"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                placeholder="hello@example.com"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500"
              />
            </div>
          </div>

         <div className="w-[80%] max-w-md">
  <div className="flex w-[90%] mx-auto items-center justify-between">
    <label htmlFor="password" className="block text-sm font-medium">
      Password
    </label>
    <div className="text-sm">
      <a
        href="#"
        className="font-semibold text-zinc-400 hover:text-zinc-500"
      >
        Forgot password?
      </a>
    </div>
  </div>
  <div className="mt-2 relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      name="password"
      onChange={handleChange}
      value={data.password}
      required
      autoComplete="current-password"
      className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:text-gray-100 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 border outline-1 outline-gray-400 focus:outline-2 placeholder:text-gray-500"
    />
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-950 dark:text-gray-400 hover:text-gray-600"
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )}
    </button>
  </div>
</div>

          <div className="w-[80%] max-w-md">
          <button
  type="submit"
  disabled={loading}
  className="w-[90%] mx-auto py-2 px-4 bg-zinc-300 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded hover:bg-zinc-400 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
>
  {loading ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Signing in...
    </>
  ) : (
    "Sign in"
  )}
</button>

            <p className="mt-1 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link to="/candidate/signup">
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Sign Up
                </button>
              </Link>
            </p>
          </div>

          {error && <div className={styles.error_msg}>{error}</div>}
        </form>

        <div className="flex items-center my-4 w-[71%] mx-14 ">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col gap-3 items-center w-[80%] mx-auto">
          {/* Divider with "OR CONTINUE WITH" text */}

          {/* Google Sign In */}
          <div className="w-[90%] mx-auto ">
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                theme="outline"
                size="large" 
                text="signin_with"
                shape="rectangular"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
