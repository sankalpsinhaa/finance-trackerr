<template>
 <div class="card">
    <h4 class="font-semibold mb-2">{{ title }}</h4>
    <canvas ref="cnv"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  props: { title: String, config: Object },
  setup(props){
    const cnv = ref(null)
    let chart = null
    onMounted(() => {
      if (cnv.value && props.config) chart = new Chart(cnv.value.getContext('2d'), props.config)
    })
    watch(()=>props.config, (c)=>{
      if (!cnv.value) return
      if (chart) chart.destroy()
      chart = new Chart(cnv.value.getContext('2d'), c)
    }, { deep:true })
    return { cnv }
  }
}
</script>
