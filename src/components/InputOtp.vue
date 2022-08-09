<template>
  <div class="flex-container full-width">
    <input
      v-for="i in total"
      :ref="'inputOTP' + (i - 1)"
      :key="i"
      v-model="values[i - 1]"
      :min="0"
      :max="1"
      :maxlength="1"
      class="input-otp-field input-otp-field--inner"
      style="flex-grow: 1"
      @input="handleInput(i - 1)"
      @keyup="handleKeyboard(i - 1, $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 6
    }
  },

  data() {
    return {
      values: []
    }
  },

  computed: {
    computedCode() {
      return this.values.join('')
    }
  },

  watch: {
    values: {
      deep: true,
      handler(values) {
        if (this.computedCode && this.computedCode.length === this.total) {
          this.$emit('complete', this.computedCode)
        }
      }
    }
  },

  methods: {
    handleInput(i) {
      if (this.values[i] && i !== (this.total - 1)) {
        this.$refs['inputOTP' + (i + 1)][0].focus()
        this.$refs['inputOTP' + (i + 1)][0].select()
      } else if (i === 0) {
        this.$refs['inputOTP0'][0].select()
      }
    },

    reset() {
      this.values = []
    },

    handleKeyboard(i, keyboard) {
      if (keyboard.keyCode === 8 || keyboard.keyCode === 37) {
        if (i) {
          this.$refs['inputOTP' + (i - 1)][0].focus()
          this.$refs['inputOTP' + (i - 1)][0].select()
        }
      } else if (keyboard.keyCode === 39) {
        if (i < (this.total - 1)) {
          this.$refs['inputOTP' + (i + 1)][0].focus()
          this.$refs['inputOTP' + (i + 1)][0].select()
        }
      }
    }
  }
}
</script>
