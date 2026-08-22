<template>
  <div class="page-bg">
    <h1 class="system-title">Human Resource Management System</h1>
    <div class="card">
      <div class="logo-box">App/Web Logo</div>
      <h2>Sign in Page</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Login Id/Email :-</label>
          <input v-model="loginIdentifier" type="text" required />
        </div>

        <div class="input-group">
          <label>Password :-</label>
          <input v-model="password" type="password" required />
        </div>

        <button type="submit" class="btn-purple">SIGN IN</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <p class="footer-text">
        Don't have an Account? <router-link to="/register">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return { loginIdentifier: '', password: '', error: '' };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await api.post('/auth/login', {
          loginIdentifier: this.loginIdentifier,
          password: this.password,
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (res.data.user.isFirstLogin) {
          alert('First login detected. Please change your auto-generated password.');
        }

        this.$router.push('/employees');
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
      }
    },
  },
};
</script>

<style scoped>
.page-bg { min-height: 100vh; background-color: #121212; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; }
.system-title { margin-bottom: 2rem; font-weight: normal; }
.card { background-color: #1e1e1e; border: 1px solid #333; border-radius: 8px; width: 340px; padding: 2rem; text-align: center; }
.logo-box { background-color: #2a2d32; padding: 12px; border-radius: 6px; margin-bottom: 1.5rem; color: #aaa; }
.input-group { text-align: left; margin-bottom: 1.2rem; }
.input-group label { display: block; margin-bottom: 0.4rem; font-size: 0.9rem; }
.input-group input { width: 100%; padding: 0.6rem; background-color: #121212; border: 1px solid #444; border-radius: 6px; color: #fff; box-sizing: border-box; }
.btn-purple { width: 100%; padding: 0.7rem; background-color: #9333ea; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer; margin-top: 0.5rem; }
.btn-purple:hover { background-color: #a855f7; }
.footer-text { margin-top: 1.5rem; font-size: 0.85rem; color: #ccc; }
.footer-text a { color: #c084fc; text-decoration: none; }
.error { color: #ef4444; margin-top: 0.5rem; font-size: 0.85rem; }
</style>