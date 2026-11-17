import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = API_URL + "/api/candidates/signup";
      const updatedData = { ...data, role: "candidate" };

      const { data: res } = await axios.post(url, updatedData);

      // Store role
      localStorage.setItem("userRole", "candidate");
      localStorage.setItem("userType", "candidate");

      // Show success message
      setMessage("Candidate created successfully! You can now login");

      // Clear the form
      setData({
        firstName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        onClose();
        openLoginModal();
      }, 2000);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const clientId =
    "9748260171-v0tq98gnchgvvr9v6jvblpivlbina5q9.apps.googleusercontent.com";

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleLoginSuccess = async (response) => {
    try {
      setIsLoading(true);
      console.log("Google Token:", response.credential);

      const res = await axios.post(API_URL + "/api/auth/google", {
        token: response.credential,
      });

      console.log("Google Auth Success:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", "candidate");
      localStorage.setItem("userType", "candidate"); 
      // Show success message
      setMessage("Account created successfully! Redirecting to dashboard...");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Google Auth Error:", error);
      setError("Failed to sign up with Google. Please try again.");
    } finally {
      setIsLoading(false);
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
          className="w-14 h-14 text-gray-600 p-0 dark:text-white transition-all duration-300 ease-in-out z-30 mx-auto "
        />
        <h2 className="my-1 text-center text-2xl font-semibold tracking-tight  ">
          Sign Up
        </h2>
        <p className="text-center  font-thin tracking-tight border-b  border-zinc-300 text-zinc-500 dark:border-zinc-700 pb-7">
          Ready to ace your dream Job ?
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
                type="email"
                placeholder="hello@example.com"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
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
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[90%] mx-auto py-2 px-4 bg-zinc-300 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded hover:bg-zinc-400 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-900 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/" className="text-blue-500 hover:text-blue-600">
                Log In
              </a>
            </div>
            {message && (
              <div className="mb-4 w-[90%] mx-auto px-4 py-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center">
                <Check
                  size={18}
                  className="text-green-600 dark:text-green-400 flex-shrink-0 mr-2"
                />
                <span className="text-sm text-green-800 dark:text-green-300">
                  {message}
                </span>
              </div>
            )}
            {/* Or Divider */}
            <div className="flex items-center  my-4 w-[90%] mx-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="w-[90%] mx-auto">
              <GoogleOAuthProvider clientId={clientId}>
                {isLoading ? (
                  <button
                    disabled
                    className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing up...
                  </button>
                ) : (
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                  />
                )}
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
