import { ref } from 'vue';
import { defineStore } from 'pinia';

interface User {
  _id: string;
  email: string;
  name: string;
}

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

    async function register(email: string, password: string, name: string) {
      try {
        console.log('Registering:', { email, name });
        const response = await $fetch<{ message: string; token?: string }>('/api/auth/register', {
          method: 'POST',
          body: { email, password, name },
        });
        console.log('Register response:', response);
        if (response.token) {
          token.value = response.token;
          console.log('Token saved:', token.value);
        } else {
          console.warn('No token received from register');
        }
        return response;
      } catch (error: any) {
        console.error('Register error:', error);
        throw new Error(error.data?.statusMessage || 'Registration failed');
      }
    }

    async function login(email: string, password: string) {
      try {
        console.log('Logging in:', { email });
        const response = await $fetch<{ token: string }>('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        });
        console.log('Login response:', response);
        token.value = response.token;
        await fetchProfile();
      } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.data?.statusMessage || 'Login failed');
      }
    }

    async function fetchProfile() {
      if (!token.value) {
        console.warn('No token available for fetchProfile');
        return null;
      }
      try {
        user.value = await $fetch<User>('/api/profile', {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        console.log('Profile fetched:', user.value);
        return user.value;
      } catch (error: any) {
        console.error('Fetch profile error:', error);
        if (error.status === 401 || error.status === 403) {
          logout();
          navigateTo('/login');
        }
        throw new Error(error.data?.statusMessage || 'Failed to fetch profile');
      }
    }

    async function updateProfile(name: string, email: string, password?: string) {
      if (!token.value) {
        console.warn('No token available for updateProfile');
        return null;
      }
      try {
        user.value = await $fetch<User>('/api/profile', {
          method: 'PUT',
          body: { name, email, password },
          headers: { Authorization: `Bearer ${token.value}` },
        });
        console.log('Profile updated:', user.value);
        return user.value;
      } catch (error: any) {
        console.error('Update profile error:', error);
        if (error.status === 401 || error.status === 403) {
          logout();
          navigateTo('/login');
        }
        throw new Error(error.data?.statusMessage || 'Failed to update profile');
      }
    }

    function logout() {
      user.value = null;
      token.value = null;
      localStorage.removeItem('pinia-user');
      console.log('Logged out');
    }

    return { user, token, register, login, fetchProfile, updateProfile, logout };
  },
  { persist: true }
);