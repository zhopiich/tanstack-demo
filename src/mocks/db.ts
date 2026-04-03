import type { components } from '@/api/schema'
import createId from './createId'

type Submitter = components['schemas']['Submitter']
type Submission = components['schemas']['Submission']
type AuthUser = components['schemas']['AuthUser']

export type AuthUserRecord = AuthUser & { password: string }

export const db = {
  submitters: [] as Submitter[],
  submissions: [] as Submission[],
  authUsers: [] as AuthUserRecord[],
  tokens: new Set<string>(),
}

// Seed Data

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

const reviewer: AuthUserRecord = {
  id: createId(),
  name: 'Reviewer User',
  email: 'reviewer@example.com',
  role: 'reviewer',
  password: 'password123',
}
const admin: AuthUserRecord = {
  id: createId(),
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  password: 'password123',
}

db.authUsers.push(admin, reviewer)

const alice: Submitter = {
  id: createId(),
  name: 'Alice Chen',
  email: 'alice@example.com',
  tier: 'verified',
}
const bob: Submitter = {
  id: createId(),
  name: 'Bob Kim',
  email: 'bob@example.com',
  tier: 'pro',
}
const carol: Submitter = {
  id: createId(),
  name: 'Carol Wong',
  email: 'carol@example.com',
  tier: 'free',
}

db.submitters.push(alice, bob, carol)

const submissions: Submission[] = [
  {
    id: createId(),
    title: 'Getting Started with TypeScript 5.0',
    type: 'article',
    status: 'approved',
    submitter: alice,
    content: {
      type: 'article',
      url: 'https://example.com/ts5',
      thumbnailUrl: 'https://picsum.photos/seed/ts5/400/300',
      wordCount: 2400,
      readingTime: 10,
    },
    tags: ['typescript', 'javascript'],
    review: {
      reviewerId: reviewer.id,
      verdict: 'approved',
      reason: 'Well-written and technically accurate.',
      reviewedAt: daysAgo(1),
    },
    score: 88,
    flagCount: 0,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: createId(),
    title: 'Tailwind CSS v4 Migration Guide',
    type: 'article',
    status: 'approved',
    submitter: bob,
    content: {
      type: 'article',
      url: 'https://example.com/tailwind-v4',
      thumbnailUrl: 'https://picsum.photos/seed/tw4/400/300',
      wordCount: 1800,
      readingTime: 8,
    },
    tags: ['css', 'tailwind'],
    review: {
      reviewerId: reviewer.id,
      verdict: 'approved',
      reason: 'Clear and practical guide.',
      reviewedAt: daysAgo(4),
    },
    score: 76,
    flagCount: 0,
    createdAt: daysAgo(9),
    updatedAt: daysAgo(4),
  },
  {
    id: createId(),
    title: 'Building REST APIs with Hono',
    type: 'video',
    status: 'pending',
    submitter: alice,
    content: {
      type: 'video',
      url: 'https://example.com/hono',
      thumbnailUrl: 'https://picsum.photos/seed/hono/400/300',
      duration: 2700,
      resolution: '720p',
    },
    tags: ['api', 'backend'],
    review: null,
    score: 0,
    flagCount: 0,
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
  },
  {
    id: createId(),
    title: 'Vue 3 Composition API Deep Dive',
    type: 'video',
    status: 'approved',
    submitter: alice,
    content: {
      type: 'video',
      url: 'https://example.com/vue3',
      thumbnailUrl: 'https://picsum.photos/seed/vue3/400/300',
      duration: 1820,
      resolution: '1080p',
    },
    tags: ['vue', 'frontend'],
    review: {
      reviewerId: reviewer.id,
      verdict: 'approved',
      reason: 'Great depth and clarity.',
      reviewedAt: daysAgo(2),
    },
    score: 91,
    flagCount: 0,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
  },
  {
    id: createId(),
    title: 'Premium Design System (Paywalled)',
    type: 'link',
    status: 'rejected',
    submitter: carol,
    content: {
      type: 'link',
      url: 'https://example.com/design-sys',
      thumbnailUrl: 'https://picsum.photos/seed/ds/400/300',
      domain: 'example.com',
      isBehindPaywall: true,
    },
    tags: ['design'],
    review: {
      reviewerId: reviewer.id,
      verdict: 'rejected',
      reason: 'Paywalled content not suitable for this platform.',
      reviewedAt: daysAgo(5),
    },
    score: 20,
    flagCount: 0,
    createdAt: daysAgo(11),
    updatedAt: daysAgo(5),
  },
  {
    id: createId(),
    title: 'Introduction to Web Assembly',
    type: 'video',
    status: 'flagged',
    submitter: bob,
    content: {
      type: 'video',
      url: 'https://example.com/wasm',
      thumbnailUrl: 'https://picsum.photos/seed/wasm/400/300',
      duration: 3600,
      resolution: '4k',
    },
    tags: ['wasm', 'performance'],
    review: null,
    score: 50,
    flagCount: 2,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
  },
]

db.submissions.push(...submissions)
