import { onUnmounted } from 'vue'
import { usePrefetchSubmission } from '../../../queries/usePrefetchSubmission'

export function useHoverPrefetch() {
  const prefetchSubmission = usePrefetchSubmission()

  let timer: ReturnType<typeof setTimeout> | null = null
  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  onUnmounted(clear)
  return {
    onEnter: (id: string | number, delay = 300) => {
      clear()
      timer = setTimeout(prefetchSubmission, delay, id)
    },
    onLeave: clear,
  }
}
