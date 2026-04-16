<template>
  <div>
    <input v-model="searchInput" type="search" placeholder="Search title…">
    <select :value="status" @change="status = ($event.target as HTMLSelectElement).value as SubmissionFilters['status'] || undefined">
      <option value="">
        All statuses
      </option>
      <option v-for="s in statusOptions" :key="s" :value="s">
        {{ s }}
      </option>
    </select>
    <select :value="type" @change="type = ($event.target as HTMLSelectElement).value as SubmissionFilters['type'] || undefined">
      <option value="">
        All types
      </option>
      <option v-for="t in typeOptions" :key="t" :value="t">
        {{ t }}
      </option>
    </select>
    <button v-if="isFiltered" @click="reset">
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SubmissionFilters } from '../exports'
import { useDebounceFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const status = defineModel<SubmissionFilters['status'] | undefined>('status')
const type = defineModel<SubmissionFilters['type'] | undefined>('type')
const search = defineModel<string | undefined>('search')

const statusOptions: NonNullable<SubmissionFilters['status']>[] = ['pending', 'approved', 'rejected', 'flagged']
const typeOptions: NonNullable<SubmissionFilters['type']>[] = ['article', 'image', 'video', 'link']

const searchInput = ref(search.value ?? '')

const updateSearch = useDebounceFn((val: string) => {
  search.value = val || undefined
}, 300)

watch(searchInput, updateSearch)

const isFiltered = computed(() => !!status.value || !!type.value || !!search.value)

function reset() {
  status.value = undefined
  type.value = undefined
  search.value = undefined
  searchInput.value = ''
}
</script>
