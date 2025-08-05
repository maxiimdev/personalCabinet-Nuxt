export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();
  if (userStore.token && !userStore.user) {
    try {
      await userStore.fetchProfile();
    } catch (error) {
      userStore.logout();
    }
  }
});