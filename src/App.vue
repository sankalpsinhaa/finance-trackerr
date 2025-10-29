<template>
  <div>
    <header class="bg-white shadow p-4 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">SmartSpend <span class="text-sm text-slate-500 font-normal">Demo</span></h1>
        <div class="text-sm text-slate-600">Demo  Local-only  No keys</div>
      </div>
    </header>

    <main class="py-6">
      <DashboardView />
    </main>

    <footer class="text-center text-xs text-slate-500 py-6">
      SmartSpend Demo — UI & simulated AI for portfolio purposes.
    </footer>
  </div>
</template>

<script>
import DashboardView from './views/DashboardView.vue'
export default { components: { DashboardView } }
</script>
