<template>
  <nav class="navbar">
    <div class="logo-brand flex items-center gap-2">
      <img src="/logo.png" alt="Dayflow Logo" class="h-6 w-auto object-contain brightness-0 invert" />
      <span class="font-serif font-bold text-lg text-white tracking-wide">Dayflow</span>
    </div>
    <div v-if="user" class="user-info">
      <span>{{ user.firstName }} {{ user.lastName }} ({{ user.role }})</span>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') || 'null'),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: #1e293b; color: white; }
.logo-brand { display: flex; align-items: center; gap: 0.5rem; }
.logout-btn { margin-left: 1rem; padding: 0.4rem 0.8rem; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>