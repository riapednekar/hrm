<template>
  <nav class="dayflow-navbar">
    <div class="nav-container">
      <!-- Left: Logo, Portal Badge & Nav Links -->
      <div class="brand-section">
        <!-- Dayflow Logo (Lotus flower + text) -->
        <router-link :to="dashboardRoute" class="logo-group">
          <svg class="lotus-icon" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 23C4.5 19.5 5 15 8 13.5C11 12 14.5 15 17 21" stroke="#172033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 24C10 17 11.5 10 15 8C18 6 19.5 11 20 23" stroke="#172033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 5C17.5 10 17.5 19 20 25C22.5 19 22.5 10 20 5Z" stroke="#172033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 24C30 17 28.5 10 25 8C22 6 20.5 11 20 23" stroke="#172033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M33 23C35.5 19.5 35 15 32 13.5C29 12 25.5 15 23 21" stroke="#172033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 25C17 26 23 26 26 25" stroke="#172033" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span class="logo-text">Dayflow</span>
        </router-link>

        <!-- Portal Pill Badge -->
        <span v-if="user" class="portal-badge">
          {{ isAdmin ? 'Admin Portal' : 'Employee Portal' }}
        </span>

        <!-- Navigation Links -->
        <div v-if="user" class="nav-links">
          <template v-if="isAdmin">
            <router-link to="/admin/dashboard" class="nav-tab">Dashboard</router-link>
            <router-link to="/employees" class="nav-tab">Directory</router-link>
            <router-link to="/admin/attendance" class="nav-tab">Attendance</router-link>
            <router-link to="/admin/leaves" class="nav-tab">Leave Requests</router-link>
            <router-link to="/profile" class="nav-tab">My Profile</router-link>
          </template>
          <template v-else>
            <router-link to="/employee/dashboard" class="nav-tab">Dashboard</router-link>
            <router-link to="/attendance" class="nav-tab">Attendance</router-link>
            <router-link to="/leave" class="nav-tab">Time Off</router-link>
            <router-link to="/profile" class="nav-tab">My Profile</router-link>
          </template>
        </div>
      </div>

      <!-- Right: User Avatar & Logout -->
      <div v-if="user" class="user-section">
        <!-- User Avatar Circle -->
        <div class="user-avatar" :title="`${user.firstName || ''} ${user.lastName || ''} (${user.role || ''})`">
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
    isAdmin() {
      return (this.user?.role || '').toLowerCase() === 'admin';
    },
    dashboardRoute() {
      return this.isAdmin ? '/admin/dashboard' : '/employee/dashboard';
    },
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
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
  width: 28px;
  height: 24px;
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
  border: 1px solid #e9d5ff;
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
    overflow-x: auto;
  }
}
</style>