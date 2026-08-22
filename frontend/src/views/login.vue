<template>
  <div class="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
    <!-- Centered Rectangular Card -->
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden min-h-[540px]">
      
      <!-- Left Section: Form -->
      <div class="w-full lg:w-[56%] flex flex-col justify-between p-8 sm:p-10">
        <!-- Header Logo & Brand -->
        <div class="flex items-center gap-2.5">
          <svg class="w-7 h-7 text-[#172033]" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 23C4.5 19.5 5 15 8 13.5C11 12 14.5 15 17 21" stroke="#172033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 24C10 17 11.5 10 15 8C18 6 19.5 11 20 23" stroke="#172033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 5C17.5 10 17.5 19 20 25C22.5 19 22.5 10 20 5Z" stroke="#172033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 24C30 17 28.5 10 25 8C22 6 20.5 11 20 23" stroke="#172033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M33 23C35.5 19.5 35 15 32 13.5C29 12 25.5 15 23 21" stroke="#172033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 25C17 26 23 26 26 25" stroke="#172033" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="text-2xl font-bold tracking-tight text-slate-900 font-serif" style="font-family: Georgia, serif;">Dayflow</span>
        </div>

        <!-- Main Login Form Container -->
        <div class="w-full max-w-sm mx-auto my-auto py-4">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p class="text-slate-400 text-xs sm:text-sm mt-1 mb-6 font-normal">Please enter your details</p>

          <form @submit.prevent="handleLogin" class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Email address / Login ID</label>
              <input 
                v-model="loginIdentifier" 
                type="text" 
                placeholder="e.g. DFIJODO20260001 or admin@dayflow.com" 
                required 
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#5e3b8a] focus:border-[#5e3b8a] text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#5e3b8a] focus:border-[#5e3b8a] text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs"
              />
            </div>

            <div class="flex items-center justify-between text-xs pt-0.5">
              <label class="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input 
                  type="checkbox" 
                  class="w-3.5 h-3.5 rounded border-slate-300 text-[#5e3b8a] focus:ring-[#5e3b8a] accent-[#5e3b8a] cursor-pointer" 
                />
                <span>Remember for 30 days</span>
              </label>
              <a href="#" class="text-[#5e3b8a] font-semibold hover:underline">Forgot password</a>
            </div>

            <button 
              type="submit" 
              class="w-full py-2.5 px-4 bg-[#593c8f] hover:bg-[#4a2e7b] active:scale-[0.99] text-white font-medium rounded-md shadow-sm transition duration-150 text-sm cursor-pointer mt-1"
            >
              Sign in
            </button>

            <p v-if="error" class="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-md text-center font-medium mt-2">
              {{ error }}
            </p>
          </form>

          <p class="mt-5 text-center text-xs text-slate-500">
            Don't have an account? 
            <router-link to="/register" class="text-[#593c8f] font-semibold hover:underline ml-1">
              Sign up
            </router-link>
          </p>
        </div>

        <!-- Footer Info -->
        <div class="text-[11px] text-slate-400">
          © {{ new Date().getFullYear() }} Dayflow Inc. All rights reserved.
        </div>
      </div>

      <!-- Right Section: Lilac/Purple Graphic Banner -->
      <div class="hidden lg:flex lg:w-[44%] bg-[#9874ce] items-center justify-center relative p-6 overflow-hidden">
        <AuthIllustration />
      </div>

    </div>
  </div>
</template>

<script>
import api from '../api/axios';
import AuthIllustration from '../components/AuthIllustration.vue';

export default {
  components: {
    AuthIllustration,
  },
  data() {
    return { 
      loginIdentifier: '', 
      password: '', 
      error: '' 
    };
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

        const role = (res.data.user.role || 'employee').toLowerCase();
        if (role === 'admin') {
          this.$router.push('/admin/dashboard');
        } else {
          this.$router.push('/employee/dashboard');
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
      }
    },
  },
};
</script>