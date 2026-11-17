import React, { useState, useEffect, useRef } from "react";
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
  FileText,
  Wrench,
  Info,
  Loader,
  AlertCircle,
  Briefcase,
  FileClock,
  LogOut,
  Calendar,
  CalendarClock,
  CheckCircle,
  Zap,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CV from "./CV/CvCreation";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import LoadingAnimation from "./LoginAnimation"; // Adjust the path if needed
import { useDarkMode } from "../../components/DarkModeProvider";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PDFViewer from "./PDF"; // Import the PDF viewer component
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
                    src={profilePic} // Use the profilePic prop
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
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          API_URL + "/api/candidates/interviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Transform interviews into notification format
        const interviewNotifications = response.data.interviews.map(
          (interview) => {
            // Calculate time difference
            const interviewDate = new Date(interview.scheduledDate);
            const now = new Date();
            const diffDays = Math.floor(
              (interviewDate - now) / (1000 * 60 * 60 * 24)
            );

            let timeMessage;
            if (diffDays === 0) {
              timeMessage = "Today";
            } else if (diffDays === 1) {
              timeMessage = "Tomorrow";
            } else if (diffDays > 1) {
              timeMessage = `In ${diffDays} days`;
            } else {
              timeMessage = `${Math.abs(diffDays)} days ago`;
            }

            // Format interview time
            const time = new Date(interview.scheduledTime).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            // Create notification object
            return {
              id: interview._id,
              message: `Interview for ${
                interview.jobId?.title || "Job Position"
              }`,
              details: `With ${interview.recruiterId?.firstName || ""} ${
                interview.recruiterId?.lastName || ""
              } at ${time}`,
              time: timeMessage,
              icon: Calendar,
              type: "interview",
            };
          }
        );

        setNotifications(interviewNotifications);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load notifications");
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // If there are no interviews, include some default notifications
  const displayNotifications =
    notifications.length > 0
      ? notifications
      : [
          {
            message: "No upcoming interviews",
            details: "Check again later for updates",
            time: "Now",
            icon: Calendar,
            type: "info",
          },
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
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
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
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading notifications...
                  </p>
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
                      notification.type === "interview" ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`mr-3 p-2 rounded-md ${
                          notification.type === "interview"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                      >
                        <notification.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notification.message}
                        </p>
                        {notification.details && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                            {notification.details}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-700 text-center">
              <a
                href={import.meta.env.BASE_URL + "dashboard/interviews"}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all notifications
              </a>
            </div>
          </MenuItems>
        </>
      )}
    </HeadlessMenu>
  );
};
const Application = () => {
  const location = useLocation(); // Get location object
  const selectedJob = location.state?.job; // Extract job data from state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [useSavedData, setUseSavedData] = useState(false);
  const [cvData, setCvData] = useState(null); // Data extracted from CV
  const [recommendations, setRecommendations] = useState([]);
  const [useExistingData, setUseExistingData] = useState(null);
  const [isAddCvModalOpen, setIsAddCvModalOpen] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [viewMode, setViewMode] = useState("text"); // 'text' or 'pdf'
  const navigate = useNavigate(); 

  const [profilePic, setProfilePic] = useState(""); // Default to an empty string
  const [firstName, setFirstName] = useState(""); // Default to an empty string
  const [lastName, setLastName] = useState(""); // Default to an empty string
  const [email, setEmail] = useState("");
  // State for Add CV Modal
  const [backendData, setBackendData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
  });
  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const handleAddCvModalOpen = () => setIsAddCvModalOpen(true);
  const handleAddCvModalClose = () => setIsAddCvModalOpen(false);
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const navigation_menu = [
    { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
    { name: "Jobs", href: "/Jobs", icon: Briefcase, current: false },
    {
      name: "Interviews",
      href: "/dashboard/interviews",
      icon: CalendarClock,
      current: false,
    },
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
    {
      name: "Support",
      href: "/cv",
      icon: Wrench,
      current: false,
      disabled: true,
    },
  ];

  const { isDarkMode } = useDarkMode();
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          API_URL + "/api/candidates/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { candidate } = response.data;

        setProfilePic(candidate.profilePic || "../../assets/images/avatar.jpg");
        setFirstName(candidate.name?.split(" ")[0] || "");
        setLastName(candidate.name?.split(" ").slice(1).join(" ") || "");
        setEmail(candidate.email || "");
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        alert("Failed to fetch user data. Please try again later.");
      }
    };

    fetchUserData();
  }, [isDarkMode]);

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    additional: "",
    languages: "",
    linkedIn: "",
    github: "",
    projects: "",
    education: "",
    summary: "",
    currentPosition: "",
    about: "",

    activities: "",
    certification: "",
    location: "",
    feedback: {
      strengths: [],
      areasForImprovement: [],
      linkedinSuggestions: [],
    },
  });
  useEffect(() => {
    if (backendData?.result) {
      const links = parseLinksSection(backendData.result.raw_analysis);
      const feedback = parseFeedbackSection(backendData.result.raw_analysis);

      setFormData({
        name: backendData.result.contacts?.name?.replace(/^\\*\s/, "") || "",
        email: backendData.result.contacts?.email?.replace(/^\\*\s/, "") || "",
        phone: backendData.result.contacts?.phone?.replace(/^\\*\s/, "") || "",
        experience:
          parseExperienceSection(backendData.result.raw_analysis, true) || "",
        skills: parseSkillsSection(backendData.result.raw_analysis, true) || "",

        languages:
          parseLanguagesSection(backendData.result.raw_analysis, true) || "",
        linkedIn: links.linkedIn,
        github: links.github,
        projects:
          parseProjectsSection(backendData.result.raw_analysis, true) || "",
        feedback,
        education: backendData.result.contacts?.education || "",
        activities: backendData.result.contacts?.activities || "",
        certification: backendData.result.contacts?.certification || "",
        location: cleanLocationField(
          backendData.result.contacts?.location || ""
        ),
        currentPosition:
          backendData.result.contacts?.currentPosition ||
          backendData.result.contacts?.current_most_recent_position ||
          "",
        about: parseSummarySection(backendData.result.raw_analysis, true) || "",
      });
    }
  }, [backendData]);

  const renderEditableField = (label, field, value, isTextarea = false) => {
    // Clean the value by removing ** characters
    let cleanValue = value;
    if (field === "name" || field === "email" || field === "phone") {
      cleanValue =
        typeof value === "string" ? value.replace(/\*\*/g, "") : value;
    }

    return (
      <div className="mb-4">
        <label
          htmlFor={field}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
        {isTextarea ? (
          <textarea
            id={field}
            name={field}
            value={cleanValue}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        ) : (
          <input
            type="text"
            id={field}
            name={field}
            value={cleanValue}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        )}
      </div>
    );
  };
  const handleInputChange = (field, value) => {
    if (field === "projects") {
      const arr = value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setFormData({
        ...formData,
        [field]: arr,
      });
    } else if (field === "location") {
      let cleaned = cleanLocationField(value);
      if (!cleaned || cleaned.toLowerCase() === "n/a") cleaned = "";
      setFormData({
        ...formData,
        location: cleaned,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };
  const [analysisResults, setAnalysisResults] = useState(null);
  // Add this state to store analysis results
  const [showAnalysis, setShowAnalysis] = useState(false); // Add this state to control analysis visibility
  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      const jobDescription = selectedJob?.description || "";

      const formattedFormData = {
        personalInfo: {
          name: formData.name || "",
          email: formData.email || "",
          phone: formData.phone || "",
          linkedIn: formData.linkedIn || "",
          github: formData.github || "",
          currentPosition: formData.position || "",
          about: formData.about || "",
        },
        summary: formData.summary || formData.about,
        experience: formData.experience || "",
        skills: formData.skills || "",
        languages: formData.languages || "",
        education: formData.education || "",
        certification: formData.certification || "",
        activities: formData.activities || "",
        projects: formData.projects || {},
      };

      const requestData = { formData: formattedFormData };
      if (jobDescription) {
        requestData.jobDescription = jobDescription;
      }

      const response = await axios.post(
        API_URL + "/api/candidates/update/analyse",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.analysis) {
        setAnalysisResults(response.data.analysis); // Update the analysis results state
        setShowAnalysis(true); // Show the analysis results
      }

      setMessage("Data saved and analyzed successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while saving data."
      );
    } finally {
      setIsLoading(false);
      setEditMode(false);
    }
  };
  const getLatestRawAnalysis = () => {
    if (analysisResults?.raw_analysis) return analysisResults.raw_analysis;
    if (backendData?.result?.raw_analysis)
      return backendData.result.raw_analysis;
    return "";
  };
  const parseExperienceSection = (rawAnalysis, asPlainText = false) => {
    try {
      const experienceMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*Work Experience Summary:\*\*([\s\S]*?)(?=\*\*4\.)/
      );

      if (experienceMatch && experienceMatch[1]) {
        const experienceText = experienceMatch[1].trim();

        if (asPlainText) {
          // Return plain text for form inputs
          return experienceText
            .replace(/\*\*/g, "")
            .replace(/\n\n/g, "\n")
            .replace(/\* /g, "- ");
        }

        // Return HTML for display
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: experienceText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      return asPlainText ? (
        ""
      ) : (
        <p>No detailed experience information available.</p>
      );
    } catch (error) {
      console.error("Error parsing experience section:", error);
      return asPlainText ? "" : <p>Error displaying experience information.</p>;
    }
  };

  // Updated parseSkillsSection to ensure only skills are displayed
  const parseSkillsSection = (rawAnalysis, asPlainText = false) => {
    try {
      const skillsMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*Technical Skills:\*\*([\s\S]*?)(?=\*\*\d+\.\s|$)/ // Match only the Technical Skills section
      );

      if (skillsMatch && skillsMatch[1]) {
        const skillsText = skillsMatch[1].trim();

        if (asPlainText) {
          return skillsText
            .replace(/\*\*/g, "")
            .replace(/\n\n/g, "\n")
            .replace(/\* /g, "- ");
        }

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: skillsText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      return asPlainText ? "" : <p>No skills data available.</p>;
    } catch (error) {
      console.error("Error parsing skills section:", error);
      return asPlainText ? "" : <p>Error displaying skills information.</p>;
    }
  };
  function cleanLocationField(locationRaw) {
    if (!locationRaw) return "";
    // Remove everything after "* **LinkedIn:**" (including that line)
    const linkedInIndex = locationRaw.indexOf("* **LinkedIn:**");
    let cleaned =
      linkedInIndex !== -1
        ? locationRaw.substring(0, linkedInIndex)
        : locationRaw;

    // Clean up formatting
    cleaned = cleaned
      .replace(/:\*\*/g, "") // Remove ":**"
      .replace(/\*\*/g, "") // Remove "**"
      .replace(/^\*\s*/gm, "") // Remove leading "*"
      .replace(/^\s*-\s*/gm, "") // Remove leading dashes
      .replace(/^\s*;\s*/gm, "") // Remove leading semicolons
      .replace(/^\s*:\s*/gm, "") // Remove leading colons
      .trim();

    return cleaned;
  }
  function parseSummarySection(rawAnalysis, asPlainText = false) {
    if (!rawAnalysis)
      return asPlainText ? (
        ""
      ) : (
        <span className="text-gray-500 dark:text-gray-400">
          No professional summary available
        </span>
      );
    try {
      // Match "**2. Professional Summary:**" up to the next "**3." or end of string
      const match = rawAnalysis.match(
        /\*\*2\.\s*Professional Summary:\*\*([\s\S]*?)(?=\*\*3\.|\*\*\d+\.\s|$)/
      );
      if (match && match[1]) {
        const summary = match[1].trim();
        if (asPlainText) {
          return summary.replace(/\*\*/g, "");
        }
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: summary
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      return asPlainText ? (
        ""
      ) : (
        <p>No detailed summary information available.</p>
      );
    } catch (error) {
      console.error("Error parsing summary section:", error);
      return asPlainText ? "" : <p>Error displaying summary information.</p>;
    }
  }

  // Helper function to parse and display languages
  const parseLanguagesSection = (rawAnalysis, asPlainText = false) => {
    try {
      // More flexible regex pattern to match Languages section regardless of numbering
      const languagesMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*Languages:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/
      );

      // Alternative pattern to try if the first one fails
      const alternateMatch =
        !languagesMatch &&
        rawAnalysis.match(/\*\*Languages:\*\*([\s\S]*?)(?=\*\*|$)/);

      const matchResult = languagesMatch || alternateMatch;

      if (matchResult && matchResult[1]) {
        const languagesText = matchResult[1].trim();

        if (asPlainText) {
          // Return plain text for form inputs
          return languagesText
            .replace(/\*\*/g, "")
            .replace(/\n\n/g, "\n")
            .replace(/\* /g, "- ");
        }

        // Return HTML for display
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: languagesText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      // Check if languages might be in technical skills section
      const skillsMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*Technical Skills:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/
      );

      if (
        skillsMatch &&
        skillsMatch[1] &&
        skillsMatch[1].toLowerCase().includes("language")
      ) {
        // If we find languages mentioned in skills section, try to extract them
        const skillsText = skillsMatch[1].trim();
        const languagePortion = skillsText
          .split(/\n\n/)
          .find((section) => section.toLowerCase().includes("language"));

        if (languagePortion) {
          if (asPlainText) {
            return languagePortion
              .replace(/\*\*/g, "")
              .replace(/\n\n/g, "\n")
              .replace(/\* /g, "- ");
          }

          return (
            <div
              dangerouslySetInnerHTML={{
                __html: languagePortion
                  .replace(/\*\*/g, "<strong>")
                  .replace(/\*\*/g, "</strong>")
                  .replace(/\n\n/g, "<br/><br/>")
                  .replace(/\* /g, "• "),
              }}
            />
          );
        }
      }

      return asPlainText ? "" : <p>No language information available.</p>;
    } catch (error) {
      console.error("Error parsing languages section:", error);
      return asPlainText ? "" : <p>Error displaying language information.</p>;
    }
  };
  // Helper function to parse LinkedIn and GitHub links
  const parseLinksSection = (rawAnalysis) => {
    try {
      const linkedInMatch = rawAnalysis.match(
        /\*\*LinkedIn:\*\*\s*(https?:\/\/[^\s]+|www\.[^\s]+)/i
      );
      const githubMatch = rawAnalysis.match(
        /\*\*GitHub:\*\*\s*(https?:\/\/[^\s]+)/i
      );

      return {
        linkedIn: linkedInMatch ? linkedInMatch[1] : "Not available",
        github: githubMatch ? githubMatch[1] : "Not available",
      };
    } catch (error) {
      console.error("Error parsing links section:", error);
      return {
        linkedIn: "Error extracting LinkedIn link.",
        github: "Error extracting GitHub link.",
      };
    }
  };

  // Updated parseProjectsSection to fix Key Projects parsing
  const parseProjectsSection = (rawAnalysis) => {
    try {
      const projectsMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s* Key Projects:\*\*([\s\S]*?)(?=\*\*\d+\.\s|$)/ // Match only the Key Projects section
      );

      if (projectsMatch && projectsMatch[1]) {
        const projectsText = projectsMatch[1].trim();

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: projectsText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      return <p>No key projects information available.</p>;
    } catch (error) {
      console.error("Error parsing key projects section:", error);
      return <p>Error displaying key projects information.</p>;
    }
  };

  /**
   * Extracts LinkedIn profile suggestions/improvements from raw analysis text
   * @param {string} rawAnalysis - Raw analysis text from backend
   * @returns {Array<string>} - Array of LinkedIn suggestions
   */
  const extractLinkedInSuggestions = (rawAnalysis) => {
    try {
      if (!rawAnalysis) return [];

      // Try to extract the LinkedIn Feedback section
      const sectionMatch = rawAnalysis.match(
        /#\s*LINKEDIN FEEDBACK([\s\S]*?)(?=\n#|$)/i
      );
      let content = sectionMatch ? sectionMatch[1].trim() : "";

      // If not found, fallback to old patterns
      if (!content) {
        const patterns = [
          /\*\*(?:\d+\.)?\s*LinkedIn Profile Improvements:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/i,
          /\*\*(?:\d+\.)?\s*LinkedIn Profile Suggestions:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/i,
          /\*\*LinkedIn Profile Improvements:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/i,
          /\*\*LinkedIn Profile Suggestions:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/i,
          /6\.\s*Suggested LinkedIn Profile Improvements:\s*([\s\S]*?)(?=\*\*\d+\.|$)/i, // Added this pattern
        ];
        for (const pattern of patterns) {
          const match = rawAnalysis.match(pattern);
          if (match && match[1]) {
            content = match[1].trim();
            break;
          }
        }
      }

      if (!content) return [];

      // Split by numbered points (e.g., "1. ...", "2. ...")
      let suggestions = content
        .split(/\n?\d+\.\s/)
        .map((s) => s.trim())
        .filter(Boolean);

      // If splitting by numbers didn't work, try splitting by "*"
      if (suggestions.length <= 1) {
        suggestions = content
          .split(/\n?\*\s/)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Clean up suggestions (remove extra newlines, etc.)
      return suggestions
        .map((s) => s.replace(/\n+/g, " ").replace(/\*\*/g, "").trim())
        .filter(Boolean);
    } catch (error) {
      console.error("Error extracting LinkedIn suggestions:", error);
      return [];
    }
  };

  // Function to extract resume strengths
  const extractResumeStrengths = (rawAnalysis) => {
    if (!rawAnalysis) return [];

    const strengthsSection = rawAnalysis.split("**Strengths:**")[1];
    if (!strengthsSection) return [];

    const endIndex = strengthsSection.indexOf("**Areas for Improvement:**");
    const relevantSection =
      endIndex !== -1
        ? strengthsSection.substring(0, endIndex)
        : strengthsSection;

    return relevantSection
      .split("*")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  // Function to extract areas for improvement
  const extractAreasForImprovement = (rawAnalysis) => {
    if (!rawAnalysis) return [];

    const sectionsArray = rawAnalysis.split("**Areas for Improvement:**");
    if (sectionsArray.length < 2) return [];

    let areasSection = sectionsArray[1];

    const linkedinIndex = areasSection.search(
      /(LinkedIn Profile Improvements:|6. Suggested LinkedIn Profile Improvements:)/i
    );
    const keyProjectsIndex = areasSection.search(/Key Projects:/i);

    // Find the earliest section to cut off at
    let endIndex = -1;
    if (linkedinIndex !== -1 && keyProjectsIndex !== -1) {
      endIndex = Math.min(linkedinIndex, keyProjectsIndex);
    } else if (linkedinIndex !== -1) {
      endIndex = linkedinIndex;
    } else if (keyProjectsIndex !== -1) {
      endIndex = keyProjectsIndex;
    }

    if (endIndex !== -1) {
      areasSection = areasSection.substring(0, endIndex);
    }

    return areasSection
      .split("*")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const resumeStrengths = extractResumeStrengths(getLatestRawAnalysis());
  const areasForImprovement = extractAreasForImprovement(
    getLatestRawAnalysis()
  );
  const linkedinSuggestions = extractLinkedInSuggestions(
    getLatestRawAnalysis()
  );
  // Function to parse feedback section
  const parseFeedbackSection = (rawAnalysis) => {
    try {
      const feedbackMatch = rawAnalysis.match(
        /\*\*Feedback:\*\*([\s\S]*?)(?=\*\*\d+\.\s|$)/
      );

      if (feedbackMatch && feedbackMatch[1]) {
        return feedbackMatch[1]
          .split("*")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      return [];
    } catch (error) {
      console.error("Error parsing feedback section:", error);
      return [];
    }
  };
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setIsUploading(false);
        return;
      }

      // Build the data to send
      const formDataToSend = {
        jobId: selectedJob._id,
        level: "JUNIOR",
        coverLetterText: coverLetter,
        scoreData: JSON.stringify(jobScore.scores),
        applicationData: JSON.stringify(formData), 
         summary: formData.about || "",
      };

      const apiFormData = new FormData();
      Object.entries(formDataToSend).forEach(([key, value]) => {
        apiFormData.append(key, value);
      });
      if (uploadedFile) {
        apiFormData.append("coverLetterFile", uploadedFile);
      }

      // Send the request
      const response = await fetch(
        API_URL + "/api/applications/apply-job",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: apiFormData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          setError("You have already applied for this job.");
          toast.error("You have already applied for this job.", {
            position: "bottom-right",
            autoClose: 4000,
          });
          setIsUploading(false);
          return;
        }
        throw new Error(errorData.message || "Failed to submit application");
      }

      if (response.ok) {
      setMessage("Application submitted successfully!");
        toast.success("Application submitted successfully!", {
          position: "bottom-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/dashboard/PastApplications");
        }, 1000); // 1 second delay for user feedback, adjust as needed
        return;
      }

    } catch (err) {
      // ...error handling...
    } finally {
      setIsUploading(false);
    }
  };

  // Updated file upload handler to use the same coverLetter state
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setCoverLetter(null); // Clear any existing text cover letter
      setCoverLetterGenerated(true); // Mark that we have a cover letter
    }
  };

  // Updated cover letter generator to integrate with the submission
  const generateCoverLetter = async () => {
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Ensure job details are provided
      if (selectedJob) {
        const jobDetails = `Job Title: ${selectedJob.title}
      Company: ${selectedJob.companyName}
      Recruiter: ${selectedJob.recruiterName || "Unknown Recruiter"}
      Description: ${selectedJob.description}
      Skills: ${selectedJob.skills?.join(", ") || "Not specified"}
      Requirements: ${selectedJob.requirements || "Not specified"}`;

        formDataToSend.append("jobDetailsText", jobDetails);

        // Add jobId if available
        if (selectedJob._id) {
          formDataToSend.append("jobId", selectedJob._id);
        }
      } else {
        throw new Error("Job details are missing.");
      }

      // Add resume analysis directly as text
      formDataToSend.append("resumeAnalysis", JSON.stringify(formData));

      // Retrieve candidateId from localStorage
      const candidateId = localStorage.getItem("candidateId");
      if (!candidateId) {
        throw new Error("Candidate ID is missing. Please log in again.");
      }
      formDataToSend.append("candidateId", candidateId);

      const response = await axios.post(
        API_URL + "/api/applications/generate-cover-letter",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

      // Handle successful response
      if (response.data && response.data.coverLetter) {
        // Set the cover letter content
        setCoverLetter(response.data.coverLetter);

        // Clear any uploaded file since we're using generated text
        setUploadedFile(null);

        // Generate a temporary client-side ID
        const tempId = `temp-${Date.now()}`;
        console.log("Generated temporary cover letter ID:", tempId);

        // Store the temporary ID
        setCoverLetterId(tempId);

        setCoverLetterGenerated(true);

        // Create text download URL
        const textBlob = new Blob([response.data.coverLetter], {
          type: "text/plain",
        });
        const url = URL.createObjectURL(textBlob);
        setDownloadUrl(url);

        // Show success toast
        toast.success("Cover letter generated successfully!", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Error in cover letter generation process:", err);
      setError(err.message || "Failed to generate cover letter");
      setLoading(false);

      toast.error(
        `Failed to generate cover letter: ${err.message || "Unknown error"}`,
        {
          position: "bottom-right",
          autoClose: 5000,
        }
      );
    }
  };
  // Update this state declaration
  const [coverLetter, setCoverLetter] = useState(null); // Change from "" to null
  const [coverLetterId, setCoverLetterId] = useState(null); // Add this line to store ID separately

  // Cover letter generator state
  const [previewActive, setPreviewActive] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDetailsFile, setJobDetailsFile] = useState(null);
  const [jobDetailsText, setJobDetailsText] = useState("");
  const [useJobFile, setUseJobFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Loading animation component

  // Auto-populate job details from selectedJob when available
  useEffect(() => {
    if (selectedJob) {
      const formattedJobDetails = `Job Title: ${selectedJob.title}\nCompany: ${selectedJob.companyName}\nDescription: ${selectedJob.description}`;
      setJobDetailsText(formattedJobDetails);
    }
  }, [selectedJob]);

  // Handle resume file upload

  // Handle form submission

  // Reset form
  const [coverLetterGenerated, setCoverLetterGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Import hooks at the top of your component
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSaveEdit = async () => {
    if (!editedContent || !editedContent.trim()) {
      setError("Cover letter content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Update the cover letter content
      setCoverLetter(editedContent);

      // Example: (Assuming have editedProfessionalSummary, editedLocation)
      if (typeof editedProfessionalSummary !== "undefined") {
        setFormData((prev) => ({
          ...prev,
          about: editedProfessionalSummary,
        }));
      }
      if (typeof editedLocation !== "undefined") {
        setFormData((prev) => ({
          ...prev,
          location: editedLocation,
        }));
      }
      if (typeof editedActivities !== "undefined") {
        setFormData((prev) => ({
          ...prev,
          activities: editedActivities,
        }));
      }
      if (typeof editedPosition !== "undefined") {
        setFormData((prev) => ({
          ...prev,
          currentPosition: editedPosition,
        }));
      }

      // Generate PDF from the edited content
      const pdfUrl = await generatePDFPreview();

      if (!pdfUrl) {
        throw new Error("Failed to generate PDF");
      }

      setIsEditing(false);

      toast.success("Cover letter and profile updated successfully!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      setError(
        error.message || "An error occurred while updating the cover letter"
      );
      console.error("Error updating cover letter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const generatePDFPreview = async () => {
    try {
      const contentToUse = editedContent || coverLetter || "";
    if (!contentToUse.trim()) throw new Error("No content available to generate PDF preview");

    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.default;
    const doc = new jsPDF();

    // Set minimal margins
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10; // 10 units margin on each side

    // Use almost the full width
    const usableWidth = pageWidth - margin * 2;

    // Format text for PDF
    const textLines = doc.splitTextToSize(contentToUse, usableWidth);

    // Add content to PDF with minimal margins
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Cover Letter", margin, margin + 5); 
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(textLines, margin, margin + 20);

      // Generate PDF blob and create URL
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Set PDF data and download URL
      setPdfData(pdfUrl);
      setDownloadUrl(pdfUrl);
      setViewMode("pdf");

      return pdfUrl;
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      setError(error.message || "Failed to generate PDF preview");
      return null;
    }
  };

  const downloadAsPDF = async () => {
    try {
      console.log("Cover letter ID for PDF:", coverLetterId);

      // Create a PDF blob client-side using jsPDF
      const generateAndDisplayPDF = async (content) => {
        // Import jsPDF library dynamically
        const { default: jsPDF } = await import("jspdf");
        const doc = new jsPDF();

        // Format the content
        const textLines = doc.splitTextToSize(content, 180);

        // Add content to PDF document
        doc.setFont("helvetica");
        doc.setFontSize(12);

        // Add a title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Cover Letter", 15, 15);

        // Add the content
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(textLines, 15, 30);

        // Get PDF as blob
        const pdfBlob = doc.output("blob");

        // Create URL for the blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Set PDF data for viewing
        setPdfData(pdfUrl);
        setViewMode("pdf");

        return pdfBlob;
      };

      // Get content to use (edited or original)
      const contentToUse = editedContent || coverLetter || "";

      if (!contentToUse.trim()) {
        throw new Error("No content available to generate PDF");
      }

      // Generate PDF and display in viewer
      const pdfBlob = await generateAndDisplayPDF(contentToUse);

      // Also create a download link
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `cover_letter_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the download URL after download
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError(error.message || "Failed to generate PDF");
    }
  };
  const [jobScore, setJobScore] = useState({
    jobDescription: "",
    scores: {
      skillsMatch: null,
      experienceMatch: null,
      overallMatch: null,
    },
    suggestions: [],
    loading: false,
    error: null,
    invalidJobDescription: false,
  });
  /**
   * Parses job analysis text into structured data
   * @param {string} rawAnalysis - Raw analysis text from backend
   * @param {Object} jobMatch - Structured job match data from backend
   * @returns {Object} - Structured job score data
   */
  const parseJobScore = (rawAnalysis, jobMatch = null) => {
    // If we have structured job match data, use it directly
    if (jobMatch) {
      const result = {
        jobDescription: "",
        scores: {
          skillsMatch: parsePercentage(jobMatch.skills_match),
          experienceMatch: parsePercentage(jobMatch.experience_match),
          overallMatch: parsePercentage(jobMatch.overall_match),
        },
        suggestions: [],
        invalidJobDescription: false,
      };

      // Extract job description from raw analysis
      const jobDescMatch = rawAnalysis.match(
        /Job Description.*?:\s*(.*?)(?=\n\n|\*\*|$)/is
      );
      if (jobDescMatch) {
        result.jobDescription = jobDescMatch[1].trim();
      }

      // Extract explanations for each score from raw analysis
      const skillsExplanationMatch = rawAnalysis.match(
        /\*\s*\*\*Skills Match:\*\*\s*(\d+)%\s*-\s*(.*?)(?=\n\*|\n\n|$)/is
      );
      const experienceExplanationMatch = rawAnalysis.match(
        /\*\s*\*\*Experience Match:\*\*\s*(\d+)%\s*-\s*(.*?)(?=\n\*|\n\n|$)/is
      );
      const overallExplanationMatch = rawAnalysis.match(
        /\*\s*\*\*Overall Match:\*\*\s*(\d+)%\s*-\s*(.*?)(?=\n\*|\n\n|$)/is
      );

      // Store explanations if found
      result.explanations = {
        skillsExplanation: skillsExplanationMatch
          ? skillsExplanationMatch[2].trim()
          : null,
        experienceExplanation: experienceExplanationMatch
          ? experienceExplanationMatch[2].trim()
          : null,
        overallExplanation: overallExplanationMatch
          ? overallExplanationMatch[2].trim()
          : null,
      };

      // Parse suggestions from improvement_suggestions section in raw analysis
      const suggestionsMatch = rawAnalysis.match(
        /\*\*Suggestions for Improvement:\*\*([\s\S]*?)(?=\n\n\n|By implementing|$)/i
      );
      if (suggestionsMatch) {
        result.suggestions = suggestionsMatch[1]
          .split(/\*\s*\*\*/)
          .filter((item) => item.trim().length > 0)
          .map((item) => {
            // Check if item has a title format like "Add Projects:** Description"
            const titleMatch = item.match(/([^:]+):\*\*\s*(.*?)(?=\n|$)/s);
            if (titleMatch) {
              return {
                title: titleMatch[1].trim(),
                description: titleMatch[2].trim(),
              };
            }
            return item.trim();
          });
      }

      // If improvement_suggestions is empty in jobMatch but we have suggestions from raw analysis
      if (
        (!jobMatch.improvement_suggestions ||
          jobMatch.improvement_suggestions.length === 0) &&
        result.suggestions.length > 0
      ) {
        // Update the jobMatch object for consistency
        jobMatch.improvement_suggestions = result.suggestions;
      }

      // If jobMatch has improvement_suggestions but it's empty or a string
      if (jobMatch.improvement_suggestions) {
        if (typeof jobMatch.improvement_suggestions === "string") {
          // Check if it's not a helpful string
          if (
            jobMatch.improvement_suggestions ===
            "Extracted job match suggestions from the response"
          ) {
            // Use our parsed suggestions instead
            if (result.suggestions.length > 0) {
              // Already handled above
            } else {
              result.suggestions = parseDefaultSuggestions(rawAnalysis);
            }
          } else {
            // It's a meaningful string, use it
            result.suggestions = [jobMatch.improvement_suggestions];
          }
        } else if (
          Array.isArray(jobMatch.improvement_suggestions) &&
          jobMatch.improvement_suggestions.length > 0
        ) {
          // Use the array directly
          result.suggestions = jobMatch.improvement_suggestions;
        }
      }

      // Ensure we have suggestions
      if (!result.suggestions || result.suggestions.length === 0) {
        result.suggestions = parseDefaultSuggestions(rawAnalysis);
      }

      return result;
    }

    // If no structured data is provided, fall back to the existing parsing logic
    try {
      const result = {
        jobDescription: "",
        scores: {
          skillsMatch: null,
          experienceMatch: null,
          overallMatch: null,
        },
        suggestions: [],
        invalidJobDescription: false,
      };

      // Extract scores
      const skillsMatch = extractPercentage(
        rawAnalysis,
        /Skills Match:.*?(\d+)%/i
      );
      const experienceMatch = extractPercentage(
        rawAnalysis,
        /Experience Match:.*?(\d+)%/i
      );
      const overallMatch = extractPercentage(
        rawAnalysis,
        /Overall Match:.*?(\d+)%/i
      );

      result.scores = {
        skillsMatch,
        experienceMatch,
        overallMatch,
      };

      // Extract explanations
      const skillsExplanationMatch = rawAnalysis.match(
        /Skills Match:.*?(\d+)%\s*-\s*(.*?)(?=\n\*|\n\n|$)/is
      );
      const experienceExplanationMatch = rawAnalysis.match(
        /Experience Match:.*?(\d+)%\s*-\s*(.*?)(?=\n\*|\n\n|$)/is
      );
      const overallExplanationMatch = rawAnalysis.match(
        /Overall Match:.*?(\d+)%\s*-\s*(.*?)(?=\n\*|\n\n|$)/is
      );

      result.explanations = {
        skillsExplanation: skillsExplanationMatch
          ? skillsExplanationMatch[2].trim()
          : null,
        experienceExplanation: experienceExplanationMatch
          ? experienceExplanationMatch[2].trim()
          : null,
        overallExplanation: overallExplanationMatch
          ? overallExplanationMatch[2].trim()
          : null,
      };

      // Parse suggestions
      const suggestionsMatch = rawAnalysis.match(
        /\*\*Suggestions for Improvement:\*\*([\s\S]*?)(?=\n\n\n|By implementing|$)/i
      );
      if (suggestionsMatch) {
        result.suggestions = suggestionsMatch[1]
          .split(/\*\s*\*\*/)
          .filter((item) => item.trim().length > 0)
          .map((item) => {
            // Check if item has a title format like "Add Projects:** Description"
            const titleMatch = item.match(/([^:]+):\*\*\s*(.*?)(?=\n|$)/s);
            if (titleMatch) {
              return {
                title: titleMatch[1].trim(),
                description: titleMatch[2].trim(),
              };
            }
            return item.trim();
          });
      }

      // If no suggestions found, try to parse them in another way
      if (!result.suggestions || result.suggestions.length === 0) {
        result.suggestions = parseDefaultSuggestions(rawAnalysis);
      }

      return result;
    } catch (error) {
      console.error("Error parsing job score:", error);
      return {
        jobDescription: "Could not process job description",
        scores: {
          skillsMatch: null,
          experienceMatch: null,
          overallMatch: null,
        },
        suggestions: [],
        error: error.message,
        invalidJobDescription: false,
      };
    }
  };

  /**
   * Helper function to extract percentage values from string
   * @param {string} text - Text to search in
   * @param {RegExp} regex - Regular expression with capture group for percentage
   * @returns {number|null} - Extracted percentage or null
   */
  const extractPercentage = (text, regex) => {
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : null;
  };

  /**
   * Helper function to parse percentage values from string
   * @param {string|number} value - Value to parse
   * @returns {number|null} - Parsed percentage or null
   */
  const parsePercentage = (value) => {
    if (value === null || value === undefined) return null;

    if (typeof value === "number") return value;

    if (typeof value === "string") {
      const match = value.match(/(\d+)%?/);
      return match ? parseInt(match[1], 10) : null;
    }

    return null;
  };

  /**
   * Helper function to parse suggestions when not clearly formatted
   * @param {string} rawAnalysis - Raw analysis text from backend
   * @returns {Array} - Array of suggestions
   */
  const parseDefaultSuggestions = (rawAnalysis) => {
    // Try to find a suggestions section using different patterns
    const patterns = [
      /\*\*Suggestions[^:]*:\*\*([\s\S]*?)(?=\n\n\n|By implementing|$)/i,
      /suggestions?[^:]*:\s*([\s\S]*?)(?=\n\n\n|By implementing|$)/i,
      /improve[^:]*:\s*([\s\S]*?)(?=\n\n\n|By implementing|$)/i,
    ];

    for (const pattern of patterns) {
      const match = rawAnalysis.match(pattern);
      if (match) {
        // Extract bullet points
        const bulletPoints = match[1].match(/\*\s*(.*?)(?=\n\*|\n\n|$)/g);
        if (bulletPoints && bulletPoints.length > 0) {
          return bulletPoints
            .map((point) => point.replace(/^\*\s*/, "").trim())
            .filter((point) => point.length > 0)
            .map((point) => point.replace(/\*\*/g, "")); // Remove all ** from suggestions
        }

        // If no bullet points found, try to split by newlines
        return match[1]
          .split("\n")
          .map((line) => line.trim().replace(/\*\*/g, "")) // Remove all ** from suggestions
          .filter((line) => line.length > 0);
      }
    }

    // Default suggestions if nothing could be parsed
    return [
      "Tailor your resume to highlight relevant skills",
      "Add quantifiable achievements",
      "Ensure your experience section clearly demonstrates your capabilities",
      "Consider adding more relevant projects to your portfolio",
    ];
  };
  // Effect to process data when it arrives from backend
  useEffect(() => {
    if (backendData?.result) {
      setJobScore((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
      }));

      try {
        // Check if we have structured job_match data
        const jobMatchData = backendData.result.job_match;
        const rawAnalysis = backendData.result.raw_analysis;

        // Log the received data for debugging
        if (process.env.NODE_ENV === "development") {
          console.log("Raw Analysis:", rawAnalysis);
          console.log("Job Match Data:", jobMatchData);
        }

        // Parse the data, passing both raw analysis and structured job match data
        const parsedData = parseJobScore(rawAnalysis, jobMatchData);

        if (!parsedData) {
          throw new Error("Failed to parse job analysis data");
        }

        // Use the parsed data
        setJobScore({
          ...(parsedData || {}),
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Job score processing error:", err);
        setJobScore((prevState) => ({
          ...prevState,
          loading: false,
          error: "Failed to process job analysis data.",
        }));
      }
    }
  }, [backendData]);
  const ScoreCard = ({ title, score, explanation, color }) => {
    // Define color classes based on the provided color prop
    const colorClasses = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-800 dark:text-blue-300",
        ring: "ring-blue-600/20 dark:ring-blue-500/30",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900/20",
        text: "text-green-800 dark:text-green-300",
        ring: "ring-green-600/20 dark:ring-green-500/30",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900/20",
        text: "text-purple-800 dark:text-purple-300",
        ring: "ring-purple-600/20 dark:ring-purple-500/30",
      },
    }[color] || {
      bg: "bg-gray-100 dark:bg-gray-800/50",
      text: "text-gray-800 dark:text-gray-300",
      ring: "ring-gray-600/20 dark:ring-gray-500/30",
    };

    return (
      <div
        className={`${colorClasses.bg} p-4 rounded-lg ring-1 ${colorClasses.ring}`}
      >
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {title}
        </h4>

        {score !== null ? (
          <div className="space-y-2">
            <div className="flex items-end">
              <span className={`text-3xl font-bold ${colorClasses.text}`}>
                {score}%
              </span>
            </div>

            {explanation && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {explanation}
              </p>
            )}
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400 italic">N/A</span>
        )}
      </div>
    );
  };
  // Add this helper near cleanEducationField
  function cleanActivitiesField(activitiesRaw) {
    if (!activitiesRaw) return "";
    // Remove ":**", "**", and leading bullets/dashes/semicolons/colons
    let cleaned = activitiesRaw
      .replace(/:\*\*/g, "")
      .replace(/\*\*/g, "")
      .replace(/^\*\s*/gm, "")
      .replace(/^\s*-\s*/gm, "")
      .replace(/^\s*;\s*/gm, "")
      .replace(/^\s*:\s*/gm, "")
      .trim();
    return cleaned;
  }
  function cleanEducationField(educationRaw) {
    if (!educationRaw) return "";
    // Split at Certifications or Activities if present
    let cleaned = educationRaw
      .split("**Certifications:**")[0]
      .split("**Activities:**")[0]
      .split("**Current/Most Recent Position:**")[0];
    // Remove any trailing colons and asterisks
    cleaned = cleaned
      .replace(/:\*\*/g, "")
      .replace(/\*\*/g, "")
      .replace(/^\*\s*/gm, "") // Remove leading bullet points
      .replace(/^\s*-\s*/gm, "") // Remove leading dashes
      .replace(/^\s*;\s*/gm, "") // Remove leading semicolons
      .replace(/^\s*:\s*/gm, "") // Remove leading colons
      .trim();
    return cleaned;
  }
  const EnhancedPDFViewer = ({ pdfUrl }) => {
    const editPDF = () => {
      // Switch to text mode for editing
      setViewMode("text");
      setIsEditing(true);
    };

    return (
      <div className="relative w-full h-full">
        <PDFViewer pdfUrl={pdfUrl} />
        <button
          className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md flex items-center text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          onClick={editPDF}
          aria-label="Edit PDF content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
      </div>
    );
  };
  function cleanCertificationField(certificationRaw) {
    if (!certificationRaw) return "";
    // Remove ":**", "**", and leading bullets/dashes/semicolons/colons
    let cleaned = certificationRaw
      // Remove the activities line if present
      .replace(/\*\s*\*\*Activities:\*\*.*(\n|$)/gi, "")
      // Remove all ":**"
      .replace(/:\*\*/g, "")
      // Remove all "**"
      .replace(/\*\*/g, "")
      // Remove leading bullets, dashes, semicolons, colons
      .replace(/^\*\s*/gm, "")
      .replace(/^\s*-\s*/gm, "")
      .replace(/^\s*;\s*/gm, "")
      .replace(/^\s*:\s*/gm, "")
      .trim();
    return cleaned;
  }
  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Application Session
              </h1>

              <div className="mt-6 relative">
                <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-zinc-950">
                  <div className="shadow-none flex flex-col justify-center bg-blue-500 w-1/4"></div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Step 1: Data
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Step 1 of 4
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Choose Your Application Method
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You can either use your previously saved data or upload a new CV
                for this application.
              </p>

              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-4">
                      {/**
                      <button
                        className={`relative w-full py-4 px-6 rounded-lg transition-all duration-200 flex items-center ${
                          useExistingData === true
                            ? "bg-blue-50 dark:bg-zinc-950/20 border-2 border-blue-500 dark:border-blue-500"
                            : "bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        }`}
                        onClick={() => handleSelection(true)}
                      >
                        <div className="mr-4">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              useExistingData === true
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-400 dark:border-gray-400"
                            }`}
                          >
                            {useExistingData === true && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block font-medium text-gray-900 dark:text-white">
                            Use Saved Data
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            Continue with your existing profile information
                          </span>
                        </div>
                      </button>
*/}
                      <button
                        className={`relative w-full py-4 px-6 rounded-lg transition-all duration-200 flex items-center ${
                          useExistingData === false
                            ? "bg-blue-50 dark:bg-zinc-950/20 border-2 border-blue-500 dark:border-blue-500"
                            : "bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        }`}
                        onClick={handleAddCvModalOpen}
                      >
                        <div className="mr-4">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              useExistingData === false
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-400 dark:border-gray-400"
                            }`}
                          >
                            {useExistingData === false && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block font-medium text-gray-900 dark:text-white">
                            Put Your Cv here
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            Upload a new resume for this application
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Rest of the code remains the same... */}
                  <div className="bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                      Current Selection
                    </h3>

                    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-600 p-4 h-40 flex flex-col justify-center">
                      {useExistingData === null ? (
                        selectedJob ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="w-24 text-xs text-gray-500 dark:text-gray-400">
                                Job Title:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedJob.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="w-24 text-xs text-gray-500 dark:text-gray-400">
                                Company:
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedJob.companyName}
                              </span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="w-24 text-xs text-gray-500 dark:text-gray-400">
                                Description:
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                {selectedJob.description}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            <svg
                              className="mx-auto h-8 w-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="mt-2 text-sm font-medium">
                              Please select an option
                            </p>
                          </div>
                        )
                      ) : useExistingData ? (
                        <div className="text-center">
                          <svg
                            className="mx-auto h-8 w-8 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            Using your saved CV data
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg
                            className="mx-auto h-8 w-8 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            Adding a new CV
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Application Session
            </h1>
            <div className="flex items-center justify-center mt-6 mb-8">
              <div className="relative w-full max-w-2xl">
                <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-gray-700">
                  <div className="shadow-none flex flex-col justify-center bg-blue-500 w-1/2"></div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Step 2: Data Review
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Step 2 of 4
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Review Your Profile Information
              </h2>
              <div className="flex gap-2">
                {editMode && (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      // Optionally reset formData to original values if needed
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => (editMode ? handleSave() : setEditMode(true))}
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isLoading
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : editMode
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Saving...
                    </>
                  ) : editMode ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {/* Personal Info */}
              <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleSection("personal")}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeSection === "personal" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {(activeSection === "personal" || activeSection === null) && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                    {editMode ? (
                      <>
                        {renderEditableField(
                          "Full Name",
                          "name",
                          formData.name
                        )}
                        {renderEditableField(
                          "Email Address",
                          "email",
                          formData.email
                        )}
                        {renderEditableField(
                          "Phone Number",
                          "phone",
                          formData.phone
                        )}
                        {renderEditableField(
                          "LinkedIn Profile",
                          "linkedIn",
                          formData.linkedIn
                        )}

                        {renderEditableField(
                          "GitHub Profile",
                          "github",
                          formData.github
                        )}
                        {renderEditableField(
                          "Position",
                          "currentPosition",
                          formData.currentPosition
                        )}
                        {renderEditableField(
                          "Location",
                          "location",
                          formData.location,
                          true
                        )}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="inline-block w-24 font-medium">
                              Name:
                            </span>{" "}
                            {formData.name.replace(/\*\*/g, "")}
                          </p>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-24 font-medium">
                            Email:
                          </span>
                          <a
                            href={`mailto:${formData.email.replace(
                              /\*\*/g,
                              ""
                            )}`}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {formData.email.replace(/\*\*/g, "")}
                          </a>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-24 font-medium">
                            Phone:
                          </span>{" "}
                          {formData.phone.replace(/\*\*/g, "")}
                        </p>
                        {formData.linkedIn && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="inline-block w-24 font-medium">
                              LinkedIn:
                            </span>{" "}
                            <a
                              href={
                                formData.linkedIn.startsWith("http")
                                  ? formData.linkedIn
                                  : `https://${formData.linkedIn}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center"
                            >
                              {formData.linkedIn.replace("https://", "")}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </p>
                        )}
                        {formData.github && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="inline-block w-24 font-medium">
                              GitHub:
                            </span>{" "}
                            <a
                              href={
                                formData.github.startsWith("http")
                                  ? formData.github
                                  : `https://${formData.github}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center"
                            >
                              {formData.github.replace("https://", "")}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </p>
                        )}
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-24 font-medium">
                            <b>Position:</b>
                          </span>{" "}
                          {typeof formData.currentPosition === "string" &&
                          formData.currentPosition.trim() !== ""
                            ? formData.currentPosition.replace(/\*\*/g, "")
                            : "Not specified"}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-24 font-medium">
                            Location:
                          </span>{" "}
                          {formData.location || (
                            <span className="text-gray-500 dark:text-gray-400">
                              No location data available
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden mt-4">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleSection("summary")}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Professional Summary
                    </h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeSection === "summary" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {(activeSection === "summary" || activeSection === null) && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                    {editMode ? (
                      renderEditableField(
                        "Professional Summary",
                        "about",
                        formData.about,
                        true
                      )
                    ) : (
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                        {formData.about && formData.about.trim() !== "" ? (
                          formData.about
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            No professional summary available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden mt-4">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleSection("education")}
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0V8"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Education
                    </h3>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeSection === "education" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {(activeSection === "education" || activeSection === null) && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                    {editMode ? (
                      renderEditableField(
                        "Education",
                        "education",
                        cleanEducationField(formData.education),
                        true
                      )
                    ) : (
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                        {cleanEducationField(formData.education) || (
                          <span className="text-gray-500 dark:text-gray-400">
                            No education data available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleSection("experience")}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Work Experience
                    </h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeSection === "experience" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {(activeSection === "experience" || activeSection === null) && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                    {editMode ? (
                      renderEditableField(
                        "Experience Details",
                        "experience",
                        formData.experience,
                        true
                      )
                    ) : formData.experience &&
                      formData.experience.length > 0 ? (
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                        {formData.experience}
                      </div>
                    ) : backendData?.result?.raw_analysis ? (
                      <div className="prose dark:prose-invert max-w-none">
                        {parseExperienceSection(
                          backendData.result.raw_analysis
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No work experience data available
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <button
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all duration-200"
                  onClick={() => toggleSection("skills")}
                  aria-expanded={activeSection === "skills"}
                  aria-controls="skills-content"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Skills
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Technical abilities and competencies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {formData.skills &&
                      formData.skills.length > 0 &&
                      !editMode && (
                        <span className="mr-3 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {Array.isArray(formData.skills)
                            ? formData.skills.length
                            : ""}
                        </span>
                      )}
                    <div
                      className={`p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 transition-transform duration-300 ${
                        activeSection === "skills"
                          ? "rotate-180 bg-blue-100 dark:bg-blue-900/30"
                          : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          activeSection === "skills"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {(activeSection === "skills" || activeSection === null) && (
                  <div
                    id="skills-content"
                    className="px-6 py-5 border-t border-gray-200 dark:border-zinc-800 animate-fadeIn"
                  >
                    {editMode ? (
                      <div className="space-y-4">
                        <label
                          htmlFor="skills-input"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Enter your skills (comma separated)
                        </label>
                        {renderEditableField(
                          "Skills",
                          "skills",
                          formData.skills,
                          true
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          Pro tip: List your most relevant skills for this
                          position first
                        </p>
                      </div>
                    ) : (
                      formData.skills &&
                      (Array.isArray(formData.skills) ? (
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 transition-all hover:bg-blue-200 dark:hover:bg-blue-800/40"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : typeof formData.skills === "string" &&
                        formData.skills.trim() !== "" ? (
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                          {formData.skills}
                        </div>
                      ) : backendData?.result?.raw_analysis ? (
                        <div className="prose dark:prose-invert max-w-none">
                          {parseSkillsSection(backendData.result.raw_analysis)}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <div className="rounded-full bg-gray-100 dark:bg-zinc-800 p-3 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-500 dark:text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No skills data available
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden mt-4">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleSection("activities")}
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 4v4m0 0V4m0 4a4 4 0 00-4 4v4a4 4 0 004 4 4 4 0 004-4v-4a4 4 0 00-4-4z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Activities
                    </h3>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeSection === "activities" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {(activeSection === "activities" || activeSection === null) && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                    {editMode ? (
                      renderEditableField(
                        "Activities",
                        "activities",
                        cleanActivitiesField(formData.activities),
                        true
                      )
                    ) : (
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                        {cleanActivitiesField(formData.activities) || (
                          <span className="text-gray-500 dark:text-gray-400">
                            No activities data available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Certification Section */}
              <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden mt-4">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleSection("certification")}
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Certification
                    </h3>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeSection === "certification" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {(activeSection === "certification" ||
                  activeSection === null) && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                    {editMode ? (
                      renderEditableField(
                        "Certification",
                        "certification",
                        cleanCertificationField(formData.certification),
                        true
                      )
                    ) : (
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                        {cleanCertificationField(formData.certification) || (
                          <span className="text-gray-500 dark:text-gray-400">
                            No certification data available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Languages Section */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow duration-300 mt-4">
                <button
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all duration-200"
                  onClick={() => toggleSection("languages")}
                  aria-expanded={activeSection === "languages"}
                  aria-controls="languages-content"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Languages
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Communication proficiencies
                      </p>
                    </div>
                  </div>
                  <div
                    className={`p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 transition-transform duration-300 ${
                      activeSection === "languages"
                        ? "rotate-180 bg-green-100 dark:bg-green-900/30"
                        : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        activeSection === "languages"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {(activeSection === "languages" || activeSection === null) && (
                  <div
                    id="languages-content"
                    className="px-6 py-5 border-t border-gray-200 dark:border-zinc-800 animate-fadeIn"
                  >
                    {editMode ? (
                      <div className="space-y-4">
                        <label
                          htmlFor="languages-input"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Enter languages and proficiency levels
                        </label>
                        {renderEditableField(
                          "Languages",
                          "languages",
                          formData.languages,
                          true
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          Example: English (Native), Spanish (Fluent), French
                          (Intermediate)
                        </p>
                      </div>
                    ) : (
                      formData.languages &&
                      (Array.isArray(formData.languages) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {formData.languages.map((language, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20"
                            >
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-lg font-medium mr-3">
                                {language.substring(0, 1).toUpperCase()}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {language}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : typeof formData.languages === "string" &&
                        formData.languages.trim() !== "" ? (
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                          {formData.languages}
                        </div>
                      ) : backendData?.result?.raw_analysis ? (
                        <div className="prose dark:prose-invert max-w-none">
                          {parseLanguagesSection(
                            backendData.result.raw_analysis
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <div className="rounded-full bg-gray-100 dark:bg-zinc-800 p-3 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-500 dark:text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No language information available
                          </p>
                          {editMode && (
                            <button
                              onClick={() =>
                                handleInputChange("languages", [""])
                              }
                              className="mt-2 text-sm text-green-600 dark:text-green-400 hover:underline"
                            >
                              + Add languages
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {/* Projects Section */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-600 dark:text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Key Projects
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showcase of past work and achievements
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSection("projects")}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    aria-label="Toggle projects section"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {(activeSection === "projects" || activeSection === null) && (
                  <div className="px-6 py-5 animate-fadeIn">
                    {editMode ? (
                      <div className="space-y-4">
                        <label
                          htmlFor="projects-input"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Enter your key projects (one per line or as a
                          paragraph)
                        </label>
                        {renderEditableField(
                          "Key Projects",
                          "projects",
                          Array.isArray(formData.projects)
                            ? formData.projects.join("\n")
                            : formData.projects || "",
                          true
                        )}{" "}
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          Highlight your most relevant projects and
                          achievements.
                        </p>
                      </div>
                    ) : (
                      formData.projects &&
                      (Array.isArray(formData.projects) ? (
                        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                          {formData.projects.map((proj, idx) => (
                            <li key={idx}>
                              {typeof proj === "string"
                                ? proj
                                : JSON.stringify(proj)}
                            </li>
                          ))}
                        </ul>
                      ) : typeof formData.projects === "string" &&
                        formData.projects.trim() !== "" ? (
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                          {formData.projects}
                        </div>
                      ) : backendData?.result?.raw_analysis ? (
                        <div className="prose dark:prose-invert max-w-none">
                          {parseProjectsSection(
                            backendData.result.raw_analysis
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <div className="rounded-full bg-gray-100 dark:bg-zinc-800 p-3 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-500 dark:text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No key projects data available
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Application Session
            </h1>
            <div className="flex items-center justify-center mt-6 mb-8">
              <div className="relative w-full max-w-2xl">
                <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-gray-700">
                  <div className="shadow-none flex flex-col justify-center bg-blue-500 w-3/4"></div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Step 3: Recommendations
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Step 3 of 4
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {/* Resume Feedback Section */}
              {resumeStrengths.length > 0 && (
                <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Resume Feedback
                  </h3>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      Strengths:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      {resumeStrengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>

                    {areasForImprovement.length > 0 && (
                      <>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mt-4">
                          Areas for Improvement:
                        </h4>
                        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                          {areasForImprovement.map((area, index) => (
                            <li key={index}>{area}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* LinkedIn Profile Suggestions Section */}
              <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn Profile Suggestions
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {linkedinSuggestions.length} tips
                  </span>
                </div>

                <div className="space-y-3">
                  {linkedinSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 rounded-md bg-gray-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <a
                    href={
                      formData.linkedIn.startsWith("http")
                        ? formData.linkedIn
                        : `https://${formData.linkedIn}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Update your LinkedIn profile
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      case 4: // New case for job score
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Resume vs. Job Description Analysis
            </h1>

            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-full max-w-2xl">
                <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    className="shadow-none flex flex-col justify-center bg-blue-500"
                    style={{ width: "75%" }} // 3.5 of 4 steps
                  ></div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Step 3.5: Job Score
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Step 3.5 of 4
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Your Resume Match Analysis
              </h2>

              {jobScore.loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : jobScore.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
                  <p>Error: {jobScore.error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Job Description Section */}
                  <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                    <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-md text-gray-700 dark:text-gray-300">
                      {/* Add the conclusion paragraph from backend */}

                      <div className="  border-gray-200 dark:border-gray-700">
                        <p className="italic text-gray-600 dark:text-zinc-200">
                          By addressing these suggestions, You can significantly
                          improve your resume and increase your chances of
                          securing an interview for this position.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Scores Section */}
                  {/* Scores Section */}
                  <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                      Match Scores
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Skills Match */}
                      <ScoreCard
                        title="Skills Match"
                        score={jobScore.scores.skillsMatch}
                        explanation={jobScore.explanations?.skillsExplanation}
                        color="blue"
                      />

                      {/* Experience Match */}
                      <ScoreCard
                        title="Experience Match"
                        score={jobScore.scores.experienceMatch}
                        explanation={
                          jobScore.explanations?.experienceExplanation
                        }
                        color="green"
                      />

                      {/* Overall Match */}
                      <ScoreCard
                        title="Overall Match"
                        score={jobScore.scores.overallMatch}
                        explanation={jobScore.explanations?.overallExplanation}
                        color="purple"
                      />
                    </div>
                  </div>

                  {/* Suggestions Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                      Suggestions for Improving Your Match
                    </h3>

                    {jobScore.suggestions && jobScore.suggestions.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-4 text-gray-700 dark:text-gray-300">
                        {jobScore.suggestions.map((suggestion, index) => {
                          // Skip empty suggestions
                          if (
                            !suggestion ||
                            (typeof suggestion === "string" &&
                              suggestion.trim().length === 0)
                          ) {
                            return null;
                          }

                          // Handle suggestion object with title and description
                          if (
                            typeof suggestion === "object" &&
                            suggestion.title &&
                            suggestion.description
                          ) {
                            return (
                              <li key={index} className="pl-1">
                                <div className="font-semibold mb-1">
                                  {suggestion.title}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {suggestion.description}
                                </div>
                              </li>
                            );
                          }

                          // Extract title and content if suggestion follows "Title: Content" format
                          if (typeof suggestion === "string") {
                            const titleMatch =
                              suggestion.match(/^([^:]+):\s*(.*)/);
                            if (titleMatch) {
                              return (
                                <li key={index} className="pl-1">
                                  <span className="font-semibold">
                                    {titleMatch[1]}
                                  </span>
                                  : {titleMatch[2]}
                                </li>
                              );
                            }

                            // Handle bullet points if present
                            const bulletMatch =
                              suggestion.match(/^[•\*]\s*(.*)/);
                            if (bulletMatch) {
                              return (
                                <li key={index} className="pl-1">
                                  {bulletMatch[1].charAt(0).toUpperCase() +
                                    bulletMatch[1].slice(1)}
                                </li>
                              );
                            }

                            // Default handling
                            return (
                              <li key={index} className="pl-1">
                                {/* Capitalize first letter if it's not already */}
                                {suggestion.charAt(0).toUpperCase() +
                                  suggestion.slice(1)}
                              </li>
                            );
                          }

                          return null;
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No suggestions available.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={async () => {
                  setCurrentPage(2); // Navigate to the next step
                }}
                disabled={jobScore.loading}
                className={`px-4 py-2 rounded-md text-white transition-colors duration-200 ${
                  jobScore.loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {jobScore.loading ? "Processing..." : "Update and Continue"}
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Application Session
            </h1>

            <div className="mt-6 relative">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-gray-700">
                <div className="shadow-none flex flex-col justify-center bg-blue-500 w-full"></div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Step 4: Final Review
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Step 4 of 4
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6 mt-8 mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Submit Your Application
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please review all your information before submitting. Once
                submitted, you won't be able to make changes.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Ready to Submit
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      All information has been provided and your application is
                      ready to be submitted.
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Personal Information</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Resume/CV</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Job Matching</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl shadow-sm p-6">
                <div className="flex items-start">
                  <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-800/40 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                      <path d="M8 11a1 1 0 100 2h4a1 1 0 100-2H8z" />
                      <path d="M8 7a1 1 0 100 2h4a1 1 0 100-2H8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Enhance Your Application
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      A personalized cover letter can increase your chances of
                      getting noticed by up to 50%.
                    </p>
                  </div>
                </div>

                {coverLetterGenerated && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-xl flex items-start">
                    <div className="flex-shrink-0 p-1 bg-green-100 dark:bg-green-700/30 rounded-full">
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-green-800 dark:text-green-300">
                        {uploadedFile
                          ? "Cover letter uploaded successfully"
                          : "Cover letter generated successfully"}
                      </h4>
                      <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                        {uploadedFile
                          ? `Filename: ${uploadedFile.name}`
                          : "Your cover letter is ready to edit, preview, or download"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                        Cover Letter Options
                      </h3>
                    </div>

                    <div className="p-5">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Generate a personalized cover letter using AI based
                            on your profile and job details.
                          </p>
                          <button
                            onClick={() => {
                              generateCoverLetter();
                              setCoverLetterGenerated(true);
                            }}
                            disabled={loading || !selectedJob}
                            className="w-full py-2.5 px-4 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-sm transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin mr-2 h-4 w-4 text-white"
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
                                Generating...
                              </span>
                            ) : (
                              <span className="flex items-center">
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
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                                Generate with AI
                              </span>
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-3 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                              OR
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Already have a cover letter? Upload your existing
                            file.
                          </p>
                          <label
                            htmlFor="cover-letter-upload"
                            className="flex items-center justify-center w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 8v8m16-8v8M4 8l8-4 8 4M4 8h16"
                              />
                            </svg>
                            Upload Cover Letter
                          </label>
                          <input
                            id="cover-letter-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          {uploadedFile && (
                            <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span className="truncate max-w-xs">
                                {uploadedFile.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {coverLetter ? (
                    <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Your Cover Letter
                        </h3>

                        <div className="flex items-center space-x-2">
                          {coverLetter && pdfData && (
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex items-center">
                              <button
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                  viewMode === "text"
                                    ? "bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-gray-200"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                }`}
                                onClick={() => setViewMode("text")}
                                aria-label="View text"
                              >
                                Text
                              </button>

                              <button
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                  viewMode === "pdf"
                                    ? "bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-gray-200"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                }`}
                                onClick={() => setViewMode("pdf")}
                                aria-label="View PDF"
                              >
                                PDF
                              </button>
                            </div>
                          )}

                          <a
                            href={downloadUrl}
                            download={`cover_letter_${
                              selectedJob?.title
                                ?.replace(/\s+/g, "_")
                                .toLowerCase() || "job"
                            }.${viewMode === "pdf" ? "pdf" : "txt"}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            aria-label="Download cover letter"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Download
                          </a>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col h-full">
                        {isEditing ? (
                          <div className="flex-grow">
                            <textarea
                              className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              placeholder="Enter your cover letter content here..."
                            />

                            {error && (
                              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                <div className="flex">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-red-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {error}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3 mt-4">
                              <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                                onClick={handleSaveEdit}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Save Changes
                                  </>
                                )}
                              </button>

                              <button
                                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-lg shadow-sm transition-colors"
                                onClick={() => {
                                  setIsEditing(false);
                                  setError(null);
                                }}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </button>

                              <button
                                className="px-4 py-2 bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center ml-auto"
                                onClick={downloadAsPDF}
                                disabled={
                                  isSubmitting ||
                                  !editedContent ||
                                  !editedContent.trim()
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                Download as PDF
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="cover-letter-content rounded-lg border dark:border-gray-700 overflow-hidden flex-grow bg-gray-50 dark:bg-gray-900 min-h-[24rem]">
                              {viewMode === "pdf" && pdfData ? (
                                <div className="w-full h-full">
                                  <EnhancedPDFViewer pdfUrl={pdfData} />
                                </div>
                              ) : (
                                <div className="p-6 h-96 overflow-auto">
                                  {coverLetter ? (
                                    <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
                                      {coverLetter}
                                    </pre>
                                  ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                                      <FileText className="h-12 w-12 mb-4 opacity-40" />
                                      <p className="text-lg font-medium">
                                        No content to display
                                      </p>
                                      <p className="text-sm mt-2 max-w-md">
                                        Generate a cover letter using AI or
                                        click edit to create one manually
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mt-0 flex items-center justify-between border-t dark:border-gray-700 p-4 h-40">
                              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                {uploadedFile ? (
                                  <>
                                    <FileText className="h-4 w-4 mr-1.5" />
                                    <span className="truncate max-w-xs">
                                      {uploadedFile.name}
                                    </span>
                                  </>
                                ) : viewMode === "pdf" ? (
                                  <>
                                    <FileText className="h-4 w-4 mr-1.5" />
                                    <span>PDF Document</span>
                                  </>
                                ) : (
                                  <>
                                    <FileText className="h-4 w-4 mr-1.5" />
                                    <span>Cover Letter</span>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center  space-x-3">
                                <button
                                  type="button"
                                  className="inline-flex items-center text-sm font-medium rounded-md px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                  onClick={() => {
                                    setEditedContent(
                                      typeof coverLetter === "string"
                                        ? coverLetter
                                        : coverLetter?.content || ""
                                    );
                                    setIsEditing(true);
                                    setViewMode("text");
                                  }}
                                  aria-label="Edit cover letter"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex items-center text-sm font-medium rounded-md px-3 py-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                  onClick={downloadAsPDF}
                                  aria-label="Download as PDF"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                  </svg>
                                  Download
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex items-center text-sm font-medium rounded-md px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      coverLetter || ""
                                    );
                                    toast.success(
                                      "Cover letter copied to clipboard",
                                      {
                                        position: "bottom-right",
                                        autoClose: 2000,
                                      }
                                    );
                                  }}
                                  aria-label="Copy cover letter"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5m10 0h2a2 2 0 012 2v10a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2"
                                    />
                                  </svg>
                                  Copy
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col items-center justify-center py-12 px-6 text-center">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No Cover Letter Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                        Generate a personalized AI cover letter or upload your
                        own to enhance your job application.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => {
                            generateCoverLetter();
                            setCoverLetterGenerated(true);
                          }}
                          disabled={loading || !selectedJob}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          {loading ? "Generating..." : "Generate Cover Letter"}
                        </button>
                        <label
                          htmlFor="cover-letter-upload-empty"
                          className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                          Upload Your Own
                        </label>
                        <input
                          id="cover-letter-upload-empty"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit Cover Letter
                      </h3>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setError(null);
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close editor"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="p-4 flex-grow overflow-auto">
                      <textarea
                        className="w-full h-[60vh] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none font-sans"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Enter your cover letter content here..."
                        autoFocus
                      />

                      {error && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-700 dark:text-red-400 text-sm">
                          <div className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-red-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {error}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex flex-wrap gap-3 justify-end ">
                      <button
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-lg shadow-sm transition-colors"
                        onClick={() => {
                          setIsEditing(false);
                          setError(null);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>

                      <button
                        className="px-4 py-2 bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                        onClick={async () => {
                          if (!editedContent || !editedContent.trim()) {
                            setError("Cover letter content cannot be empty");
                            return;
                          }

                          await generatePDFPreview();
                          if (!error) {
                            setIsEditing(false);
                          }
                        }}
                        disabled={
                          isSubmitting ||
                          !editedContent ||
                          !editedContent.trim()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Preview as PDF
                      </button>

                      <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                        onClick={handleSaveEdit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save Changes & Generate PDF
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-800 dark:text-red-300 flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>{error}</div>
                </div>
              )}

              {!coverLetterGenerated && (
                <div className="mt-5 flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <p className="font-medium mb-1">Pro Tips:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        A tailored cover letter increases response rates by up
                        to 50%
                      </li>
                      <li>
                        The AI generator creates content based on your profile
                        and the job description
                      </li>
                      <li>
                        You can edit the generated letter to add personal
                        touches before submitting
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4"></div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
                By submitting this application, you agree to our Terms of
                Service and Privacy Policy.
              </p>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="max-w-4xl mx-auto px-0 py-1">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              Application Session
            </h1>

            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 2 of 4 (Data review)
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Step 2: Review your data
                </h2>
                <button
                  onClick={() => (editMode ? handleSave() : setEditMode(true))}
                  className={`px-4 py-2 rounded-md ${
                    editMode
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } transition-colors duration-200`}
                >
                  {editMode ? "Save Changes" : "Edit Data"}
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {editMode
                  ? "Edit your information below. Click 'Save Changes' when you're done."
                  : "Please review your CV information below. This data was extracted from your uploaded file or saved data."}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Personal Info */}
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Personal Information
                </h3>
                <div className={editMode ? "" : "space-y-2"}>
                  {editMode ? (
                    <>
                      {renderEditableField("Name", "name", formData.name)}
                      {renderEditableField("Email", "email", formData.email)}
                      {renderEditableField("Phone", "phone", formData.phone)}
                      {formData.linkedIn &&
                        renderEditableField(
                          "LinkedIn",
                          "linkedIn",
                          formData.linkedIn
                        )}
                      {formData.github &&
                        renderEditableField(
                          "GitHub",
                          "github",
                          formData.github
                        )}
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Name:</span>{" "}
                        {formData.name}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Email:</span>{" "}
                        {formData.email}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Phone:</span>{" "}
                        {formData.phone}
                      </p>
                      {formData.linkedIn && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">LinkedIn:</span>{" "}
                          <a
                            href={formData.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {formData.linkedIn}
                          </a>
                        </p>
                      )}
                      {formData.github && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">GitHub:</span>{" "}
                          <a
                            href={formData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {formData.github}
                          </a>
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Work Experience
                </h3>
                {formData.experience && Array.isArray(formData.experience) ? (
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    {formData.experience.map((exp, index) => (
                      <li key={index}>
                        <p>
                          <strong>Title:</strong> {exp.title}
                        </p>
                        <p>
                          <strong>Company:</strong> {exp.companyName}
                        </p>
                        <p>
                          <strong>Location:</strong> {exp.location}
                        </p>
                        <p>
                          <strong>Period:</strong> {exp.period}
                        </p>
                        <p>
                          <strong>Responsibilities:</strong>{" "}
                          {exp.responsibilities}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No work experience data available
                  </p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Skills
                </h3>
                {formData.skills && Array.isArray(formData.skills) ? (
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    {formData.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No skills data available
                  </p>
                )}
              </div>

              {/* Languages */}
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Languages
                </h3>
                {editMode ? (
                  renderEditableField(
                    "Languages",
                    "languages",
                    formData.languages,
                    true
                  )
                ) : backendData?.result?.raw_analysis ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {parseLanguagesSection(backendData.result.raw_analysis)}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No language information available
                  </p>
                )}
              </div>
            </div>

            {editMode && (
              <div className="flex justify-end space-x-4 mb-6">
                <button
                  onClick={() => {
                    setEditMode(false);
                    // Reset form data to original values
                    if (backendData?.result) {
                      setFormData({
                        name:
                          backendData.result.contacts?.name?.replace(
                            /\*\*/g,
                            ""
                          ) || "",
                        email:
                          backendData.result.contacts?.email?.replace(
                            /\*\*/g,
                            ""
                          ) || "",
                        phone:
                          backendData.result.contacts?.phone?.replace(
                            /\*\*/g,
                            ""
                          ) || "",
                        location: cleanLocationField(
                          backendData.result.contacts?.location || ""
                        ),

                        linkedIn:
                          backendData.result.contacts?.linkedIn?.replace(
                            /^\*\*\s*/,
                            ""
                          ) || "",
                        github:
                          backendData.result.contacts?.github?.replace(
                            /^\*\*\s*/,
                            ""
                          ) || "",

                        experience:
                          parseExperienceSection(
                            backendData.result.raw_analysis,
                            true
                          ) || "",
                        skills:
                          parseSkillsSection(
                            backendData.result.raw_analysis,
                            true
                          ) || "",
                        about: parseSummarySection(
                          backendData.result.raw_analysis
                        ),
                        languages:
                          parseLanguagesSection(
                            backendData.result.raw_analysis,
                            true
                          ) || "",
                        projects:
                          parseProjectsSection(
                            backendData.result.raw_analysis,
                            true
                          ) || "",
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };
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
                  src="img/Logo.png"
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
          <header className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar
                navigationMenu={navigation_menu}
                navigationOption={navigation_option}
              />
              <div className="flex items-center gap-4">
                <UserMessage />
                <UserMenu
                  profilePic={profilePic}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                />
              </div>
            </div>
          </header>
          {renderPage()}
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
          <Dialog
            open={isAddCvModalOpen}
            onClose={handleAddCvModalClose}
            className="relative z-50"
          >
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
              <Dialog.Panel
                className={`w-full max-w-sm sm:max-w-md md:max-w-md lg:max-w-md rounded-lg ${
                  isDarkMode
                    ? "bg-zinc-900 text-gray-100 border border-zinc-700"
                    : "bg-white text-zinc-900 border border-zinc-200"
                } shadow-xl transition-all duration-200 overflow-hidden`}
              >
                {/* Header */}
                <div
                  className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b ${
                    isDarkMode ? "border-zinc-700" : "border-zinc-200"
                  }`}
                >
                  <Dialog.Title className="text-sm sm:text-base font-medium flex items-center">
                    <FileText
                      className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    Upload Your Resume
                  </Dialog.Title>
                  <button
                    onClick={handleAddCvModalClose}
                    className={`p-1 rounded-full ${
                      isDarkMode
                        ? "hover:bg-zinc-800 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  {/* Info Section */}
                  <div className="flex items-start mb-3 text-xs">
                    <Info
                      className={`w-3 h-3 sm:w-4 sm:h-4 mt-0.5 mr-1.5 sm:mr-2 flex-shrink-0 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Upload your resume to extract your professional
                      information and match it against job requirements.
                    </p>
                  </div>

                  {/* Selected Job (if applicable) */}
                  {selectedJob && (
                    <div
                      className={`mb-3 p-2 rounded-md ${
                        isDarkMode ? "bg-zinc-800" : "bg-gray-50"
                      } border ${
                        isDarkMode ? "border-zinc-700" : "border-gray-200"
                      } text-xs`}
                    >
                      <div className="flex items-center">
                        <Briefcase
                          className={`w-3 h-3 mr-1 flex-shrink-0 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`font-medium truncate ${
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {selectedJob.title}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Drag & Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-3 sm:p-4 mb-3 text-center ${
                      isDarkMode
                        ? fileSelected
                          ? "border-blue-600 bg-blue-900/10"
                          : "border-zinc-700 hover:border-zinc-500"
                        : fileSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    } cursor-pointer`}
                    onClick={() =>
                      document.getElementById("cv-file-input").click()
                    }
                  >
                    {!fileSelected ? (
                      <>
                        <Upload
                          className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 ${
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          Drag & drop your resume here
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          or click to browse files
                        </p>
                        <div
                          className={`text-xs px-2 py-1 rounded-full mx-auto w-fit mt-1 ${
                            isDarkMode
                              ? "bg-zinc-800 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="flex items-center">
                            <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                            PDF only, max 10MB
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <FileText
                          className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate max-w-full px-2 ${
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {fileName}
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          } flex items-center justify-center`}
                        >
                          <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          File ready to upload
                        </p>
                        <button
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            isDarkMode
                              ? "bg-red-900/20 text-red-400"
                              : "bg-red-50 text-red-600"
                          } mt-1`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setFileName("");
                            setFileSelected(false);
                          }}
                        >
                          <X className="w-3 h-3 mr-1 flex-shrink-0" />
                          Remove
                        </button>
                      </>
                    )}
                  </div>

                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        if (selectedFile.type === "application/pdf") {
                          if (selectedFile.size <= 10 * 1024 * 1024) {
                            setFile(selectedFile);
                            setFileName(selectedFile.name);
                            setFileSelected(true);
                            setUploadError("");
                          } else {
                            setUploadError("File exceeds 10MB limit.");
                          }
                        } else {
                          setUploadError("Please select a PDF file only.");
                        }
                      }
                    }}
                  />

                  {/* File Information and Benefits - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                    <div
                      className={`p-2 rounded-md ${
                        isDarkMode ? "bg-zinc-800" : "bg-gray-50"
                      }`}
                    >
                      <h4
                        className={`font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Supported Files
                      </h4>
                      <ul
                        className={`space-y-0.5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0 text-green-500" />
                          PDF (.pdf)
                        </li>
                        <li className="flex items-center">
                          <X className="w-3 h-3 mr-1 flex-shrink-0 text-red-500" />
                          Other formats
                        </li>
                      </ul>
                    </div>

                    <div
                      className={`p-2 rounded-md ${
                        isDarkMode ? "bg-zinc-800" : "bg-gray-50"
                      }`}
                    >
                      <h4
                        className={`font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Analysis Benefits
                      </h4>
                      <ul
                        className={`space-y-0.5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <li className="flex items-center">
                          <Zap className="w-3 h-3 mr-1 flex-shrink-0 text-blue-500" />
                          Skill extraction
                        </li>
                        <li className="flex items-center">
                          <Zap className="w-3 h-3 mr-1 flex-shrink-0 text-blue-500" />
                          Job match scoring
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div
                      className={`p-2 mb-3 rounded-md flex items-start ${
                        isDarkMode
                          ? "bg-red-900/20 border border-red-800/30 text-red-400"
                          : "bg-red-50 border border-red-200 text-red-600"
                      }`}
                    >
                      <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Loading State */}
                  {isUploading && (
                    <div
                      className={`p-2 mb-3 rounded-md ${
                        isDarkMode
                          ? "bg-blue-900/20 border border-blue-800/30"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 border-l-transparent animate-spin ${
                            isDarkMode ? "border-blue-400" : "border-blue-600"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p
                            className={`text-xs font-medium ${
                              isDarkMode ? "text-blue-400" : "text-blue-700"
                            }`}
                          >
                            Processing your resume...
                          </p>
                          <div
                            className={`w-full rounded-full h-1 mt-1 ${
                              isDarkMode ? "bg-blue-900/40" : "bg-blue-100"
                            }`}
                          >
                            <div
                              className={`h-1 rounded-full animate-pulse ${
                                isDarkMode ? "bg-blue-400" : "bg-blue-600"
                              }`}
                              style={{ width: "60%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className={`flex flex-col sm:flex-row sm:justify-end px-3 sm:px-4 py-2 sm:py-3 border-t gap-2 ${
                    isDarkMode ? "border-zinc-700" : "border-zinc-200"
                  }`}
                >
                  <button
                    onClick={handleAddCvModalClose}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium w-full sm:w-auto order-2 sm:order-1 ${
                      isDarkMode
                        ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs font-medium w-full sm:w-auto order-1 sm:order-2 text-white ${
                      !fileSelected || isUploading
                        ? isDarkMode
                          ? "bg-blue-800/60 cursor-not-allowed"
                          : "bg-blue-400/60 cursor-not-allowed"
                        : isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={!fileSelected || isUploading}
                    onClick={async () => {
                      if (!file) return;

                      try {
                        setIsUploading(true);
                        setUploadError("");

                        const formData = new FormData();
                        formData.append("cv", file);

                        // Include selectedJob details in the request
                        if (selectedJob) {
                          formData.append("jobId", selectedJob._id || "");
                          formData.append("jobTitle", selectedJob.title || "");
                          formData.append(
                            "companyName",
                            selectedJob.companyName || ""
                          );
                          formData.append(
                            "jobDescription",
                            selectedJob.description || ""
                          );
                        }

                        const token = localStorage.getItem("token");
                        if (!token) {
                          console.error(
                            "Authentication token not found. Please log in again."
                          );
                          return;
                        }

                        const response = await axios.post(
                          API_URL + "/api/TakeData",
                          formData,
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        console.log("Backend Response:", response.data);
                        setBackendData(response.data);
                        handleAddCvModalClose();
                        setCurrentPage(2); // Navigate to Section 2
                      } catch (error) {
                        console.error("Error uploading file:", error);
                        setUploadError(
                          error.response?.data?.message ||
                            "Upload failed. Please try again."
                        );
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  >
                    {isUploading ? (
                      <>
                        <span className="flex items-center justify-center">
                          <Loader className="w-3 h-3 mr-1 animate-spin" />
                          Processing...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center justify-center">
                          <Upload className="w-3 h-3 mr-1" />
                          Upload Resume
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
          <div className="max-w-4xl mx-auto py-4 mb-6">
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <button
                className={`py-2 px-6 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                }`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* Pagination Indicators */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <span
                    key={page}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </span>
                ))}
              </div>

              {/* Next/Submit Button */}
              {currentPage === 5 ? (
                <button
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-white rounded-lg transition-colors ${
                    isUploading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleSubmitApplication}
                  disabled={isUploading} // Disable the button while uploading
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center w-full">
                      <div className="relative w-5 h-5 mr-3">
                        {/* Outer ring animation */}
                        <div className="absolute inset-0 rounded-full border-2 border-white opacity-20 animate-ping"></div>
                        {/* Spinner animation */}
                        <svg
                          className="animate-spin w-full h-full text-white"
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
                      </div>
                      <span className="text-base font-medium">
                        Submitting...
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-full">
                      <span className="text-base font-medium mr-1">Submit</span>
                      <svg
                        className="w-5 h-5 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ) : (
                <button
                  className={`px-6 py-2 rounded-lg font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    currentPage === 5
                      ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                      : "bg-zinc-300 dark:bg-zinc-800 text-black dark:text-white hover:bg-blue-600 dark:hover:bg-blue-800 focus:ring-gray-400"
                  }`}
                  onClick={handleNext}
                  disabled={currentPage === 5}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Application;

