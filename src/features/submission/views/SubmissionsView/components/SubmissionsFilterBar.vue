<template>
  <div class="flex items-center gap-1">
    <Input v-model="searchInput" class="flex-1" type="text" placeholder="Search title…" />

    <Select :model-value="status ?? 'all'" @update:model-value="handleChangeStatus">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          All statuses
        </SelectItem>
        <SelectItem v-for="s in statusOptions" :key="s" :value="s">
          {{ s }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select :model-value="type ?? 'all'" @update:model-value="handleChangeType">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          All types
        </SelectItem>
        <SelectItem v-for="t in typeOptions" :key="t" :value="t">
          {{ t }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select :model-value="tier ?? 'all'" @update:model-value="handleChangeTier">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          All tiers
        </SelectItem>
        <SelectItem v-for="r in tierOptions" :key="r" :value="r">
          {{ r }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Button variant="secondary" class="ml-auto w-20" :disabled="activeCount === 0" @click="handleReset">
      Reset{{ activeCount > 0 ? ` (${activeCount})` : '' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { FilterPatch } from '../composables/useFiltersRouteQuery'
import type { SubmissionFilters } from '../exports'
import { useDebounceFn } from '@vueuse/core'
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

function createHandler<K extends keyof Omit<FilterPatch, 'search'>>(key: K) {
  return (val: unknown) => {
    const finalVal = val === 'all' ? undefined : (val)
    setFilters({ [key]: finalVal } satisfies FilterPatch)
  }
}

const handleChangeStatus = createHandler('status')
const handleChangeType = createHandler('type')
const handleChangeTier = createHandler('tier')

function handleReset() {
  // searchInput.value = ''
  reset()
}
</script>
