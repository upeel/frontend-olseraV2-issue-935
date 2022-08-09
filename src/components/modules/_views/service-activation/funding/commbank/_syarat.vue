<template>
  <div class="form-wizard--content__wrapper">
    <div class="wizard-desc">
      <h3 style="margin-top: 0;" class="mb-24">Informasi Program</h3>
      <div class="like-table-wrapper">
        <div
          v-for="(item, key) in informations"
          :key="key"
          class="like-table-wrapper--item">
          <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
            <div style="width: 120px;">{{ item.title }}</div>
            <div
              v-html="item.desc"
              class="text-right"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="wizard-content">
      <h3 style="margin-top: 0;" class="mb-24">Syarat Pengajuan</h3>
      <div class="flex-grow-1">
        <div class="like-table-wrapper">
          <div
            v-for="(item, key) in syarat"
            :key="key"
            class="like-table-wrapper--item">
            <div class="flex-container w-fit">
              <div class="mr-18 color-primary">
                <i class="el-icon-check"></i>
              </div>
              <div>
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button
        type="success"
        class="btn-block"
        @click="handleSubmit">
        {{ rootLang.next }}
      </el-button>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { informations, syarat } from './data/syarat'
export default {
  mixins: [basicComputedMixin],

  computed: {
    informations() {
      return informations
    },
    syarat() {
      return syarat
    }
  },

  methods: {
    handleSubmit() {
      this.$emit('next', 0)
    }
  }
}
</script>
