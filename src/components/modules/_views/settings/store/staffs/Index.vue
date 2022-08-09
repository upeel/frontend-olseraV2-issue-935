<template>
  <div v-loading="loading">
    <el-card
      v-for="(item, key) in data"
      :key="key"
      class="box-card no-padding"
      shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ item.name }}</span>
        <button-action-authenticated
          v-if="item.id !== 'OW'"
          @click="add(item.id)"
          style="float: right; padding: 3px 0"
          type="text">
          {{ lang.add }}
        </button-action-authenticated>
        <div style="font-size: 12px; color: #AAA">{{ item.info }}</div>
      </div>

      <div class="card-body">
        <div class="like-tr-wrapper">
          <div v-for="(user, key) in item.users" v-loading="loadingItems" class="like-tr clearfix" :key="key">
            <div class="width-200 like-tr-item">
              <div class="clearfix">
                <div class="pull-left" style="padding-left: 8px;">
                  {{ user.name }}<br/>
                  <span class="size-11">{{ user.email }}</span>
                </div>
              </div>
            </div>

            <div class="width-140 like-tr-item">
              <div class="editable-field">
                <span class="size-12 editable-field-header">
                  {{ lang.pos_access_id }}
                </span>
                <el-input @change="update(user)" v-model="user.code" type="text" size="small" :placeholder="$lang[langId].please_input+lang.pos_access_id" />
              </div>
            </div>

            <!-- <div v-if="item.id !== 'OW'" class="width-100 like-tr-item">
              <div class="editable-field">
                <span class="size-12 editable-field-header">
                  {{ $lang[langId].owner }}
                </span>
                <el-select @change="update(user)" v-model="user.is_owner" size="small">
                  <el-option :value="1" :label="lang.yes" />
                  <el-option :value="0" :label="lang.no" />
                </el-select>
              </div>
            </div> -->

            <div class="width-120 like-tr-item">
              <span class="size-12">
                {{ lang.pos_served_by }}
              </span>
              <div style="margin-bottom: 8px;"></div>
              <el-switch @change="update(user)" v-model="user.is_server" active-value="1" inactive-value="0" size="small"/>
            </div>

            <div
              v-if="item.id !== 'OW'"
              class="width-60 like-tr-item flex-container">
              <el-button @click="remove(user, item)" class="btn-delete" type="text" icon="el-icon-delete" size="default" />
              <el-button @click="edit(user, item)" type="text" >
                <svg-icon icon-class="edit-2" class="ml-10"></svg-icon>
              </el-button>
            </div>
            <!-- <div
              v-if="item.id !== 'OW'"
              class="width-60 like-tr-item">
              <el-button @click="edit(user, item)" type="text" >
                <svg-icon icon-class="edit-2" class="mr-4"></svg-icon>
              </el-button>
            </div> -->
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog
      :visible.sync="showForm"
      :before-close="cancel"
      custom-class="without-padding dialog-without-header">
      <group-form
        :saved="saved"
        :loading="loading"
        :role-options="roles"
        :selected-role="selectedRole"
        @save="save"
        @cancel="cancel"
        @showinfo="showRole">
      </group-form>
    </el-dialog>

    <el-dialog
      :visible.sync="showFormEdit"
      :before-close="cancel"
      custom-class="without-padding dialog-without-header">
      <group-form
        :staff="tmp"
        :isedit="true"
        :saved="saved"
        :loading="loading"
        :role-options="roles"
        :selected-role="selectedRole"
        @update="handleUpdate"
        @cancel="cancel"
        @showinfo="showRole">
      </group-form>
    </el-dialog>

    <el-dialog
      :title="lang.info_staff_title"
      :visible.sync="dialogVisible"
      width="420px">
      <div class="dialog-body">
        <div class="tips-list">
          <template v-for="(item, key) in computedRoleOptions">
            <div :key="key">
              <h5>{{ item.label }}</h5>
              <p>{{ item.desc }}</p>
              <hr/>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'

import { getUserRole } from '@/api/store'

import axios from 'axios'
import GroupForm from './Form'

const apiEndPoint = 'staffs/'

