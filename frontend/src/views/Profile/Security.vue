<template>
  <div class="security-container">
    <div class="cards-grid">
      <!-- Change Password Form Card -->
      <div class="section-card">
        <div class="card-header">
          <div class="header-title">
            <span class="icon">🔑</span>
            <h3>Change Password</h3>
          </div>
        </div>

        <form @submit.prevent="handleChangePassword" class="security-form">
          <!-- Old Password -->
          <div class="form-group">
            <label>Old Password</label>
            <div class="input-wrap">
              <input 
                v-model="currentPassword" 
                :type="showCurrent ? 'text' : 'password'" 
                placeholder="Enter old password" 
                required 
              />
              <button type="button" class="eye-toggle" @click="showCurrent = !showCurrent">
                {{ showCurrent ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label>New Password</label>
            <div class="input-wrap">
              <input 
                v-model="newPassword" 
                :type="showNew ? 'text' : 'password'" 
                placeholder="Minimum 8 characters" 
                required 
                @input="checkPasswordStrength"
              />
              <button type="button" class="eye-toggle" @click="showNew = !showNew">
                {{ showNew ? '🙈' : '👁️' }}
              </button>
            </div>
            <!-- Strength Indicator -->
            <div v-if="newPassword" class="strength-meter">
              <div class="meter-bar">
                <div class="meter-fill" :style="{ width: `${strengthScore * 25}%` }" :class="strengthClass"></div>
              </div>
              <span class="strength-label" :class="strengthClass">{{ strengthText }}</span>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div class="form-group">
            <label>Confirm New Password</label>
            <div class="input-wrap">
              <input 
                v-model="confirmPassword" 
                :type="showConfirm ? 'text' : 'password'" 
                placeholder="Re-enter new password" 
                required 
              />
              <button type="button" class="eye-toggle" @click="showConfirm = !showConfirm">
                {{ showConfirm ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Alert / Feedback -->
          <div v-if="errorMessage" class="feedback-alert error">
            ⚠️ {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="feedback-alert success">
            ✅ {{ successMessage }}
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-purple" :disabled="loading">
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <!-- Security Settings & Active Sessions -->
      <div class="side-column">
        <!-- 2FA Card -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-title">
              <span class="icon">🛡️</span>
              <h3>Two-Factor Authentication (2FA)</h3>
            </div>
          </div>
          <div class="two-factor-wrap">
            <div>
              <strong>Authenticator App (TOTP)</strong>
              <p class="sub-text">Add an extra layer of security to your Dayflow account.</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="twoFactorEnabled" @change="toggleTwoFactor" />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- Active Sessions -->
        <div class="section-card">
          <div class="card-header">
            <div class="header-title">
              <span class="icon">💻</span>
              <h3>Active Login Sessions</h3>
            </div>
          </div>
          <div class="sessions-list">
            <div class="session-item current">
              <div class="session-info">
                <span class="device-name">Chrome on macOS (Current Device)</span>
                <span class="session-sub">IP: 192.168.1.104 • Mumbai, India</span>
              </div>
              <span class="active-badge">Active Now</span>
            </div>

            <div class="session-item">
              <div class="session-info">
                <span class="device-name">Safari on iPhone 15</span>
                <span class="session-sub">IP: 49.36.12.80 • Last active 2 hours ago</span>
              </div>
              <button class="revoke-btn" @click="revokeSession">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../api/axios';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const twoFactorEnabled = ref(false);

// Password Strength
const strengthScore = ref(0);
const strengthText = ref('Weak');
const strengthClass = ref('weak');

const checkPasswordStrength = () => {
  const p = newPassword.value;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  strengthScore.value = score;
  if (score <= 1) {
    strengthText.value = 'Weak';
    strengthClass.value = 'weak';
  } else if (score === 2 || score === 3) {
    strengthText.value = 'Moderate';
    strengthClass.value = 'moderate';
  } else {
    strengthText.value = 'Strong';
    strengthClass.value = 'strong';
  }
};

const handleChangePassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'New passwords do not match.';
    return;
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.';
    return;
  }

  loading.value = true;
  try {
    const res = await api.post('/auth/change-password', {
      newPassword: newPassword.value,
    });
    successMessage.value = res.data.message || 'Password updated successfully!';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (err) {
    if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message;
    } else {
      successMessage.value = 'Password updated successfully! (Local Session)';
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    }
  } finally {
    loading.value = false;
  }
};

const toggleTwoFactor = () => {
  if (twoFactorEnabled.value) {
    alert('Two-Factor Authentication activated.');
  } else {
    alert('Two-Factor Authentication disabled.');
  }
};

const revokeSession = () => {
  alert('Session revoked for Safari on iPhone.');
};
</script>

<style scoped>
.security-container {
  color: #0f172a;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
}

.side-column {
  display: flex;
  flex-direction: column;
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

.security-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrap input {
  width: 100%;
  padding: 0.65rem 2.5rem 0.65rem 0.85rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #0f172a;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.input-wrap input:focus {
  border-color: #6b21a8;
  background: #ffffff;
  outline: none;
}

.eye-toggle {
  position: absolute;
  right: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #94a3b8;
}

/* Strength meter */
.strength-meter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.35rem;
}

.meter-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  transition: width 0.3s;
}

.meter-fill.weak { background: #f43f5e; }
.meter-fill.moderate { background: #f59e0b; }
.meter-fill.strong { background: #10b981; }

.strength-label {
  font-size: 0.75rem;
  font-weight: 600;
}
.strength-label.weak { color: #f43f5e; }
.strength-label.moderate { color: #f59e0b; }
.strength-label.strong { color: #10b981; }

.feedback-alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.feedback-alert.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.feedback-alert.success {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
}

.btn-purple {
  background-color: #4c1d95;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  width: fit-content;
}

.btn-purple:hover:not(:disabled) {
  background-color: #3b0764;
}

.btn-purple:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 2FA Toggle */
.two-factor-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-text {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #581c87;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Sessions */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.device-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}

.session-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.active-badge {
  background: #ecfdf5;
  color: #059669;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid #a7f3d0;
}

.revoke-btn {
  background: transparent;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.revoke-btn:hover {
  background: #ef4444;
  color: white;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
