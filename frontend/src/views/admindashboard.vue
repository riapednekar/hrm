<template>
  <div class="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans">
    <!-- Top Admin Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-8">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Dayflow Logo" class="h-8 w-auto object-contain" />
          <span class="font-serif font-bold text-xl text-slate-900 tracking-tight" style="font-family: Georgia, serif;">Dayflow</span>
          <span class="text-xs bg-purple-100 border border-purple-300 text-[#593c8f] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">Admin Portal</span>
        </div>

        <!-- Navigation Tabs -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <button 
            @click="activeTab = 'employees'" 
            class="transition cursor-pointer pb-1"
            :class="activeTab === 'employees' ? 'text-[#593c8f] border-b-2 border-[#593c8f] font-bold' : 'text-slate-500 hover:text-slate-900'"
          >
            Employee Directory
          </button>
          <button 
            @click="activeTab = 'attendance'" 
            class="transition cursor-pointer pb-1"
            :class="activeTab === 'attendance' ? 'text-[#593c8f] border-b-2 border-[#593c8f] font-bold' : 'text-slate-500 hover:text-slate-900'"
          >
            Attendance Logs
          </button>
          <button 
            @click="activeTab = 'leaves'" 
            class="transition cursor-pointer pb-1 relative"
            :class="activeTab === 'leaves' ? 'text-[#593c8f] border-b-2 border-[#593c8f] font-bold' : 'text-slate-500 hover:text-slate-900'"
          >
            Leave Approvals
            <span v-if="pendingLeavesCount > 0" class="ml-1.5 px-1.5 py-0.2 text-[10px] bg-amber-500 text-white font-bold rounded-full">
              {{ pendingLeavesCount }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Right Header Actions: User Menu -->
      <div class="flex items-center gap-4">
        <!-- Admin Badge -->
        <div class="hidden sm:flex items-center gap-2 text-xs bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
          <span class="w-2 h-2 rounded-full bg-[#593c8f]"></span>
          <span class="font-bold text-[#593c8f]">{{ user.firstName }} {{ user.lastName }} (Admin)</span>
        </div>

        <!-- Dropdown & Logout -->
        <div class="relative">
          <button 
            @click="showDropdown = !showDropdown" 
            class="w-9 h-9 rounded-full bg-[#593c8f] hover:bg-[#4a2e7b] text-white font-bold flex items-center justify-center border border-purple-300 focus:outline-none transition cursor-pointer shadow-sm text-sm"
          >
            {{ userInitials }}
          </button>

          <!-- Dropdown -->
          <div 
            v-if="showDropdown" 
            class="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-sm"
          >
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="font-bold text-slate-900 text-xs truncate">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="text-[11px] text-slate-400 font-mono truncate">{{ user.email }}</p>
            </div>
            <button @click="openAddEmployeeModal(); showDropdown = false" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs cursor-pointer">Add New Employee</button>
            <button @click="$router.push('/employee/dashboard')" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-[#593c8f] text-xs font-semibold cursor-pointer">Switch to Employee View</button>
            <hr class="border-slate-100 my-1" />
            <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-rose-600 text-xs font-semibold cursor-pointer">Log Out</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- Stats Overview Top Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Staff</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">{{ employees.length }}</p>
        </div>
        <div class="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Today</p>
          <p class="text-2xl font-extrabold text-emerald-600 mt-1">{{ presentTodayCount }}</p>
        </div>
        <div class="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pending Leaves</p>
          <p class="text-2xl font-extrabold text-amber-600 mt-1">{{ pendingLeavesCount }}</p>
        </div>
        <div class="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Organization</p>
          <p class="text-sm font-bold text-[#593c8f] mt-2 truncate">{{ user.companyName || 'Dayflow Inc.' }}</p>
        </div>
      </div>

      <!-- TAB 1: EMPLOYEE DIRECTORY & SELECTION -->
      <div v-if="activeTab === 'employees'" class="space-y-6">
        
        <!-- Action Bar: Add Employee & Search -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm">
          <div class="flex items-center gap-3">
            <button 
              @click="openAddEmployeeModal" 
              class="px-5 py-2.5 bg-[#593c8f] hover:bg-[#4a2e7b] active:scale-95 text-white font-semibold text-xs rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <span class="text-base leading-none font-bold">+</span>
              <span>Add Employee</span>
            </button>
            <p class="text-xs text-slate-500 hidden sm:block">Click on any employee to view their full profile & history.</p>
          </div>

          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by name, ID, department..." 
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
            @click="selectEmployee(emp)"
            class="bg-white border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 relative group flex flex-col items-center shadow-xs"
            :class="selectedEmployee?._id === emp._id ? 'border-[#593c8f] ring-2 ring-purple-300' : 'border-slate-200 hover:border-[#593c8f]/60'"
          >
            <!-- Role Badge Top Right -->
            <span 
              class="absolute top-3.5 right-3.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
              :class="emp.role === 'admin' ? 'bg-purple-100 text-[#593c8f] border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-200'"
            >
              {{ emp.role }}
            </span>

            <!-- Avatar -->
            <div class="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center my-3 text-[#593c8f] font-bold text-lg group-hover:border-[#593c8f] transition shadow-2xs">
              {{ getInitials(emp.firstName, emp.lastName) }}
            </div>

            <!-- Details -->
            <h3 class="font-bold text-slate-900 text-sm text-center group-hover:text-[#593c8f] transition">{{ emp.firstName }} {{ emp.lastName }}</h3>
            <p class="text-[11px] text-slate-500 font-mono mt-0.5">{{ emp.loginId }}</p>
            <p class="text-[11px] text-slate-600 mt-1">{{ emp.department || 'General' }} • {{ emp.designation || 'Associate' }}</p>
            <p class="text-[10px] text-slate-400 mt-1 truncate max-w-full">{{ emp.email }}</p>

            <button class="mt-4 w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-[#593c8f] text-[11px] font-bold rounded-lg border border-purple-200 transition cursor-pointer">
              View Inspector →
            </button>
          </div>

          <div v-if="filteredEmployees.length === 0" class="col-span-full py-12 text-center text-slate-400 text-xs">
            No employees found matching "{{ searchQuery }}".
          </div>
        </div>

      </div>

      <!-- TAB 2: ATTENDANCE RECORDS -->
      <div v-if="activeTab === 'attendance'" class="space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">Company Attendance Records</h2>
            <p class="text-xs text-slate-500 mt-0.5">Overview of employee punches and daily hours.</p>
          </div>
          <button @click="fetchAttendanceRecords" class="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">
            🔄 Refresh Records
          </button>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th class="py-3.5 px-5">Employee</th>
                  <th class="py-3.5 px-5">Login ID</th>
                  <th class="py-3.5 px-5">Date</th>
                  <th class="py-3.5 px-5">Check In</th>
                  <th class="py-3.5 px-5">Check Out</th>
                  <th class="py-3.5 px-5">Hours</th>
                  <th class="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="rec in attendanceRecords" :key="rec._id" class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-5 font-bold text-slate-900">{{ rec.name }}</td>
                  <td class="py-3.5 px-5 font-mono text-[11px] text-[#593c8f] font-semibold">{{ rec.loginId }}</td>
                  <td class="py-3.5 px-5 font-mono text-slate-500">{{ rec.date }}</td>
                  <td class="py-3.5 px-5 font-mono text-emerald-700 font-medium">{{ formatTime(rec.checkInTime) }}</td>
                  <td class="py-3.5 px-5 font-mono text-rose-700 font-medium">{{ formatTime(rec.checkOutTime) || '—' }}</td>
                  <td class="py-3.5 px-5 font-bold text-slate-800">{{ rec.totalHours ? rec.totalHours + ' hrs' : 'In Progress' }}</td>
                  <td class="py-3.5 px-5 text-right">
                    <span 
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      :class="rec.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
                    >
                      {{ rec.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="attendanceRecords.length === 0">
                  <td colspan="7" class="py-8 text-center text-slate-400 text-xs">No attendance records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: LEAVE APPROVALS -->
      <div v-if="activeTab === 'leaves'" class="space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">Employee Leave Approvals</h2>
            <p class="text-xs text-slate-500 mt-0.5">Review, approve, or reject employee leave requests.</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="leaveFilter = 'Pending'" 
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
              :class="leaveFilter === 'Pending' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600'"
            >
              Pending ({{ pendingLeavesCount }})
            </button>
            <button 
              @click="leaveFilter = 'All'" 
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
              :class="leaveFilter === 'All' ? 'bg-[#593c8f] text-white shadow-xs' : 'bg-slate-100 text-slate-600'"
            >
              All Requests
            </button>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th class="py-3.5 px-5">Employee</th>
                  <th class="py-3.5 px-5">Leave Type</th>
                  <th class="py-3.5 px-5">Duration</th>
                  <th class="py-3.5 px-5">Days</th>
                  <th class="py-3.5 px-5">Reason</th>
                  <th class="py-3.5 px-5">Status</th>
                  <th class="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="leave in filteredLeaves" :key="leave._id" class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-5">
                    <p class="font-bold text-slate-900">{{ leave.name }}</p>
                    <p class="text-[10px] text-slate-400 font-mono">{{ leave.loginId }}</p>
                  </td>
                  <td class="py-3.5 px-5 font-semibold text-slate-800">{{ leave.leaveType }}</td>
                  <td class="py-3.5 px-5 font-mono text-slate-500 text-[11px]">{{ leave.startDate }} to {{ leave.endDate }}</td>
                  <td class="py-3.5 px-5 font-bold text-[#593c8f]">{{ leave.days }} d</td>
                  <td class="py-3.5 px-5 max-w-xs truncate text-slate-600" :title="leave.reason">{{ leave.reason }}</td>
                  <td class="py-3.5 px-5">
                    <span 
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      :class="getLeaveStatusBadge(leave.status)"
                    >
                      {{ leave.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-5 text-right space-x-2">
                    <template v-if="leave.status === 'Pending'">
                      <button 
                        @click="updateLeaveStatus(leave._id, 'Approved')" 
                        class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] transition cursor-pointer shadow-2xs"
                      >
                        Approve
                      </button>
                      <button 
                        @click="updateLeaveStatus(leave._id, 'Rejected')" 
                        class="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-[11px] transition cursor-pointer shadow-2xs"
                      >
                        Reject
                      </button>
                    </template>
                    <span v-else class="text-[11px] text-slate-400 italic">Completed</span>
                  </td>
                </tr>
                <tr v-if="filteredLeaves.length === 0">
                  <td colspan="7" class="py-8 text-center text-slate-400 text-xs">No leave requests found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>

    <!-- EMPLOYEE INSPECTOR / DETAIL DRAWER MODAL -->
    <div 
      v-if="selectedEmployee" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      @click.self="selectedEmployee = null"
    >
      <div class="bg-white border border-slate-200 w-full max-w-xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-[#593c8f] font-bold text-base shadow-2xs">
              {{ getInitials(selectedEmployee.firstName, selectedEmployee.lastName) }}
            </div>
            <div>
              <h2 class="text-lg font-extrabold text-slate-900">{{ selectedEmployee.firstName }} {{ selectedEmployee.lastName }}</h2>
              <p class="text-xs text-slate-500 font-mono">{{ selectedEmployee.loginId }} • <span class="uppercase text-[#593c8f] font-bold">{{ selectedEmployee.role }}</span></p>
            </div>
          </div>
          <button @click="selectedEmployee = null" class="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 block">Email Address</span>
            <span class="text-slate-900 font-semibold truncate block mt-0.5">{{ selectedEmployee.email }}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 block">Phone Number</span>
            <span class="text-slate-900 font-semibold truncate block mt-0.5">{{ selectedEmployee.phone || 'Not provided' }}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 block">Department</span>
            <span class="text-slate-900 font-semibold truncate block mt-0.5">{{ selectedEmployee.department || 'General' }}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 block">Designation</span>
            <span class="text-slate-900 font-semibold truncate block mt-0.5">{{ selectedEmployee.designation || 'Associate' }}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 block">Company</span>
            <span class="text-slate-900 font-semibold truncate block mt-0.5">{{ selectedEmployee.companyName || 'Dayflow' }}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 block">Year of Joining</span>
            <span class="text-slate-900 font-semibold truncate block mt-0.5">{{ selectedEmployee.yearOfJoining || 2026 }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button @click="selectedEmployee = null" class="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer">
            Close Inspector
          </button>
        </div>
      </div>
    </div>

    <!-- ADD EMPLOYEE MODAL -->
    <div 
      v-if="showAddModal" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      @click.self="showAddModal = false"
    >
      <div class="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 class="text-lg font-extrabold text-slate-900">Add New Employee</h2>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="createEmployee" class="space-y-3.5 text-xs">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input v-model="newEmpForm.name" type="text" placeholder="Sarah Connor" required class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs" />
          </div>

          <div>
            <label class="block text-slate-700 font-semibold mb-1">Email Address</label>
            <input v-model="newEmpForm.email" type="email" placeholder="sarah@dayflow.com" required class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs" />
          </div>

          <div>
            <label class="block text-slate-700 font-semibold mb-1">Phone Number</label>
            <input v-model="newEmpForm.phone" type="tel" placeholder="+91 98765 43210" class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Role</label>
              <select v-model="newEmpForm.role" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Department</label>
              <input v-model="newEmpForm.department" type="text" placeholder="Engineering" class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs" />
            </div>
          </div>

          <div v-if="createdEmpResult" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
            <p class="font-bold text-emerald-900">Account Created!</p>
            <p class="mt-1">Login ID: <strong class="font-mono text-emerald-950">{{ createdEmpResult.loginId }}</strong></p>
            <p>Temporary Password: <strong class="font-mono text-emerald-950">{{ createdEmpResult.tempPassword }}</strong></p>
          </div>

          <p v-if="createError" class="text-rose-700 text-xs font-medium bg-rose-50 p-2 rounded border border-rose-200">{{ createError }}</p>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Cancel</button>
            <button type="submit" :disabled="creatingEmp" class="px-5 py-2 bg-[#593c8f] hover:bg-[#4a2e7b] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer">
              {{ creatingEmp ? 'Creating...' : 'Create Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return {
      activeTab: 'employees',
      showDropdown: false,
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      employees: [],
      searchQuery: '',
      selectedEmployee: null,
      attendanceRecords: [],
      leaves: [],
      leaveFilter: 'Pending',
      showAddModal: false,
      newEmpForm: {
        name: '',
        email: '',
        phone: '',
        role: 'employee',
        department: '',
      },
      creatingEmp: false,
      createdEmpResult: null,
      createError: '',
    };
  },
  computed: {
    userInitials() {
      const fn = this.user.firstName || 'A';
      const ln = this.user.lastName || '';
      return (fn.charAt(0) + (ln ? ln.charAt(0) : '')).toUpperCase();
    },
    filteredEmployees() {
      return this.employees.filter((e) => {
        const q = this.searchQuery.toLowerCase();
        return (
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
          (e.loginId || '').toLowerCase().includes(q) ||
          (e.department || '').toLowerCase().includes(q) ||
          (e.email || '').toLowerCase().includes(q)
        );
      });
    },
    presentTodayCount() {
      const today = new Date().toISOString().split('T')[0];
      return this.attendanceRecords.filter(r => r.date === today && (r.status === 'present' || r.status === 'checked_out')).length;
    },
    pendingLeavesCount() {
      return this.leaves.filter(l => l.status === 'Pending').length;
    },
    filteredLeaves() {
      if (this.leaveFilter === 'Pending') {
        return this.leaves.filter(l => l.status === 'Pending');
      }
      return this.leaves;
    },
  },
  async mounted() {
    await Promise.all([
      this.fetchEmployees(),
      this.fetchAttendanceRecords(),
      this.fetchLeaves(),
    ]);
  },
  methods: {
    getInitials(fn, ln) {
      return ((fn ? fn.charAt(0) : '') + (ln ? ln.charAt(0) : '')).toUpperCase() || 'E';
    },
    formatTime(dateStr) {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return dateStr;
      }
    },
    getLeaveStatusBadge(status) {
      if (status === 'Approved') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      if (status === 'Rejected') return 'bg-rose-50 text-rose-700 border border-rose-200';
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    },
    async fetchEmployees() {
      try {
        const res = await api.get('/employees');
        this.employees = res.data;
      } catch (err) {
        console.error('Error fetching employees', err);
      }
    },
    async fetchAttendanceRecords() {
      try {
        const res = await api.get('/attendance/all');
        this.attendanceRecords = res.data;
      } catch (err) {
        console.error('Error fetching attendance records', err);
      }
    },
    async fetchLeaves() {
      try {
        const res = await api.get('/leaves/all');
        this.leaves = res.data;
      } catch (err) {
        console.error('Error fetching leaves', err);
      }
    },
    selectEmployee(emp) {
      this.selectedEmployee = emp;
    },
    openAddEmployeeModal() {
      this.createdEmpResult = null;
      this.createError = '';
      this.newEmpForm = { name: '', email: '', phone: '', role: 'employee', department: '' };
      this.showAddModal = true;
    },
    async createEmployee() {
      this.creatingEmp = true;
      this.createError = '';
      try {
        const res = await api.post('/employees', this.newEmpForm);
        this.createdEmpResult = res.data.employee;
        await this.fetchEmployees();
      } catch (err) {
        this.createError = err.response?.data?.message || 'Failed to create employee';
      } finally {
        this.creatingEmp = false;
      }
    },
    async updateLeaveStatus(leaveId, status) {
      try {
        await api.put(`/leaves/${leaveId}/status`, { status });
        await this.fetchLeaves();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update leave status');
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
  },
};
</script>
