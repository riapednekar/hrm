<template>
  <div class="profile-header-card">
    <div class="header-main">
      <!-- Avatar Section -->
      <div class="avatar-wrapper">
        <img 
          :src="employee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName || 'Jane'}`" 
          :alt="employee.name"
          class="avatar-img"
        />
        <span class="status-indicator" title="Active Status"></span>
      </div>

      <!-- Main Identity Info -->
      <div class="identity-info">
        <div class="name-row">
          <h1 class="employee-name">{{ employee.firstName }} {{ employee.lastName }}</h1>
          <span class="id-pill">ID: {{ employee.loginId || employee.employeeId || 'DAJADO20260002' }}</span>
          <span class="role-badge" :class="employee.role === 'Admin' ? 'badge-admin' : 'badge-employee'">
            {{ employee.role || 'EMPLOYEE' }}
          </span>
          <span class="status-badge">Active</span>
        </div>

        <p class="designation-text">{{ employee.designation || employee.job || 'Associate' }} • {{ employee.department || 'General' }}</p>

        <!-- Grid of primary details matching Dayflow theme -->
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Email Address</span>
            <span class="detail-value">{{ employee.email || 'employee@dayflow.com' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Phone Number</span>
            <span class="detail-value">{{ employee.phone || '9988776655' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Company</span>
            <span class="detail-value">{{ employee.companyName || 'Dayflow Global' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Department</span>
            <span class="detail-value">{{ employee.department || 'General' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Manager</span>
            <span class="detail-value">{{ employee.manager || 'Sarah Jenkins (VP)' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location</span>
            <span class="detail-value">{{ employee.location || 'Mumbai, India' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Year Joined</span>
            <span class="detail-value">{{ employee.yearOfJoining || 2026 }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Employment Type</span>
            <span class="detail-value highlight-purple">Full-Time Regular</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  employee: {
    type: Object,
    required: true,
    default: () => ({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@dayflow.com',
      phone: '9988776655',
      loginId: 'DAJADO20260002',
      role: 'Employee',
      designation: 'Associate',
      companyName: 'Dayflow Global',
      department: 'General',
      manager: 'Sarah Jenkins (VP)',
      location: 'Mumbai, India',
      yearOfJoining: 2026,
      status: 'Active'
    })
  }
});
</script>

<style scoped>
.profile-header-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 1.75rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  color: #0f172a;
  margin-bottom: 1.5rem;
}

.header-main {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: cover;
  background: #f3e8ff;
  border: 3px solid #6b21a8;
  box-shadow: 0 4px 12px rgba(107, 33, 168, 0.15);
}

.status-indicator {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #10b981;
  border: 3px solid #ffffff;
}

.identity-info {
  flex: 1;
  min-width: 280px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}

.employee-name {
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
}

.id-pill {
  background: #f3e8ff;
  color: #6b21a8;
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
}

.role-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-admin {
  background-color: #581c87;
  color: #ffffff;
}

.badge-employee {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.status-badge {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

.designation-text {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0.2rem 0 1.25rem 0;
  font-weight: 500;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.85rem 1.5rem;
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.875rem;
}

.detail-label {
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.detail-value {
  color: #1e293b;
  font-weight: 600;
}

.highlight-purple {
  color: #6b21a8;
}

@media (max-width: 768px) {
  .profile-header-card {
    padding: 1.25rem;
  }
  .header-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .name-row {
    justify-content: center;
  }
  .details-grid {
    grid-template-columns: 1fr;
    text-align: left;
  }
}
</style>