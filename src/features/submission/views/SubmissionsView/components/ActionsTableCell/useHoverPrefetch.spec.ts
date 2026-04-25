import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { usePrefetchSubmission } from '../../exports'
import { useHoverPrefetch } from './useHoverPrefetch'

vi.mock('../../exports', () => ({ usePrefetchSubmission: vi.fn() }))

let mockPrefetch: (id: string) => void

function mountComposable() {
  let result!: ReturnType<typeof useHoverPrefetch>
  const wrapper = mount(defineComponent({
    setup() {
      result = useHoverPrefetch()
    },
    template: '<div />',
  }))
  return { result, wrapper }
}

beforeEach(() => {
  mockPrefetch = vi.fn()
  vi.mocked(usePrefetchSubmission).mockReturnValue(mockPrefetch)
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useHoverPrefetch', () => {
  it('calls prefetch with id after default delay', () => {
    const { result } = mountComposable()
    result.onEnter('sub-1')
    vi.advanceTimersByTime(300)
    expect(mockPrefetch).toHaveBeenCalledWith('sub-1')
  })

  it('does not call prefetch before delay elapses', () => {
    const { result } = mountComposable()
    result.onEnter('sub-1')
    vi.advanceTimersByTime(299)
    expect(mockPrefetch).not.toHaveBeenCalled()
  })

  it('respects custom delay', () => {
    const { result } = mountComposable()
    result.onEnter('sub-1', 500)
    vi.advanceTimersByTime(499)
    expect(mockPrefetch).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(mockPrefetch).toHaveBeenCalledWith('sub-1')
  })

  it('onLeave cancels a pending prefetch', () => {
    const { result } = mountComposable()
    result.onEnter('sub-1')
    result.onLeave()
    vi.advanceTimersByTime(300)
    expect(mockPrefetch).not.toHaveBeenCalled()
  })

  it('rapid re-enter resets the timer and fires for the last id only', () => {
    const { result } = mountComposable()
    result.onEnter('sub-a')
    vi.advanceTimersByTime(100)
    result.onEnter('sub-b')
    vi.advanceTimersByTime(300)
    expect(mockPrefetch).toHaveBeenCalledOnce()
    expect(mockPrefetch).toHaveBeenCalledWith('sub-b')
  })

  it('unmounting clears a pending prefetch', () => {
    const { result, wrapper } = mountComposable()
    result.onEnter('sub-1')
    wrapper.unmount()
    vi.advanceTimersByTime(300)
    expect(mockPrefetch).not.toHaveBeenCalled()
  })
})
