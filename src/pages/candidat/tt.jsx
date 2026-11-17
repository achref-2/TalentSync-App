import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format, parseISO, isAfter } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  Link as LinkIcon, 
  ArrowRight, 
  CheckCircle, 
  X, 
  Search,
  Filter,
  CalendarRange,
  ExternalLink
} from "lucide-react";
import { UserContext } from "../../components/UserContext";
import { useDarkMode } from "../../components/DarkModeProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";

const Interviews = () => {
  const { isDarkMode } = useDarkMode();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all", "upcoming", "past"
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              {selectedInterview.meetLink && isUpcoming(selectedInterview.scheduledDate) && (
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
  );
};

export default Interviews;