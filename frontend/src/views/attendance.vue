<template>
  <div class="page-wrapper">
    <navbar />
    <div class="dayflow-container">
      <!-- Header Section -->
      <div class="header-card">
        <div class="header-left">
          <div class="brand-pill">
            <span class="pill-dot"></span>
            Dayflow
          </div>
          <h1 class="page-title">My Attendance</h1>
          <p class="page-subtitle">Track your daily attendance and working hours.</p>
        </div>
        <div class="header-right">
          <div class="date-clock-box">
            <div class="clock-date-label">{{ currentDateStr }}</div>
            <div class="digital-clock">{{ currentTimeStr }}</div>
          </div>
        </div>
      </div>

      <!-- Messages & Alerts -->
      <div v-if="actionMessage" class="alert alert-success">{{ actionMessage }}</div>
      <div v-if="actionError" class="alert alert-error">{{ actionError }}</div>
      <div v-if="statusError" class="alert alert-error">{{ statusError }}</div>

      <!-- Today's Attendance Section -->
      <div class="card">
        <div class="card-header-flex">
          <div>
            <h2 class="section-title">Today's Attendance</h2>
            <p class="section-subtitle">Real-time daily punch record and calculated work duration</p>
          </div>
          <!-- Status Pill with Dot -->
          <div :class="['status-badge', getStatusPillClass(currentStatus)]">
            <span class="status-dot"></span>
            <span>{{ currentStatus }}</span>
          </div>
        </div>

        <div v-if="statusLoading" class="loading-box">Loading today's status...</div>

        <div v-else>
          <!-- Metric Cards Grid -->
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-title">CHECK IN</span>
              <span class="metric-value">{{ formatTime(todayAttendance?.checkIn) }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-title">CHECK OUT</span>
              <span class="metric-value">{{ formatTime(todayAttendance?.checkOut) }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-title">WORK HOURS</span>
              <span class="metric-value">{{ todayAttendance?.workHours ?? 0 }} hrs</span>
            </div>
            <div class="metric-card">
              <span class="metric-title">EXTRA HOURS</span>
              <span class="metric-value">{{ todayAttendance?.extraHours ?? 0 }} hrs</span>
            </div>
          </div>

          <!-- Action Buttons Area -->
          <div class="actions-row">
            <button
              @click="handleCheckIn"
              :disabled="isCheckedIn || actionLoading"
              class="btn btn-primary"
            >
              <span v-if="actionLoading && !isCheckedIn">Processing...</span>
              <span v-else>{{ isCheckedIn ? '✓ Checked In' : 'Check In' }}</span>
            </button>

            <button
              @click="handleCheckOut"
              :disabled="!isCheckedIn || isCheckedOut || actionLoading"
              class="btn btn-outline"
            >
              <span v-if="actionLoading && isCheckedIn && !isCheckedOut">Processing...</span>
              <span v-else>{{ isCheckedOut ? '✓ Checked Out' : 'Check Out' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Attendance History Section -->
      <div class="card">
        <div class="card-header-flex flex-wrap">
          <div>
            <h2 class="section-title">Attendance History</h2>
            <p class="section-subtitle">View and filter your previous attendance records.</p>
          </div>

          <!-- Filters Toolbar -->
          <div class="filter-toolbar">
            <div class="filter-field">
              <label for="startDate">From</label>
              <input id="startDate" type="date" v-model="filterStartDate" class="date-input" />
            </div>
            <div class="filter-field">
              <label for="endDate">To</label>
              <input id="endDate" type="date" v-model="filterEndDate" class="date-input" />
            </div>
            <button @click="fetchHistory" class="btn btn-primary btn-sm">Filter</button>
            <button @click="resetFilter" class="btn btn-secondary btn-sm">Reset</button>
          </div>
        </div>

        <div v-if="historyError" class="alert alert-error">{{ historyError }}</div>
        <div v-if="historyLoading" class="loading-box">Loading attendance history...</div>

        <!-- History Table -->
        <div v-else-if="history.length > 0" class="table-responsive">
          <table class="saas-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in history" :key="item._id">
                <td class="font-medium">{{ formatDate(item.date) }}</td>
                <td>{{ formatTime(item.checkIn) }}</td>
                <td>{{ formatTime(item.checkOut) }}</td>
                <td>{{ item.workHours ?? 0 }} hrs</td>
                <td>{{ item.extraHours ?? 0 }} hrs</td>
                <td>
                  <span :class="['pill', getPillClass(item.status)]">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-box">
          No attendance records found for the selected period.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '../components/navbar.vue';
import api from '../api/axios';

export default {
  name: 'AttendanceView',
  components: { navbar },
  data() {
    return {
      currentDateStr: '',
      currentTimeStr: '',
      clockTimer: null,
      statusLoading: false,
      statusError: '',
      todayData: null,
      actionLoading: false,
      actionMessage: '',
      actionError: '',
      history: [],
      historyLoading: false,
      historyError: '',
      filterStartDate: '',
      filterEndDate: '',
    };
  },
  computed: {
    todayAttendance() {
      return this.todayData?.attendance || null;
    },
    isCheckedIn() {
      return Boolean(this.todayData?.checkedIn);
    },
    isCheckedOut() {
      return Boolean(this.todayData?.checkedOut);
    },
    currentStatus() {
      if (!this.todayAttendance) {
        return 'Not Checked In';
      }
      return this.todayAttendance.status || 'Present';
    },
  },
  mounted() {
    this.updateClock();
    this.clockTimer = setInterval(this.updateClock, 1000);
    this.fetchTodayStatus();
    this.fetchHistory();
  },
  beforeUnmount() {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
  },
  methods: {
    updateClock() {
      const now = new Date();
      this.currentDateStr = now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      this.currentTimeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
    formatDate(dateVal) {
      if (!dateVal) return '--';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    formatTime(isoString) {
      if (!isoString) return '--';
      return new Date(isoString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
    getStatusPillClass(status) {
      switch (status) {
        case 'Present':
          return 'status-present';
        case 'Half-day':
          return 'status-halfday';
        case 'Leave':
          return 'status-leave';
        case 'Absent':
          return 'status-absent';
        default:
          return 'status-neutral';
      }
    },
    getPillClass(status) {
      switch (status) {
        case 'Present':
          return 'pill-present';
        case 'Half-day':
          return 'pill-halfday';
        case 'Leave':
          return 'pill-leave';
        case 'Absent':
          return 'pill-absent';
        default:
          return 'pill-neutral';
      }
    },
    async fetchTodayStatus() {
      this.statusLoading = true;
      this.statusError = '';
      try {
        const res = await api.get('/attendance/status');
        this.todayData = res.data;
      } catch (err) {
        this.statusError = err.response?.data?.message || 'Failed to load today status';
      } finally {
        this.statusLoading = false;
      }
    },
    async fetchHistory() {
      this.historyLoading = true;
      this.historyError = '';
      try {
        const params = {};
        if (this.filterStartDate) params.startDate = this.filterStartDate;
        if (this.filterEndDate) params.endDate = this.filterEndDate;

        const res = await api.get('/attendance/my-history', { params });
        this.history = res.data;
      } catch (err) {
        this.historyError = err.response?.data?.message || 'Failed to load attendance history';
      } finally {
        this.historyLoading = false;
      }
    },
    resetFilter() {
      this.filterStartDate = '';
      this.filterEndDate = '';
      this.fetchHistory();
    },
    async handleCheckIn() {
      this.actionLoading = true;
      this.actionMessage = '';
      this.actionError = '';
      try {
        const res = await api.post('/attendance/check-in');
        this.actionMessage = res.data.message || 'Check-in recorded successfully!';
        await this.fetchTodayStatus();
        await this.fetchHistory();
      } catch (err) {
        this.actionError = err.response?.data?.message || 'Failed to check in';
      } finally {
        this.actionLoading = false;
      }
    },
    async handleCheckOut() {
      this.actionLoading = true;
      this.actionMessage = '';
      this.actionError = '';
      try {
        const res = await api.post('/attendance/check-out');
        this.actionMessage = res.data.message || 'Check-out recorded successfully!';
        await this.fetchTodayStatus();
        await this.fetchHistory();
      } catch (err) {
        this.actionError = err.response?.data?.message || 'Failed to check out';
      } finally {
        this.actionLoading = false;
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
  max-width: 1200px;
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

.date-clock-box {
  background-color: #f8fafc;
  border: 1px solid #e7eaf0;
  border-radius: 12px;
  padding: 0.85rem 1.5rem;
  text-align: right;
}

.clock-date-label {
  font-size: 0.82rem;
  color: #7b8496;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.digital-clock {
  font-size: 1.4rem;
  font-weight: 700;
  color: #172033;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
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
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-header-flex.flex-wrap {
  flex-wrap: wrap;
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

/* Status Badge with Dot */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-present {
  background-color: #dcfce7;
  color: #16a34a;
}
.status-present .status-dot { background-color: #16a34a; }

.status-halfday {
  background-color: #fef3c7;
  color: #d97706;
}
.status-halfday .status-dot { background-color: #d97706; }

.status-leave {
  background-color: #f3eefa;
  color: #6040a0;
}
.status-leave .status-dot { background-color: #6040a0; }

.status-absent {
  background-color: #fee2e2;
  color: #dc2626;
}
.status-absent .status-dot { background-color: #dc2626; }

.status-neutral {
  background-color: #f1f4f9;
  color: #7b8496;
}
.status-neutral .status-dot { background-color: #94a3b8; }

/* Metric Grid */
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background-color: #f8fafc;
  border: 1px solid #e7eaf0;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.metric-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #7b8496;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 1.15rem;
  color: #172033;
  font-weight: 600;
}

/* Actions Row */
.actions-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.actions-row .btn {
  flex: 1;
  min-width: 170px;
  padding: 0.75rem 1.5rem;
  font-size: 0.92rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
}

.btn-sm {
  padding: 0.45rem 0.95rem;
  font-size: 0.85rem;
}

.btn-primary {
  background-color: #6040a0;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4b2f78;
}

.btn-primary:disabled {
  background-color: #f3eefa;
  color: #6040a0;
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  background-color: #ffffff;
  color: #6040a0;
  border: 1px solid #e5dcf4;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f3eefa;
}

.btn-outline:disabled {
  background-color: #f8fafc;
  color: #94a3b8;
  border-color: #e7eaf0;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f1f4f9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

/* Filter Toolbar */
.filter-toolbar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.filter-field {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.date-input {
  padding: 0.45rem 0.75rem;
  border: 1px solid #e7eaf0;
  border-radius: 8px;
  font-size: 0.85rem;
  background-color: #ffffff;
  color: #172033;
}

.date-input:focus {
  outline: none;
  border-color: #6040a0;
  box-shadow: 0 0 0 3px rgba(96, 64, 160, 0.1);
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

/* Pills */
.pill {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.pill-present {
  background-color: #dcfce7;
  color: #16a34a;
}

.pill-halfday {
  background-color: #fef3c7;
  color: #d97706;
}

.pill-leave {
  background-color: #f3eefa;
  color: #6040a0;
}

.pill-absent {
  background-color: #fee2e2;
  color: #dc2626;
}

.pill-neutral {
  background-color: #f1f4f9;
  color: #7b8496;
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
  .header-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .date-clock-box {
    text-align: left;
    width: 100%;
  }
  .filter-toolbar {
    width: 100%;
  }
}
</style>
