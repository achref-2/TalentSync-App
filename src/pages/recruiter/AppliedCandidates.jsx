import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Menu,
  Settings,
  CreditCard,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Calendar,
  Wrench,
  LogOut,
  DollarSign,
  Users,
  Linkedin,
  Building2,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Clock,
  Filter,
  X,
  CheckCircle,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { jsPDF } from "jspdf";

import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDarkMode } from "../../components/DarkModeProvider";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { toast } from "react-toastify";
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
const AppliedCandidatesContent = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("appliedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedCandidateId, setExpandedCandidateId] = useState(null);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("interview_scheduled");

  // First, add a new state to track the selected candidate
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  // Add this helper function to format LinkedIn URLs properly
  const formatLinkedInUrl = (url) => {
    if (!url) return "#";

    // Check if URL already has http/https protocol
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Check if URL is just a LinkedIn username/path
    if (url.includes("linkedin.com")) {
      return `https://${url}`;
    }

    // If it's just a username or partial path
    if (url.startsWith("in/") || url.match(/^[a-zA-Z0-9-]+$/)) {
      return `https://www.linkedin.com/${
        url.startsWith("in/") ? "" : "in/"
      }${url}`;
    }

    // Default - add https protocol
    return `https://${url}`;
  };
  // Modify the openModal function to take a candidate parameter
  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  // Update the closeModal function
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
    // Reset form fields
    setReason("");
    setInterviewDate("");
    setInterviewTime("");
    setMeetLink("");
  };

  // Update the handleStatusUpdate function to use the selected candidate

  // Update handleSubmitInterview to include the candidate's information
  // ...existing code...
  const handleSubmitInterview = async (e) => {
    e.preventDefault();

    if (!selectedCandidate) {
      console.error("No candidate selected");
      return;
    }

    try {
      // Validate form fields
      if (!reason) {
        alert("Please specify a reason for contact");
        return;
      }

      // If status is not "Reject", require interview date/time
      if (selectedStatus !== "Reject" && (!interviewDate || !interviewTime)) {
        alert("Please set both date and time for the interview");
        return;
      }

      // Prepare interview details for API
      const interviewDetails = {
        candidateId: selectedCandidate.id,
        applicationId: selectedCandidate.applicationId,
        reason: reason,
        interviewDate: interviewDate,
        interviewTime: interviewTime,
        meetLink: meetLink || "To be provided",
        candidateEmail: selectedCandidate.email,
        candidateName: selectedCandidate.name,
        jobTitle: selectedCandidate.appliedJob?.title || "Job position",
      };

      // If status is "Reject", just update status and skip scheduling
      if (selectedStatus === "Reject") {
        await updateApplicationStatus(
          selectedCandidate.applicationId,
          "Reject"
        );
        toast.success(
          `Candidate ${selectedCandidate.name} has been rejected.`,
          {
            position: "bottom-right",
            autoClose: 5000,
          }
        );
        closeModal();
        fetchAppliedCandidates();
        return;
      }

      // Schedule interview via backend API
      const response = await fetch(
        API_URL + "/api/recruiters/interviews/schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(interviewDetails),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to schedule interview");
      }

      toast.success(
        `Interview scheduled with ${selectedCandidate.name} on ${interviewDate} at ${interviewTime}`,
        { position: "bottom-right", autoClose: 5000 }
      );

      // Optionally update status to "Review" if not already set by backend
      // await updateApplicationStatus(selectedCandidate.applicationId, "Review");

      closeModal();
      fetchAppliedCandidates();
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };
  // ...existing code...
  useEffect(() => {
    fetchAppliedCandidates();
  }, []);
  const fetchAppliedCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        API_URL + "/api/recruiters/candidates/applied",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 404) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      // Get the response text
      const text = await response.text();

      try {
        // Check if the response starts with "Raw response text:" and handle accordingly
        const jsonText = text.startsWith("Raw response text:")
          ? text.substring("Raw response text:".length).trim()
          : text;

        // Parse the JSON data
        const data = JSON.parse(jsonText);

        // Transform and map the data using the new structure
        const sanitizedCandidates = data
          .map((candidate) => {
            if (!candidate) return null;

            // Log the raw score object to see its structure
            console.log(
              `Score for candidate ${candidate.name}:`,
              candidate.score
            );

            // Extract data from the new structured response
            return {
              id: candidate.id || "",
              applicationId: candidate.applicationId || "",
              name: candidate.name || "Unknown",
              email: candidate.email || "Not provided",
              phone: candidate.personalInfo?.phone || "Not provided",
              location: cleanLocationField(
                candidate.backendData?.result?.contacts?.location ||
                  candidate.personalInfo?.location ||
                  ""
              ),
              profilePic:
                candidate.profilePic || "../../assets/images/avatar.jpg",

              // Personal info
              linkedIn:
                candidate.personalInfo?.linkedIn ||
                candidate.linkedIn ||
                "Not provided",
              github: candidate.personalInfo?.github || "Not provided",
              summary: candidate.personalInfo.summary || "Not provided",
              city: candidate.personalInfo?.city || "Not provided",
              position: candidate.personalInfo?.position || "Not provided",

              // Skills and qualifications
              skills: Array.isArray(candidate.skills)
                ? candidate.skills.join(", ")
                : candidate.skillsString || "Not provided",
              certifications: candidate.certificationsString || "Not provided",
              languages: Array.isArray(candidate.languages)
                ? candidate.languages.join(", ")
                : "Not provided",
              activities: Array.isArray(candidate.activities)
                ? candidate.activities.join(", ")
                : "Not provided",

              // Education and experience
              education: candidate.educationString || "Not provided",
              experience: candidate.experienceString || "Not provided",

              // Detailed education and experience objects for advanced display
              educationDetails: candidate.education || [],
              experienceDetails: candidate.experience || [],

              // Cover letter
              coverLetter: candidate.coverLetterText || "Not provided",
              coverLetterPdf: candidate.coverLetterPdf || {
                content: "Not provided",
                type: "pdf",
              },

              // Analysis and CV history
              latestAnalysis: candidate.latestAnalysis || {},
              cvHistory: candidate.cvHistory || [],

              // Job application details
              appliedJob: {
                id: candidate.appliedJob?.id || "",
                title: candidate.appliedJob?.title || "Unknown",
                location: candidate.appliedJob?.location || "Not provided",
                salary: candidate.appliedJob?.salary || "Not provided",
                jobType: candidate.appliedJob?.jobType || "Not specified",
                requirements:
                  candidate.appliedJob?.requirements || "Not provided",
                deadline: candidate.appliedJob?.deadline
                  ? new Date(candidate.appliedJob.deadline).toLocaleDateString()
                  : "No deadline",
                companyName:
                  candidate.appliedJob?.companyName || "Not provided",
                skills: candidate.appliedJob?.skillsString || "Not provided",
                description:
                  candidate.appliedJob?.description || "Not provided",
              },

              // Application metadata
              appliedAt: candidate.appliedAt
                ? new Date(candidate.appliedAt).toLocaleString()
                : "Unknown",
              status: candidate.status || "Pending",

              // Score - properly handle the Application's score structure
              score: {
                skillsMatch: candidate.score?.skillsMatch || 0,
                experienceMatch: candidate.score?.experienceMatch || 0,
                overallMatch: candidate.score?.overallMatch || 0,
              },

              // For display - use overallMatch as the main score
              scoreDisplay: candidate.score?.overallMatch || 0,

              // Additional data
              userId: candidate.userId || "",
              pinnedJobs: candidate.pinnedJobs || [],
            };
          })
          .filter(Boolean); // Remove any null entries

        setCandidates(sanitizedCandidates);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError, "Response text:", text);
        throw new Error("Invalid JSON response received: " + jsonError.message);
      }
    } catch (err) {
      console.error("Error fetching applied candidates:", err);
      setError("Failed to load applied candidates: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter((candidate) => {
      // Filter by search term
      const searchFields = [
        candidate.name,
        candidate.email,
        candidate.skills,
        candidate.appliedJob.title,
        candidate.location,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        searchTerm === "" || searchFields.includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === "all" ||
        candidate.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "appliedAt") {
        comparison = new Date(a.appliedAt) - new Date(b.appliedAt);
      } else if (sortBy === "score") {
        comparison = a.score.overallMatch - b.score.overallMatch;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const toggleExpandCandidate = (id) => {
    setExpandedCandidateId(expandedCandidateId === id ? null : id);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      reject: "bg-red-100 text-red-800 border-red-200",
      approve: "bg-green-100 text-green-800 border-green-200",
      shortlisted: "bg-green-100 text-green-800 border-green-200",
      review: "bg-orange-100 text-orange-900 border-orange-200",
      hired: "bg-blue-100 text-blue-800 border-blue-200",
      interviewing: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return statusMap[status.toLowerCase()] || " text-gray-800 border-gray-200";
  };
  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 dark:bg-zinc-950  dark:border-zinc-900 dark:text-red-400 text-red-800 border-red-200";
  };

  const AddJobForm = ({ onClose }) => {
    const { isDarkMode } = useDarkMode();
    const [activeStep, setActiveStep] = useState(1); // For multi-step form
    const [jobDetails, setJobDetails] = useState({
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
        if (!jobDetails.salary)
          errors.salary = "Salary information is required";
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
          salary: jobDetails.salary,
          jobType: jobDetails.type,
          description: jobDetails.description,
          requirements: jobDetails.requirements,
          skills: jobDetails.skills,
          category: jobDetails.category,
          deadline: jobDetails.deadline || undefined,
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

          setSuccessMessage(
            "Job posted successfully! Candidates can now apply."
          );

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
          });

          // Show success message for 2 seconds before closing
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
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
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={jobDetails.location}
                    onChange={handleChange}
                    className={getInputClassName("location")}
                    placeholder="e.g. BIZERTE, MONTREAL or ..."
                  />
                  {validationErrors.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.location}
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
                      <option value="Internship">Internship</option>
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
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const validStatuses = [
        "Pending",
        "Accepted",
        "Rejected",
        "Review",
        "Approve",
        "Reject",
      ];

      const normalizedStatus = validStatuses.find(
        (status) => status.toLowerCase() === newStatus.toLowerCase()
      );

      if (!normalizedStatus) {
        alert("Invalid status value. Please provide a valid status.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/applications/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: normalizedStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      alert(`Status updated to ${normalizedStatus} successfully!`);
      // Optionally, refresh the candidates list or update the UI
      fetchAppliedCandidates();
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update status. Please try again.");
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetLink, setMeetLink] = useState("");

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
  function cleanEducationField(educationRaw) {
    if (!educationRaw) return "";
    let cleaned = educationRaw
      .split("**Certifications:**")[0]
      .split("**Activities:**")[0]
      .split("**Current/Most Recent Position:**")[0];

    // Remove trailing unwanted club/activity/certification lines if present
    cleaned = cleaned.replace(/at N\/A \(N\/A\).*$/s, "");
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
  return (
    <div className="space-y-6">
      {/* Header with title and export button */}

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search candidates by name, email, skills or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="review"> Review</option>
              <option value="approve">Accepted</option>
              <option value="reject">Rejected</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-400" />
            </div>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-");
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="pl-10 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="appliedAt-desc">Newest First</option>
              <option value="appliedAt-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-red-800 dark:bg-red-900/20 dark:border-red-700/30 dark:text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && candidates.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full">
            <Briefcase size={40} className="text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">
            No applications yet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-md">
            You haven't received any applications for your posted jobs.
            Applications will appear here when candidates respond.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-black dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white rounded-md font-medium transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              Post another job
            </button>
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
              onClick={() =>
                (window.location.href = import.meta.env.BASE_URL + "dashboard/recuiter/joblist")
              }
            >
              View my jobs
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      {!loading && filteredCandidates.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      )}

      {/* Candidates list */}
      {!loading && filteredCandidates.length > 0 && (
        <div className="grid gap-4">
          {filteredCandidates.map((candidate, index) => (
            <div
              key={candidate.id || index}
              className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
            >
              {/* Card header - always visible */}
              <div
                className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 "
                onClick={() => toggleExpandCandidate(candidate.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar placeholder */}
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <User size={24} />
                  </div>

                  {/* Basic candidate info */}
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                      {(candidate.name || "").replace(/\*\*/g, "")}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {(candidate.email || "").replace(/\*\*/g, "")}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Phone size={14} className="mr-1 flex-shrink-0" />
                        <span>
                          {(candidate.phone || "").replace(/\*\*/g, "")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* Job title and skills indicator */}
                      <div className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-800/30 flex items-center">
                        <Briefcase size={12} className="mr-1" />
                        {candidate.appliedJob.title}
                      </div>

                      {/* Status badge */}
                      <div
                        className={`text-sm px-2 py-1 rounded-md border flex items-center ${getStatusColor(
                          candidate.status
                        )}`}
                        aria-label={`Status: ${candidate.status}`}
                        title={`Status: ${candidate.status}`}
                      >
                        {candidate.status.charAt(0).toUpperCase() +
                          candidate.status.slice(1)}
                      </div>

                      {/* Score badge */}
                      <div
                        className={`text-sm px-2 py-1 rounded-md border flex items-center ${getScoreBadgeColor(
                          candidate.score.overallMatch
                        )}`}
                      >
                        <Star size={12} className="mr-1" />
                        Score: {Math.round(candidate.score.overallMatch)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applied date and expand indicator */}
                <div className="flex items-center justify-between mt-4 md:mt-0">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mr-4">
                    <Calendar size={14} className="mr-1" />
                    <span>Applied: {candidate.appliedAt}</span>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedCandidateId === candidate.id ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Expanded content */}
              {expandedCandidateId === candidate.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Candidate details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Candidate Details
                      </h4>
                      {/* Candidate Summary */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Summary
                        </h5>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {candidate.latestAnalysis?.contacts?.summary &&
                            candidate.latestAnalysis.contacts.summary !==
                              "Not provided"
                              ? candidate.latestAnalysis.contacts.summary.replace(
                                  /\*\*/g,
                                  ""
                                )
                              : candidate.summary &&
                                candidate.summary !== "Not provided"
                              ? candidate.summary.replace(/\*\*/g, "")
                              : candidate.personalInfo?.summary &&
                                candidate.personalInfo.summary !==
                                  "Not provided"
                              ? candidate.personalInfo.summary.replace(
                                  /\*\*/g,
                                  ""
                                )
                              : candidate.latestAnalysis?.raw_analysis
                              ? parseSummarySection(
                                  candidate.latestAnalysis.raw_analysis,
                                  true
                                )
                              : "No summary available"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <Award size={14} className="mr-1 flex-shrink-0" />
                              <span>
                                {candidate.experience?.split(", - ").length ||
                                  0}{" "}
                                experience entries
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <Briefcase
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span>
                                {candidate.position || "No current position"}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <MapPin
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span>{candidate.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact info */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Contact Information
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Mail size={14} className="mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {(candidate.email || "").replace(/\*\*/g, "")}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone size={14} className="mr-1 flex-shrink-0" />
                            <span>
                              {(candidate.phone || "").replace(/\*\*/g, "")}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Linkedin
                              size={14}
                              className="mr-1 flex-shrink-0"
                            />
                            <a
                              href={formatLinkedInUrl(
                                candidate.linkedIn ||
                                  candidate.resumeAnalysis?.contactInfo
                                    ?.linkedin
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              LinkedIn Profile
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Skills
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills &&
                          candidate.skills !== "Not provided" ? (
                            candidate.skills
                              .split("; ")
                              .flatMap((skillGroup) => {
                                const [category, skillsList] =
                                  skillGroup.split(": ");
                                if (!skillsList)
                                  return [category].filter(
                                    (s) => s && s.trim() !== ""
                                  );
                                return skillsList
                                  .split(", ")
                                  .map((skill) => skill.trim())
                                  .filter(Boolean);
                              })
                              .map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded border border-blue-100 dark:border-blue-800/30"
                                >
                                  {skill}
                                </span>
                              ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              No skills listed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Languages */}

                      {candidate.languages &&
                        candidate.languages !== "Not provided" && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Languages
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {typeof candidate.languages === "string" ? (
                                candidate.languages
                                  .split(", ")
                                  .map((lang, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded border border-purple-100 dark:border-purple-800/30"
                                    >
                                      {lang}
                                    </span>
                                  ))
                              ) : Array.isArray(candidate.languages) ? (
                                candidate.languages.map((lang, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded border border-purple-100 dark:border-purple-800/30"
                                  >
                                    {lang}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  No languages listed
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Experience */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Experience
                        </h5>
                        <div className="space-y-2">
                          {candidate.experience &&
                          candidate.experience !== "Not provided" ? (
                            candidate.experience.split("; ").map((exp, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-600 dark:text-gray-300 pl-2 border-l-2 border-gray-300 dark:border-gray-600"
                              >
                                {exp}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No experience listed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Education
                        </h5>
                        <div className="space-y-1">
                          {cleanEducationField(candidate.education) &&
                          candidate.education !== "Not provided" ? (
                            cleanEducationField(candidate.education)
                              .split("; ")
                              .map((edu, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm text-gray-600 dark:text-gray-300"
                                >
                                  {edu}
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No education listed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Certifications
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {cleanCertificationField(candidate.certifications)}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Activities
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {(candidate.activities || "").replace(/:\*\*/g, "")}{" "}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Projects
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {parseProjectsSection(
                            candidate.latestAnalysis?.raw_analysis || ""
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Analysis and Job details */}
                    <div className="space-y-5">
                      <button
                        className="flex items-center ml-auto px-5 py-3 rounded-lg dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
                        onClick={() => openModal(candidate)}
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Contact
                      </button>

                      {/* Resume Analysis */}

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Resume Analysis
                        </h4>

                        {/* Latest Analysis Score */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Job Match Score
                            </h5>
                            <div
                              className={`text-sm px-2 py-1 rounded-full ${getScoreBadgeColor(
                                candidate.score.overallMatch
                              )}`}
                            >
                              {Math.round(candidate.score.overallMatch)}%
                            </div>
                          </div>

                          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getScoreBadgeColor(
                                candidate.score.overallMatch
                              ).replace("border-", "")}`}
                              style={{
                                width: `${Math.round(
                                  candidate.score.overallMatch
                                )}%`,
                              }}
                            ></div>
                          </div>

                          <div className="mt-4">
                            <h6 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Analysis Date
                            </h6>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {new Date(
                                candidate.latestAnalysis.analyzedAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Resume Strengths */}
                        {candidate.latestAnalysis.strengths &&
                          candidate.latestAnalysis.strengths.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Resume Strengths
                              </h5>
                              <ul className="space-y-1 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                                {candidate.latestAnalysis.strengths.map(
                                  (strength, idx) => (
                                    <li key={idx}>{strength}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>

                      {/* Job Application Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Applied Job
                        </h4>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="text-base font-medium">
                                {candidate.appliedJob.title}
                              </h5>
                              <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full px-2 py-1">
                                {candidate.appliedJob.jobType}
                              </span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <Building2 size={14} />
                              <span>{candidate.appliedJob.companyName}</span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{candidate.appliedJob.location}</span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>{candidate.appliedJob.salary}</span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <Clock size={14} />
                              <span>
                                Deadline: {candidate.appliedJob.deadline}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Document links and Actions */}
                      <div className="space-y-4">
                        {/* Document links */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Documents
                          </h5>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                              {/* Cover Letter Text Button */}
                              <button
                                onClick={() => {
                                  if (
                                    candidate.coverLetter &&
                                    candidate.coverLetter !== "Not provided" &&
                                    candidate.coverLetter !== "Not available"
                                  ) {
                                    // Create a text blob and open it in a new tab
                                    const blob = new Blob(
                                      [candidate.coverLetter],
                                      { type: "text/plain" }
                                    );
                                    const url = URL.createObjectURL(blob);
                                    window.open(url, "_blank");
                                  }
                                }}
                                className={`flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-zinc-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full ${
                                  !candidate.coverLetter ||
                                  candidate.coverLetter === "Not provided" ||
                                  candidate.coverLetter === "Not available"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={
                                  !candidate.coverLetter ||
                                  candidate.coverLetter === "Not provided" ||
                                  candidate.coverLetter === "Not available"
                                }
                              >
                                <FileText
                                  size={16}
                                  className="text-blue-600 dark:text-blue-400"
                                />
                                <span>View Cover Letter Text</span>
                              </button>
                              <button
                                onClick={() => {
                                  // Helper to open a blob in a new tab

                                  // Fallback: generate PDF from cover letter text
                                  if (
                                    candidate.coverLetter &&
                                    candidate.coverLetter !== "Not provided" &&
                                    candidate.coverLetter !== "Not available"
                                  ) {
                                    const doc = new jsPDF();
                                    doc.setFont("helvetica");
                                    doc.setFontSize(16);
                                    doc.text(`Cover Letter`, 10, 20);
                                    doc.setFontSize(12);
                                    doc.text(
                                      `From: ${candidate.name} (${candidate.email})`,
                                      10,
                                      30
                                    );
                                    doc.line(10, 34, 200, 34);
                                    doc.setFontSize(12);
                                    doc.text(
                                      doc.splitTextToSize(
                                        candidate.coverLetter,
                                        180
                                      ),
                                      10,
                                      45
                                    );
                                    // Open PDF in new tab
                                    window.open(
                                      doc.output("bloburl"),
                                      "_blank"
                                    );
                                    return;
                                  } else {
                                    alert(
                                      "No cover letter available for this candidate."
                                    );
                                  }
                                }}
                                className={`flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-zinc-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full ${
                                  (!candidate.coverLetterPdf ||
                                    candidate.coverLetterPdf ===
                                      "Not available") &&
                                  (!candidate.coverLetter ||
                                    candidate.coverLetter === "Not provided" ||
                                    candidate.coverLetter === "Not available")
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={
                                  (!candidate.coverLetterPdf ||
                                    candidate.coverLetterPdf ===
                                      "Not available") &&
                                  (!candidate.coverLetter ||
                                    candidate.coverLetter === "Not provided" ||
                                    candidate.coverLetter === "Not available")
                                }
                              >
                                <FileText
                                  size={16}
                                  className="text-green-600 dark:text-green-400"
                                />
                                <span>View Cover Letter</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2">
                          {/* Modal */}
                          {isModalOpen && selectedCandidate && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                  <h2 className="text-lg font-semibold">
                                    Contact{" "}
                                    {selectedCandidate.name.replace(
                                      /\*\*/g,
                                      ""
                                    )}
                                  </h2>
                                  <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        f
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                <form onSubmit={handleSubmitInterview}>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Reason for Contact{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      rows="3"
                                      value={reason}
                                      onChange={(e) =>
                                        setReason(e.target.value)
                                      }
                                      placeholder="Specify the reason for contacting the candidate..."
                                      required
                                    ></textarea>
                                  </div>

                                  {selectedStatus !== "Reject" && (
                                    <div className="mb-6">
                                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Interview Planning{" "}
                                        <span className="text-red-500">*</span>
                                      </h3>
                                      <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Date{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            value={interviewDate}
                                            onChange={(e) =>
                                              setInterviewDate(e.target.value)
                                            }
                                            min={
                                              new Date()
                                                .toISOString()
                                                .split("T")[0]
                                            }
                                            required={true}
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Time{" "}
                                            <span className="text-red-500">
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="time"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            value={interviewTime}
                                            onChange={(e) =>
                                              setInterviewTime(e.target.value)
                                            }
                                            required={true}
                                          />
                                        </div>
                                      </div>

                                      {/* Google Meet Link Field - Only shown if not rejecting */}
                                      {selectedStatus !== "Reject" && (
                                        <div>
                                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Google Meet Link
                                          </label>
                                          <div className="flex">
                                            <input
                                              type="url"
                                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                              value={meetLink}
                                              onChange={(e) =>
                                                setMeetLink(e.target.value)
                                              }
                                              placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                            />
                                          </div>
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Enter a Google Meet link or generate
                                            one below
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {/* Status actions - unchanged */}
                                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Update Application Status
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                      {/* Review option */}
                                      <label
                                        className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors
        ${
          selectedStatus === "Review"
            ? "bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700"
            : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        }`}
                                      >
                                        <input
                                          type="radio"
                                          name="status"
                                          value="Review"
                                          checked={selectedStatus === "Review"}
                                          onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                          }
                                          className="sr-only"
                                        />
                                        <div className="flex flex-col items-center w-full">
                                          <span
                                            className={`text-sm font-medium ${
                                              selectedStatus === "Review"
                                                ? "text-blue-800 dark:text-blue-900"
                                                : "text-gray-700 dark:text-gray-900"
                                            }`}
                                          >
                                            Review
                                          </span>
                                        </div>
                                      </label>

                                      {/* Approve option */}
                                      <label
                                        className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors
        ${
          selectedStatus === "Approve"
            ? "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
            : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        }`}
                                      >
                                        <input
                                          type="radio"
                                          name="status"
                                          value="Approve"
                                          checked={selectedStatus === "Approve"}
                                          onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                          }
                                          className="sr-only"
                                        />
                                        <div className="flex flex-col items-center w-full">
                                          <span
                                            className={`text-sm font-medium ${
                                              selectedStatus === "Approve"
                                                ? "text-green-800 dark:text-green-300"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                          >
                                            Approve
                                          </span>
                                        </div>
                                      </label>

                                      {/* Reject option */}
                                      <label
                                        className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors
        ${
          selectedStatus === "Reject"
            ? "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700"
            : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        }`}
                                      >
                                        <input
                                          type="radio"
                                          name="status"
                                          value="Reject"
                                          checked={selectedStatus === "Reject"}
                                          onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                          }
                                          className="sr-only"
                                        />
                                        <div className="flex flex-col items-center w-full">
                                          <span
                                            className={`text-sm font-medium ${
                                              selectedStatus === "Reject"
                                                ? "text-red-800 dark:text-red-300"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                          >
                                            Reject
                                          </span>
                                        </div>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={closeModal}
                                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors"
                                    >
                                      {selectedStatus === "Reject"
                                        ? "Send Rejection"
                                        : "Schedule & Contact"}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={isModalTwoOpen} onClose={() => setIsModalTwoOpen(false)}>
        <AddJobForm onClose={() => setIsModalTwoOpen(false)} />
      </Modal>
    </div>
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
const PastApplications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useDarkMode(); // Use the hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profilePic, firstName, lastName, email } = useContext(UserContext);

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
      current: true,
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppliedCandidates();
  }, []);

  const fetchAppliedCandidates = async () => {
    try {
      const response = await fetch(
        API_URL + "/api/recruiters/candidates/applied",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const text = await response.text();

      if (response.status === 404) {
        // Handle no candidates found
        setCandidates([]);
        setError("No applications found for your jobs.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      try {
        const data = JSON.parse(text);
        setCandidates(data);
      } catch (jsonError) {
        throw new Error("Invalid JSON response received.");
      }
    } catch (err) {
      console.error("Error fetching applied candidates:", err);
      setError("Failed to load applied candidates");
    }
  };
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-white dark:bg-black">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black  border-gray-200 dark:border-gray-800
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

          <nav className="flex-1 overflow-y-auto p-4 space-y-8">
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
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
          <header className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
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

          {/* Main Content Area */}
          <div className="p-6 space-y-6 transition-all duration-300 ease-in-out z-30">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">
                Applied Candidates
              </h1>
              <p className="text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out z-30">
                View and manage candidates who applied to your jobs
              </p>
            </div>
            <AppliedCandidatesContent className="transition-all duration-300 ease-in-out z-30" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PastApplications;
