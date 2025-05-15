import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useUserStore = defineStore("user", () => {
  const accessToken = ref<string | null>(null);

  const firstName = ref("");
  const lastName = ref("");

  const isAdmin = ref(false);

  //const isAuthenticated = computed(() => accessToken.value !== null);
  const isAuthenticated = computed(() => true);
  const name = computed(() => `${firstName.value} ${lastName.value}`);
  const initials = computed(() => `${firstName.value.charAt(0)}${lastName.value.charAt(0)}`);

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  function setFirstName(value: string) {
    firstName.value = value;
  }

  function setLastName(value: string) {
    lastName.value = value;
  }

  function reset() {
    accessToken.value = null;
    firstName.value = "";
    lastName.value = "";
  }

  return {
    isAuthenticated,
    isAdmin,
    setAccessToken,
    setFirstName,
    setLastName,
    name,
    initials,
    reset
  }
});
