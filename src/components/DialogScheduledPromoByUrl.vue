<template>
  <el-dialog
    v-if="data"
    :visible.sync="show" 
    width="400px" 
    class="dialog-scheduled-promo"
  >
    <div class="custom-header">
      <img :src="data.header" alt="olsera-club" />
    </div>
    <div class="custom-content">
      <div v-html="data.content" />
    </div>
    <!-- divider -->
    <div style="padding: 0 16px;">
      <hr style="margin: 0;" />
    </div>
    <div class="custom-footer">
      <el-button type="success" class="btn-block" @click="openOlseraCp">
        Pelajari Lebih Lanjut
      </el-button>
      <el-button class="btn-block" @click="remindLaterHandler">
        Ingatkan Saya Nanti
      </el-button>
      <div class="mt-16 text-center">
        <el-checkbox v-model="isNeverShowup" class="color-grey--placeholder">
          Jangan tampilkan lagi
        </el-checkbox>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { olseraClubOne, olseraClubTwo } from "@/data/popUpPromoByUrlIds"
import moment from "moment"
import { setPopUp } from "@/api/generalsetting";

export default {
  data() {
    return {
      data: null,
      show: false,
      isNeverShowup: false,
    };
  },

  props: {
    dataProfile: {
      type: Object,
      default: () => { }
    }
  },

  computed: {
    today() {
      return moment().format("DD-MM-YYYY");
    },
    
  },

  watch: {
    show: function (value) {
      if (!value) {
        if (this.isNeverShowup) {
          setPopUp({ notification_promotion_id: 2 }).catch(error => {
            this.$notify({
              type: "warning",
              title: error.response.data.error.message,
              message: error.response.data.error.error
            });
          });
        }
      }
    },

    '$store.getters.selectedStore': {
      handler(payload) {
        let popupInitDay = localStorage.getItem('olsbo_club_init_day')
        if (popupInitDay && popupInitDay === this.today) return
        this.initPopup(payload.url_id)
      },
      immediate: true
    }
  },

  methods: {
    initPopup(payload) {      
      const isOlseraClubOne = olseraClubOne.urlId.includes(payload)
      const isOlseraClubTwo = olseraClubTwo.urlId.includes(payload)
      if (isOlseraClubOne) {
        setTimeout(() => {
          this.data = olseraClubOne
          this.show = true
        }, 5000)
      } else if (isOlseraClubTwo) {
        setTimeout(() => {
          this.data = olseraClubTwo
          this.show = true
        }, 5000)
      } else {
        this.data = null
        this.show = false
      }
    },

    openOlseraCp() {
      window.open("https://bit.ly/OlseraClub");
    },

    remindLaterHandler(){
      localStorage.setItem('olsbo_club_init_day', this.today)
      this.show = false
    },
  },

}
</script>
