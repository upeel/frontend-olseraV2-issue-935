<template>
  <div>
    <div
      v-if="data.barcodesetting.usecustombarcode === 'off'"
      id="printable"
      style="line-height: 0.6">
      <div
        v-for="(item, idx) in barcodeData"
        :key="idx"
        :class="classBarcode"
        style="border: unset">
        <div v-if="!barcodeSetting.hide_product_name && !barcodeSetting.name_on_bottom" style="margin: 0 0 1px 0">
          <span class="font-10 font-bold">
            {{ item.name }}</span>
        </div>
        <div v-if="!barcodeSetting.hide_product_price && barcodeSetting.name_on_bottom">
          <span class="font-bold font-10" style="z-index: 1000">
            {{ item.currency }} {{ item.sell_price_pos }}</span>
        </div>
        <div v-if="!barcodeSetting.hidesku && barcodeSetting.sku_on_top && item.sku">
          <span
            class="font-8 font-bold">
            {{ item.sku }}</span>
        </div>
        <div style="margin-top: 3px">
          <img :src="item.url_img">
        </div>
        <div v-if="!barcodeSetting.hidesku && !barcodeSetting.sku_on_top && item.sku">
          <span
            class="font-8 font-bold">
            {{ item.sku }}</span>
        </div>
        <div v-if="!barcodeSetting.hide_product_price && !barcodeSetting.name_on_bottom">
          <span class="font-bold font-10" style="z-index: 1000">
            {{ item.currency }} {{ item.sell_price_pos }}</span>
        </div>
        <div v-if="!barcodeSetting.hide_product_name && barcodeSetting.name_on_bottom">
          <span class="font-10 font-bold">
            {{ item.name }}</span>
        </div>
      </div>
    </div>
    <div
      id="printable"
      v-else
      :style="'width: 100%; height: 100%; display: flex; flex-direction: column;line-height: 0.8;padding-bottom: 24px'">
      <div
        v-for="column in columnsBarcode"
        :key="column"
        class="flex-container barcode">
        <div
          v-for="item in column"
          :key="item"
          :style="customSetting.style + ';border: unset !important;'">
          <div>
            <div v-if="!barcodeSetting.hide_product_name && !barcodeSetting.name_on_bottom" style="margin 0 0 1px 0">
              <span class="font-10 font-bold">
                {{ item.name }}</span>
            </div>
            <div v-if="!barcodeSetting.hide_product_price && barcodeSetting.name_on_bottom">
              <span class="font-bold font-10" style="z-index: 1000">
                {{ item.currency }} {{ item.sell_price_pos }}</span>
            </div>
            <div v-if="item.sku">
              <span v-if="!barcodeSetting.hidesku && barcodeSetting.sku_on_top" style="font-size: 8px">
                {{ item.sku }}</span>
            </div>
            <div style="margin-top: 3px">
              <img :src="item.url_img">
            </div>
            <div v-if="item.sku">
              <span v-if="!barcodeSetting.hidesku && !barcodeSetting.sku_on_top" style="font-size: 8px">
                {{ item.sku }}</span>
            </div>
            <div v-if="!barcodeSetting.hide_product_price && !barcodeSetting.name_on_bottom">
              <span class="font-bold font-12" style="z-index: 1000">
                {{ item.currency }} {{ item.sell_price_pos }}</span>
            </div>
            <div v-if="!barcodeSetting.hide_product_name && barcodeSetting.name_on_bottom">
              <span style="font-size: 11px">
                {{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintPreview',
  props: ['data', 'customSetting', 'barcodeSetting', 'barcodeData', 'columnsBarcode']
}
</script>