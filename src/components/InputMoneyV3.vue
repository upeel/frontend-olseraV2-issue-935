<template>
  <div>
    <el-input v-if="!withSelectCurrency"
      v-currency="options"
      ref="elInput"
      :disabled="disabled"
      :value="formattedValue"
      class="input-money"
      :readonly="readOnly"
      @input="handleInput">
      <template v-if="prepend" slot="prepend">{{ prepend }}</template>
      <template v-if="append" slot="append">{{ append }}</template>
    </el-input>
    <el-row v-else>
      <el-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4">
        <el-select :value="currency" class="w-fit" @change="changeCurrency">
          <el-option v-for="(item, currencyIdx) in listCurrency"
            :key="currencyIdx"
            :label="item.currency_id"
            :value="item.currency_id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="16" :sm="20" :md="20" :lg="20" :xl="20">
        <el-input
          style="margin-left: -1px;"
          v-currency="options"
          ref="elInput"
          :disabled="disabled"
          :value="formattedValue"
          :readonly="readOnly"
          @input="handleInput">
          <!-- <el-select :value="currency" slot="prepend" placeholder="Select">
            <el-option v-for="(item, currencyIdx) in listCurrency"
              :key="currencyIdx"
              :label="item.currency_id"
              :value="item.currency_id">
            </el-option>
          </el-select> -->
          <template>
            {{prepend}}
          </template>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { CurrencyDirective, setValue, parseCurrency } from 'vue-currency-input'

export default {
  name: 'InputMoneySelectCurrency',

  directives: {
    currency: CurrencyDirective
  },

  props: {
    listCurrency: {
      type: Array,
      default: null
    },
    currency: {
      type: String,
      default: ''
    },
    value: {
      type: [Number, String],
      default: 0
    },

    prepend: {
      type: String,
      default: ''
    },
    append: {
      type: String,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    },

    readOnly: {
      type: Boolean,
      default: false
    },
    withSelectCurrency: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formattedValue: 0,
      formattedCurrency: ''
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    currencyFormat() {
      const companyDetail = this.$store.getters.selectedStore
      return {
        locale: companyDetail.lang_code,
        currency: companyDetail.currency_id
      }
    },
    options() {
      return {
        locale: this.currencyFormat.locale,
        currency: null,
        valueAsInteger: false,
        distractionFree: {
          hideNegligibleDecimalDigits: true,
          hideCurrencySymbol: false,
          hideGroupingSymbol: false
        },
        precision: 2,
        autoDecimalMode: false,
        allowNegative: true
      }
    }
  },

  watch: {
    value: {
      immediate: false,
      handler(value) {
        // this.formattedValue = value
        // console.log(new Intl.NumberFormat('id', { style: 'currency', currency: 'IDR' }).format(value))
        this.setValue(value)
      }
    },
  },

  mounted() {
    this.setValue(this.value)
    this.setCurrency(this.currency)
  },

  methods: {
    setFocus() {
      const input = this.$refs.elInput.$el.getElementsByTagName('input')[0]
      input.focus()
    },
    setValue(value) {
      setValue(this.$refs.elInput.getInput(), value)
    },
    setCurrency(currency){
      this.formattedCurrency = currency
    },
    handleChange(value) {
      // console.log(parseCurrency(value, this.options))
      this.$emit('change', parseCurrency(value, this.options))
    },
    handleInput(value) {
      // console.log(parseCurrency(value, this.options))
      this.formattedValue = value
      this.$emit('input', parseCurrency(value, this.options))
      this.handleChange(value)
    },
    changeCurrency(value){
      this.formattedCurrency = value
      this.$emit('changeCurrency', value)
    }
  }
}
</script>
