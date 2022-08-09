<template>
  <div class="content-wrapper-webview">
    <loading-with-logo v-if="loading" />
    <home
      v-if="!loading"
      :prop-store="selectedStore"
    />
  </div>
</template>

<script>
import Home from './Home'
import LoadingWithLogo from '@/components/LoadingWithLogo'
import { fetchStore } from '@/api/store'

export default {
  components: {
    Home,
    LoadingWithLogo
  },

  data() {
    return {
      loading: true,
      selectedStore: null
    }
  },

  mounted() {
    // staging
    // http://localhost:7070/whatsnew-mobile?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBhZTAyZWI0Y2ViNTA1ZGI4NjU4ZWU5YWExODE5MDNjNTI5MTRkNGI4ZGE5MzI1NTMxYTgyYjI5MTdiMzgyZjlmYzYyODE5NzQxOTE4ZDU4In0.eyJhdWQiOiIyIiwianRpIjoiMGFlMDJlYjRjZWI1MDVkYjg2NThlZTlhYTE4MTkwM2M1MjkxNGQ0YjhkYTkzMjU1MzFhODJiMjkxN2IzODJmOWZjNjI4MTk3NDE5MThkNTgiLCJpYXQiOjE2NDY2NDgyMDQsIm5iZiI6MTY0NjY0ODIwNCwiZXhwIjoxNjQ5MjQwMjAzLCJzdWIiOiI3MjM2Iiwic2NvcGVzIjpbXX0.aTXPMamnKItu0Y6Iy4LoNRebHdeF3bWdvrYiGn70KFYJDXTzBd5DBjy-Z5oxS83t6HxNPepH0wXiUrC0lG_dyeE3cSQyT3vruVlzWw2Kpke2F0u3GQ6U_eM0dO9jAbtb9rW503YEF3OeETVhXfAsFTD9ec8OJkTGzshD5U1d23XH3foBAF32fFcH42phAJEXRjmwJtGi6bupb0iIQF3Zof3FGOZqlbo862MtxDBYUEfhtJbUUERj5ZfGiqfq3dRNQMqr1k66jxt8CVVT3qd1c1OuJZs3nXW7EKb8IxTe8ryEXMD5alN8gix38Hg-HfjBJr6oPwU2cftAghiIZwwnFMTWgjeQB_pphjAjPCobZ0BJ6S6ll59ujLuBwVkCWLvQKb_DdB6kQ0b9ow_QQeKa1CKQgKi-6UbOT80TFdNIbyyWtPLQ8_GD9IR1wVHK9Ykmj8tTad1wYy4VxvLmIM-ZC-G25fFNNFDlB3b_BMlGqKyGVht3ozGTXeq4RvOqN1KI8aY97cWLL4NK_MvIM90l0XI7NtELRJu8vZG6-q6SCCfmbk-Ob6yUWLRShN5yIA_tWNa6kWL2gYxJr09YNhh0gGD_Elz5djkL-AcX3oXd6RcZYRf9lb7KwLG-2U7Ud7gn_Qsjhf2LtQw803hVFa4nLa9K6TXXd4DdBkJjQIObPzM&sid=11065
    if (this.$route.query.token) {
      fetchStore(this.$route.query.sid, this.$route.query.token).then(response => {
        this.selectedStore = response.data.data
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
        this.$router.push('/webview-unauthorized')
      })
    }
  }
}
</script>
