<!-- src/components/ExpenseForm.vue -->
<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 max-w-2xl w-full">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Add Transaction</h4>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Quickly add income or expenses</p>
      </div>
      <div class="text-sm text-slate-500 dark:text-slate-400">
        Balance: <span class="font-medium text-slate-800 dark:text-slate-100">{{ balance | currency }}</span>
      </div>
    </div>

    <form @submit.prevent="onSubmit" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="description" placeholder="Description" class="input bg-slate-50 dark:bg-slate-700 rounded-md p-3 outline-none" />
      <select v-model="category" class="input bg-slate-50 dark:bg-slate-700 rounded-md p-3">
        <option disabled value="">Choose category</option>
        <option v-for="c in categories" :key="c">{{ c }}</option>
      </select>

      <input v-model.number="amount" type="number" step="0.01" placeholder="Amount (use negative for expense)" class="input bg-slate-50 dark:bg-slate-700 rounded-md p-3" />
      <input v-model="date" type="date" class="input bg-slate-50 dark:bg-slate-700 rounded-md p-3" />

      <textarea v-model="notes" placeholder="Notes (optional)" class="md:col-span-2 bg-slate-50 dark:bg-slate-700 rounded-md p-3 h-24 resize-none"></textarea>

      <div class="md:col-span-2 flex items-center justify-end gap-3 mt-2">
        <button type="button" @click="clear" class="px-4 py-2 rounded-md border text-slate-700 dark:text-slate-200">Reset</button>
        <button type="submit" class="px-5 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold shadow">Add</button>
      </div>
    </form>

    <div v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['add-expense'])

const props = defineProps({
  initialBalance: { type: Number, default: 0 }
})

const categories = ['Groceries','Transport','Bills','Entertainment','Income','Savings','Other']

const description = ref('')
const amount = ref(null)
const category = ref('')
const date = ref(new Date().toISOString().slice(0,10))
const notes = ref('')
const error = ref('')

const balance = computed(() => props.initialBalance)

function clear() {
  description.value = ''
  amount.value = null
  category.value = ''
  date.value = new Date().toISOString().slice(0,10)
  notes.value = ''
  error.value = ''
}

function onSubmit() {
  error.value = ''
  if (!description.value || amount.value === null || category.value === '') {
    error.value = 'Please fill description, amount and category.'
    return
  }
  const payload = {
    id: Date.now().toString(36),
    description: description.value.trim(),
    amount: Number(amount.value),
    category: category.value,
    date: date.value,
    notes: notes.value.trim()
  }
  emit('add-expense', payload)
  clear()
}
</script>

<script>
export default {
  filters: {
    currency(val) {
      return val == null ? '$0.00' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(val)
    }
  }
}
</script>

<style scoped>
.input { border: 1px solid rgba(15,23,42,0.06); }
.dark .input { border-color: rgba(148,163,184,0.12); }
</style>

