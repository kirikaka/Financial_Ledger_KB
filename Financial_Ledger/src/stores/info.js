import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useIdStore = defineStore('info', () => {
  let userIdPinia = ref('');
  function setUserId(userId) {
    console.log('🚀 ~ setUserId ~ userId:', userId);

    userIdPinia.value = userId;
    console.log('🚀 ~ setUserId ~ userIdPinia:', userIdPinia);
  }

  return { userIdPinia, setUserId };
});
