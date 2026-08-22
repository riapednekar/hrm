<template>
  <div class="directory-page">
    <navbar />
    
    <div class="container">
      <!-- Top Header Banner -->
      <div class="header-section">
        <div>
          <span class="tag-pill">• Dayflow</span>
          <h1 class="page-title">Employee Directory</h1>
          <p class="page-sub">Comprehensive overview of company personnel and payroll structures.</p>
        </div>
      </div>

      <!-- Employee Cards Grid -->
      <div class="grid">
        <div v-for="emp in employees" :key="emp._id" class="employee-card" @click="openModal(emp)">
          <div class="card-top">
            <span class="card-section-label">EMPLOYEE PROFILE</span>
            <span class="id-pill">ID: {{ emp.loginId || emp.employeeId || 'EMP-1001' }}</span>
          </div>

          <div class="card-body">
            <div class="field-group">
              <span class="field-label">Full Name</span>
              <h3 class="emp-name">{{ emp.firstName }} {{ emp.lastName }}</h3>
            </div>

            <div class="field-group">
              <span class="field-label">Email Address</span>
              <p class="field-val">{{ emp.email || 'employee@dayflow.com' }}</p>
            </div>

            <div class="field-group">
              <span class="field-label">Phone Number</span>
              <p class="field-val">{{ emp.phone || '9988776655' }}</p>
            </div>

            <div class="field-group">
              <span class="field-label">Department & Designation</span>
              <p class="field-val">{{ emp.department || 'General' }} • {{ emp.designation || 'Associate' }}</p>
            </div>
          </div>

          <div class="card-bottom">
            <span>Role: <strong class="role-bold">{{ emp.role || 'EMPLOYEE' }}</strong></span>
            <span class="joined-text">Joined: {{ emp.yearOfJoining || 2026 }}</span>
          </div>
        </div>
      </div>

      <!-- Employee Detail Modal -->
      <div v-if="selectedEmployee" class="modal-overlay" @click.self="selectedEmployee = null">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Employee Details</h3>
            <span class="id-pill">ID: {{ selectedEmployee.loginId || selectedEmployee.employeeId }}</span>
          </div>

          <div class="modal-fields">
            <div class="modal-field-item">
              <span class="m-label">Name</span>
              <span class="m-val">{{ selectedEmployee.firstName }} {{ selectedEmployee.lastName }}</span>
            </div>
            <div class="modal-field-item">
              <span class="m-label">Email</span>
              <span class="m-val">{{ selectedEmployee.email }}</span>
            </div>
            <div class="modal-field-item">
              <span class="m-label">Role</span>
              <span class="m-val">{{ selectedEmployee.role }}</span>
            </div>
            <div class="modal-field-item">
              <span class="m-label">Department</span>
              <span class="m-val">{{ selectedEmployee.department || 'General' }}</span>
            </div>
            <div class="modal-field-item">
              <span class="m-label">Designation</span>
              <span class="m-val">{{ selectedEmployee.designation || 'Associate' }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="goToProfile(selectedEmployee)" class="btn-purple">View Profile & Payroll</button>
            <button @click="selectedEmployee = null" class="btn-outline">Close</button>
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
      selectedEmployee: null 
    };
  },
  async mounted() {
    try {
      const res = await api.get('/employees');
      this.employees = res.data;
    } catch (err) {
      console.warn('Could not fetch employees, using local profile fallback');
      // Fallback mock if backend empty
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.employees = [
        {
          _id: '1',
          firstName: user.firstName || 'Jane',
          lastName: user.lastName || 'Doe',
          email: user.email || 'jane.doe@acme.com',
          phone: user.phone || '9988776655',
          loginId: user.loginId || 'DAJADO20260002',
          role: user.role || 'Admin',
          department: 'General',
          designation: 'Associate',
          yearOfJoining: 2026
        }
      ];
    }
  },
  methods: {
    openModal(emp) { this.selectedEmployee = emp; },
    goToProfile(emp) {
      if (emp._id) {
        this.$router.push(`/profile/${emp._id}`);
      } else {
        this.$router.push('/profile');
      }
    }
  },
};
</script>

<style scoped>
.directory-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #0f172a;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.header-section {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.tag-pill {
  background: #f3e8ff;
  color: #6b21a8;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.4rem 0;
  letter-spacing: -0.5px;
}

.page-sub {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.employee-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.employee-card:hover {
  border-color: #c084fc;
  box-shadow: 0 6px 20px rgba(107, 33, 168, 0.08);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.card-section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.5px;
}

.id-pill {
  background: #f3e8ff;
  color: #6b21a8;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.field-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.emp-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.field-val {
  font-size: 0.9rem;
  color: #334155;
  margin: 0;
  font-weight: 500;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.8rem;
  color: #64748b;
}

.role-bold {
  color: #5b21b6;
  text-transform: uppercase;
}

.joined-text {
  color: #94a3b8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  width: 420px;
  max-width: 95vw;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.75rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.modal-fields {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.75rem;
}

.modal-field-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.m-label {
  color: #64748b;
}

.m-val {
  color: #0f172a;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-purple {
  flex: 1;
  padding: 0.65rem 1rem;
  background: #4c1d95;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-purple:hover {
  background: #3b0764;
}

.btn-outline {
  padding: 0.65rem 1.25rem;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #f8fafc;
  color: #0f172a;
}
</style>
