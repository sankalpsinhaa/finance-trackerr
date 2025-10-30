<template>
 <div class="card">
    <div class="flex justify-between items-start">
      <h4 class="font-semibold">Smart Insights</h4>
      <button @click="regen" class="text-sm text-blue-600">Refresh</button>
    </div>

    <div v-if="loading" class="mt-3 text-sm text-gray-500">Thinking...</div>

    <div v-else class="mt-3 space-y-2">
      <ul class="list-disc pl-5">
        <li v-for="(t,i) in tips" :key="i">{{ t }}</li>
      </ul>
      <p class="mt-2"><strong>Prediction:</strong> {{ predictionText }}</p>
      <p class="text-sm text-gray-500 mt-1">Model: local-simulated-insight v1</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { summarizeExpenses, generateTips, predictNextMonth } from '../utils/insights'

export default {
  props: { expenses: Array },
  setup(props){
    const loading = ref(false)
    const tips = ref([])
    const predictionText = ref('—')
    function compute() {
      loading.value = true
      setTimeout(()=>{ // simulate thinking
        const summary = summarizeExpenses(props.expenses || [])
        tips.value = generateTips(summary)
        const pred = predictNextMonth(summary.daily || [])
        predictionText.value = `Estimated next 30 days spend: $${pred.next30} (trend slope ${pred.slope})`
        loading.value = false
      }, 600)
    }
    function regen(){ compute() }
    compute()
    return { loading, tips, predictionText, regen }
  }
}
</script>
