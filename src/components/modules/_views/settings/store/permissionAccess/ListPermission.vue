<template>
  <div
    v-loading="load"
    class="table-custom-permission">
    <el-card
      v-for="(permission, idxData) in allData"
      :key="idxData"
      class="el-card-null box-card">
      <el-table
        v-if="permission.children && !permission.children.length"
        v-element-table-header
        :data="[permission]">
        <el-table-column
          prop="modul_name"
          label=""
          width="250">
          <template slot="header">
            <el-checkbox
              v-model="permission.checkAll"
              @change="(event) => checkAllHeader(event, idxData)">
              {{ permission.modul_name }}
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          :label="lang.view"
          prop="modul_name"
          align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.index"
              :true-label="1"
              :false-label="0"
              @change="onChangeHeader(idxData, permission)">
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="modul_name" align="center"
          label="Detail">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.show"
              :true-label="1"
              :false-label="0"
              @change="onChangeHeader(idxData, permission)">
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          :label="rootLang.add"
          prop="modul_name"
          align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.store"
              :disabled="checkDisabledCheckbox(scope.row, 'store')"
              :true-label="1"
              :false-label="0"
              @change="onChangeHeader(idxData, permission)">
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          :label="lang.edit"
          prop="modul_name"
          align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.edit"
              :disabled="checkDisabledCheckbox(scope.row, 'edit')"
              :true-label="1"
              :false-label="0"
              @change="onChangeHeader(idxData, permission)">
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="modul_name" align="center"
          :label="lang.remove">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.destroy"
              :disabled="checkDisabledCheckbox(scope.row, 'destroy')"
              :true-label="1"
              :false-label="0"
              @change="onChangeHeader(idxData, permission)">
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-else-if="permission.children && permission.children.length"
        v-element-table-header
        :data="permission.children">
        <el-table-column
          prop="modul_name"
          width="250">
          <template slot="header">
            <el-checkbox
              v-model="permission.checkAll"
              @change="(value) => checkAllItem(value, idxData)">
              {{ permission.modul_name }}
            </el-checkbox>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.modul_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="modul_name"
          align="center"
          :label="lang.view">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.index"
              :disabled="checkDisabledCheckbox(scope.row, 'index')"
              :true-label="1"
              :false-label="0"
              @change="onChangeItem(idxData, scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="modul_name"
          align="center"
          label="Detail">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.show"
              :disabled="scope.row.access_list.index === 0 || checkDisabledCheckbox(scope.row, 'show')"
              :true-label="1"
              :false-label="0"
              @change="onChangeItem(idxData, scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="modul_name"
          align="center"
          :label="rootLang.add">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.store"
              :disabled="scope.row.access_list.index === 0 || checkDisabledCheckbox(scope.row, 'store')"
              :true-label="1"
              :false-label="0"
              @change="onChangeItem(idxData, scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="modul_name"
          align="center"
          :label="lang.edit">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.edit"
              :disabled="scope.row.access_list.index === 0 || checkDisabledCheckbox(scope.row, 'edit')"
              :true-label="1"
              :false-label="0"
              @change="onChangeItem(idxData, scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="lang.remove"
          prop="modul_name"
          align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.access_list.destroy"
              :disabled="scope.row.access_list.index === 0 || checkDisabledCheckbox(scope.row, 'destroy')"
              :true-label="1"
              :false-label="0"
              @change="onChangeItem(idxData, scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
