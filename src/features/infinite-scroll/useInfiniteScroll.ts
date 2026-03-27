import { onMounted, onUnmounted, watch, type Ref } from 'vue'

export function useInfiniteScroll(
  sentinel: Ref<HTMLElement | null>,
  callback: () => void,
  loading: Ref<boolean>,
) {
  let isIntersecting = false
  let observer: IntersectionObserver | null = null

  // Когда загрузка завершилась и sentinel всё ещё во viewport — грузим следующую порцию
  watch(loading, (val) => {
    if (!val && isIntersecting) callback()
  })

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0].isIntersecting
        if (isIntersecting && !loading.value) callback()
      },
      { rootMargin: '200px' },
    )
    if (sentinel.value) observer.observe(sentinel.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
