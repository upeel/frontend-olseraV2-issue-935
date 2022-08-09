<template>
  <div>
    <div class="title-jurnal">
      <h4><strong>{{$lang[langId].tax_list}}</strong>
        <div style="float: right">
          <el-button size="small" type="success" :disabled="loadingSync" @click="syncData">
            <span v-if="loadingSync">
              <loading :active="true" color= '#1bb4e6' loader="dots" :width="123" :height="10" backgroundColor='#ffffff'></loading>
            </span>
            <span v-else>{{$lang[langId].get_from_jurnal}}</span>
          </el-button>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="dataTax"
        v-loading="isLoading"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column
          prop="jurnal_tax_id"
          :label="lang.code">
        </el-table-column>
        <el-table-column
          prop="jurnal_tax_name"
          :label="lang.tax_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.jurnal_tax_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="jurnal_tax_rate"
          :label="lang.tax_percentage"
          align="right">
          <template slot-scope="scope">
            <span>{{scope.row.jurnal_tax_rate}} %</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="selected"
          :label="$lang[langId].taxes_for">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="formEdit.select_as" placeholder="Select">
              <el-option
                v-for="item in optionTax"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>
              <el-tag v-if="scope.row.selected === 1"
                type="primary" size="mini" effect="dark"
                disable-transitions>{{capitalize(lang.all)}}
              </el-tag>
              <el-tag v-else-if="scope.row.selected === 2"
                type="success" size="mini" effect="dark"
                disable-transitions>{{capitalize(lang.sales)}}
              </el-tag>
              <el-tag v-else-if="scope.row.selected === 3"
                type="info" size="mini" effect="dark"
                disable-transitions>{{capitalize(lang.purchase)}}
              </el-tag>
              <span v-else>
                -
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="action" width="90">
          <template slot-scope="scope">
            <div v-if="scope.row.isEdit" style="float: right;">
              <el-tooltip class="item" effect="dark" :content="lang.cancel" placement="top">
                <el-button class="cancel-button" type="text" @click="cancelHandle(scope.$index)" style="color: rgb(255, 0, 0);">
                  <svg-icon type="cancel-edit"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="lang.save" placement="top">
                <el-button class="save-button" type="text" :disabled="loadingPost" :loading="loadingPost" @click="saveHandle(scope.$index)">
                  <svg-icon type="check-circle"></svg-icon>
                </el-button>
              </el-tooltip>
            </div>
            <div v-else style="float: right;">
              <el-button type="text" align="center" class="px-10" @click="handleSelectTax(scope.$index, scope.row)">
                <svg-icon type="edit"></svg-icon>
              </el-button>
              <el-popconfirm
                :confirm-button-text='$lang[langId].yes'
                :cancel-button-text='$lang[langId].no'
                @confirm="handleRemoveTax(scope.row)"
                icon="el-icon-info"
                icon-color="red"
                :title="$lang[langId].are_you_want_remove + ' ' + capitalize(scope.row.jurnal_tax_name) + ' ?'"
              >
                <el-button slot="reference" type="text" style="color: #FF0000;">
                  <svg-icon icon-class="trash" stroke="#FF0000"></svg-icon>
                </el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <loading 
        align="center"
        :active="true"
        color= '#1bb4e6'
        loader="spinner"
        :width="32"
        :height="32"
        backgroundColor='#ffffff'>
      </loading>
    </div>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import Loading from 'vue-loading-overlay';

export default {
  name: 'ProductAccount',
  components: {
    Loading
  },
  props:['load'],
  data() {
    return {
      isLoading: false,
      loadingSync: false,
      loadingPost: false,
      itemPage: [
        {
          value: '15',
          label: '15 item'
        },{
          value: '25',
          label: '25 item'
        },{
          value: '50',
          label: '50 item'
        },{
          value: '100',
          label: '100 item'
        }
      ],
      filter: [
        {
          value: '',
          label: this.$store.state.userStores.lang.all
        },{
          value: 'account_no',
          label: this.$lang[this.$store.state.userStores.langId].account_number
        },{
          value: 'account_name',
          label: this.$lang[this.$store.state.userStores.langId].account_name
        },{
          value: 'jurnal_account_name',
          label: this.$lang[this.$store.state.userStores.langId].account_jurnal
        }
      ],
      optionTax: [{value: 1, label: this.$store.state.userStores.lang.all},
        {value: 2, label: this.$store.state.userStores.lang.sales},
        {value: 3, label: this.$store.state.userStores.lang.purchase}],
      formEdit: {id: '', select_as: 0},
      dataTax: [],
      clearMap: "",
      params: {
        sort_column: '',
        sort_type: '',
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
    '$store.getters.selectedStore': function() {
      // this.getSuppProduct()
    },
    load: function(newVal, oldVal){
      this.loadData()
    }
  },
  methods: {

    changeSortTable(val) {
      if (val.order === 'ascending') val.order = 'asc'
      if (val.order === 'descending') val.order = 'desc'
      if (val.order === null) val.order = this.params.sort_type

      this.params.sort_type = val.order
      this.params.sort_column = val.prop
      this.loadData()
    },

    loadData(){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/taxlist'),
        headers: headers,
        params: this.params
      }).then(response => {
        let resp = response.data.data
        this.dataTax = resp.map(v => ({...v, isEdit: false}))

        this.isLoading = false 
      }).catch(error => {
        this.isLoading = false 
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

    syncData(){
      this.loadingSync = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/jurnaltax'),
        headers: headers,
      }).then(response => {
        let resp = response.data.data
        this.dataTax = resp.map(v => ({...v, isEdit: false}))

        this.loadingSync = false 
      }).catch(error => {
        this.loadingSync = false 
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

    handleRemoveTax(val){
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let id = val.id
      let allTax = this.dataTax
      let removeIndex = []

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/tax/' + id),
        headers: headers,
      }).then(response => {
        if (response.data.status === 200){
   
          allTax.forEach((el, index) => {
            if (el.id === id){
              removeIndex.push(index);
            }
          })

          for (var i = removeIndex.length -1; i >= 0; i--) 
            allTax.splice(removeIndex[i], 1); 
  
          this.dataTax = allTax
          this.$message({
            message: 'Success',
            type: 'success'
          })
        } else {
           this.$message({
            message: '',
            type: 'success'
          })
        }
        this.isLoading = false
      }).catch(error => {
        this.loadingDelete = false
        this.dialogDeleteTax = false
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

    handleSelectTax(index, row){
      let idxEdit = this.dataTax.findIndex( x => x.isEdit === true );
      if(idxEdit !== -1){
        this.dataTax[idxEdit].isEdit = false
      }
      this.formEdit = {id: row.id, select_as: row.selected}
      this.dataTax[index].isEdit = true
    },

    cancelHandle(index) {
      this.formEdit = {id: '', select_as: 0}
      this.dataTax[index].isEdit = false
    },

    saveHandle(index){
      this.loadingPost = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = {select_as: this.formEdit.select_as}

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exjurnal/tax/'+ this.formEdit.id),
        headers: headers,
        params: data
      }).then(response => {
        this.dataTax[index].isEdit = false
        this.dataTax[index].selected = this.formEdit.select_as
        this.$message({
          message: 'Success',
          type: 'success'
        })
        this.formEdit = {id: '', select_as: 0}
        this.loadingPost = false 
      }).catch(error => {
        this.loadingPost = false 
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


    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

  },
  mounted() {
    this.loadData()
  }
}
</script>