<!-- src/components/AIInsights.vue -->
<template>
  <div class="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow p-6 w-full max-w-md">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Smart Insights</h4>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Automatic suggestions to improve savings</p>
      </div>
      <div>
        <button @click="refresh" class="text-xs px-3 py-1 rounded-md border">Refresh</button>
      </div>
    </div>

    <div class="mt-4 space-y-4">
      <div v-if="!transactions || transactions.length===0" class="text-sm text-slate-500">No transactions yet — add some to get personalized insights.</div>

      <div v-else>
        <div class="text-sm text-slate-600 dark:text-slate-300">Top categories</div>
        <ul class="mt-2 space-y-2">
          <li v-for="(c, idx) in topCategories" :key="c.name" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full" :style="{backgroundColor: colors[idx%colors.length]}"></span>
              <div>
                <div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ c.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ c.amount | currency }}</div>
              </div>
            </div>
            <div class="text-sm text-slate-700 dark:text-slate-200">{{ c.percent }}%</div>
          </li>
        </ul>
      </div>

      <div v-if="suggested && suggested.length" class="mt-4">
        <div class="text-sm text-slate-600 dark:text-slate-300">Suggestions</div>
        <ul class="mt-2 space-y-2">
          <li v-for="s in suggested" :key="s" class="bg-slate-50 dark:bg-slate-700 p-3 rounded-md text-sm">
            {{ s }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  transactions: { type: Array, default: () => [] }
})

// very light analytics (client-side)
const colors = ['#10B981','#F59E0B','#3B82F6','#EF4444','#A78BFA','#06B6D4']

const totalsByCategory = computed(() => {
  const map = {}
  for (const t of props.transactions) {
    const name = t.category || 'Other'
    map[name] = (map[name] || 0) + (Number(t.amount) || 0)
  }
  return Object.entries(map).map(([name, amount]) => ({ name, amount: Math.abs(amount) }))
})

const sum = computed(() => totalsByCategory.value.reduce((s, v) => s + v.amount, 0))

const topCategories = computed(() => {
  const arr = totalsByCategory.value.sort((a,b) => b.amount - a.amount).slice(0,5)
  return arr.map(item => ({ ...item, percent: Math.round((item.amount / (sum.value || 1)) * 100) }))
})

const suggested = computed(() => {
  if (!props.transactions.length) return []
  const suggestions = []
  // tip: high spend category
  if (topCategories.value.length) {
    const top = topCategories.value[0]
    if (top.percent > 35) suggestions.push(`You're spending ${top.percent}% in ${top.name}. Consider a budget cap or cheaper alternatives.`)
  }
  // tip: look for recurring large payments
  const recurring = detectRecurring(props.transactions)
  if (recurring.length) suggestions.push(`Recurring payments detected: ${recurring.join(', ')} — review subscriptions.`)
  // general saving tip
  suggestions.push('Try setting a monthly target and move leftover to a separate savings category.')
  return suggestions
})

function detectRecurring(tx) {
  // very simple: same description/amount more than twice
  const map = {}
  for (const t of tx) {
    const key = `${t.description}-${Math.round(Number(t.amount)||0)}`
    map[key] = (map[key] || 0) + 1
  }
  return Object.entries(map).filter(([,c]) => c >= 2).map(([k]) => k.split('-')[0]).slice(0,3)
}

function refresh() {
  // small flourish — re-computes computed props (no-op but gives user feedback)
  // (in future we might call a server or AI here)
  // we could show a tiny toast — but keep it simple
}

</script>

<script>
export default {
  filters: {
    currency(val) {
      return val == null ? '$0' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(val)
    }
  }
}
</script>

<style scoped>
/* nothing required — layout uses Tailwind */
</style>
