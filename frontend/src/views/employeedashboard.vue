<template>
  <div class="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-8">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Dayflow Logo" class="h-8 w-auto object-contain" />
          <span class="font-serif font-bold text-xl text-slate-900 tracking-tight" style="font-family: Georgia, serif;">Dayflow</span>
          <span class="text-xs bg-purple-50 border border-purple-200 text-[#593c8f] px-2.5 py-0.5 rounded-full font-semibold ml-1">Employee Portal</span>
        </div>

        <!-- Navigation Tabs -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <button 
            @click="activeTab = 'overview'" 
            class="transition cursor-pointer pb-1"
            :class="activeTab === 'overview' ? 'text-[#593c8f] border-b-2 border-[#593c8f] font-bold' : 'text-slate-500 hover:text-slate-900'"
          >
            Dashboard
          </button>
          <button 
            @click="activeTab = 'attendance'" 
            class="transition cursor-pointer pb-1"
            :class="activeTab === 'attendance' ? 'text-[#593c8f] border-b-2 border-[#593c8f] font-bold' : 'text-slate-500 hover:text-slate-900'"
          >
            Attendance
          </button>
          <button 
            @click="activeTab = 'leaves'" 
            class="transition cursor-pointer pb-1"
            :class="activeTab === 'leaves' ? 'text-[#593c8f] border-b-2 border-[#593c8f] font-bold' : 'text-slate-500 hover:text-slate-900'"
          >
            Leave Requests
          </button>
          <router-link 
            to="/salary" 
            class="text-slate-500 hover:text-slate-900 transition cursor-pointer pb-1"
          >
            Salary & Payroll
          </router-link>
        </nav>
      </div>

      <!-- Right Header Actions: Attendance Widget + User Menu -->
      <div class="flex items-center gap-4">
        <!-- Check In / Check Out Button -->
        <div class="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
          <span 
            class="w-2.5 h-2.5 rounded-full transition-all duration-300" 
            :class="isCheckedIn ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'"
          ></span>
          <button 
            @click="toggleAttendance" 
            :disabled="attendanceLoading"
            class="text-xs font-semibold px-3 py-1 rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 shadow-xs"
            :class="isCheckedIn ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#593c8f] hover:bg-[#4a2e7b] text-white'"
          >
            <span v-if="attendanceLoading">...</span>
            <span v-else>{{ isCheckedIn ? 'Check Out' : 'Check In' }}</span>
          </button>
        </div>

        <!-- User Profile Avatar & Dropdown -->
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
              <p class="text-[11px] text-slate-400 font-mono truncate">{{ user.loginId }}</p>
            </div>
            <button @click="activeTab = 'overview'; showDropdown = false" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs cursor-pointer">My Profile</button>
            <button @click="activeTab = 'leaves'; showDropdown = false" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs cursor-pointer">Request Leave</button>
            <button @click="$router.push('/salary'); showDropdown = false" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-[#593c8f] font-semibold text-xs cursor-pointer">Salary & Payroll</button>
            <hr class="border-slate-100 my-1" />
            <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-rose-600 text-xs font-semibold cursor-pointer">Log Out</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- Notification Alerts -->
      <div v-if="alertMessage" class="p-4 bg-purple-50 border border-purple-200 rounded-xl text-[#593c8f] text-xs flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2">
          <span class="text-base">🔔</span>
          <span class="font-medium">{{ alertMessage }}</span>
        </div>
        <button @click="alertMessage = ''" class="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer">✕</button>
      </div>

      <!-- TAB 1: OVERVIEW & PROFILE -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        
        <!-- Welcome Hero Banner -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div>
            <div class="inline-flex items-center gap-2 bg-purple-50 text-[#593c8f] text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-purple-200">
              <span class="w-1.5 h-1.5 rounded-full bg-[#593c8f]"></span>
              {{ user.companyName || 'Dayflow Org' }}
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {{ user.firstName }}!</h1>
            <p class="text-slate-500 text-xs md:text-sm mt-1">Here is your daily workspace snapshot and attendance record.</p>
          </div>

          <!-- Quick Clock Widget -->
          <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center min-w-[180px] shadow-xs">
            <p class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Today's Status</p>
            <p class="text-lg font-bold mt-1" :class="isCheckedIn ? 'text-emerald-600' : 'text-slate-600'">
              {{ isCheckedIn ? 'Checked In' : (todayRecord?.checkOutTime ? 'Checked Out' : 'Not Checked In') }}
            </p>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">{{ currentTime }}</p>
          </div>
        </div>

        <!-- 4-Column Info Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Profile Card -->
          <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Employee Profile</h2>
                <span class="text-xs bg-purple-50 text-[#593c8f] border border-purple-200 px-2 py-0.5 rounded font-mono font-bold">ID: {{ user.loginId }}</span>
              </div>
              <div class="space-y-3 text-xs">
                <div>
                  <span class="text-slate-400 block">Full Name</span>
                  <span class="text-slate-900 font-bold text-sm">{{ user.firstName }} {{ user.lastName }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Email Address</span>
                  <span class="text-slate-700 font-medium truncate block">{{ user.email }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Department</span>
                  <span class="text-slate-700 font-medium">{{ user.department || 'General' }} • {{ user.designation || 'Associate' }}</span>
                </div>
              </div>
            </div>
            <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Role: <strong class="text-[#593c8f] uppercase font-bold">{{ user.role }}</strong></span>
              <button @click="$router.push('/profile')" class="text-xs text-[#593c8f] font-semibold hover:underline">Profile →</button>
            </div>
          </div>

          <!-- Quick Attendance Snapshot Card -->
          <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Today's Attendance</h2>
                <span 
                  class="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  :class="isCheckedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'"
                >
                  {{ isCheckedIn ? 'Active' : 'Offline' }}
                </span>
              </div>

              <div class="space-y-3 text-xs" v-if="todayRecord">
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">Check In</span>
                  <span class="text-emerald-700 font-mono font-bold">{{ formatTime(todayRecord.checkInTime) }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">Check Out</span>
                  <span class="text-rose-700 font-mono font-bold">{{ formatTime(todayRecord.checkOutTime) || 'In Progress' }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Total Hours</span>
                  <span class="text-[#593c8f] font-bold">{{ todayRecord.totalHours || 0 }} hrs</span>
                </div>
              </div>

              <div v-else class="text-center py-5 text-slate-400 text-xs">
                No check-in record for today yet.
              </div>
            </div>

            <button 
              @click="toggleAttendance" 
              class="w-full mt-4 py-2.5 px-4 rounded-xl font-semibold text-xs transition duration-150 cursor-pointer shadow-sm"
              :class="isCheckedIn ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#593c8f] hover:bg-[#4a2e7b] text-white'"
            >
              {{ isCheckedIn ? 'Punch Check Out' : 'Punch Check In' }}
            </button>
          </div>

          <!-- Leave Summary Card -->
          <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Leave Summary</h2>
                <button @click="activeTab = 'leaves'" class="text-xs text-[#593c8f] font-semibold hover:underline cursor-pointer">Apply →</button>
              </div>

              <div class="grid grid-cols-3 gap-1.5 text-center my-3">
                <div class="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span class="text-base font-extrabold text-slate-900 block">{{ leaveStats.total }}</span>
                  <span class="text-[9px] text-slate-500 uppercase font-semibold">Total</span>
                </div>
                <div class="bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                  <span class="text-base font-extrabold text-amber-700 block">{{ leaveStats.pending }}</span>
                  <span class="text-[9px] text-amber-700 uppercase font-semibold">Pending</span>
                </div>
                <div class="bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                  <span class="text-base font-extrabold text-emerald-700 block">{{ leaveStats.approved }}</span>
                  <span class="text-[9px] text-emerald-700 uppercase font-semibold">Approved</span>
                </div>
              </div>
            </div>

            <button 
              @click="activeTab = 'leaves'" 
              class="w-full mt-4 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition cursor-pointer"
            >
              View Requests
            </button>
          </div>

          <!-- Salary & Payroll Quick Card -->
          <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Salary & Payroll</h2>
                <span class="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">Active</span>
              </div>

              <div class="space-y-3 text-xs my-2">
                <div class="p-3 bg-purple-50/70 border border-purple-100 rounded-xl">
                  <span class="text-[11px] text-slate-500 block">Est. Net Take-Home</span>
                  <span class="text-xl font-extrabold text-[#593c8f] font-mono block mt-0.5">$6,250</span>
                  <span class="text-[10px] text-purple-700">Direct Deposit on 31st</span>
                </div>
              </div>
            </div>

            <button 
              @click="$router.push('/salary')" 
              class="w-full mt-4 py-2.5 px-4 bg-[#593c8f] hover:bg-[#4a2e7b] text-white rounded-xl font-semibold text-xs transition cursor-pointer shadow-sm text-center"
            >
              View Full Payroll →
            </button>
          </div>

        </div>

        <!-- Recent Activity Feed -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Recent Activity & Alerts</h2>
          
          <div class="space-y-3 text-xs">
            <div v-for="(act, idx) in activityList" :key="idx" class="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span class="text-base p-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">{{ act.icon }}</span>
              <div class="flex-1">
                <p class="text-slate-800 font-semibold">{{ act.title }}</p>
                <p class="text-slate-400 text-[11px]">{{ act.time }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- TAB 2: ATTENDANCE HISTORY -->
      <div v-if="activeTab === 'attendance'" class="space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900">Attendance Records</h2>
            <p class="text-xs text-slate-500 mt-0.5">Track your daily punches and working hours history.</p>
          </div>
          <button 
            @click="toggleAttendance" 
            class="py-2 px-5 rounded-xl font-semibold text-xs transition shadow-sm cursor-pointer"
            :class="isCheckedIn ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#593c8f] hover:bg-[#4a2e7b] text-white'"
          >
            {{ isCheckedIn ? 'Punch Check Out' : 'Punch Check In' }}
          </button>
        </div>

        <!-- Table -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th class="py-3.5 px-5">Date</th>
                  <th class="py-3.5 px-5">Check In</th>
                  <th class="py-3.5 px-5">Check Out</th>
                  <th class="py-3.5 px-5">Total Hours</th>
                  <th class="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="rec in attendanceHistory" :key="rec._id" class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-5 font-mono font-semibold text-slate-900">{{ rec.date }}</td>
                  <td class="py-3.5 px-5 font-mono text-emerald-700 font-medium">{{ formatTime(rec.checkInTime) }}</td>
                  <td class="py-3.5 px-5 font-mono text-rose-700 font-medium">{{ formatTime(rec.checkOutTime) || '—' }}</td>
                  <td class="py-3.5 px-5 font-bold text-[#593c8f]">{{ rec.totalHours ? rec.totalHours + ' hrs' : 'In Progress' }}</td>
                  <td class="py-3.5 px-5 text-right">
                    <span 
                      class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase"
                      :class="rec.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
                    >
                      {{ rec.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="attendanceHistory.length === 0">
                  <td colspan="5" class="py-8 text-center text-slate-400 text-xs">No past attendance records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: LEAVE REQUESTS -->
      <div v-if="activeTab === 'leaves'" class="space-y-6">
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Apply Leave Form -->
          <div class="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
            <h2 class="text-base font-bold text-slate-900 mb-1">Apply for Leave</h2>
            <p class="text-xs text-slate-500 mb-5">Submit a new leave request for admin approval.</p>

            <form @submit.prevent="submitLeaveRequest" class="space-y-3.5 text-xs">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">Leave Type</label>
                <select 
                  v-model="leaveForm.leaveType" 
                  required 
                  class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Annual">Annual / Vacation Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-700 font-semibold mb-1">Start Date</label>
                <input 
                  v-model="leaveForm.startDate" 
                  type="date" 
                  required 
                  class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label class="block text-slate-700 font-semibold mb-1">End Date</label>
                <input 
                  v-model="leaveForm.endDate" 
                  type="date" 
                  required 
                  class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label class="block text-slate-700 font-semibold mb-1">Reason for Leave</label>
                <textarea 
                  v-model="leaveForm.reason" 
                  rows="3" 
                  placeholder="Provide a brief explanation..." 
                  required 
                  class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5e3b8a] outline-none resize-none shadow-2xs"
                ></textarea>
              </div>

              <button 
                type="submit" 
                :disabled="leaveSubmitting"
                class="w-full py-2.5 px-4 bg-[#593c8f] hover:bg-[#4a2e7b] text-white font-semibold rounded-lg shadow-sm transition cursor-pointer mt-2"
              >
                {{ leaveSubmitting ? 'Submitting...' : 'Submit Leave Request' }}
              </button>

              <p v-if="leaveSuccessMsg" class="text-emerald-700 text-[11px] text-center font-medium bg-emerald-50 p-2 rounded border border-emerald-200">
                {{ leaveSuccessMsg }}
              </p>
              <p v-if="leaveErrorMsg" class="text-rose-700 text-[11px] text-center font-medium bg-rose-50 p-2 rounded border border-rose-200">
                {{ leaveErrorMsg }}
              </p>
            </form>
          </div>

          <!-- My Leave Requests History Table -->
          <div class="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 class="text-base font-bold text-slate-900 mb-1">My Leave Requests</h2>
            <p class="text-xs text-slate-500 mb-5">History and status of your applied leaves.</p>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
                  <tr>
                    <th class="py-3 px-4">Type</th>
                    <th class="py-3 px-4">Duration</th>
                    <th class="py-3 px-4">Days</th>
                    <th class="py-3 px-4">Reason</th>
                    <th class="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr v-for="req in leaves" :key="req._id" class="hover:bg-slate-50/80 transition">
                    <td class="py-3.5 px-4 font-bold text-slate-900">{{ req.leaveType }}</td>
                    <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">{{ req.startDate }} to {{ req.endDate }}</td>
                    <td class="py-3.5 px-4 font-bold text-[#593c8f]">{{ req.days }} d</td>
                    <td class="py-3.5 px-4 max-w-xs truncate text-slate-600" :title="req.reason">{{ req.reason }}</td>
                    <td class="py-3.5 px-4 text-right">
                      <span 
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        :class="getLeaveStatusBadge(req.status)"
                      >
                        {{ req.status }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="leaves.length === 0">
                    <td colspan="5" class="py-8 text-center text-slate-400 text-xs">No leave requests submitted yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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
      activeTab: 'overview',
      showDropdown: false,
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      isCheckedIn: false,
      attendanceLoading: false,
      todayRecord: null,
      attendanceHistory: [],
      leaves: [],
      leaveForm: {
        leaveType: 'Casual',
        startDate: '',
        endDate: '',
        reason: '',
      },
      leaveSubmitting: false,
      leaveSuccessMsg: '',
      leaveErrorMsg: '',
      alertMessage: '',
      currentTime: new Date().toLocaleTimeString(),
      timer: null,
    };
  },
  computed: {
    userInitials() {
      const fn = this.user.firstName || 'E';
      const ln = this.user.lastName || '';
      return (fn.charAt(0) + (ln ? ln.charAt(0) : '')).toUpperCase();
    },
    leaveStats() {
      const total = this.leaves.length;
      const pending = this.leaves.filter(l => l.status === 'Pending').length;
      const approved = this.leaves.filter(l => l.status === 'Approved').length;
      const rejected = this.leaves.filter(l => l.status === 'Rejected').length;
      return { total, pending, approved, rejected };
    },
    activityList() {
      const list = [];
      if (this.todayRecord) {
        list.push({
          icon: '⏱',
          title: `Marked attendance for today (${this.todayRecord.date})`,
          time: this.formatTime(this.todayRecord.checkInTime),
        });
      }
      if (this.leaves.length > 0) {
        list.push({
          icon: '📝',
          title: `Applied for ${this.leaves[0].leaveType} Leave (${this.leaves[0].days} days)`,
          time: this.leaves[0].startDate,
        });
      }
      list.push({
        icon: '👋',
        title: 'Logged in to Dayflow Employee Portal',
        time: 'Active Session',
      });
      return list;
    },
  },
  async mounted() {
    this.timer = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);

    await Promise.all([
      this.fetchAttendanceStatus(),
      this.fetchAttendanceHistory(),
      this.fetchLeaves(),
    ]);

    if (this.user.isFirstLogin) {
      this.alertMessage = 'First login detected! Please remember to update your default credentials.';
    }
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
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
    async fetchAttendanceStatus() {
      try {
        const res = await api.get('/attendance/status');
        this.isCheckedIn = res.data.isCheckedIn;
        this.todayRecord = res.data.record;
      } catch (err) {
        console.error('Error fetching attendance status', err);
      }
    },
    async fetchAttendanceHistory() {
      try {
        const res = await api.get('/attendance/my-history');
        this.attendanceHistory = res.data;
      } catch (err) {
        console.error('Error fetching attendance history', err);
      }
    },
    async toggleAttendance() {
      this.attendanceLoading = true;
      try {
        const res = await api.post('/attendance/toggle');
        this.isCheckedIn = res.data.isCheckedIn;
        this.todayRecord = res.data.record;
        await this.fetchAttendanceHistory();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to toggle attendance');
      } finally {
        this.attendanceLoading = false;
      }
    },
    async fetchLeaves() {
      try {
        const res = await api.get('/leaves/my-leaves');
        this.leaves = res.data;
      } catch (err) {
        console.error('Error fetching leaves', err);
      }
    },
    async submitLeaveRequest() {
      this.leaveSubmitting = true;
      this.leaveSuccessMsg = '';
      this.leaveErrorMsg = '';
      try {
        const res = await api.post('/leaves/apply', this.leaveForm);
        this.leaveSuccessMsg = res.data.message || 'Leave requested successfully!';
        this.leaveForm = { leaveType: 'Casual', startDate: '', endDate: '', reason: '' };
        await this.fetchLeaves();
      } catch (err) {
        this.leaveErrorMsg = err.response?.data?.message || 'Failed to submit leave request';
      } finally {
        this.leaveSubmitting = false;
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
  },
};
</script>
