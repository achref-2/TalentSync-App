import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, AlertCircle, Mail,XCircle, HelpCircle  } from 'lucide-react';

const SignupConfirmation = () => {
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('pending'); // default to pending
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user came from a successful signup
    const success = localStorage.getItem('signupSuccess');
    
    // Get stored data
    setRecruiterName(localStorage.getItem('recruiterName') || '');
    setRecruiterEmail(localStorage.getItem('recruiterEmail') || '');
    setMessage(localStorage.getItem('signupMessage') || 'Your account has been rejected!');
    setStatus(localStorage.getItem('recruiterStatus') || 'pending');
    
    // Clean up localStorage after retrieving data
    return () => {
      localStorage.removeItem('signupSuccess');
      localStorage.removeItem('signupMessage');
      localStorage.removeItem('recruiterName');
      localStorage.removeItem('recruiterEmail');
      localStorage.removeItem('recruiterStatus');
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
            {status === 'approved' ? (
              <CheckCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            ) : (
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            )}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {status === 'approved' ? 'Registration Successful' : 'Registration Rejected'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Thank you for signing up{recruiterName ? `, ${recruiterName}` : ''}!
          </p>
        </div>
        
       <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  {message || "Your registration could not be approved at this time."}
                </p>
                <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                  We're sorry, but your account registration was not approved. This might be due to incomplete or incorrect information provided.
                </p>
                
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-red-100 dark:border-red-900">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    What can you do next?
                  </h4>
                  <ul className="mt-2 pl-5 list-disc text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Contact our support team for more information at <a href="mailto:support@talentsync.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@talentsync.com</a></li>
                    <li>Ensure your company information is accurate and complete</li>
                    <li>Verify that your business registration details are correct</li>
                    <li>You may reapply after resolving any issues with your application</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        
        <div className="mt-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            What would you like to do next?
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3">
           
            <Link
              to="/"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupConfirmation;