<template>
  <div class="page-wrapper">
    <navbar />
    <div class="dayflow-container">
      <!-- Hero Header Card -->
      <div class="hero-card">
        <div class="hero-left">
          <div class="dayflow-pill">
            <span class="pill-dot"></span>
            Dayflow Admin
          </div>
          <h2 class="hero-title">Employee Attendance</h2>
          <p class="hero-subtitle">Comprehensive overview of company attendance records and daily work hours.</p>
        </div>

        <!-- Date Filter Control -->
        <div class="filter-controls">
          <div class="date-input-group">
            <label for="adminDateFilter">Select Date:</label>
            <input
              id="adminDateFilter"
              type="date"
              v-model="selectedDate"
              @change="fetchAdminAttendance"
              class="dayflow-input"
            />
          </div>
          <button @click="fetchAdminAttendance" class="btn btn-primary btn-sm">Refresh</button>
          <button @click="clearDateFilter" class="btn btn-secondary btn-sm">Show All</button>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <!-- Attendance Data Card -->
      <div class="content-card">
        <div class="card-header-row">
          <div>
            <h3 class="card-title">
              Attendance Records
              <span v-if="selectedDate" class="active-filter-label">for {{ formatDate(selectedDate) }}</span>
              <span v-else class="active-filter-label">(All Recorded Dates)</span>
            </h3>
            <p class="card-subtitle">Real-time punch activity and overtime analysis</p>
          </div>
          <span class="count-badge">{{ records.length }} records</span>
        </div>

        <div v-if="loading" class="loading-state">Loading attendance records...</div>

        <!-- Table View -->
        <div v-else-if="records.length > 0" class="table-container">
          <table class="dayflow-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in records" :key="item._id">
                <td class="emp-name">
                  {{ getEmployeeName(item.userId) }}
                </td>
                <td class="font-medium">{{ item.userId?.employeeId || '--' }}</td>
                <td>{{ item.userId?.department || 'General' }}</td>
                <td>{{ item.userId?.designation || 'Associate' }}</td>
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ formatTime(item.checkIn) }}</td>
                <td>{{ formatTime(item.checkOut) }}</td>
                <td>{{ item.workHours ?? 0 }} hrs</td>
                <td>{{ item.extraHours ?? 0 }} hrs</td>
                <td>
                  <span :class="['badge', getStatusBadgeClass(item.status)]">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          No attendance records found for the selected criteria.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '../components/navbar.vue';
import api from '../api/axios';

export default {
  name: 'AdminAttendanceView',
  components: { navbar },
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      records: [],
      loading: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.fetchAdminAttendance();
  },
  methods: {
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
    getEmployeeName(userObj) {
      if (!userObj) return 'Unknown Employee';
      const name = `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim();
      return name || userObj.email || 'Unknown';
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'Present':
          return 'badge-present';
        case 'Half-day':
          return 'badge-halfday';
        case 'Leave':
          return 'badge-leave';
        case 'Absent':
          return 'badge-absent';
        default:
          return 'badge-neutral';
      }
    },
    async fetchAdminAttendance() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const params = {};
        if (this.selectedDate) {
          params.date = this.selectedDate;
        }
        const res = await api.get('/attendance/admin/all', { params });
        this.records = res.data;
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || 'Failed to load employee attendance records';
      } finally {
        this.loading = false;
      }
    },
    clearDateFilter() {
      this.selectedDate = '';
      this.fetchAdminAttendance();
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  background-color: #f5f8fb;
  min-height: 100vh;
}

.dayflow-container {
  max-width: 1250px;
  margin: 1.75rem auto;
  padding: 0 1.25rem 3rem 1.25rem;
}

/* Hero Header Card */
.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}

.dayflow-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #f1e8fb;
  color: #5b3a91;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #5b3a91;
}

.hero-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #172033;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.dayflow-input {
  padding: 0.45rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  background-color: #ffffff;
  color: #172033;
}

.dayflow-input:focus {
  outline: none;
  border-color: #5b3a91;
  box-shadow: 0 0 0 3px rgba(91, 58, 145, 0.1);
}

/* Alerts */
.alert {
  padding: 0.85rem 1.15rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
  font-size: 0.92rem;
  font-weight: 500;
}

.alert-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Content Card */
.content-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  margin: 0;
  color: #172033;
  font-size: 1.2rem;
  font-weight: 700;
}

.card-subtitle {
  margin: 0.2rem 0 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.active-filter-label {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: normal;
  margin-left: 0.4rem;
}

.count-badge {
  background-color: #f1e8fb;
  color: #5b3a91;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
}

/* Table */
.table-container {
  border: 1px solid #eef2f6;
  border-radius: 12px;
  overflow-x: auto;
}

.dayflow-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.dayflow-table th,
.dayflow-table td {
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid #f1f5f9;
}

.dayflow-table th {
  background-color: #fafbfc;
  color: #172033;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
}

.dayflow-table tr:last-child td {
  border-bottom: none;
}

.dayflow-table tr:hover td {
  background-color: #fdfbfe;
}

.emp-name {
  font-weight: 600;
  color: #172033;
  white-space: nowrap;
}

.font-medium {
  font-weight: 500;
  color: #172033;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-present {
  background-color: #dcfce7;
  color: #166534;
}

.badge-halfday {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-leave {
  background-color: #f1e8fb;
  color: #5b3a91;
}

.badge-absent {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-neutral {
  background-color: #f1f5f9;
  color: #475569;
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
}

.btn-sm {
  padding: 0.45rem 0.95rem;
  font-size: 0.85rem;
}

.btn-primary {
  background-color: #5b3a91;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #4b2f78;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #64748b;
  font-size: 0.92rem;
}

@media (max-width: 768px) {
  .hero-card {
    padding: 1.25rem;
  }
  .content-card {
    padding: 1.25rem;
  }
}
</style>
