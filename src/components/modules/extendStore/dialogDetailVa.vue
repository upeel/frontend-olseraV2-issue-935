<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left color-white--bg" style="z-index: 10">
          <span class="px-16">Transfer Virtual Account</span>
          <close-esc :hideEsc="true" @close="handleClose" />
        </div>
      </div>

      <div class="p-24">
        <div class="flex-container">
          <div class="font-18 full-width">Bayar ke</div>
          <div>BCA</div>
        </div>

        <div class="flex-container mt-24">
          <div class="font-18 full-width font-bold">988 664 534 273 6050</div>
          <div class="container-icon pointer" slot="append" @click="copyText('access_id')">
            <svg-icon icon-class="feather-copy" stroke="#67C23A"></svg-icon>
          </div>
        </div>

        <div class="flex-container mt-24 color-warning--soft--bg p-8">
          <div class="container-icon">
            <svg-icon icon-class="clock-grey" class="font-20" />
          </div>
          <div class="font-18 full-width font-bold">
            <span class="font-12">Finish payment before</span>
            <div class="font-18">14 May 2020</div>
          </div>
          <div class="font-bold font-24 full-width text-right">
            24h 59m
          </div>
        </div>

        <div class="mt-24">
          <div v-for="(list, idx) in dataInstruction" :key="idx" class="">
            <div class="flex-container pointer mb-16" @click="handleShowDetail(idx)">
              <div class="full-width">{{ list.title }}</div>
              <div>
                <i :class="showDetail[idx] ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" />
              </div>
            </div>
            <div v-if="showDetail[idx]" class="mt-24 mb-16 border border--grey border--with-shadow p-12">
              <div v-for="(item, index) in list.content" :key="index" class="p-5">
                {{ index + 1 }}. {{ item }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
export default {
  mixins: [basicComputedMixin],

  components: {
    CloseEsc
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      showDetail: []
    }
  },

  watch: {
    // data: {
    //   handler(value) {
        
    //   },
    // },
  },

  computed: {
    dataInstruction () {
      let instructions = []
      if (this.data.payment_mode.data_va && this.data.payment_mode.data_va.length) {
        instructions = this.data.payment_mode.data_va[0].instructions
        instructions.map(i => {
          i.showDetail = true
        })
      }
      return instructions
    }
  },

  methods: {
    setDataShowDetail (data) {
      if (data && data.payment_mode.data_va && data.payment_mode.data_va.length) {
        data.payment_mode.data_va.map(i => {
          this.showDetail.push(true)
        })
      }
    },

    handleShowDetail (index) {
      console.log(this.showDetail[index])
      this.showDetail[index] = !this.showDetail[index]
      this.$forceUpdate()
    },

    handleClose () {
      this.showDetail = []
      this.$emit('hide')
    }
  }
}
</script>