<template>
  <div class="main-content">
    <div class="table-handler-flex">
      <div class="flex-grow-1">
        <h4 class="main-content__title">{{ rootLang.staffs_permission }}</h4>
      </div>
      <el-button type="text" @click="cancelEdited" :disabled="isLoading" :loading="isLoading">
        <svg-icon icon-class="more-vertical" class="font-20 color-info"></svg-icon>
      </el-button>
    </div>

    <div class="card-body">
      <div class="jurnalExportHeader mb-24 pos-sticky" style="top: 120px; z-index: 9;">
        <el-row :gutter="20" class="px-10">
          <el-col :md="20" :sm="20" :xs="16" align="left" class="pt-4">
            <span class="jurnal">{{selectedRole.role_name}}</span>
          </el-col>

          <el-col :md="4" :sm="4" :xs="8" align="right">
            <el-dropdown :hide-on-click="false">
              <el-button
                icon="el-icon-caret-bottom"
                circle
                size="mini"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(role, keyRole) in dataRoles"
                  :key="keyRole"
                  style="padding: 0px">
                  <el-button type="text" class="accounting-dropBtn" @click="selectRole(role)">
                    {{role.name}}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>

      <list-permission
        ref="permissionList"
        :dataPermission="dataPermission"
        :selectedRole="selectedRole"
        :load="isLoading"
        @change="changeEdited"
      />

      <div
        v-if="savePermision.length !== 0"
        class="save-bottom-full">
        <div class="box-bodys">
          <div class="visible-lg font-bold">{{ $lang[langId].save_change }}</div>
          <div class="flex-grow-1"></div>
          <el-button type="info" @click="cancelEdited">{{ lang.cancel }}</el-button>
          <el-button type="primary" @click="saveEdited" :loading="loadingSave" >{{lang.save}}</el-button>
        </div>
      </div>
    </div>

    <el-dialog
      :title="$lang[langId].unsaved_title"
      :visible.sync="saveDialog"
      :close-on-click-modal="false"
      :show-close="false"
      center>
      <div style="text-align: center;">
        <span>{{$lang[langId].not_save_text}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSaveDialog">{{ $lang[langId].dont_save }}</el-button>
        <el-button type="success" @click="saveEdited" :disabled="loadingSave">{{ lang.save }}</el-button>  
      </span>
    </el-dialog>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import ListPermission from './ListPermission';
import { getUserRole } from '@/api/store'
import { permissionList, updatePermission } from '@/api/staffpermission'

export default {
  name: 'StaffPermission',
  mixins: [basicComputedMixin],

  components: {
    ListPermission
  },

  data() {
    return {
      isLoading: false,
      loadingSave: false,
      dataRoles: [],
      selectedRole: {role: 'SP', role_name: this.$lang[this.$store.state.userStores.langId].supervisor},
      savePermision: [],
      dataPermission: [],
      params: {
        search: null,
        role_id:'SP'
      },
      saveDialog: false
    }
  },
  
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    },

  },

  mounted() {
    this.getData()
    this.getRoles()
    window.userGuiding.hideChecklist()
  },

  beforeDestroy() {
    window.userGuiding.launchChecklist()
  },

  methods: {
    getRoles() {
      let dataparams = {
        sort_column: 'view_order',
        sort_type: 'asc'
      }
      getUserRole(dataparams).then(response => {
        var removeValFrom = ['PO', 'PS', 'PJ'];
        this.dataRoles = response.data.data.filter((value, idx) => !removeValFrom.includes(value.id));
        // this.dataRoles.unshift({id: "OW", name: this.$lang[this.$store.state.userStores.langId].owner, view_order: 0});
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
    getData() {
      this.isLoading = true
      let dataparams = this.params
      permissionList(dataparams).then(response => {
        let res = response.data.data[0].detail.map(function mapId({menus, ...r}) {
          return {...r, checkAll: false, isEdit: false, children: menus.map(v => ({...v, isEdit: false}))};
        });
        this.selectedRole.role_name = response.data.data[0].role_name
        this.dataPermission = res
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },
    selectRole(role) {
      if(this.savePermision.length === 0){
        this.selectedRole.role = role.id
        this.params.role_id = role.id
        this.getData()
      }else{
        this.saveDialog = true
      }
    },
    changeEdited(data) {
      this.savePermision = data
    },
    saveEdited() {
      this.loadingSave = true
      let dataparams = {
        role_id: this.params.role_id,
        permission:	this.savePermision
      }
      dataparams.permission.map(function(item) { 
          delete item.keyHeader; 
          delete item.keyItem;
          delete item.role_id;
          return item; 
      });
      updatePermission(dataparams).then(response => {
        this.$refs.permissionList.cancelSave()
        this.savePermision = []
        this.getData()
        this.loadingSave = false
      }).catch(error => {
        this.loadingSave = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },
    cancelEdited() {
      this.$refs.permissionList.cancelSave()
      this.savePermision = []
      this.getData()
    },
    cancelSaveDialog() {
      this.saveDialog = false
    }
  }
}
</script>
