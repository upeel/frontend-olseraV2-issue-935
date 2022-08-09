<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header" class="flex-container flex-container--content-space-between">
        <h4 v-if="!isedit">{{ lang.add_staff }}</h4>
        <h4 v-else>{{ $lang[langId].edit_staff }}</h4>
        <div class="text-right">
          <el-button
            size="small"
            @click="cancel"
            type="info">
            {{ lang.cancel }}
          </el-button>
          <el-button
            v-if="!isedit"
            :disabled="disabledSave"
            size="small"
            @click="save"
            type="success"
            icon="el-icon-check">
            {{ lang.save }}
          </el-button>
          <el-button
            v-else
            size="small"
            @click="save"
            type="success"
            icon="el-icon-check">
            {{ lang.save }}
          </el-button>
        </div>
      </div>

      <div v-if="!isedit" class="card-body p-24">
        <el-form :model="data" label-width="140px">
          <el-form-item :label="lang.name" :required="true">
            <el-input type="text" v-model="data.name" />
          </el-form-item>

          <el-form-item :label="lang.email">
            <el-input type="email" v-model="data.email" />
            <p class="input-desc oldgrey size-12">
              {{ lang.info_staff_email }}
            </p>
          </el-form-item>

          <el-form-item v-if="selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2'" :label="lang.phone" :required="true">
            <phone-number-input
              v-model="data.phone_format"
              :translations="{
                countrySelectorLabel: '',
                countrySelectorError: '',
                phoneNumberLabel: '',
                example: ''
              }"
              :only-countries="['ID', 'SG']"
              default-country-code="ID"
              @update="getPhone"
              class="field-register"
            />
          </el-form-item>

          <el-form-item :label="lang.role" :required="true">
            <el-select style="width: 100%;" v-model="data.role_id">
              <el-option v-for="item in computedRoleOptions"
                :value="item.id"
                :key="item.id"
                :label="item.label"
                :disabled="item.disabled"
              />
            </el-select>
            <p class="size-12 input-desc oldgrey cursor-pointer clickable" @click="showInfo">
              {{ lang.click_to_view_roles_info }}
            </p>
          </el-form-item>

          <hr/>

          <el-form-item :label="lang.pos_access_id">
            <el-input type="text" v-model="data.code" />
          </el-form-item>

          <el-form-item :label="lang.password">
            <el-input type="text" v-model="data.password" />

            <p class="input-desc oldgrey size-12">
              {{ lang.info_staff_password }}
            </p>
          </el-form-item>

          <el-form-item :label="lang.pos_served_by">
            <el-switch v-model="data.is_server"
              :active-value="1"
              :inactive-value="0"
              :active-text="lang.yes"
              :inactive-text="lang.no"
            />

            <p class="input-desc oldgrey size-12">
              {{ lang.info_pos_served_by }}
            </p>
          </el-form-item>
        </el-form>
      </div>

      <div class="p-24" v-else>
        <el-form v-model="staff" label-width="140px">
          <el-form-item :label="lang.role" :required="true">
            <el-select style="width: 100%;" v-model="data.role_id">
              <el-option v-for="item in computedRoleOptions"
                :value="item.id"
                :key="item.id"
                :label="item.label"
                :disabled="item.disabled"
              />
            </el-select>
            <p class="size-12 input-desc oldgrey cursor-pointer clickable" @click="showInfo">
              {{ lang.click_to_view_roles_info }}
            </p>
          </el-form-item>

          <hr/>

          <el-form-item :label="lang.pos_access_id">
            <el-input type="text" v-model="data.code" />
          </el-form-item>

          <el-form-item v-if="!data.email" :label="lang.password">
            <el-input type="text" v-model="data.password" />

            <p class="input-desc oldgrey size-12">
              {{ lang.info_staff_password }}
            </p>
          </el-form-item>

          <el-form-item :label="lang.pos_served_by">
            <el-switch v-model="data.is_server"
              :active-value="1"
              :inactive-value="0"
              :active-text="lang.yes"
              :inactive-text="lang.no"
            />

            <p class="input-desc oldgrey size-12">
              {{ lang.info_pos_served_by }}
            </p>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-dialog
      :title="lang.info_staff_title"
      :visible.sync="dialogVisible"
      width="320px">
      <div class="dialog-body">
        <div class="tips-list">
          <template v-for="(item, key) in computedRoleOptions">
            <div :key="key">
              <h5>{{ item.label }}</h5>
              <p>{{ item.desc }}</p>
              <hr/>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FormStaff',
  props: [ 'isedit', 'staff', 'saved', 'loading', 'formData', 'roleOptions', 'selectedRole'],

  data() {
    return {
      disabledSave: true,
      dialogVisible: false,
      data: { 
        role_id: this.selectedRole
      },
      roles: [...this.roleOptions]
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
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    loggedInUserRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    },
    computedRoleOptions() {
      // console.log('tra', this.staff.email.length)
      if (this.loggedInUserRole.role_id !== 'OW') {
        if (this.staff && this.staff.email && this.staff.email.length === 0) {
          this.roles.map(i => {
            i.disabled = false
            if (i.id !== 'PS' && i.id !== 'PO') {
              i.disabled = true
            }
          })
        }
        return this.roles.filter(role => role.id !== 'OW')
      } else {
        if (this.staff && this.staff.email && this.staff.email.length === 0) {
          this.roles.map(i => {
            i.disabled = false
            if (i.id !== 'PS' && i.id !== 'PO') {
              i.disabled = true
            }
          })
        }
        return this.roles
      }
    }
  },

  watch: {
    // selectedRole: {
    //   handler(role) {
    //     this.data.role_id = role
    //   }
    // },
    data: {
      handler(data) {
        // if ((data.name && data.name !== '') && (data.role_id && data.role_id !== '') && (data.mobile && data.mobile !== '')) {
        if ((data.name && data.name !== '') && (data.role_id && data.role_id !== '')) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true,
      immediate: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    },
    staff: {
      handler(staff) {
        if (staff) {
          this.data = { ...staff }
          this.data.is_server = parseInt(this.data.is_server)
        }
      }
    }
  },

  methods: {
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      if (!this.isedit) {
        this.disabledSave = true
        let data = Object.assign({}, this.data)
        // data.role_id = this.selectedRole
        this.$emit('save', data)
      } else {
        let data = Object.assign({}, this.data)
        this.$emit('update', data)
      }
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    },
    showInfo () {
      this.$emit('showinfo', this.computedRoleOptions)
    },

    getPhone (value) {
      this.data.mobile = value.formattedNumber
    },
  }
}
</script>
