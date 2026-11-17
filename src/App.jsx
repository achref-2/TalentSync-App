import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/candidat/Dashboard";
import CandidatSignup from "./pages/candidat/Singup/Signup";
import CandidatLogin from "./pages/candidat/Login/Login";
import CVcomponent from "./pages/candidat/CVcomponent";
import PastApplications from "./pages/candidat/PastApplications";
import LandingPage from "./pages/landingPage/LandingPage";
import Jobs from "./pages/candidat/Jobs/Jobs";
import Settings from "./pages/candidat/Settings";
import Pricing from "./pages/landingPage/Prising";
import { DarkModeProvider } from "./components/DarkModeProvider";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import { AuthWrapper } from "./components/AuthWrapper"; // Add this import
import Admin from "./components/admin";
import AppliedCandidates from "./pages/recruiter/AppliedCandidates";
import RecruiterJobs from "./pages/recruiter/Jobs";
import RecruiterSettings from "./pages/recruiter/Settings";
import TestingPage from "./pages/candidat/Testing";
import Application from "./pages/candidat/Application";
import NotFoundPage from "./pages/404";
import Blog from "./pages/landingPage/Blog";
import CvPreview from "./components/Cvpreview";
import Interviews from "./pages/candidat/Interviews";
import InterviewsRec from "./pages/recruiter/Interviews";
import { UserProvider } from "./components/UserContext";
import SignupConfirmation from "./pages/recruiter/SignupConfirmation";
import SignupReject from "./components/SignupReject";
import SmoothScroll from "smooth-scroll";
import PendingApproval from "./pages/recruiter/PendingApproval";
import Cvcreation from "./pages/candidat/CV/CvCreation";
import { UserProviderRec, UserContext } from "./pages/recruiter/UserContext";
new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const user = localStorage.getItem("token");

  return (
    <DarkModeProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Candidate Routes  */}

          <Route
            path="/*"
            element={
              <AuthWrapper allowedRole="candidate">
                <UserProvider>
                  <Routes>
                    <Route
                      path="/candidate/signup"
                      element={<CandidatSignup />}
                    />
                    <Route
                      path="/candidate/login"
                      element={<CandidatLogin />}
                    />
                    <Route path="/Application" element={<Application />} />
                    <Route path="/Pricing" element={<Pricing />} />
                    <Route path="/Blog" element={<Blog />} />
                    <Route path="/Jobs" element={<Jobs />} />
                    <Route path="/cv-preview" element={<CvPreview />} />
                    <Route
                      path="/dashboard/PastApplications"
                      element={<PastApplications />}
                    />
                    <Route path="/Settings" element={<Settings />} />
                    <Route path="/cv-creation" element={<Cvcreation/>} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route
                      path="/dashboard/interviews"
                      element={<Interviews />}
                    />
                    {!user ? (
                      <Route path="/" element={<Navigate to="/" />} />
                    ) : (
                      <Route path="/dashboard" element={<Dashboard />} />
                    )}
                  </Routes>
                </UserProvider>
              </AuthWrapper>
            }
          />
          {/* Recruiter Routes */}
          <Route
            path="/dashboard/recuiter/*"
            element={
              <AuthWrapper allowedRole="recruiter">
                <UserProviderRec>
                  <Routes>
                    <Route path="" element={<RecruiterDashboard />} />
                    <Route
                      path="AppliedCandidates"
                      element={<AppliedCandidates />}
                    />
                    <Route path="joblist" element={<RecruiterJobs />} />
                    <Route path="settings" element={<RecruiterSettings />} />
                    <Route path="interviews" element={<InterviewsRec />} />
                   
                    <Route
                      path="confirmation"
                      element={<SignupConfirmation />}
                    />
                    <Route path="rejected" element={<SignupReject />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </UserProviderRec>
              </AuthWrapper>
            }
          />
           <Route
                      path="/dashboard/recuiter/PendingApproval"
                      element={<PendingApproval />}
                    />
          {/* Admin Route wrapped with AuthWrapper */}
           {/* <AuthWrapper allowedRole="admin </AuthWrapper>*/}

          <Route
            path="/admin"
            element={
                <Admin />
            }
          />

          {/* Other routes (outside UserProvider) */}
          <Route path="/Testing" element={<TestingPage />} />
          <Route path="/cv" element={<CVcomponent />} />
          <Route path="/notfound" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
