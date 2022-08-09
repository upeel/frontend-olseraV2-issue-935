<template>
  <div
    v-if="selectedStore.is_store_can_upgrade_trial === 1 && selectedStore.plan_type_id !== 'L'"
    :style="{
      background: 'transparent linear-gradient(180deg, '+ selectedPlan.color_grad +' 0%, '+ selectedPlan.color_grad_2 +' 100%) 0% 0% no-repeat padding-box'
    }"
    class="flex-container radius-10 mb-24 py-8 px-16">
    <div class="mr-16" style="flex-shrink: 0;">
      <img
        :src="'/static/img/store-types/icon-plan-'+ selectedStore.plan_type_id +'.png'"
        width="32">
    </div>
    <div class="p-8 font-14">
      Anda sekarang dalam masa percobaan yang aktif maksimal 14 hari. Coba paket Basic/Premium yang sesuai dengan kebutuhan Anda dengan cara klik <strong class="pointer" @click="showUpgrade">"coba gratis"</strong>. Setelah 14 hari, paket Anda akan menjadi lite dan dapat terus digunakan dengan pembatasan fitur.
      Upgrade paket Anda segera untuk operasional lebih praktis dan penjualan lebih meningkat.
      <!-- Anda sekarang dalam masa percobaan plan ver <span class="font-bold">{{ selectedStore.plan_type_name }}</span> yang akan aktif untuk <span class="font-bold">14 hari</span> ke depan. Pada saat lewat dari masa ini, plan Anda akan menjadi ver <span class="font-bold">Lite</span>, dan Anda dapat terus menggunakannya dengan pembatasan fitur. Upgrade ke Premium segera untuk operasional lebih praktis dan penjualan lebih meningkat. -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedStore: {
      type: Object,
      default: () => {}
    },
    selectedPlan: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    showUpgrade() {
      this.$emit('show-upgrade')
    }
  }
}
</script>
