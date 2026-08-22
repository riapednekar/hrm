<template>
  <div class="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
    <!-- Centered Rectangular Card -->
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden min-h-[580px]">
      
      <!-- Left Section: Form -->
      <div class="w-full lg:w-[58%] flex flex-col justify-between p-8 sm:p-10">
        <!-- Header Logo & Brand -->
        <div class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Dayflow Logo" class="h-8 w-auto object-contain" />
          <span class="text-2xl font-bold tracking-tight text-slate-900 font-serif" style="font-family: Georgia, serif;">Dayflow</span>
        </div>

        <!-- Main Register Form Container -->
        <div class="w-full max-w-md mx-auto my-auto py-3">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</h1>
          <p class="text-slate-400 text-xs sm:text-sm mt-1 mb-5 font-normal">Please enter your details to register your organization</p>

          <form @submit.prevent="handleRegister" class="space-y-3">
            <!-- Company Name + Upload -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <div class="flex gap-2">
                <input 
                  v-model="companyName" 
                  type="text" 
                  placeholder="Dayflow Inc." 
                  required 
                  class="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#5e3b8a] focus:border-[#5e3b8a] text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs"
                />
                <button 
                  type="button" 
                  class="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-600 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Upload custom logo"
                >
                  Upload Logo
                </button>
              </div>
            </div>

            <!-- Full Name & Email Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  v-model="name" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#5e3b8a] focus:border-[#5e3b8a] text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                <input 
                  v-model="email" 
                  type="email" 
                  placeholder="john@dayflow.com" 
                  required 
                  class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#5e3b8a] focus:border-[#5e3b8a] text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs"
                />
              </div>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input 
                v-model="phone" 
                type="tel" 
                placeholder="+91 98765 43210" 
                required 
                class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#5e3b8a] focus:border-[#5e3b8a] text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs"
              />
            </div>

            <!-- Passwords Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <input 
                  v-model="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#5e3b8a] focus:border-[#5e3b8a] text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-xs"
                />
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full py-2.5 px-4 bg-[#593c8f] hover:bg-[#4a2e7b] active:scale-[0.99] text-white font-medium rounded-md shadow-sm transition duration-150 text-sm cursor-pointer mt-1"
            >
              Sign up
            </button>
          </form>

          <div v-if="generatedLoginId" class="mt-3.5 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs text-center">
            Account created successfully! Your Login ID is: 
            <strong class="text-emerald-950 font-mono text-sm block mt-0.5 tracking-wider">{{ generatedLoginId }}</strong>
          </div>

          <p v-if="error" class="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded-md text-center font-medium">
            {{ error }}
          </p>

          <p class="mt-4 text-center text-xs text-slate-500">
            Already have an account? 
            <router-link to="/login" class="text-[#593c8f] font-semibold hover:underline ml-1">
              Sign in
            </router-link>
          </p>
        </div>

        <!-- Footer Info -->
        <div class="text-[11px] text-slate-400">
          © {{ new Date().getFullYear() }} Dayflow Inc. All rights reserved.
        </div>
      </div>

      <!-- Right Section: Lilac/Purple Graphic Banner -->
      <div class="hidden lg:flex lg:w-[42%] bg-[#9874ce] items-center justify-center relative p-6 overflow-hidden">
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
      companyName: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
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