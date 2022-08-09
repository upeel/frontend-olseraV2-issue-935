<template>
  <div class="content-wrapper">
    <section class="content income-expense">
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.add }} {{ lang.income }}</h4>
          <div>
            <router-link to="/transaction">
              <el-button>{{ lang.cancel }}</el-button>
            </router-link>
            <el-button type="success" disabled v-if="!formAdd.typeTransaction">
              {{ lang.save }}
            </el-button>
            <el-button @click.once="save" type="success" v-else>
              {{ lang.save }}
            </el-button>
          </div>
        </div>

        <div class="card-body">
          <el-form label-position="left" label-width="120px">
            <el-form-item :label="lang.transaction_date">
              <el-date-picker v-model="formAdd.dateIncome" type="datetime" :placeholder="this.$lang[langId].pick_a_day" format="dd MMMM yyyy | HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>

            <el-form-item :label="lang.transaction_type">
              <!-- <el-select v-if="!addNewSelect" class="inline-form" v-model="formAdd.typeTransaction" :placeholder="lang.search" @change="handleSelected" clearable>
                <el-option :value=0 style="background: #6EBE46; color: #FFFFFF;">
                  <span style="font-size: 13px; margin-right: 10px; float: left">
                    <el-button type="text" icon="el-icon-plus" size="mini" style="color: #FFFFFF;"></el-button>
                  </span>
                  <span>{{ lang.add }}</span>
                </el-option>
                <el-option v-for="item in transactionType" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select> -->
              <el-autocomplete
                style="width: 100%;"
                v-model="formAdd.typeTransaction"
                :fetch-suggestions="getTypeTransaction"
                :placeholder="lang.search"
                @select="handleSelected">
              </el-autocomplete>
              <!-- <el-input v-else v-model="formAdd.typeTransaction"></el-input> -->
            </el-form-item>

            <el-form-item :label="lang.staff">
              <el-select 
                id="select_staff"
                :loading="loadingMore" 
                class="inline-form" 
                v-model="formAdd.staff" 
                filterable 
                :placeholder="lang.please_select" 
                @change="handleMoreStaff(formAdd.staff)">
                <el-option v-for="item in userStaff" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-option v-if="moreStaff.link" :value="9999" style="background: #767676; color: #F5F5F5;">
                  <span style="font-size: 13px; margin-right: 10px; float: left">
                    <el-button 
                      type="text" 
                      icon="el-icon-more" 
                      size="mini" 
                      style="color: #F5F5F5;">
                    </el-button>
                  </span>
                  <span>{{ $lang[langId].load_more }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="lang.transaction_amount">
              <!-- <money v-model="formAdd.total" class="el-input__inner" @change.native="handleCurrency(formAdd.total)"></money> -->
              <input-money v-model="formAdd.total" @currency="handleCurrency(formAdd.total)" />
            </el-form-item>

            <el-form-item :label="lang.notes">
              <el-input id="input_notes" type="textarea" v-model="formAdd.notes"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'TransactionCreateIncome',
  components: {
    InputMoney
  },
  data() {
    return {
      loading: true,
      transactionType: [],
      userStaff: [],
      addNewSelect: false,
      formAdd: {
        dateIncome: '',
        typeTransaction: null,
        staff: null,
        total: 0,
        notes: '',
        trans_type_id: null
      },
      moreStaff: {
        link: '',
        current_page: 1
      },
      loadingMore: false
    }
  },
  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },
  watch: {
    '$store.getters.selectedStore': function() {
      this.getTypeTransaction()
      this.getUserStaff()
    }
  },
  methods: {
    getDefaultTime() {
      this.formAdd.dateIncome = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    getTypeTransaction(queryString, callback) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'type',
        search_text: 'I',
        search: queryString,
        per_page: 100
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextranstype'),
        headers: headers,
        params: params
      })
        .then(response => {
          // this.transactionType = response.data.data
          this.loading = false
          for (let i of response.data.data) {
            i.value = i.name
            i.id = i.id
          }
          this.transactionType = response.data.data
          callback(this.transactionType)
        })
        .catch(error => {
          console.log(error.response)
          if (error.response.status === 404) {
            let call = [{
              value: queryString,
              id: 0
            }]
            callback(call)
          }
          this.loading = false
        })
    },
    handleSelected(val) {
      if (val.id === 0) {
        this.addNewSelect = true
        // this.formAdd.typeTransaction = ''
      } else {
        this.formAdd.trans_type_id = val.id
      }
    },
    getUserStaff() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storeusers'),
        headers: headers,
        params: {
          per_page: 50
        }
      })
        .then(response => {
          this.userStaff = response.data.data
          for (let index = 0; index < this.userStaff.length; index++) {
            this.formAdd.staff = this.userStaff[0].id
          }

          this.moreStaff = {
            link: response.data.links.next,
            current_page: response.data.meta.current_page
          }
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    },
    save() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        type: 'I',
        trans_date: this.formAdd.dateIncome,
        user_id: this.formAdd.staff,
        amount: this.formAdd.total,
        notes: this.formAdd.notes
      }
      if (this.addNewSelect) {
        this.$set(data, 'trans_type_name', this.formAdd.typeTransaction)
      } else {
        this.$set(data, 'trans_type_id', this.formAdd.trans_type_id)
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextrans'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.$router.push({
            path: '/transaction'
          })
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    handleCurrency(value) {
      if (value < 0) {
        this.formAdd.total = 0
      }
    },

    handleMoreStaff (data) {
      // console.log('trac', data)
      if (data === 9999) {
        this.getMoreStaff()
      }
    },

    getMoreStaff() {
      this.loadingMore = true
      this.formAdd.staff = this.userStaff[this.userStaff.length - 1].id

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      const params = {
        page: parseInt(this.moreStaff.current_page) + 1,
        per_page: 50
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'storeusers'),
        headers: headers,
        params: params
      }).then(response => {
          this.userStaff = this.userStaff.concat(response.data.data)

          this.moreStaff = {
            link: response.data.links.next,
            current_page: response.data.meta.current_page
          }
          document.getElementById('input_notes').focus()
          document.getElementById('select_staff').focus()
          this.loadingMore = false
        })
        .catch(error => {
          console.log(error)
          this.loadingMore = false
        })
    },
  },
  mounted() {
    this.getTypeTransaction()
    this.getUserStaff()
    this.getDefaultTime()
  }
}
</script>


