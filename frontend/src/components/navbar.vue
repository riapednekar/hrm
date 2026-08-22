<template>
<<<<<<< HEAD
  <nav class="navbar">
    <div class="nav-left">
      <!-- Dayflow Lotus Logo & Brand -->
      <router-link to="/employees" class="brand-link">
        <svg class="dayflow-lotus-icon" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Left Petal -->
          <path d="M7 23C4.5 19.5 5 15 8 13.5C11 12 14.5 15 17 21" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Inner Left Petal -->
          <path d="M12 24C10 17 11.5 10 15 8C18 6 19.5 11 20 23" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Central Petal -->
          <path d="M20 5C17.5 10 17.5 19 20 25C22.5 19 22.5 10 20 5Z" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Inner Right Petal -->
          <path d="M28 24C30 17 28.5 10 25 8C22 6 20.5 11 20 23" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Outer Right Petal -->
          <path d="M33 23C35.5 19.5 35 15 32 13.5C29 12 25.5 15 23 21" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Base connect -->
          <path d="M14 25C17 26 23 26 26 25" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span class="brand-title">Dayflow</span>
      </router-link>

      <!-- Portal Tag Badge -->
      <span class="portal-badge">{{ user?.role === 'Admin' ? 'Admin Portal' : 'Employee Portal' }}</span>

      <!-- Nav Links -->
      <div v-if="user" class="nav-links">
        <router-link v-if="user.role === 'Admin'" to="/employees" class="nav-item" active-class="active-link">
          Directory
        </router-link>
        <router-link to="/profile" class="nav-item" active-class="active-link">
          My Profile
        </router-link>
      </div>
    </div>

    <!-- Right Side User & Actions -->
    <div v-if="user" class="nav-right">
      <!-- Check In Status Pill -->
      <div class="check-in-pill">
        <span class="status-dot"></span>
        <span class="check-in-text">Check In</span>
      </div>

      <!-- User Initials Circle Avatar -->
      <div class="user-avatar-circle" :title="`${user.firstName} ${user.lastName}`">
        {{ getInitials(user) }}
      </div>

      <!-- Logout Button -->
      <button @click="logout" class="logout-btn">Logout</button>
=======
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
>>>>>>> member3
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
    getInitials(user) {
      if (!user) return 'JD';
      const f = (user.firstName || 'J').charAt(0).toUpperCase();
      const l = (user.lastName || 'D').charAt(0).toUpperCase();
      return `${f}${l}`;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
<<<<<<< HEAD
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.dayflow-lotus-icon {
  width: 32px;
  height: 28px;
  flex-shrink: 0;
}

.brand-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
  font-family: Georgia, Cambria, 'Times New Roman', Times, serif;
}

.portal-badge {
  background-color: #f3e8ff;
  color: #6b21a8;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid #e9d5ff;
=======
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
>>>>>>> member3
}

.nav-links {
  display: flex;
<<<<<<< HEAD
  gap: 1.5rem;
  margin-left: 1.5rem;
}

.nav-item {
  color: #64748b;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.4rem 0.2rem;
  position: relative;
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: #4c1d95;
}

.active-link {
  color: #5b21b6 !important;
}

.active-link::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #5b21b6;
  border-radius: 2px 2px 0 0;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.check-in-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.2s;
}

.check-in-pill:hover {
  background: #f1f5f9;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
}

.user-avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4c1d95;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(76, 29, 149, 0.2);
}

.logout-btn {
  padding: 0.4rem 0.85rem;
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
=======
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
>>>>>>> member3
  transition: all 0.2s;
}

.logout-btn:hover {
<<<<<<< HEAD
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
=======
  background-color: #fef2f2;
  border-color: #fca5a5;
}

@media (max-width: 768px) {
  .dayflow-navbar {
    padding: 0.6rem 1rem;
>>>>>>> member3
  }
  .portal-badge {
    display: none;
  }
  .nav-links {
<<<<<<< HEAD
    margin-left: 0.5rem;
    gap: 0.75rem;
=======
    gap: 0.25rem;
>>>>>>> member3
  }
}
</style>