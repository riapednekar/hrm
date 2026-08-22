<template>
  <div>
    <navbar />
    <div class="container">
      <h2>Employee Directory (Admin View)</h2>
      <div class="grid">
        <div v-for="emp in employees" :key="emp._id" class="card" @click="openModal(emp)">
          <h3>{{ emp.firstName }} {{ emp.lastName }}</h3>
          <p><strong>ID:</strong> {{ emp.employeeId }}</p>
          <p><strong>Role:</strong> {{ emp.role }}</p>
          <p><strong>Dept:</strong> {{ emp.department }}</p>
        </div>
      </div>

      <div v-if="selectedEmployee" class="modal-overlay" @click.self="selectedEmployee = null">
        <div class="modal-content">
          <h3>Employee Details</h3>
          <p><strong>ID:</strong> {{ selectedEmployee.employeeId }}</p>
          <p><strong>Name:</strong> {{ selectedEmployee.firstName }} {{ selectedEmployee.lastName }}</p>
          <p><strong>Email:</strong> {{ selectedEmployee.email }}</p>
          <p><strong>Role:</strong> {{ selectedEmployee.role }}</p>
          <p><strong>Department:</strong> {{ selectedEmployee.department }}</p>
          <p><strong>Designation:</strong> {{ selectedEmployee.designation }}</p>
          <button @click="selectedEmployee = null" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from '../components/navbar.vue';
import api from '../api/axios';

export default {
  components: { navbar },
  data() {
    return { employees: [], selectedEmployee: null };
  },
  async mounted() {
    try {
      const res = await api.get('/employees');
      this.employees = res.data;
    } catch (err) {
      alert('Failed to load employee directory');
    }
  },
  methods: {
    openModal(emp) { this.selectedEmployee = emp; },
  },
};
</script>

<style scoped>
.container { padding: 2rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.card { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; cursor: pointer; transition: 0.2s; }
.card:hover { background-color: #f8fafc; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; padding: 2rem; border-radius: 8px; width: 350px; }
.close-btn { margin-top: 1rem; padding: 0.4rem 0.8rem; background: #64748b; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>