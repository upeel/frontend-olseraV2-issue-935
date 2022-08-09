<template>
  <el-row :gutter="10">
    <el-col :md="16">
      <div class="detail-section">
        <div class="detail-item">
          <div class="detail-label">
            <small>{{ lang.name }}</small>
          </div>
          <div class="detail-value">
            {{ data.name }}
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-label">
            <small>{{ lang.price }}</small>
          </div>
          <div class="detail-value">
            {{ data.fprice }}
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-label">
            <small>{{ lang.link_to_product_stock }}</small>
          </div>
          <div class="detail-value">
            {{ data.product_qty }} x {{ data.product_name }} <span v-if="data.product_variant_id">
              ({{ data.product_variants_name }})
            </span>
          </div>
        </div>
      </div>
    </el-col>

    <el-col :md="8">
      <div class="detail-section">
        <div class="detail-item">
          <div class="detail-label">
            {{ lang.valid_for_product_groups }}
          </div>
          <div class="detail-value">
            <div
              v-for="item in data.valid_product_groups"
              :key="item.id"
              class="box-in-loop">
              {{ item.name }}<br>
              <span class="size-12 grey">{{ item.product_group_name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-item">
          <div class="detail-label">
            {{ lang.valid_for_products }}
          </div>
          <div class="detail-value">
            <div
              v-for="item in data.valid_products"
              :key="item.id"
              class="item-flex box-in-loop">
              <img
                :src="item.photo_md"
                :alt="item.name"
                class="img-40 img-rounded">
              <div>
                {{ item.name }}<br>
                <span class="size-12 grey">{{ item.product_group_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    lang: {
      type: Object,
      required: true
    }
  }
}
</script>

