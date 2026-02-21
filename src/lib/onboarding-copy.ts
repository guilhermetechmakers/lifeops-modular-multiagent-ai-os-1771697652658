/**
 * Onboarding Flow microcopy and tour content.
 * Accelerates time-to-value and reduces drop-off during initial setup.
 */

export const ONBOARDING_STORAGE_KEY = 'lifeops_onboarding_tour_completed'

export const TOUR_STEPS = [
  {
    id: 'signup',
    title: 'Sign up in seconds',
    description:
      'Create your free account with email and password. No credit card required. Get instant access to the full LifeOps platform.',
    cta: 'Try Free',
    targetId: 'hero-cta',
  },
  {
    id: 'connect',
    title: 'Connect your accounts',
    description:
      'After signup, link your tools—Jira, GitHub, Slack, and more. AI agents use these connections to automate your workflows safely.',
    cta: 'Explore modules',
    targetId: 'features',
  },
  {
    id: 'cronjob',
    title: 'Launch your first Cronjob',
    description:
      'Schedule automated tasks with human-in-the-loop approvals. Every run is traceable and reversible. Start with a template or build from scratch.',
    cta: 'See how it works',
    targetId: 'cronjobs-snapshot',
  },
] as const

export const ONBOARDING_PROMPTS = {
  welcome: {
    headline: 'Welcome to LifeOps',
    subheadline:
      'Your AI-Native Operating System for projects, content, finance, and health.',
    body: 'Get started in three simple steps: sign up, connect your accounts, and launch your first Cronjob.',
  },
  signup: {
    headline: 'Create your account',
    hint: 'Use a work email for the best experience. We\'ll verify it before you get started.',
  },
  connect: {
    headline: 'Connect your tools',
    hint: 'Link Jira, GitHub, Notion, or other integrations. Each module has its own connectors.',
  },
  firstCronjob: {
    headline: 'Launch your first Cronjob',
    hint: 'Choose a template or create a custom schedule. You can always approve or revert actions.',
  },
} as const

export const CONTEXTUAL_HELP = {
  hero: 'Start here: Sign up free or request a demo to see LifeOps in action.',
  features: 'Each module—Projects, Content, Finance, Health—has dedicated AI agents and workflows.',
  cronjobs: 'Cronjobs run on a schedule. Approvals ensure you stay in control of every action.',
  pricing: 'Start free. Upgrade when you need more agents, Cronjobs, or support.',
} as const
