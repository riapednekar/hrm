<template>
  <div class="salary-info-wrapper">
    <!-- Non-admin access restriction check -->
    <div v-if="!isAdmin" class="access-denied-card">
      <div class="denied-icon">🔒</div>
      <h3>Access Restricted</h3>
      <p>Salary Information and payroll calculations are confidential and accessible only to Admin / HR personnel.</p>
      <span class="role-pill employee">Role: Employee (No Access)</span>
    </div>

    <!-- Admin View: Complete Salary & Payroll Engine -->
    <div v-else class="salary-content">
      <!-- Top Metrics Summary Grid -->
      <div class="metrics-grid">
        <!-- Monthly Gross Wage -->
        <div class="metric-card primary">
          <div class="metric-header">
            <span class="label">Monthly Gross Wage</span>
            <span class="badge">Input</span>
          </div>
          <div class="value">₹{{ formatCurrency(monthlyWage) }}</div>
          <div class="subtext">Base monthly compensation</div>
        </div>

        <!-- Yearly Gross Wage -->
        <div class="metric-card success">
          <div class="metric-header">
            <span class="label">Yearly Gross Wage (CTC)</span>
            <span class="badge success">12x Gross</span>
          </div>
          <div class="value text-emerald">₹{{ formatCurrency(yearlyWage) }}</div>
          <div class="subtext">Annual Cost to Company</div>
        </div>

        <!-- Total Allocated Components -->
        <div class="metric-card" :class="isOverAllocated ? 'danger' : 'info'">
          <div class="metric-header">
            <span class="label">Total Allocated</span>
            <span v-if="isOverAllocated" class="badge danger">Exceeds Wage</span>
            <span v-else class="badge info">100% Balanced</span>
          </div>
          <div class="value" :class="isOverAllocated ? 'text-rose' : 'text-purple'">
            ₹{{ formatCurrency(totalAllocated) }}
          </div>
          <div class="subtext">
            <span v-if="isOverAllocated" class="text-rose">Exceeds by ₹{{ formatCurrency(totalAllocated - monthlyWage) }}</span>
            <span v-else class="text-emerald">Matched to Monthly Wage</span>
          </div>
        </div>

        <!-- Net Monthly Take-Home -->
        <div class="metric-card purple">
          <div class="metric-header">
            <span class="label">Estimated Net In-Hand</span>
            <span class="badge purple">Post Deductions</span>
          </div>
          <div class="value text-purple">₹{{ formatCurrency(netTakeHome) }}</div>
          <div class="subtext">After PF & Statutory Tax</div>
        </div>
      </div>

      <!-- Live Wage Input & Quick Presets -->
      <div class="wage-control-card">
        <div class="control-row">
          <div class="input-block">
            <label>Set Monthly Wage (₹)</label>
            <div class="input-currency-box">
              <span class="symbol">₹</span>
              <input 
                v-model.number="monthlyWage" 
                type="number" 
                min="1000" 
                step="1000" 
                placeholder="50000" 
                class="main-wage-input"
              />
            </div>
          </div>

          <div class="presets-block">
            <label>Quick Select</label>
            <div class="preset-buttons">
              <button 
                v-for="amount in [30000, 50000, 75000, 100000, 150000]" 
                :key="amount"
                class="btn-preset" 
                :class="{ active: monthlyWage === amount }"
                @click="monthlyWage = amount"
              >
                ₹{{ amount / 1000 }}k
              </button>
            </div>
          </div>

          <div class="save-block">
            <button class="btn-save" @click="saveSalaryStructure">
              💾 Save Structure
            </button>
          </div>
        </div>

        <!-- Over-allocation warning banner -->
        <div v-if="isOverAllocated" class="alert-banner">
          ⚠️ <strong>Over-Allocation Warning:</strong> The sum of salary components (₹{{ formatCurrency(totalAllocated) }}) exceeds the defined Monthly Wage (₹{{ formatCurrency(monthlyWage) }}).
        </div>
      </div>

      <!-- Salary Components Table -->
      <div class="section-card">
        <div class="card-header">
          <div>
            <h3>Salary Components Breakdown</h3>
            <p class="section-sub">Automatic dynamic calculation based on monthly wage</p>
          </div>
        </div>

        <div class="table-responsive">
          <table class="salary-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Formula / Calculation Rule</th>
                <th class="text-right">Monthly Amount</th>
                <th class="text-right">Yearly Amount</th>
                <th class="text-right">% of Wage</th>
              </tr>
            </thead>
            <tbody>
              <!-- 1. Basic Salary -->
              <tr>
                <td>
                  <strong>Basic Salary</strong>
                  <span class="type-hint">Taxable Base</span>
                </td>
                <td>
                  <span class="formula-pill">50% of Monthly Wage</span>
                </td>
                <td class="text-right highlight">₹{{ formatCurrency(basicSalary) }}</td>
                <td class="text-right">₹{{ formatCurrency(basicSalary * 12) }}</td>
                <td class="text-right text-muted">50.0%</td>
              </tr>

              <!-- 2. House Rent Allowance (HRA) -->
              <tr>
                <td>
                  <strong>House Rent Allowance (HRA)</strong>
                  <span class="type-hint">Accommodation</span>
                </td>
                <td>
                  <span class="formula-pill">50% of Basic Salary</span>
                </td>
                <td class="text-right highlight">₹{{ formatCurrency(hraSalary) }}</td>
                <td class="text-right">₹{{ formatCurrency(hraSalary * 12) }}</td>
                <td class="text-right text-muted">{{ ((hraSalary / (monthlyWage || 1)) * 100).toFixed(1) }}%</td>
              </tr>

              <!-- 3. Standard Allowance -->
              <tr>
                <td>
                  <strong>Standard Allowance</strong>
                  <span class="type-hint">Statutory Allowance</span>
                </td>
                <td>
                  <span class="formula-pill">Fixed Allowance</span>
                </td>
                <td class="text-right highlight">₹{{ formatCurrency(standardAllowance) }}</td>
                <td class="text-right">₹{{ formatCurrency(standardAllowance * 12) }}</td>
                <td class="text-right text-muted">{{ ((standardAllowance / (monthlyWage || 1)) * 100).toFixed(1) }}%</td>
              </tr>

              <!-- 4. Performance Bonus -->
              <tr>
                <td>
                  <strong>Performance Bonus</strong>
                  <span class="type-hint">Variable Pay</span>
                </td>
                <td>
                  <span class="formula-pill">8.33% of Monthly Wage</span>
                </td>
                <td class="text-right highlight">₹{{ formatCurrency(performanceBonus) }}</td>
                <td class="text-right">₹{{ formatCurrency(performanceBonus * 12) }}</td>
                <td class="text-right text-muted">8.3%</td>
              </tr>

              <!-- 5. Leave Travel Allowance (LTA) -->
              <tr>
                <td>
                  <strong>Leave Travel Allowance (LTA)</strong>
                  <span class="type-hint">Annual Travel</span>
                </td>
                <td>
                  <span class="formula-pill">Fixed Allowance</span>
                </td>
                <td class="text-right highlight">₹{{ formatCurrency(leaveTravelAllowance) }}</td>
                <td class="text-right">₹{{ formatCurrency(leaveTravelAllowance * 12) }}</td>
                <td class="text-right text-muted">{{ ((leaveTravelAllowance / (monthlyWage || 1)) * 100).toFixed(1) }}%</td>
              </tr>

              <!-- 6. Fixed Allowance (Balancing Component) -->
              <tr class="highlight-row">
                <td>
                  <strong>Fixed Allowance</strong>
                  <span class="type-hint text-emerald">Balancing Special Allowance</span>
                </td>
                <td>
                  <span class="formula-pill auto">Wage - (All Other Components)</span>
                </td>
                <td class="text-right highlight text-emerald">₹{{ formatCurrency(fixedAllowance) }}</td>
                <td class="text-right">₹{{ formatCurrency(fixedAllowance * 12) }}</td>
                <td class="text-right text-muted">{{ ((fixedAllowance / (monthlyWage || 1)) * 100).toFixed(1) }}%</td>
              </tr>
            </tbody>

            <!-- Table Footer Totals -->
            <tfoot>
              <tr class="total-row">
                <td colspan="2"><strong>Total Monthly Gross Wage</strong></td>
                <td class="text-right total-value">₹{{ formatCurrency(totalAllocated) }}</td>
                <td class="text-right total-value">₹{{ formatCurrency(totalAllocated * 12) }}</td>
                <td class="text-right total-value">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Statutory Deductions & Take Home Grid -->
      <div class="deductions-grid">
        <!-- PF & Tax Deductions Card -->
        <div class="section-card">
          <div class="card-header">
            <h3>📉 Statutory Deductions</h3>
          </div>
          <div class="deduction-list">
            <div class="deduction-item">
              <div class="ded-info">
                <span class="ded-title">Provident Fund (PF) Contribution</span>
                <span class="ded-rule">12% of Basic Salary</span>
              </div>
              <span class="ded-amount">- ₹{{ formatCurrency(pfContribution) }}</span>
            </div>

            <div class="deduction-item">
              <div class="ded-info">
                <span class="ded-title">Professional Tax (PT)</span>
                <span class="ded-rule">Monthly statutory state tax</span>
              </div>
              <span class="ded-amount">- ₹{{ formatCurrency(professionalTax) }}</span>
            </div>

            <div class="deduction-item">
              <div class="ded-info">
                <span class="ded-title">Estimated Income Tax / TDS</span>
                <span class="ded-rule">Based on monthly wage bracket</span>
              </div>
              <span class="ded-amount">- ₹{{ formatCurrency(incomeTaxEstimate) }}</span>
            </div>

            <div class="deduction-divider"></div>

            <div class="deduction-item total">
              <strong>Total Monthly Deductions</strong>
              <strong class="text-rose">- ₹{{ formatCurrency(totalDeductions) }}</strong>
            </div>
          </div>
        </div>

        <!-- Net Take-Home Calculation Summary Card -->
        <div class="section-card net-summary-card">
          <div class="card-header">
            <h3>💵 Net Take-Home Pay Summary</h3>
          </div>
          <div class="net-body">
            <div class="net-row">
              <span>Gross Monthly Wage</span>
              <span>₹{{ formatCurrency(monthlyWage) }}</span>
            </div>
            <div class="net-row">
              <span>Total Monthly Deductions</span>
              <span class="text-rose">- ₹{{ formatCurrency(totalDeductions) }}</span>
            </div>

            <div class="net-big-box">
              <span class="net-label">Net In-Hand Take-Home</span>
              <span class="net-val">₹{{ formatCurrency(netTakeHome) }}</span>
              <span class="net-sub">Credited to employee bank account monthly</span>
            </div>

            <div class="annual-net-box">
              <span>Annual Net Take-Home:</span>
              <strong>₹{{ formatCurrency(netTakeHome * 12) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  employee: {
    type: Object,
    default: () => ({})
  }
});

