<template>
  <nav class="dayflow-navbar">
    <div class="nav-container">
      <div class="brand-section">
        <!-- Dayflow Logo (Lotus flower + text) -->
        <div class="logo-group">
          <svg class="lotus-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4C16 4 11 12 11 18C11 20.7614 13.2386 23 16 23C18.7614 23 21 20.7614 21 18C21 12 16 4 16 4Z" fill="#172033"/>
            <path d="M16 11C16 11 9 15 6 20C4.34315 22.7614 5.23858 26 8 26C11 26 14 23 16 19C16 19 16 11 16 11Z" fill="#6040A0" fill-opacity="0.9"/>
            <path d="M16 11C16 11 23 15 26 20C27.6569 22.7614 26.7614 26 24 26C21 26 18 23 16 19C16 19 16 11 16 11Z" fill="#6040A0" fill-opacity="0.9"/>
          </svg>
          <span class="logo-text">Dayflow</span>
        </div>

        <!-- Portal Pill Badge -->
        <span v-if="user" class="portal-badge">
          {{ user.role === 'Admin' ? 'Admin Portal' : 'Employee Portal' }}
        </span>

        <!-- Navigation Links -->
        <div v-if="user" class="nav-links">
          <template v-if="user.role === 'Admin'">
            <router-link to="/employees" class="nav-tab">Directory</router-link>
            <router-link to="/admin/attendance" class="nav-tab">Attendance</router-link>
            <router-link to="/admin/leaves" class="nav-tab">Leave Requests</router-link>
          </template>
          <template v-else>
            <router-link to="/attendance" class="nav-tab">Attendance</router-link>
            <router-link to="/leave" class="nav-tab">Time Off</router-link>
          </template>
        </div>
      </div>

      <!-- Right User Controls -->
      <div v-if="user" class="user-section">
        <!-- Avatar Circle -->
        <div class="user-avatar" :title="`${user.firstName} ${user.lastName} (${user.role})`">
          {{ userInitials }}
        </div>

        <!-- Logout Button -->
        <button @click="logout" class="logout-btn" title="Sign out">
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') || 'null'),
    };
  },
  computed: {
    userInitials() {
      if (!this.user) return 'DF';
      const first = (this.user.firstName || '').charAt(0).toUpperCase();
      const last = (this.user.lastName || '').charAt(0).toUpperCase();
      return `${first}${last}` || 'U';
    },
  },
  watch: {
    $route() {
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.dayflow-navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e7eaf0;
  padding: 0.65rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1250px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.lotus-icon {
  width: 26px;
  height: 26px;
}

.logo-text {
  font-size: 1.35rem;
  font-weight: 800;
  color: #172033;
  letter-spacing: -0.03em;
  font-family: Georgia, serif, system-ui;
}

.portal-badge {
  background-color: #f3eefa;
  color: #6040a0;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.75rem;
}

.nav-tab {
  color: #7b8496;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  transition: all 0.15s ease;
  position: relative;
}

.nav-tab:hover {
  color: #172033;
}

.nav-tab.router-link-active {
  color: #172033;
  font-weight: 700;
}

.nav-tab.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.65rem;
  left: 0.9rem;
  right: 0.9rem;
  height: 2.5px;
  background-color: #6040a0;
  border-radius: 2px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #6040a0;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
}

.logout-btn {
  background-color: #ffffff;
  color: #dc2626;
  border: 1px solid #fee2e2;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #fef2f2;
  border-color: #fca5a5;
}

@media (max-width: 768px) {
  .dayflow-navbar {
    padding: 0.6rem 1rem;
  }
  .portal-badge {
    display: none;
  }
  .nav-links {
    gap: 0.25rem;
  }
}
</style>