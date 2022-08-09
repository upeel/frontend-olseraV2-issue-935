<template>
  <div class="form-wizard--content__wrapper">
    <div class="wizard-desc wizard-desc--image color-orange-commbank--bg">
      <img src="/static/img/commbank/address-card.png" />
    </div>
    <div class="wizard-content">
      <h3 style="margin-top: 0;" class="mb-24">{{rootLang.account_transfer_bank}}</h3>
      <div
        v-show="visibleAddress"
        class="flex-grow-1">
        <div class="font-14 color-white color-warning--bg mb-12 p-8">
          Pemilik rekening bank yang dimasukkan harus sama dengan KTP.
        </div>
        <el-form
          :model="formData"
          :rules="rulesForm"
          label-position="top">
          <div
            v-for="(row, key) in formData.banks"
            :key="key"
            class="mb-24">
            <div v-if="key > 0" class="flex-container flex-container--content-space-between flex-container--center mb-24">
              <h3 style="margin-top: 0;">{{rootLang.account_transfer_bank}} {{ key + 1 }}</h3>
              <el-button type="text" icon="el-icon-close" @click="handleReduceBank(key)" />
            </div>
            <el-form-item :label="rootLang.bank_name" prop="bank_id">
              <el-select v-model="row.bank_id" class="w-fit" filterable @change="(value) => handleSelected(value, key)">
                <el-option
                  v-for="(item, key) in listBank"
                  :key="key"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="rootLang.name_based_idcard" prop="bank_owner_name">
              <el-input v-model="row.bank_owner_name" @change="(value) => checkTheName(value, key)"></el-input>
            </el-form-item>
            <el-form-item :label="rootLang.account_number_bank" prop="bank_account_number">
              <el-input v-model="row.bank_account_number" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
            </el-form-item>
          </div>

          <el-button v-if="formData.banks.length < 3" type="info" @click="handleAddBank">
            {{rootLang.add_bank_account}}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {dataBank as getDataBank} from '@/api/settlement'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],

  props: {
    dataPeminjam: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      visibleAddress: true,
      visibleDomisili: true,
      listBank: [],
      formData: {
        banks: [
          {
            bank_id: '',
            bank_name: '',
            bank_owner_name: '',
            bank_account_number: ''
          }
        ]
      },
      rulesForm: {}
    }
  },

  computed: {
    // banks() {
    //   return [
    //     {
    //       id: 1,
    //       name: 'Bank Nasional Indonesia (BNI)'
    //     },
    //     {
    //       id: 2,
    //       name: 'Bank Rakyat Indonesia (BRI)'
    //     }
    //   ]
    // }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getDataBank()
    },
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        if (data && data && data.banks.length) {
          const obj = {}
          data.banks.map((bank, key) => {
            obj['bank_' + key] = bank
          })
          this.$emit('change', [obj, 'bank'])
        }
      }
    }
  },

  mounted(){
    this.getDataBank()
  },

  methods: {
    checkTheName(val, block){
      if(val !== this.dataPeminjam.nama){
        this.$message({
          type: 'warning',
          message: 'Nama pemilik rekening tidak sesuai KTP'
        })
        this.formData.banks[block].bank_owner_name = this.dataPeminjam.nama
      }
    },
    getDataBank(){
      let param = {
        per_page: 1000
      }
      getDataBank(param).then(response => {
        this.loading = false
        this.listBank = response.data.data
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },
    handleAddBank() {
      this.formData.banks.push({
        bank_id: '',
        bank_owner_name: this.dataPeminjam.nama,
        bank_name: '',
        bank_account_number: ''
      })
    },
    handleReduceBank(key) {
      this.formData.banks.splice(key, 1)
    },
    handleSelected(val, block) {
      this.listBank.forEach((item, no) => {
        if(item.id === val){
          this.formData.banks[block].bank_name = item.name
        }
      })
    }
  }
}
</script>
