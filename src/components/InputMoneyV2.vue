<template>
  <el-input
    v-currency="options"
    ref="elInput"
    :disabled="disabled"
    :value="formattedValue"
    class="input-money"
    :readonly="readOnly"
    @input="handleInput">
    <template v-if="prepend" slot="prepend">{{ prepend }}</template>
    <template v-if="append" slot="append">{{ append }}</template>
    <template v-if="withPercentage" slot="append">
      <el-radio-group v-model="isPercentage" class="flex-container" @change="handleChangePercentage">
        <el-radio-button class="lpoint-type" :label="0">
          IDR
        </el-radio-button>
        <el-radio-button class="lpoint-type" :label="1">
          %
        </el-radio-button>
      </el-radio-group>
    </template>
  </el-input>
</template>

<script>
import { CurrencyDirective, setValue, parseCurrency } from 'vue-currency-input'

export default {
  name: 'InputMoney',

  directives: {
    currency: CurrencyDirective
  },

  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prepend: {
      type: String,
      default: ''
    },
    append: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 2000000000
    },
    hideCurrency: {
      type: Boolean,
      default: false
    },
    withPercentage: {
      type: Boolean,
      default: false
    },
    isPercentage: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      formattedValue: 0
    }
  },

  computed: {
    currencyFormat() {
      const companyDetail = this.$store.getters.selectedStore
      let curr = this.hideCurrency ? null : companyDetail.currency_id
      return {
        locale: companyDetail.lang_code,
        // currency: companyDetail.currency_id
        currency: curr
      }
    },
    options() {
      return {
        locale: this.currencyFormat.locale,
        currency: this.currencyFormat.currency,
        valueAsInteger: false,
        distractionFree: {
          hideNegligibleDecimalDigits: true,
          hideCurrencySymbol: false,
          hideGroupingSymbol: false
        },
        precision: 2,
        valueRange: {min:this.minValue, max:this.maxValue},
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
    }
  },

  mounted() {
    this.setValue(this.value)
  },

  methods: {
    setFocus() {
      const input = this.$refs.elInput.$el.getElementsByTagName('input')[0]
      input.focus()
    },
    setValue(value) {
      setValue(this.$refs.elInput.getInput(), value)
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

    handleChangePercentage (data) {
      this.$emit('changepercent', data)
    }
  }
}
</script>
