<template>
  <div>
    <div class="font-bold color-black font-40 mb-24 flex-container">
      <div class="flex-grow-1">
        Perbandingan fitur
      </div>
      <el-input
        v-model="keyword"
        placeholder="Cari..."
        prefix-icon="el-icon-search"
        style="width: 300px;"
      />
    </div>
    <table class="table table-bordered table-features">
      <thead>
        <tr>
          <th
            v-for="header in [{ type: 'parent' }, ...storeTypes]"
            :key="header.name"
            :class="header.name !== 'Fitur' ? 'text-center' : ''">
            <span :style="{ color: header.color }">
              {{ header.name }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(feature, featureKey) in computedTableFeatures"
          :key="featureKey"
          :class="[
            feature.type === 'parent' ? 'th' : ''
          ]">
          <td :colspan="feature.colspan ? storeDefs.length + 1 : ''">
            {{ feature.name }}
          </td>
          <template v-if="feature.fields && feature.fields.length">
            <td
              v-for="(field, fieldKey) in feature.fields"
              :key="fieldKey"
              :colspan="feature.field_colspan ? feature.field_colspan : ''"
              class="text-center"
              width="20%">
              <span v-if="typeof field === 'boolean'">
                <svg-icon v-if="field" icon-class="fa-check" />
                <svg-icon v-else icon-class="fa-close" />
              </span>
              <span v-else class="font-bold font-16">{{ field }}</span>
            </td>
          </template>
          <template v-else-if="feature.exclude_types">
            <td
              v-for="type in storeDefs"
              :key="type"
              class="text-center"
              width="20%">
              <span v-if="!feature.exclude_types.includes(type)">
                <svg-icon icon-class="fa-check" />
              </span>
              <span v-else>
                <svg-icon icon-class="fa-close" />
              </span>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import { storeDefs as sourceStoreDefs } from '@/data/storeDefs'

export default {
  data() {
    return {
      storeDefs: [],
      storeTypes: [],
      tableFeatures: [],
      keyword: ''
    }
  },

  computed: {
    computedTableFeatures() {
      if (this.keyword) {
        return this.tableFeatures.filter(item => {
          // if (item.type === 'parent') {
          //   return item
          // } else {
          //   return item.name.toLowerCase().includes(this.keyword.toLowerCase())
          // }
          return item.name.toLowerCase().includes(this.keyword.toLowerCase())
        })
      } else {
        return this.tableFeatures
      }
    }
  },

  mounted() {
    this.storeDefs = []
    sourceStoreDefs.map(item => {
      this.storeDefs.push(item)
    })
    axios.get('/static/data/package-features.json').then(response => {
      this.tableFeatures = response.data
    })
    axios.get('/static/data/package-types.json').then(response => {
      this.storeTypes = []
      response.data.map(item => {
        this.storeTypes.push(item)
      })
    })
  }
}
</script>
