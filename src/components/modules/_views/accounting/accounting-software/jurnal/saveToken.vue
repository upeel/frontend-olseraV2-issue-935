<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
export default {
  name: 'JurnalSaveToken',
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
    jurnalType(){
      return this.$store.state
    }
  },

  data () {
    return{

    }
  },

  mounted(){
    this.sendJurnalToken()
  },

  methods: {
    sendJurnalToken(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let dataIntegration = {
        access_token: this.access_token,
        account_transaction: localStorage.getItem('olsbo_thirdPartyIntegration')
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/token'),
        headers: headers,
        data: dataIntegration
      }).then(response => {
				const dataParams = {
					value : localStorage.getItem('olsbo_thirdPartyIntegration'),
					thirdParty: 'jurnal',
					toStorage : false
				}
				this.$store.commit('SET_INTEGRATION_TYPE', dataParams)
        // this.$store.commit('REMOVE_INTEGRATION_TYPE', 'jurnal')
        this.$router.push({path: '/accounting-third/jurnalNew/sales?typeJurnal=' + localStorage.getItem('olsbo_thirdPartyIntegration')})
        
        this.$message({
          message: this.lang.jurnal_success,
          type: 'success'
        })
      }).catch(error => {
        this.$router.push({path: '/accounting-third/jurnalNew'})
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
