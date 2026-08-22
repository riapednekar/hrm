<template>
  <div class="auth-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="firstName" type="text" placeholder="First Name" required />
      <input v-model="lastName" type="text" placeholder="Last Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <select v-model="role">
        <option value="Employee">Employee</option>
        <option value="Admin">Admin</option>
      </select>
      <button type="submit">Register</button>
      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <router-link to="/login">Already registered? Sign In</router-link>
  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return { firstName: '', lastName: '', email: '', password: '', role: 'Employee', error: '', message: '' };
  },
  methods: {
    async handleRegister() {
      try {
        const res = await api.post('/auth/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        this.message = `Account created! Assigned ID: ${res.data.employeeId}`;
        this.error = '';
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
      }
    },
  },
};
</script>

<style scoped>
.auth-container { max-width: 400px; margin: 4rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
input, select { display: block; width: 100%; margin-bottom: 1rem; padding: 0.5rem; }
button { width: 100%; padding: 0.5rem; background-color: #16a34a; color: white; border: none; cursor: pointer; }
.success { color: green; margin-top: 0.5rem; }
.error { color: red; margin-top: 0.5rem; }
</style>