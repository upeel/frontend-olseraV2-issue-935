import store from '@/store'

const MaskMoney = {}
function parseString(el, binding) {
  const s = parseFloat(binding.value)
  const currId = store.getters.selectedStore && store.getters.selectedStore.currency_id ? store.getters.selectedStore.currency_id : 'IDR'
  const precision = currId === 'IDR' ? 2 : 2
  const decimal = currId === 'IDR' ? ',' : '.'
  const thousands = currId === 'IDR' ? '.' : ','
  if (s) {
    const val = (s / 1).toFixed(precision).replace('.', decimal)
    el.innerHTML = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands)
  } else {
    el.innerHTML = 0
  }
}
MaskMoney.install = Vue => {
  Vue.directive('MaskMoney', {
    bind: (el, binding) => {
      parseString(el, binding)
    },

    update: (el, binding) => {
      parseString(el, binding)
    }
  })
}

export default MaskMoney