export default {
  data() {
    return {
      loading: true,
      loadingItems: false,
      saved: false,
      data: [],
      isEditing: [],
      showForm: false,
      showFormEdit: false,
      disabledButton: false,
      tmp: {},
      selectedRole: null,
      roles: [],
      params: {
        search: '',
        per_page: 20,
        sort_column: 'view_order',
        sort_type: 'asc'
      },
      dialogVisible: false,
      computedRoleOptions: [],
      dataRoles: []
    }
  },

  components: {
    GroupForm
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    }
  },

  mounted() {
    // const sourceRoles = [
    //   {
    //     id: 'OW',
    //     label: this.$lang[this.$store.state.userStores.langId].owner,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_owner
    //   },
    //   {
    //     id: 'SP',
    //     label: this.$lang[this.$store.state.userStores.langId].supervisor,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_supervisor
    //   },
    //   {
    //     id: 'AS',
    //     label: this.$lang[this.$store.state.userStores.langId].assistant_supervisor,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_assistant_supervisor
    //   },
    //   {
    //     id: 'ST',
    //     label: this.$lang[this.$store.state.userStores.langId].staffs,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_staff
    //   },
    //   {
    //     id: 'PO',
    //     label: this.$lang[this.$store.state.userStores.langId].staff_pos,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_staff_pos
    //   },
    //   {
    //     id: 'PS',
    //     label: this.$lang[this.$store.state.userStores.langId].staff_pos_senior,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_staff_pos_senior
    //   },
    //   {
    //     id: 'RP',
    //     label: this.$store.state.userStores.lang.reports,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_staff_report
    //   },
    //   {
    //     id: 'SA',
    //     label: this.$lang[this.$store.state.userStores.langId].admin_sales,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_admin_sales
    //   },
    //   {
    //     id: 'PT',
    //     label: this.$lang[this.$store.state.userStores.langId].purchase_stock,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_purchase_stock
    //   },
    //   {
    //     id: 'SS',
    //     label: this.$lang[this.$store.state.userStores.langId].sales_stock,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_sales_stock
    //   },
    //   {
    //     id: 'LW',
    //     label: this.$lang[this.$store.state.userStores.langId].logistics_warehouse,
    //     desc: this.$lang[this.$store.state.userStores.langId].info_role_logistics_warehouse
    //   }
    // ]
    // const onlyRoles = {
    //   L: ['OW'],
    //   B: ['OW', 'PO', 'PS'],
    //   F: []
    // }
    // sourceRoles.map(role => {
    //   if (this.selectedStore.plan_type_id !== 'F') {
    //     if (onlyRoles[this.selectedStore.plan_type_id].includes(role.id)) {
    //       this.roles.push({ ...role })
    //     }
    //   } else {
    //     this.roles.push({ ...role })
    //   }
    // })

    this.getData()
    this.getRoles()
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.data.map(i => {
          if (i.id === 'SP') {
            i.info = this.$lang[this.langId].info_role_supervisor
          }
          if (i.id === 'AS') {
            i.info = this.$lang[this.langId].info_role_assistant_supervisor
          }
          if (i.id === 'ST') {
            i.info = this.$lang[this.langId].info_role_staff
          }
          if (i.id === 'PO') {
            i.info = this.$lang[this.langId].info_role_staff_pos
          }
          if (i.id === 'PS') {
            i.info = this.$lang[this.langId].info_role_staff_pos_senior
          }
          if (i.id === 'RP') {
            i.info = this.$lang[this.langId].info_role_staff_report
          }
          if (i.id === 'SA') {
            i.info = this.$lang[this.langId].info_role_admin_sales
          }
          if (i.id === 'PT') {
            i.info = this.$lang[this.langId].info_role_purchase_stock
          }
          if (i.id === 'SS') {
            i.info = this.$lang[this.langId].info_role_sales_stock
          }
          if (i.id === 'OW') {
            i.info = this.$lang[this.langId].info_role_owner
          }
        })
        // this.data.map((item, index) => {
        //   if (item.total_user != 0) {
        //     item.users.map(i => {
        //       if(i.email === '') {
        //         return i.password = 'password'
        //       }
        //     })
        //   }
        // })
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response.data.error.status_code === 401) {
          this.$router.push('/selectstore')
        } else {
          this.$notify({
            type: 'warning',
            title: 'Error',
            message: error.response.data.error.error
          })
        }
      })
    },

    add(role) {
      this.selectedRole = role
      this.showForm = true
    },
    update(staff) {
      this.loadingItems = true
      let data = Object.assign({}, staff)
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'updateattr' + '/' + staff.id),
        method: 'PUT',
        headers,
        data
      }).then(response => {
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loadingItems = false
        this.getData()
      }).catch(error => {
        this.loadingItems = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    save(data) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'store'),
        headers: headers,
        data
      }).then(response => {
        this.loading = false
        this.saved = true
        this.showForm = false
        this.getData()
        this.$message({
          type: 'success',
          message: 'saved'
        })
      }).catch(error => {
        this.saved = false
        this.loading = false
        if (typeof error.response.data.error.error === 'string') {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        } else {
          var er = Object.getOwnPropertyNames(error.response.data.error.error)
          if (er.length >= 2) {
            var msg = []
            er.map((i,idx) => {
              msg.push(error.response.data.error.error[i][0])
            })
            var message = msg.join(', ')
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: message
            })
          } else {
            this.$notify({
              type: 'warning',
              title: error.response.data.error.message,
              message: error.response.data.error.error[er[0]][0]
            })
          }
        }
      })
    },
    edit(staff, data) {
      this.tmp = {}
      staff.role_id = data.id
      staff.staff_id = staff.id
      this.showFormEdit = true
      this.tmp = Object.assign({}, staff)
    },
    remove(staff, data) {
      this.loadingItems = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + 'delete/' + staff.id),
        headers
      }).then(response => {
        this.loadingItems = false
        this.getData()
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingItems = false
      })
    },
    cancel() {
      this.showForm = false
      this.showFormEdit = false
    },
    cancelManageItems(index) {
      this.isEditing.map(item => {
        item.editing = false
        item.block = ''
      })
    },
    remPass(user) {
      this.data.map((item, index) => {
        if (item.total_user != 0) {
          item.users.map(i => {
            if(i.id === user.id) {
              return i.password = ''
            }
          })
        }
      })
    },
    showRole (data) {
      this.computedRoleOptions = data
      this.dialogVisible = true
    },
    handleUpdate (data) {
      this.showFormEdit = false
      this.update(data)
    },

    getRoles() {
      this.loading = true
      let params = {
        sort_column: 'view_order',
        sort_type: 'asc'
      }
      getUserRole(params).then(response => {
        this.dataRoles = response.data.data

        this.dataRoles.map(i => {
          if (i.id === 'OW') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_owner
          }
          if (i.id === 'SP') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_supervisor
          }
          if (i.id === 'AS') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_assistant_supervisor
          }
          if (i.id === 'ST') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_staff
          }
          if (i.id === 'PO') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_staff_pos
          }
          if (i.id === 'PS') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_staff_pos_senior
          }
          if (i.id === 'RP') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_staff_report
          }
          if (i.id === 'SA') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_admin_sales
          }
          if (i.id === 'PT') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_purchase_stock
          }
          if (i.id === 'SS') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_sales_stock
          }
          if (i.id === 'LW') {
            i.label = i.name
            i.desc = this.$lang[this.$store.state.userStores.langId].info_role_logistics_warehouse
          }
          if (i.id === 'PJ') {
            i.label = i.name
            i.desc = ''
          }
        })

        /**
         * filter role by plan types
         */
        const onlyRoles = {
          L: ['OW'],
          B: ['OW', 'PO', 'PS'],
          F: [],
          P: []
        }
        this.dataRoles.map(role => {
          if (this.selectedStore.plan_type_id !== 'F' && this.selectedStore.plan_type_id !== 'P') {
            if (onlyRoles[this.selectedStore.plan_type_id].includes(role.id)) {
              this.roles.push({ ...role })
            }
          } else {
            this.roles.push({ ...role })
          }
        })

        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response.data.error.status_code === 401) {
          // this.$router.push('/selectstore')
        } else {
          this.$notify({
            type: 'warning',
            title: 'Error',
            message: error.response.data.error.error
          })
        }
      })
    },
  }
}
</script>
