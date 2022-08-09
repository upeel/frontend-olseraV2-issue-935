<template>
  <el-button
    :disabled="disabled"
    :size="size"
    :class="classAttend"
    :type="type"
    icon="el-icon-date">
    {{ computedLabel }}
    <i class="fa fa-caret-down"></i>
  </el-button>
</template>

<script>
import "daterangepicker/daterangepicker";
import "daterangepicker/daterangepicker.css";
import $ from "jquery";
const moment = require('moment')

export default {
  name: "date-range-picker",
  props: {
    value: {},
    options: {
      type: Object,
      default: function() {
        return {};
      }
    },
    format: {
      type: String,
      default: "YYYY-MM-DD"
    },
    className: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: 'mini'
    },
    classAttend: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: 'info'
    },
    ddate: {
      type: String,
      default: ''
    },
    isAttendance: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allTime: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      range: [
        moment().format(this.format),
        moment().format(this.format)
      ]
    }
  },

  computed: {
    isSingleDatePicker() {
      return this.options.singleDatePicker;
    },
    startDate() {
      if (this.isSingleDatePicker) {
        return this.range;
      }
      return this.range[0];
    },
    endDate() {
      if (this.isSingleDatePicker) {
        return this.range;
      }
      return this.range[1];
    },
    customOptions() {
      return {
        locale: {
          format: this.format
        },
        ...this.options
      };
    },
    computedLabel() {
      if (this.isSingleDatePicker) {
        return moment(this.range[0]).format('DD MMM YY')
      } else if (this.isAttendance) {
        return moment(this.ddate[0]).format('DD MMM YY') + ' - ' + moment(this.ddate[1]).format('DD MMM YY')
      } else if (this.allTime) {
        return 'All Time'
      } else if (moment(this.ddate[0]).format('YYYY') === '1970' && moment(this.ddate[1]).format('YYYY') === '1970') {
        return 'All Time'
      } else {
        return moment(this.range[0]).format('DD MMM YY') + ' - ' + moment(this.range[1]).format('DD MMM YY')
      }
    }
  },

  watch: {
    value(value) {
      if (value && value.length) {
        this.range = value
      }
    },
    range(value, oldValue) {
      this.$emit("change", value)
    }
  },

  created() {
    if (this.value && this.value.length) {
      this.range = this.value;
    }
  },

  mounted() {
    this.$nextTick(() => {
      const el = $(this.$el);
      el.daterangepicker(this.customOptions);
      el.on("apply.daterangepicker", (event, picker) => {
        const startDate = picker.startDate.format(this.format);
        const endDate = picker.endDate.format(this.format);
        if (this.isSingleDatePicker) {
          this.range = startDate;
        } else {
          this.range = [startDate, endDate];
        }
      });
      el.on("cancel.daterangepicker", () => {
        if (this.isSingleDatePicker) {
          this.range = "";
        } else {
          this.range = [];
        }
      });
    });
  },

  beforeDestroy() {
    $(this.$el)
      .daterangepicker("hide")
      .daterangepicker("destroy");
  }
};
</script>
