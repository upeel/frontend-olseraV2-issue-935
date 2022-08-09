<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="18">
        <el-card class="box-card">
          <div slot="header" class="table-handler-flex">
            <h4 style="flex-grow: 1;">{{ lang.add }} {{ lang.shift_timing }}</h4>
            <div>
              <router-link :to="{ path: '/pos-settings/shifttime' }">
                <el-button type="text">{{ lang.cancel }}</el-button>
              </router-link>
              <el-button type="success" :disabled="disabledSave" @click.once="save">
                {{ lang.save }}
              </el-button>
            </div>
          </div>

          <div class="card-body">
            <el-form
              label-width="120px">
              <el-form-item :label="lang.title " :required="true">
                <el-input :required="true"
                  v-model="data.nameShift" :placeholder="$lang[langId].please_input+lang.title">
                </el-input>
              </el-form-item>
              <el-form-item :label="lang.start_time">
                <el-time-picker
                  v-model="data.startDate"
                  :placeholder="$lang[langId].pick_date_and_time"
                  format="HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="Jam Berakhir">
                <el-time-picker
                  v-model="data.endDate"
                  :placeholder="$lang[langId].pick_date_and_time"
                  format="HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import moment from 'moment'
const apiEndPoint = 'shifttime/'

export default {
  name: 'PosShiftTime',
  data: function() {
    return {
      loading: false,
      disabledSave: true,
      data: {
        nameShift: '',
        startDate: '',
        endDate: ''
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
  watch: {
    data: {
      handler(data) {
        if (data.nameShift !== '') {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    }
  },
  methods: {
    getDefaultTime() {
      this.data.startDate = moment().format('YYYY-MM-DD HH:mm:ss')
      this.data.endDate = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    save() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {
        name: this.data.nameShift,
        start_time: this.data.startDate,
        end_time: this.data.endDate
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, 'en', apiEndPoint + 'store'),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.loading = false
          this.$router.push({
            path: '/pos-settings/shifttime'
          })
        })
        .catch(error => {
          this.$message({
            message: 'Error',
            type: 'error'
          })
          console.log(error)
          this.loading = false
        })
    }
  },
  mounted() {
    this.getDefaultTime()
  }
}
</script>

