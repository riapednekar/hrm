<template>
  <div class="private-info-container">
    <!-- Notice banner for View-Only status -->
    <div class="access-notice">
      <div class="notice-icon">🔒</div>
      <div class="notice-text">
        <strong>Confidential & Private Information:</strong> This data is restricted and view-only for employees. Contact HR Administration to request updates.
      </div>
      <span class="read-only-badge">Read-Only</span>
    </div>

    <div class="cards-grid">
      <!-- Section 1: Private Personal Information -->
      <div class="section-card">
        <div class="card-header">
          <div class="header-title">
            <span class="icon">👤</span>
            <h3>Personal Information</h3>
          </div>
        </div>

        <div class="info-list">
          <div class="info-row">
            <span class="label">Date of Birth</span>
            <span class="value">{{ privateData.dob }}</span>
          </div>

          <div class="info-row">
            <span class="label">Gender</span>
            <span class="value">{{ privateData.gender }}</span>
          </div>

          <div class="info-row">
            <span class="label">Marital Status</span>
            <span class="value">{{ privateData.maritalStatus }}</span>
          </div>

          <div class="info-row">
            <span class="label">Nationality</span>
            <span class="value">{{ privateData.nationality }}</span>
          </div>

          <div class="info-row">
            <span class="label">Personal Email</span>
            <span class="value link">{{ privateData.personalEmail }}</span>
          </div>

          <div class="info-row">
            <span class="label">Date of Joining</span>
            <span class="value date-badge">{{ privateData.dateOfJoining }}</span>
          </div>

          <div class="info-row full-row">
            <span class="label">Residential Address</span>
            <span class="value address-text">{{ privateData.residentialAddress }}</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Bank & Tax Details -->
      <div class="section-card">
        <div class="card-header">
          <div class="header-title">
            <span class="icon">🏦</span>
            <h3>Bank & Statutory Details</h3>
          </div>
        </div>

        <div class="info-list">
          <div class="info-row">
            <span class="label">Employee Code</span>
            <span class="value code-highlight">{{ employee.loginId || privateData.employeeCode }}</span>
          </div>

          <div class="info-row">
            <span class="label">Bank Name</span>
            <span class="value">{{ privateData.bankName }}</span>
          </div>

          <div class="info-row">
            <span class="label">Account Number</span>
            <span class="value masked-text">{{ privateData.accountNumber }}</span>
          </div>

          <div class="info-row">
            <span class="label">IFSC Code</span>
            <span class="value code-highlight">{{ privateData.ifscCode }}</span>
          </div>

          <div class="info-row">
            <span class="label">PAN Number</span>
            <span class="value code-highlight">{{ privateData.panNumber }}</span>
          </div>

          <div class="info-row">
            <span class="label">UAN Number</span>
            <span class="value code-highlight">{{ privateData.uanNumber }}</span>
          </div>

          <div class="info-row full-row">
            <span class="label">Salary Payment Mode</span>
            <span class="value status-badge-pill">Direct Bank Transfer (NEFT/RTGS)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  employee: {
    type: Object,
    default: () => ({})
  }
});

const privateData = ref({
  dob: '14 August 1995',
  gender: 'Male',
  maritalStatus: 'Single',
  nationality: 'Indian',
  personalEmail: props.employee.email ? `personal.${props.employee.email.split('@')[0]}@gmail.com` : 'personal.jane@gmail.com',
  dateOfJoining: '01 February 2026',
  residentialAddress: 'Flat 402, Sunset Heights, Linking Road, Bandra West, Mumbai, Maharashtra 400050',
  employeeCode: props.employee.loginId || 'DAJADO20260002',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '•••• •••• 9821',
  ifscCode: 'HDFC0001234',
  panNumber: 'ABCDE1234F',
  uanNumber: '101234567890'
});
</script>

<style scoped>
.private-info-container {
  color: #0f172a;
}

.access-notice {
  background: #fdf4ff;
  border: 1px solid #f5d0fe;
  border-radius: 12px;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.notice-icon {
  font-size: 1.25rem;
}

.notice-text {
  flex: 1;
  font-size: 0.875rem;
  color: #701a75;
}

.read-only-badge {
  background: #fae8ff;
  color: #a21caf;
  border: 1px solid #f0abfc;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-weight: 700;
  text-transform: uppercase;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
}

.section-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.card-header {
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.75rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-title .icon {
  font-size: 1.1rem;
}

.header-title h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.info-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-row.full-row {
  grid-column: span 2;
}

.label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
}

.value.link {
  color: #6b21a8;
}

.value.code-highlight {
  font-family: monospace;
  color: #6b21a8;
  letter-spacing: 0.5px;
  background: #f3e8ff;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.value.masked-text {
  font-family: monospace;
  letter-spacing: 1px;
}

.date-badge {
  color: #059669;
}

.address-text {
  line-height: 1.5;
  color: #334155;
  font-weight: 500;
}

.status-badge-pill {
  color: #059669;
  background: #ecfdf5;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  width: fit-content;
  border: 1px solid #a7f3d0;
  font-weight: 600;
}

@media (max-width: 640px) {
  .info-list {
    grid-template-columns: 1fr;
  }
  .info-row.full-row {
    grid-column: span 1;
  }
}
</style>
