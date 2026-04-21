<template>
  <Button as-child variant="outline" size="sm">
    <RouterLink to="/submissions/new">
      <Plus class="size-4" />
      New Submission
    </RouterLink>
  </Button>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>
