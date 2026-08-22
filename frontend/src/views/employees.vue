<template>
  <div class="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans">
    <!-- Navbar Component -->
    <Navbar />

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
          <div>
            <h1 class="text-lg font-bold text-slate-900">Employee Directory</h1>
            <p class="text-xs text-slate-500">Comprehensive overview of company personnel and roles.</p>
          </div>
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
          @click="openModal(emp)"
          class="bg-white border border-slate-200/90 hover:border-[#593c8f]/60 rounded-2xl p-5 cursor-pointer hover:shadow-md transition relative group flex flex-col items-center shadow-xs"
        >
          <!-- Role Badge Top Right -->
          <span 
            class="absolute top-3.5 right-3.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
            :class="(emp.role || '').toLowerCase() === 'admin' ? 'bg-purple-100 text-[#593c8f] border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-200'"
          >
            {{ emp.role || 'Employee' }}
          </span>

          <!-- Profile Avatar -->
          <div class="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center my-3 text-[#593c8f] font-bold text-lg group-hover:border-[#593c8f] transition shadow-2xs">
            {{ getInitials(emp.firstName, emp.lastName) }}
          </div>

          <!-- Details -->
          <h3 class="font-bold text-slate-900 text-sm text-center group-hover:text-[#593c8f] transition">{{ emp.firstName }} {{ emp.lastName }}</h3>
          <p class="text-[11px] text-slate-500 font-mono mt-0.5">{{ emp.loginId || emp.employeeId }}</p>
          <p class="text-[11px] text-slate-600 mt-1">{{ emp.department || 'General' }} • {{ emp.designation || 'Associate' }}</p>
          <p class="text-[10px] text-slate-400 mt-1 truncate max-w-full">{{ emp.email }}</p>

          <button class="mt-4 w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-[#593c8f] text-[11px] font-bold rounded-lg border border-purple-200 transition cursor-pointer">
            View Details →
          </button>
        </div>

        <div v-if="filteredEmployees.length === 0" class="col-span-full py-12 text-center text-slate-400 text-xs">
          No employees found matching "{{ searchQuery }}".
        </div>
      </div>

      <!-- Employee Detail Modal -->
      <div v-if="selectedEmployee" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" @click.self="selectedEmployee = null">
        <div class="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-[#593c8f] font-bold">
                {{ getInitials(selectedEmployee.firstName, selectedEmployee.lastName) }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-base">{{ selectedEmployee.firstName }} {{ selectedEmployee.lastName }}</h3>
                <p class="text-xs text-slate-500 font-mono">{{ selectedEmployee.loginId || selectedEmployee.employeeId }}</p>
              </div>
            </div>
            <button @click="selectedEmployee = null" class="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="text-slate-400 block font-semibold">Email</span>
              <span class="text-slate-900 font-medium truncate block mt-0.5">{{ selectedEmployee.email }}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="text-slate-400 block font-semibold">Phone</span>
              <span class="text-slate-900 font-medium truncate block mt-0.5">{{ selectedEmployee.phone || 'Not provided' }}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="text-slate-400 block font-semibold">Department</span>
              <span class="text-slate-900 font-medium truncate block mt-0.5">{{ selectedEmployee.department || 'General' }}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="text-slate-400 block font-semibold">Designation</span>
              <span class="text-slate-900 font-medium truncate block mt-0.5">{{ selectedEmployee.designation || 'Associate' }}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="text-slate-400 block font-semibold">Role</span>
              <span class="text-[#593c8f] font-bold uppercase truncate block mt-0.5">{{ selectedEmployee.role }}</span>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span class="text-slate-400 block font-semibold">Joined</span>
              <span class="text-slate-900 font-medium truncate block mt-0.5">{{ selectedEmployee.yearOfJoining || 2026 }}</span>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button @click="goToProfile(selectedEmployee)" class="px-4 py-2 bg-[#593c8f] hover:bg-[#4a2e7b] text-white text-xs font-semibold rounded-xl transition cursor-pointer">
              Full Profile View →
            </button>
            <button @click="selectedEmployee = null" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue';
import api from '../api/axios';

export default {
  name: 'Employees',
  components: {
    Navbar,
  },
  data() {
    return {
      employees: [],
      searchQuery: '',
      selectedEmployee: null,
      user: JSON.parse(localStorage.getItem('user') || '{}'),
    };
  },
  computed: {
    isAdmin() {
      return (this.user.role || '').toLowerCase() === 'admin';
    },
    filteredEmployees() {
      const q = this.searchQuery.toLowerCase();
      return this.employees.filter((e) =>
        `${e.firstName} ${e.lastName} ${e.loginId || ''} ${e.employeeId || ''} ${e.department || ''} ${e.email || ''}`
          .toLowerCase()
          .includes(q)
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
    openModal(emp) {
      this.selectedEmployee = emp;
    },
    goToProfile(emp) {
      this.$router.push(`/employees/${emp._id || emp.id}`);
    },
  },
};
</script>
