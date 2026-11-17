import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Briefcase, UserPlus, Layout } from "lucide-react";
import { API_URL } from "../config";

const PendingRecruiters = () => {
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem("token"),
    isAuthenticating: false,
    showSignup: false,
  });

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const [signupCredentials, setSignupCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "", // Secret key for admin registration
  });
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard', 'candidates', 'jobs', 'recruiters'
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [allRecruiters, setAllRecruiters] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        isAuthenticating: false,
      }));
      return false;
    }

    // Verify token is still valid
    axios
      .get(API_URL + "/api/admins/admins/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isAuthenticating: false,
        }));
        fetchPendingRecruiters();
      })
      .catch(() => {
        // Token invalid,clear it
        localStorage.removeItem("token");
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
          isAuthenticating: false,
        }));
      });
  };

  // Toggle between login and signup forms
  const toggleAuthMode = () => {
    setAuthState((prev) => ({ ...prev, showSignup: !prev.showSignup }));
  };

  // Handle login form input changes
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle signup form input changes
  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, admins: 0, recruiters: 0, candidates: 0 },
    jobs: { total: 0, active: 0, closed: 0, draft: 0 },
    applications: {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      interviewing: 0,
    },
    interviews: { total: 0, scheduled: 0, completed: 0, cancelled: 0 },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const fetchDashboardStats = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        API_URL + "/api/admins/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dashboard stats:", response.data);
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard statistics");
    } finally {
      setActionLoading(false);
    }
  };
  const [activeField, setActiveField] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    checkAuthentication();
    if (authState.isAuthenticated) {
      fetchDashboardStats();
    }
  }, [authState.isAuthenticated]);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setAuthState((prev) => ({ ...prev, isAuthenticating: true }));

      const response = await axios.post(
        API_URL + "/api/admins/auth/admin-login",
        loginCredentials
      );

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", "admin");
      // Update auth state
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        isAuthenticating: false,
      }));

      toast.success("Login successful!");

      // Fetch recruiters after successful login
      fetchPendingRecruiters();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      setAuthState((prev) => ({ ...prev, isAuthenticating: false }));
    }
  };

  // Handle admin signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupCredentials.password !== signupCredentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setAuthState((prev) => ({ ...prev, isAuthenticating: true }));
      const response = await axios.post(
        API_URL + "/api/admins/auth/admin-signup",
        {
          firstName: signupCredentials.firstName,
          lastName: signupCredentials.lastName,
          email: signupCredentials.email,
          password: signupCredentials.password,
          adminKey: signupCredentials.adminKey,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", "admin");
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        isAuthenticating: false,
      }));
      toast.success("Account created successfully!");
      fetchPendingRecruiters();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
      setAuthState((prev) => ({ ...prev, isAuthenticating: false }));
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: false,
      isAuthenticating: false,
    }));
    setPendingRecruiters([]);
    toast.info("Logged out successfully");
  };

  // Fetch the list of pending recruiters from the API
  const fetchPendingRecruiters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("Token available:", !!token);

      const response = await axios.get(
        API_URL + "/api/admins/pending-recruiters",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      setPendingRecruiters(response.data);
    } catch (error) {
      console.error("Error details:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  // Function to approve a recruiter by updating their status
  const approveRecruiter = async (id) => {
    try {
      // Check if ID is valid before making the request
      if (!id) {
        toast.error("Invalid recruiter ID");
        return;
      }

      console.log("Approving recruiter with ID:", id); // for debugging

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/admins/approve-recruiter/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Recruiter approved successfully");
      fetchPendingRecruiters();
    } catch (error) {
      console.error("Error approving recruiter:", error);

      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid request");
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        toast.error("Not authorized to perform this action");
        handleLogout();
      } else {
        toast.error(
          error.response?.data?.message || "Failed to approve recruiter"
        );
      }
    }
  };

  // Function to reject a recruiter
  const rejectRecruiter = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }
      const response = await axios.post(
        `${API_URL}/api/admins/reject-recruiter/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Recruiter rejected successfully");
      fetchPendingRecruiters();
    } catch (error) {
      console.error("Error rejecting recruiter:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Not authorized to perform this action");
        handleLogout();
      } else {
        toast.error(
          error.response?.data?.message || "Failed to reject recruiter"
        );
      }
    }
  };

  // Login form component
  const LoginForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/"); // Navigate to home page
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2"
          aria-label="Go to home page"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white"
                placeholder="Email address"
                value={loginCredentials.email}
                onChange={handleLoginInputChange}
                autoFocus={activeField === "email"}
                onFocus={() => setActiveField("email")}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none bg-white relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Password"
                value={loginCredentials.password}
                onChange={handleLoginInputChange}
                autoFocus={activeField === "password"}
                onFocus={() => setActiveField("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={authState.isAuthenticating}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                authState.isAuthenticating
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {authState.isAuthenticating ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={toggleAuthMode}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Need an admin account? Sign up
          </button>
        </div>
      </div>
    </div>
  );

  // Signup form component
  const SignupForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/"); // Navigate to home page
            }}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2"
            aria-label="Go to home page"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex -space-x-px">
              <div className="w-1/2">
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="appearance-none bg-white rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-tl-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                  value={signupCredentials.firstName}
                  onChange={handleSignupInputChange}
                  autoFocus={activeField === "firstName"}
                  onFocus={() => setActiveField("firstName")}
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="appearance-none bg-white rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-tr-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  value={signupCredentials.lastName}
                  onChange={handleSignupInputChange}
                  autoFocus={activeField === "lastName"}
                  onFocus={() => setActiveField("lastName")}
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="sr-only">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none bg-white rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={signupCredentials.email}
                onChange={handleSignupInputChange}
                autoFocus={activeField === "signup-email"}
                onFocus={() => setActiveField("signup-email")}
              />
            </div>
            <div className="relative">
              <label htmlFor="signup-password" className="sr-only">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type={showSignupPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none bg-white rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Password"
                value={signupCredentials.password}
                onChange={handleSignupInputChange}
                autoFocus={activeField === "signup-password"}
                onFocus={() => setActiveField("signup-password")}
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                aria-label={
                  showSignupPassword ? "Hide password" : "Show password"
                }
              >
                {showSignupPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none bg-white rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Confirm Password"
                value={signupCredentials.confirmPassword}
                onChange={handleSignupInputChange}
                autoFocus={activeField === "confirmPassword"}
                onFocus={() => setActiveField("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div>
              <label htmlFor="adminKey" className="sr-only">
                Admin Registration Key
              </label>
              <input
                id="adminKey"
                name="adminKey"
                type="password"
                required
                className="appearance-none bg-white rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Admin Registration Key"
                value={signupCredentials.adminKey}
                onChange={handleSignupInputChange}
                autoFocus={activeField === "adminKey"}
                onFocus={() => setActiveField("adminKey")}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={authState.isAuthenticating}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                authState.isAuthenticating
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {authState.isAuthenticating
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={toggleAuthMode}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );

  // If not authenticated, show login or signup form
  if (!authState.isAuthenticated) {
    return authState.showSignup ? <SignupForm /> : <LoginForm />;
  }

  // Main content when authenticated
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
        <div>Loading pending recruiters...</div>
      </div>
    );
  }

  //  fetch data
  const fetchCandidates = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          API_URL + "/api/admins/candidates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        // Check if response.data has a candidates property
        if (response.data && Array.isArray(response.data.candidates)) {
          setCandidates(response.data.candidates);
        } else if (Array.isArray(response.data)) {
          setCandidates(response.data);
        } else {
          console.warn("API returned unexpected format:", response.data);
          setCandidates([]);
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        setCandidates([]);
        toast.warning("Could not load candidates data");
      }

      setCurrentView("candidates");
    } catch (error) {
      console.error("Error in candidate handler:", error);
      setCandidates([]);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          API_URL + "/api/admins/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Jobs API response:", response.data);

        if (response.data && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          console.warn("Jobs API returned unexpected format:", response.data);
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
        toast.error("Failed to fetch jobs");
      }

      setCurrentView("jobs");
    } catch (error) {
      console.error("Error in jobs handler:", error);
      setJobs([]);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const fetchAllRecruiters = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          API_URL + "/api/admins/recruiters",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Recruiters API response:", response.data);

        if (response.data && Array.isArray(response.data.recruiters)) {
          setAllRecruiters(response.data.recruiters);
        } else if (Array.isArray(response.data)) {
          setAllRecruiters(response.data);
        } else {
          console.warn(
            "Recruiters API returned unexpected format:",
            response.data
          );
          setAllRecruiters([]);
        }
      } catch (error) {
        console.error("Error fetching recruiters:", error);
        setAllRecruiters([]);
        toast.error("Failed to fetch recruiters");
      }

      setCurrentView("recruiters");
    } catch (error) {
      console.error("Error in recruiters handler:", error);
      setAllRecruiters([]);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId, userType) => {
    if (!window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      // For candidates and recruiters, the API expects userId, not candidateId/recruiterId
      if (userType === "candidate" || userType === "recruiter") {
        // Find the user ID based on the provided candidateId/recruiterId
        let userData;

        if (userType === "candidate") {
          userData = candidates.find((c) => c.candidateId === userId);
        } else {
          userData = allRecruiters.find((r) => r.recruiterId === userId);
        }

        if (!userData || !userData.userId) {
          toast.error(`Cannot find user ID for this ${userType}`);
          setActionLoading(false);
          return;
        }

        // Use the proper userId from the user object
        await axios.delete(
          `${API_URL}/api/admins/${userType}s/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (userType === "job") {
        // For jobs, use the jobId directly
        await axios.delete(`${API_URL}/api/admins/jobs/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // For other resource types (like jobs), use the provided ID
        await axios.delete(
          `${API_URL}/api/admins/${userType}s/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success(
        `${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } deleted successfully`
      );

      // Refresh the appropriate list
      if (userType === "candidate") {
        fetchCandidates();
      } else if (userType === "recruiter") {
        fetchAllRecruiters();
      } else if (userType === "job") {
        fetchJobs();
      }
    } catch (error) {
      console.error(`Error deleting ${userType}:`, error);
      toast.error(
        `Failed to delete ${userType}: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className=" min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      {" "}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 ">
        <div>
          <div className="mt-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-2"
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage platform users and content
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => {
              setCurrentView("dashboard");
              fetchPendingRecruiters();
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white rounded-md text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign out
          </button>
        </div>
      </div>
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Dashboard Card */}
        <button
          onClick={() => {
            setCurrentView("dashboard");
            fetchPendingRecruiters();
            fetchDashboardStats(); // Add this line
          }}
          className={`p-4 rounded-lg border ${
            currentView === "dashboard"
              ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700"
              : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          } transition-all`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${
                currentView === "dashboard"
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <Layout size={20} />
            </div>
            <div className="ml-4 text-left">
              <p
                className={`text-sm font-medium ${
                  currentView === "dashboard"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Dashboard
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending approvals
              </p>
            </div>
          </div>
        </button>

        {/* Candidates Card */}
        <button
          onClick={fetchCandidates}
          className={`p-4 rounded-lg border ${
            currentView === "candidates"
              ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700"
              : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          } transition-all`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${
                currentView === "candidates"
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <Users size={20} />
            </div>
            <div className="ml-4 text-left">
              <p
                className={`text-sm font-medium ${
                  currentView === "candidates"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Candidates
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage job seekers
              </p>
            </div>
          </div>
        </button>

        {/* Jobs Card */}
        <button
          onClick={fetchJobs}
          className={`p-4 rounded-lg border ${
            currentView === "jobs"
              ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700"
              : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          } transition-all`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${
                currentView === "jobs"
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <Briefcase size={20} />
            </div>
            <div className="ml-4 text-left">
              <p
                className={`text-sm font-medium ${
                  currentView === "jobs"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Job Listings
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View all job posts
              </p>
            </div>
          </div>
        </button>

        {/* Recruiters Card */}
        <button
          onClick={fetchAllRecruiters}
          className={`p-4 rounded-lg border ${
            currentView === "recruiters"
              ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700"
              : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          } transition-all`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-full ${
                currentView === "recruiters"
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              <UserPlus size={20} />
            </div>
            <div className="ml-4 text-left">
              <p
                className={`text-sm font-medium ${
                  currentView === "recruiters"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Recruiters
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All company accounts
              </p>
            </div>
          </div>
        </button>
      </div>
      {/* Loading Indicator */}
      {actionLoading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-md"></div>
      )}
      {/* Dynamic View */}
      {currentView === "dashboard" && (
        <>
          {/* Statistics Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Users Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Users
                </h3>
                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  <Users size={18} />
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.users.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Candidates
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.users.candidates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Recruiters
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.users.recruiters}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Admins
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.users.admins}
                  </span>
                </div>
              </div>
            </div>

            {/* Jobs Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Jobs
                </h3>
                <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  <Briefcase size={18} />
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.jobs.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.jobs.active}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Closed
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.jobs.closed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Draft
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.jobs.draft}
                  </span>
                </div>
              </div>
            </div>

            {/* Applications Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Applications
                </h3>
                <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.applications.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Interviews Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Interviews
                </h3>
                <span className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dashboardStats.interviews.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {pendingRecruiters.length === 0 && !error ? (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                All caught up!
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                There are no pending recruiter applications at the moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Pending Recruiter Approvals
              </h3>
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Submitted
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {pendingRecruiters
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((recruiter) => (
                      <tr
                        key={recruiter.recruiterId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                {recruiter.firstName?.charAt(0)}
                                {recruiter.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {recruiter.firstName} {recruiter.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {recruiter.companyName ||
                                  "No company specified"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {recruiter.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            {recruiter.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {recruiter.createdAt
                            ? new Date(recruiter.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() =>
                                approveRecruiter(recruiter.recruiterId)
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white rounded-md text-sm font-medium transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                rejectRecruiter(recruiter.recruiterId)
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white rounded-md text-sm font-medium transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {/* Candidates View */}
      {currentView === "candidates" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Registered Candidates
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              View and manage all job seekers on the platform (newest first)
            </p>
          </div>

          {!candidates || candidates.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">
                No candidates found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Registered On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {Array.isArray(candidates) &&
                    candidates
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((candidate) => (
                        <tr
                          key={candidate.candidateId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  {candidate.firstName?.charAt(0)}
                                  {candidate.lastName?.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {candidate.firstName} {candidate.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {candidate.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {candidate.createdAt
                              ? new Date(
                                  candidate.createdAt
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() =>
                                deleteUser(candidate.candidateId, "candidate")
                              }
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white rounded-md text-sm font-medium transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Jobs View */}
      {currentView === "jobs" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg ">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Job Listings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              View all posted job opportunities (newest first)
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">
                No job listings found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Posted
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Recruiter email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {jobs
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((job) => (
                      <tr
                        key={job.jobId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {job.jobType || "Not specified"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {job.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {job.location || "Remote/Not specified"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {job.recruiterEmail ||
                              job.recruiter?.email ||
                              "Not available"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteUser(job.jobId, "job")}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white rounded-md text-sm font-medium transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* All Recruiters View */}
      {currentView === "recruiters" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg ">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              All Recruiters
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              View and manage all company accounts (newest first)
            </p>
          </div>

          {allRecruiters.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recruiters found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Registered On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {allRecruiters
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((recruiter) => (
                      <tr
                        key={recruiter.recruiterId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                {recruiter.firstName?.charAt(0)}
                                {recruiter.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {recruiter.firstName} {recruiter.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {recruiter.companyName || "Not specified"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {recruiter.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              recruiter.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : recruiter.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {recruiter.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {recruiter.createdAt
                            ? new Date(recruiter.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              deleteUser(recruiter.recruiterId, "recruiter")
                            }
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white rounded-md text-sm font-medium transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PendingRecruiters;
