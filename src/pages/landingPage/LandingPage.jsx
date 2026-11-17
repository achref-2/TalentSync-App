import React, { useEffect } from "react";
import { Moon, Sun, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import "../LandingPage.css";
import { BlurText } from "../../components/BlurText";
import { ShinyText } from "../../components/Shiny";
import { Squares } from "../../components/Squares";
import { X } from "lucide-react";
import { ChevronDown, LogIn, UserPlus, Users, Shield } from "lucide-react";
import { useDarkMode } from "../../components/DarkModeProvider";
import styled from "styled-components";

import CandidateLogin from "../candidat/Login/Login";
import CandidateSignup from "../candidat/Singup/Signup";
import RecruiterLogin from "../recruiter/Login/Login";
import RecruiterSignup from "../recruiter/Signup/Signup";

const LandingPage = ({ user }) => {
  const { isDarkMode, toggleTheme } = useDarkMode();

  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Pricing", href: "/Pricing" },
    { name: "Blog", href: "/Blog" },
    { name: "About", href: "#about" }, 
  ];

  const [isModalOneOpen, setIsModalOneOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [isModalThreeOpen, setIsModalThreeOpen] = useState(false);
  const [isModalFourOpen, setIsModalFourOpen] = useState(false);
  const [isModalFiveOpen, setIsModalFiveOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const Modal = ({ isOpen, onClose, children }) => {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className={`
    ${
      isDarkMode
        ? "dark bg-black text-white border-gray-900"
        : "bg-white text-black"
    } 
 w-full max-w-md mx-auto backdrop-blur-sm rounded-2xl border border-gray-200  shadow-2xl 
    
  `}
          >
            <div className="relative ">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8">{children}</div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  };
  const [showWarning, setShowWarning] = useState(false);

  const warning = () => (
    <div
      role="alert"
      className="fixed bottom-9 right-8 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-4 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transform hover:scale-105 z-50"
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 flex-shrink-0 mr-2 text-yellow-600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">Warning - Login before you start.</p>
    </div>
  );

  const handleClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowWarning(true);
      setIsOpen(!isOpen);
      setTimeout(() => {
        setShowWarning(false);
      }, 10000);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-black text-white" : "bg-white text-zinc-900"
      }`}
    >
      <nav className="fixed w-full  z-50 backdrop-blur-sm bg-opacity-10 border-b border-zinc-300 dark:border-zinc-700">
        <div className="container mx-auto px-0 py-1">
          <div className="flex items-center justify-between">
            <a href="/" className=" pr-0">
              <img
                alt="TalentSync"
                src="img/Logo.png"
                className="w-full h-14 p-1 rounded-lg"
              />
            </a>
           
            <div className="flex items-center">
              <span className="text-2xl font-bold"></span>
            </div>

            <div className="flex lg:flex-1 text-2xl font-bold"><a href="/"><span className="text-xl flex lg:flex-1 font-bold ">TalentSync</span></a></div>
            <div className="flex lg:flex-1 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="flex justify-center">
              <div className="hidden lg:flex lg:gap-x-10">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm/6 font-semibold"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
           

            <div className="hidden lg:flex lg:flex-1 lg:justify-end  gap-4">
        {/* Admin Login Button */}
        <a
          href={import.meta.env.BASE_URL + "admin"}
          className={`flex items-center px-3 py-2 text-sm rounded-md transition ${
            isDarkMode
              ? "text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
              : "text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </a>
        
        {/* Recruiter Login Button */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsModalTwoOpen(true);
          }}
          className={`flex items-center px-3 py-2 text-sm rounded-md transition ${
            isDarkMode
              ? "text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
              : "text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
          }`}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Recruiter Login
        </a>
        <Modal
          isOpen={isModalTwoOpen}
          onClose={() => setIsModalTwoOpen(false)}
        >
          <RecruiterLogin />
        </Modal>
        
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOneOpen(true);
          }}
          className={`flex items-center px-4 py-2 text-sm rounded-md font-medium ${
            isDarkMode
              ? "bg-zinc-600 text-white hover:bg-zinc-700"
              : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
          }`}
        >
          Start Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>
        <Modal
          isOpen={isModalOneOpen}
          onClose={() => setIsModalOneOpen(false)}
        >
          <CandidateLogin />
        </Modal>
</div>
          </div>
        </div>
      </nav>
<section>
  <header className="absolute border-none">
  <Dialog
    open={mobileMenuOpen}
    onClose={setMobileMenuOpen}
    className="lg:hidden"
  >
    <div className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />
    
    <DialogPanel
      className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto sm:max-w-sm 
        shadow-xl transition-all duration-300 ease-in-out transform
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        ${
          isDarkMode
            ? "bg-zinc-900/95 text-white border-l border-zinc-800"
            : "bg-white/95 text-zinc-900 border-l border-zinc-100"
        }`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between py-4 px-6 backdrop-blur-sm bg-opacity-80">
        <a href="/" className="flex items-center space-x-2">
          <img
            alt="TalentSync"
            src="img/Logo.png"
            className="h-10 w-10 rounded-lg shadow-md"
          />
          <span className="text-lg font-bold tracking-tight">TalentSync</span>
        </a>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode 
              ? "text-zinc-400 hover:text-white hover:bg-zinc-800" 
              : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          <span className="sr-only">Close menu</span>
          <XMarkIcon aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="px-6 py-4">
        <nav className="mb-8">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
            Navigation
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-zinc-200 hover:bg-zinc-800 hover:text-white"
                    : "text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-6">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
            Account Access
          </h3>
          
          <a
            href={import.meta.env.BASE_URL + "admin"}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
              isDarkMode
                ? "text-zinc-300 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600"
                : "text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
            }`}
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3" />
              <div>
                <div className="font-medium">Admin Portal</div>
                <div className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                  For system administrators
                </div>
              </div>
            </div>
          </a>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsModalTwoOpen(true);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
              isDarkMode
                ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
            }`}
          >
            <div className="flex items-center">
              <LogIn className="w-5 h-5 mr-3" />
              <div>
                <div className="font-medium">Recruiter Login</div>
                <div className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                  For employers and HR teams
                </div>
              </div>
            </div>
          </button>
          <Modal
            isOpen={isModalTwoOpen}
            onClose={() => setIsModalTwoOpen(false)}
          >
            <RecruiterLogin />
          </Modal>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsModalOneOpen(true);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all font-medium ${
              isDarkMode
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            <div className="flex items-center">
              <div>Start Your Journey</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </button>
          <Modal
            isOpen={isModalOneOpen}
            onClose={() => setIsModalOneOpen(false)}
          >
            <CandidateLogin />
          </Modal>
          
          <div className="text-center pt-2">
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsModalThreeOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`text-sm hover:underline ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              New user? Create an account
            </a>
          </div>
        </div>
      </div>
      
      <div className={`mt-8 px-6 py-4 ${isDarkMode ? "border-t border-zinc-800" : "border-t border-zinc-100"}`}>
        <button
          onClick={() => {
            toggleTheme();
          }}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition ${
            isDarkMode
              ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          <span>Switch to {isDarkMode ? "light" : "dark"} mode</span>
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</header>
      <section className="relative w-full overflow-hidden py-24 sm:py-28 md:py-36 lg:py-44 xl:py-48">
      <div className="absolute inset-0">
        <Squares
          direction="down"
          speed={0.1} 
          borderColor={isDarkMode ? "#444" : "#ddd"}
          hoverFillColor={isDarkMode ? "#333" : "#f0f0f0"}
          squareSize={48} 
          theme={isDarkMode ? "dark" : "light"}
        />
      </div>
      
      <div className="relative mx-auto px-4 sm:px-6 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl min-h-[50vh] flex flex-col justify-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6">
          <BlurText
            text="Land Your Dream Job With Us"
            delay={150}
            animateBy="words"
            direction="top"
          />
        </h1>
        
       <p className="mx-auto mb-8 max-w-lg text-base sm:text-lg md:text-xl text-center text-zinc-700 dark:text-zinc-300">
  Get instant feedback, improve fast, and land your dream role. 
  <span className="font-medium"> 95% of users increased confidence after just 3 sessions.</span>
</p>
        
       <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
  <a 
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setIsModalThreeOpen(true);
    }}
    className="w-auto sm:w-auto flex justify-center"
  >
    <StyledWrapper className="w-auto max-w-xs">
      <button className="button relative font-bold text-white dark:text-zinc-100 py-3 px-6 w-auto">
        Start For Free <span className="ml-1">→</span>
        <div className="hoverEffect">
          <div />
        </div>
      </button>
    </StyledWrapper>
  </a>

        <Modal
  isOpen={isModalThreeOpen}
  onClose={() => setIsModalThreeOpen(false)}
