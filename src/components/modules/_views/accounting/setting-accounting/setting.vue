<template>
  <el-row>
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <div class="submission-left-side" align="center">
        <img
          class="image-digipayment"
          src="/static/img/digital-payment-form.svg" style="width: 250px; margin: 30px;"> 
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <div class="p-20">
        <el-form
          :model="formDataSet"
          :rules="rules"
          label-position="top"
          ref="data">
          <el-form-item :label="lang.payment_due_date" prop="due_date">
            <el-input type="number" min="1" v-model="formDataSet.due_date" style="width: 100%">
              <template slot="append">{{lang.days}}</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="rootLang.is_first_stock_message" prop="isStock">
            <el-radio-group v-model="formDataSet.isStock" size="small" class="full-radio">
              <el-radio-button label="true">{{rootLang.yes}}</el-radio-button>
              <el-radio-button label="false">{{rootLang.no}}</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-button @click="handleNext" :disabled="!formDataSet.due_date" class="absolute-bottom visible-lg visible-md visible-sm" type="primary" style="width: 46%">
            {{ $lang[langId].next }}
          </el-button>
          <el-button @click="handleNext" :disabled="!formDataSet.due_date" class="visible-xs" type="primary" style="width: 80%">
            {{ $lang[langId].next }}
          </el-button>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { baseApi } from 'src/http-common.js';
import axios from 'axios';

export default {
  name: 'setupAccounting',
  mixins: [basicComputedMixin],
  
  computed: {
    
  },

  watch: {
    formDataSet: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', data)
      }
    },
  },

  mounted(){
    this.getDueDate()
  },

  data() {
    return{
      formDataSet: {
        due_date: '',
        isStock: 'false'
      },
      rules: {
        due_date: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
      }
    }
  },

  methods: {
    getDueDate(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'account/duedate'),
        headers: headers
      }).then(response => {
        this.formDataSet.due_date = response.data.data.due_date
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

    handleNext(){
      this.$emit('doneSetting')
    },
  }
}

</script>