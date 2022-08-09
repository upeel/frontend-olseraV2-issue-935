<template>
  <div>
    <div
      v-if="operasional"
      class="table-responsive">
      <table class="acounting-nested-table" style="width: 100%;">
        <tbody>
          <!-- DATA LABA KOTOR -->
          <tr class="nested-table-name-row">
            <th class="name" colspan="3">{{operasional.name}}</th>
          </tr>
          <tr v-if="operasional.laba_kotor" class="nested-table-group-name">
            <th class="name" colspan="3">{{operasional.laba_kotor['name']}}</th>
          </tr>
          <template v-if="operasional.laba_kotor">
            <template v-for="(grossNet, idx) in operasional.laba_kotor.children">
              <tr class="nested-table-data-list" :key="parseInt('1'+idx)">
                <td>{{capitalize(grossNet.name)}}</td>
                <td align="right" v-if="grossNet.children.length === 0">0</td>
                <td align="right" v-else></td>
              </tr>
              <template v-for="(grossNetChild, idxChild) in grossNet.children">
                <tr class="nested-table-subdata-list" :key="parseInt('1'+idx+''+idxChild)">
                  <td>{{grossNetChild.account_no ? grossNetChild.account_no + ' - ' : ''}}{{capitalize(grossNetChild.account_name)}}</td>
                  <td align="right" v-if="grossNetChild.famount !== '0' && grossNetChild.account_no !== ''">
                    <router-link v-if="allBranch.allBranch" :to="{ name:'Accounting Report - Detail All Branch', params: {row: {page: 'Income Statement', period: grossNetChild.period, typePeriod: typePeriod, account_no: grossNetChild.account_no, account_name: grossNetChild.account_name, store: storeBranch}}}">
                      {{grossNetChild.famount}}
                    </router-link>
                    <router-link v-else :to="{ name:'Accounting Report - Detail', params: {row: {page: 'Income Statement', period: grossNetChild.period, typePeriod: typePeriod, account_no: grossNetChild.account_no, account_name: grossNetChild.account_name, store: storeBranch}}}">
                      {{grossNetChild.famount}}
                    </router-link>
                  </td>
                  <td v-else align="right">
                    {{grossNetChild.famount}}
                  </td>
                </tr>
              </template>
              <tr v-if="grossNet.children.length !== '0'" class="nested-table-summary-list" :key="parseInt('1'+idx+'000')">
                <td>SubTotal {{capitalize(grossNet.name)}}</td>
                <td align="right">{{grossNet.famount}}</td>
              </tr>
            </template>
          </template>
          <tr v-if="operasional.laba_kotor" class="nested-table-summary-group">
            <td>Total {{operasional.laba_kotor.name}}</td>
            <td align="right">{{operasional.laba_kotor.famount}}</td>
          </tr>

          <!-- DATA BIAYA OPERASIONAL -->
          <tr v-if="operasional.biaya_operasional" class="nested-table-group-name" style="border-top: 2px solid black">
            <th class="name" colspan="3">{{operasional.biaya_operasional.name}}</th>
          </tr>
          <template
            v-if="operasional.biaya_operasional">
            <template v-for="(cost, idxCost) in operasional.biaya_operasional.children">
              <tr class="nested-table-subdata-list" :key="idxCost">
                <td>{{cost.account_no ? cost.account_no + ' - ' : ''}}{{capitalize(cost.account_name)}}</td>
                <td align="right" v-if="cost.famount !== '0' && cost.account_no !== ''">
                  <router-link v-if="allBranch.allBranch" :to="{ name:'Accounting Report - Detail All Branch', params: {row: {page: 'Income Statement', period: cost.period, typePeriod: typePeriod, account_no: cost.account_no, account_name: cost.account_name}}}">
                    {{cost.famount}}
                  </router-link>
                  <router-link v-else :to="{ name:'Accounting Report - Detail', params: {row: {page: 'Income Statement', period: cost.period, typePeriod: typePeriod, account_no: cost.account_no, account_name: cost.account_name, store: storeBranch}}}">
                    {{cost.famount}}
                  </router-link>
                </td>
                <td v-else align="right">
                  {{cost.famount}}
                </td>
              </tr>
            </template>
          </template>
          <tr v-if="operasional.biaya_operasional" class="nested-table-summary-group">
            <td>Total {{operasional.biaya_operasional.name}}</td>
            <td align="right">{{operasional.biaya_operasional.famount}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="nonOperasional"
      class="table-responsive" style="margin-top: 24px">
      <table class="acounting-nested-table" style="width: 100%;">
        <tbody>
          <tr class="nested-table-name-row">
            <th class="name" colspan="3">{{nonOperasional.name}}</th>
          </tr>
          <template v-for="(child, idx) in nonOperasional.children">
            <tr class="nested-table-data-list" :key="parseInt('2'+idx)">
              <td>{{capitalize(child.name)}}</td>
              <td align="right" v-if="child.children.length === 0">0</td>
              <td align="right" v-else></td>
            </tr>
            <template v-for="(subChild, idxChild) in child.children">
              <tr class="nested-table-subdata-list" :key="parseInt('2'+idx+''+idxChild)">
                <td>{{subChild.account_no ? subChild.account_no + ' - ' : ''}}{{capitalize(subChild.account_name)}}</td>
                <td v-if="subChild.famount !== '0' && subChild.account_no !== ''" align="right">
									<router-link v-if="allBranch.allBranch" :to="{ name:'Accounting Report - Detail All Branch', params: {row: {page: 'Income Statement', period: subChild.period, typePeriod: typePeriod, account_no: subChild.account_no, account_name: subChild.account_name}}}">
										{{subChild.famount}}
									</router-link>
                  <router-link v-else :to="{ name:'Accounting Report - Detail', params: {row: {page: 'Income Statement', period: subChild.period, typePeriod: typePeriod, account_no: subChild.account_no, account_name: subChild.account_name, store: storeBranch}}}">
                    {{subChild.famount}}
                  </router-link>
                </td>
                <td v-else align="right">
                  {{subChild.famount}}
                </td>
              </tr>
            </template>
            <tr v-if="child.children.length !== '0'" class="nested-table-summary-list" :key="parseInt('2'+idx+'000')">
              <td>SubTotal {{capitalize(child.name)}}</td>
              <td align="right">{{child.famount}}</td>
            </tr>
          </template>
          <tr class="nested-table-summary-group">
            <td>{{nonOperasional.name}}</td>
            <td align="right">{{nonOperasional.famount}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="labaBersih"
      class="table-responsive" style="margin-top: 24px">
      <table class="acounting-nested-table" style="width: 100%;">
        <tbody>
          <tr class="nested-table-name-row">
            <th class="name" colspan="3">{{labaBersih.name}}</th>
          </tr>
          <tr class="nested-table-summary-group">
            <td>{{labaBersih.name}}</td>
            <td align="right">{{labaBersih.famount}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>  
</template>


<script>

import moment from 'moment'
import table from '../balance-sheet/table.vue'
import mixinAccounting from '@/mixins/mixinAccounting';

export default {
  components: { table },
  name: 'TabelGainLost',
  // props: ['operasional','nonOperasional','dataOperasional','dataNonOperasional','dataLaba','periods','typePeriod'],
  props: ['operasional', 'nonOperasional', 'labaBersih','typePeriod', 'storeBranch'],
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
