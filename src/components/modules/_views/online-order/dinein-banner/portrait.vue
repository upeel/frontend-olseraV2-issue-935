<template>
  <div style="display: none;">
    <div id="print-portrait" class="w-1748 h-2480 body-portrait">
      <image-top :table-number="tableNumber" :potrait="true" />
      <div class="font-108 font-bold mb-section word-break" style="max-width: 1200px">
        Scan barcode untuk pesan Dine In <br> di meja ini
      </div>

      <div class="qr-placeholder qr-placeholder--726 mb-section">
        <img :src="qrcode" />
      </div>
      <!-- <step /> -->
      <div class="step">
        <div class="step--item">
          <span class="step--item-number">1</span>
          <div class="word-break">
            {{ rootLang.banner_dinein_step_1 }}
            <div class="flex-container">
              <div class="step--item-desc">* {{ rootLang.banner_dinein_step_1_note }}</div>
            </div>
          </div>
        </div>
        <div class="step--item word-break">
          <span class="step--item-number">2</span>
          <div>
            {{ rootLang.banner_dinein_step_2 }}
            <div class="flex-container">
              <div class="step--item-desc">* {{ rootLang.banner_dinein_step_2_note }}</div>
            </div>
          </div>
        </div>
        <div class="step--item word-break"><span class="step--item-number">3</span>{{ rootLang.banner_dinein_step_3 }}</div>
      </div>

      <div class="powered font-56"><img src="/static/dineinbanner/images/poweredbyolsera.png" /></div>
    </div>
  </div>
</template>

<script>
import imageTop from './_image-top'
// import Step from './_step'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  props: {
    qrcode: {
      type: String,
      default: ''
    },
    tableNumber: {
      type: String,
      default: ''
    }
  },

  mixins: [basicComputedMixin],

  components: {
    imageTop
    // Step
  }
}
</script>

<style scoped lang="scss">
@import './style.scss';
/* line 97, ../sass/screen.scss */
  .step {
    font-size: 60px;
    max-width: 1200px;
  }
  /* line 99, ../sass/screen.scss */
  .step--item {
    display: flex;
    // align-items: center;
    margin-bottom: 42px;
    line-height: 72px;
  }
  /* line 105, ../sass/screen.scss */
  .step--item-number {
    flex-shrink: 0;
    font-weight: bold;
    margin-right: 32px;
    font-size: 60px;
    border: 10px solid #fff;
    border-radius: 100%;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
  }
  /* line 117, ../sass/screen.scss */
  .step--item-desc {
    margin-top: 24px;
    font-size: 40px;
    background-color: #1685C7;
    border-radius: 100px;
    width: auto !important;
    line-height: 48px;
    padding: 8px 24px;
  }

  .word-break {
    word-break: keep-all;
  }

  .flex-container {
    display: flex;
    align-items: center;
  }
</style>
