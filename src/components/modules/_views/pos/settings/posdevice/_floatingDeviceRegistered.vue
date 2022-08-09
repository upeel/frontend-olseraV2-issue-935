<template>
  <div>
    <transition name="el-zoom-in-center">
      <div
        v-if="show"
        class="offscreen-right-sidebar">
        <div class="offscreen-right-sidebar--wrapper">
          <div class="offscreen-right-sidebar--header text-left">
            {{ rootLang.registered_device }}
            <close-esc hide-esc @close="$emit('close')" />
          </div>
          <div class="flex-container">
            <div class="font-bold flex-grow-1">{{ rootLang.pos_devices }} ({{ devices.length }})</div>
            <button-action-authenticated :permission="['settings/posdevices', 'store']" type="success" icon="el-icon-plus" @click="add">
              {{ rootLang.add }}
            </button-action-authenticated>
          </div>
        </div>

        <div class="mt-16">
          <el-card
            v-if="devices && devices.length"
            class="box-card"
            :body-style="{ padding: '0px' }">
            <div
              v-for="(device) in devices"
              :key="device.id"
              class="like-table-wrapper--item">
              <div class="flex-grow-1">
                <div class="font-bold">{{ device.remark }}</div>
                <div class="color-old-grey font-12">{{ device.serial }}</div>
              </div>
              <button-action-authenticated
                :permission="['settings/posdevices', 'destroy']"
                :loading="loadingDestroy"
                type="text"
                class="color-danger"
                @click="beforeDestroy(device)">
                <i class="el-icon-delete"></i>
              </button-action-authenticated>
            </div>
          </el-card>

          <data-empty
            v-if="!devices.length"
            image="/static/img/data-empty/device-registered.svg"
            desc="Saat ini semua perangkat dapat mengakses POS. Tambah perangkat di sini untuk membatasi akses POS ke perangkat terdaftar" />
        </div>
      </div>
    </transition>

    <dialog-form
      :show="visibleDialogForm"
      :loading="loadingCreate"
      @close="visibleDialogForm = false"
      @save="create"
    />

    <dialog-confirm-delete
      :show="visibleDialogConfirmDelete"
      @close="visibleDialogConfirmDelete = false"
      @confirm="destroy"
    />
  </div>
</template>

<script>
import { create, destroy } from '@/api/pos/settings'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import DialogForm from './_dialogForm.vue'
import DialogConfirmDelete from './_dialogConfirmDelete'
import DataEmpty from '@/components/modules/DataEmpty'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    devices: {
      type: Array,
      default: () => []
    }
  },

  components: {
    CloseEsc,
    DialogForm,
    DialogConfirmDelete,
    DataEmpty
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visibleDialogForm: false,
      loadingCreate: false,
      loadingDestroy: false,
      visibleDialogConfirmDelete: false,
      singleDevice: {}
    }
  },

  methods: {
    add() {
      this.visibleDialogForm = true
    },
    create(data) {
      this.loadingCreate = true
      create({ ...data }).then(response => {
        this.loadingCreate = false
        this.visibleDialogForm = false
        this.$emit('created', response.data.data)
      }).catch(error => {
        this.loadingCreate = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    beforeDestroy(device) {
      this.visibleDialogConfirmDelete = true
      this.singleDevice = { ...device }
    },
    destroy() {
      this.visibleDialogConfirmDelete = false
      this.loadingDestroy = true
      destroy(this.singleDevice.id).then((response) => {
        this.loadingDestroy = false
        this.$emit('destroyed', this.singleDevice)
        this.$message({
          type: 'success',
          message: response.data.data.message
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    }
  }
}
</script>
