import React, { useState, useRef, useEffect,useContext } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  Moon,
  Sun,
  ChevronDown,
  Edit,
  Trash2,
  MapPin,
  ChevronUp,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  Wrench,
  FlaskConical,
  DollarSign,
  AlertCircle,
  Clock,
  FileText,
  User,
  CheckSquare,
  Send,
  Info,
  Briefcase,
  MoreVertical,
  Star,
  CheckCircle,
  Users,
  LogOut,
  ArrowRight,
  RefreshCw,
  UserX,
  Mail,
  Phone,
  ExternalLink, 
  Calendar,
  CalendarClock,
    XCircle
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useDarkMode } from "../../components/DarkModeProvider";
import { Link } from "react-router-dom";
import { JobCategoryIcon } from "../../components/Joblogo";
import { Dialog } from "@headlessui/react";
import UserProviderRec, { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
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
const AddJobForm = ({ onClose }) => {
  const { isDarkMode } = useDarkMode();
  const [activeStep, setActiveStep] = useState(1); 
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
                <label className="block text-sm font-medium mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={jobDetails.skills.join(", ")}
                  onChange={handleSkillsChange}
                  className={getInputClassName("skills")}
                  placeholder="e.g. React, TypeScript, Node.js"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter skills separated by commas
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
const Jobs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
    const { profilePic, firstName, lastName, email } = useContext(UserContext);
    const openTwoModal = () => setIsModalTwoOpen(true);
    const openModal = (candidate) => {
      setSelectedCandidate(candidate);
      setIsModalTwoOpen(true);
    };
    
    const closeTwoModal = () => {
      setIsModalTwoOpen(false);
      setSelectedCandidate(null);
    };
    
    const handleSubmitInterview = () => {
      // Your interview scheduling logic here
      closeTwoModal();
    };
    
    const handleStatusUpdate = (status) => {
      // Your status update logic here
    };
  const openEditModal = (job) => {
    setEditFormData({
      role: job.title,
      companyName: job.companyName,
      location: job.location,
      place: job.place ||"",
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      category: job.category || "", 
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      skills: job.skills,
      deadline: job.deadline,
    });
    setIsEditModalOpen(true);
  };
  const clearFilters = () => {
    setFilters({
      fullTime: false,
      partTime: false,
      contract: false,
      remote: false,
      onsite: false,
      hybrid: false,
      salary50_100: false,
      salary100_150: false,
      salary150Plus: false,
    });
  };
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
       current: true,
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

  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    remote: false,
    onsite: false,
    hybrid: false,
    salary50_100: false,
    salary100_150: false,
    salary150Plus: false,
  });

  const [allJobs, setAllJobs] = useState([]); // State for jobs
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await fetch(
          API_URL + "/api/recruiters/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setAllJobs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const filteredJobs = allJobs.filter((job) => {
    const noJobTypeFilters = !filters.fullTime && !filters.partTime;
    const noSalaryFilters = !filters.salary50_100 && !filters.salary100_150;

    if (noJobTypeFilters && noSalaryFilters) return true;


const matchesJobType =
  (filters.fullTime &&
    job.jobType &&
    job.jobType.replace(/[-\s]/g, "").toLowerCase() === "fulltime") ||
  (filters.partTime &&
    job.jobType &&
    job.jobType.replace(/[-\s]/g, "").toLowerCase() === "parttime") ||
  (filters.contract &&
    job.jobType &&
    job.jobType.replace(/[-\s]/g, "").toLowerCase() === "contract") ||
  (!filters.fullTime && !filters.partTime && !filters.contract);

    // Parse salary range
    const salaryString = job.salary.replace(/[^0-9-]/g, "");
    const [minSalary] = salaryString.split("-").map(Number);

    // Check salary filters
    const matchesSalary =
      (filters.salary50_100 && minSalary >= 50 && minSalary <= 100) ||
      (filters.salary100_150 && minSalary >= 100 && minSalary <= 150) ||
      (!filters.salary50_100 && !filters.salary100_150);

    const locationFilters = ["Remote", "onsite", "hybrid"].filter((loc) => filters[loc]);
  const matchesLocation =
    locationFilters.length === 0 ||
    (job.location &&
      locationFilters.some(
        (loc) => job.location.toLowerCase() === loc
      ));

  // Only return jobs that match all filters
  return matchesJobType && matchesSalary && matchesLocation;
  });
  const renderRequirements = (requirements) => {
    // Check if requirements exists and is an array
    if (Array.isArray(requirements)) {
      return requirements.map((req, index) => (
        <li key={index} className="ml-4">
          {req}
        </li>
      ));
    } else if (typeof requirements === "string") {
      // If it's a string, split by newlines or render as is
      return requirements.split("\n").map((line, index) => (
        <li key={index} className="ml-4">
          {line}
        </li>
      ));
    } else {
      // If it's neither array nor string, return empty array
      return [];
    }
  };
  const [showToast, setShowToast] = useState(false);
  const [applicants, setApplicants] = useState([]); // State for storing applicants
  const [toast, setToast] = useState(null);

  const Toast = ({ message, type, onClose }) => {
    const toastColors = {
      success:
        "bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100",
      error:
        "bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100",
    };

    return (
      <div
        role="alert"
        className={`fixed bottom-9 right-8 p-4 rounded-lg flex items-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105 z-50 ${toastColors[type]}`}
      >
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 flex-shrink-0 mr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
        <p className="text-sm font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  };
  const SuccessToast = () => (
    <div
      role="alert"
      className="fixed bottom-9 right-8 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 p-4 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 transform hover:scale-105 z-50"
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 flex-shrink-0 mr-2 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 13l4 4L19 7"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">Job deleted successfully!</p>
    </div>
  );

  if (selectedJob) {
    const { isDarkMode } = useDarkMode(); // Use the isDarkMode context

    const handleEditJob = async (jobId, updatedJobData) => {
      if (!jobId) {
        console.error("Job ID is undefined. Cannot proceed with updating.");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        // Map `role` to `title` and ensure `requirements` is a string
        const { role, requirements, ...rest } = updatedJobData;
        const formattedJobData = {
          ...rest,
          title: role, // Map `role` to `title`
          requirements: Array.isArray(requirements)
            ? requirements.join("\n")
            : requirements, // Convert array to string
        };

        const response = await fetch(
          `${API_URL}/api/recruiters/jobs/${jobId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedJobData), // Send updated job data in the request body
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update job");
        }

        const updatedJob = await response.json();

        // Update the job in local state
        setAllJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === jobId ? updatedJob.job : job))
        );

        // Show toast
        setToast({ message: "Job updated successfully!", type: "success" });

        // Clear selected job after short delay (e.g., close a modal)
        setTimeout(() => {
          setShowToast(false);
          setSelectedJob(null); // Exit the "selectedJob" view/modal
        }, 2000); // 2 seconds is enough for toast
      } catch (error) {
        console.error("Error updating job:", error.message);

        // Optional: Display error message to the user
        alert(`Failed to update job: ${error.message}`);
      }
    };
    const handleDeleteJob = async (jobId) => {
      if (!jobId) {
        console.error("Job ID is undefined. Cannot proceed with deletion.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/api/recruiters/jobs/${jobId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete job");
        }

        // Remove job from local state
        setAllJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

        // Show toast

        // Clear selected job after short delay (e.g., close a modal)
        setTimeout(() => {
          setShowToast(false);
          setSelectedJob(null); // Exit the "selectedJob" view/modal
        }, 1200); // 2 seconds is enough for toast
      } catch (error) {
        console.error("Error deleting job:", error.message);
      }
    };
    const fetchApplicants = async (jobId) => {
      if (!jobId) {
        console.error("Missing jobId or token");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/recruiters/jobs/${jobId}/applicants`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching applicants:", errorData.message);
          return;
        }

        const applicantsData = await response.json();
        setApplicants(applicantsData); // Update state
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    };

    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        } p-6`}
      >
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedJob(null)}
            className="inline-flex items-center mb-6 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Jobs
          </button>
          {showToast && <SuccessToast />}
          <div
            className={`rounded-lg shadow-md overflow-hidden border ${
              isDarkMode
                ? "bg-black border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header section */}
            <div
              className={`p-6 border-b ${
                isDarkMode ? "border-gray-700 bg-black" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center">
                  <div
                    className={`h-14 w-14 rounded-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    {selectedJob.category === "Engineering" ? (
                      <JobCategoryIcon category="Engineering" size="md" />
                    ) : selectedJob.logo ? (
                      <div
                        className={`flex items-center justify-center h-full w-full rounded-lg ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        {selectedJob.logo}
                      </div>
                    ) : (
                      <JobCategoryIcon
                        category={selectedJob.category || "Default"}
                        size="md"
                      />
                    )}
                  </div>
                  <div>
                    <h1
                      className={`text-2xl ml-5 font-bold ${
                        isDarkMode ? "text-white" : "text-gray-800 "
                      }`}
                    >
                      {selectedJob.title}
                    </h1>
                    <div className="flex flex-wrap items-center mt-2 ml-3 gap-4 ">
                      <span
                        className={`${
                          isDarkMode ? "text-gray-300 " : "text-gray-600 "
                        }`}
                      >
                        <span className="text-gray-400 mx-2">•</span>
                        {selectedJob.companyName}
                      </span>

                      <span
                        className={`flex items-center ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                                                <span className="text-gray-400 mx-2">•</span>

                        {selectedJob.location}
                      </span>
                      <span
                        className={`flex items-center ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <MapPin
                          className={`h-4 w-4 mx-2 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        {selectedJob.place}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recruiter actions */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0 ">
                  <button
                    onClick={() => openEditModal(selectedJob)}
                    className={`flex items-center ${
                      isDarkMode
                        ? "bg-blue-900/30 hover:bg-blue-800/50 text-blue-400"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                    } px-4 py-2 rounded-md transition-colors`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>

                  {isEditModalOpen && (
                    <div
                      className={`fixed inset-0 flex items-center justify-center z-50 ${
                        isDarkMode
                          ? "bg-black bg-opacity-70 text-white"
                          : "bg-black bg-opacity-50 text-black"
                      }`}
                    >
                      <div
                        className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 ${
                          isDarkMode
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold dark:text-white">
                            Edit Job
                          </h2>
                          <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditJob(selectedJob._id, editFormData);
                            setIsEditModalOpen(false);
                          }}
                        >
                          <div className="space-y-4">
                            {/* Job Title */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                {" "}
                                Job Title
                              </label>
                              <input
                                type="text"
                                value={editFormData.role}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    role: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Company Name */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Company Name
                              </label>
                              <input
                                type="text"
                                value={editFormData.companyName}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    companyName: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Location */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Location
                              </label>
                              <input
                                type="text"
                                value={editFormData.location}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    location: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>
<div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Place
                              </label>
                              <input
                                type="text"
                                value={editFormData.place}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                   place: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>
                            {/* Description */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Description
                              </label>
                              <textarea
                                value={editFormData.description}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    description: e.target.value,
                                  })
                                }
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Requirements - Assuming it's a string for simplicity, adjust if it's an array */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Requirements (separate with new lines)
                              </label>
                              <textarea
                                value={
                                  Array.isArray(editFormData.requirements)
                                    ? editFormData.requirements.join("\n")
                                    : editFormData.requirements
                                }
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    requirements: e.target.value.split("\n"),
                                  })
                                }
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Salary */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Salary Range
                              </label>
                              <input
                                type="text"
                                value={editFormData.salary}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    salary: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Category */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Category
                              </label>
                              <select
                                value={editFormData.category}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    category: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              >
                                <option value="">Select Category</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="Customer Support">
                                  Customer Support
                                </option>
                                <option value="Human Resources">
                                  Human Resources
                                </option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                                <option value="Product">Product</option>
                                <option value="Legal">Legal</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            {/* Job Type */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Job Type
                              </label>
                              <select
                                value={editFormData.jobType}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    jobType: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              >
                                <option value="">Select Job Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Temporary">Temporary</option>
                                <option value="Remote">Remote</option>
                              </select>
                            </div>

                            {/* Experience Level */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Experience Level
                              </label>
                              <select
                                value={editFormData.experienceLevel}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    experienceLevel: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                              >
                                <option value="">
                                  Select Experience Level
                                </option>
                                <option value="Entry-level">Entry-level</option>
                                <option value="Mid-level">Mid-level</option>
                                <option value="Senior">Senior</option>
                                <option value="Executive">Executive</option>
                              </select>
                            </div>

                            {/* Skills */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Skills (comma separated)
                              </label>
                              <input
                                type="text"
                                value={
                                  Array.isArray(editFormData.skills)
                                    ? editFormData.skills.join(", ")
                                    : editFormData.skills
                                }
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    skills: e.target.value
                                      .split(",")
                                      .map((skill) => skill.trim()),
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Deadline */}
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  isDarkMode ? "text-zinc-400" : "text-gray-700"
                                }`}
                              >
                                Deadline
                              </label>
                              <input
                                type="date"
                                value={
                                  editFormData.deadline
                                    ? new Date(editFormData.deadline)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    deadline: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                                  isDarkMode
                                    ? "bg-zinc-950 text-white border-zinc-700"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                required
                              />
                            </div>
                          </div>

                          <div className="flex justify-end mt-6 gap-3">
                            <button
                              type="button"
                              onClick={() => setIsEditModalOpen(false)}
                              className={`px-4 py-2 rounded-md transition-colors ${
                                isDarkMode
                                  ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!selectedJob?._id) {
                        console.error("Error: No job selected for deletion.");
                        return;
                      }

                      handleDeleteJob(selectedJob._id);
                    }}
                    className={`flex items-center ${
                      isDarkMode
                        ? "bg-red-900/30 hover:bg-red-800/50 text-red-400"
                        : "bg-red-50 hover:bg-red-100 text-red-600"
                    } px-4 py-2 rounded-md transition-colors`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>

                  <button
                    className={`border ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-700 text-gray-400"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    } p-2 rounded-md transition-colors`}
                    aria-label="Share job"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 ${
                    isDarkMode ? "0 text-purple-300" : " text-purple-700"
                  } rounded-full text-sm font-medium`}
                >
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  {selectedJob.salary}
                </span>
                {selectedJob.jobType && (
                  <span
                    className={`inline-flex items-center px-3 py-1 ${
                      isDarkMode ? " text-blue-300" : " text-blue-700"
                    } rounded-full text-sm font-medium`}
                  >
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {selectedJob.jobType}
                  </span>
                )}
                {selectedJob.experienceLevel && (
                  <span
                    className={`inline-flex items-center px-3 py-1 ${
                      isDarkMode ? " text-blue-300" : " text-blue-700"
                    } rounded-full text-sm font-medium`}
                  >
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {selectedJob.experienceLevel}
                  </span>
                )}

                <span
                  className={`inline-flex items-center px-3 py-1 ${
                    isDarkMode ? " text-green-300" : " text-green-700"
                  } rounded-full text-sm font-medium`}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Added at{" "}
                  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 ${
                    isDarkMode ? " text-red-300" : " text-red-700"
                  } rounded-full text-sm font-medium`}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  DeadLine {new Date(selectedJob.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-6">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-500" />
                    About The Role
                  </h2>
                  <div
                    className={`  ${
                      isDarkMode ? "border-gray-700 " : "border-gray-200 "
                    } rounded-lg p-5 border`}
                  >
  <div className="prose prose-sm max-w-none dark:prose-invert">
    {selectedJob.description.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-3 leading-relaxed">
        {paragraph}
      </p>
    ))}
  </div>

                  </div>
                </section>

                <section>
                  <h2
                    className={`text-xl font-semibold mb-4 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    } flex items-center gap-2`}
                  >
                    {" "}
                    <CheckSquare className="h-5 w-5 mr-2 text-purple-500" />
                    Job Requirements
                  </h2>
                  <div
                    className={`  ${
                      isDarkMode ? "border-gray-700 " : "border-gray-200 "
                    } rounded-lg p-5 border`}
                  >
                    <ul className="space-y-3">
                      {renderRequirements(selectedJob.requirements)}
                    </ul>
                  </div>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode
                            ? "bg-purple-900/30 text-purple-300"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
                {selectedJob && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-purple-500" />
                      Job Applicants
                    </h2>

                    <div
                      className={`border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } rounded-lg p-5`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <p className="font-medium">
                          {applicants.length} Total Applicants
                        </p>
                        <button
                          onClick={() => fetchApplicants(selectedJob?._id)}
                          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm border transition-all duration-200 group
            ${
              isDarkMode
                ? "bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 border-zinc-700"
                : "bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 border-zinc-200"
            }`}
                        >
                          <RefreshCw
                            size={14}
                            className="transform group-hover:rotate-90 transition-transform"
                          />
                          <span>Refresh Applicants</span>
                        </button>
                      </div>

                      {applicants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <UserX className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                          <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                            No applicants yet
                          </h3>
                          <p className="mt-2 max-w-sm text-gray-500 dark:text-gray-400">
                            Applicants will appear here once they apply for this
                            position
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {applicants.map((applicant, index) => (
                            <div
                              key={index}
                              className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
                                isDarkMode
                                  ? "border-gray-700 bg-gray-800/30 hover:bg-gray-800/50"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="flex items-center">
                                  <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                      isDarkMode
                                        ? "bg-purple-900/40 text-purple-300"
                                        : "bg-purple-100 text-purple-600"
                                    }`}
                                  >
                                    <User className="h-6 w-6" />
                                  </div>
                                  <div className="ml-4">
                                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                                      {applicant.name}
                                    </h3>
                                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                      <Mail className="mr-1.5 h-4 w-4" />
                                      {applicant.email}
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">
                                  Applied{" "}
                                  {new Date(
                                    applicant.appliedDate
                                  ).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                                  <Phone className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {applicant.phone}
                                  </span>
                                </div>

                                <a
                                  href={applicant.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center rounded-lg p-3 transition-colors ${
                                    isDarkMode
                                      ? "bg-blue-900/20 text-blue-300 hover:bg-blue-900/30"
                                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                  }`}
                                >
                                  <FileText className="h-5 w-5 mr-3" />
                                  <span className="font-medium">
                                    View Resume
                                  </span>
                                  <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                              </div>

                              <div className="mt-5 flex flex-wrap justify-end gap-3">
                              <button
  className={`flex items-center rounded-lg px-4 py-2 font-medium transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  }`}
  onClick={() => navigate("/dashboard/recuiter/appliedcandidates")}
>
<User className="mr-2 h-4 w-4" /> 
View
</button>
                                
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>
            
              <div className="md:col-span-1">
                <div
                  className={`rounded-lg p-5 sticky top-6shadow-md overflow-hidden border ${
                    isDarkMode
                      ? "bg-black border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3 className="font-semibold  mb-4 text-lg flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-500" />
                    Job Details
                  </h3>
                  <div
                    className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border  ${
                      isDarkMode
                        ? "bg-black border-gray-700 text-white"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Category
                    </h4>
                    <div className="flex items-center">
                      {selectedJob.category === "Engineering" ? (
                        <JobCategoryIcon category="Engineering" size="xs" />
                      ) : selectedJob.logo ? (
                        <div className=" bg-gray-100 dark:bg-black  ">
                          {selectedJob.logo}
                        </div>
                      ) : (
                        <JobCategoryIcon
                          category={selectedJob.category || "Default"}
                          size="xs"
                        />
                      )}
                      <p
                        className={`font-medium ${
                          isDarkMode
                            ? "bg-black border-gray-700 text-white"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {selectedJob.category}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5 mt-5">
                    <div
                      className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                        isDarkMode
                          ? "bg-black border-gray-700 text-white"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Location
                      </h4>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                        <p
                          className={`font-medium ${
                            isDarkMode
                              ? "bg-black border-gray-700 text-white"
                              : "bg-white border-gray-200"
                          }`}
                        >
 {selectedJob.place}                        </p>
                      </div>
                    </div>
                      
                    
 
                    <div
                      className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                        isDarkMode
                          ? "bg-black border-gray-700 text-white"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Salary Range
                      </h4>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                        <p
                          className={`font-medium ${
                            isDarkMode
                              ? " border-gray-700 text-green-500"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {selectedJob.salary}
                        </p>
                      </div>
                    </div>

                    {selectedJob.department && (
                      <div
                        className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                          isDarkMode
                            ? "bg-black border-gray-700 text-white"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Department
                        </h4>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-purple-500 mr-2" />
                          <p className="font-medium text-gray-700 dark:text-gray-200">
                            {selectedJob.department}
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                        isDarkMode
                          ? "bg-black border-gray-700 text-white"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <h4
                        className={`text-sm mb-2 ${
                          isDarkMode
                            ? "bg-black border-gray-700 text-white"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        Listing Status
                      </h4>
                      <button
                        onClick={() => handleJobStatus(selectedJob._id)}
                        className={`w-full py-2 px-4 rounded-md text-center font-medium flex items-center justify-center transition-colors ${
                          selectedJob.status === "active"
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
                            : selectedJob.status === "paused"
                            ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60"
                            : "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800/60"
                        }`}
                      >
                        {selectedJob.status == "active" ? (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Active Listing
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 mr-2" />
                            Inactive Listing
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-900";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex h-screen bg-white dark:bg-black">
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black border-gray-200 dark:border-gray-800
           transition-all duration-300 ease-in-out z-30
            ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50  dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-900 sticky top-0 transition-all duration-300 ease-in-out z-30 ">
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
          <div className="p-6 bg-gray-50 dark:bg-black min-h-screen">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold">
                    Manage Your Job Listings
                  </h1>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group"
                    aria-label="Add New Job"
                  >
                    <Plus
                      size={14}
                      className="transform group-hover:scale-110 transition-transform"
                    />
                    <span>Add New Job</span>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  View, edit, or delete the jobs you've posted. Keep your
                  listings up-to-date to attract the best talent.
                </p>

                {/* Search and stats bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search jobs by title, skills or location..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Total:
                        </span>
                        <span className="ml-1 font-semibold">
                          {filteredJobs.length} jobs
                        </span>
                      </div>
                      
                    </div>
                    {/* Filter button for mobile */}
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-900"
                    >
                      <Filter size={18} />
                      <span>Filters</span>
                      {isFilterOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Filters panel - hidden on mobile unless toggled */}
                <div
                  className={`w-full md:w-1/4 order-2 md:order-2 ${
                    isFilterOpen ? "block" : "hidden md:block"
                  }`}
                >
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 sticky top-4">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h2 className="font-semibold text-lg flex items-center">
                        <Filter size={18} className="mr-2" />
                        Filters
                      </h2>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-gray-500 md:hidden"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-5 space-y-6">
                      {/* Job Type Filter */}
                      <div>
                        <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                          Job Type
                        </h3>
                        <div className="space-y-3">
                          {["fullTime", "partTime", "contract"].map((type) => (
                            <label
                              key={type}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={filters[type]}
                                onChange={() => handleFilterChange(type)}
                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-5 w-5"
                              />
                              <span className="ml-3 text-gray-700 dark:text-gray-300">
                                {type === "fullTime"
                                  ? "Full Time"
                                  : type === "partTime"
                                  ? "Part Time"
                                  : "Contract"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Salary Range Filter */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                          Salary Range
                        </h3>
                        <div className="space-y-3">
                          {[
                            { id: "salary50_100", label: "$50k - $100k" },
                            { id: "salary100_150", label: "$100k - $150k" },
                            { id: "salary150Plus", label: "$150k+" },
                          ].map((range) => (
                            <label
                              key={range.id}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={filters[range.id]}
                                onChange={() => handleFilterChange(range.id)}
                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-5 w-5"
                              />
                              <span className="ml-3 text-gray-700 dark:text-gray-300">
                                {range.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Location Filter */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">
                          Location
                        </h3>
                        <div className="space-y-3">
                          {["remote", "onsite", "hybrid"].map((loc) => (
      <label
        key={loc}
        className="flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          checked={filters[loc]}
          onChange={() => handleFilterChange(loc)}
          className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-5 w-5"
        />
        <span className="ml-3 text-gray-700 dark:text-gray-300">
          {loc.charAt(0).toUpperCase() + loc.slice(1)}
        </span>
      </label>
    ))}
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                        <button
                          onClick={clearFilters}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
                        >
                          Clear all
                        </button>
                        <button className="px-4 py-2 bg-zinc-100 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group">
                          {" "}
                          Apply filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Listings - Main content area */}
                <div className="w-full md:w-3/4 order-1 md:order-1">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold">
                          Your Job Listings
                        </h2>
                        <div className="ml-2 px-2 py-1 bg-gray-100 dark:bg-zinc-900 rounded-full text-sm">
                          {filteredJobs.length}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Sort by:
                        </span>
                        <select className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                          <option>Newest</option>
                          <option>Oldest</option>
                          <option>Most Applications</option>
                          <option>Status</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4">
                      {loading ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                      ) : error ? (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <p className="text-red-600 dark:text-red-400 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {error}
                          </p>
                        </div>
                      ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                          <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium">No jobs found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                            Try adjusting your filters or create your first job
                            listing.
                          </p>

                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="   px-4 py-2 rounded-lg flex items-center gap-2 font-medium mx-auto transition-colors bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700  text-sm  duration-200  shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group"
                            aria-label="Add New Job"
                          >
                            <Plus
                              size={14}
                              className="transform group-hover:scale-110 transition-transform"
                            />
                            <span>Add New Job</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredJobs.map((job) => (
                            <div
                              key={job._id}
                              className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all group overflow-hidden cursor-pointer"
                              onClick={() => setSelectedJob(job)}
                            >
                              <div className="relative">
                                {/* Status indicator */}
                                <div
                                  className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(
                                    job.status
                                  )}`}
                                ></div>

                                <div className="flex items-center p-5 pl-6">
                                  <div className="mr-4 w-14 h-14 flex items-center justify-center text-2xl">
                                    {job.category === "Engineering" ? (
                                      <JobCategoryIcon
                                        category="Engineering"
                                        size="md"
                                      />
                                    ) : job.logo ? (
                                      <div
                                        className={`p-3 rounded-lg w-full h-full flex items-center justify-center ${
                                          isDarkMode
                                            ? "bg-gray-800"
                                            : "bg-gray-100"
                                        }`}
                                      >
                                        {" "}
                                        {job.logo}
                                      </div>
                                    ) : (
                                      <JobCategoryIcon
                                        category={job.category || "Default"}
                                        size="md"
                                      />
                                    )}
                                  </div>

                                  <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                        {job.company ||
                                          job.companyName ||
                                          "Company"}
                                      </h3>

                                      {job.featured && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center">
                                          <Star size={10} className="mr-1" />{" "}
                                          Featured
                                        </span>
                                      )}

                                      {job.new && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                          New
                                        </span>
                                      )}

                                      <span
                                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClasses(
                                          job.status
                                        )}`}
                                      >
                                        {job.status === "active"
                                          ? "Active"
                                          : job.status === "paused"
                                          ? "Paused"
                                          : "Expired"}
                                      </span>
                                    </div>

                                    <h2 className="text-lg font-semibold group-hover:text-blue-500 dark:group-hover:text-purple-400 transition-colors">
                                      {job.title || "Position"}
                                    </h2>

                                    {job.category && (
                                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                        {job.category}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-3">
                                     
 {job.place && (
                                        <div className="flex items-center text-sm text-blue-700 dark:text-blue-300 font-medium px-2 py-0.5 rounded-full">
                                          <MapPin size={14} className="mr-1" />
                                          <span>{job.place}</span>
                                        </div>
                                      )}

                                      {job.salary && (
                                        <div className="flex items-center text-sm text-green-700 dark:text-green-300 font-medium px-2 py-0.5 rounded-full">
                                          <DollarSign
                                            size={14}
                                            className="mr-1"
                                          />
                                          <span>{job.salary}</span>
                                        </div>
                                      )}

                                      {job.jobType && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                          <Briefcase
                                            size={14}
                                            className="mr-1"
                                          />
                                          <span>{job.jobType}</span>
                                        </div>
                                      )}

                                      {job.deadline && (
                                        <div className="flex items-center text-sm text-red-500 dark:text-red-300 font-medium px-2 py-0.5 rounded-full">
                                          <Clock size={14} className="mr-1" />
                                          <span>
                                            Deadline: {formatDate(job.deadline)}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="ml-4 flex flex-col items-end">
                                    {job.location && (
                                        <div className="flex items-center text-sm text-blue-400 dark:text-blue-300 font-medium px-2 pb-4 rounded-full">
                                          <span>{job.location}</span>
                                        </div>
                                      )}

                                    {job.applicationCount !== undefined && (
                                      <div className="text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-1 rounded-full mb-2">
                                        {job.applicationCount} Applicants
                                      </div>
                                    )}

                                    <button
                                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group"
                                      aria-label="View Details"
                                    >
                                      <span>View Details</span>
                                      <ArrowRight
                                        size={14}
                                        className="transform group-hover:translate-x-1 transition-transform"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {filteredJobs.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Showing <span className="font-medium">1</span> to{" "}
                          <span className="font-medium">
                            {filteredJobs.length}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {filteredJobs.length}
                          </span>{" "}
                          results
                        </div>
                        <div className="flex">
                          <button
                            disabled
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-l-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                          >
                            Previous
                          </button>
                          <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 border-l-0 bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 font-medium">
                            1
                          </button>
                          <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-r-md border-l-0 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AddJobForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Jobs;
