<template>
  <div style="display: none;">
    <div id="print-square" class="body-square">
      <image-top :table-number="tableNumber" />
      <div class="font-100 font-bold mb-section">
        Scan barcode untuk pesan<br />
        Dine In di meja ini
      </div>

      <div class="flex-container">
        <div class="qr-placeholder qr-placeholder--648 mb-section" style="margin-right: 80px;">
          <img :src="qrcode" />
          <div class="powered-square"><img src="/static/dineinbanner/images/poweredbyolsera.png" style="margin-left: 8px" /></div>
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
                <div style="width: 30%"></div>
              </div>
            </div>
          </div>
          <div class="step--item word-break"><span class="step--item-number">3</span>{{ rootLang.banner_dinein_step_3 }}</div>
        </div>
      </div>

      <!-- <div class="powered-square font-56">Powered by <img width="280px" src="/static/dineinbanner/images/icons/olsera@2x.png" /></div> -->
    </div>
  </div>
</template>

<script>
import imageTop from './_image-top'
import Step from './_step'
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
    imageTop,
    Step
  }
}
</script>

<style scoped lang="scss">
@import './style.scss';
/* line 97, ../sass/screen.scss */
  .step {
    font-size: 50px;
    max-width: 1300px;
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
    margin-right: 32px;
    font-size: 40px;
    border: 10px solid #fff;
    border-radius: 100%;
    width: 75px;
    height: 75px;
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
    border-radius: 20px;
    width: auto !important;
    line-height: 48px;
    padding: 8px 24px;
  }

  .word-break {
    word-break: keep-all;
  }
</style>
