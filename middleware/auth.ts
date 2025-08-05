export default defineNuxtRouteMiddleware(async to => {
  const userStore = useUserStore()
  if (to.path === '/profile' && !userStore.token) {
    return navigateTo('/login')
  }
})