// Check if current user is Admin
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = computed(() => currentUser.role === 'Admin');

// Monthly Wage state
const monthlyWage = ref(50000);

// Yearly Wage calculation (Monthly * 12)
const yearlyWage = computed(() => (monthlyWage.value || 0) * 12);

// 1. Basic Salary = 50% of Monthly Wage
const basicSalary = computed(() => {
  return Math.round(((monthlyWage.value || 0) * 50) / 100);
});

// 2. House Rent Allowance (HRA) = 50% of Basic Salary
const hraSalary = computed(() => {
  return Math.round((basicSalary.value * 50) / 100);
});

// 3. Standard Allowance = Fixed ₹4,167
const standardAllowance = computed(() => {
  return (monthlyWage.value || 0) >= 30000 ? 4167 : Math.round((monthlyWage.value || 0) * 0.05);
});

// 4. Performance Bonus = 8.33% of Monthly Wage
const performanceBonus = computed(() => {
  return Math.round(((monthlyWage.value || 0) * 8.33) / 100);
});

// 5. Leave Travel Allowance (LTA) = Fixed ₹2,000
const leaveTravelAllowance = computed(() => {
  return (monthlyWage.value || 0) >= 40000 ? 2000 : 1000;
});

// Subtotal before balancing Fixed Allowance
const subtotalBeforeFixed = computed(() => {
  return basicSalary.value + hraSalary.value + standardAllowance.value + performanceBonus.value + leaveTravelAllowance.value;
});

