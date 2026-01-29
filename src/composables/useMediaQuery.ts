import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reactive media query utility
 */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  
  const mediaQuery = window.matchMedia(query)
  
  const updateMatches = () => {
    matches.value = mediaQuery.matches
  }
  
  onMounted(() => {
    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)
  })
  
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', updateMatches)
  })
  
  return matches
}

/**
 * Common media query helpers
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)')
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  }
}