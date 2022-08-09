<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <div slot="header" class="table-handler-flex">
        <h4 class="box-title">{{ lang.add }}</h4>
        <div>
          <el-button
            :disabled="disabledSave" 
            size="small"
            @click="save" 
            type="success" 
            icon="el-icon-check">
            {{ lang.save }}
          </el-button>
          <button-action-authenticated 
            v-if="data.id"
            :permission="['settings/posrestolayout', 'destroy']"
            :disabled="disabledSave" 
            size="small"
            type="danger" 
            icon="el-icon-delete"
            @click="remove"
          />
        </div>
      </div>

      <div class="card-body">
        <el-form v-model="data" label-width="120px"> 
          <el-form-item :label="lang.layout_name" :required="true">
            <el-input type="text" v-model="data.name" />
            <p class="size-12 input-desc oldgrey">
              {{ lang.info_resto_layout_name }}
            </p>
          </el-form-item>
          <el-form-item :label="lang.table_numbers" :required="true">
            <el-input
              v-model="data.table_numbers"
              placeholder="type and hit enter"
              type="text"
              @keyup.enter="addTablesState"
              @change="addTablesState"
            />
            <p class="size-12 input-desc oldgrey">
              {{ lang.info_table_numbers }}
            </p>
            <template v-if="data.items">
              <el-tag
                v-for="(item, key) in data.items"
                :key="key"
                closable
                @close="removeTable(item, key)">
                {{ item.name }}
              </el-tag>
            </template>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['saved', 'loading', 'formData', 'newState'],

  data() {
    return {
      disabledSave: true,
      data: {
        items: [],
        table_numbers: ''
      },
      arr: []
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    data: {
      handler(data) {
        if (!data.items) {
          this.data.items = []
        }
        if (!data.name) {
          this.data.name = ''
        }
        if ((data.name && data.name !== '') && (data.items && data.items.length > 0)) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          // this.data.name = ''
          // this.data.items = []
          this.disabledSave = true
        } else {
          this.disabledSave = false
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
        if (!data.items) {
          this.data.items = []
        }
        if (!data.name) {
          this.data.name = ''
        }
        if (data.items) {
          data.items.map(i => {
            if (this.arr.indexOf(i.name) === -1) {
              this.arr.push(i.name)
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // addTablesState(data) {
    //   if (!this.data.items) {
    //     this.data.items = []
    //   }
    //   console.log('aa', this.data.items)
      
    //   let exist = false

    //   this.data.items.map((item, idx, arr) => {
    //     if (item.name === data) {
    //       exist = true
    //       return
    //     } else {
    //       exist = false
    //     }
    //   })
      
    //   if (!exist) {
    //     this.data.items.push({
    //       name: data
    //     })
    //   }
    //   this.data.table_numbers = ''
    // },

    addTablesState(data) {
      if (this.arr.indexOf(data) === -1) {
        this.arr.push(data)
      }
      this.data.items = []
      this.arr.map(i => {
        this.data.items.push({
          name: i
        })
      })
      this.data.table_numbers = ''
    },

    save() {
      // this.arr = []
      this.disabledSave = true
      let data = {...this.data}
      data.tempitems = [...this.data.items]
      data.items = data.tempitems.map(item => {
        return item.name
      })
      data.table_numbers = data.items.join(',')
      this.$emit('save', data)
    },

    remove() {
      this.$emit('remove', {id: this.data.id})
    },

    removeTable(item, key) {
      this.data.items.splice(key, 1)
      let it = []
      this.data.items.map(i => {
        it.push(i.name)
      })
      this.arr = it
    }
  }
}
</script>

