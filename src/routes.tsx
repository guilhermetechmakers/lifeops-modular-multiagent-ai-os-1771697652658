import { createBrowserRouter, Navigate } from 'react-router-dom'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Landing } from '@/pages/landing'
import LandingPage from '@/pages/LandingPage'
import { Login } from '@/pages/auth/login'
import { Signup } from '@/pages/auth/signup'
import { VerifyEmail } from '@/pages/auth/verify-email'
import { ForgotPassword } from '@/pages/auth/forgot-password'
import { ResetPassword } from '@/pages/auth/reset-password'
import LoginSignupPage from '@/pages/Login/Signup'
import MasterDashboard from '@/pages/dashboard/master-dashboard'
import { RunDetails } from '@/pages/dashboard/run-details'
import { Agents } from '@/pages/dashboard/agents'
import AgentDirectory from '@/pages/AgentDirectory'
import { ProjectsDashboard } from '@/pages/dashboard/projects'
import { ContentDashboard } from '@/pages/dashboard/content'
import ModuleDashboardProjects from '@/pages/ModuleDashboardProjects'
import { FinanceDashboard } from '@/pages/dashboard/finance'
import { HealthDashboard } from '@/pages/dashboard/health'
import { CronjobsManager } from '@/pages/dashboard/cronjobs'
import { TemplatesLibrary } from '@/pages/dashboard/templates'
import { ApprovalsQueue } from '@/pages/dashboard/approvals'
import SettingsPreferences from '@/pages/SettingsPreferences'
import { Profile } from '@/pages/dashboard/profile'
import { Connectors } from '@/pages/dashboard/connectors'
import { AuditLogs } from '@/pages/dashboard/audit'
import { Docs } from '@/pages/docs'
import { Legal } from '@/pages/legal'
import { Pricing } from '@/pages/Pricing'
import { NotFound } from '@/pages/not-found'
import { ErrorPage } from '@/pages/error'

const legalContent = 'This is placeholder legal content. Replace with actual terms, privacy policy, or cookie policy text.'
const aboutContent = 'LifeOps is your AI-Native Operating System for projects, content, finance, and health. We help teams automate workflows with traceable, permissioned, and reversible AI agents.'
const supportContent = 'For support, email support@lifeops.io or visit our documentation at /docs.'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/landing-page',
    element: <LandingPage />,
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
    element: <VerifyEmail />,
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
    element: <Docs />,
  },
  {
    path: '/privacy',
    element: <Legal title="Privacy Policy" content={legalContent} />,
  },
  {
    path: '/terms',
    element: <Legal title="Terms of Service" content={legalContent} />,
  },
  {
    path: '/cookies',
    element: <Legal title="Cookie Policy" content={legalContent} />,
  },
  {
    path: '/master-dashboard',
    element: (
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    ),
    errorElement: <ErrorPage />,
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
    path: '/about',
    element: <Legal title="About" content={aboutContent} />,
  },
  {
    path: '/support',
    element: <Legal title="Support" content={supportContent} />,
  },
  {
    path: '/module-dashboard-projects',
    element: (
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    ),
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <ModuleDashboardProjects /> }],
  },
  {
    path: '/dashboard',
    element: (
      <SidebarProvider>
        <DashboardLayout />
      </SidebarProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard/overview" replace /> },
      { path: 'overview', element: <MasterDashboard /> },
      { path: 'agents', element: <Agents /> },
      { path: 'agent-directory', element: <AgentDirectory /> },
      { path: 'projects', element: <ProjectsDashboard /> },
      { path: 'module-projects', element: <ModuleDashboardProjects /> },
      { path: 'content', element: <ContentDashboard /> },
      { path: 'finance', element: <FinanceDashboard /> },
      { path: 'health', element: <HealthDashboard /> },
      { path: 'cronjobs', element: <CronjobsManager /> },
      { path: 'templates', element: <TemplatesLibrary /> },
      { path: 'approvals', element: <ApprovalsQueue /> },
      { path: 'settings', element: <SettingsPreferences /> },
      { path: 'settings-preferences', element: <SettingsPreferences /> },
      { path: 'profile', element: <Profile /> },
      { path: 'connectors', element: <Connectors /> },
      { path: 'audit', element: <AuditLogs /> },
      { path: 'runs/:runId', element: <RunDetails /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
