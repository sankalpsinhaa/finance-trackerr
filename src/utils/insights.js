import { addDays, parseISO } from "date-fns"

export function summarizeExpenses(expenses) {
  const last30 = filterLastNDays(expenses, 30)
  const byCategory = {}
  last30.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount)
  })
  const total = Object.values(byCategory).reduce((a,b)=>a+b,0)
  const top = Object.entries(byCategory).sort((a,b)=>b[1]-a[1])[0]?.[0] || null
  const avgDaily = total / 30
  const daily = daysSeries(last30)
  return { total: +total.toFixed(2), byCategory, top, avgDaily: +avgDaily.toFixed(2), daily }
}

function filterLastNDays(expenses, n) {
  const cutoff = addDays(new Date(), -n+1)
  return expenses.filter(e => parseISO(e.date) >= cutoff)
}

function daysSeries(last30) {
  const map = {}
  for (let i=0;i<30;i++){
    const d = addDays(new Date(), -i)
    const key = d.toISOString().slice(0,10)
    map[key] = 0
  }
  last30.forEach(e => { if (map[e.date] !== undefined) map[e.date] += Number(e.amount) })
  return Object.keys(map).reverse().map(k=>({date:k, amount:+map[k].toFixed(2)}))
}

export function predictNextMonth(dailySeries) {
  const n = dailySeries.length
  if (n === 0) return { next30: 0, method: 'no data' }
  const xs = dailySeries.map((_,i)=>i+1)
  const ys = dailySeries.map(d=>d.amount)
  const xMean = xs.reduce((a,b)=>a+b,0)/n
  const yMean = ys.reduce((a,b)=>a+b,0)/n
  let num=0, den=0
  for (let i=0;i<n;i++){ num += (xs[i]-xMean)*(ys[i]-yMean); den += (xs[i]-xMean)*(xs[i]-xMean) }
  const slope = den === 0 ? 0 : num/den
  const intercept = yMean - slope * xMean
  let nextSum = 0
  for (let k=1;k<=30;k++){
    const x = n + k
    nextSum += Math.max(0, slope * x + intercept)
  }
  return { next30: +nextSum.toFixed(2), slope: +slope.toFixed(4), intercept: +intercept.toFixed(2) }
}

export function generateTips(summary) {
  const tips = []
  const { byCategory, total, avgDaily, top } = summary
  if (total > 800) tips.push(`You spent $${summary.total} in the last 30 days — consider reviewing subscriptions or big-ticket categories.`)
  else tips.push(`Nice — $${summary.total} total in the last 30 days.`)
  if (top) {
    const spent = byCategory[top]
    if (spent > total * 0.25) tips.push(`You spent $${spent.toFixed(2)} on ${top}. Try reducing that category.`)
    else tips.push(`Your top category is ${top} at $${spent.toFixed(2)}.`)
  }
  if (avgDaily > 30) tips.push(`Average daily spend is $${avgDaily.toFixed(2)}. Aim for $${Math.max(10, (avgDaily-10)).toFixed(0)} daily to save more.`)
  else tips.push(`Your daily average is $${avgDaily.toFixed(2)} — keep it up!`)
  return tips.slice(0,3)
}
