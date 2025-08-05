<template>
  <main class="flex items-center justify-center">
    <UCard class="w-full max-w-md p-6 shadow-lg">
      <h1
        class="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2"
      >
        Добро пожаловать
      </h1>
      <div v-if="userStore.user" class="text-center">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Привет, {{ userStore.user.name }}!
        </p>
        <UButton color="primary" size="md" class="w-full">
          <NuxtLink to="/profile">Перейти в профиль</NuxtLink>
        </UButton>
      </div>
      <div v-else class="space-y-4">
        <p class="text-center text-gray-600 dark:text-gray-400">
          Пожалуйста, войдите или зарегистрируйтесь
        </p>
        <div class="flex flex-col space-y-3">
          <UButton color="primary" size="md" variant="outline" class="w-full">
            <NuxtLink to="/login">Войти</NuxtLink>
          </UButton>
          <UButton color="primary" size="md" class="w-full">
            <NuxtLink to="/register">Зарегистрироваться</NuxtLink>
          </UButton>
        </div>
      </div>
    </UCard>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

onMounted(async () => {
  if (userStore.token && !userStore.user) {
    try {
      await userStore.fetchProfile()
    } catch (error) {
      userStore.logout()
      navigateTo('/login')
    }
  }
})
</script>

<style scoped>
main {
  @apply transition-colors duration-300;
}
</style>
