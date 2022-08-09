<template>
<div class="color-white--bg">
  <template v-if="storeHasGrab === 0">
    <perfect-scrollbar style="max-height: 500px">
      <div class="flex-container flex-container--start p-24">
        <div class="full-width pr-24">
          <div class="font-24" style="z-index: 1000; float: right;margin-top: 25px;margin-right: -15px;">
            <svg-icon icon-class="status"/>
          </div>
          <div class="font-20 mb-16">Detail outlet</div>
          <div class="border border--grey border--with-shadow">
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                {{ rootLang.outlet_name }}
              </div>
              <div class="full-width text-right" style="margin-right: -10px">
                {{ formEdit.store_name }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                {{ rootLang.owner_name }}
              </div>
              <div class="full-width text-right">
                {{ selectedStore.owner.name }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container flex-container--start">
              <div style="width: 40%">
                {{ lang.email }}
              </div>
              <div class="full-width text-right" style="max-width: 300px">
                {{ formEdit.email }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                Nomor HP outlet
              </div>
              <div class="full-width text-right">
                {{ formEdit.owner_phone_number }}
              </div>
            </div>
          </div>

          <div class="font-24" style="z-index: 1000; float: right;margin-top: 35px;margin-right: -15px;">
            <svg-icon icon-class="status"/>
          </div>
          <div class="font-20 mb-16 mt-16">Alamat outlet</div>
          <div class="border border--grey border--with-shadow">
            <div class="like-table-wrapper--item flex-container flex-container--start">
              <div style="width: 40%">
                {{ lang.address }}
              </div>
              <div class="full-width text-right " style="margin-right: -10px">
                {{ formEdit.address }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                {{ lang.province }}
              </div>
              <div class="full-width text-right overflow-ellipsis" style="max-width: 200px">
                {{ formEdit.state_name }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                {{ lang.city }}
              </div>
              <div class="full-width text-right overflow-ellipsis" style="max-width: 200px">
                {{ formEdit.city_name }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                {{ lang.subdistrict }}
              </div>
              <div class="full-width text-right overflow-ellipsis" style="max-width: 200px">
                {{ formEdit.subdistrict_name }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                Kelurahan
              </div>
              <div class="full-width text-right overflow-ellipsis" style="max-width: 200px">
                {{ formEdit.village }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                RT
              </div>
              <div class="full-width text-right overflow-ellipsis" style="max-width: 200px">
                {{ formEdit.owner_rt_number }}
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">
                RW
              </div>
              <div class="full-width text-right overflow-ellipsis" style="max-width: 200px">
                {{ formEdit.owner_rw_number }}
              </div>
            </div>
          </div>
        </div>

        <div class="full-width pl-24">
          <div class="font-24" style="z-index: 1000; float: right;margin-top: 25px;margin-right: -15px;">
            <svg-icon icon-class="status"/>
          </div>
          <div class="font-20 mb-16">Jam Buka Outlet</div>
          <div class="border border--grey border--with-shadow">
            <template v-for="item in formEdit.periods">
            <div v-if="item.type === 1" :key="item.day" class="like-table-wrapper--item flex-container">
              <div class="full-width">
                {{ rootLang['label_day_' + (item.day)] }}
              </div>
              <div class="full-width text-right">
                {{ getLabelDayTime(item) }}
              </div>
            </div>
            </template>
          </div>

          <div class="font-24" style="z-index: 1000; float: right;margin-top: 35px;margin-right: -15px;">
            <svg-icon icon-class="status"/>
          </div>
          <div class="font-20 mb-16 mt-16">Dokumen yang dibutuhkan</div>
          <div class="border border--grey border--with-shadow">
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Foto KTP </div>
              <div style="margin-right: -10px">
                <img
                  :src="formEdit.documents.thumbnail_ktp" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Foto selfie pegang KTP</div>
              <div class="">
                <img
                  :src="formEdit.documents.thumbnail_selfie_with_ktp" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Foto outlet tampak depan</div>
              <div class="">
                <img
                  :src="formEdit.documents.thumbnail_front_look_store" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Foto outlet tampak dalam</div>
              <div class="">
                <img
                  :src="formEdit.documents.thumbnail_look_inside_store" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Foto buku rekening</div>
              <div class="">
                <img
                  :src="formEdit.documents.thumbnail_sampul_tabungan" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Foto Logo</div>
              <div class="">
                <img
                  :src="formEdit.documents.thumbnail_logo" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Daftar Menu</div>
              <div class="">
                <img
                  :src="formEdit.documents.thumbnail_menu_1" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
            <div class="like-table-wrapper--item flex-container">
              <div class="full-width">Daftar Produk</div>
              <div class="">
                <img
                  :src="formEdit.documents.thumbnail_signature_product" alt=""
                  class="img-document-grabfood--summary"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
    <div class="p-24 ">
      <el-button
        :disabled="disableNext"
        type="success"
        class="btn-block color-grabfood--bg color-white"
        @click="submit">
        {{ rootLang.next }} →
      </el-button>
    </div>
  </template>
  <template v-else>
    <div class="px-24">
      <div class="border border--grey border--with-shadow">
        <div class="like-table-wrapper--item flex-container">
          <div class="full-width">
            {{ rootLang.outlet_name }}
          </div>
          <div class="full-width text-right">
            {{ selectedStore.name }}
          </div>
        </div>
        <div class="like-table-wrapper--item flex-container">
          <div class="full-width">
            {{ rootLang.owner_name }}
          </div>
          <div class="full-width text-right">
            {{ selectedStore.owner.name }}
          </div>
        </div>
        <div class="like-table-wrapper--item flex-container">
          <div class="full-width">
            Nama merchant di GrabFood
          </div>
          <div class="full-width text-right">
            {{ formGrab.grabName }}
          </div>
        </div>
        <div class="like-table-wrapper--item flex-container">
          <div class="full-width">Screenshot profil</div>
          <div class="">
            <img
              :src="formGrab.documents.thumbnail_merc_acc_app_capture" alt=""
              class="img-document-grabfood--summary"
            >
          </div>
        </div>
      </div>
      <div class="mb-24">
        <el-button
          class="mt-24 btn-block color-grabfood--bg color-white"
          @click="submit">
          {{ rootLang.next }} →
        </el-button>
      </div>
    </div>
  </template>
</div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'FormSummary',
  mixins: [basicComputedMixin],

  props: {
    formEdit: {
      type: Object,
      default: {}
    },
    formGrab: {
      type: Object,
      default: {}
    },
    storeHasGrab: {
      type: Number,
      default: 0
    }
  },

  methods: {
    getLabelDayTime(itemKey) {
      if (itemKey.days !== null && itemKey.days.length >= 1) {
        console.log('kl', itemKey.fday)
        if (itemKey.days.length > 1) {
          return itemKey.days[0].start_time + ' ••• ' + itemKey.days[itemKey.days.length - 1].end_time
        } else if (itemKey.days.length === 1) {
          return itemKey.days[0].start_time + ' - ' + itemKey.days[0].end_time
        } else if (itemKey.days.length === 0) {
          return 0
        }
      }
    },

    submit () {
      this.$emit('submit')
    }
  }

}
</script>