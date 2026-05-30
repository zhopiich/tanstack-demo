import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import {
  useCreateSubmission,
  useUpdateSubmission,
} from '@/features/submission/queries/useSubmissionMutations'
import { useSubmitForm } from './useSubmitForm'

vi.mock('@/features/submission/queries/useSubmissionMutations', () => ({
  useCreateSubmission: vi.fn(),
  useUpdateSubmission: vi.fn(),
}))

const validForm = {
  title: 'Test Title',
  tags: [] as string[],
  content: {
    type: 'article' as const,
    url: 'https://example.com',
    thumbnailUrl: null,
    wordCount: 100,
    readingTime: 5,
  },
  submitterEmail: 'user@example.com',
}

let mockCreateMutate: ReturnType<typeof vi.fn>
let mockUpdateMutate: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockCreateMutate = vi.fn().mockResolvedValue(undefined)
  mockUpdateMutate = vi.fn().mockResolvedValue(undefined)
  vi.mocked(useCreateSubmission).mockReturnValue({
    mutateAsync: mockCreateMutate,
    isPending: ref(false),
  } as unknown as ReturnType<typeof useCreateSubmission>,
  )
  vi.mocked(useUpdateSubmission).mockReturnValue({
    mutateAsync: mockUpdateMutate,
    isPending: ref(false),
  } as unknown as ReturnType<typeof useUpdateSubmission>)
})

describe('useSubmitForm', () => {
  describe('create mode', () => {
    it('calls createMutate with parsed data and invokes onSuccess', async () => {
      const onSuccess = vi.fn()
      const { submit, errors } = useSubmitForm({
        id: ref(undefined),
        form: { ...validForm },
        isCreatingNew: computed(() => true),
        onSuccess,
      })

      await submit()

      expect(mockCreateMutate).toHaveBeenCalledWith(validForm)
      expect(mockUpdateMutate).not.toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledOnce()
      expect(errors.value).toEqual({})
    })

    it('sets field errors and skips mutation when form is invalid', async () => {
      const { submit, errors } = useSubmitForm({
        id: ref(undefined),
        form: { ...validForm, title: '' },
        isCreatingNew: computed(() => true),
      })

      await submit()

      expect(errors.value.title).toBeDefined()
      expect(mockCreateMutate).not.toHaveBeenCalled()
    })

    it('sets nested field error for invalid content', async () => {
      const { submit, errors } = useSubmitForm({
        id: ref(undefined),
        form: { ...validForm, content: { ...validForm.content, url: 'not-a-url' } },
        isCreatingNew: computed(() => true),
      })

      await submit()

      expect(errors.value['content.url']).toBeDefined()
      expect(mockCreateMutate).not.toHaveBeenCalled()
    })
  })

  describe('update mode', () => {
    it('calls updateMutate with id and body, then invokes onSuccess', async () => {
      const onSuccess = vi.fn()
      const { submit, errors } = useSubmitForm({
        id: ref('submission-123'),
        form: { ...validForm },
        isCreatingNew: computed(() => false),
        onSuccess,
      })

      await submit()

      expect(mockUpdateMutate).toHaveBeenCalledWith({ id: 'submission-123', body: validForm })
      expect(mockCreateMutate).not.toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledOnce()
      expect(errors.value).toEqual({})
    })
  })

  describe('error handling', () => {
    it('clears stale errors before each submit', async () => {
      const { submit, errors } = useSubmitForm({
        id: ref(undefined),
        form: { ...validForm, title: '' },
        isCreatingNew: computed(() => true),
      })

      await submit()
      expect(errors.value.title).toBeDefined()

      mockCreateMutate.mockResolvedValue(undefined)

      const { submit: submit2, errors: errors2 } = useSubmitForm({
        id: ref(undefined),
        form: { ...validForm },
        isCreatingNew: computed(() => true),
      })
      await submit2()
      expect(errors2.value).toEqual({})
    })

    it('sets _root error when mutation throws, and does not call onSuccess', async () => {
      mockCreateMutate.mockRejectedValue(new Error('Network error'))
      const onSuccess = vi.fn()
      const { submit, errors } = useSubmitForm({
        id: ref(undefined),
        form: { ...validForm },
        isCreatingNew: computed(() => true),
        onSuccess,
      })

      await submit()

      expect(errors.value._root).toBe('Something went wrong. Please try again.')
      expect(onSuccess).not.toHaveBeenCalled()
    })
  })
})
