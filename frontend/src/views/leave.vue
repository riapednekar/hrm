<template>
  <div class="page-wrapper">
    <navbar />
    <div class="dayflow-container">
      <!-- Top Header Section -->
      <div class="header-card">
        <div class="header-left">
          <div class="brand-pill">
            <span class="pill-dot"></span>
            Dayflow
          </div>
          <h1 class="page-title">Time Off</h1>
          <p class="page-subtitle">Manage your leave balance and time-off requests.</p>
        </div>
        <div class="header-actions">
          <router-link v-if="isAdmin" to="/admin/leaves" class="btn btn-outline-admin">
            ⚙ Manage Team Requests
          </router-link>
          <button @click="showApplyModal = true" class="btn btn-primary">
            + New Request
          </button>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <!-- Leave Balances Section -->
      <div class="balance-grid">
        <!-- Card 1: Paid Time Off -->
        <div class="balance-card pto-card">
          <div class="balance-header">
            <div class="balance-meta">
              <span class="balance-title">Paid Time Off</span>
              <span class="balance-total-tag">{{ balance?.paidTimeOff?.total ?? 15 }} days total</span>
            </div>
            <span class="type-pill pill-purple">Annual</span>
          </div>

          <div class="balance-center">
            <div class="balance-num-row">
              <span class="balance-big-num text-purple">{{ balance?.paidTimeOff?.remaining ?? 0 }}</span>
              <span class="balance-unit">days remaining</span>
            </div>
            <!-- Progress Bar -->
            <div class="progress-bar-bg">
              <div
                class="progress-bar-fill fill-purple"
                :style="{ width: getProgressPercent(balance?.paidTimeOff?.remaining, balance?.paidTimeOff?.total ?? 15) }"
              ></div>
            </div>
          </div>

          <div class="balance-footer">
            <span>Used: <strong>{{ balance?.paidTimeOff?.used ?? 0 }} days</strong></span>
            <span>Available: <strong>{{ balance?.paidTimeOff?.remaining ?? 0 }} / {{ balance?.paidTimeOff?.total ?? 15 }}</strong></span>
          </div>
        </div>

        <!-- Card 2: Sick Leave -->
        <div class="balance-card sick-card">
          <div class="balance-header">
            <div class="balance-meta">
              <span class="balance-title">Sick Leave</span>
              <span class="balance-total-tag">{{ balance?.sickLeave?.total ?? 10 }} days total</span>
            </div>
            <span class="type-pill pill-green">Medical</span>
          </div>

          <div class="balance-center">
            <div class="balance-num-row">
              <span class="balance-big-num text-green">{{ balance?.sickLeave?.remaining ?? 0 }}</span>
              <span class="balance-unit">days remaining</span>
            </div>
            <!-- Progress Bar -->
            <div class="progress-bar-bg">
              <div
                class="progress-bar-fill fill-green"
                :style="{ width: getProgressPercent(balance?.sickLeave?.remaining, balance?.sickLeave?.total ?? 10) }"
              ></div>
            </div>
          </div>

          <div class="balance-footer">
            <span>Used: <strong>{{ balance?.sickLeave?.used ?? 0 }} days</strong></span>
            <span>Available: <strong>{{ balance?.sickLeave?.remaining ?? 0 }} / {{ balance?.sickLeave?.total ?? 10 }}</strong></span>
          </div>
        </div>

        <!-- Card 3: Unpaid Leave -->
        <div class="balance-card unpaid-card">
          <div class="balance-header">
            <div class="balance-meta">
              <span class="balance-title">Unpaid Leave</span>
              <span class="balance-total-tag">Subject to Approval</span>
            </div>
            <span class="type-pill pill-amber">Unpaid</span>
          </div>

          <div class="balance-center">
            <div class="balance-num-row">
              <span class="balance-big-num text-amber">{{ balance?.unpaidLeave?.used ?? 0 }}</span>
              <span class="balance-unit">days taken</span>
            </div>
            <div class="unpaid-info-note">
              <span>Non-deductible policy quota</span>
            </div>
          </div>

          <div class="balance-footer">
            <span>Status: <strong>Active</strong></span>
            <span>Requires Review: <strong>Yes</strong></span>
          </div>
        </div>
      </div>

      <!-- Year / Leave Calendar Section -->
      <div class="card calendar-card">
        <div class="calendar-header-row">
          <div class="cal-title-group">
            <h2 class="section-title">Leave Calendar (Year at a Glance)</h2>
            <p class="section-subtitle">Visual overview of your scheduled and historical time-off</p>
          </div>

          <!-- Calendar Controls & Legend -->
          <div class="cal-controls-legend">
            <!-- Year Selector -->
            <div class="year-navigator">
              <button @click="currentYear--" class="year-nav-btn" title="Previous Year">&lsaquo;</button>
              <span class="year-label">{{ currentYear }}</span>
              <button @click="currentYear++" class="year-nav-btn" title="Next Year">&rsaquo;</button>
            </div>

            <!-- Legend Pills -->
            <div class="cal-legend">
              <span class="legend-item"><span class="legend-dot dot-approved"></span> Approved</span>
              <span class="legend-item"><span class="legend-dot dot-pending"></span> Pending</span>
              <span class="legend-item"><span class="legend-dot dot-rejected"></span> Rejected</span>
            </div>
          </div>
        </div>

        <!-- 12-Month Grid -->
        <div class="year-grid">
          <div v-for="month in monthsList" :key="month.index" class="month-box">
            <div class="month-title">{{ month.name }}</div>

            <!-- Week Header -->
            <div class="weekdays-row">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            <!-- Days Grid -->
            <div class="month-days-grid">
              <!-- Empty slots for days before 1st -->
              <span
                v-for="blank in getMonthBlanks(currentYear, month.index)"
                :key="'blank-' + blank"
                class="day-cell day-blank"
              ></span>

              <!-- Actual days -->
              <span
                v-for="day in getDaysInMonth(currentYear, month.index)"
                :key="'day-' + day"
                :class="[
                  'day-cell',
                  isWeekend(currentYear, month.index, day) ? 'day-weekend' : '',
                  getDayLeaveStatusClass(currentYear, month.index, day),
                  isToday(currentYear, month.index, day) ? 'day-today' : ''
                ]"
                :title="getDayTooltip(currentYear, month.index, day)"
              >
                {{ day }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Apply Leave Modal -->
      <div v-if="showApplyModal" class="modal-overlay" @click.self="closeApplyModal">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <span class="modal-category">Time Off Request</span>
              <h3 class="modal-heading">Apply for Leave</h3>
            </div>
            <button @click="closeApplyModal" class="modal-close-btn">&times;</button>
          </div>

          <form @submit.prevent="handleApplyLeave" class="modal-form">
            <div v-if="formError" class="alert alert-error">{{ formError }}</div>

            <div class="form-group">
              <label for="leaveType" class="form-label">Leave Type <span class="required">*</span></label>
              <select id="leaveType" v-model="form.leaveType" required class="saas-select">
                <option value="Paid Time Off">Paid Time Off (PTO)</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate" class="form-label">Start Date <span class="required">*</span></label>
                <input
                  id="startDate"
                  type="date"
                  v-model="form.startDate"
                  required
                  class="saas-input"
                />
              </div>

              <div class="form-group">
                <label for="endDate" class="form-label">End Date <span class="required">*</span></label>
                <input
                  id="endDate"
                  type="date"
                  v-model="form.endDate"
                  required
                  class="saas-input"
                />
              </div>
            </div>

            <!-- Duration preview if dates selected -->
            <div v-if="calculatedDays > 0" class="duration-preview-box">
              <div class="preview-line">
                <span class="preview-dates">{{ formatShortDate(form.startDate) }} &rarr; {{ formatShortDate(form.endDate) }}</span>
                <span class="preview-count"><strong>{{ calculatedDays }}</strong> calendar day{{ calculatedDays > 1 ? 's' : '' }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="remarks" class="form-label">Remarks / Purpose <span class="required">*</span></label>
              <textarea
                id="remarks"
                v-model="form.remarks"
                placeholder="Please describe the purpose or reason for your leave request..."
                rows="3"
                required
                class="saas-textarea"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeApplyModal" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" :disabled="submitLoading" class="btn btn-primary">
                {{ submitLoading ? 'Submitting...' : 'Submit Leave Request' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- My Leave Requests Section -->
      <div class="card">
        <div class="card-header-flex">
          <div>
            <h2 class="section-title">My Requests</h2>
            <p class="section-subtitle">Track your personal leave applications and management review feedback</p>
          </div>
          <span class="count-pill">{{ requests.length }} requests</span>
        </div>

        <div v-if="requestsLoading" class="loading-box">Loading your leave requests...</div>

        <!-- Table View -->
        <div v-else-if="requests.length > 0" class="table-responsive">
          <table class="saas-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Admin Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in requests" :key="req._id">
                <td class="font-medium">{{ req.leaveType }}</td>
                <td>{{ formatDate(req.startDate) }}</td>
                <td>{{ formatDate(req.endDate) }}</td>
                <td><strong class="font-bold">{{ req.daysCount }}</strong></td>
                <td class="remarks-cell" :title="req.remarks">{{ req.remarks }}</td>
                <td>
                  <span :class="['pill', getStatusPillClass(req.status)]">
                    {{ req.status }}
                  </span>
                </td>
                <td class="admin-comment-cell" :title="req.adminComments">
                  {{ req.adminComments || '--' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-box">
          You have not submitted any leave requests yet. Click <strong>"+ New Request"</strong> to submit your first application.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '../components/navbar.vue';
import api from '../api/axios';

export default {
  name: 'LeaveView',
  components: { navbar },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      monthsList: [
        { name: 'January', index: 0 },
        { name: 'February', index: 1 },
        { name: 'March', index: 2 },
        { name: 'April', index: 3 },
        { name: 'May', index: 4 },
        { name: 'June', index: 5 },
        { name: 'July', index: 6 },
        { name: 'August', index: 7 },
        { name: 'September', index: 8 },
        { name: 'October', index: 9 },
        { name: 'November', index: 10 },
        { name: 'December', index: 11 },
      ],
      balance: null,
      balanceLoading: false,
      requests: [],
      requestsLoading: false,
      showApplyModal: false,
      submitLoading: false,
      successMessage: '',
      errorMessage: '',
      formError: '',
      form: {
        leaveType: 'Paid Time Off',
        startDate: '',
        endDate: '',
        remarks: '',
      },
    };
  },
  computed: {
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role === 'Admin';
    },
    calculatedDays() {
      if (!this.form.startDate || !this.form.endDate) return 0;
      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      if (start > end) return 0;
      const diff = end.getTime() - start.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    },
  },
  mounted() {
    this.fetchLeaveBalance();
    this.fetchMyRequests();
  },
  methods: {
    getProgressPercent(remaining, total) {
      if (!total || total <= 0) return '0%';
      const val = Math.max(0, Math.min(100, (Number(remaining || 0) / Number(total)) * 100));
      return `${val}%`;
    },
    getMonthBlanks(year, monthIndex) {
      const firstDay = new Date(year, monthIndex, 1).getDay();
      return Array.from({ length: firstDay }, (_, i) => i);
    },
    getDaysInMonth(year, monthIndex) {
      const count = new Date(year, monthIndex + 1, 0).getDate();
      return Array.from({ length: count }, (_, i) => i + 1);
    },
    formatDateStr(year, monthIndex, day) {
      const m = String(monthIndex + 1).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      return `${year}-${m}-${d}`;
    },
    isWeekend(year, monthIndex, day) {
      const dayOfWeek = new Date(year, monthIndex, day).getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    },
    isToday(year, monthIndex, day) {
      const now = new Date();
      return (
        now.getFullYear() === year &&
        now.getMonth() === monthIndex &&
        now.getDate() === day
      );
    },
    getDayLeaveStatus(year, monthIndex, day) {
      const dateStr = this.formatDateStr(year, monthIndex, day);
      for (const req of this.requests) {
        if (!req.startDate || !req.endDate) continue;
        const start = req.startDate.slice(0, 10);
        const end = req.endDate.slice(0, 10);
        if (dateStr >= start && dateStr <= end) {
          return req.status; // 'Approved', 'Pending', 'Rejected'
        }
      }
      return null;
    },
    getDayLeaveStatusClass(year, monthIndex, day) {
      const status = this.getDayLeaveStatus(year, monthIndex, day);
      if (status === 'Approved') return 'day-approved';
      if (status === 'Pending') return 'day-pending';
      if (status === 'Rejected') return 'day-rejected';
      return '';
    },
    getDayTooltip(year, monthIndex, day) {
      const dateStr = this.formatDateStr(year, monthIndex, day);
      for (const req of this.requests) {
        if (!req.startDate || !req.endDate) continue;
        const start = req.startDate.slice(0, 10);
        const end = req.endDate.slice(0, 10);
        if (dateStr >= start && dateStr <= end) {
          return `${dateStr}: ${req.leaveType} (${req.status})`;
        }
      }
      return dateStr;
    },
    formatDate(dateVal) {
      if (!dateVal) return '--';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal).split('T')[0];
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    formatShortDate(dateVal) {
      if (!dateVal) return '';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    },
    getStatusPillClass(status) {
      switch (status) {
        case 'Approved':
          return 'pill-green';
        case 'Rejected':
          return 'pill-red';
        case 'Pending':
        default:
          return 'pill-amber';
      }
    },
    async fetchLeaveBalance() {
      this.balanceLoading = true;
      try {
        const res = await api.get('/leaves/balance');
        this.balance = res.data;
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || 'Failed to load leave balance.';
      } finally {
        this.balanceLoading = false;
      }
    },
    async fetchMyRequests() {
      this.requestsLoading = true;
      try {
        const res = await api.get('/leaves/my-requests');
        this.requests = res.data;
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || 'Failed to load your leave requests.';
      } finally {
        this.requestsLoading = false;
      }
    },
    closeApplyModal() {
      this.showApplyModal = false;
      this.formError = '';
      this.form = {
        leaveType: 'Paid Time Off',
        startDate: '',
        endDate: '',
        remarks: '',
      };
    },
    async handleApplyLeave() {
      this.formError = '';
      this.successMessage = '';
      this.errorMessage = '';

      if (new Date(this.form.startDate) > new Date(this.form.endDate)) {
        this.formError = 'Start date cannot be after end date.';
        return;
      }

      this.submitLoading = true;
      try {
        const res = await api.post('/leaves/apply', {
          leaveType: this.form.leaveType,
          startDate: this.form.startDate,
          endDate: this.form.endDate,
          remarks: this.form.remarks,
        });

        this.successMessage = res.data.message || 'Leave application submitted successfully!';
        this.closeApplyModal();
        await this.fetchLeaveBalance();
        await this.fetchMyRequests();
      } catch (err) {
        this.formError = err.response?.data?.message || 'Failed to submit leave request.';
      } finally {
        this.submitLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  background-color: #f6f8fb;
  min-height: 100vh;
}

.dayflow-container {
  max-width: 1250px;
  margin: 1.75rem auto;
  padding: 0 1.25rem 3rem 1.25rem;
}

/* Header Card */
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
}

.brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #f3eefa;
  color: #6040a0;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.22rem 0.65rem;
  border-radius: 9999px;
  margin-bottom: 0.45rem;
  letter-spacing: 0.02em;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #6040a0;
}

.page-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #172033;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 0;
  color: #7b8496;
  font-size: 0.92rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-outline-admin {
  background-color: #f8fafc;
  color: #172033;
  border: 1px solid #e7eaf0;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.1rem;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-outline-admin:hover {
  background-color: #f3eefa;
  border-color: #e5dcf4;
  color: #6040a0;
}

/* Balance Grid */
.balance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.balance-card {
  background-color: #ffffff;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.balance-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.balance-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #172033;
}

.balance-total-tag {
  font-size: 0.78rem;
  color: #7b8496;
}

.type-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.pill-purple {
  background-color: #f3eefa;
  color: #6040a0;
}

.pill-green {
  background-color: #dcfce7;
  color: #16a34a;
}

.pill-amber {
  background-color: #fef3c7;
  color: #d97706;
}

.pill-red {
  background-color: #fee2e2;
  color: #dc2626;
}

.balance-center {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.balance-num-row {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
}

.balance-big-num {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
}

.balance-unit {
  font-size: 0.88rem;
  color: #7b8496;
  font-weight: 600;
}

.text-purple { color: #6040a0; }
.text-green { color: #16a34a; }
.text-amber { color: #d97706; }

/* Progress Bars */
.progress-bar-bg {
  width: 100%;
  height: 6px;
  background-color: #f1f4f9;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.fill-purple { background-color: #6040a0; }
.fill-green { background-color: #16a34a; }

.unpaid-info-note {
  font-size: 0.78rem;
  color: #7b8496;
}

.balance-footer {
  border-top: 1px solid #f1f4f9;
  padding-top: 0.75rem;
  font-size: 0.82rem;
  color: #7b8496;
  display: flex;
  justify-content: space-between;
}

.balance-footer strong {
  color: #172033;
}

/* Card */
.card {
  background-color: #ffffff;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  color: #172033;
  font-size: 1.15rem;
  font-weight: 700;
}

.section-subtitle {
  margin: 0.2rem 0 0 0;
  font-size: 0.85rem;
  color: #7b8496;
}

.count-pill {
  background-color: #f3eefa;
  color: #6040a0;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
}

/* Year Calendar */
.calendar-card {
  overflow: hidden;
}

.calendar-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f1f4f9;
  padding-bottom: 1rem;
}

.cal-controls-legend {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.year-navigator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8fafc;
  border: 1px solid #e7eaf0;
  border-radius: 8px;
  padding: 0.2rem 0.5rem;
}

.year-nav-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  color: #6040a0;
  cursor: pointer;
  padding: 0 0.4rem;
  line-height: 1;
}

.year-nav-btn:hover {
  color: #4b2f78;
}

.year-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #172033;
  padding: 0 0.25rem;
}

.cal-legend {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.82rem;
  color: #475569;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-approved { background-color: #16a34a; }
.dot-pending { background-color: #d97706; }
.dot-rejected { background-color: #dc2626; }

/* 12 Months Grid */
.year-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.month-box {
  background-color: #f9fbfe;
  border: 1px solid #eef2f6;
  border-radius: 12px;
  padding: 0.9rem;
}

.month-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #172033;
  text-align: center;
  margin-bottom: 0.5rem;
}

.weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 0.35rem;
}

.month-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}

.day-cell {
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  padding: 0.25rem 0;
  border-radius: 4px;
  cursor: default;
  transition: all 0.15s;
}

.day-blank {
  visibility: hidden;
}

.day-weekend {
  color: #94a3b8;
}

.day-today {
  font-weight: 800;
  outline: 1px solid #6040a0;
  outline-offset: -1px;
}

.day-approved {
  background-color: #dcfce7 !important;
  color: #15803d !important;
  font-weight: 700 !important;
}

.day-pending {
  background-color: #fef3c7 !important;
  color: #b45309 !important;
  font-weight: 700 !important;
}

.day-rejected {
  background-color: #fee2e2 !important;
  color: #b91c1c !important;
  font-weight: 700 !important;
  text-decoration: line-through;
}

/* Table */
.table-responsive {
  border: 1px solid #e7eaf0;
  border-radius: 12px;
  overflow-x: auto;
}

.saas-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.saas-table th,
.saas-table td {
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid #f1f4f9;
}

.saas-table th {
  background-color: #fafbfc;
  color: #172033;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
}

.saas-table tr:last-child td {
  border-bottom: none;
}

.saas-table tr:hover td {
  background-color: #fbf9fe;
}

.font-medium {
  font-weight: 600;
  color: #172033;
}

.font-bold {
  font-weight: 700;
  color: #172033;
}

.remarks-cell {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #475569;
}

.admin-comment-cell {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #7b8496;
  font-style: italic;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  max-width: 520px;
  width: 100%;
  padding: 1.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  border: 1px solid #e7eaf0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.modal-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6040a0;
  background-color: #f3eefa;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 0.35rem;
}

.modal-heading {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #172033;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
}

.modal-close-btn:hover {
  color: #172033;
  background-color: #f1f4f9;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.4rem;
}

.required {
  color: #dc2626;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.saas-select,
.saas-input,
.saas-textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e7eaf0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: #ffffff;
  color: #172033;
  box-sizing: border-box;
}

.saas-select:focus,
.saas-input:focus,
.saas-textarea:focus {
  outline: none;
  border-color: #6040a0;
  box-shadow: 0 0 0 3px rgba(96, 64, 160, 0.1);
}

.duration-preview-box {
  background-color: #f9f8fc;
  border: 1px solid #e5dcf4;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.preview-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  color: #6040a0;
}

.preview-dates {
  font-weight: 600;
}

.preview-count {
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
}

.btn-primary {
  background-color: #6040a0;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4b2f78;
}

.btn-secondary {
  background-color: #f1f4f9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alerts */
.alert {
  padding: 0.85rem 1.15rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
  font-size: 0.92rem;
  font-weight: 500;
}

.alert-success {
  background-color: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Pills */
.pill {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.loading-box,
.empty-box {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #7b8496;
  font-size: 0.92rem;
}

@media (max-width: 768px) {
  .header-card,
  .card {
    padding: 1.25rem;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .cal-controls-legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
