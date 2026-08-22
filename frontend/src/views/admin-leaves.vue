<template>
  <div class="page-wrapper">
    <navbar />
    <div class="dayflow-container">
      <!-- Header Section -->
      <div class="header-card">
        <div class="header-left">
          <div class="brand-pill">
            <span class="pill-dot"></span>
            Dayflow Admin
          </div>
          <h1 class="page-title">Leave Requests</h1>
          <p class="page-subtitle">Review and manage employee time-off requests.</p>
        </div>

        <!-- Filter Controls -->
        <div class="filter-controls">
          <div class="status-filter-group">
            <label for="statusFilter">Status:</label>
            <select id="statusFilter" v-model="filterStatus" class="saas-select-sm">
              <option value="All">All Requests</option>
              <option value="Pending">Pending Only</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button @click="fetchLeaveRequests" class="btn btn-primary btn-sm">Refresh</button>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <!-- Leave Requests Data Card -->
      <div class="card">
        <div class="card-header-flex">
          <div>
            <h2 class="section-title">
              Leave Applications
              <span class="filter-tag">({{ filterStatus }} Requests)</span>
            </h2>
            <p class="section-subtitle">Pending reviews and historical leave decisions</p>
          </div>
          <span class="count-pill">{{ filteredRequests.length }} requests</span>
        </div>

        <div v-if="loading" class="loading-box">Loading leave applications...</div>

        <!-- Table View -->
        <div v-else-if="filteredRequests.length > 0" class="table-responsive">
          <table class="saas-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Admin Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in filteredRequests" :key="req._id">
                <td class="emp-name">{{ getEmployeeName(req.userId) }}</td>
                <td class="font-medium">{{ req.userId?.employeeId || '--' }}</td>
                <td>{{ req.userId?.department || 'General' }}</td>
                <td>
                  <span class="type-pill">{{ req.leaveType }}</span>
                </td>
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
                <td>
                  <div v-if="req.status === 'Pending'" class="actions-inline">
                    <button
                      @click="openActionModal(req, 'Approved')"
                      class="btn-action btn-approve"
                    >
                      Approve
                    </button>
                    <button
                      @click="openActionModal(req, 'Rejected')"
                      class="btn-action btn-reject"
                    >
                      Reject
                    </button>
                  </div>
                  <span v-else class="processed-label">
                    {{ req.status === 'Approved' ? '✓ Approved' : '✗ Rejected' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-box">
          No leave requests found matching the current filter.
        </div>
      </div>

      <!-- Action Confirmation Modal (Approve / Reject) -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <span class="modal-category">{{ actionType === 'Approved' ? 'Approve Request' : 'Reject Request' }}</span>
              <h3 class="modal-heading">{{ actionType === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request' }}</h3>
            </div>
            <button @click="closeModal" class="modal-close-btn">&times;</button>
          </div>

          <div v-if="modalError" class="alert alert-error">{{ modalError }}</div>

          <div v-if="selectedRequest" class="summary-box">
            <div class="summary-line">
              <span class="sum-label">Employee:</span>
              <span class="sum-val font-bold">{{ getEmployeeName(selectedRequest.userId) }} ({{ selectedRequest.userId?.employeeId || 'N/A' }})</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Leave Type:</span>
              <span class="sum-val">{{ selectedRequest.leaveType }}</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Duration:</span>
              <span class="sum-val text-purple font-medium">{{ formatDate(selectedRequest.startDate) }} to {{ formatDate(selectedRequest.endDate) }} ({{ selectedRequest.daysCount }} days)</span>
            </div>
            <div class="summary-line">
              <span class="sum-label">Reason:</span>
              <span class="sum-val italic">{{ selectedRequest.remarks }}</span>
            </div>
          </div>

          <form @submit.prevent="submitAction" class="modal-form">
            <div class="form-group">
              <label for="adminComments" class="form-label">
                Admin Comments / Notes
                <span v-if="actionType === 'Rejected'" class="required">*</span>
                <span v-else class="optional">(Optional)</span>
              </label>
              <textarea
                id="adminComments"
                v-model="adminComments"
                :placeholder="actionType === 'Approved' ? 'Add any approval notes (optional)...' : 'Please provide reason for rejection...'"
                rows="3"
                :required="actionType === 'Rejected'"
                class="saas-textarea"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="actionLoading"
                :class="['btn', actionType === 'Approved' ? 'btn-primary' : 'btn-danger']"
              >
                {{ actionLoading ? 'Processing...' : (actionType === 'Approved' ? 'Confirm Approval' : 'Confirm Rejection') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '../components/navbar.vue';
import api from '../api/axios';

export default {
  name: 'AdminLeavesView',
  components: { navbar },
  data() {
    return {
      requests: [],
      loading: false,
      filterStatus: 'All',
      errorMessage: '',
      successMessage: '',
      showModal: false,
      selectedRequest: null,
      actionType: 'Approved',
      adminComments: '',
      actionLoading: false,
      modalError: '',
    };
  },
  computed: {
    filteredRequests() {
      if (this.filterStatus === 'All') {
        return this.requests;
      }
      return this.requests.filter((r) => r.status === this.filterStatus);
    },
  },
  mounted() {
    this.fetchLeaveRequests();
  },
  methods: {
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
    getEmployeeName(userObj) {
      if (!userObj) return 'Unknown Employee';
      const name = `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim();
      return name || userObj.email || 'Unknown';
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
    async fetchLeaveRequests() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const res = await api.get('/leaves/admin/all');
        this.requests = res.data;
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || 'Failed to load employee leave requests';
      } finally {
        this.loading = false;
      }
    },
    openActionModal(req, action) {
      this.selectedRequest = req;
      this.actionType = action;
      this.adminComments = '';
      this.modalError = '';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedRequest = null;
      this.adminComments = '';
      this.modalError = '';
    },
    async submitAction() {
      if (!this.selectedRequest) return;
      this.modalError = '';
      this.actionLoading = true;
      try {
        const res = await api.patch(`/leaves/admin/${this.selectedRequest._id}/status`, {
          status: this.actionType,
          adminComments: this.adminComments,
        });

        this.successMessage =
          res.data.message || `Leave request ${this.actionType.toLowerCase()} successfully!`;
        this.closeModal();
        await this.fetchLeaveRequests();
      } catch (err) {
        this.modalError =
          err.response?.data?.message || `Failed to ${this.actionType.toLowerCase()} leave request`;
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

.filter-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-filter-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.saas-select-sm {
  padding: 0.45rem 0.85rem;
  border: 1px solid #e7eaf0;
  border-radius: 8px;
  font-size: 0.85rem;
  background-color: #ffffff;
  color: #172033;
  cursor: pointer;
}

.saas-select-sm:focus {
  outline: none;
  border-color: #6040a0;
  box-shadow: 0 0 0 3px rgba(96, 64, 160, 0.1);
}

/* Card */
.card {
  background-color: #ffffff;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  padding: 1.75rem;
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

.filter-tag {
  font-size: 0.95rem;
  color: #7b8496;
  font-weight: normal;
  margin-left: 0.4rem;
}

.count-pill {
  background-color: #f3eefa;
  color: #6040a0;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
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

.emp-name {
  font-weight: 600;
  color: #172033;
  white-space: nowrap;
}

.font-medium {
  font-weight: 600;
  color: #172033;
}

.font-bold {
  font-weight: 700;
  color: #172033;
}

.type-pill {
  background-color: #f3eefa;
  color: #6040a0;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
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

.processed-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #7b8496;
  white-space: nowrap;
}

/* Status Pills */
.pill {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
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

/* Action Buttons */
.actions-inline {
  display: flex;
  gap: 0.4rem;
  white-space: nowrap;
}

.btn-action {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
}

.btn-approve {
  background-color: #6040a0;
  color: #ffffff;
}

.btn-approve:hover {
  background-color: #4b2f78;
}

.btn-reject {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-reject:hover {
  background-color: #fca5a5;
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
  font-size: 1.25rem;
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

.summary-box {
  background-color: #f9f8fc;
  border: 1px solid #e5dcf4;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-line {
  display: flex;
  font-size: 0.9rem;
}

.sum-label {
  width: 95px;
  font-weight: 600;
  color: #7b8496;
  flex-shrink: 0;
}

.sum-val {
  color: #172033;
}

.text-purple {
  color: #6040a0;
}

.italic {
  font-style: italic;
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

.optional {
  color: #94a3b8;
  font-weight: normal;
  font-size: 0.8rem;
}

.saas-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e7eaf0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  background-color: #ffffff;
  color: #172033;
}

.saas-textarea:focus {
  outline: none;
  border-color: #6040a0;
  box-shadow: 0 0 0 3px rgba(96, 64, 160, 0.1);
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
  padding: 0.45rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
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

.btn-danger {
  background-color: #dc2626;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
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
}
</style>
