<template>
  <div
    :class="disabled ? 'is-disabled' : ''"
    class="el-input el-input--medium el-input-group el-input-group--append">
    <money
      ref="inputMoney"
      v-model="localAmount"
      v-bind="config"
      :disabled="disabled"
      class="el-input__inner"
      @input="$emit('update:amount', localAmount),$emit('currency')"
      @change="handleCurr"
      @click.native="handleFocus"
      :focusable="false"
    />
    <div v-if="append" class="el-input-group__append">
      {{ append }}
    </div>
    <div v-if="prepend" class="el-input-group__prepend">
      {{ prepend }}
    </div>
  </div>
</template>

<script>
// import { Money } from 'v-money'
export default {
  name: 'InputMoney',

  // components: {
  //   Money
  // },

  props: {
    amount: {
      default: 0,
      type: [Number, String]
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
    }
  },

  data() {
    return {
      localAmount: 0
    }
  },

  computed: {
    currId() {
      return this.$store.getters.selectedStore.currency_id
    },

    config() {
      let precision = 0
      let decimal = ','
      let thousands = '.'
      if (this.currId !== 'Rp') {
        precision = 2
        decimal = '.'
        thousands = ','
      }
      return {
        decimal,
        thousands,
        prefix: this.currId + ' ',
        suffix: '',
        precision,
        masked: false
      }
    }
  },

  watch: {
    amount: {
      handler(data) {
        this.localAmount = parseFloat(data)
        if (!data) {
          this.handleFocus()
        }
      },
      immediate: true
    }
  },

  methods: {
    setCaretPosition(ctrl, pos) {
      if (ctrl.setSelectionRange) {
        ctrl.focus()
        ctrl.setSelectionRange(pos, pos)
      } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
      }
    },

    handleFocus($event) {
      if (this.$refs.inputMoney && this.$refs.inputMoney.$el) {
        const inputValue = this.$refs.inputMoney.$el.value
        if (this.$refs.inputMoney && this.$refs.inputMoney.$el && this.currId !== 'Rp' && inputValue) {
          this.setCaretPosition(this.$refs.inputMoney.$el, inputValue.length - 3)
        }
      }
    },

    handleCurr() {
      this.$emit('currency')
    }
  }
}
</script>
