const KEY = "smartspend_demo_expenses_v1"

export function loadExpenses() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultSeed()
    return JSON.parse(raw)
  } catch (e) {
    return defaultSeed()
  }
}

export function saveExpenses(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

function defaultSeed() {
  const cats = ['Groceries','Transport','Coffee','Bills','Entertainment','Other']
  const arr = []
  const today = new Date()
  for (let i=0;i<30;i++){
    const d = new Date(today)
    d.setDate(today.getDate()-i)
    const date = d.toISOString().slice(0,10)
    const count = Math.random() < 0.6 ? 1 : Math.floor(Math.random()*3)+1
    for (let j=0;j<count;j++){
      arr.push({
        id: `${date}-${j}-${Math.random().toString(36).slice(2,7)}`,
        date,
        category: cats[Math.floor(Math.random()*cats.length)],
        amount: Number((Math.random()*50 + (Math.random()*20)).toFixed(2)),
        notes: ''
      })
    }
  }
  saveExpenses(arr)
  return arr
}
