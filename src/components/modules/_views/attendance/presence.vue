<template>
  <div class="shippings">
    <div class="table-handler-flex flex-container--content-space-between flex-container--wrap mb-16">
      <el-button
        v-if="itemSelected.count > 0"
        class="mb-4"
        type="danger"
        @click="dialogDelete = true">
        <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
        {{ $lang[langId].delete }} {{ itemSelected.count }} {{ $lang[langId].selected }}
      </el-button>

      <el-dropdown @command="downloadPdf">
        <el-button class="mb-4">
          Export<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in labelRow" :key="item.id" :command ="item">{{ item.value.toUpperCase() }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="mb-4">
          <!-- <single-date-picker v-model="date" :clearable="true" @input="datePicked" /> -->
          <date-range-picker
            :attendance="true"
            @picked="datePicked"
          />
      </div>

      <el-button type="info" class="mb-4" @click="dialogEdit = true">{{ $lang[langId].add }}</el-button>
    </div>

    <el-card
      v-if="dataPresence.length === 0 && !loading"
      class="card_close_date box-card">
      <div class="no-data-wrapper">
        <img src="/static/img/no-presence.png" class="no-data-image">
        <div class="no_close" >Belum ada yang absen nih</div>
        <span>Absensi pegawai akan didaftar di sini</span>
      </div>
    </el-card>

    <el-card
      v-loading="loading"
      v-if="dataPresence.length || loading"
      class="box-card box-card--p-null">
      <el-table
        :data="dataPresence"
        :show-header="true"
        stripe
        class="product-table-max-height mobile-fix-height-unset"
        @selection-change="handleSelectionChange"
        @sort-change="sortPresence">
        <el-table-column type="selection" width="55" class-name="text-center"></el-table-column>
        <el-table-column :label="lang.date" sortable min-width="100" width="120" prop="fdate"></el-table-column>
        <el-table-column :label="$lang[langId].employee" sortable min-width="120" prop="employee_name"></el-table-column>
        <el-table-column :label="$lang[langId].shift" min-width="200" sortable prop="fshift_datetime"></el-table-column>
        <el-table-column :label="$lang[langId].time_coming" sortable min-width="100" prop="time_coming"></el-table-column>
        <el-table-column :label="$lang[langId].time_going" sortable min-width="100" prop="time_going"></el-table-column>
        <el-table-column :label="$lang[langId].duration" min-width="100" prop="fduration">
          <template slot-scope="scope">
            <div v-if="scope.row.duration !== 0">
              {{ scope.row.fduration }}
            </div>
            <div v-else>
              <el-tooltip
                content="Pegawai ini tidak absen pulang. Sistem otomatis mengosongkan Jam Pulang dan Durasi Kerja"
                effect="light"
                placement="bottom"
                popper-class="tooltip-presence">
                <el-button type="text">
                  <span class="color-black font-normal">{{ scope.row.fduration }}</span> <i class="el-icon-info color-warning"/>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].time_earlier" prop="ftime_earlier">
          <template slot-scope="scope">
            <span style="color: #6EBE46">{{ scope.row.ftime_earlier }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].time_late" min-width="120" prop="ftime_late">
          <template slot-scope="scope">
            <span style="color: #FF931E">{{ scope.row.ftime_late }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].left_early" min-width="100" prop="fcome_home_early"></el-table-column>
        <el-table-column :label="$lang[langId].overtime" min-width="120" prop="fovertime"></el-table-column>
        <el-table-column property="working_hours" align="right" >
          <template slot-scope="scope">
            <el-dropdown trigger="click">
                <el-button type="text" icon="el-icon-more" style="color:#909399"></el-button>
                <el-dropdown-menu slot="dropdown" style="background-color: #F2F2F2;">
                  <el-dropdown-item style="padding: 10px 10px !important">
                    <el-button type="text" class="btn-block text-left" style="color: #000000" @click="handleEdit(scope.row)">
                      {{ lang.edit }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item style="padding: 10px 10px !important">
                    <el-button type="text" class="btn-block text-left" style="color: #FF0000" @click="handleDelete(scope.row)">
                      {{ $lang[langId].delete }}
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align: center;">
        <el-pagination
          :current-page.sync="pagination.current_page"
          :page-size="pagination.per_page"
          :total="pagination.total"
          layout="prev, pager, next, jumper"
          @current-change="changeCurrentPage">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      :visible.sync="dialogEdit"
      :show-close="false"
      custom-class="dialog-card">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          {{ computedDialogTitle }}
        </h4>
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="handleCancelAdd">{{ lang.cancel }}</el-button>
          <el-button :loading="loadingSave" type="success" @click="handleSave" >{{ lang.save }}</el-button>
        </div>
      </div>
      <el-form
        v-loading="loading"
        :model="tempPresence"
        :rules="rules">
        <div class="calender-input">
          <div class="font-12 text-left">{{ lang.date }}</div>
          <el-date-picker
            v-model="tempPresence.date"
            placeholder="Select a date"
            :clearable="true"
            type="date"
            format="d MMM yyyy"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            popper-class="custom-popper-datepicker"
          />
        </div>

        <div class="font-12 text-left mt-16">{{ $lang[langId].employee }}</div>
        <el-form-item prop="searchQuery" style="margin-bottom: 16px">
          <el-autocomplete
            v-model="tempPresence.searchQuery"
            :fetch-suggestions="getEmployeeSearch"
            :placeholder="$lang[langId].select_employee + ' (Autocomplete)'"
            :disabled="tempPresence.id ? true : false"
            @select="setEmployee"
            style="width: 100%"
          />
        </el-form-item>

        <div class="font-12 text-left mt-16">{{ $lang[langId].shift }}</div>
        <el-select
          v-model="tempPresence.shift_id"
          :placeholder="lang.please_select"
          :filterable="true"
          clearable
          style="width: 100% !important"
          class="inline-form" 
          @change="setTimeAttend">
          <el-option
            v-for="item in dataShift"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <div class="working_hours_input">
          <div class="flex-container">
            <div class="full-width pr-5">
              <div class="font-12 text-left">{{ $lang[langId].time_coming }}</div>
              <el-time-select
                v-model="tempPresence.time_coming"
                :placeholder="lang.start_time"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:45'
                }"
                style="width: 100%">
              </el-time-select>
            </div>

            <div class="full-width pl-5">
              <div>{{ $lang[langId].time_going }}</div>
              <el-time-select
                v-model="tempPresence.time_going"
                :placeholder="lang.end_time"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:45'
                }"
                style="width: 100%;">
              </el-time-select>
            </div>
          </div>
        </div>
        <div class="font-12 text-left mt-16">{{ lang.notes }}</div>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="Note"
          v-model="tempPresence.note">
        </el-input>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogDelete"
      :show-close="false"
      custom-class="dialog-card"
      width="536px">
      <div class="text-center">
        <span>{{ $lang[langId].are_you_sure }}</span>
        <el-button v-if="itemSelected.count === 0" class="full-width btn-danger mt-24" @click="deleteRow">{{ $lang[langId].delete }}</el-button>
        <el-button v-else class="full-width btn-danger mt-24" @click="handleBulkdelete">{{ $lang[langId].delete }}</el-button>
        <el-button class="full-width btn-info mt-8" @click="dialogDelete = false, tempDelete = {}">{{ lang.cancel }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
// import SingleDatePicker from '@/components/SingleDatePicker'
import dateRangePicker from '@/components/modules/DateRangePicker'

var moment = require('moment')
const endDate = moment().format('YYYY-MM-DD')

export default {
  name: 'Presence',
  components: {
    // SingleDatePicker,
    dateRangePicker
  },

  data() {
    return {
      dialogEdit: false,
      loading: false,
      dataPresence: [],
      tempPresence: {
        name: '',
        time_coming: '',
        time_going: ''
      },
      params: {
        sort_column: ['date','employee_name'],
        sort_type: ['desc','asc'],
        searchQuery: '',
        page: 1,
        search_column: ['date', 'date'],
        search_text: [endDate, endDate],
        search_operator: ['>=', '<='],
      },
      dataShift: [],
      date: {
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
      },
      pagination: {},
      dialogDelete: false,
      tempDelete: {},
      itemSelected: {
        count: 0
      },
      rules: {
        searchQuery: [
          { required: true, message: this.$lang[this.$store.state.userStores.langId].required, trigger: 'blur' },
        ]
      },
      labelRow: [{ id: 0, value: 'pdf', type: 'pdf' }, { id: 1, value: 'excel', type: 'xlsx' }],
      datapop: [],
      loadingSave: false
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    computedDialogTitle () {
      let title = ''
      if (this.tempPresence.id) {
        title = this.lang.edit + ' ' + this.$lang[this.langId].presence
      } else {
        title = this.lang.add + ' ' + this.$lang[this.langId].presence
      }
      return title
    }
  },

  watch: {
    selectedStore() {
      this.getPresence()
      this.getShift()
    }
  },

  mounted() {
    this.getPresence()
    this.getShift()
  },

  methods: {
    getPresence(search) {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        if (search) {
            this.params.search_text = [this.date.start_date, this.date.end_date]
        }
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/presence'),
          headers: headers,
          params: this.params
        }).then(response => {
          this.dataPresence = response.data.data
          this.datapop = []
          response.data.data.map(i => {
            this.datapop.push(false)
            // if (i.duration === 0) {
            //   i.visiblePop = false
            // }
          })
          this.pagination = response.data.meta
          this.loading = false
        }).catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
          this.dataPresence = []
          this.pagination = {}
          this.loading = false
        })
      } else {
        this.getMockupData()
      }
    },
    getMockupData() {
      this.dataPresence = require('/static/data/mockupPresence.json')
      this.dataPresence.map(i => {
        this.datapop.push(false)
      })
    },

    getShift(search) {
      if (![...document.getElementById('app').classList].includes('dummy-page')) {
        this.loading = true
        let param = {}
        if (search) {
          param = this.params
        }
        let headers = {
          Authorization: 'Bearer ' + this.token.access_token
        }

        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/shift'),
          headers: headers,
          params: param
        }).then(response => {
            // console.log('data', response.data.data)
            this.dataShift = response.data.data
            this.loading = false
          })
          .catch(error => {
            if (error.response.data.error.status_code !== 404) {
              this.$notify({
                type: 'warning',
                title: error.response.data.error.message,
                message: error.response.data.error.error
              })
            }
            this.dataEmployee = []
            this.loading = false
          })
      }
    },

    // employee
    addPresence (update) {
      this.loadingSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let method = update ? 'PUT' : 'POST'

      axios({
        method: method,
        url: baseApi(this.selectedStore.url_id, this.langId, update ? 'attendance/presence/' + this.tempPresence.id : 'attendance/presence'),
        headers: headers,
        data: this.tempPresence
      }).then(response => {
        this.dialogEdit = false
        this.tempPresence = {
          employee_id: '',
          date: '',
          shift_id: '',
          time_going: '',
          time_coming: '',
          note: ''
        }
        this.searchQuery = ''
        this.getPresence()
        this.loadingSave = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        } else {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogEdit = false
        this.loadingSave = false
      })
    },

    handleCancelAdd () {
      this.dialogEdit = false
      this.tempPresence = {
        employee_id: '',
        date: '',
        shift_id: '',
        time_going: '',
        time_coming: '',
        note: ''
      }
    },

    handleEdit (data) {
      // console.log('data', data)
      this.tempPresence = data
      this.tempPresence.searchQuery = data.employee_name
      let shiftNull = this.dataShift.filter(i => {
        return (data.shift_id === i.id)
      })
      if (shiftNull.length === 0) {
        // this.dataShift.push({
        //   id: data.shift_id,
        //   name: '-'
        // })
        this.tempPresence.shift_id = ''
      }
      this.dialogEdit = true
    },

    handleSearch (value) {
      if (value) {
        this.getEmployee(true)
      } else {
        this.getEmployee()
      }
    },

    handleSave () {
      if (this.tempPresence.id) {
        this.addPresence(true)
      } else {
        this.addPresence(false)
      }
    },

    getEmployeeSearch(queryString, callback) {
      // this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        sort_column: 'name',
        sort_type: 'asc',
        search: queryString
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee'),
        headers: headers,
        params: params
      })
        .then(response => {
          let data = response.data.data
          for (let i of data) {
            i.value = i.name + ' - ' + i.department
          }
          callback(data)
        })
        .catch(error => {
          if (error.response.data.error.status_code !== 404) {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error
            })
          }
        })
    },

    setEmployee (item) {
      this.tempPresence.employee_id = item.id
      this.tempPresence.searchQuery = item.name + ' - ' + item.department
    },

    setShift (item) {
      this.tempPresence.shift_id = item.id
    },

    datePicked (value) {
      this.params.page = 1
      if (value) {
        this.date = value
        this.getPresence(true)
      } else {
        this.getPresence()
      }
    },

    changeCurrentPage(val) {
      this.params.currentPage = val
      this.params.page = val
      this.getPresence()
    },

    handleDelete (data) {
      this.dialogDelete = true
      this.tempDelete = data
    },

    deleteRow () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'delete',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/presence/' + this.tempDelete.id),
        headers: headers
      }).then(response => {
        this.searchQuery = ''
        this.getPresence()
        this.dialogDelete = false
        this.tempDelete = {}
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogDelete = false
        this.tempDelete = {}
        this.loading = false
      })
    },

    handleSelectionChange (data) {
      this.itemSelected = {}
      let tempId = []
      data.map(i => {
        tempId.push(i.id)
      })
      this.itemSelected.dataid = tempId.join(',')
      this.itemSelected.count = tempId.length

      // console.log('select', this.itemSelected)
    },

    handleBulkdelete () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'post',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/presence/bulkdelete'),
        headers: headers,
        data: {
          presence_id: this.itemSelected.dataid
        }
      }).then(response => {
        this.getPresence()
        this.itemSelected = {}
        this.dialogDelete = false
        this.loading = false
      }).catch(error => {
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
        this.dialogDelete = false
        this.loading = false
      })
    },

    downloadPdf(item) {
      this.loading = true
      let url = baseApi(this.selectedStore.url_id, this.langId, 'attendance/presence/export')
      // let param = {
        this.params.type = item.type
      //   search_column: ['date', 'date'],
      //   search_text: [endDate, startDate],
      //   search_operator: ['<=', '>=']
      // }

      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: url,
        method: 'GET',
        headers,
        responseType: 'blob',
        params: this.params
      }).then((response) => {
        const fileName = 'presence_' + this.date.start_date + '-' + this.date.end_date + '.' + this.params.type
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch(error => {
        console.log('error', error)
        const { data } = error.response
        // Read file
        const file = this.fileReader(data)
        file.then(response => {
          const message = JSON.parse(response)
          console.log('err', message.error.error)
          this.$notify({
            type: 'warning',
            title: message.error.message,
            message: message.error.error
          })
        })
        this.loading = false
      })
    },

    fileReader(data) {
      const fileReader = new FileReader()
      return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
          fileReader.abort();
          reject(new Error('Problem parsing file'))
        }

        fileReader.onload = () => {
          resolve(fileReader.result)
        }

        fileReader.readAsText(data)
      })
    },

    setTimeAttend (data) {
      if (!this.tempPresence.id) {
        this.dataShift.map(i => {
          if (i.id === data) {
            this.tempPresence.time_coming = i.start_time
            this.tempPresence.time_going = i.end_time
          }
        })
      }
    },

    sortPresence (data) {
      if (data.prop !== 'employee_name') {
        if (data.order === 'descending') {
          this.params.sort_type = ['desc','desc']
        } else if (data.order === 'ascending') {
          this.params.sort_type = ['desc','asc']
        }
      } else {
        if (data.order === 'descending') {
          this.params.sort_type = 'desc'
        } else if (data.order === 'ascending') {
          this.params.sort_type = 'asc'
        }
      }

      if (data.prop === 'fdate') {
        this.params.sort_column = ['date','employee_name']
      } else if (data.prop === 'employee_name') {
        this.params.sort_column = 'employee_name'
      } else if (data.prop === 'fshift_datetime') {
        this.params.sort_column = ['shift_id', 'employee_name']
      } else if (data.prop === 'time_coming') {
        this.params.sort_column = ['time_coming', 'employee_name']
      } else if (data.prop === 'time_going') {
        this.params.sort_column = ['time_going', 'employee_name']
      } else if (data.prop === 'fduration') {
        this.params.sort_column = ['duration', 'employee_name']
      } else if (data.prop === 'ftime_earlier') {
        this.params.sort_column = ['time_earlier', 'employee_name']
      } else if (data.prop === 'ftime_late') {
        this.params.sort_column = ['time_late', 'employee_name']
      } else if (data.prop === 'fovertime') {
        this.params.sort_column = ['overtime', 'employee_name']
      }
      this.getPresence()
    },

    handlePop (data) {
      console.log('pop', this.datapop[data])
      this.datapop[data] = true
    }
  }
}
</script>

