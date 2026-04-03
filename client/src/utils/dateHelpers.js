export const toInputDate = (date) => new Date(date).toISOString().split('T')[0]

export const monthLabel = (str) => {
  const [year, month] = str.split('-')
  return new Date(year, month - 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' })
}