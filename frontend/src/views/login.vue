<template>
  <div class="auth-container">
    <h2>Sign In</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <router-link to="/register">Need an account? Sign Up</router-link>
  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return { email: '', password: '', error: '' };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await api.post('/auth/login', { email: this.email, password: this.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (res.data.user.role === 'Admin') {
          this.$router.push('/employees');
        } else {
          this.$router.push('/attendance');

        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
      }
    },
  },
};
</script>

<style scoped>
.auth-container { max-width: 400px; margin: 4rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
input { display: block; width: 100%; margin-bottom: 1rem; padding: 0.5rem; }
button { width: 100%; padding: 0.5rem; background-color: #2563eb; color: white; border: none; cursor: pointer; }
.error { color: red; margin-top: 0.5rem; }
</style>