// 6. Fixed Allowance = Balancing component so sum equals defined monthly wage
const fixedAllowance = computed(() => {
  const diff = (monthlyWage.value || 0) - subtotalBeforeFixed.value;
  return diff > 0 ? diff : 0;
});

// Total Allocated
const totalAllocated = computed(() => {
  return subtotalBeforeFixed.value + fixedAllowance.value;
});

const isOverAllocated = computed(() => {
  return subtotalBeforeFixed.value > (monthlyWage.value || 0);
});

// Statutory Deductions:
// 1. PF Contribution = 12% of Basic Salary
const pfContribution = computed(() => {
  return Math.round(basicSalary.value * 0.12);
});

// 2. Professional Tax (PT) = ₹200
const professionalTax = computed(() => 200);

// 3. Tax / TDS Estimate (progressive slab estimate)
const incomeTaxEstimate = computed(() => {
  const wage = monthlyWage.value || 0;
  if (wage > 100000) return Math.round(wage * 0.10);
  if (wage > 60000) return Math.round(wage * 0.05);
  return 0;
});

// Total Deductions
const totalDeductions = computed(() => {
  return pfContribution.value + professionalTax.value + incomeTaxEstimate.value;
});

// Net Take-Home Pay
const netTakeHome = computed(() => {
  const net = (monthlyWage.value || 0) - totalDeductions.value;
  return net > 0 ? net : 0;
});

