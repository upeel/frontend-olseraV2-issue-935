<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8">
        <el-card class="box-card" v-loading="loading">
          <div slot="header">
            <h4>{{ $lang[langId].how_to }}</h4>
          </div>
          <div class="card-body">
            <div>
              <h5><b><span v-pre>
                  {{ order_no }}{{ customer_name }} {{ customer_email }}
                </span></b></h5>
              <p>{{ lang.info_variable_tags }}</p>
            </div>
            <hr/>
            <div>
              <h5>{{ lang.load_template }}</h5>
              <p>{{ $lang[langId].info_sample_content_email }} :</p>
              <br>
              <el-button
                class="pull-right" plain
                @click="setExampleBody"
                style="margin-bottom: 5px; color: #0085CD;">{{ lang.load_template }} {{ lang.email_body }}
              </el-button>
              <el-input type="textarea" v-model="exampleEmail" :rows="10" readonly></el-input>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="16">
        <el-card>
          <div slot="header" class="table-handler-flex">
            <div class="mr-8">
              <el-tag type="success"
                v-if="data.email_notify_type_id === 1 || data.email_notify_type_id === 2 ||
                data.email_notify_type_id === 3|| data.email_notify_type_id === 4">
                <i class="el-icon-message"></i>
              </el-tag>
              <el-tag type="warning" v-if="data.email_notify_type_id === 7 || data.email_notify_type_id === 8">
                <i class="el-icon-message"></i>
              </el-tag>
              <el-tag type="danger" v-if="data.email_notify_type_id === 5 || data.email_notify_type_id === 6">
                <i class="el-icon-message"></i>
              </el-tag>
            </div>

            <div style="flex-grow: 1;">
              <h4>{{ data.email_notify_type_name }}</h4>
              <p class="input-desc size-12 oldgrey">
                {{ data.email_notify_type_description }}
              </p>
            </div>

            <el-button size="small" type="info" class="mr-4" @click="cancel">
              {{ lang.cancel }}
            </el-button>

            <el-button
              size="small"
              type="success"
              icon="el-icon-check"
              :disabled="disabledSave"
              @click="save">
                {{ lang.save }}
            </el-button>
          </div>

          <div class="card-body">
            <h5>{{ lang.email_subject }}</h5>
            <el-input v-model="data.subject" />
            <br />
            <h5>{{ lang.email_body }}</h5>
            <wysiwyg v-model="data.body" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Wysiwyg from '@/components/Wysiwyg'

export default {
  props: ['saved', 'loading', 'formData'],

  components: {
    Wysiwyg
  },

  data() {
    return {
      disabledSave: true,
      exampleEmail: null,
      data: {},
      editorOption: {
        modules: {
          toolbar: [
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike', 'link'],
            [{'list': 'ordered'}, { 'list': 'bullet' }],
            [{'align': ['center', 'right', 'justify']}]
          ]
        }
      }
    }
  },
  created() {
    this.exampleEmail = this.data.template
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
    }
  },
  watch: {
    data: {
      handler(data) {
        if ((data.subject && data.subject !== '') && (data.body && data.body !== '')) {
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
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setExampleBody() {
      this.data.body = this.exampleEmail
    },
    cancel() {
      this.data = {}
      this.$emit('cancel')
    },
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    }
  }
}
</script>

