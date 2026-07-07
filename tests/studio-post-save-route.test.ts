import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  getPresentationForPostSaveJob: vi.fn(),
  normalizePostSaveJobRequest: vi.fn(),
  runPresentationPostSaveJobs: vi.fn(),
}))

vi.mock('@/lib/studio-auth', () => ({
  getServerSession: mocks.getServerSession,
}))

vi.mock('@/lib/studio-post-save-jobs', () => ({
  getPresentationForPostSaveJob: mocks.getPresentationForPostSaveJob,
  normalizePostSaveJobRequest: mocks.normalizePostSaveJobRequest,
  runPresentationPostSaveJobs: mocks.runPresentationPostSaveJobs,
}))

import { POST } from '../app/api/studio/presentations/[id]/post-save/route'

function request(body: unknown = {}) {
  return new Request('http://local.test/api/studio/presentations/pres-1/post-save', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as any
}

function context(id = 'pres-1') {
  return { params: Promise.resolve({ id }) }
}

describe('studio post-save route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('rejects unauthenticated requests before loading a presentation', async () => {
    mocks.getServerSession.mockResolvedValue(null)

    const res = await POST(request(), context())

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: 'Not authenticated' })
    expect(mocks.getPresentationForPostSaveJob).not.toHaveBeenCalled()
  })

  it('returns not found when the presentation is missing or not owned by the user', async () => {
    mocks.getServerSession.mockResolvedValue({ userId: 'user-1' })
    mocks.getPresentationForPostSaveJob.mockResolvedValue(null)

    const res = await POST(request(), context())

    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Not found' })
  })

  it('normalizes and runs requested post-save jobs for the owning user', async () => {
    const presentation = { id: 'pres-1', userId: 'user-1', slides: [], document: null }
    const jobs = { translations: true, qualityRating: true }
    const jobResult = { ok: true, jobs: { qualityRating: { promoted: 1, demoted: 0, score: 90 } } }
    mocks.getServerSession.mockResolvedValue({ userId: 'user-1' })
    mocks.getPresentationForPostSaveJob.mockResolvedValue(presentation)
    mocks.normalizePostSaveJobRequest.mockReturnValue(jobs)
    mocks.runPresentationPostSaveJobs.mockResolvedValue(jobResult)

    const res = await POST(request({ qualityRating: true }), context())

    expect(res.status).toBe(200)
    expect(mocks.getPresentationForPostSaveJob).toHaveBeenCalledWith('pres-1', 'user-1')
    expect(mocks.normalizePostSaveJobRequest).toHaveBeenCalledWith({ qualityRating: true })
    expect(mocks.runPresentationPostSaveJobs).toHaveBeenCalledWith(presentation, jobs)
    expect(await res.json()).toEqual(jobResult)
  })
})
