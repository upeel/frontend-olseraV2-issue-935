import store from '@/store'
// import router from '@/routes'

export default function syncLocalStorage() {
  window.addEventListener('storage', (e) => {
    console.log(`Key Changed: ${e.key}`)
    console.log(`New Value: ${e.newValue}`)
    if (!store.getters.webviewMode) {
      logOut(e)
    }
  })
}

function logOut(e) {
  if (e.key === 'olsbo_token' && !e.newValue) {
    store.dispatch('logout')
  } else if (e.key === 'olsbo_token' && e.newValue) {
    window.location.reload()
  }
}
