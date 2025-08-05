<template>
  <main class="flex items-center justify-center">
    <Loader v-if="isLoading" />

    <UCard v-else class="w-full max-w-md p-6 shadow-lg">
      <h1
        class="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6"
      >
        Вход
      </h1>
      <form
        class="space-y-4 flex flex-col items-center"
        @submit.prevent="login"
      >
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="email"
            type="email"
            required
            placeholder="Введите ваш email"
          />
        </UFormGroup>
        <UFormGroup label="Пароль" name="password">
          <UInput
            v-model="password"
            type="password"
            required
            placeholder="Введите ваш пароль"
          />
        </UFormGroup>
        <UButton type="submit" color="primary" size="md" class="w-full">
          Войти
        </UButton>
        <p v-if="error" class="text-red-500 text-center text-sm">{{ error }}</p>
        <p class="text-center text-gray-600 dark:text-gray-400 text-sm">
          Нет аккаунта?
          <NuxtLink to="/register" class="text-primary hover:underline"
            >Зарегистрироваться</NuxtLink
          >
        </p>
      </form>
    </UCard>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function login() {
  isLoading.value = true
  try {
    await userStore.login(email.value, password.value)
    navigateTo('/profile')
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
main {
  @apply transition-colors duration-300;
}
</style>
