<template>
  <div class="min-h-screen bg-slate-50/80 text-slate-800 p-6 sm:p-10 font-sans">
    <div class="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Dayflow Logo" class="h-7 w-auto object-contain" />
          <span class="font-serif font-bold text-lg text-slate-900 tracking-tight" style="font-family: Georgia, serif;">Dayflow</span>
          <span class="text-xs text-slate-400">/ Employee Profile</span>
        </div>
        <button 
          @click="$router.push('/admin/dashboard')" 
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer shadow-2xs"
        >
          ← Back to Dashboard
        </button>
      </div>

      <!-- Non-Editable Form Fields -->
      <div v-if="employee" class="space-y-4 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Login ID</label>
            <input :value="employee.loginId" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-medium cursor-not-allowed" />
          </div>
          <div>
            <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</label>
            <input :value="employee.role" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[#593c8f] font-bold uppercase cursor-not-allowed" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">First Name</label>
            <input :value="employee.firstName" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold cursor-not-allowed" />
          </div>
          <div>
            <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
            <input :value="employee.lastName" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
          <input :value="employee.email" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 cursor-not-allowed" />
        </div>

        <div>
          <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
          <input :value="employee.phone || 'Not provided'" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 cursor-not-allowed" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</label>
            <input :value="employee.department || 'General'" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 cursor-not-allowed" />
          </div>
          <div>
            <label class="block font-semibold text-slate-500 uppercase tracking-wider mb-1">Designation</label>
            <input :value="employee.designation || 'Associate'" disabled class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-slate-400 text-xs">
        Loading employee details...
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return { employee: null };
  },
  async mounted() {
    try {
      const res = await api.get(`/employees/${this.$route.params.id}`);
      this.employee = res.data;
    } catch (err) {
      console.error('Error fetching employee details', err);
    }
  },
};
</script>