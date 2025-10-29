<template>
  <div class="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
    <h3 class="font-semibold mb-3">Add Expense</h3>
    <form @submit.prevent="onSubmit" class="space-y-2">
      <div>
        <label class="block text-sm">Category</label>
        <select v-model="form.category" class="w-full p-2 border rounded">
          <option disabled value="">Select</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm">Amount</label>
        <input v-model.number="form.amount" type="number" step="0.01" class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm">Date</label>
        <input v-model="form.date" type="date" class="w-full p-2 border rounded" />
      </div>
      <div class="flex justify-end">
        <button class="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: { onAdded: Function },
  data() {
    return {
      categories: ['Groceries','Transport','Coffee','Bills','Entertainment','Other'],
      form: { category: '', amount: null, date: new Date().toISOString().slice(0,10) }
    }
  },
  methods: {
    onSubmit() {
      if (!this.form.category || !this.form.amount) { alert('Fill category and amount'); return }
      const item = {
        id: Date.now().toString(36),
        category: this.form.category,
        amount: Number(this.form.amount),
        date: this.form.date,
        notes: ''
      }
      this.onAdded(item)
      this.form = { category: '', amount: null, date: new Date().toISOString().slice(0,10) }
    }
  }
}
</script>
