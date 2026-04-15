<template>
  <div class="mock-panel">
    <div class="header">
      Mock
    </div>
    <label>
      <input :checked="active" type="checkbox" @change="toggleStatusUpdateError">
      Simulate Status Update Error
    </label>
  </div>
</template>

<script setup lang="ts">
import { useMockScenario } from './useMockScenario'

const { active, toggleStatusUpdateError } = useMockScenario()
</script>

<style scoped>
.mock-panel {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  background: #1a1a1a;
  color: white;
  padding: 0.6rem;
  font-size: 0.85rem;
  border-radius: 0.25rem;
}
.header {
  border-bottom: 1px solid #444;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  font-weight: bold;
}
</style>
