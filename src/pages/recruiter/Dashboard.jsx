import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  PenTool,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Wrench,
  FlaskConical,
  Plus,
  LogOut,
  Hammer,
  Palette,
  Megaphone,
  Briefcase,
  Package,
  Headset,
  Wallet,
  Users,
  Monitor,
  Mail,
  Calendar,
  CheckCircle,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDarkMode } from "../../components/DarkModeProvider";
import { Link } from "react-router-dom";
import UserProviderRec, { UserContext } from "./UserContext";
import axios from "axios";
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

const Modal = ({ isOpen, onClose, children, title }) => {
  const { isDarkMode } = useDarkMode();
  const modalRef = React.useRef(null);

  // Close modal when pressing Escape key
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Trap focus inside modal when open
  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      initialFocus={modalRef}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 ${
          isDarkMode ? "bg-black/70" : "bg-black/30"
        } backdrop-blur-sm transition-opacity duration-300 ease-in-out`}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-2 overflow-y-auto">
        {/* Modal Panel */}
        <Dialog.Panel
          ref={modalRef}
          className={`w-full max-w-3xl rounded-xl ${
            isDarkMode
              ? "bg-zinc-900 text-gray-100 border-zinc-700"
              : "bg-white text-gray-900 border-gray-200"
          } shadow-2xl transition-transform duration-300 transform ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } focus:outline-none`}
          tabIndex={-1}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-0 ${
              isDarkMode
                ? "border-b border-zinc-700"
                : "border-b border-gray-200"
            }`}
          >
            {title && (
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
            )}

            <h2
              id="modal-title"
              className="text-2xl font-bold flex items-center  py-4 px-4"
            >
              {title || "Add New Job"}
              {isOpen && (
                <span className="flex h-2 w-2 relative ml-2 ">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      isDarkMode ? "bg-blue-400" : "bg-blue-500"
                    } opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isDarkMode ? "bg-blue-500" : "bg-blue-600"
                    }`}
                  ></span>
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className={`ml-auto p-2 rounded-lg ${
                isDarkMode
                  ? "hover:bg-zinc-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              } transition-colors`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {children}
          </div>

          {/* Footer 
          <div
            className={`px-4 py-2 ${
              isDarkMode
                ? "border-t border-zinc-700 bg-zinc-800/50"
                : "border-t border-gray-100 bg-gray-50"
            } rounded-b-xl`}
          >
           
          </div>*/}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
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
const UserMessage = () => {
  const { isDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewResponses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          API_URL + "/api/recruiters/interviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Transform interviews into notification format
        const interviewNotifications = response.data.interviews
          .filter((interview) => interview.responseStatus) // Only get interviews with responses
          .slice(0, 5) // Limit to 5 most recent notifications
          .map((interview) => {
            const isAccepted = interview.responseStatus === "yes";

            // Calculate time difference
            const responseDate = new Date(interview.createdAt);
            const now = new Date();
            const diffMs = now - responseDate;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

            let timeMessage;
            if (diffHours < 1) {
              timeMessage = "Just now";
            } else if (diffHours < 24) {
              timeMessage = `${diffHours} hour${
                diffHours === 1 ? "" : "s"
              } ago`;
            } else {
              const diffDays = Math.floor(diffHours / 24);
              timeMessage = `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
            }

            // Create notification object
            return {
              id: interview.id,
              message: `${interview.candidateName} ${
                isAccepted ? "accepted" : "declined"
              } interview`,
              details: `For ${interview.job.title} position${
                interview.candidateFeedback ? " with feedback" : ""
              }`,
              time: timeMessage,
              icon: isAccepted ? CheckCircle : XCircle,
              type: isAccepted ? "accepted" : "declined",
              candidateId: interview.candidateId,
            };
          });

        setNotifications(interviewNotifications);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching interview responses:", err);
        setError("Failed to load notifications");
        setLoading(false);
      }
    };

    fetchInterviewResponses();
  }, []);

  // If there are no responses, show default message
  const displayNotifications =
    notifications.length > 0
      ? notifications
      : [
          {
            message: "No interview responses",
            details: "Candidates haven't responded to any interviews yet",
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
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading responses...
                  </p>
                </div>
              ) : error ? (
                <div className="px-4 py-4 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : (
                displayNotifications.map((notification, index) => (
                  <a
                    key={notification.id || index}
                    href={
                      notification.candidateId
                        ? `/dashboard/recuiter/interviews/${notification.id}`
                        : "#"
                    }
                    className={`group flex items-center px-4 py-3 text-sm border-b border-gray-100 dark:border-zinc-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start w-full">
                      <div
                        className={`mr-3 p-2 rounded-md ${
                          notification.type === "accepted"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : notification.type === "declined"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                      >
                        <notification.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
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
                  </a>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-700 text-center">
              <a
                href={import.meta.env.BASE_URL + "dashboard/recuiter/interviews"}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all interviews
              </a>
            </div>
          </MenuItems>
        </>
      )}
    </HeadlessMenu>
  );
};
const UserMenu = () => {
  const { profilePic, firstName, lastName, email } = useContext(UserContext); // Consume UserContext
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

const AddJobForm = ({ onClose }) => {
  const { isDarkMode } = useDarkMode();
  const [activeStep, setActiveStep] = useState(1); // For multi-step form
  const [jobDetails, setJobDetails] = useState({
    companyName: "",
    role: "",
    location: "",
    place: "",
    salary: "",
    type: "",
    description: "",
    requirements: "",
    skills: [],
    deadline: "",
    category: "",
    experienceLevel: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Progress calculation for progress bar
  const totalSteps = 2;
  const progress = (activeStep / totalSteps) * 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setJobDetails((prev) => ({
      ...prev,
      skills: skillsArray,
    }));
  };

  const addSkill = (skill) => {
    if (skill && !jobDetails.skills.includes(skill)) {
      setJobDetails((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      return true;
    }
    return false;
  };

  const removeSkill = (skillToRemove) => {
    setJobDetails((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = e.target.value.trim();
      if (addSkill(skill)) {
        e.target.value = "";
      }
    }
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!jobDetails.companyName)
        errors.companyName = "Company name is required";
      if (!jobDetails.role) errors.role = "Job title is required";
      if (!jobDetails.location) errors.location = "Location is required";
      if (!jobDetails.salary) errors.salary = "Salary information is required";
      if (!jobDetails.type) errors.type = "Please select a job type";
    } else if (step === 2) {
      if (!jobDetails.description)
        errors.description = "Job description is required";
      if (!jobDetails.requirements)
        errors.requirements = "Job requirements are required";
      if (!jobDetails.category)
        errors.category = "Please select a job category";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(activeStep)) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      // Format the job data according to backend API expectations
      const jobData = {
        title: jobDetails.role,
        companyName: jobDetails.companyName,
        location: jobDetails.location,
        place: jobDetails.place,
        salary: jobDetails.salary,
        jobType: jobDetails.type,
        description: jobDetails.description,
        requirements: jobDetails.requirements,
        skills: jobDetails.skills,
        category: jobDetails.category,
        deadline: jobDetails.deadline || undefined,
        experienceLevel: jobDetails.experienceLevel,
      };

      const response = await fetch(
        API_URL + "/api/recruiters/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobData),
        }
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add job");
        }

        setSuccessMessage("Job posted successfully! Candidates can now apply.");

        // Reset form
        setJobDetails({
          companyName: "",
          role: "",
          location: "",
          salary: "",
          type: "",
          description: "",
          requirements: "",
          skills: [],
          deadline: "",
          category: "",
          experienceLevel: "",
        });

        // Show success message for 2 seconds before closing
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const textResponse = await response.text();

        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");

      if (error.message.includes("Authentication failed")) {
        // Optional: redirect to login page
        // window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function for input field styling
  const getInputClassName = (fieldName) => {
    const baseClass = `w-full px-4 py-2 border rounded-lg transition-all duration-200 ${
      isDarkMode
        ? "bg-black/70 text-white border-zinc-700 focus:border-blue-500"
        : "bg-white text-black border-gray-300 focus:border-blue-500"
    }`;

    return validationErrors[fieldName]
      ? `${baseClass} border-red-500 focus:border-red-500`
      : baseClass;
  };
  const getSkillSuggestions = () => {
    const commonSkills = ["Communication", "Teamwork", "Problem Solving"];
    const categorySkills = {
      Engineering: [
        "JavaScript",
        "React",
        "TypeScript",
        "Node.js",
        "Python",
        "Java",
      ],
      Design: [
        "Figma",
        "Adobe XD",
        "Photoshop",
        "Illustrator",
        "UI/UX",
        "Sketch",
      ],
      Marketing: [
        "SEO",
        "Content Marketing",
        "Social Media",
        "Google Analytics",
        "Email Marketing",
      ],
      Sales: [
        "CRM",
        "Negotiation",
        "Prospecting",
        "Client Relations",
        "Sales Strategy",
      ],
      Product: [
        "Product Strategy",
        "Agile",
        "Jira",
        "User Research",
        "Roadmapping",
      ],
      Support: [
        "Customer Service",
        "Zendesk",
        "Troubleshooting",
        "Documentation",
      ],
      Finance: [
        "Excel",
        "Financial Analysis",
        "Forecasting",
        "Budgeting",
        "QuickBooks",
      ],
      HR: [
        "Recruiting",
        "Employee Relations",
        "Onboarding",
        "Benefits Administration",
      ],
      IT: [
        "Network Security",
        "System Administration",
        "Cloud Infrastructure",
        "DevOps",
      ],
      Other: ["Microsoft Office", "Project Management", "Research", "Analysis"],
    };

    return [...(categorySkills[jobDetails.category] || []), ...commonSkills]
      .filter((skill) => !jobDetails.skills.includes(skill))
      .slice(0, 10); // Limit to 10 suggestions
  };

  return (
    <div
      className={`relative ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out z-30 `}
    >
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 mb-6 rounded-full">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
              activeStep >= 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
            }`}
          >
            1
          </div>
          <span className="text-sm font-medium">Basic Info</span>
        </div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
              activeStep >= 2
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
            }`}
          >
            2
          </div>
          <span className="text-sm font-medium">Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Basic Information */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">
              Basic Job Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={jobDetails.companyName}
                  onChange={handleChange}
                  className={getInputClassName("companyName")}
                  placeholder="Enter company name"
                />
                {validationErrors.companyName && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.companyName}
                  </p>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={jobDetails.role}
                  onChange={handleChange}
                  className={getInputClassName("role")}
                  placeholder="e.g. Frontend Developer"
                />
                {validationErrors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.role}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="location"
                    value={jobDetails.location}
                    onChange={handleChange}
                    className={getInputClassName("location")}
                    required
                  >
                    <option value="">Select Location Type</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                {validationErrors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.location}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Place <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="place"
                  value={jobDetails.place || ""}
                  onChange={handleChange}
                  className={getInputClassName("place")}
                  placeholder="e.g. BIZERTE, MONTREAL, etc."
                  required
                />
                {validationErrors.place && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.place}
                  </p>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={jobDetails.type}
                    onChange={handleChange}
                    className={getInputClassName("type")}
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                {validationErrors.type && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.type}
                  </p>
                )}
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="salary"
                  value={jobDetails.salary}
                  onChange={handleChange}
                  className={getInputClassName("salary")}
                  placeholder="e.g. $60,000 - $80,000 per year"
                />
                {validationErrors.salary && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.salary}
                  </p>
                )}
              </div>

              {/* Job Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={jobDetails.category}
                    onChange={handleChange}
                    className={getInputClassName("category")}
                  >
                    <option value="">Select Category</option>
                    <option value="Engineering">🛠️ Engineering</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Marketing">📣 Marketing</option>
                    <option value="Sales">💼 Sales</option>
                    <option value="Product">📦 Product</option>
                    <option value="Support">🧑‍💻 Support</option>
                    <option value="Finance">💰 Finance</option>
                    <option value="HR">🧠 Human Resources</option>
                    <option value="IT">💻 IT</option>
                    <option value="Other">🔍 Other</option>
                  </select>
                </div>
                {validationErrors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.category}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="experienceLevel"
                    value={jobDetails.experienceLevel}
                    onChange={handleChange}
                    className={getInputClassName("experienceLevel")}
                    required
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                {validationErrors.experienceLevel && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.experienceLevel}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Additional Details */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 ">
              Job Details
            </h3>

            <div className="space-y-4">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <div
                  className={`${getInputClassName(
                    "skills"
                  )} p-2 min-h-[80px] flex flex-wrap gap-2 items-start`}
                >
                  {jobDetails.skills.map((skill, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-md px-2 py-1 text-sm`}
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 focus:outline-none"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter"
                    className="border-none outline-none bg-transparent flex-grow min-w-[200px] text-gray-800 dark:text-gray-200"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Suggested skills (click to add):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getSkillSuggestions().map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md px-2 py-1 transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter or comma to add a skill. Click on a skill to
                  remove it.
                </p>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={jobDetails.deadline}
                  onChange={handleChange}
                  className={getInputClassName("deadline")}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={jobDetails.description}
                  onChange={handleChange}
                  className={`${getInputClassName("description")} min-h-32`}
                  rows="5"
                  placeholder="Provide a detailed description of the role and responsibilities"
                ></textarea>
                {validationErrors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about day-to-day responsibilities to attract
                  qualified candidates
                </p>
              </div>

              {/* Job Requirements */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="requirements"
                  value={jobDetails.requirements}
                  onChange={handleChange}
                  className={`${getInputClassName("requirements")} min-h-32`}
                  rows="5"
                  placeholder="List key qualifications, education, and experience requirements"
                ></textarea>
                {validationErrors.requirements && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.requirements}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {successMessage && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Navigation Actions */}
        <div className="flex justify-between mt-8 pt-4 border-t border-zinc-300 dark:border-zinc-700">
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          )}

          {activeStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center"
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
                  Posting Job...
                </>
              ) : (
                <>
                  Post Job
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Optional: Add some CSS animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
const Dashboard = () => {
  const { profilePic, firstName, lastName, email } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigation_menu = [
    {
      name: "Dashboard",
      href: "/dashboard/recuiter",
      icon: Menu,
      current: true,
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
      current: false,
    },
    {
      name: "Support",
      href: "/dashboard/recuiter/jobbuilder",
      icon: Wrench,
      current: false,
      disabled: true,
    },
  ];

  const { isDarkMode, toggleTheme } = useDarkMode();
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
                  },
                  {
                    name: "Interviews",
                    href: "/dashboard/recuiter/interviews",
                    icon: CalendarClock,
                  },

                  {
                    name: "Jobs",
                    href: "/dashboard/recuiter/joblist",
                    icon: Briefcase,
                  },
                  { name: "Billing", href: "/Pricing", icon: CreditCard },
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
                  },
                ]}
              />
              <div className="flex items-center gap-4">
                <UserMessage />

                <UserMenu
                  profilePic={profilePic || "../../assets/images/avatar.jpg"}
                  firstName={firstName || "First Name"}
                  lastName={lastName || "Last Name"}
                  email={email || "example@example.com"}
                />
              </div>
            </div>
          </header>

          <div className="p-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed rounded-xl text-center border-gray-300 dark:border-gray-700 p-8 shadow-lg bg-white dark:bg-zinc-950 transition-all duration-300 transform hover:scale-60 hover:shadow-2xl">
              <div className="p-4 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full mb-6 animate-pulse">
                <PenTool className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
                Create Your Next Job Opportunity
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-lg">
                Start building your dream team by adding a new job opening. Let
                the right talent find you today!
              </p>

              <button
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 animate-slide-up"
                onClick={() => setIsModalOpen(true)}
              >
                Post Job
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transition-transform transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddJobForm onClose={() => setIsModalOpen(false)} />
              </Modal>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
