<template>
  <div class="step">
    <div class="step--item">
      <span class="step--item-number">1</span>
      <div class="word-break">
        {{ rootLang.banner_dinein_step_1 }}
        <div class="step--item-desc">*{{ rootLang.banner_dinein_step_1_note }}</div>
      </div>
    </div>
    <div class="step--item word-break">
      <span class="step--item-number">2</span>
      <div>
        {{ rootLang.banner_dinein_step_2 }}
        <div class="step--item-desc">*{{ rootLang.banner_dinein_step_2_note }}</div>
      </div>
    </div>
    <div class="step--item word-break"><span class="step--item-number">3</span>{{ rootLang.banner_dinein_step_3 }}</div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  mixins: [basicComputedMixin],
}
</script>

<style scoped lang="scss">
  /* line 97, ../sass/screen.scss */
  .step {
    font-size: 50px;
  }
  /* line 99, ../sass/screen.scss */
  .step--item {
    display: flex;
    align-items: center;
    margin-bottom: 42px;
    line-height: 1.4em;
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
  }
  /* line 117, ../sass/screen.scss */
  .step--item-desc {
    font-size: 32px;
  }

  .word-break {
    word-break: keep-all;
  }
</style>