export default {
  name: 'TabelPermission',

  components:{
    lang() {
      return this.$store.state.userStores.lang
    },
    langId() {
      return this.$store.state.userStores.langId
    }
  },

  props: {
    dataPermission: {
      type: Array,
      default:null
    },
    load: {
      type: Boolean,
      default: false
    },
    selectedRole: {
      type: Object,
      default: {role: 'OW', role_name: ''}
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      allData: [],
      edited: [],
      disabledCheckbox: {
        'dashboard': ['edit', 'store', 'destroy'],
        'brands': ['show'],
        'specifications': ['show'],
        'collections': ['show'],
        'featured': ['show', 'detail', 'edit'],
        'productgroups': ['show'],
        'rawmaterial': ['show'],
        'sale': ['show'],
        'inextrans': ['show'],
        'inextranstype': ['show'],
        'posdevices': ['show', 'edit'],
        'pospasskey': ['show', 'store', 'destroy'],
        'posextsetting': ['show', 'store', 'destroy'],
        'shiftsetting': ['show', 'store', 'destroy'],
        'posreceiptnote': ['show', 'store', 'destroy'],
        'posstockmode': ['show', 'store', 'destroy'],
        'posdisabledinein': ['show', 'store', 'destroy'],
        'posbilling': ['show', 'store', 'destroy'],
        'poslocalserver': ['show', 'store', 'destroy']
      }
    }
  },

  watch: {
    dataPermission: {
      deep: true,
      immediate: true,
      handler (data) {
        if (data && data.length) {
          this.allData = JSON.parse(JSON.stringify(data))
        }
      }
    },
    edited: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', data)
      }
    },
  },

  methods: {
    checkAllHeader(val, idx){
      let idxChosen = this.edited.findIndex(x => x.api === this.allData[idx].api );
      this.edited.splice(idxChosen, 1);
      if(val){
        this.allData[idx].access_list.index = 1
        this.allData[idx].access_list.show = 1
        this.allData[idx].access_list.edit = 1
        this.allData[idx].access_list.store = 1
        this.allData[idx].access_list.update = 1
        this.allData[idx].access_list.destroy = 1
        this.edited.push({keyHeader: idx, keyItem: null, role_id: this.selectedRole.role, api: this.allData[idx].api,
          index: 1, show: 1, edit: 1, store: 1, update: 1, destroy: 1})
      }else{
        this.allData[idx].access_list.index = 0
        this.allData[idx].access_list.show = 0
        this.allData[idx].access_list.edit = 0
        this.allData[idx].access_list.store = 0
        this.allData[idx].access_list.update = 0
        this.allData[idx].access_list.destroy = 0
        this.edited.push({keyHeader: idx, keyItem: null, role_id: this.selectedRole.role, api: this.allData[idx].api,
          index: 0, show: 0, edit: 0, store: 0, update: 0, destroy: 0})
      }
    },
    checkAllItem(val, idx){
      let newValue = []
      let idxSplice = []
      this.allData[idx].children.map((item, idxMenu)=> {
        let idxChosen = this.edited.findIndex(x => x.api === item.api );
        idxSplice.push(idxChosen)
        if(val){
          item.access_list.index = 1
          item.access_list.show = 1
          item.access_list.edit = 1
          item.access_list.store = 1
          item.access_list.update = 1
          item.access_list.destroy = 1
          newValue.push({keyHeader: idx, keyItem: idxMenu, role_id: this.selectedRole.role, api: item.api,
            index: 1, show: 1, edit: 1, store: 1, update: 1, destroy: 1})
        }else{
          item.access_list.index = 0
          item.access_list.show = 0
          item.access_list.edit = 0
          item.access_list.store = 0
          item.access_list.update = 0
          item.access_list.destroy = 0
          newValue.push({keyHeader: idx, keyItem: idxMenu, role_id: this.selectedRole.role, api: item.api,
            index: 0, show: 0, edit: 0, store: 0, update: 0, destroy: 0})
        }
      })

      for (var i = 0; i < idxSplice.length; i++) {
        if (idxSplice[i] === 5) {
            this.edited.splice(i, 1);
        }
      }
      this.edited = [...this.edited, ...newValue];
    },
    onChangeHeader(idxHeader, row){
      this.allData[idxHeader].isEdit = true
      let idxChosen = this.edited.findIndex(x => x.api === row.api );
      if(idxChosen === -1){
        this.edited.push({keyHeader: idxHeader, keyItem: null, role_id: this.selectedRole.role, api: row.api,
          index: row.access_list.index, show: row.access_list.show, edit: row.access_list.edit,
          store: row.access_list.store, update: row.access_list.update, destroy: row.access_list.destroy})
      }else{
        this.edited.splice(idxChosen, 1);
        this.edited.push({keyHeader: idxHeader, keyItem: null, role_id: this.selectedRole.role, api: row.api,
          index: row.access_list.index, show: row.access_list.show, edit: row.access_list.edit,
          store: row.access_list.store, update: row.access_list.update, destroy: row.access_list.destroy})
      }
    },
    onChangeItem(idxHeader, idxItem, row){
      this.allData[idxHeader].children[idxItem].isEdit = true
      const idxChosen = this.edited.findIndex(x => x.api === row.api)
      if (idxChosen !== -1) {
        this.edited.splice(idxChosen, 1)
      }
      // if index 0, others must be 0 as well
      if (row.access_list.index === 0) {
        this.allData[idxHeader].children[idxItem].access_list.show = 0
        this.allData[idxHeader].children[idxItem].access_list.edit = 0
        this.allData[idxHeader].children[idxItem].access_list.store = 0
        this.allData[idxHeader].children[idxItem].access_list.update = 0
        this.allData[idxHeader].children[idxItem].access_list.destroy = 0
      }
      this.edited.push({
        keyHeader: idxHeader,
        keyItem: idxItem,
        role_id: this.selectedRole.role,
        api: row.api,
        index: row.access_list.index,
        show: !row.access_list.index ? 0 : row.access_list.show,
        edit: !row.access_list.index ? 0 : row.access_list.edit,
        store: !row.access_list.index ? 0 : row.access_list.store,
        update: !row.access_list.index ? 0 : row.access_list.edit,
        destroy: !row.access_list.index ? 0 : row.access_list.destroy
      })
    },
    cancelHeader(row){
      let idxChosen = this.edited.findIndex(x => x.api === row.api )
      let keyEdited = this.edited[idxChosen]
      this.allData[keyEdited.keyHeader].access_list = JSON.parse(JSON.stringify(this.dataPermission[keyEdited.keyHeader].access_list))
      this.allData[keyEdited.keyHeader].isEdit = false
      this.edited.splice(idxChosen, 1)
    },
    cancelItem(row){
      let idxChosen = this.edited.findIndex(x => x.api === row.api )
      let keyEdited = this.edited[idxChosen]
      this.allData[keyEdited.keyHeader].children[keyEdited.keyItem].access_list = JSON.parse(JSON.stringify(this.dataPermission[keyEdited.keyHeader].children[keyEdited.keyItem].access_list))
      this.allData[keyEdited.keyHeader].children[keyEdited.keyItem].isEdit = false
      this.edited.splice(idxChosen, 1)
    },
    cancelSave(){
      this.edited = []
    },
    checkDisabledCheckbox(row, type) {
      if (this.disabledCheckbox[row.id] && this.disabledCheckbox[row.id].length) {
        return this.disabledCheckbox[row.id].includes(type)
      } else {
        return false
      }
    }
  }
}
</script>
