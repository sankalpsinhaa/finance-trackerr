<template>
  <div class="max-w-6xl mx-auto p-4 space-y-6">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <ExpenseForm :onAdded="addExpense" />
      </div>
      <div class="w-full md:w-2/3 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard v-if="pieConfig" :title="'Category Breakdown (30d)'" :config="pieConfig" />
          <ChartCard v-if="lineConfig" :title="'Daily Spend (30d)'" :config="lineConfig" />
        </div>
        <AIInsights :expenses="expenses" />
        <div class="flex gap-2">
          <button @click="exportCsv" class="px-4 py-2 bg-green-600 text-white rounded">Export CSV</button>
          <button @click="resetData" class="px-4 py-2 bg-red-600 text-white rounded">Reset Sample Data</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import ExpenseForm from '../components/ExpenseForm.vue'
import ChartCard from '../components/ChartCard.vue'
import AIInsights from '../components/AIInsights.vue'
import { loadExpenses, saveExpenses } from '../utils/storage'
import { summarizeExpenses } from '../utils/insights'

export default {
  components: { ExpenseForm, ChartCard, AIInsights },
  setup(){
    const expenses = ref([])
    const pieConfig = ref(null)
    const lineConfig = ref(null)

    function buildCharts(list){
      const summary = summarizeExpenses(list)
      pieConfig.value = {
        type: 'pie',
        data: {
          labels: Object.keys(summary.byCategory),
          datasets: [{ data: Object.values(summary.byCategory) }]
        },
        options: { responsive: true }
      }
      const labels = (summary.daily||[]).map(d=>d.date)
      const data = (summary.daily||[]).map(d=>d.amount)
      lineConfig.value = {
        type: 'line',
        data: { labels, datasets: [{ label: 'Daily', data, tension:0.2 }] },
        options: { responsive: true }
      }
    }

    function refresh(){
      const list = loadExpenses()
      expenses.value = list.sort((a,b)=>a.date.localeCompare(b.date))
      buildCharts(expenses.value)
    }

    function addExpense(item){
      expenses.value.push(item)
      saveExpenses(expenses.value)
      refresh()
    }

    function exportCsv(){
      const rows = [['date','category','amount','notes'], ...expenses.value.map(e=>[e.date,e.category,e.amount,e.notes || ''])]
      const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click(); URL.revokeObjectURL(url)
    }

    function resetData(){
      localStorage.removeItem('smartspend_demo_expenses_v1')
      window.location.reload()
    }

    onMounted(()=> refresh())

    return { expenses, pieConfig, lineConfig, addExpense, exportCsv, resetData }
  }
}
</script>