>
  <CandidateSignup 
    onClose={() => setIsModalThreeOpen(false)}
    openLoginModal={() => setIsModalOneOpen(true)}
  />
</Modal>
        </div>
        
        {/* Recruiter link with improved positioning */}
        <div className="text-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsModalFiveOpen(true);
            }}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline transition-colors duration-200"
          >
            Are you a recruiter? Sign up here.
          </a>
          
         <Modal
  isOpen={isModalFiveOpen}
  onClose={() => setIsModalFiveOpen(false)}
>
  <RecruiterSignup 
    onClose={() => setIsModalFiveOpen(false)}
    openLoginModal={() => setIsModalTwoOpen(true)}
  />
</Modal>
          
         
        </div>
      </div>
    </section>
      </section>
      {showWarning && warning()}

      <section className="py-24 bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-black" id="about">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-sm font-semibold mb-4">
        Our Story
      </span>
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About TalentSync</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Revolutionizing how talent and opportunity connect in the digital age
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-16 items-center">
      {/* Left Content */}
      <div className="order-2 md:order-1">
        <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h3>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          At <span className="font-semibold text-indigo-700 dark:text-indigo-300">TalentSync</span>, we believe that finding the right career opportunity should be intuitive, efficient, and personalized. Our platform harnesses the power of advanced AI algorithms to create meaningful connections between exceptional talent and forward-thinking organizations.
        </p>
        <p className="text-lg mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          We're committed to transforming the traditional hiring process by eliminating unconscious bias, reducing time-to-hire, and creating a more transparent ecosystem where skills and potential take center stage.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium">AI-Driven Matching</span>
          </div>
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium">Skill-Based Assessment</span>
          </div>
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium">Career Growth Tools</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <a href="#mission" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg">
            Learn More
          </a>
          <a href="#team" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
            Meet Our Team
          </a>
        </div>
      </div>
      
      {/* Right Image */}
      <div className="order-1 md:order-2">
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl transform -rotate-3"></div>
          <div className="absolute -inset-4 bg-gray-200 dark:bg-gray-700 rounded-xl transform rotate-3 -z-10"></div>
          <div className="relative overflow-hidden rounded-xl shadow-xl border-8 border-white dark:border-gray-800">
            <img
              src={isDarkMode ? "img/Dashboard.png" : "img/DashboardW.png"}
              alt="TalentSync Platform"
              className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-indigo-600 dark:bg-indigo-500 text-white p-4 rounded-lg shadow-lg">
            <div className="font-bold text-xl">5000+</div>
            <div className="text-sm">Successful Matches</div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Stats Section */}
    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">98%</div>
        <div className="text-gray-600 dark:text-gray-300">Satisfaction Rate</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">2500+</div>
        <div className="text-gray-600 dark:text-gray-300">Companies</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">85%</div>
        <div className="text-gray-600 dark:text-gray-300">Faster Hiring</div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">24/7</div>
        <div className="text-gray-600 dark:text-gray-300">Support</div>
      </div>
    </div>
  </div>
