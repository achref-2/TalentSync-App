import React, { useState, useRef,useEffect,useContext } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  PenTool,
  Moon,
  Sun,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  CheckCircle2,
  XCircle,
  FileText,
  Wrench,
  Users,
  User, 
Briefcase,
  LogOut, 
  FileClock,
  Mail,
  Calendar,
 
    Filter,
    CalendarRange,
    ExternalLink,
 
    Clock, 
    MapPin, 
    
    
    Link as LinkIcon, 
    ArrowRight, 
    CheckCircle, 
    CalendarClock
   
   
  
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CV from "./CV/CvCreation";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../components/UserContext";
import { format, parseISO, isAfter } from 'date-fns';
import {toast} from 'react-toastify';
import { useDarkMode } from "../../components/DarkModeProvider";
import { API_URL } from "../../config";
const NavLink = ({ href, icon: Icon, children, isActive, disabled }) => (
  <Link
    to={disabled ? "#" : href} // Prevent navigation if disabled
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out z-30
      ${
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : isActive
          ? "bg-zinc-200 text-black dark:bg-zinc-900 dark:text-white"
          : "text-gray-500 hover:bg-zinc-200 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900 dark:hover:text-white"
      }
    `}
    aria-current={isActive ? "page" : undefined}
    onClick={(e) => {
      if (disabled) {
        e.preventDefault(); // Prevent navigation if disabled
      }
    }}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="truncate">{children}</span>
  </Link>
);

const SearchBar = ({ navigationMenu, navigationOption }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  
  // Filter menu items based on search query
  const filteredMenu = navigationMenu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredOption = navigationOption.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Combine filtered items for keyboard navigation
  const allFilteredItems = [...filteredMenu, ...filteredOption];
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < allFilteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && allFilteredItems[activeIndex]) {
      window.location.href = allFilteredItems[activeIndex].href;
      setIsModalOpen(false);
    } else if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    const handleClickOutside = (event) => {
      if (isModalOpen && event.target.classList.contains('modal-backdrop')) {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);
  
  // Reset active index when search changes
  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  return (
    <>
      {/* Search Input Trigger */}
      <div className="relative max-w-md w-full group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-zinc-400" />
        <div 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-80 pl-10 pr-4 py-2.5 flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors"
        >
          <span className="text-gray-500 dark:text-gray-400 text-sm">Search...</span>
          <div className="ml-auto flex items-center gap-1 text-xs bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
            <kbd className="font-sans">⌘</kbd>
            <kbd className="font-sans">K</kbd>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains('modal-backdrop')) {
              setIsModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden animate-fadeIn"
          >
            {/* Search Input Inside Modal */}
            <div className="relative border-b border-zinc-200 dark:border-zinc-800">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-zinc-400" />
              <input
                ref={inputRef}
                type="search"
                placeholder="Type to search..."
                className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-900 dark:text-white text-base focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <span className="text-xs font-medium">ESC</span>
              </button>
            </div>

            {/* Results container with max height and scrolling */}
            <div className="max-h-96 overflow-y-auto p-2">
              {/* Show no results message if both arrays are empty */}
              {filteredMenu.length === 0 && filteredOption.length === 0 && searchQuery && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-full mb-3">
                    <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No results found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Try different keywords</p>
                </div>
              )}
              
              {/* Menu Section */}
              {filteredMenu.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Menu
                  </div>
                  <div className="space-y-1">
                    {filteredMenu.map((item, index) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          index === activeIndex 
                            ? 'bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        } transition-colors duration-75`}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Options Section */}
              {filteredOption.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Options
                  </div>
                  <div className="space-y-1">
                    {filteredOption.map((item, index) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          index + filteredMenu.length === activeIndex 
                            ? 'bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        } transition-colors duration-75`}
                        onMouseEnter={() => setActiveIndex(index + filteredMenu.length)}
                      >
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer with keyboard shortcuts */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span>↑↓</span>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>↵</span>
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span>Esc</span>
                <span>Cancel</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const UserMenu = ({ profilePic, firstName, lastName, email }) => {
  const { isDarkMode, toggleTheme } = useDarkMode();


  const handleSignout = () => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem("token");
    fetch(API_URL + "/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(() => {
      window.location.href = import.meta.env.BASE_URL + "";
    });
  };

  const menuItems = [
    {
      label: "Past Applications",
      href: "/dashboard/PastApplications",
      icon: FileClock,
      description: "View your past applications",
    },
    {
      label: "Settings",
      href: "/Settings",
      icon: Settings,
      description: "Manage your preferences",
    },
  ];

  return (
    <HeadlessMenu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton className="flex items-center focus:outline-none">
            <div className="relative">
            <img
  className={`h-9 w-9 rounded-full object-cover ring-2 transition-all duration-200 ${
    open
      ? "ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900"
      : "ring-gray-200 dark:ring-gray-700 hover:ring-blue-400"
  }`}
  src={profilePic} // Use the profilePic prop
  alt="User avatar"
/>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-zinc-900"></span>
            </div>
          </MenuButton>

          <MenuItems
            className={`absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-100 ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            } ${
              isDarkMode
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "bg-white text-gray-800 border border-gray-100"
            }`}
          >
            {/* Header with user info */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={profilePic } // Use the profilePic prop
                    alt="User avatar"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                   {`${firstName.replace(/\*\*/g, "")} ${lastName.replace(/\*\*/g, "")}`}{" "}                    

                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {email} {/* Use the email prop */}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-1">
            {menuItems.map(({ label, href, icon: Icon, description }) => (
  <MenuItem key={label}>
    {({ active }) => (
      <Link
        to={href}
        className={`group flex items-center justify-between px-4 py-2 text-sm ${
          active
            ? "bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-white"
            : "text-gray-700 dark:text-gray-200"
        }`}
      >
        <div className="flex items-center">
          <div
            className={`mr-3 p-1 rounded-md ${
              active
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium">{label}</p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
            active ? "opacity-100" : ""
          }`}
        />
      </Link>
    )}
  </MenuItem>
))}
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-700 py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={toggleTheme}
                    className={`w-full group flex items-center justify-between px-4 py-2 text-sm ${
                      active
                        ? "bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-white"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-3 p-1 rounded-md ${
                          active
                            ? "bg-amber-100 text-amber-600 dark:bg-indigo-900 dark:text-indigo-300"
                            : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
                        }`}
                      >
                        {isDarkMode ? (
                          <Sun className="w-4 h-4" />
                        ) : (
                          <Moon className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Switch appearance
                        </p>
                      </div>
                    </div>
                    <div className="flex h-5 items-center">
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-1 ${
                          isDarkMode ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                            isDarkMode ? "translate-x-3" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                )}
              </MenuItem>
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-700 py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleSignout}
                    className={`group flex items-center justify-between w-full px-4 py-2 text-sm ${
                      active
                        ? "bg-gray-100 text-red-600 dark:bg-zinc-700 dark:text-red-400"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-3 p-1 rounded-md ${
                          active
                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">Sign out</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          End your current session
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </>
      )}
    </HeadlessMenu>
  );
};
const UserMessage = () => {
  const { isDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get(API_URL + '/api/candidates/interviews', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Transform interviews into notification format
        const interviewNotifications = response.data.interviews.map(interview => {
          // Calculate time difference
          const interviewDate = new Date(interview.scheduledDate);
          const now = new Date();
          const diffDays = Math.floor((interviewDate - now) / (1000 * 60 * 60 * 24));
          
          let timeMessage;
          if (diffDays === 0) {
            timeMessage = 'Today';
          } else if (diffDays === 1) {
            timeMessage = 'Tomorrow';
          } else if (diffDays > 1) {
            timeMessage = `In ${diffDays} days`;
          } else {
            timeMessage = `${Math.abs(diffDays)} days ago`;
          }
          
          // Format interview time
          const time = new Date(interview.scheduledTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          // Create notification object
          return {
            id: interview._id,
            message: `Interview for ${interview.jobId?.title || 'Job Position'}`,
            details: `With ${interview.recruiterId?.firstName || ''} ${interview.recruiterId?.lastName || ''} at ${time}`,
            time: timeMessage,
            icon: Calendar,
            type: 'interview'
          };
        });
        
        setNotifications(interviewNotifications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to load notifications');
        setLoading(false);
      }
    };
    
    fetchInterviews();
  }, []);
  
  // If there are no interviews, include some default notifications
  const displayNotifications = notifications.length > 0 
    ? notifications 
    : [
        {
          message: "No upcoming interviews",
          details: "Check again later for updates",
          time: "Now",
          icon: Calendar,
          type: 'info'
        }
      ];
  
  return (
    <HeadlessMenu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton className="flex items-center focus:outline-none">
            <div className="relative">
              <button
                type="button"
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                )}
              </button>
            </div>
          </MenuButton>

          <MenuItems
            className={`absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-100 ${
              open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            } ${
              isDarkMode
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "bg-white text-gray-800 border border-gray-100"
            }`}
          >
            {/* Header with title */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Notifications
                </p>
                {notifications.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>
            </div>

            {/* Notifications list */}
            <div className="py-1 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="px-4 py-4 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : (
                displayNotifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className={`group flex items-center px-4 py-3 text-sm border-b border-gray-100 dark:border-zinc-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors ${
                      notification.type === 'interview' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`mr-3 p-2 rounded-md ${
                        notification.type === 'interview' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        <notification.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{notification.message}</p>
                        {notification.details && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{notification.details}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-700 text-center">
              <a href={import.meta.env.BASE_URL + "dashboard/interviews"} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View all notifications
              </a>
            </div>
          </MenuItems>
        </>
      )}
    </HeadlessMenu>
  );
};


const Interviews  = () => {
  const { profilePic, firstName, lastName, email } = useContext(UserContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [feedbackText, setFeedbackText] = useState('');
  const { isDarkMode } = useDarkMode();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all", "upcoming", "past"
  const [searchQuery, setSearchQuery] = useState("");
  // Add this function to your component
 // Add this function to your component to fetch interview notes

  
  // Update the respondToInterview function to fetch notes after a successful response
  const respondToInterview = async (interviewId, response) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      const payload = {
        response: response, // Keep as 'yes' or 'no'
        feedback: feedbackText
      };
  
      console.log("Sending response payload:", payload);
  
      const apiResponse = await axios.put(
        `${API_URL}/api/candidates/interviews/${interviewId}/respond`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      console.log("API Response:", apiResponse.data);
  
      // Update the interview in the UI
      setInterviews(prevInterviews => 
        prevInterviews.map(interview => 
          interview._id === interviewId 
            ? {
                ...interview,
                candidateResponse: response,
                candidateFeedback: feedbackText,
                status: response === 'yes' ? 'Confirmed' : 'Declined'
              }
            : interview
        )
      );
  
      // Update the selected interview as well
      setSelectedInterview(prev => ({
        ...prev,
        candidateResponse: response,
        candidateFeedback: feedbackText,
        status: response === 'yes' ? 'Confirmed' : 'Declined'
      }));
  
      // Reset feedback text
      setFeedbackText('');
  
      // Show success message
      toast.success(
        `Interview ${response === 'yes' ? 'accepted' : 'declined'} successfully!`,
        { position: 'bottom-right', autoClose: 3000 }
      );
      
      // After successful response, check if there are any notes from the recruiter
      // This allows showing existing notes immediately after response
      fetchRecruiterNotes(interviewId);
      
    } catch (error) {
      console.error('Error responding to interview:', error);
      
      let errorMessage = 'Failed to update interview response. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };
  
  // Add an effect to periodically check for updated notes after the candidate has responded
  useEffect(() => {
    if (!selectedInterview || !selectedInterview.candidateResponse) return;
    
    // Only fetch notes if the interview is selected and candidate has already responded
    const interviewId = selectedInterview._id;
    
    // Initial fetch
    fetchRecruiterNotes(interviewId);
    
    // Set up polling for updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchRecruiterNotes(interviewId);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedInterview?._id, selectedInterview?.candidateResponse]);
  
  // Add this to the handleViewDetails function to fetch notes when viewing details
  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    
    // If candidate has already responded, fetch the latest notes
    if (interview.candidateResponse) {
      fetchRecruiterNotes(interview._id);
    }
  };
  const fetchRecruiterNotes = async (interviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.get(
        `${API_URL}/api/candidates/interviews/${interviewId}/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the selected interview with the notes
      setSelectedInterview(prev => ({
        ...prev,
        reason: response.data.notes,
        // Update other fields if needed
        status: response.data.status,
        candidateResponse: response.data.candidateResponse
      }));
      
      return response.data.notes;
    } catch (error) {
      console.error('Error fetching recruiter notes:', error);
      toast.error('Failed to load recruiter notes', {
        position: 'bottom-right',
        autoClose: 3000
      });
      return null;
    }
  };
 
  
    useEffect(() => {
      const fetchInterviews = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          
          if (!token) {
            throw new Error('Authentication token not found');
          }
          
          const response = await axios.get(API_URL + '/api/candidates/interviews', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setInterviews(response.data.interviews);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching interviews:', err);
          
          if (err.response) {
            setError(`Failed to load interviews: ${err.response.data.message || 'Server error'}`);
          } else if (err.request) {
            setError('Failed to load interviews: No response from server');
          } else {
            setError(`Failed to load interviews: ${err.message}`);
          }
          
          setLoading(false);
        }
      };
      
      fetchInterviews();
    }, []);
  
    // Filter and sort interviews
    const filteredInterviews = interviews
      .filter(interview => {
        // Apply filter
        const interviewDate = new Date(interview.scheduledDate);
        const now = new Date();
        
        if (filterType === "upcoming" && !isAfter(interviewDate, now)) {
          return false;
        }
        
        if (filterType === "past" && isAfter(interviewDate, now)) {
          return false;
        }
  
        // Apply search
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          const jobTitle = (interview.jobId?.title || "").toLowerCase();
          const companyName = (interview.jobId?.companyName || "").toLowerCase();
          const recruiterName = `${interview.recruiterId?.firstName || ""} ${interview.recruiterId?.lastName || ""}`.toLowerCase();
          
          return jobTitle.includes(searchLower) || 
                 companyName.includes(searchLower) || 
                 recruiterName.includes(searchLower);
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by date, most recent first
        return new Date(b.scheduledDate) - new Date(a.scheduledDate);
      });
  
    // Format date for display
    const formatInterviewDate = (dateStr) => {
      try {
        const date = parseISO(dateStr);
        return format(date, "MMMM d, yyyy");
      } catch (error) {
        console.error('Error formatting date:', error);
        return dateStr;
      }
    };
    
    // Format time for display
    const formatInterviewTime = (timeStr) => {
      try {
        const time = parseISO(`2000-01-01T${timeStr}`);
        return format(time, "h:mm a");
      } catch (error) {
        console.error('Error formatting time:', error);
        return timeStr;
      }
    };
  
    // Check if an interview is upcoming
    const isUpcoming = (dateStr) => {
      try {
        const date = parseISO(dateStr);
        return isAfter(date, new Date());
      } catch {
        return false;
      }
    };
  
    
  
    const navigation_menu = [
        { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
        { name: "Jobs", href: "/Jobs", icon: Briefcase, current: false },
        { name: "Interviews", href: "/dashboard/interviews", icon: CalendarClock, current:true },
        {
          name: "Past Applications",
          href: "/dashboard/PastApplications",
          icon: FileClock,
          current: false,
        },
        { name: "Billing", href: "/Pricing", icon: CreditCard, current: false },
      ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: false },
    { name: "Support", href: "/cv", icon: Wrench, current: false, disabled: true },
  ];
  const [isLoading, setIsLoading] = useState(true);

 

    
    
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out z-30 `}
    >
      <div className="flex h-screen bg-white dark:bg-black">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black  border-gray-200 dark:border-gray-800
                    transition-all duration-300 ease-in-out z-30
                    ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          {/* Rest of the sidebar content remains the same, but update classes to use dark: prefix */}
          <div className="flex items-center justify-between p-2  border-zinc-200 dark:border-zinc-800">
             
            <div className="flex items-center ">
                          <div className="p-0 ">
                          <img
                alt="TalentSync"
                src={import.meta.env.BASE_URL + "img/Logo.png"}
               className="w-full h-14 text-gray-600 p-1 dark:text-white transition-all duration-300 ease-in-out z-30 "
              />                          </div>
                          {isSidebarOpen && (
                            <span className="text-lg  font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">
                              TalentSync
                            </span>
                          )}
                        </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4  ">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-400 px-2">MENU</div>
              {navigation_menu.map((item) => (
                <NavLink
                  key={item.name}
                  href={item.href}
                  icon={item.icon}
                  isActive={item.current}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="text-sm font-medium text-gray-400 px-2">
                OPTIONS
              </div>
              {navigation_option.map((item) => (
                <NavLink
                  key={item.name}
                  href={item.href}
                  icon={item.icon}
                  isActive={item.current}
                  disabled={item.disabled}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>

          {isSidebarOpen && (
            <div className="p-3  border-gray-200 dark:border-gray-900 transition-all duration-300 ease-in-out z-30">
              <div className="   rounded-lg p-4 space-y-4 transition-all duration-300 ease-in-out z-30 ">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white " />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium  text-gray-900 dark:text-white  transition-all duration-300 ease-in-out z-30 ">
                      Buy us a coffee
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500  transition-all duration-300 ease-in-out z-30">
                      TalentSync is free thanks to donations, please support us
                      to keep the project running.
                    </p>
                  </div>
                </div>
                <button className="w-full dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-200 hover:bg-gray-300 text-black dark:text-white py-2 px-4 rounded-lg  transition-colors">
                  Donate
                </button>
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-auto bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar
                navigationMenu={navigation_menu}
                navigationOption={navigation_option}
              />
              <div className="flex items-center gap-4">
              <UserMessage/>
               
              <UserMenu
  profilePic={profilePic || "../../assets/images/avatar.jpg"}
  firstName={firstName || "First Name"}
  lastName={lastName || "Last Name"}
  email={email || "example@example.com"}
/>
              </div>
            </div>
          </header>

         
           <div className="p-4 max-w-7xl mx-auto">
                 <div className="mb-0">
                   <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                     Your Interviews
                   </h1>
                   <p className="text-gray-600 dark:text-gray-400">
                     Manage and prepare for your upcoming interviews
                   </p>
                 </div>
           
                 {/* Filters and search */}
                 <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                   <div className="flex-1 max-w-md relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Search size={18} className="text-gray-400" />
                     </div>
                     <input
                       type="text"
                       placeholder="Search interviews by job title, company or recruiter..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="pl-10 w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     />
                   </div>
                   
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Filter size={18} className="text-gray-400" />
                     </div>
                     <select
                       value={filterType}
                       onChange={(e) => setFilterType(e.target.value)}
                       className="pl-10 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     >
                       <option value="all">All Interviews</option>
                       <option value="upcoming">Upcoming Interviews</option>
                       <option value="past">Past Interviews</option>
                     </select>
                   </div>
                 </div>
                 
                 {error && (
                   <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-red-800 dark:bg-red-900/20 dark:border-red-700/30 dark:text-red-400 mb-6">
                     <p>{error}</p>
                   </div>
                 )}
                 
                 {loading ? (
                   <div className="flex justify-center items-center py-16">
                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                   </div>
                 ) : filteredInterviews.length > 0 ? (
                   <div className="grid grid-cols-1 gap-6">
                     {filteredInterviews.map((interview) => (
                       <div 
                         key={interview._id}
                         className={`bg-white dark:bg-zinc-950 rounded-xl border ${
                           isUpcoming(interview.scheduledDate)
                             ? "border-blue-200 dark:border-blue-900/40"
                             : "border-gray-200 dark:border-gray-800"
                         } overflow-hidden transition-all hover:shadow-md`}
                       >
                         <div className="p-6">
                           <div className="flex flex-col md:flex-row justify-between">
                             <div className="mb-4 md:mb-0">
                               <div className="flex items-center mb-2">
                                 {isUpcoming(interview.scheduledDate) && (
                                   <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full mr-2">
                                     Upcoming
                                   </span>
                                 )}
                                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                   {interview.jobId?.title || "Job Position"}
                                 </h3>
                               </div>
                               
                               <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                                 <Briefcase size={16} className="mr-2 flex-shrink-0" />
                                 <span>{interview.jobId?.companyName || "Company"}</span>
                               </div>
                               
                               <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                                 <User size={16} className="mr-2 flex-shrink-0" />
                                 <span>
                                   {interview.recruiterId?.firstName || ""} {interview.recruiterId?.lastName || ""}
                                 </span>
                               </div>
                             </div>
                             
                             <div className="flex flex-col items-start md:items-end">
                               <div className="flex items-center mb-1 text-gray-700 dark:text-gray-300 font-medium">
                                 <Calendar size={16} className="mr-2 flex-shrink-0" />
                                 <span>{formatInterviewDate(interview.scheduledDate)}</span>
                               </div>
                               
                               <div className="flex items-center mb-3 text-gray-700 dark:text-gray-300">
                                 <Clock size={16} className="mr-2 flex-shrink-0" />
                                 <span>{formatInterviewTime(interview.scheduledTime)}</span>
                               </div>
                               
                               {interview.meetLink && (
                                 <a
                                   href={interview.meetLink}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4 md:mb-0"
                                 >
                                   <LinkIcon size={16} className="mr-1 flex-shrink-0" />
                                   <span>Join Meeting</span>
                                   <ExternalLink size={14} className="ml-1 flex-shrink-0" />
                                 </a>
                               )}
                             </div>
                           </div>
                           
                           <div className="mt-4">
                             <button
                               onClick={() => handleViewDetails(interview)}
                               className="w-full md:w-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors flex items-center justify-center"
                             >
                               View Details
                               <ArrowRight size={16} className="ml-2" />
                             </button>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                     <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                       <CalendarRange size={32} className="text-gray-500 dark:text-gray-400" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                       No interviews found
                     </h3>
                     <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                       {searchQuery || filterType !== "all"
                         ? "No interviews match your current filters. Try adjusting your search criteria."
                         : "You don't have any scheduled interviews yet. Apply to jobs to get started!"}
                     </p>
                     <Link
                       to="/Jobs"
                       className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                     >
                       Browse Jobs
                     </Link>
                   </div>
                 )}
           
                 {/* Interview Details Modal */}
                 {selectedInterview && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Interview Details
        </h3>
        <button
          onClick={() => setSelectedInterview(null)}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="p-6">
        {/* Status badge - display at the top for visibility */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${selectedInterview.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              selectedInterview.status === 'Declined' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
            
            {selectedInterview.status === 'Confirmed' ? <CheckCircle2 size={14} className="mr-1" /> :
             selectedInterview.status === 'Declined' ? <XCircle size={14} className="mr-1" /> :
             <Clock size={14} className="mr-1" />}
            
            {selectedInterview.status || 'Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Your existing interview information section */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Interview Information
            </h4>
                             <div className="space-y-4">
                               <div className="flex">
                                 <div className="w-10 h-10 flex-shrink-0 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg flex items-center justify-center mr-3">
                                   <Calendar size={20} />
                                 </div>
                                 <div>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                   <p className="text-base font-medium text-gray-900 dark:text-white">
                                     {formatInterviewDate(selectedInterview.scheduledDate)}
                                   </p>
                                 </div>
                               </div>
                               
                               <div className="flex">
                                 <div className="w-10 h-10 flex-shrink-0 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg flex items-center justify-center mr-3">
                                   <Clock size={20} />
                                 </div>
                                 <div>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                   <p className="text-base font-medium text-gray-900 dark:text-white">
                                     {formatInterviewTime(selectedInterview.scheduledTime)}
                                   </p>
                                 </div>
                               </div>
                               
                               {selectedInterview.meetLink && (
                                 <div className="flex">
                                   <div className="w-10 h-10 flex-shrink-0 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg flex items-center justify-center mr-3">
                                     <LinkIcon size={20} />
                                   </div>
                                   <div>
                                     <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Link</p>
                                     <a
                                       href={selectedInterview.meetLink}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                     >
                                       Join Google Meet
                                       <ExternalLink size={14} className="ml-1" />
                                     </a>
                                   </div>
                                 </div>
                               )}
                               
                               <div className="flex">
                                 <div className="w-10 h-10 flex-shrink-0 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg flex items-center justify-center mr-3">
                                   <User size={20} />
                                 </div>
                                 <div>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Recruiter</p>
                                   <p className="text-base font-medium text-gray-900 dark:text-white">
                                     {selectedInterview.recruiterId?.firstName || ""} {selectedInterview.recruiterId?.lastName || ""}
                                   </p>
                                   {selectedInterview.recruiterId?.email && (
                                     <p className="text-sm text-gray-500 dark:text-gray-400">
                                       {selectedInterview.recruiterId.email}
                                     </p>
                                   )}
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           <div>
                             <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                               Job Details
                             </h4>
                             
                             <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                               <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                                 {selectedInterview.jobId?.title || "Job Position"}
                               </h5>
                               
                               <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                                 <Briefcase size={16} className="mr-1.5 flex-shrink-0" />
                                 <span>{selectedInterview.jobId?.companyName || "Company"}</span>
                               </div>
                               
                               {selectedInterview.jobId?.location && (
                                 <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                                   <MapPin size={16} className="mr-1.5 flex-shrink-0" />
                                   <span>{selectedInterview.jobId.location}</span>
                                 </div>
                               )}
                               
                               {selectedInterview.jobId?.description && (
                                 <div className="mt-3">
                                   <p className="text-sm text-gray-700 dark:text-gray-300">
                                     {selectedInterview.jobId.description.length > 200
                                       ? `${selectedInterview.jobId.description.substring(0, 200)}...`
                                       : selectedInterview.jobId.description}
                                   </p>
                                 </div>
                               )}
                             </div>
                             
                             {selectedInterview.reason && (
                               <div>
                                 <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                                   Recruiter's Note
                                 </h5>
                                 <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-600">
                                   <p className="text-gray-700 dark:text-gray-300 italic">
                                     "{selectedInterview.reason}"
                                   </p>
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                         {!selectedInterview.candidateResponse && isUpcoming(selectedInterview.scheduledDate) && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Respond to Interview Invitation
            </h4>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Let the recruiter know if you'll be attending this interview.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Feedback (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="3"
                  value={feedbackText || ''}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share any additional information, questions, or comments about the interview..."
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => respondToInterview(selectedInterview._id, 'yes')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                >
                  <CheckCircle2 size={18} />
                  Accept Interview
                </button>
                
                <button 
                  onClick={() => respondToInterview(selectedInterview._id, 'no')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                >
                  <XCircle size={18} />
                  Decline Interview
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedInterview.candidateResponse && selectedInterview.reason && (
  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
      <Mail className="w-5 h-5 mr-2 text-blue-500" />
      Recruiter's Response
    </h4>
    
    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-600">
      <div className="flex items-start">
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            {selectedInterview.recruiterId?.firstName || ""} {selectedInterview.recruiterId?.lastName || ""} left a note:
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {selectedInterview.reason}
          </p>
        </div>
      </div>
    </div>
  </div>
)}

{/* Show placeholder for recruiter notes when candidate has responded but no notes yet */}
{selectedInterview.candidateResponse && !selectedInterview.reason && (
  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
    <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg text-center">
      <p className="text-gray-500 dark:text-gray-400">
        The recruiter hasn't added any notes yet. Check back later.
      </p>
    </div>
  </div>
)}
        {/* Show candidate response if they have already responded */}
        {selectedInterview.candidateResponse && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Your Response
            </h4>
            
            <div className={`p-4 rounded-lg ${
              selectedInterview.candidateResponse === 'yes' 
                ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30' 
                : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30'
            }`}>
              <div className="flex items-start">
                {selectedInterview.candidateResponse === 'yes' ? (
                  <CheckCircle2 size={20} className="text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${
                    selectedInterview.candidateResponse === 'yes' 
                      ? 'text-green-800 dark:text-green-300' 
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    You have {selectedInterview.candidateResponse === 'yes' ? 'accepted' : 'declined'} this interview
                  </p>
                  
                  {selectedInterview.candidateFeedback && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <p className="font-medium mb-1">Your feedback:</p>
                      <p className="italic">{selectedInterview.candidateFeedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
                         <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                           <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                             Preparation Tips
                           </h4>
                           
                           <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                             <ul className="space-y-3">
                               <li className="flex items-start">
                                 <CheckCircle size={18} className="text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                 <span className="text-gray-700 dark:text-gray-300">
                                   Research the company and position thoroughly
                                 </span>
                               </li>
                               <li className="flex items-start">
                                 <CheckCircle size={18} className="text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                 <span className="text-gray-700 dark:text-gray-300">
                                   Prepare answers for common interview questions
                                 </span>
                               </li>
                               <li className="flex items-start">
                                 <CheckCircle size={18} className="text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                 <span className="text-gray-700 dark:text-gray-300">
                                   Test your equipment before the interview if it's virtual
                                 </span>
                               </li>
                               <li className="flex items-start">
                                 <CheckCircle size={18} className="text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                 <span className="text-gray-700 dark:text-gray-300">
                                   Prepare questions to ask the interviewer
                                 </span>
                               </li>
                               <li className="flex items-start">
                                 <CheckCircle size={18} className="text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                 <span className="text-gray-700 dark:text-gray-300">
                                   Join the meeting 5-10 minutes early
                                 </span>
                               </li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                       {selectedInterview.meetLink && isUpcoming(selectedInterview.scheduledDate) && selectedInterview.candidateResponse !== 'no' && (
          <a
            href={selectedInterview.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
          >
            <LinkIcon size={18} className="mr-2" />
            Join Interview
          </a>
        )}
        <button
          onClick={() => setSelectedInterview(null)}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
               </div>
        
        </main>
      </div>
    </div>
  );
};

export default Interviews ;
