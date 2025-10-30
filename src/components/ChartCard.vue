<!-- src/components/ChartCard.vue -->
<template>
  <div class="bg-gradient-to-br from-white/60 to-slate-50/60 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg p-6 w-full max-w-xl">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your spending by category</p>
      </div>
      <div class="text-right">
        <div class="text-sm text-slate-500 dark:text-slate-400">Total</div>
        <div class="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">{{ formattedTotal }}</div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div class="flex justify-center">
        <canvas ref="canvas" class="max-h-[260px]"></canvas>
      </div>

      <div class="space-y-3">
        <template v-for="(label, idx) in labels" :key="label">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span :style="{backgroundColor: legendColor(idx)}" class="w-3 h-3 rounded-full inline-block"></span>
              <div>
                <div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ label }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ percent(idx) }} • {{ values[idx] | currency }}</div>
              </div>
            </div>
            <div class="text-sm text-slate-700 dark:text-slate-200">{{ values[idx] | currency }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  title: { type: String, default: 'Spending' },
  labels: { type: Array, default: () => ['Groceries', 'Transport', 'Bills', 'Entertainment', 'Other'] },
  values: { type: Array, default: () => [450, 120, 300, 90, 60] },
  colors: { type: Array, default: () => ['#10B981','#F59E0B','#3B82F6','#EF4444','#A78BFA'] },
  type: { type: String, default: 'doughnut' } // allow 'pie' or 'doughnut'
})

const canvas = ref(null)
let chart = null

const total = computed(() => props.values.reduce((s, v) => s + (Number(v) || 0), 0))
const formattedTotal = computed(() => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total.value))

function buildChart() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (chart) chart.destroy()
  chart = new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [{
        data: props.values,
        backgroundColor: props.colors,
        borderWidth: 0
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
      cutout: props.type === 'doughnut' ? '60%' : '0%'
    }
  })
}

watch(() => [props.labels, props.values, props.colors, props.type], buildChart, { deep: true })

onMounted(buildChart)
onBeforeUnmount(() => chart && chart.destroy())

const percent = idx => {
  const v = Number(props.values[idx] || 0)
  if (total.value === 0) return '0%'
  return `${Math.round((v / total.value) * 100)}%`
}
const legendColor = idx => props.colors[idx] ?? '#ddd'

/* Simple currency filter */
function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}
defineExpose({ chart })
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
/* keep canvas responsive */
canvas { width: 100% !important; height: 260px !important; }
</style>
