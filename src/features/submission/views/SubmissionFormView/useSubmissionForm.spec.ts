import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useInitializeForm } from './useInitializeForm'
import { useSubmissionForm } from './useSubmissionForm'
import { useSubmitForm } from './useSubmitForm'

vi.mock('./useInitializeForm', () => ({ useInitializeForm: vi.fn() }))
vi.mock('./useSubmitForm', () => ({ useSubmitForm: vi.fn() }))

describe('useSubmissionForm', () => {
  beforeEach(() => {
    vi.mocked(useInitializeForm).mockReturnValue(undefined as any)
    vi.mocked(useSubmitForm).mockReturnValue({
      errors: ref({}),
      isPending: ref(false),
      submit: vi.fn(),
    } as unknown as ReturnType<typeof useSubmitForm>)
  })

  it('isCreatingNew is true when id is undefined', () => {
    const { isCreatingNew } = useSubmissionForm({ id: ref(undefined) })
    expect(isCreatingNew.value).toBe(true)
  })

  it('isCreatingNew is false when id is provided', () => {
    const { isCreatingNew } = useSubmissionForm({ id: ref('sub-1') })
    expect(isCreatingNew.value).toBe(false)
  })

  it('form starts with default values', () => {
    const { form } = useSubmissionForm({ id: ref(undefined) })
    expect(form.title).toBe('')
    expect(form.type).toBe('article')
    expect(form.tags).toEqual([])
  })

  it('changing type in create mode resets content to type-specific defaults', async () => {
    const { form } = useSubmissionForm({ id: ref(undefined) })
    form.type = 'video'
    await nextTick()
    expect(form.content.type).toBe('video')
  })

  it('changing type in edit mode does not reset content', async () => {
    const { form } = useSubmissionForm({ id: ref('sub-1') })
    form.content = { type: 'article', url: 'https://keep.me', thumbnailUrl: null, wordCount: 100, readingTime: 5 }
    form.type = 'video'
    await nextTick()
    expect(form.content.type).toBe('article')
  })

  it('each call gets an independent form instance', () => {
    const a = useSubmissionForm({ id: ref(undefined) })
    const b = useSubmissionForm({ id: ref(undefined) })
    a.form.title = 'changed'
    expect(b.form.title).toBe('')
  })
})
