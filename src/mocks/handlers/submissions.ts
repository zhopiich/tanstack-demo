import type { components } from '@/api/schema'
import { http, HttpResponse } from 'msw'
import { db } from '../db'
import createId from '../utils/createId'

export const submissionHandlers = [
  http.post('/api/submissions/batch-review', async ({ request }) => {
    const body = await request.json() as components['schemas']['BatchReviewBody']
    let updatedCount = 0
    const reviewedAt = new Date().toISOString()

    for (const id of body.ids) {
      const index = db.submissions.findIndex(s => s.id === id)
      const submission = db.submissions[index]
      if (!submission)
        continue

      db.submissions[index] = {
        ...submission,
        status: body.verdict === 'approved' ? 'approved' : 'rejected',
        review: {
          reviewerId: 'mock-reviewer',
          verdict: body.verdict,
          reason: body.reason,
          reviewedAt,
        },
        updatedAt: reviewedAt,
      }
      updatedCount++
    }

    return HttpResponse.json({ updatedCount })
  }),

  http.post('/api/submissions/batch-delete', async ({ request }) => {
    const body = await request.json() as components['schemas']['BatchDeleteBody']
    const idsSet = new Set(body.ids)
    const before = db.submissions.length
    const filtered = db.submissions.filter(s => !idsSet.has(s.id))
    db.submissions.splice(0, db.submissions.length, ...filtered)
    return HttpResponse.json({ deletedCount: before - db.submissions.length })
  }),

  http.get('/api/submissions', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '20')
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const tier = url.searchParams.get('tier')
    const search = url.searchParams.get('search')
    const sortBy = (url.searchParams.get('sortBy') ?? 'createdAt') as keyof Pick<
      components['schemas']['Submission'],
      'createdAt' | 'updatedAt' | 'score' | 'flagCount'
    >
    const sortOrder = url.searchParams.get('sortOrder') ?? 'desc'

    let results = [...db.submissions]

    if (status)
      results = results.filter(s => s.status === status)
    if (type)
      results = results.filter(s => s.type === type)
    if (tier)
      results = results.filter(s => s.submitter.tier === tier)
    if (search)
      results = results.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

    results.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      const cmp = typeof aVal === 'string'
        ? (aVal as string).localeCompare(bVal as string)
        : (aVal as number) - (bVal as number)
      return sortOrder === 'desc' ? -cmp : cmp
    })

    const total = results.length
    const totalPages = Math.ceil(total / pageSize)
    const data = results.slice((page - 1) * pageSize, page * pageSize)

    return HttpResponse.json({
      data,
      pagination: { page, pageSize, total, totalPages },
    })
  }),

  http.post('/api/submissions', async ({ request }) => {
    const body = await request.json() as components['schemas']['SubmissionCreateBody']
    const submitter = db.submitters[0]
    if (!submitter) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Submitter not found' } },
        { status: 404 },
      )
    }

    const now = new Date().toISOString()
    const submission: components['schemas']['Submission'] = {
      id: createId(),
      ...body,
      status: 'pending',
      submitter,
      review: null,
      score: 0,
      flagCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    db.submissions.push(submission)
    return HttpResponse.json({ data: submission }, { status: 201 })
  }),

  http.get('/api/submissions/:id', ({ params }) => {
    const submission = db.submissions.find(s => s.id === params.id)
    if (!submission) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Submission not found' } },
        { status: 404 },
      )
    }
    return HttpResponse.json({ data: submission })
  }),

  http.patch('/api/submissions/:id', async ({ params, request }) => {
    const index = db.submissions.findIndex(s => s.id === params.id)
    const submission = db.submissions[index]
    if (!submission) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Submission not found' } },
        { status: 404 },
      )
    }
    const body = await request.json() as components['schemas']['SubmissionUpdateBody']
    db.submissions[index] = {
      ...submission,
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json({ data: db.submissions[index] })
  }),

  http.delete('/api/submissions/:id', ({ params }) => {
    const index = db.submissions.findIndex(s => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Submission not found' } },
        { status: 404 },
      )
    }
    db.submissions.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
