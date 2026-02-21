import { createBrowserRouter, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Landing } from '@/pages/landing'
import LandingPage from '@/pages/LandingPage'
import { Login } from '@/pages/auth/login'
import { Signup } from '@/pages/auth/signup'
import EmailVerification from '@/pages/EmailVerification'
import { ForgotPassword } from '@/pages/auth/forgot-password'
import { ResetPassword } from '@/pages/auth/reset-password'
import LoginSignupPage from '@/pages/Login/Signup'
import { MasterDashboard } from '@/pages/dashboard/overview'
import { RunDetails } from '@/pages/dashboard/run-details'
import RunDetailsArtifacts from '@/pages/RunDetailsArtifacts'
import { Agents } from '@/pages/dashboard/agents'
import AgentDirectory from '@/pages/AgentDirectory'
import { ProjectsDashboard } from '@/pages/dashboard/projects'
import ModuleDashboardContent from '@/pages/ModuleDashboardContent'
import ModuleDashboardProjects from '@/pages/ModuleDashboardProjects'
import { FinanceDashboard } from '@/pages/dashboard/finance'
import ModuleDashboardHealth from '@/pages/ModuleDashboardHealth'
import { CronjobsManager } from '@/pages/dashboard/cronjobs'
import { Workflows } from '@/pages/dashboard/workflows'
import { TemplatesLibrary } from '@/pages/dashboard/templates'
import { ApprovalsQueue } from '@/pages/dashboard/approvals'
import SettingsPreferences from '@/pages/SettingsPreferences'
import TeamSettings from '@/pages/Organization/TeamSettings'
import Organization from '@/pages/dashboard/organization'
import { Profile } from '@/pages/dashboard/profile'
import UserProfile from '@/pages/UserProfile'
import { Connectors } from '@/pages/dashboard/connectors'
import { AuditLogs } from '@/pages/dashboard/audit'
import { Admin } from '@/pages/dashboard/admin'
import DocsHelp from '@/pages/DocsHelp'
import { Legal } from '@/pages/legal'
import CookiePolicy from '@/pages/legal/cookies'
import Privacy from '@/pages/legal/privacy'
import Terms from '@/pages/legal/terms'
import { Pricing } from '@/pages/Pricing'
import NotFound404 from '@/pages/404NotFound'
import { ServerErrorPage } from '@/pages/errors'

const aboutContent = 'LifeOps is your AI-Native Operating System for projects, content, finance, and health. We help teams automate workflows with traceable, permissioned, and reversible AI agents.'
const supportContent = 'For support, email support@lifeops.io or visit our documentation at /docs.'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/landing-page',
    element: <LandingPage />,
  },
  {
    path: '/landing-simple',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/verify-email',
    element: <Navigate to="/email-verification" replace />,
  },
  {
    path: '/email-verification',
    element: <EmailVerification />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/login-/-signup',
    element: <LoginSignupPage />,
  },
  {
    path: '/docs',
    element: <DocsHelp />,
  },
  {
    path: '/docs-help',
    element: <DocsHelp />,
  },
  {
    path: '/privacy',
    element: <Navigate to="/privacy-policy" replace />,
  },
  {
    path: '/privacy-policy',
    element: <Privacy />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/cookies',
    element: <CookiePolicy />,
  },
  {
    path: '/master-dashboard',
    element: (
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    ),
    errorElement: <ServerErrorPage />,
    children: [{ index: true, element: <MasterDashboard /> }],
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/settings-preferences',
    element: <Navigate to="/dashboard/settings" replace />,
  },
  {
    path: '/user-profile',
    element: <Navigate to="/dashboard/user-profile" replace />,
  },
  {
    path: '/organization-/-team-settings',
    element: <Navigate to="/dashboard/organization-team-settings" replace />,
  },
  {
    path: '/about',
    element: <Legal title="About" content={aboutContent} />,
  },
  {
    path: '/support',
    element: <Legal title="Support" content={supportContent} />,
  },
  {
    path: '/run-details-artifacts',
    element: (
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    ),
    errorElement: <ServerErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard/overview" replace /> },
      { path: ':runId', element: <RunDetailsArtifacts /> },
    ],
  },
  {
    path: '/module-dashboard-health',
    element: <Navigate to="/dashboard/health" replace />,
  },
  {
    path: '/module-dashboard-—-health',
    element: <Navigate to="/dashboard/health" replace />,
  },
  {
    path: '/module-dashboard-projects',
    element: (
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    ),
    errorElement: <ServerErrorPage />,
    children: [{ index: true, element: <ModuleDashboardProjects /> }],
  },
  {
    path: '/dashboard',
    element: (
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    ),
    errorElement: <ServerErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard/overview" replace /> },
      { path: 'overview', element: <MasterDashboard /> },
      { path: 'agents', element: <Agents /> },
      { path: 'agent-directory', element: <AgentDirectory /> },
      { path: 'projects', element: <ProjectsDashboard /> },
      { path: 'module-projects', element: <ModuleDashboardProjects /> },
      { path: 'content', element: <ModuleDashboardContent /> },
      { path: 'finance', element: <FinanceDashboard /> },
      { path: 'health', element: <ModuleDashboardHealth /> },
      { path: 'cronjobs', element: <CronjobsManager /> },
      { path: 'workflows', element: <Workflows /> },
      { path: 'templates', element: <TemplatesLibrary /> },
      { path: 'approvals', element: <ApprovalsQueue /> },
      { path: 'settings', element: <SettingsPreferences /> },
      { path: 'settings-preferences', element: <SettingsPreferences /> },
      { path: 'organization', element: <Organization /> },
      { path: 'organization-team-settings', element: <TeamSettings /> },
      { path: 'profile', element: <Profile /> },
      { path: 'user-profile', element: <UserProfile /> },
      { path: 'connectors', element: <Connectors /> },
      { path: 'audit', element: <AuditLogs /> },
      { path: 'admin', element: <Admin /> },
      { path: 'runs/:runId', element: <RunDetails /> },
      { path: 'run-details-artifacts/:runId', element: <RunDetailsArtifacts /> },
    ],
  },
  {
    path: '/errors/server-error',
    element: <ServerErrorPage />,
  },
  {
    path: '/404-not-found',
    element: <NotFound404 />,
  },
  {
    path: '*',
    element: <NotFound404 />,
  },
])
