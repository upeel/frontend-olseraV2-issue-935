<template>
  <el-dialog 
    :visible.sync="show" 
    width="400px" 
    class="dialog-scheduled-promo"
  >
    <div v-if="scheduledPromoData">
      <div v-if="scheduledPromoData.custom_header" class="custom-header">
        <div v-html="scheduledPromoData.custom_header" />
      </div>
      <div v-else class="news-header">
        <img src="/static/img/addwhatsnew/header.png" alt="default-news" />
      </div>
      <div class="custom-content">
        <div v-html="scheduledPromoData.content" />
      </div>
      <!-- divider -->
      <div style="padding: 0 16px;">
        <hr style="margin: 0;" />
      </div>
      <div class="custom-footer">
        <div
          v-if="scheduledPromoData.show_olsera_cp"
          class="text-center mb-16"
        >
          Hubungi
          <span class="color-primary font-bold pointer" @click="openOlseraCp">
            Tim Marketing Olsera
          </span>
          atau
          <div class="color-primary font-bold">+62 811-7787-870</div>
        </div>
        <el-button
          v-if="scheduledPromoData.slug"
          type="success"
          class="btn-block"
          @click="openPage"
        >
          Pelajari Lebih Lanjut
        </el-button>
        <el-button 
          class="btn-block" 
          @click="show = false"
        >
          Ingatkan Saya Nanti
        </el-button
        >
        <div class="mt-16 text-center">
          <el-checkbox 
            v-model="isNotReminding" 
            class="color-grey--placeholder"
          >
            Jangan tampilkan lagi
          </el-checkbox>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import data from "/static/scheduled-promo/data.json";
import { setPopUp } from "@/api/generalsetting";
import moment from "moment"

export default {
  data() {
    return {
      show: false,
      scheduledPromoData: null,
      isNotReminding: false
    };
  },

  props: {
    dataProfile: {
      type: Object,
      default: {}
    }
  },

  watch: {
    show: function(value) {
      if (!value) {
        if (this.isNotReminding) {
          setPopUp({ notification_promotion_id: 1 }).catch(error => {
            this.$notify({
              type: "warning",
              title: error.response.data.error.message,
              message: error.response.data.error.error
            });
          });
          localStorage.removeItem("olsbo_day_promoscheduled_reminder_wave");
        } else {
          localStorage.setItem(
            "olsbo_day_promoscheduled_reminder_wave",
            this.nextWave()
          );
        }
      }
    }
  },

  computed: {
    today() {
      return moment().format("d");
    },
    thisMonth() {
      return moment().format("M");
    }
  },

  mounted() {
    // demo trigger purpose
    // localStorage.setItem('olsbo_day_promoscheduled_published', 7)
    setInterval(() => {
      this.getScheduledPromo();
      this.handlePopup();
    }, 5000);
  },

  methods: {
    nextWave() {
      return moment()
        .add(45, "minutes")
        .format("HH:mm");
    },

    getScheduledPromo() {
      let result;
      const selectedByDay = data[this.today];
      if (selectedByDay && selectedByDay.length > 0) {
        const filterByMonth = selectedByDay.filter(e =>
          e.months.includes(parseInt(this.thisMonth))
        );
        result = filterByMonth.filter(e =>
          moment().isBetween(moment(e.time, "HH:mm"), moment(e.end, "HH:mm"))
        );
        if (result.length > 0) {
          this.scheduledPromoData = result[0];
        } else {
          this.scheduledPromoData = null;
        }
      } else {
        this.scheduledPromoData = null;
      }
    },

    handlePopup() {
      // demo trigger purpose
      // if (this.scheduledPromoData !== null && this.dataProfile.user_notification[0].is_user_accept === 1) {
      if (
        this.scheduledPromoData !== null &&
        this.dataProfile.user_notification[0].is_user_accept === 0
      ) {
        const storageKeyPromo = localStorage.getItem(
          "olsbo_day_promoscheduled_published"
        );
        const storageKeyPromoReminder = localStorage.getItem(
          "olsbo_day_promoscheduled_reminder_wave"
        );
        if (
          !storageKeyPromo ||
          (storageKeyPromo && storageKeyPromo !== this.today) ||
          (storageKeyPromo &&
            storageKeyPromo === this.today &&
            (storageKeyPromoReminder &&
              moment().isAfter(moment(storageKeyPromoReminder, "HH:mm"))))
        ) {
          this.show = true;
          localStorage.setItem(
            "olsbo_day_promoscheduled_published",
            this.today
          );
        }
      }
    },

    openOlseraCp() {
      window.open("https://bit.ly/OlseraNabila");
    },

    openPage() {
      this.show = false;
      this.$router.push({
        path: "/whatsnew",
        query: {
          slug: this.scheduledPromoData.slug
        }
      });
    }
  }
};
</script>
