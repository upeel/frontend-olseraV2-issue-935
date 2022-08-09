<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="offscreen-right-sidebar px-null">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header color-white--bg" style="z-index: 10">
          Shift
          <close-esc :hideEsc="true" @close="$emit('cancel')" />
        </div>

        <div v-if="!dataShift.length" v-loading="loadingAddon"
          class="no-data-wrapper p-32 align-center" style="display: flex; flex-direction: column;">
          <img src="/static/img/no_data_addon_product.svg" class="no-data-image">
          <div class="text-center word-break" style="width: 360px" >Duh, Shift belum tersedia, silahkan buat shift terlebih dahulu</div>
        </div>

        <div v-else class="p-24 text-left">
          <div>
            <span>Pilih shift berlaku untuk hari <span class="font-bold">{{ dayData.day_name }}</span></span>

            <div class="like-table-wrapper mt-16 text-left">
              <div v-for="item in dataAdvanceShift" :key="item.id" class="like-table-wrapper--item">
                <div class="flex-container full-width">
                  <div class="full-width">{{ item.name }}</div>
                  <div style="width: 35%">
                    {{ item.start_time }} - {{ item.end_time}}
                  </div>
                  <div class="pointer ml-4 ">
                    <el-checkbox v-model="item.checked" @change="handleCheck(item)"></el-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="color-info--bg radius-10 p-8 mt-16 flex-container justify-center" >
            <div class="container-icon">
              <svg-icon icon-class="information-circle" class="color-info" />
            </div>
            <div class="word-break ml-4">
              Jika jam absen pegawai berada di luar spesifik shift yang ditentukan, sistem akan otomatis menggunakan shift lain yang sesuai dengan jam absen
            </div>
          </div>
        </div>
        

        <div class="offscreen-right-sidebar--footer">
          
          <el-button
            type="success"
            class="btn-block mt-24"
            @click="saveShift">
            {{ rootLang.save }}
          </el-button>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'

export default {
  components: {
    CloseEsc
  },
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataShift: {
      type: Array,
      default: []
    },
    dayData: {
      type: Object,
      default: null
    },
    dataChecked: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      loadingAddon: false,
      // dataChecked: []
    }
  },

  watch: {
    // formEdit(formEdit) {
    //   console.log('tracert', formEdit)
    //   if (formEdit) {
    //     this.formData = { ...formEdit }
    //     console.log(this.formData)
    //   }
    // }
  },

  computed: {
    dataAdvanceShift () {
      return this.dataShift.map(i => {
        i.checked = false
        if (this.dataChecked.length > 0) {
          this.dataChecked.map(j => {
            if (i.id === j.shift_id) {
              i.checked = true
            }
          })
        }
        // if (this.dayData.shift.length) {
        //   this.dayData.shift.map(j => {
        //     if (i.id === j.shift_id) {
        //       i.checked = true
        //       this.handleCheck(i)
        //     }
        //   })
        // }
        return i
      })
    }
  },

  mounted () {
    // if (this.formEdit.addon_items.length) {
    //   this.getCheckedAddon()
    // }
  },

  methods: {
    handleCheck (item) {
      const exist = this.dataChecked.some(({shift_id}) => shift_id === item.id)
      console.log('aaa', exist)
      if (exist) {
        this.dataChecked.map((i, idx) => {
          if (i.shift_id === item.id) {
            this.dataChecked.splice(idx, 1)
          }
        })
      } else {
        this.dataChecked.push({
          shift_id: item.id,
          name: item.name,
          end_time: item.end_time,
          start_time: item.start_time
        })
      }
    },

    saveShift () {
      let day = { ...this.dayData}
      if (this.dataChecked.length) {
        day.shift = this.dataChecked
      } else {
        day.shift = []
      }
      this.$emit('save', day)
    }
  }
}
</script>
