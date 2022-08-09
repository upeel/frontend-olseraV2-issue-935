<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      @close="handleCloseAccountName"
      width="60%"
      center 
      custom-class="dialog-card">

        <div slot="title" class="flex-container">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" align="left">
                <strong v-if="activeTab === 'revennue'">{{$lang[langId].set_income_transaction_type}}</strong>
                <strong v-else>{{$lang[langId].set_outlay_transaction_type}}</strong>
              </h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
                <el-button type="info" @click="handleCloseAccountName">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-tag size="large" class="tag-jurnal-info2">
          <el-row :gutter="10">
            <el-col :md="1" :sm="1" :xs="24" align="center">
              <i class="el-icon-warning-outline"></i>
            </el-col>
            <el-col :md="23" :sm="23" :xs="24">
              <p>{{$lang[langId].account_accurate_info}}</p>
            </el-col>
          </el-row>
        </el-tag>

        <!-- <el-row :gutter="10" class="pb-12">
          <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" align="left">
            <el-button @click="secletAccountTab('revennue')" :type="activeTab === 'revennue' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].revennue}}</el-button>
            <el-button @click="secletAccountTab('outlay')" :type="activeTab === 'outlay' ? 'primary' : 'info'" round plain size="small">{{$lang[langId].outlay}}</el-button>
          </el-col>
        </el-row> -->

        <map-income v-if="activeTab === 'revennue'"/>
        <map-expense v-if="activeTab === 'outlay'"/>
    </el-dialog>
          
  </div>
</template>

<script>
import mapIncome from 'components/modules/_views/accounting/accounting-software/accurate/mapping/mapIncome.vue';
import mapExpense from 'components/modules/_views/accounting/accounting-software/accurate/mapping/mapExpense.vue';
import mixinAccounting from '@/mixins/mixinAccounting';
import { baseApi } from 'src/http-common'
import axios from 'axios'

export default {
  props: ['show', 'activeTab'],
  name: "DialogJurnalTransactionType",
  mixins: [mixinAccounting],

  components: {
    mapIncome,
    mapExpense,

  },
  
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  data() {
    return {
      modalShow: true,
    }
  },

  methods:{
    secletAccountTab(val){
      this.activeTab = val
    },

    handleCloseAccountName(){
      this.modalShow = false;
      this.$emit('close')
    }
  }
}
</script>