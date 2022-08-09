<template>
  <div>
    <div class="title-jurnal">
      <h4>
        <strong>{{$lang[langId].mapping_supplier}} ({{allSupplier.length}})</strong>
        <div style="float: right;">
          <el-button size="small" :loading="loadingPost" :disabled="loadingPost || chosenSupplier.length === 0" :type="chosenSupplier.length !== 0 ? 'success' : 'info'" @click="postHandle">
            <span>Post {{lang.supplier}}</span>
          </el-button>
          <el-button type="primary" size="small" @click="handleListSupplier">
            {{ $lang[langId].supplier_list }}
          </el-button>
        </div>
      </h4>
    </div>
    <div v-if="isLoading === false">
      <el-table
        ref="multipleTable"
        :data="allSupplier"
        @selection-change="handleSelectPost"
        class="product-table-max-height mobile-fix-height-unset"
        max-height="340"
        stripe>
        <el-table-column type="selection" width="30" class-name="text-center">
        </el-table-column>

        <el-table-column
          prop="name"
          :label="lang.supplier_name">
          <template slot-scope="scope">
            <span>{{capitalize(scope.row.supplier_name)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="supplier_id">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.isActive" 
              :placeholder="$lang[langId].select" 
              filterable
              remote
              reserve-keyword
              v-model="formEdit.id"
              @change="(value) => selectSupplier(value)"
              :remote-method="loadSupplierAccurate"
              style="width: 100%">
              <el-option
                v-for="(item, keySupplier) in dataSupplierAccurate"
                :key="keySupplier"
                :label="item.vendorNo +' '+ item.name"
                :value="item.id">
              </el-option>
            </el-select>

          </template>
        </el-table-column>
        <el-table-column :label="$lang[langId].action" width="180" align="right">
          <template slot-scope="scope">

            <el-button v-if="scope.row.isActive === false" type="text" @click="mapHandle(scope.$index, scope.row)">
              <svg-icon type="edit"></svg-icon>
              Map Supplier
            </el-button>

            <el-button class="cancel-button" type="text" v-if="scope.row.isActive" @click="cancelHandle(scope.$index)" style="color: rgb(255, 0, 0);">
              <svg-icon type="cancel-edit"></svg-icon>
              {{ lang.cancel }}
            </el-button>
            <el-button class="save-button" type="text" v-if="scope.row.isActive" @click="saveHandle(scope.$index)">
              <svg-icon type="check-circle"></svg-icon>
              {{ lang.save }}
            </el-button>
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
  name: 'MapSupplier',
  components: {
    Loading
  },

  props: {
    allSupplier: {
      type: Array,
      default: null
    },
    isFecth: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      formEdit: {
        supplier_id: '',
        vendorNo: '',
        id: '',
        name: ''
      },
      isLoading: false,
      dataSupplierAccurate: [],
      chosenSupplier: [],
      loadingPost: false,
      clearMap: ""
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
    }
  },
  methods: {
    loadSupplierAccurate(val){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let paramsData = val ? {search: val} : {search: ''}

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/vendor'),
        headers: headers,
        params: paramsData
      }).then(response => {
        this.dataSupplierAccurate = response.data.data
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

    postHandle(){
      this.loadingPost = true

			if(this.allSupplier.length === this.chosenSupplier.length){
				this.bulkPost()
			}else{
				this.commonPost()
			}
    },

		bulkPost(){
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

			let data = {supplier_id: []}

			this.chosenSupplier.forEach(function(v){
				if(v.supplier_id){
					data.supplier_id.push(v.supplier_id)
				}else{
					data.supplier_id.push(0)
				}
			});

			axios({
				method: 'POST',
				url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/bulkvendor'),
				headers: headers,
				data
			}).then(response => {
				let res = response.data.data
				res.forEach(r => {
					let idx = this.allSupplier.findIndex(x => x.supplier_id === parseInt(r.supplier_id));
					this.allSupplier.splice(idx, 1)
				})

				this.$message({
					type: 'success',
					message: this.$lang[this.langId].success_posting
				})
				this.loadSupplierAccurate()
				this.loadingPost = false
				this.allSupplier = []
			}).catch(error => {
				this.allSupplier = []
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

		commonPost(){
      let headers = {Authorization: 'Bearer ' + this.token.access_token}
      var itemsProcessed = 0;

			this.chosenSupplier.forEach(item => {
				let data = {
					supplier_id : item.supplier_id
				}

				axios({
					method: 'POST',
					url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/vendor'),
					headers: headers,
					params: data
				}).then(response => {
					this.allSupplier.map((i, idx) => {
						if (i.supplier_id === item.supplier_id) {
							this.allSupplier.splice(idx, 1)
						}
					})

					itemsProcessed++;
					if(itemsProcessed === this.chosenSupplier.length) {
						this.loadSupplierAccurate()
						this.$message({
							type: 'success',
							message: this.$lang[this.langId].success_posting
						})
						this.loadingPost = false
						this.chosenSupplier = []
					}

				}).catch(error => {
					itemsProcessed++;
          this.loadingPost = false
					if(itemsProcessed === this.chosenSupplier.length) {
						this.chosenSupplier = []
					}
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
			});
		},

    handleSelectPost(val){
      if (val.length > 0) {
        this.chosenSupplier = val
      }else{
        this.chosenSupplier = []
      }
    },

    selectSupplier(value){
      this.dataSupplierAccurate.map((item, idx) => {
        if(item.id === value){
          this.formEdit.vendorNo = item.vendorNo
          this.formEdit.name = item.name
        }
      });
    },

    mapHandle(index, row) {
      let idxActive = this.allSupplier.findIndex( x => x.isActive === true );
      if(idxActive !== -1){
        this.allSupplier[idxActive].isActive = false
      }
      this.formEdit.supplier_id = row.supplier_id
      this.allSupplier[index].isActive = true
    },
    
    cancelHandle(index) {
      this.formEdit = {supplier_id: '', vendorNo: '', name: '', id: 0}
      this.allSupplier[index].isActive = false
    },

    saveHandle(index) {
      this.isLoading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'exaccurate/vendormap'),
        headers: headers,
        data: this.formEdit
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
            this.formEdit = {supplier_id: '', vendorNo: '', name: '', id: 0}
          }
          this.isLoading = false
          this.allSupplier.splice(index, 1)

        })
        .catch(error => {
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
          this.allSupplier[index].isActive = true
        })
    },


    handleListSupplier() {
      this.$emit('supplierList')
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
    // if(this.isFecth.fetchSupplier === 0){
      this.loadSupplierAccurate()
    // }
 }
}
</script>
