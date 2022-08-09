<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
export default {
  name: 'AccurateSaveToken',
  props: {
    access_token: {
        type: String,
        default: null
    }
  },
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    accurateType(){
      return this.$store.state
    }
  },

  data () {
    return{

    }
  },

  mounted(){
    this.sendAccurateToken()
  },

  methods: {
    sendAccurateToken(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = {
        code: this.$route.query.code
      }

      let url = window.location.origin + "/accounting-third/accurate/saveToken"
      let asTrx = localStorage.getItem('olsbo_thirdPartyIntegration')

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/code?post_as_transaction='+ asTrx +'&redirect_uri=' + url),
        headers: headers,
        data: paramsData
      }).then(response => {
        this.$store.commit('REMOVE_INTEGRATION_TYPE', 'accurate')
        this.$router.push({path: '/accounting-third/accounting-software'})
        
        this.$message({
          message: this.lang.jurnal_success,
          type: 'success'
        })
      }).catch(error => {
        this.$router.push({path: '/accounting-third/accounting-software'})
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

   
  }
}
</script>
