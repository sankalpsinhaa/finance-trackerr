<template>
  <div class="app-shell">
    <header class="app-topbar">
  <div>
    <div class="section-title">SmartSpend</div>
    <div class="muted">Personal Finance Tracker</div>
  </div>
  <div>
    <button class="btn-ghost">Import</button>
    <button class="btn-primary">+ New Entry</button>
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
