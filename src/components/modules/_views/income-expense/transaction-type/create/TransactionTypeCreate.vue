<template>
  <div class="content-wrapper">
    <section class="content income-expense">
      <el-card class="box-card">
        <div slot="header" class="table-handler-flex">
          <h4 class="box-title" style="flex-grow: 1;">{{ lang.add_transaction_type }}</h4>
          <div>
            <router-link to="/transactiontype">
              <el-button>{{ lang.cancel }}</el-button>
            </router-link>

            <el-button
              v-if="!formAdd.nameType || !formAdd.transactionType"
              type="success"
              disabled>
              {{ lang.save }}
            </el-button>

            <el-button v-else @click.once="save" type="success">
              {{ lang.save }}
            </el-button>
          </div>
        </div>

        <div class="card-body">
          <el-form>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item>
                  <p>{{ lang.transaction_type_name }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <el-form-item>
                  <el-input class="type-create" v-model="formAdd.nameType"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item>
                  <p>{{ lang.transaction_type }}</p>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <el-form-item>
                  <el-radio-group v-model="formAdd.transactionType">
                    <el-radio-button label="I">
                      {{ lang.income }}
                    </el-radio-button>
                    <el-radio-button label="E">
                      {{ lang.expense }}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  name: 'TransactionTypeCreate',
  data: function() {
    return {
      loading: false,
      createSupplier: false,
      formAdd: {
        nameType: '',
        transactionType: 'I'
      }
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
  methods: {
    save() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        name: this.formAdd.nameType,
        type: this.formAdd.transactionType
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'inextranstype'),
        headers: headers,
        data
      })
        .then(response => {
          this.$message({
            message: 'Success',
            type: 'success'
          })
          this.loading = false
          this.$router.push({
            path: '/transactiontype'
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
    }
  }
  // mounted() {
  //   this.getCurrency()
  // }
}
</script>

