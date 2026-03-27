<template>
  <div class="login-wrap">
    <form class="login" @submit.prevent="handleSubmit">
      <h1 class="login__title">Вход в админку</h1>

      <div class="login__field">
        <label class="login__label" for="username">Логин</label>
        <input
          id="username"
          v-model="username"
          class="login__input"
          type="text"
          autocomplete="username"
          required
        />
      </div>

      <div class="login__field">
        <label class="login__label" for="password">Пароль</label>
        <input
          id="password"
          v-model="password"
          class="login__input"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="error" class="login__error">{{ error }}</p>

      <AppButton type="submit" variant="primary" :disabled="loading" class="login__btn">
        {{ loading ? 'Вход...' : 'Войти' }}
      </AppButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppButton } from '@/shared/ui'
import { useAuth } from '@/features/auth'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await login(username.value, password.value)
    router.push('/admin/products')
  } catch {
    error.value = 'Неверный логин или пароль'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}
.login {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.login__title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #111827;
  text-align: center;
}
.login__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.login__label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}
.login__input {
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  -webkit-text-fill-color: #111827;
}
.login__input::placeholder {
  color: #9ca3af;
  -webkit-text-fill-color: #9ca3af;
}
.login__input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.login__input:-webkit-autofill,
.login__input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset, 0 0 0 3px rgba(59, 130, 246, 0.15);
  -webkit-text-fill-color: #111827;
}
.login__error {
  color: #ef4444;
  font-size: 13px;
  margin: 0;
  text-align: center;
}
.login__btn {
  width: 100%;
}
</style>
