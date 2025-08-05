<template>
  <main class="flex items-center justify-center">
    <Loader v-if="isLoading" />

    <UCard v-else class="w-full max-w-md p-6 shadow-lg">
      <h1
        class="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6"
      >
        Профиль
      </h1>
      <h2 v-if="isStatus">Обновлено: {{ status }}</h2>
      <div v-if="userStore.user">
        <form class="space-y-4" @submit.prevent="updateProfile">
          <div>
            <UFormGroup label="Имя" name="name">
              <UInput
                v-model="name"
                type="text"
                required
                placeholder="Введите ваше имя"
              />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Email" name="email">
              <UInput
                v-model="email"
                type="email"
                required
                placeholder="Введите ваш email"
              />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Новый пароль (необязательно)" name="password">
              <UInput
                v-model="password"
                type="password"
                placeholder="Введите новый пароль"
              />
            </UFormGroup>
          </div>
          <UButton type="submit" color="primary" size="md" class="w-full">
            Обновить профиль
          </UButton>
          <p v-if="error" class="text-red-500 text-center text-sm">
            {{ error }}
          </p>
        </form>
        <UButton color="neutral" size="md" class="w-full mt-4">
          <RouterLink to="/">На главную</RouterLink>
        </UButton>
        <UButton
          color="secondary"
          size="md"
          class="w-full mt-4"
          @click="logout"
        >
          Выйти
        </UButton>
      </div>
      <div v-else class="text-center text-gray-600 dark:text-gray-400">
        <p>Вы не вошли в систему</p>
        <UButton color="neutral" size="md" class="mt-4">
          <RouterLink to="/">На главную</RouterLink></UButton
        >
      </div>
    </UCard>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const status = ref('')
const isStatus = ref(false)
const isLoading = ref(true)

onMounted(() => {
  if (userStore.user) {
    name.value = userStore.user.name
    email.value = userStore.user.email
  } else if (userStore.token) {
    userStore.fetchProfile().catch(() => {
      userStore.logout()
      navigateTo('/login')
    })
  } else {
    navigateTo('/login')
  }
  isLoading.value = false
})

const logout = () => {
  userStore.logout()
  isStatus.value = false
}

const updateProfile = async () => {
  isLoading.value = true
  isStatus.value = true
  try {
    await userStore.updateProfile(
      name.value,
      email.value,
      password.value || undefined
    )
    error.value = ''
    status.value = 'Удачно!'
  } catch (err) {
    status.value = 'Неудачно :('

    error.value =
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message: string }).message
        : String(err)
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
