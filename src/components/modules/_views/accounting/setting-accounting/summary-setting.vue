<template>
  <el-card class="box-card" shadow="never">
    <div>
      <span class="font-16 color-primary font-bold">{{ $lang[langId].accounting_setting }}</span>              
      <span class="font-16 color-primary font-bold" v-if="initialSet.isStock === 'true'"> & {{ $lang[langId].previous_capital }}</span>
      <el-row :gutter="20" class="mt-10">
        <el-col :span="8">
          <ul class="list-unstyled">
            <li>
              <span style="font-weight: 700">{{ lang.payment_due_date }}</span>
              <p>{{initialSet.due_date ? initialSet.due_date : '0'}} {{lang.days}}</p>
            </li>
          </ul>
        </el-col>
        <el-col :span="8">
          <ul class="list-unstyled">
            <li>
              <span style="font-weight: 700">{{ $lang[langId].first_stock_as_modal }}</span>
              <p>{{initialSet.isStock === 'true' ? $lang[langId].yes : $lang[langId].no}}</p>
            </li>
          </ul>
        </el-col>
        <el-col :span="8">
          <ul class="list-unstyled" v-if="initialSet.isStock === 'true'">
            <li>
              <span style="font-weight: 700">{{ lang.start_date }}</span>
							<el-date-picker size="mini"
								@change="changeDate"
								v-model="startDate"
								type="date"
								:placeholder="$lang[langId].pick_a_day"
								format="dd MMMM yyyy"
								value-format="yyyy-MM-dd"
								style="width: 100%">
							</el-date-picker>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
    <hr class="m-null">
    <!-- <span class="font-16 color-primary font-bold">Modal Awal</span> -->
    <el-table
			v-loading="loadingStock"
      :data="allSetup">
      <el-table-column
        prop="fdate"
        :label="lang.date"
        width="110">
      </el-table-column>
      <el-table-column
        prop="account_no"
        :label="$lang[langId].account_number"
        width="140">
      </el-table-column>
      <el-table-column
        prop="account_name"
        :label="$lang[langId].account_name"
        width="180">
        <template slot-scope="scope">
          <span class="word-break">{{capitalize(scope.row.account_name)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        :label="lang.description">
        <template slot-scope="scope">
          <span class="word-break">{{capitalize(scope.row.description)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="famount"
        :label="lang.amount"
        sortable
        align="right"
        width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 'Debit'">{{ scope.row.famount }}</div>
          <div v-else style="color: #F44336;">{{ scope.row.famount }}</div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';
import mixinAccounting from '@/mixins/mixinAccounting';
var moment = require('moment')

export default {
  name: 'summarySetup',
  mixins: [basicComputedMixin, mixinAccounting],
  props:{
		loadingStock: {type: Boolean, default: false},
		startDate: {type: String, default: moment().startOf('month').format('YYYY-MM-DD')},
    allSetup: {type: Array, default: null},
    initialSet: {type: Object, default: null}
  },

  watch: {},

  computed: {
    
  },

	data(){
		return{
			
		}
	},

  methods: {
		changeDate(val){
			this.$emit('changeDate', val)
		},

    handleNext(){
      this.$emit('doneSetting')
    },
  }

}

</script>
