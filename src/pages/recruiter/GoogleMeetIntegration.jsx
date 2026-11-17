import React, { useState } from 'react';
import { gapi } from 'gapi-script';

const SCOPES = 'https://www.googleapis.com/auth/meetings.space.created';
// Assuming this component is in a separate file, you may need to update it there
// Here's a simplified version of what it might look like:

const GoogleMeetIntegration = ({ candidateName, candidateEmail, onLinkGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateMeetLink = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, you would call your API that integrates with Google Calendar API
      // For this example, we're just creating a mock link
      setTimeout(() => {
        const mockMeetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`;
        if (onLinkGenerated) {
          onLinkGenerated(mockMeetLink);
        }
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating Meet link:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Create a Google Meet video conference for interviewing {candidateName}
      </p>
      <button
        type="button"
        onClick={generateMeetLink}
        disabled={isGenerating}
        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 rounded-md transition-colors"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Meet Link...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Google Meet Link
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleMeetIntegration;