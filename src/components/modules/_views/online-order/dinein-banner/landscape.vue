<template>
  <div style="display: none;">
    <div id="print-landscape" class="body-landscape">
      <image-top :table-number="tableNumber" />
      <div class="font-108 font-bold mb-section">
        Scan barcode untuk pesan<br />
        Dine In di meja ini
      </div>

      <div class="flex-container">
        <div class="qr-placeholder qr-placeholder--648 mb-section" style="margin-right: 80px;">
          <img :src="qrcode" />
          
          <div class="powered-landscape font-36"><img src="/static/dineinbanner/images/poweredbyolsera.png" style="margin-left: 8px" /></div>
        </div>
        <div>
          <div class="font-75 font-semibold" style="margin-bottom: 20px;">
            Caranya mudah!
          </div>
          <!-- <step /> -->
          <div class="step">
            <div class="step--item">
              <span class="step--item-number">1</span>
              <div class="word-break">
                {{ rootLang.banner_dinein_step_1 }}
                <div class="flex-container">
                  <div class="step--item-desc">*{{ rootLang.banner_dinein_step_1_note }}</div>
                </div>
              </div>
            </div>
            <div class="step--item word-break">
              <span class="step--item-number">2</span>
              <div>
                {{ rootLang.banner_dinein_step_2 }}
                <div class="flex-container" style="width: 80%">
                  <div class="step--item-desc">*{{ rootLang.banner_dinein_step_2_note }}</div>
                </div>
              </div>
            </div>
            <div class="step--item word-break"><span class="step--item-number">3</span>{{ rootLang.banner_dinein_step_3 }}</div>
          </div>
        </div>
      </div>

      <!-- <div class="powered-landscape font-56">Powered by <img src="/static/dineinbanner/images/icons/olsera@2x.png" /></div> -->
    </div>
  </div>
</template>

<script>
import imageTop from './_image-top'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import Step from './_step'
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
    font-size: 60px;
    max-width: 1247px;
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
    border-radius: 24px;
    width: auto !important;
    line-height: 48px;
    padding: 8px 24px;
  }

  .word-break {
    word-break: keep-all;
  }
</style>