// Currency formatting helper (e.g. 50,000)
const formatCurrency = (val) => {
  if (isNaN(val)) return '0';
  return Number(val).toLocaleString('en-IN');
};

// Save salary structure simulation
const saveSalaryStructure = () => {
  const payload = {
    monthlyWage: monthlyWage.value,
    yearlyWage: yearlyWage.value,
    basicSalary: basicSalary.value,
    hraSalary: hraSalary.value,
    standardAllowance: standardAllowance.value,
    performanceBonus: performanceBonus.value,
    leaveTravelAllowance: leaveTravelAllowance.value,
    fixedAllowance: fixedAllowance.value,
    pfContribution: pfContribution.value,
    netTakeHome: netTakeHome.value
  };
  localStorage.setItem(`salary_${props.employee._id || 'default'}`, JSON.stringify(payload));
  alert('✅ Salary structure and payroll calculations saved successfully!');
};

onMounted(() => {
  const saved = localStorage.getItem(`salary_${props.employee._id || 'default'}`);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.monthlyWage) monthlyWage.value = data.monthlyWage;
    } catch (e) {
      console.error('Failed to load saved salary', e);
    }
  }
});
</script>

<style scoped>
.salary-info-wrapper {
  color: #0f172a;
}

/* Access Denied Card */
.access-denied-card {
  background: #ffffff;
  border: 1px solid #fee2e2;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 500px;
  margin: 2rem auto;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.05);
}

.denied-icon {
  font-size: 2.8rem;
  margin-bottom: 1rem;
}

