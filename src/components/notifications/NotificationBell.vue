<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg hover:bg-gray-800/50 transition"
      aria-label="Notifications"
    >
      <span class="text-xl">🔔</span>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-red-500 rounded-full text-xs font-bold text-white flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <transition name="fade-slide">
      <div
        v-if="showDropdown"
        v-click-outside="closeDropdown"
        class="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
          <h3 class="font-semibold text-white">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-primary-400 hover:text-primary-300 transition"
          >
            Mark all as read
          </button>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-400">
            No notifications yet
          </div>
          <div
            v-for="notif in notifications"
            :key="notif._id"
            class="px-4 py-3 hover:bg-white/5 transition cursor-pointer border-b border-gray-700/50 last:border-0"
            :class="{ 'bg-primary-500/5': !notif.read }"
            @click="handleNotificationClick(notif)"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" :class="iconClass(notif.type)">
                <span>{{ iconForType(notif.type) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white">{{ notif.title }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ notif.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ formatTime(notif.createdAt) }}</p>
              </div>
              <span v-if="!notif.read" class="w-2 h-2 bg-primary-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import { useRouter } from 'vue-router'

const router = useRouter()
const notificationsStore = useNotificationsStore()
const { notifications, unreadCount } = storeToRefs(notificationsStore)

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    notificationsStore.fetchNotifications()
  }
}

const closeDropdown = () => {
  showDropdown.value = false
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const handleNotificationClick = (notif: any) => {
  if (!notif.read) {
    notificationsStore.markAsRead(notif._id)
  }
  if (notif.goal) {
    router.push(`/goals/${notif.goal._id}`)
  }
  closeDropdown()
}

const iconForType = (type: string) => {
  const icons: Record<string, string> = {
    goal_completed: '🎉',
    deposit_received: '💰',
    withdrawal_processed: '💸',
    auto_save: '⚡',
    reminder: '⏰'
  }
  return icons[type] || '🔔'
}

const iconClass = (type: string) => {
  const classes: Record<string, string> = {
    goal_completed: 'bg-success/20 text-success',
    deposit_received: 'bg-primary-500/20 text-primary-300',
    withdrawal_processed: 'bg-danger/20 text-danger',
    auto_save: 'bg-warning/20 text-warning',
    reminder: 'bg-gray-500/20 text-gray-300'
  }
  return classes[type] || 'bg-gray-500/20 text-gray-300'
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

onMounted(() => {
  notificationsStore.fetchNotifications()
  notificationsStore.connectSSE()
})

onUnmounted(() => {
  notificationsStore.disconnectSSE()
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>    