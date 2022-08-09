var moment = require('moment')
import { baseApi } from 'src/http-common';
import axios from 'axios';

const accountingMixin = {

  computed: {

  },

  data() {
    return {
      isSetup: '',
      dialogSetup: false,
    }
  },
  methods: {
    accountSetup () {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/setup'),
        headers: headers
      }).then(response => {
        this.isSetup = response.data.account_setup
      }).catch(error => {
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

		finishSetup(){
			this.dialogSetup = false
			this.accountSetup()
		},

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    lowerFirstLetter(value){
      let lower= '';
      if(value){
        lower = value[0].toLowerCase() + value.slice(1);
      }
      return lower;
    },

    capitalEachWord(value){
      let result = ""

      if(value){
        var kata2 = ""
        kata2 = value.split(" ")
        for (let i = 0; i < kata2.length; i++) {
          kata2[i] = kata2[i][0].toUpperCase() + kata2[i].substr(1);
        }
        result = kata2.join(" ")
      }

      return result;
    },
    
    formatPrice(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatPriceDecimal(value){
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    indexNumber(no, count, current){
      let idx = no + 1
      var number = (count*current)+idx-count
      return number 
    },

    dateFormat(val){
      return moment(val).format('DD MMM YYYY');
    },

    checkDate(date) {
      let dateA = moment(date);
      let dateB = moment();

      if (dateA.diff(dateB) > 0) {
        return false;
      } else {
        return true;
      }
    },
  }
}

export default accountingMixin;
