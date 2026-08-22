<template>
  <div class="tabs-container">
    <div class="tabs-list">
      <button 
        v-for="tab in visibleTabs" 
        :key="tab.id"
        :class="['tab-btn', { active: modelValue === tab.id }]"
        @click="$emit('update:modelValue', tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.name }}</span>
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: 'resume'
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);

const allTabs = [
  { id: 'resume', name: 'Resume', icon: '📄' },
  { id: 'private', name: 'Private Info', icon: '🔒' },
  { id: 'salary', name: 'Salary Info', icon: '💰', badge: 'Admin Only', adminOnly: true },
  { id: 'security', name: 'Security', icon: '🛡️' }
];

const visibleTabs = computed(() => {
  return allTabs.filter(tab => !tab.adminOnly || props.isAdmin);
});
</script>

<style scoped>
.tabs-container {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 12px 12px 0 0;
  padding: 0.5rem 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.tabs-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-list::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #5b21b6;
  background: #faf5ff;
  border-radius: 8px 8px 0 0;
}

.tab-btn.active {
  color: #5b21b6;
  border-bottom-color: #5b21b6;
  background: #faf5ff;
  border-radius: 8px 8px 0 0;
}

.tab-icon {
  font-size: 1rem;
}

.tab-badge {
  font-size: 0.7rem;
  background-color: #f3e8ff;
  color: #7e22ce;
  border: 1px solid #e9d5ff;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  margin-left: 0.25rem;
  font-weight: 700;
}
</style>
