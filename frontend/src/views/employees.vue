<template>
  <div class="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans">
    <!-- Top Navbar -->
    <header class="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div class="flex items-center gap-8">
        <!-- Company Logo & Name -->
        <div class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Dayflow Logo" class="h-8 w-auto object-contain" />
          <span class="font-serif font-bold text-xl text-slate-900 tracking-tight" style="font-family: Georgia, serif;">Dayflow</span>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center gap-6 text-sm font-medium">
          <router-link to="/employees" class="text-[#593c8f] border-b-2 border-[#593c8f] pb-1 font-bold">Employees</router-link>
          <router-link to="/admin/dashboard" v-if="isAdmin" class="text-slate-500 hover:text-slate-900 transition">Admin Dashboard</router-link>
          <router-link to="/employee/dashboard" class="text-slate-500 hover:text-slate-900 transition">My Portal</router-link>
        </div>
      </div>

      <!-- Right Section: Attendance Toggle & Profile Menu -->
      <div class="flex items-center gap-4">
        <!-- Attendance Toggle Button -->
        <div class="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
          <span class="w-2.5 h-2.5 rounded-full" :class="isCheckedIn ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'"></span>
          <button 
            @click="toggleAttendance" 
            class="text-xs font-semibold px-3 py-1 rounded-lg transition cursor-pointer"
            :class="isCheckedIn ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#593c8f] hover:bg-[#4a2e7b] text-white'"
          >
            {{ isCheckedIn ? 'Check Out' : 'Check In' }}
          </button>
        </div>

        <!-- User Profile Avatar & Dropdown -->
        <div class="relative">
          <button @click="showMenu = !showMenu" class="w-9 h-9 rounded-full bg-[#593c8f] hover:bg-[#4a2e7b] text-white font-bold flex items-center justify-center border border-purple-300 focus:outline-none transition cursor-pointer shadow-sm text-sm">
            {{ userInitials }}
          </button>

          <!-- Dropdown Menu -->
          <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-sm">
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="font-bold text-slate-900 text-xs truncate">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="text-[11px] text-slate-400 font-mono truncate">{{ user.email }}</p>
            </div>
            <button @click="openMyProfile" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs cursor-pointer">My Profile</button>
            <hr class="border-slate-100 my-1" />
            <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-rose-600 text-xs font-semibold cursor-pointer">Log Out</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
      <!-- Action Bar: Add Button & Search -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm">
        <div class="flex items-center gap-3">
          <button 
            v-if="isAdmin" 
            @click="$router.push('/admin/dashboard')" 
            class="px-5 py-2.5 bg-[#593c8f] hover:bg-[#4a2e7b] active:scale-95 text-white font-semibold text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            + Add / Manage in Admin
          </button>
          <h1 class="text-base font-bold text-slate-900">Employee Directory</h1>
        </div>

        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search employee..." 
            class="w-full sm:w-72 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs"
          />
          <span v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs">✕</span>
        </div>
      </div>

      <!-- Employee Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          v-for="emp in filteredEmployees" 
          :key="emp._id" 
          @click="viewEmployeeProfile(emp._id)"
          class="bg-white border border-slate-200/90 hover:border-[#593c8f]/60 rounded-2xl p-5 cursor-pointer hover:shadow-md transition relative group flex flex-col items-center shadow-xs"
        >
          <!-- Status Indicator Icon -->
          <div class="absolute top-4 right-4">
            <span v-if="emp.status === 'present'" class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] block" title="Present in office"></span>
            <span v-else-if="emp.status === 'on_leave'" class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] block" title="On leave"></span>
            <span v-else class="w-3 h-3 rounded-full bg-slate-300 block" title="Offline"></span>
          </div>

          <!-- Profile Avatar -->
          <div class="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center my-3 text-[#593c8f] font-bold text-lg group-hover:border-[#593c8f] transition shadow-2xs">
            {{ getInitials(emp.firstName, emp.lastName) }}
          </div>

          <!-- Basic Employee Details -->
          <h3 class="font-bold text-slate-900 text-sm text-center group-hover:text-[#593c8f] transition">{{ emp.firstName }} {{ emp.lastName }}</h3>
          <p class="text-[11px] text-slate-500 font-mono mt-0.5">{{ emp.loginId }}</p>
          <p class="text-[11px] text-slate-600 mt-1">{{ emp.department || 'General' }} • {{ emp.designation || 'Associate' }}</p>
          <span 
            class="mt-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
            :class="emp.role === 'admin' ? 'bg-purple-100 text-[#593c8f] border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-200'"
          >
            {{ emp.role }}
          </span>
        </div>

        <div v-if="filteredEmployees.length === 0" class="col-span-full py-12 text-center text-slate-400 text-xs">
          No employees found matching "{{ searchQuery }}".
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return {
      employees: [],
      searchQuery: '',
      showMenu: false,
      isCheckedIn: false,
      user: JSON.parse(localStorage.getItem('user') || '{}'),
    };
  },
  computed: {
    userInitials() {
      const name = this.user.firstName || 'U';
      return name.charAt(0).toUpperCase();
    },
    isAdmin() {
      return (this.user.role || '').toLowerCase() === 'admin';
    },
    filteredEmployees() {
      return this.employees.filter((e) =>
        `${e.firstName} ${e.lastName} ${e.loginId} ${e.department || ''}`.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  async mounted() {
    await this.fetchEmployees();
  },
  methods: {
    getInitials(fn, ln) {
      return ((fn ? fn.charAt(0) : '') + (ln ? ln.charAt(0) : '')).toUpperCase() || 'E';
    },
    async fetchEmployees() {
      try {
        const res = await api.get('/employees');
        this.employees = res.data;
      } catch (err) {
        console.error('Failed to load employees', err);
      }
    },
    toggleAttendance() {
      this.isCheckedIn = !this.isCheckedIn;
      if (this.user) {
        this.user.status = this.isCheckedIn ? 'present' : 'absent';
      }
    },
    viewEmployeeProfile(id) {
      this.$router.push(`/employees/${id}`);
    },
    openMyProfile() {
      this.$router.push(`/employees/${this.user._id || this.user.id}`);
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
  },
};
</script>