<template>
  <div class="flex-container">
    <template v-if="useCall">
      <!-- <div class="flex-container mr-8 font-bold font-16 text-center">
        {{ dataProfile.tokenMiscall }}
      </div> -->
      <phone-number-input
        v-model="dataProfile.tokenMiscall"
        :no-country-selector="true"
        :disabled="true"
        class="preview-citcal-number"
        @update="getPhone"
      />
      <input-otp ref="inputOtp" :total="4" @complete="checkVerified" />
    </template>
    <template v-else>
      <input-otp ref="inputOtp" :total="6" @complete="checkVerified" />
    </template>
  </div>
</template>

<script>
import InputOtp from '@/components/InputOtp'
export default {
  props: {
    total: {
      type: Number,
      default: 4
    },
    dataProfile: {
      type: Object,
      default: null
    },
    useCall: {
      type: Boolean,
      default: true
    }
  },

  components: {
    InputOtp
  },

  methods: {
    checkVerified(code) {
      this.$emit('complete', code)
    },

    resetValue () {
      this.$refs.inputOtp.reset()
    },

    forceUpdate () {
      this.$forceUpdate()
    }
  }
}
</script>
