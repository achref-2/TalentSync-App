import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { 
  Clock as ClockIcon, 
  Mail as EnvelopeIcon, 
  CheckCircle as CheckCircleIcon, 
  RefreshCw as RefreshIcon, 
  ArrowLeft as ArrowLeftIcon 
} from "lucide-react";
import { API_URL } from "../../config";
const PendingApproval = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  useEffect(() => {
    // Get email from location state or localStorage
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem("pendingEmail");
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("pendingEmail", stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email is found, redirect to login
      navigate("/login");
    }
    
    // Check if the user is still in pending status
    const pendingFlag = localStorage.getItem("pendingApproval");
    if (!pendingFlag) {
      navigate("/login");
    }
  }, [location, navigate]);
  
  const checkAccountStatus = async () => {
    if (!email) {
      toast.error("Email address not found. Please login again.");
      return;
    }
    
    setCheckingStatus(true);
    
    try {
const response = await axios.post(
      API_URL + "/api/recruiters/check-status", 
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );      
      const { status } = response.data;
      
      if (status === "approved") {
        toast.success("Your account has been approved! You can now login.");
        localStorage.removeItem("pendingApproval");
        localStorage.removeItem("pendingEmail");
        navigate("/");
      } else if (status === "rejected") {
        toast.error("Your account application has been rejected. Please contact support for more information.");
        localStorage.removeItem("pendingApproval");
        localStorage.removeItem("pendingEmail");
        navigate("/");
      } else {
        toast.info("Your account is still pending approval. We'll notify you once it's approved.");
      }
    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("Failed to check account status. Please try again later.");
    } finally {
      setCheckingStatus(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("pendingApproval");
    localStorage.removeItem("pendingEmail");
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <ClockIcon className="h-10 w-10 text-yellow-600 dark:text-yellow-300" />
          </div>
          
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Account Pending Approval
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your account application is currently under review by our administrators.
            We'll notify you once it's approved.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-3 text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  Email Address
                </p>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {email || "Not available"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  What happens next?
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Our team will review your application</li>
                    <li>You'll receive an email notification when approved</li>
                    <li>Once approved, you can log in to your account</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={checkAccountStatus}
              disabled={checkingStatus}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingStatus ? (
                <>
                  <RefreshIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Checking status...
                </>
              ) : (
                <>
                  <RefreshIcon className="-ml-1 mr-2 h-4 w-4" />
                  Check status
                </>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to login
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Need help? Contact our support team at{" "}
            <a 
              href="mailto:support@talentsync.com" 
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              support@talentsync.com
            </a>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to login page
        </Link>
      </div>
    </div>
  );
};

export default PendingApproval;