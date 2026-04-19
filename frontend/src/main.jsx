import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import JobList from './pages/JobList.jsx'
import Contracts from './pages/Contracts.jsx'
import JobDirectory from './pages/JobDirectory.jsx'
import MilestoneManagement from './pages/MilestoneManagement.jsx'
import Notifications from './pages/Notifications.jsx'
import JobProgress from './pages/JobProgress.jsx'
import MessagesCenter from './pages/MessagesCenter.jsx'
import UploadedCvs from './pages/UploadedCvs.jsx'
import AuthPortal from './pages/AuthPortal.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Discussions from './pages/Discussions.jsx'
import Favorites from './pages/Favorites.jsx'
import SearchJobs from './pages/SearchJobs.jsx'
import AIAgent from './pages/AIAgent.jsx'
import EmployerOverviewDashboard from './pages/tuyen-dung/EmployerOverviewDashboard.jsx'
import EmployerRecruitmentDashboard from './pages/tuyen-dung/EmployerRecruitmentDashboard.jsx'
import EmployerJobList from './pages/tuyen-dung/EmployerJobList.jsx'
import EmployerInterviewCalendar from './pages/tuyen-dung/EmployerInterviewCalendar.jsx'
import EmployerMilestoneDashboard from './pages/tuyen-dung/EmployerMilestoneDashboard.jsx'
import EmployerReceivedProfiles from './pages/tuyen-dung/EmployerReceivedProfiles.jsx'
import EmployerCandidateDetail from './pages/tuyen-dung/EmployerCandidateDetail.jsx'
import EmployerMessages from './pages/tuyen-dung/EmployerMessages.jsx'
import EmployerNotifications from './pages/tuyen-dung/EmployerNotifications.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminCompanies from './pages/admin/AdminCompanies.jsx'
import AdminJobs from './pages/admin/AdminJobs.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employer-dashboard" element={<EmployerOverviewDashboard />} />
        <Route path="/employer-post-job" element={<EmployerRecruitmentDashboard />} />
        <Route path="/employer-job-list" element={<EmployerJobList />} />
        <Route path="/employer-received-cv" element={<EmployerReceivedProfiles />} />
        <Route path="/employer-received-cv/:applicationId" element={<EmployerCandidateDetail />} />
        <Route path="/employer-interviews" element={<EmployerInterviewCalendar />} />
        <Route path="/employer-messages" element={<EmployerMessages />} />
        <Route path="/employer-notifications" element={<EmployerNotifications />} />
        <Route path="/employer-milestones" element={<EmployerMilestoneDashboard />} />
        <Route path="/job-list" element={<JobDirectory />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/milestones" element={<MilestoneManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/job-progress" element={<JobProgress />} />
        <Route path="/uploaded-cvs" element={<UploadedCvs />} />
        <Route path="/messages" element={<MessagesCenter />} />
        <Route path="/login" element={<AuthPortal mode="login" />} />
        <Route path="/register" element={<AuthPortal mode="register" />} />
        <Route path="/forgot-password" element={<AuthPortal mode="forgot" />} />
        <Route path="/reset-password" element={<AuthPortal mode="reset" />} />
        <Route path="/job-detail" element={<JobDetail />} />
        <Route path="/job-detail/:id" element={<JobDetail />} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search-jobs" element={<SearchJobs />} />
        <Route path="/ai-agent" element={<AIAgent />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)






