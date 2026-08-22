<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs px-6 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Left: Logo, Portal Badge & Nav Links -->
      <div class="flex items-center gap-6 lg:gap-8">
        <!-- Logo & Brand -->
        <router-link :to="homeRoute" class="flex items-center gap-2.5 text-decoration-none group">
          <img src="/logo.png" alt="Dayflow Logo" class="h-7 w-auto object-contain" />
          <span class="font-serif font-bold text-xl text-slate-900 tracking-tight" style="font-family: Georgia, serif;">Dayflow</span>
        </router-link>

        <!-- Portal Badge -->
        <span 
          v-if="user" 
          class="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block"
          :class="isAdmin ? 'bg-purple-100 border border-purple-200 text-[#593c8f]' : 'bg-purple-50 border border-purple-200 text-[#593c8f]'"
        >
          {{ isAdmin ? 'Admin Portal' : 'Employee Portal' }}
        </span>

        <!-- Navigation Links -->
        <div v-if="user" class="hidden md:flex items-center gap-5 text-sm font-medium">
          <template v-if="isAdmin">
            <router-link 
              to="/admin/dashboard" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/employees" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              Directory
            </router-link>
            <router-link 
              to="/admin/attendance" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              Attendance
            </router-link>
            <router-link 
              to="/admin/leaves" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              Leave Requests
            </router-link>
          </template>

          <template v-else>
            <router-link 
              to="/employee/dashboard" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/attendance" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              Attendance
            </router-link>
            <router-link 
              to="/leave" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              Time Off
            </router-link>
            <router-link 
              to="/profile" 
              class="text-slate-600 hover:text-[#593c8f] transition pb-1"
              active-class="text-[#593c8f] border-b-2 border-[#593c8f] font-bold"
            >
              My Profile
            </router-link>
          </template>
        </div>
      </div>

      <!-- Right: User Avatar & Logout Controls -->
      <div v-if="user" class="flex items-center gap-4">
        <!-- User Avatar Circle -->
        <router-link 
          to="/profile"
          class="w-9 h-9 rounded-full bg-[#593c8f] hover:bg-[#4a2e7b] text-white font-bold flex items-center justify-center border border-purple-300 focus:outline-none transition shadow-sm text-sm"
          :title="`${user.firstName} ${user.lastName} (${user.role})`"
        >
          {{ userInitials }}
        </router-link>

        <!-- Logout Button -->
        <button 
          @click="logout" 
          class="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer"
        >
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
    homeRoute() {
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
      localStorage.clear();
      this.$router.push('/login');
    },
  },
};
</script>