import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/shared/api'

const TOKEN_KEY = 'access_token'

interface LoginResponse {
  access_token: string
  token_type: string
}

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!localStorage.getItem(TOKEN_KEY))

  async function login(username: string, password: string) {
    const { data } = await http.post<LoginResponse>('/v1/admin/auth/login', { username, password })
    localStorage.setItem(TOKEN_KEY, data.access_token)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    router.push('/admin/login')
  }

  return { isAuthenticated, login, logout }
}
