import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useUIStore } from './ui'
import { useGoalsStore } from './goals'
import { useTransactionsStore } from './transactions'

export interface Notification {
  _id: string
  type: string
  title: string
  message: string
  goal?: { _id: string; title: string }
  read: boolean
  createdAt: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const uiStore = useUIStore()

  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)

  let eventSource: EventSource | null = null
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

  /* ---------------------------------- */
  /* Fetch Notifications */
  /* ---------------------------------- */

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications?limit=20')
      notifications.value = response.data
      unreadCount.value = notifications.value.filter(n => !n.read).length
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  /* ---------------------------------- */
  /* Mark As Read */
  /* ---------------------------------- */

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      const notif = notifications.value.find(n => n._id === id)
      if (notif) notif.read = true
      unreadCount.value = notifications.value.filter(n => !n.read).length
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      notifications.value.forEach(n => (n.read = true))
      unreadCount.value = 0
      uiStore.addToast({
        type: 'success',
        message: 'All notifications marked as read'
      })
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  /* ---------------------------------- */
  /* SSE Connection */
  /* ---------------------------------- */

  const connectSSE = () => {
    // Close existing connection
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token found, SSE not started')
      return
    }

    const baseUrl = import.meta.env.VITE_API_URL
    if (!baseUrl) {
      console.error('VITE_API_URL is not defined')
      return
    }

    console.log('Connecting to SSE...')

    eventSource = new EventSource(
      `${baseUrl}/notifications/stream?token=${token}`
    )

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      // Handle goal deletion
      if (data.type === 'goal_deleted' && data.goalId) {
        const goalsStore = useGoalsStore()
        goalsStore.removeGoalById(data.goalId)
        uiStore.addToast({
          type: 'info',
          message: data.message || 'A goal was removed.'
        })
        return // skip adding as notification
      }

      // Handle withdrawal status changes - refresh transactions
      if (data.type === 'withdrawal_processed') {
        const transactionsStore = useTransactionsStore()
        transactionsStore.fetchRecentTransactions()
      }

      // Toast
      uiStore.addToast({
        type: 'info',
        message: data.message
      })

      // Add to list
      const newNotif: Notification = {
        _id: Date.now().toString(),
        type: data.type,
        title:
          data.type === 'goal_completed'
            ? 'Goal Completed!'
            : 'Notification',
        message: data.message,
        read: false,
        createdAt: new Date().toISOString()
      }

      notifications.value = [newNotif, ...notifications.value]
      unreadCount.value++
    }

    eventSource.onerror = (err) => {
      console.error('SSE error', err)

      eventSource?.close()
      eventSource = null

      // Prevent stacking reconnect timers
      if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(() => {
          reconnectTimeout = null
          console.log('Reconnecting SSE...')
          connectSSE()
        }, 5000)
      }
    }
  }

  const disconnectSSE = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
  }

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    connectSSE,
    disconnectSSE
  }
})