.access-denied-card h3 {
  color: #b91c1c;
  font-size: 1.35rem;
  margin: 0 0 0.5rem 0;
}

.access-denied-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.role-pill.employee {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.metric-card.primary { border-top: 4px solid #6b21a8; }
.metric-card.success { border-top: 4px solid #10b981; }
.metric-card.purple { border-top: 4px solid #581c87; }
.metric-card.danger { border-top: 4px solid #f43f5e; }
.metric-card.info { border-top: 4px solid #3b82f6; }

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-header .label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}

.badge.success { background: #ecfdf5; color: #059669; }
.badge.danger { background: #fef2f2; color: #dc2626; }
.badge.info { background: #f3e8ff; color: #7e22ce; }
.badge.purple { background: #f3e8ff; color: #6b21a8; }

.metric-card .value {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0f172a;
}

.metric-card .subtext {
  font-size: 0.8rem;
  color: #64748b;
}

.text-emerald { color: #059669 !important; }
.text-rose { color: #dc2626 !important; }
.text-purple { color: #581c87 !important; }

/* Wage Control Card */
.wage-control-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.control-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.input-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-block label, .presets-block label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.input-currency-box {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 0.75rem;
}

.input-currency-box:focus-within {
  border-color: #6b21a8;
  background: #ffffff;
}

.symbol {
  color: #6b21a8;
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 0.35rem;
}

.main-wage-input {
  background: transparent;
  border: none;
  color: #0f172a;
  padding: 0.6rem 0.25rem;
  font-size: 1.3rem;
  font-weight: 700;
  width: 140px;
  outline: none;
}

.presets-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-preset {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 0.5rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-preset:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.btn-preset.active {
  background: #581c87;
  color: white;
  border-color: #581c87;
}

.save-block {
  margin-left: auto;
}

.btn-save {
  background-color: #059669;
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background-color: #047857;
}

.alert-banner {
  margin-top: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

/* Section Card & Table */
.section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  margin-bottom: 1.5rem;
}

.card-header {
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.75rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
}

.section-sub {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.table-responsive {
  overflow-x: auto;
}

.salary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.salary-table th {
  background: #f8fafc;
  color: #64748b;
  font-size: 0.75rem;
  text-transform: uppercase;
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 700;
}

.salary-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.salary-table tbody tr:hover {
  background: #faf5ff;
}

.type-hint {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
}

.formula-pill {
  background: #f1f5f9;
  color: #475569;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.formula-pill.auto {
  background: #ecfdf5;
  color: #059669;
}

.text-right { text-align: right; }
.highlight { font-weight: 700; color: #0f172a; font-size: 0.95rem; }
.text-muted { color: #64748b; }

.total-row td {
  background: #f8fafc;
  border-top: 2px solid #cbd5e1;
  font-size: 1rem;
}

.total-value {
  color: #581c87;
  font-weight: 800;
}

/* Deductions Grid */
.deductions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
}

.deduction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deduction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ded-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ded-title {
  color: #1e293b;
  font-weight: 600;
  font-size: 0.9rem;
}

.ded-rule {
  font-size: 0.75rem;
  color: #94a3b8;
}

.ded-amount {
  font-weight: 700;
  color: #dc2626;
  font-size: 0.95rem;
}

.deduction-divider {
  height: 1px;
  background: #e2e8f0;
}

.deduction-item.total {
  font-size: 1rem;
  color: #0f172a;
}

/* Net Summary Card */
.net-summary-card {
  background: #ffffff;
  border: 1px solid #a7f3d0;
}

.net-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.net-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #475569;
}

.net-big-box {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.5rem 0;
}

.net-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #047857;
  font-weight: 700;
}

.net-val {
  font-size: 2rem;
  font-weight: 800;
  color: #047857;
}

.net-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.annual-net-box {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #0f172a;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .control-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .save-block {
    margin-left: 0;
    width: 100%;
  }
  .btn-save {
    width: 100%;
  }
}
</style>