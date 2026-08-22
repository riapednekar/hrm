<template>
  <div class="page-bg">
    <div class="card">
      <div class="logo-box">App/Web Logo</div>
      <h2>Sign Up Page</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <label>Company Name :-</label>
          <input v-model="companyName" type="text" required />
          <button type="button" class="upload-btn" title="Upload Logo">⬆</button>
        </div>

        <div class="form-row">
          <label>Name :-</label>
          <input v-model="name" type="text" required />
        </div>

        <div class="form-row">
          <label>Email :-</label>
          <input v-model="email" type="email" required />
        </div>

        <div class="form-row">
          <label>Phone :-</label>
          <input v-model="phone" type="tel" required />
        </div>

        <div class="form-row">
          <label>Password :-</label>
          <div class="input-with-icon">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" required />
            <span @click="showPassword = !showPassword" class="eye-icon">👁</span>
          </div>
        </div>

        <div class="form-row">
          <label>Confirm Password :-</label>
          <div class="input-with-icon">
            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required />
            <span @click="showConfirmPassword = !showConfirmPassword" class="eye-icon">👁</span>
          </div>
        </div>

        <button type="submit" class="btn-purple">Sign Up</button>
      </form>

      <div v-if="generatedLoginId" class="success-box">
        Account created! Your Login ID is: <strong>{{ generatedLoginId }}</strong>
      </div>
      <p v-if="error" class="error">{{ error }}</p>

      <p class="footer-text">
        Already have an account? <router-link to="/login">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return {
      companyName: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      generatedLoginId: '',
      error: '',
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      try {
        const res = await api.post('/auth/register', {
          companyName: this.companyName,
          name: this.name,
          email: this.email,
          phone: this.phone,
          password: this.password,
        });

        this.generatedLoginId = res.data.loginId;
        this.error = '';
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
      }
    },
  },
};
</script>

<style scoped>
.page-bg { min-height: 100vh; background-color: #121212; color: #fff; display: flex; justify-content: center; align-items: center; font-family: sans-serif; }
.card { background-color: #1e1e1e; border: 1px solid #333; border-radius: 8px; width: 420px; padding: 2rem; position: relative; }
.logo-box { background-color: #2a2d32; padding: 12px; border-radius: 6px; margin-bottom: 1.5rem; text-align: center; color: #aaa; }
.form-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.form-row label { width: 140px; font-size: 0.85rem; text-align: left; }
.form-row input { flex: 1; padding: 0.5rem; background-color: #121212; border: 1px solid #444; border-radius: 4px; color: #fff; }
.upload-btn { margin-left: 8px; padding: 0.4rem 0.6rem; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
.input-with-icon { flex: 1; display: flex; align-items: center; position: relative; }
.input-with-icon input { width: 100%; padding-right: 30px; }
.eye-icon { position: absolute; right: 8px; cursor: pointer; font-size: 0.8rem; color: #888; }
.btn-purple { width: 100%; padding: 0.7rem; background-color: #9333ea; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer; margin-top: 1rem; }
.btn-purple:hover { background-color: #a855f7; }
.footer-text { margin-top: 1.5rem; font-size: 0.85rem; text-align: center; color: #ccc; }
.footer-text a { color: #c084fc; text-decoration: none; }
.success-box { margin-top: 1rem; padding: 0.8rem; background-color: #166534; border-radius: 4px; text-align: center; font-size: 0.9rem; }
.error { color: #ef4444; margin-top: 0.5rem; text-align: center; font-size: 0.85rem; }
</style>