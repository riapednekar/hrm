<template>
  <div class="page-container">
    <navbar />

    <div class="content-body">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading Profile...</p>
      </div>

      <!-- Main Profile View -->
      <div v-else class="profile-layout">
        <!-- Top Profile Header -->
        <ProfileHeader :employee="employee" />

        <!-- Tabs Navigation with Role-Based Visibility -->
        <ProfileTabs v-model="activeTab" :is-admin="isAdmin" />

        <!-- Active Tab Content Area -->
        <div class="tab-content-wrapper">
          <transition name="fade" mode="out-in">
            <component 
              :is="currentTabComponent" 
              :employee="employee"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import navbar from '../../components/navbar.vue';
import ProfileHeader from '../../components/profile/ProfileHeader.vue';
import ProfileTabs from '../../components/profile/ProfileTabs.vue';
import ResumeTab from './ResumeTab.vue';
import PrivateInfo from './PrivateInfo.vue';
import SalaryInfo from './SalaryInfo.vue';
import Security from './Security.vue';
import api from '../../api/axios';

const route = useRoute();
const loading = ref(false);

const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = computed(() => loggedInUser.role === 'Admin');

// Default active tab (resume for all users, salary only if admin requested)
const activeTab = ref('resume');

const employee = ref({
  firstName: loggedInUser.firstName || 'John',
  lastName: loggedInUser.lastName || 'Doe',
  email: loggedInUser.email || 'john.doe@company.com',
  phone: loggedInUser.phone || '+91 98765 43210',
  loginId: loggedInUser.loginId || loggedInUser.employeeId || 'EMP-2026-001',
  role: loggedInUser.role || 'Employee',
  designation: loggedInUser.designation || 'Senior Software Engineer',
  companyName: loggedInUser.companyName || 'TechCorp Global',
  department: loggedInUser.department || 'Engineering & Product',
  manager: 'Sarah Jenkins (VP Eng)',
  location: 'Mumbai, India (HQ)',
  yearOfJoining: loggedInUser.yearOfJoining || 2024,
  status: 'Active'
});

const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'resume':
      return ResumeTab;
    case 'private':
      return PrivateInfo;
    case 'salary':
      return isAdmin.value ? SalaryInfo : PrivateInfo;
    case 'security':
      return Security;
    default:
      return ResumeTab;
  }
});

const fetchEmployeeProfile = async () => {
  const empId = route.params.id;
  if (empId) {
    loading.value = true;
    try {
      const res = await api.get(`/employees/${empId}`);
      if (res.data) {
        employee.value = {
          ...employee.value,
          ...res.data,
          loginId: res.data.loginId || res.data.employeeId || 'EMP-2026-001'
        };
      }
    } catch (err) {
      console.warn('Could not fetch specific employee by ID from backend, using local context.', err);
    } finally {
      loading.value = false;
    }
  }
};

onMounted(() => {
  fetchEmployeeProfile();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.content-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.profile-layout {
  display: flex;
  flex-direction: column;
}

.tab-content-wrapper {
  animation: fadeIn 0.3s ease-in-out;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #5b21b6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>