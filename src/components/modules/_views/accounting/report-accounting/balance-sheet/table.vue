<template>
  <div>
    <div class="table-responsive">
      <table class="acounting-nested-table" style="width: 100%;">
        <tbody>
          <!-- DATA ASSET -->
          <tr class="nested-table-name-row">
            <th class="name" colspan="3">{{dataAsset.name}}</th>
          </tr>
          <template v-for="(asset, idx) in dataAsset.children">
            <tr class="nested-table-data-list" :key="idx">
              <td>{{capitalize(asset.name)}}</td>
              <td align="right" v-if="asset.children.length === 0">0</td>
              <td align="right" v-else></td>
            </tr>
            <template v-for="(assetChild, idxChild) in asset.children">
              <tr class="nested-table-subdata-list" :key="parseInt('1'+idx+idxChild)">
                <td>{{assetChild.account_no ? assetChild.account_no + ' - ' : ''}}{{capitalize(assetChild.account_name)}}</td>
                <td v-if="assetChild.famount !== '0' && assetChild.account_no !== ''" align="right">
									<router-link v-if="allBranch.allBranch" :to="{ name:'Accounting Report - Detail All Branch', params: {row: {page: 'Balance Sheet', period: assetChild.period, typePeriod: typePeriod, account_no: assetChild.account_no, account_name: assetChild.account_name, store: storeBranch}}}">
                    {{assetChild.famount}}
                  </router-link>
                  <router-link v-else :to="{ name:'Accounting Report - Detail', params: {row: {page: 'Balance Sheet', period: assetChild.period, typePeriod: typePeriod, account_no: assetChild.account_no, account_name: assetChild.account_name, store: storeBranch}}}">
                    {{assetChild.famount}}
                  </router-link>
                </td>
                <td v-else align="right">
                  {{assetChild.famount}}
                </td>
              </tr>
            </template>
            <tr v-if="asset.children.length !== 0" class="nested-table-summary-list" :key="parseInt(idx+'100'+idx)">
              <td>SubTotal {{capitalize(asset.name)}}</td>
              <td align="right">{{asset.famount}}</td>
            </tr>
          </template>
          <tr class="nested-table-summary-group">
            <td>Total {{dataAsset.name}}</td>
            <td align="right">{{dataAsset.famount}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-responsive" style="margin-top: 24px">
      <table class="acounting-nested-table" style="width: 100%;">
        <tbody>
          <!-- DATA LIABILITAS -->
          <tr class="nested-table-name-row">
            <th class="name" colspan="3">{{dataLiabilities.name}}</th>
          </tr>
          <template v-for="(liabilities, idx) in dataLiabilities.children">
            <tr class="nested-table-data-list" :key="idx">
              <td>{{capitalize(liabilities.name)}}</td>
              <td align="right" v-if="liabilities.children.length === 0">0</td>
              <td align="right" v-else></td>
            </tr>
            <template v-for="(liabilitiesChild, idxChild) in liabilities.children">
              <tr class="nested-table-subdata-list" :key="parseInt(idx+'200'+idxChild)">
                <td>{{liabilitiesChild.account_no ? liabilitiesChild.account_no + ' - ' : ''}}{{capitalize(liabilitiesChild.account_name)}}</td>
                <td v-if="liabilitiesChild.famount !== '0' && liabilitiesChild.account_no !== ''" align="right">
									<router-link v-if="allBranch.allBranch" :to="{ name:'Accounting Report - Detail All Branch', params: {row: {page: 'Balance Sheet', period: liabilitiesChild.period, typePeriod: typePeriod, account_no: liabilitiesChild.account_no, account_name: liabilitiesChild.account_name, store: storeBranch}}}">
                    {{liabilitiesChild.famount}}
                  </router-link>
                  <router-link v-else :to="{ name:'Accounting Report - Detail', params: {row: {page: 'Balance Sheet', period: liabilitiesChild.period, typePeriod: typePeriod, account_no: liabilitiesChild.account_no, account_name: liabilitiesChild.account_name, store: storeBranch}}}">
                    {{liabilitiesChild.famount}}
                  </router-link>
                </td>
                <td v-else align="right">
                  {{liabilitiesChild.famount}}
                </td>
              </tr>
            </template>
            <tr v-if="liabilities.children.length !== 0" class="nested-table-summary-list" :key="parseInt('2'+idx+''+idx)">
              <td>SubTotal {{capitalize(liabilities.name)}}</td>
              <td align="right">{{liabilities.famount}}</td>
            </tr>
          </template>
          <tr class="nested-table-summary-group">
            <td>Total {{dataLiabilities.name}}</td>
            <td align="right">{{dataLiabilities.famount}}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>  
</template>


<script>

import moment from 'moment'
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  name: 'TabelBalance',
  props: ['dataAsset','dataLiabilities','periods','typePeriod', 'storeBranch'],
  mixins: [mixinAccounting],
  
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
    },
    settingValue() {
      return this.$store.state.accountingReport
    },
  },

  watch: {
    settingValue: {
      deep: true,
      immediate: true,
      handler(settingValue) {
        console.log('aaddfff', settingValue)
				this.allBranch = settingValue
      }
    }
  },

  data() {
    return {
			allBranch: {allBranch: false, typeBranch: ''},
      fPeriod: ''
    }
  },

  mounted() {
    this.getPeriod()
  },

  methods: {
    getPeriod(){
      this.fPeriod = moment(this.periods).format('MMM yyyy')
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if(index === 0){
          sums[index] = '';
          return;
        }

        if (index === 1) {
          sums[index] = 'SubTotal';
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] =  this.formatPrice(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }), 0);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    checkIndex(item){
      let children = false
      if(item != null){
        if(item[0] != null){
          if(Object.keys(item[0]).includes('children') === true){
            children = true
          }
        }
      }
      
      return children;
    },
  }
}
</script>
