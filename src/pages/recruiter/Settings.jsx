import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Search,
  Upload,
  AlertTriangle,
  X,
  Users,
  Briefcase,
  Wrench,
  FlaskConical,
  LogOut,
  CalendarClock,
  Calendar,
  XCircle,
  CheckCircle
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Card from "./Desactivate";
import styled from "styled-components";
import { useDarkMode } from "../../components/DarkModeProvider";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import axios for API calls
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
      setActiveIndex((prev) =>
        prev < allFilteredItems.length - 1 ? prev + 1 : prev
      );
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
      if (isModalOpen && event.target.classList.contains("modal-backdrop")) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Search...
          </span>
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
            if (e.target.classList.contains("modal-backdrop")) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden animate-fadeIn">
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
              {filteredMenu.length === 0 &&
                filteredOption.length === 0 &&
                searchQuery && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-full mb-3">
                      <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No results found
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Try different keywords
                    </p>
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
                            ? "bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                            ? "bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        } transition-colors duration-75`}
                        onMouseEnter={() =>
                          setActiveIndex(index + filteredMenu.length)
                        }
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
const UserMenu = () => {
  const {
    profilePic,
    firstName,
    lastName,
    email,
  } = useContext(UserContext); // Consume UserContext
  const { isDarkMode, toggleTheme } = useDarkMode();

  const handleSignout = () => {
    localStorage.clear();
    sessionStorage.clear();
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
      label: "Applied Candidates",
      href: "/dashboard/recuiter/AppliedCandidates",
      icon: Users,
      description: "View your applied candidates",
    },
    {
      label: "Settings",
      href: "/dashboard/recuiter/settings",
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
                src={profilePic || (import.meta.env.BASE_URL + "img/team/01.jpg")} // Fallback to default avatar
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
                    src={profilePic || (import.meta.env.BASE_URL + "img/team/01.jpg")} // Fallback to default avatar
                    alt="User avatar"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {`${firstName} ${lastName}`} {/* Display user name */}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {email} {/* Display user email */}
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
    const fetchInterviewResponses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await axios.get(API_URL + '/api/recruiters/interviews', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Transform interviews into notification format
        const interviewNotifications = response.data.interviews
          .filter(interview => interview.responseStatus) // Only get interviews with responses
          .slice(0, 5) // Limit to 5 most recent notifications
          .map(interview => {
            const isAccepted = interview.responseStatus === 'yes';
            
            // Calculate time difference
            const responseDate = new Date(interview.createdAt);
            const now = new Date();
            const diffMs = now - responseDate;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            
            let timeMessage;
            if (diffHours < 1) {
              timeMessage = 'Just now';
            } else if (diffHours < 24) {
              timeMessage = `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
            } else {
              const diffDays = Math.floor(diffHours / 24);
              timeMessage = `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
            }
            
            // Create notification object
            return {
              id: interview.id,
              message: `${interview.candidateName} ${isAccepted ? 'accepted' : 'declined'} interview`,
              details: `For ${interview.job.title} position${interview.candidateFeedback ? ' with feedback' : ''}`,
              time: timeMessage,
              icon: isAccepted ? CheckCircle : XCircle,
              type: isAccepted ? 'accepted' : 'declined',
              candidateId: interview.candidateId
            };
          });
        
        setNotifications(interviewNotifications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching interview responses:', err);
        setError('Failed to load notifications');
        setLoading(false);
      }
    };
    
    fetchInterviewResponses();
  }, []);
  
  // If there are no responses, show default message
  const displayNotifications = notifications.length > 0 
    ? notifications 
    : [
        {
          message: "No interview responses",
          details: "Candidates haven't responded to any interviews yet",
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
                  Interview Responses
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
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading responses...</p>
                </div>
              ) : error ? (
                <div className="px-4 py-4 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : (
                displayNotifications.map((notification, index) => (
                  <a
                    key={notification.id || index}
                    href={notification.candidateId ? `/dashboard/recuiter/interviews/${notification.id}` : '#'}
                    className={`group flex items-center px-4 py-3 text-sm border-b border-gray-100 dark:border-zinc-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start w-full">
                      <div className={`mr-3 p-2 rounded-md ${
                        notification.type === 'accepted' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : notification.type === 'declined'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        <notification.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{notification.message}</p>
                        {notification.details && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{notification.details}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-700 text-center">
              <a href={import.meta.env.BASE_URL + "dashboard/recuiter/interviews"} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View all interviews
              </a>
            </div>
          </MenuItems>
        </>
      )}
    </HeadlessMenu>
  );
};
const SettingsComp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useDarkMode();
   

  useEffect(() => {
    // Ensure the dark class is applied globally
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const navigation_menu = [
      {
        name: "Dashboard",
        href: "/dashboard/recuiter",
        icon: Menu,
        current: false,
      },
      {
        name: "Applied Candidates",
        href: "/dashboard/recuiter/AppliedCandidates",
        icon: Users,
        current: false,
      },
      {
        name: "Interviews",
        href: "/dashboard/recuiter/interviews",
        icon: CalendarClock,
        current: false,
      },
      {
        name: "Jobs",
        href: "/dashboard/recuiter/joblist",
        icon: Briefcase,
        current: false,
      },
      { name: "Billing", href: "/Pricing", icon: CreditCard, current: false },
    ];
  const navigation_option = [
    {
      name: "Settings",
      href: "/dashboard/recuiter/settings",
      icon: Settings,
      current: true,
    },
    {
      name: "Support",
      href: "/dashboard/recuiter/jobbuilder",
      icon: Wrench,
      current: false,
      disabled: true,
    },
  ];

  const [showDesactivate, setShowDesactivate] = useState(false);
  const handleDesactivate = () => {
    setShowDesactivate(true);
    setTimeout(() => {
      setShowDesactivate(false);
    }, 10000);
  };
  const handleCancel = () => {
    setShowDesactivate(false);
  };

  const handleSupp = () => {
    setTimeout(() => {
      setShowDesactivate(false);
    }, 100);
    alert("Account deleted");
  };
const [loading, setLoading] = useState(false); // Add loading state
const { 
  profilePic, firstName, lastName, email, companyName, // Added companyName here
  updateUserProfile, refreshUserData 
} = useContext(UserContext);

// Local state for form values
const [localFirstName, setLocalFirstName] = useState("");
const [localLastName, setLocalLastName] = useState("");
const [localEmail, setLocalEmail] = useState("");
const [profilePicFile, setProfilePicFile] = useState(null);
const [localCompanyName, setLocalCompanyName] = useState("");

const handleSaveChanges = async () => {
  setLoading(true);

  try {
    console.log("Updating profile with values:", {
      firstName: localFirstName,
      lastName: localLastName,
      email: localEmail,
      companyName: localCompanyName,
      profilePic: profilePicFile ? "File selected" : "No file selected",
    });

    // Create form data
    const formData = new FormData();
    formData.append("firstName", localFirstName);
    formData.append("lastName", localLastName);
    formData.append("email", localEmail);
    formData.append("companyName", localCompanyName);

    if (profilePicFile) {
      formData.append("profilePic", profilePicFile);
    }

    // Use context function to update profile
    const success = await updateUserProfile(formData);

    if (success) {
      toast.success("Profile updated successfully!");
      await refreshUserData(true); // Force reload from server
    } else {
      toast.error("Failed to update profile");
    }
  } catch (error) {
    console.error("Error saving changes:", error);
    toast.error(
      error.response?.data?.message || "An error occurred while saving changes"
    );
  } finally {
    setLoading(false);
  }
};

// Initialize local state with context values when they change
useEffect(() => {
  setLocalFirstName(firstName || "");
  setLocalLastName(lastName || "");
  setLocalEmail(email || "");
  setLocalCompanyName(companyName || "");
}, [firstName, lastName, email, companyName]);
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex h-screen bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
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
                />{" "}
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">
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

          {/* Navigation - update classes for dark mode */}

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
          {/* Header */}
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar
                navigationMenu={[
                  {
                    name: "Dashboard",
                    href: "/dashboard/recuiter",
                    icon: Menu,
                  },
                  {
                    name: "Applied Candidates",
        href: "/dashboard/recuiter/AppliedCandidates",
        icon: Users,
                   
                  },{ name: "Interviews",
                    href: "/dashboard/recuiter/interviews",
                    icon: CalendarClock,},
                 
                  {
                    name: "Jobs",
                    href: "/dashboard/recuiter/joblist",
                    icon: Briefcase,
                  },
                  { name: "Billing", href: "/Pricing", icon: CreditCard, },
                ]}
                navigationOption={[
                  {
                    name: "Settings",
                    href: "/dashboard/recuiter/settings",
                    icon: Settings,
                  },
                  {
                    name: "Support",
                    href: "/dashboard/recuiter/jobbuilder",
                    icon: Wrench,
                    disabled: true,
                  }
                ]}
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

          {/* Main Content Area */}
          <div className="container mx-auto p-4 ">
            <div className=" rounded-lg shadow-sm ">
              {/* Header */}
              <div className="border-b border-zinc-300 dark:border-zinc-700">
                {" "}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-semibold dark:text-gray-200 text-gray-700 transition-all duration-300 ease-in-out z-30">
                        Settings
                      </h1>
                      <p className="text-sm text-gray-500 transition-all duration-300 ease-in-out z-30">
                        Manage account and website settings
                      </p>
                    </div>
                    <div className="hidden sm:flex gap-3">
                      <button className="px-4 py-2 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">
                        Cancel
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                          loading
                            ? "bg-zinc-400 text-white cursor-not-allowed dark:bg-zinc-500 focus:ring-blue-300"
                            : "bg-zinc-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-zinc-600 dark:hover:bg-blue-700 dark:active:bg-blue-800 focus:ring-blue-500"
                        }`}
                        onClick={handleSaveChanges}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 text-white mr-2"
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
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 p-6">
                {/* Personal Information Section */}
                <section className=" rounded-lg p-6 shadow-sm mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Personal Information
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={localFirstName}
  onChange={(e) => setLocalFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                        aria-required="true"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Last Name
                      </label>
                      <input
      id="lastName"
      type="text"
      value={localLastName}
      onChange={(e) => setLocalLastName(e.target.value)}
      placeholder="Enter your last name"
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
      aria-required="true"
    />
                    </div>
                  </div>
                </section>
                <section className="rounded-lg p-6 shadow-sm mt-6">
  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
    Company Information
  </h2>
  <div className="space-y-2">
    <label
      htmlFor="companyName"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Company Name
    </label>
    <div className="relative">
      <input
        id="companyName"
        type="text"
        value={localCompanyName}
        onChange={(e) => setLocalCompanyName(e.target.value)}
        placeholder="Enter your company name"
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-colors"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      This will be displayed on job postings and your public profile.
    </p>
  </div>
</section>
                <section className=" rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Contact Information
                  </h2>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                     <input
  id="email"
  type="email"
  value={localEmail}  // Changed from email to localEmail
  onChange={(e) => setLocalEmail(e.target.value)}
  placeholder="your.email@domain.com"
  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-colors"
  aria-required="true"
/>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      We'll never share your email with anyone else.
                    </p>
                  </div>
                </section>
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme={isDarkMode ? "dark" : "light"}
                />{" "}
                {/* Profile Picture Section */}
                <section className=" rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Profile Picture
                  </h2>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center border-gray-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                    <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4 shadow-md group">
                      {profilePic ? (
                        <img
                          src={
                            profilePic && profilePic.startsWith("/")
                              ? `${API_URL}${profilePic}`
                              : profilePic || "./assets/images/avatar.jpg"
                          }
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <Upload className="h-10 w-10 text-gray-400 dark:text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="text-white text-xs font-medium">
                          Change photo
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Drop an image here or click to browse
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG files up to 10MB
                      </p>
                    </div>

                    <label className="inline-flex items-center justify-center px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePicFile(e.target.files[0])}
                        className="hidden"
                        aria-label="Upload profile picture"
                      />
                    </label>
                  </div>
                </section>
                {/* Danger Zone Section */}
                <section className="border-t border-zinc-300 dark:border-zinc-700 pt-8 mt-8">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h2 className="text-lg font-semibold text-red-600">
                        Delete Account
                      </h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      This is a danger zone - please proceed with caution
                    </p>

                    <div className="border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg p-6 transition-colors">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Permanently delete your TalentSync account
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            This action cannot be undone. All of your data will
                            be permanently removed from our servers and cannot
                            be recovered.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 border border-red-100 dark:border-red-900/20 rounded-lg p-4 transition-colors">
                          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>
                                Your profile and all personal information will
                                be deleted
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>
                                You will lose access to all your applications
                                and content
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>
                                Your username will be available for others to
                                use
                              </span>
                            </li>
                          </ul>
                        </div>

                        <button
                          className="px-4 py-2 bg-white dark:bg-transparent text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          onClick={handleDesactivate}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>

                  {showDesactivate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 mx-4"
                        role="dialog"
                        aria-modal="true"
                      >
                        <div className="text-center">
                          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                            <svg
                              className="h-10 w-10 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Delete your account?
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Are you absolutely sure you want to delete your
                            account? This action cannot be undone and all your
                            data will be permanently lost.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row-reverse gap-3 mt-2">
                          <button
                            type="button"
                            onClick={handleSupp}
                            className="w-full sm:w-auto px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                          >
                            Delete permanently
                          </button>

                          <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full sm:w-auto px-5 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Mobile Actions */}
              <div className="p-6 border-t sm:hidden">
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={handleSaveChanges}
                    disabled={loading} // Disable the button while loading
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white mr-2"
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
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .card {
    overflow: hidden;
    position: relative;

    text-align: left;
    border-radius: 0.5rem;
    max-width: 290px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header {
    padding: 1.25rem 1rem 1rem 1rem;
    background-color: #ffffff;
  }

  .image {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #fee2e2;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
  }

  .image svg {
    color: #dc2626;
    width: 1.5rem;
    height: 1.5rem;
  }

  .content {
    margin-top: 0.75rem;
    text-align: center;
  }

  .title {
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  .message {
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .actions {
    margin: 0.75rem 1rem;
    background-color: #f9fafb;
  }

  .desactivate {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #dc2626;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border-width: 1px;
    border-color: transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .cancel {
    display: inline-flex;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    color: #374151;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  button {
    cursor: pointer;
  }
`;
export default SettingsComp;

