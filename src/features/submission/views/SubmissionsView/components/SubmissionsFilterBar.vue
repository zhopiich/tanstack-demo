<template>
  <div>
    <input v-model="searchInput" type="search" placeholder="Search title…">
    <select :value="status" @change="handleSetFilters('status', $event)">
      <option value="">
        All statuses
      </option>
      <option v-for="s in statusOptions" :key="s" :value="s">
        {{ s }}
      </option>
    </select>
    <select :value="type" @change="handleSetFilters('type', $event)">
      <option value="">
        All types
      </option>
      <option v-for="t in typeOptions" :key="t" :value="t">
        {{ t }}
      </option>
    </select>
    <select :value="tier" @change="handleSetFilters('tier', $event)">
      <option value="">
        All tiers
      </option>
      <option v-for="r in tierOptions" :key="r" :value="r">
        {{ r }}
      </option>
    </select>
    <button v-if="activeCount > 0" @click="handleReset">
      Reset ({{ activeCount }})
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SubmissionFilters } from '../exports'
import { useDebounceFn } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useFiltersRouteQuery } from '../composables/useFiltersRouteQuery'

const { status, type, tier, search, activeCount, setFilters, reset } = useFiltersRouteQuery()

const statusOptions: NonNullable<SubmissionFilters['status']>[] = ['pending', 'approved', 'rejected', 'flagged']
const typeOptions: NonNullable<SubmissionFilters['type']>[] = ['article', 'image', 'video', 'link']
const tierOptions: NonNullable<SubmissionFilters['tier']>[] = ['free', 'pro', 'verified']

const searchInput = ref(search.value ?? '')

const updateSearch = useDebounceFn((val: string) => {
  setFilters({ search: val || undefined })
}, 300)

watch(searchInput, updateSearch)

watch(search, (val) => {
  if (!val)
    searchInput.value = ''
})

function handleSetFilters<K extends keyof Pick<
  SubmissionFilters,
'status' | 'type' | 'tier'
>>(
  key: K,
  event: Event,
) {
  const target = event.target as HTMLSelectElement
  const value = target.value || undefined
  setFilters({ [key]: value as SubmissionFilters[K] })
}

function handleReset() {
  // searchInput.value = ''
  reset()
}
</script>