</section>

<section
  className={`py-24 ${
    isDarkMode
      ? "bg-gradient-to-b from-black to-black"
      : "bg-gradient-to-b from-white to-gray-50"
  }`}
>
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <span
        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
          isDarkMode
            ? "bg-zinc-900 text-zinc-300"
            : "bg-zinc-100 text-zinc-800"
        }`}
      >
        What Makes Us Different
      </span>
      <h2
        className={`text-4xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Powerful Features Built For Your Success
      </h2>
      <p
        className={`text-xl max-w-3xl mx-auto ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Our cutting-edge platform combines advanced technology with personalized
        support to help you achieve your career goals.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-10">
      {/* Feature 1 */}
      <div
        className={`rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl ${
          isDarkMode ? "bg-zinc-800" : "bg-white"
        }`}
      >
        <div
          className={`h-56 flex items-center justify-center p-6 ${
            isDarkMode ? "bg-zinc-700" : "bg-zinc-500"
          }`}
        >
          <svg
            className="w-24 h-24 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"></path>
            <path d="M12 8v4l3 3"></path>
            <path d="M17.5 6.5L19 8"></path>
            <path d="M6.5 17.5L8 19"></path>
            <path d="M17.5 17.5L16 16"></path>
            <path d="M6.5 6.5L5 5"></path>
          </svg>
        </div>
        <div className="p-8">
          <h3
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            AI-Powered Matching
          </h3>
          <p
            className={`mb-6 leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Our proprietary algorithm analyzes over 50 data points to connect
            you with opportunities that align perfectly with your skills and
            career goals.
          </p>
          
        </div>
      </div>

      {/* Feature 2 */}
      <div
        className={`rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl ${
          isDarkMode ? "bg-zinc-800" : "bg-white"
        }`}
      >
        <div
          className={`h-56 flex items-center justify-center p-6 ${
            isDarkMode ? "bg-zinc-700" : "bg-zinc-500"
          }`}
        >
          <svg
            className="w-24 h-24 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="p-8">
          <h3
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Personalized Career Support
          </h3>
          <p
            className={`mb-6 leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Receive tailored advice from industry experts and AI-driven
            insights that help you make informed decisions about your career
            path and development.
          </p>
          
        </div>
      </div>

      {/* Feature 3 */}
      <div
        className={`rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl ${
          isDarkMode ? "bg-zinc-800" : "bg-white"
        }`}
      >
        <div
          className={`h-56 flex items-center justify-center p-6 ${
            isDarkMode ? "bg-zinc-700" : "bg-zinc-500"
          }`}
        >
          <svg
            className="w-24 h-24 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div className="p-8">
          <h3
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Real-Time Job Alerts
          </h3>
          <p
            className={`mb-6 leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Get instant notifications about relevant opportunities before
            they're widely publicized, giving you a competitive edge in your
            job search.
          </p>
          
        </div>
      </div>
    </div>

    <div className="mt-20 text-center">
      
      <p
        className={`mt-4 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        No credit card required. Get started in minutes.
      </p>
    </div>
  </div>
</section>

      <section className="py-20 ">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
    <h2
        className={`text-4xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >Frequently Asked Questions</h2>
       <p
        className={`mt-4 text-xl max-w-2xl mx-auto ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >Everything you need to know about TalentSync and how it can transform your career journey</p>
    </div>

    <div
      className={`max-w-3xl mx-auto rounded-lg shadow-lg overflow-hidden ${
        isDarkMode ? "bg-zinc-950" : "bg-white"
      }`}>
      <div
      className={`divide-y ${
        isDarkMode ? "divide-gray-700" : "divide-gray-200"
      }`}
    >        {/* FAQ Item 1 */}
        <div className="collapse">
          <input type="radio" name="faq-accordion" className="peer" />
          <div
            className={`collapse-title p-6 flex justify-between items-center cursor-pointer transition ${
              isDarkMode
                ? "hover:bg-gray-700 text-zinc-300"
                : "hover:bg-gray-50 text-gray-900"
            }`}
          >            <h3 className="text-xl font-semibold ">Is TalentSync really free to use?</h3>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div
            className={`collapse-content px-6 pb-6 pt-0 ${
              isDarkMode ? "bg-zinc-950 text-zinc-300" : "bg-gray-50 text-gray-700"
            }`}
          >
            <p className=" leading-relaxed">
              Yes! TalentSync is completely free for job seekers. We believe in democratizing access to career opportunities. 
              Employers can access basic matching features for free.
            </p>
          </div>
        </div>

        {/* FAQ Item 2 */}
        <div className="collapse">
          <input type="radio" name="faq-accordion" className="peer" />
          <div
            className={`collapse-title p-6 flex justify-between items-center cursor-pointer transition ${
              isDarkMode
                ? "hover:bg-gray-700 text-zinc-300"
                : "hover:bg-gray-50 text-zinc-800"
            }`}
          >            <h3 className="text-xl font-semibold ">How does TalentSync's AI matching work?</h3>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div
            className={`collapse-content px-6 pb-6 pt-0 ${
              isDarkMode ? "bg-zinc-950 text-zinc-300" : "bg-gray-50 text-gray-700"
            }`}
          >
            <p className=" leading-relaxed">
              Our proprietary AI algorithm analyzes over 50 different data points from your profile including skills, 
              experience, work style preferences, and career goals. It then compares these against thousands of job listings 
              or candidate profiles to find optimal matches with a 93% satisfaction rate. The system continuously learns from 
              feedback to improve match quality over time.
            </p>
          </div>
        </div>

        {/* FAQ Item 3 */}
        <div className="collapse">
          <input type="radio" name="faq-accordion" className="peer" />
          <div
            className={`collapse-title p-6 flex justify-between items-center cursor-pointer transition ${
              isDarkMode
                ? "hover:bg-gray-700 text-zinc-300"
                : "hover:bg-gray-50 text-zinc-800"
            }`}
          >            <h3 className="text-xl font-semibold ">Can I update my profile information?</h3>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div
            className={`collapse-content px-6 pb-6 pt-0 ${
              isDarkMode ? "bg-zinc-950 text-zinc-300" : "bg-gray-50 text-gray-700"
            }`}
          >            <p className=" leading-relaxed">
              Absolutely! Your profile is fully editable at any time. Simply navigate to "Profile Settings" in your dashboard 
              to update your information. We recommend refreshing your profile quarterly to ensure the most accurate matching results.
              You can also sync your profile with LinkedIn to keep everything automatically updated.
            </p>
          </div>
        </div>

        {/* FAQ Item 4 */}
        <div className="collapse">
          <input type="radio" name="faq-accordion" className="peer" />
          <div
            className={`collapse-title p-6 flex justify-between items-center cursor-pointer transition ${
              isDarkMode
                ? "hover:bg-gray-700 text-zinc-300"
                : "hover:bg-gray-50 text-gray-900"
            }`}
          >            <h3 className="text-xl font-semibold ">How secure is my personal information?</h3>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div
            className={`collapse-content px-6 pb-6 pt-0 ${
              isDarkMode ? "bg-zinc-950 text-zinc-300" : "bg-gray-50 text-gray-700"
            }`}
          >            <p className=" leading-relaxed">
              Your privacy is our top priority. TalentSync uses enterprise-grade encryption and follows GDPR and CCPA compliance 
              standards. We never share your personal information with third parties without your explicit consent. You have 
              complete control over what information is visible to potential employers or candidates.
            </p>
          </div>
        </div>

        {/* FAQ Item 5 */}
        <div className="collapse">
          <input type="radio" name="faq-accordion" className="peer" />
          <div
            className={`collapse-title p-6 flex justify-between items-center cursor-pointer transition ${
              isDarkMode
                ? "hover:bg-gray-700 text-zinc-300"
                : "hover:bg-gray-50 text-zinc-800"
            }`}
          >            <h3 className="text-xl font-semibold ">What makes TalentSync different from other job platforms?</h3>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div
            className={`collapse-content px-6 pb-6 pt-0 ${
              isDarkMode ? "bg-zinc-950 text-zinc-300" : "bg-gray-50 text-gray-700"
            }`}
          >            <p className=" leading-relaxed">
              Unlike traditional job boards that overwhelm you with listings, TalentSync focuses on quality over quantity. 
              Our AI-powered matching ensures you only see opportunities that truly align with your skills and goals. We also 
              provide valuable insights about company culture fit and growth potential that you won't find elsewhere.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    
  </div>
</section>
      {/* Footer */}
      <footer className={`py-16 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
  <div className="container mx-auto px-6">
    {/* Main Footer Content */}
    <div className="flex flex-col md:flex-row justify-between gap-12">
      {/* Company Information */}
      <div className="md:w-1/3">
        <div className="flex items-center mb-6">
          <svg
            className={`h-8 w-8 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span
            className={`ml-2 text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            TalentSync
          </span>
        </div>
        <p
          className={`mb-6 leading-relaxed ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Connecting talent with opportunity through intelligent matching and career development resources.
        </p>
        <div className="flex items-center">
          <a
            href="#"
            className={`mr-6 transition-colors duration-200 ${
              isDarkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-500 hover:text-indigo-600"
            }`}
            aria-label="LinkedIn"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a
            href="#"
            className={`flex items-center transition-colors duration-200 ${
              isDarkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-500 hover:text-indigo-600"
            }`}
            aria-label="Email"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="ml-2">contact@talentsync.io</span>
          </a>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
        <div>
          <h4
            className={`font-bold text-lg mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Company
          </h4>
          <ul className="space-y-3">
            {["About", "Careers", "Contact", "Pricing"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className={`transition-colors duration-200 ${
                    isDarkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4
            className={`font-bold text-lg mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Resources
          </h4>
          <ul className="space-y-3">
            {["Blog", "Documentation", "Help Center", "Guides"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className={`transition-colors duration-200 ${
                    isDarkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4
            className={`font-bold text-lg mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Legal
          </h4>
          <ul className="space-y-3">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className={`transition-colors duration-200 ${
                    isDarkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom Footer */}
    <div
      className={`mt-8 pt-8 border-t ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } flex flex-col md:flex-row justify-between items-center`}
    >
      <div className="mb-4 md:mb-0">
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          &copy; 2025 TalentSync. All rights reserved.
        </p>
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-between w-28 px-3 py-2 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
              : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
          }`}
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
        >
          <span className="text-sm font-medium">
            {isDarkMode ? "Dark" : "Light"}
          </span>
          {isDarkMode ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
        <a
          href="#"
          className={`transition-colors duration-200 ${
            isDarkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
          }`}
        >
          Sitemap
        </a>
        <a
          href="#"
          className={`transition-colors duration-200 ${
            isDarkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
          }`}
        >
          Accessibility
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};
const StyledWrapper = styled.div`
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 15px 30px;
    border: none;
    position: relative;
    overflow: hidden;
    border-radius: 50rem; /* Using '50%' for smoother circular effect */
    transition: all 0.3s ease; /* Slightly smoother transition */
    font-weight: bold;
    cursor: pointer;
    background: transparent;
    z-index: 0;
    box-shadow: 0 0 7px -5px rgba(0, 0, 0, 0.5);
    outline: none; /* Remove default outline */
  }

  .button:hover {
    background: rgb(193, 228, 248);
    color: rgb(33, 0, 85);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4); /* Smooth box-shadow transition on hover */
  }

  .button:active {
    transform: scale(0.97);
  }

  .button:focus {
    outline: 2px solid rgba(131, 40, 180, 1); /* Adding focus state for accessibility */
  }

  .hoverEffect {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;
  }

  .hoverEffect div {
    background: linear-gradient(90deg, rgba(122, 0, 51, 1) 0%, rgba(131, 40, 180, 1) 49%, rgba(0, 162, 204, 1) 100%);
    border-radius: 50%; /* Smoothed rounded effect */
    width: 10rem;
    height: 10rem;
    transition: all 0.4s ease;
    filter: blur(20px);
    animation: effect 3s linear infinite;
    opacity: 0.85;
  }

  .button:hover .hoverEffect div {
    width: 7rem;
    height: 7rem;
  }

  @keyframes effect {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StyledWrapper1 = styled.div`
  .theme-switch {
    --toggle-size: 15px;
    /* the size is adjusted using font-size,
       this is not transform scale,
       so you can choose any size */
    --container-width: 5.625em;
    --container-height: 2.5em;
    --container-radius: 6.25em;
    /* radius 0 - minecraft mode :) */
    --container-light-bg: #3d7eae;
    --container-night-bg: #1d1f2c;
    --circle-container-diameter: 3.375em;
    --sun-moon-diameter: 2.125em;
    --sun-bg: #ecca2f;
    --moon-bg: #c4c9d1;
    --spot-color: #959db1;
    --circle-container-offset: calc(
      (var(--circle-container-diameter) - var(--container-height)) / 2 * -1
    );
    --stars-color: #fff;
    --clouds-color: #f3fdff;
    --back-clouds-color: #aacadf;
    --transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    --circle-transition: 0.3s cubic-bezier(0, -0.02, 0.35, 1.17);
  }

  .theme-switch,
  .theme-switch *,
  .theme-switch *::before,
  .theme-switch *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: var(--toggle-size);
  }

  .theme-switch__container {
    width: var(--container-width);
    height: var(--container-height);
    background-color: var(--container-light-bg);
    border-radius: var(--container-radius);
    overflow: hidden;
    cursor: pointer;
    -webkit-box-shadow: 0em -0.062em 0.062em rgba(0, 0, 0, 0.25),
      0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
    box-shadow: 0em -0.062em 0.062em rgba(0, 0, 0, 0.25),
      0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__container::before {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    -webkit-box-shadow: 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset,
      0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
    box-shadow: 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset,
      0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
    border-radius: var(--container-radius);
  }

  .theme-switch__checkbox {
    display: none;
  }

  .theme-switch__circle-container {
    width: var(--circle-container-diameter);
    height: var(--circle-container-diameter);
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    left: var(--circle-container-offset);
    top: var(--circle-container-offset);
    border-radius: var(--container-radius);
    -webkit-box-shadow: inset 0 0 0 3.375em rgba(255, 255, 255, 0.1),
      inset 0 0 0 3.375em rgba(255, 255, 255, 0.1),
      0 0 0 0.625em rgba(255, 255, 255, 0.1),
      0 0 0 1.25em rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 0 3.375em rgba(255, 255, 255, 0.1),
      inset 0 0 0 3.375em rgba(255, 255, 255, 0.1),
      0 0 0 0.625em rgba(255, 255, 255, 0.1),
      0 0 0 1.25em rgba(255, 255, 255, 0.1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-transition: var(--circle-transition);
    -o-transition: var(--circle-transition);
    transition: var(--circle-transition);
    pointer-events: none;
  }

  .theme-switch__sun-moon-container {
    pointer-events: auto;
    position: relative;
    z-index: 2;
    width: var(--sun-moon-diameter);
    height: var(--sun-moon-diameter);
    margin: auto;
    border-radius: var(--container-radius);
    background-color: var(--sun-bg);
    -webkit-box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61)
        inset,
      0em -0.062em 0.062em 0em #a1872a inset;
    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset,
      0em -0.062em 0.062em 0em #a1872a inset;
    -webkit-filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25))
      drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
    filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25))
      drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
    overflow: hidden;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
  }

  .theme-switch__moon {
    -webkit-transform: translateX(100%);
    -ms-transform: translateX(100%);
    transform: translateX(100%);
    width: 100%;
    height: 100%;
    background-color: var(--moon-bg);
    border-radius: inherit;
    -webkit-box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61)
        inset,
      0em -0.062em 0.062em 0em #969696 inset;
    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset,
      0em -0.062em 0.062em 0em #969696 inset;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__spot {
    position: absolute;
    top: 0.75em;
    left: 0.312em;
    width: 0.75em;
    height: 0.75em;
    border-radius: var(--container-radius);
    background-color: var(--spot-color);
    -webkit-box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
    box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
  }

  .theme-switch__spot:nth-of-type(2) {
    width: 0.375em;
    height: 0.375em;
    top: 0.937em;
    left: 1.375em;
  }

  .theme-switch__spot:nth-last-of-type(3) {
    width: 0.25em;
    height: 0.25em;
    top: 0.312em;
    left: 0.812em;
  }

  .theme-switch__clouds {
    width: 1.25em;
    height: 1.25em;
    background-color: var(--clouds-color);
    border-radius: var(--container-radius);
    position: absolute;
    bottom: -0.625em;
    left: 0.312em;
    -webkit-box-shadow: 0.937em 0.312em var(--clouds-color),
      -0.312em -0.312em var(--back-clouds-color),
      1.437em 0.375em var(--clouds-color),
      0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color),
      1.25em -0.062em var(--back-clouds-color),
      2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color),
      3.625em -0.062em var(--clouds-color), 2.625em 0em var(--back-clouds-color),
      4.5em -0.312em var(--clouds-color),
      3.375em -0.437em var(--back-clouds-color),
      4.625em -1.75em 0 0.437em var(--clouds-color),
      4em -0.625em var(--back-clouds-color),
      4.125em -2.125em 0 0.437em var(--back-clouds-color);
    box-shadow: 0.937em 0.312em var(--clouds-color),
      -0.312em -0.312em var(--back-clouds-color),
      1.437em 0.375em var(--clouds-color),
      0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color),
      1.25em -0.062em var(--back-clouds-color),
      2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color),
      3.625em -0.062em var(--clouds-color), 2.625em 0em var(--back-clouds-color),
      4.5em -0.312em var(--clouds-color),
      3.375em -0.437em var(--back-clouds-color),
      4.625em -1.75em 0 0.437em var(--clouds-color),
      4em -0.625em var(--back-clouds-color),
      4.125em -2.125em 0 0.437em var(--back-clouds-color);
    -webkit-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    -o-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
  }

  .theme-switch__stars-container {
    position: absolute;
    color: var(--stars-color);
    top: -100%;
    left: 0.312em;
    width: 2.75em;
    height: auto;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
  }

  /* actions */

  .theme-switch__checkbox:checked + .theme-switch__container {
    background-color: var(--container-night-bg);
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__circle-container {
    left: calc(
      100% - var(--circle-container-offset) - var(--circle-container-diameter)
    );
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__circle-container:hover {
    left: calc(
      100% - var(--circle-container-offset) - var(--circle-container-diameter) -
        0.187em
    );
  }

  .theme-switch__circle-container:hover {
    left: calc(var(--circle-container-offset) + 0.187em);
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__moon {
    -webkit-transform: translate(0);
    -ms-transform: translate(0);
    transform: translate(0);
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__clouds {
    bottom: -4.062em;
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__stars-container {
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
`;
export default LandingPage;
