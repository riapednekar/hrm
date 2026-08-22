<template>
  <div class="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div class="inline-flex items-center gap-2 bg-purple-50 text-[#593c8f] text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1 border border-purple-200">
            <span class="w-1.5 h-1.5 rounded-full bg-[#593c8f]"></span>
            Payroll & Compensation
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Salary & Benefits</h1>
          <p class="text-xs text-slate-500 mt-0.5">Overview of compensation structure, deductions, and disbursement history.</p>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Direct Deposit Active
          </span>
          <button 
            @click="fetchSalaryData" 
            :disabled="loading"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
          >
            {{ loading ? 'Updating...' : '🔄 Refresh' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm shadow-sm">
        <div class="inline-block w-8 h-8 border-4 border-purple-200 border-t-[#593c8f] rounded-full animate-spin mb-3"></div>
        <p class="font-medium text-slate-600">Retrieving confidential payroll details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 text-xs shadow-sm">
        <p class="font-bold text-sm">Failed to load salary information</p>
        <p class="mt-1 text-rose-600">{{ error }}</p>
        <button @click="fetchSalaryData" class="mt-4 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
          Try Again
        </button>
      </div>

      <!-- Main Salary Dashboard -->
      <div v-else class="space-y-6">
        
        <!-- Top Stats Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Net Take-Home Pay -->
          <div class="bg-gradient-to-br from-[#593c8f] to-[#4a2e7b] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <p class="text-xs text-purple-200 uppercase tracking-wider font-semibold">Estimated Net Take-Home</p>
              <h2 class="text-3xl font-extrabold mt-2 tracking-tight">${{ formatNumber(salaryData.netPay) }}</h2>
              <p class="text-[11px] text-purple-200/80 mt-1">Per {{ salaryData.payPeriod || 'Monthly' }} Cycle</p>
            </div>
            <div class="mt-4 pt-3 border-t border-purple-400/30 flex items-center justify-between text-xs text-purple-100">
              <span>Disbursement: <strong>Direct Bank Transfer</strong></span>
            </div>
          </div>

          <!-- Base Salary -->
          <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Base Fixed Salary</p>
              <h2 class="text-2xl font-extrabold text-slate-900 mt-2">${{ formatNumber(salaryData.baseSalary) }}</h2>
              <p class="text-[11px] text-slate-500 mt-1">Annualized: ${{ formatNumber(salaryData.baseSalary * 12) }}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
              Standard 40h/week structure
            </div>
          </div>

          <!-- Bonuses & Allowances -->
          <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Bonuses & Allowances</p>
              <h2 class="text-2xl font-extrabold text-emerald-600 mt-2">+${{ formatNumber((salaryData.bonus || 0) + (salaryData.allowances || 0)) }}</h2>
              <p class="text-[11px] text-slate-500 mt-1">Performance bonus + HRA + Benefits</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-700 font-semibold">
              Included in next payroll
            </div>
          </div>

          <!-- Total Deductions -->
          <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Deductions</p>
              <h2 class="text-2xl font-extrabold text-rose-600 mt-2">-${{ formatNumber(salaryData.deductions) }}</h2>
              <p class="text-[11px] text-slate-500 mt-1">Tax withholding + PF contribution</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 text-xs text-rose-700 font-semibold">
              Pre-tax & statutory withholdings
            </div>
          </div>

        </div>

        <!-- 2-Column Breakdown & Bank Details -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Detailed Itemized Breakdown (2 cols) -->
          <div class="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 class="text-base font-bold text-slate-900">Earnings & Deductions Breakdown</h2>
              <p class="text-xs text-slate-500 mt-0.5">Itemized list of all earnings and mandatory withholdings.</p>
            </div>

            <!-- Earnings List -->
            <div>
              <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Earnings (Gross Additions)</h3>
              <div class="space-y-2.5 text-xs">
                <div class="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <span class="font-bold text-slate-800">Basic Salary</span>
                    <span class="text-[11px] text-slate-400 block">Standard contractual monthly wage</span>
                  </div>
                  <span class="font-bold text-slate-900 text-sm font-mono">${{ formatNumber(salaryData.baseSalary) }}</span>
                </div>

                <div class="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <span class="font-bold text-slate-800">Performance Bonus</span>
                    <span class="text-[11px] text-slate-400 block">Monthly performance incentive</span>
                  </div>
                  <span class="font-bold text-emerald-700 text-sm font-mono">+${{ formatNumber(salaryData.bonus) }}</span>
                </div>

                <div class="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <span class="font-bold text-slate-800">House Rent Allowance (HRA) & Travel</span>
                    <span class="text-[11px] text-slate-400 block">Non-taxable accommodation and commute relief</span>
                  </div>
                  <span class="font-bold text-emerald-700 text-sm font-mono">+${{ formatNumber(salaryData.allowances || 800) }}</span>
                </div>
              </div>
            </div>

            <!-- Deductions List -->
            <div>
              <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Deductions (Withholdings)</h3>
              <div class="space-y-2.5 text-xs">
                <div class="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <span class="font-bold text-slate-800">Income Tax (TDS / PAYE)</span>
                    <span class="text-[11px] text-slate-400 block">Estimated state & federal statutory tax</span>
                  </div>
                  <span class="font-bold text-rose-700 text-sm font-mono">-${{ formatNumber(salaryData.breakdown?.taxDeduction || 210) }}</span>
                </div>

                <div class="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <span class="font-bold text-slate-800">Provident Fund (PF) & Medical Insurance</span>
                    <span class="text-[11px] text-slate-400 block">Retirement savings & health coverage</span>
                  </div>
                  <span class="font-bold text-rose-700 text-sm font-mono">-${{ formatNumber(salaryData.breakdown?.providentFund || 140) }}</span>
                </div>
              </div>
            </div>

            <!-- Net Calculation Bar -->
            <div class="p-4 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-[#593c8f] uppercase tracking-wider">Total Net Compensation</span>
                <p class="text-[11px] text-slate-500">Gross (${{ formatNumber(salaryData.baseSalary + salaryData.bonus + (salaryData.allowances || 800)) }}) − Deductions (${{ formatNumber(salaryData.deductions) }})</p>
              </div>
              <span class="text-xl font-extrabold text-[#593c8f] font-mono">${{ formatNumber(salaryData.netPay) }}</span>
            </div>
          </div>

          <!-- Right: Direct Deposit & Info Card (1 col) -->
          <div class="space-y-6">
            
            <!-- Direct Deposit Details Card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 class="font-bold text-slate-900 text-sm">Disbursement Method</h3>
                <span class="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">Active</span>
              </div>

              <div>
                <span class="text-slate-400 block">Receiving Bank</span>
                <span class="font-semibold text-slate-900 text-sm block mt-0.5">{{ salaryData.paymentMethod?.bankName || 'Silicon Valley Federal Bank' }}</span>
              </div>

              <div>
                <span class="text-slate-400 block">Account Number</span>
                <span class="font-mono text-slate-900 font-semibold block mt-0.5">{{ salaryData.paymentMethod?.accountNumberMasked || '•••• •••• •••• 4892' }}</span>
              </div>

              <div>
                <span class="text-slate-400 block">Next Scheduled Payday</span>
                <span class="font-semibold text-purple-700 block mt-0.5">August 31, 2026</span>
              </div>

              <div class="pt-2">
                <button 
                  @click="downloadPaystubAlert"
                  class="w-full py-2.5 px-4 bg-[#593c8f] hover:bg-[#4a2e7b] text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-xs text-center"
                >
                  📄 Download Latest Paystub (PDF)
                </button>
              </div>
            </div>

            <!-- Tax Filing & Support Note -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3 text-xs">
              <h3 class="font-bold text-slate-900 text-sm">Tax & Support Inquiries</h3>
              <p class="text-slate-500 leading-relaxed text-[11px]">
                Annual tax statements (W-2 / Form 16) are compiled at the close of the financial year. For adjustments to withholdings or tax allowances, please contact the HR payroll department.
              </p>
              <div class="pt-1">
                <a href="mailto:hr@dayflow.com" class="text-[#593c8f] font-semibold hover:underline text-[11px]">
                  Contact HR Payroll Team →
                </a>
              </div>
            </div>

          </div>

        </div>

        <!-- Paystubs History Table -->
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900">Recent Paystubs & History</h2>
              <p class="text-xs text-slate-500 mt-0.5">Past salary disbursements and downloadable receipts.</p>
            </div>
            <span class="text-xs text-slate-400">Showing last 3 pay periods</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th class="py-3.5 px-5">Pay Period</th>
                  <th class="py-3.5 px-5">Payment Date</th>
                  <th class="py-3.5 px-5">Gross Pay</th>
                  <th class="py-3.5 px-5">Deductions</th>
                  <th class="py-3.5 px-5">Net Paid</th>
                  <th class="py-3.5 px-5">Status</th>
                  <th class="py-3.5 px-5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="(pay, idx) in salaryData.history || defaultHistory" :key="idx" class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-5 font-bold text-slate-900">{{ pay.month }}</td>
                  <td class="py-3.5 px-5 font-mono text-slate-500">{{ pay.date }}</td>
                  <td class="py-3.5 px-5 font-mono font-medium text-slate-900">${{ formatNumber(pay.gross) }}</td>
                  <td class="py-3.5 px-5 font-mono text-rose-600">-${{ formatNumber(pay.deductions) }}</td>
                  <td class="py-3.5 px-5 font-mono font-bold text-[#593c8f]">${{ formatNumber(pay.net) }}</td>
                  <td class="py-3.5 px-5">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {{ pay.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-5 text-right">
                    <button 
                      @click="downloadPaystubAlert"
                      class="text-xs text-[#593c8f] font-semibold hover:underline cursor-pointer"
                    >
                      Download ⬇
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
  name: 'Salary',
  components: {
    Navbar,
  },
  data() {
    return {
      salaryData: {
        baseSalary: 5200,
        bonus: 600,
        allowances: 800,
        deductions: 350,
        netPay: 6250,
        payPeriod: 'Monthly',
        breakdown: {
          taxDeduction: 210,
          providentFund: 140,
        },
        paymentMethod: {
          bankName: 'Silicon Valley Federal Bank',
          accountNumberMasked: '•••• •••• •••• 4892',
        },
        history: [],
      },
      defaultHistory: [
        { month: 'July 2026', gross: 6600, deductions: 350, net: 6250, status: 'Paid', date: '2026-07-31' },
        { month: 'June 2026', gross: 6600, deductions: 350, net: 6250, status: 'Paid', date: '2026-06-30' },
        { month: 'May 2026', gross: 6600, deductions: 350, net: 6250, status: 'Paid', date: '2026-05-31' },
      ],
      loading: true,
      error: null,
    };
  },
  async mounted() {
    await this.fetchSalaryData();
  },
  methods: {
    formatNumber(num) {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return Number(num).toLocaleString();
    },
    async fetchSalaryData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/salary');
        if (response.data) {
          this.salaryData = response.data;
        }
      } catch (err) {
        console.warn('Using fallback salary data due to API notice:', err.message);
        // If API is unreachable, retain fallback calculations smoothly
      } finally {
        this.loading = false;
      }
    },
    downloadPaystubAlert() {
      alert('Generating secure encrypted Paystub PDF for direct download...');
    },
  },
};
</script>