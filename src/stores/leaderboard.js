import { defineStore } from 'pinia'
import { ref } from 'vue'
import { leaderboardService } from '@/services/leaderboard.service'

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const dailyLeaderboard = ref([])
  const weeklyLeaderboard = ref([])
  const monthlyLeaderboard = ref([])
  const allTimeLeaderboard = ref([])
  const userRank = ref(null)
  const isLoading = ref(false)

  async function loadDaily(params) {
    isLoading.value = true
    try {
      const response = await leaderboardService.getDaily(params)
      if (response.leaderboard) {
        dailyLeaderboard.value = response.leaderboard
      }
    } finally {
      isLoading.value = false
    }
  }

  async function loadWeekly(params) {
    isLoading.value = true
    try {
      const response = await leaderboardService.getWeekly(params)
      if (response.leaderboard) {
        weeklyLeaderboard.value = response.leaderboard
      }
    } finally {
      isLoading.value = false
    }
  }

  async function loadMonthly(params) {
    isLoading.value = true
    try {
      const response = await leaderboardService.getMonthly(params)
      if (response.leaderboard) {
        monthlyLeaderboard.value = response.leaderboard
      }
    } finally {
      isLoading.value = false
    }
  }

  async function loadAllTime(params) {
    isLoading.value = true
    try {
      const response = await leaderboardService.getAllTime(params)
      if (response.leaderboard) {
        allTimeLeaderboard.value = response.leaderboard
      }
    } finally {
      isLoading.value = false
    }
  }

  async function loadUserRank(userId, period) {
    const response = await leaderboardService.getUserRank(userId, period)
    if (response.success) {
      userRank.value = response.data
    }
  }

  return {
    dailyLeaderboard,
    weeklyLeaderboard,
    monthlyLeaderboard,
    allTimeLeaderboard,
    userRank,
    isLoading,
    loadDaily,
    loadWeekly,
    loadMonthly,
    loadAllTime,
    loadUserRank
  }
})
