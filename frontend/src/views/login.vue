<template>
  <div class="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
    <!-- Centered Rectangular Card -->
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden min-h-[540px]">
      
      <!-- Left Section: Form -->
      <div class="w-full lg:w-[56%] flex flex-col justify-between p-8 sm:p-10">
        <!-- Header Logo & Brand -->
        <div class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Dayflow Logo" class="h-8 w-auto object-contain" />
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

        this.$router.push('/employees');
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
      }
    },
  },
};
</script>