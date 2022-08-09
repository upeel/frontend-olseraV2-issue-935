<template>
  <div
    v-if="token && token.access_token"
    v-loading="loading"
    :class="[absens ? 'p-null attendance-mobile-wrapper--keyboard-view' : '', $route.query.mode]"
    class="attendance-mobile-wrapper">

    <frame-in
      :show="tempEmployee.is_in"
      :data="tempEmployee"
      :going="going"
      @close="handleClose"
    />

    <close-esc
      v-if="absens || visibleEmployeDetail || absenphone"
      id="closeesc"
      :circle="true"
      :color="colorEsc"
      style="top: 30px; right: 30px"
      @close="handleBack"
    />

    <div
      v-show="!absens && !visibleEmployeDetail && !absenphone"
      class="attendance-mobile-wrapper--block attendance-mobile-wrapper--block p-16"
      style="flex-grow: 1;">
      <div
        class="flex-container mb-16 pb-4 container-shortcut-alphabets employee-profile">
        <el-button
          v-for="(item, keyAlpha) in computedAlphabets"
          :key="keyAlpha"
          :class="item === queryByAlpha ? 'active' : ''"
          circle
          type="info"
          class="mr-16 font-24"
          @click="handleClickAlphabet(item)">
          {{ item }}
        </el-button>
      </div>

      <div
        v-loading="loadingEmployeeListByDate"
        class="flex-container flex-container--wrap attendace-staff-list">
        <div
          v-for="item in computedEmployee"
          :key="item.id"
          class="pointer flex-container mr-16 mb-16 radius-5 px-8 py-8 box-shadow border border--grey attendace-staff-list-item"
          style="width: 224px;"
          @click="handleShowProfile(item)">
          <div class="mr-16">
            <el-avatar 
              :src="item.photo"
              :size="56">
              <template v-if="tempEmployee.name">
                {{ tempEmployee.name.split('')[0] }}
              </template>
            </el-avatar>
          </div>
          <div class="overflow-ellipsis font-bold font-24">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="!absens && !visibleEmployeDetail"
      :class="computedClass.class_background">
      <div
        :class="computedDayOrNight === 'Night' ? 'bg-blackview radius-32 mb-24' : 'bg-primary radius-32 mb-24'"
        style="padding: 48px 24px;">
        <div class="text-center font-32 mb-16">{{ selectedStore.url_id }}</div>
        <div class="text-center">
          <svg-icon
            :icon-class="computedDayOrNight === 'Night' ? 'night' : 'morning'"
            style="font-size: 100px"
          />
          <div class="font-bold" style="font-size: 60px;">
            {{ computedRunningClock.time }}<span style="color: rgba(255, 255, 255, 0.5)">{{ computedRunningClock.second }}</span>
          </div>
          <div class="font-18 mb-24">{{ computedGMT.date }}</div>
          <div class="select-gmt">
            <el-select
              v-model="selectedGMT">
              <el-option
                v-for="(item, key) in dataGmt"
                :key="key"
                :value="item"
                :label="item + dataGmtLabels[key]">
                {{ item }} {{ dataGmtLabels[key] }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div
        v-loading="loadingQR"
        v-if="dataQr && source === 'pos'"
        class="bg-white color-black text-center radius-10 pointer qr-attendance"
        @click="visibleDialogAccessibilityQR = true">
        <div class="p-8 qr-title">
          <svg-icon icon-class="Icon-smartphone" class="font-20 color-black" />
          <span>Scan Absen</span>
        </div>
        <div>
          <el-image :src="dataQr"/>
        </div>
      </div>
    </div>

    <div
      v-if="visibleEmployeProfile"
      :class="computedClass.class_profile">
      <div class="flex-container flex-container--content-center mb-24">
        <div class="mr-16">
          <svg-icon :icon-class="computedDayOrNight === 'Night' ? 'night' : 'morning'" style="font-size: 105px;"/>
        </div>
        <div>
          <span class="font-bold font-40" style="color: #FFFFFF">
            {{ computedRunningClock.time }}<span style="color: rgba(255, 255, 255, 0.5)">{{ computedRunningClock.second }}</span>
          </span>
          <div class="font-18" style="color: #FFFFFF">{{ computedGMT.date }}</div>
        </div>
      </div>

      <div
        :style="computedStyleImageAbsen"
        class="radius-32 mb-24 employee-profile"
      />

      <div class="flex-container full-width mb-16 p-8 employee-profile">
        <div class="color-white full-width">
          <div class="font-24 font-semi-bold" v-if="tempEmployee.data_absent_by_date.shifttime !== null">{{ tempEmployee.data_absent_by_date.shifttime.name }}</div>
          <span class="font-16">{{ tempEmployee.data_absent_by_date.fdate_coming }}</span>
        </div>
        <div>
          <el-button
            v-if="($route.query.mode === 'going' && !tempEmployee.data_absent_by_date.time_going) || ($route.query.mode !== 'going' && !tempEmployee.data_absent_by_date.time_coming)"
            class="radius-5 absent-active">
            Belum Absen
          </el-button>
          <el-button
            v-else
            :class="getDurationLabel(tempEmployee).class_name"
            class="radius-5">
            {{ getDurationLabel(tempEmployee).label }}
          </el-button>
        </div>
      </div>

      <div class="full-width mb-24 employee-profile">
        <el-button
          :loading="loadingHistory"
          class="btn-block color-white font-24 border-null radius-10"
          :style="computedDayOrNight === 'Night' ? 'background: #313131' : 'background: #26ABF3'"
          @click="showEmployeeDetail(tempEmployee)">
          Riwayat Absensi
        </el-button>
      </div>

      <div
        class="p-8 d-block pointer radius-10 full-width employee-profile"
        :style="computedDayOrNight === 'Night' ? 'background: #313131; color: #FFFFFF' : 'border: 2px solid #FFFFFF; color: #FFFFFF'"
        @click="handleBack">
        <div class="flex-container">
          <div class="mr-8">
          </div>
          <div style="flex-grow: 1;">
            <div class="font-40 font-semi-bold text-center">{{ tempEmployee.name }}</div>
          </div>
          <i class="el-icon-arrow-down icon-down-dropdown" style="font-size: 30px"></i>
        </div>
      </div>
    </div>

    <!-- Profile Mobile -->
    <div
      v-if="visibleProfilePhone"
      class="employee-profile-mobile attendance-mobile-wrapper--block-mobile inputabsen-bg-primary"
      style="padding: unset !important">
      <div :class="computedDayOrNight === 'Night' ? 'p-24 color-white bg-blackview' : 'p-24 color-white'">
        <div class="text-center">
          <div class="flex-container mb-24">
            <div class="full-width text-left">
              <svg-icon icon-class="attendance-white-ico" class="color-primary" style="font-size: 16px !important" />
              <span class="font-16">{{ selectedStore.url_id }}</span>
            </div>
            <div>
              <svg-icon
                :icon-class="computedDayOrNight === 'Night' ? 'night' : 'morning'"
              />
            </div>
          </div>
          
          <div class="font-bold font-40">
            {{ computedRunningClock.time }}<span style="color: rgba(255, 255, 255, 0.5)">{{ computedRunningClock.second }}</span>
          </div>
          <div class="font-18 mb-24">{{ computedGMT.date }}</div>
          <div class="select-gmt">
            <el-select
              v-model="selectedGMT">
              <el-option
                v-for="(item, key) in dataGmt"
                :key="key"
                :value="item"
                :label="item + dataGmtLabels[key]">
                {{ item }} {{ dataGmtLabels[key] }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="full-width p-24" style="background: #FFFFFF">
        <div
          class="flex-container mr-16 mb-16 radius-5 px-8 py-8 box-shadow border border--grey attendace-staff-list-item pointer full-width"
          @click="showChangeEmployee = !showChangeEmployee">
          <div class="text-center mr-16">
            <el-avatar 
              :src="tempEmployee.photo"
              :alt="tempEmployee.name"
              :size="56"
            />
          </div>
          <div class="overflow-ellipsis font-bold font-24 text-left full-width">
            <div class="pointer">
              {{ tempEmployee.name }}
            </div>
          </div>
          <div>
            <i :class="showChangeEmployee ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </div>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="showChangeEmployee"
            class="dropdown-change-employee box-shadow radius-8 font-bold font-24 pointer full-width"
            @click="handleBackPhone(true)">
            Ganti Karyawan
          </div>
        </transition>

        <div class="flex-container full-width mb-16 p-8 border border--grey">
          <div class="text-left full-width">
            <div class="font-14 font-semi-bold" v-if="tempEmployee.data_absent_by_date.shifttime !== null">{{ tempEmployee.data_absent_by_date.shifttime.name }}</div>
            <span class="font-12">{{ tempEmployee.data_absent_by_date.fdate_coming }}</span>
          </div>
          <div>
            <el-button
              v-if="($route.query.mode === 'going' && !tempEmployee.data_absent_by_date.time_going) || ($route.query.mode !== 'going' && !tempEmployee.data_absent_by_date.time_coming)"
              class="radius-5 absent-active"
              size="mini">
              Belum Absen
            </el-button>
            <el-button
              v-else
              :class="getDurationLabel(tempEmployee).class_name"
              size="mini"
              class="radius-5">
              {{ getDurationLabel(tempEmployee).label }}
            </el-button>
          </div>
        </div>

        <div class="mb-24">
          <el-button
            :loading="loadingHistory"
            class="btn-block color-grey--bg font-16" 
            style="height: 56px" 
            @click="showEmployeeDetail(tempEmployee, true)">
              Riwayat Absensi
            </el-button>
        </div>

        <div
          :class="!going ? '' : 'going'">
          <el-button
            :loading="loadingConfirmPin"
            :disabled="computedBtnAbsenPhone"
            class="btn-block btn-confirm-pin"
            style="height: 56px"
            @click="handleShowAbsenPhone">
            <div class="flex-container justify-center">
              <svg-icon v-if="!going" icon-class="come-ico" style="width: 40px; height: 40px" />
              <span style="color: #FFFFFF">
                <template v-if="!going">
                  <div class="font-24">Datang</div>
                </template>
                <template v-else>
                  <div class="font-24">Pulang</div>
                </template>
              </span>
              <svg-icon v-if="going" icon-class="going-ico" style="width: 40px; height: 40px" />
            </div>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Keyboard phone -->
    <div
      v-if="absenphone && !visibleEmployeDetail"
      class="employee-profile--mobile attendance-mobile-wrapper--block inputabsen-bg-primary"
      style="padding: unset !important; background: #FFFFFF !important">
      <div class="flex-container color-white--bg color-black" style="height: 56px">
        <div
          class="text-left pl-16 pointer"
          @click="absenphone = false, absens = true">
          <i class="el-icon-back font-24" />
        </div>
        <div class="full-width text-center font-24 font-bold">
          <span>Absensi</span>
        </div>
      </div>
      <div 
        :class="computedDayOrNight === 'Night' ? 'bg-blackview' : ''"
        class="full-width p-24 color-primary--bg">
        <div class="flex-container">
          <div class="mr-16">
            <el-avatar 
              :src="tempEmployee.photo"
              :alt="tempEmployee.name"
              :size="56">
              <span v-if="tempEmployee.name">
                {{ tempEmployee.name.split('')[0] }}
              </span>
            </el-avatar>
          </div>
          <div class="overflow-ellipsis font-bold font-24 text-left full-width">
            <div class="color-white">
              {{ tempEmployee.name }}
            </div>
            <div>
              <el-button
                v-if="($route.query.mode === 'going' && !tempEmployee.data_absent_by_date.time_going) || ($route.query.mode !== 'going' && !tempEmployee.data_absent_by_date.time_coming)"
                class="radius-5 absent-active"
                size="mini"
                @click="setEmployee(item)">
                Belum Absen
              </el-button>
              <el-button
                v-else
                :class="getDurationLabel(tempEmployee).class_name"
                size="mini"
                class="radius-5">
                {{ getDurationLabel(tempEmployee).label }}
              </el-button>
            </div>
          </div>
          <div>
            <div class="font-bold font-16 color-white" style="margin-top: -30px">
              {{ computedRunningClock.time }}<span style="color: rgba(255, 255, 255, 0.5)">{{ computedRunningClock.second }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="full-width px-24 py-16 container-absen-keyboard-phone" style="background: #FFFFFF">
        <div class="text-center">
          <div class="font-24">
            Masukkan PIN
          </div>
          <div class="mb-24">
            <el-input
              ref="inputPass"
              v-model="inputPass"
              :maxlength="6"
              placeholder="......"
              type="password"
              style="display: block; width: 100%;"
              @input="handleChangeInputPass"
              @keyup.enter.native="confirmPin">
            </el-input>
          </div>
          <div class="flex-container absen-keyboard">
            <div
              v-for="(column, idx) in columnsKeyboard"
              :key="idx"
              class="absen-keyboard--grid px-8">
              <div
                v-for="item in column" :key="item.id"
                class="absen-keyboard--button-wrapper mb-8">
                <el-button
                  class="radius-5 font-56"
                  @click="setPassword(item)">
                  <svg-icon v-if="item.id === 11" icon-class="backspace"></svg-icon>
                  <span v-else>{{ item.name }}</span>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class="!going ? '' : 'going'" class="p-24 floating_div">
        <el-button
          :loading="loadingConfirmPin"
          :disabled="inputPass.length < 6"
          class="btn-block btn-confirm-pin"
          style="height: 56px; width: 90vw"
          @click="confirmPin">
          <div class="flex-container justify-center">
            <svg-icon v-if="!going" icon-class="come-ico" style="width: 40px; height: 40px" />
            <span style="color: #FFFFFF">
              <template v-if="!going">
                <div class="font-24">Datang</div>
              </template>
              <template v-else>
                <div class="font-24">Pulang</div>
              </template>
            </span>
            <svg-icon v-if="going" icon-class="going-ico" style="width: 40px; height: 40px" />
          </div>
        </el-button>
      </div>
    </div>

    <!-- keyboard -->
    <div
      v-if="absens && !visibleEmployeDetail"
      class="attendance-mobile-wrapper--block p-24 employee-profile">
      <div class="text-center container-absen-keyboard">
        <div class="mb-24">
          <el-input
            ref="inputPass"
            v-model="inputPass"
            :maxlength="6"
            placeholder="......"
            type="password"
            @input="handleChangeInputPass"
            @keyup.enter.native="confirmPin">
          </el-input>
        </div>
        <div class="flex-container absen-keyboard">
          <div
            v-for="(column, idx) in columnsKeyboard"
            :key="idx"
            class="absen-keyboard--grid px-8">
            <div
              v-for="item in column" :key="item.id"
              class="absen-keyboard--button-wrapper mb-24">
              <el-button
                class="radius-5 font-56"
                @click="setPassword(item)">
                <svg-icon v-if="item.id === 11" icon-class="backspace"></svg-icon>
                <span v-else>{{ item.name }}</span>
              </el-button>
            </div>
          </div>
        </div>
        <div :class="!going ? '' : 'going'">
          <el-button
            :loading="loadingConfirmPin"
            :disabled="inputPass.length < 6"
            class="btn-block btn-confirm-pin"
            style="height: 76px"
            @click="confirmPin">
            <div class="flex-container justify-center">
              <svg-icon v-if="!going" icon-class="come-ico" style="width: 79px; height: 56px" />
              <span style="color: #FFFFFF">
                <template v-if="!going">
                  Datang
                </template>
                <template v-else>
                  Pulang
                </template>
              </span>
              <svg-icon v-if="going" icon-class="going-ico" style="width: 79px; height: 56px" />
            </div>
          </el-button>
        </div>
      </div>
    </div>

    <!-- dialog attendance history -->
    <el-dialog
      :visible.sync="dialogEmployeeDetail"
      append-to-body>
      <employee-detail
        :show="dialogEmployeeDetail"
        :data="tempEmployee"
      />
    </el-dialog>

    <!-- dialog session expired -->
    <el-dialog 
      :visible.sync="sessionExpired"
      append-to-body>
      <div class="text-center">
        <div class="font-24 font-bold">Sesi tidak valid</div>
        <div class="font-16" style="word-break: keep-all;">Coba scan kembali atau muat ulang</div>
        <el-button class="btn-block" @click="reloadPage">
          <svg-icon icon-class="refresh-ico"/> 
          Muat Ulang
        </el-button>
        <el-button class="btn-block absent-finished" @click="visibleScan = true, sessionExpired = false">
          <svg-icon icon-class="scan-barcode-ico"/> 
          Scan
        </el-button>
      </div>
    </el-dialog>

    <!-- dialog location too far away -->
    <el-dialog 
      :visible.sync="locationIssue"
      append-to-body>
      <div class="text-center">
        <div class="flex-container justify-center">
          <img src="/static/img/attendance/location-issue.png" width="139px" height="147px" alt="">
        </div>
        <div class="font-24 font-bold mt-16" style="word-break: keep-all;">Jarakmu jauh dari Toko</div>
        <div class="font-16" style="word-break: keep-all;">Scan barcode di perangkat POS tokomu untuk absen</div>
        <el-button class="btn-block btn-info mt-24" @click="locationIssue = false">
          OK
        </el-button>
      </div>
    </el-dialog>

    <!-- dialog geolocation denied by client -->
    <el-dialog 
      :visible.sync="locationBlock"
      append-to-body>
      <div class="text-center">
        <div class="flex-container justify-center">
          <img src="/static/img/attendance/location-block.svg" width="139px" height="147px" alt="">
        </div>
        <div class="font-24 font-bold mt-16" style="word-break: keep-all;">Izinkan akses lokasi</div>
        <div class="font-16" style="word-break: keep-all;">Beri izin akses lokasi untuk melanjutkan absen</div>
        <el-button class="btn-block btn-info mt-24" @click="locationBlock = false">
          OK
        </el-button>
      </div>
    </el-dialog>

    <!-- dialog barcode scanner -->
    <el-dialog 
      :visible.sync="visibleScan"
      fullscreen
      append-to-body>
      <div v-loading="loadingBarcode">
        <qrcode-stream @decode="showScanner" />
      </div>
    </el-dialog>

    <employee-detail
      :show="visibleEmployeDetail"
      :data="tempEmployee"
      class="employee-profile"
    />

    <!-- dialog barcode for accessibility -->
    <el-dialog
      :visible.sync="visibleDialogAccessibilityQR"
      title="Scan Absen"
      append-to-body
      width="320px">
      <div class="text-center">
        <el-image :src="dataQr" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// attendance-mobile?sid=11065&uid=218580&token=%242y%2410%24XLUD8XM06&locale=id
const moment = require('moment-timezone')

import {HTTP, baseApi} from 'src/http-common'
import baseAppURL from '@/utils/baseAppURL'
import {
  absentcoming,
  absentgoing,
  clientEmployeeDetail as getClientEmployeeDetail,
  clientPresenceListByDateNew as getClientPresenceListNew,
  getBarcode,
  getAuthAttendance,
  timeserver
} from '@/api/attendance'
import axios from 'axios'
import vm from 'src/eventHub'
import SwitchStore from '@/components/modules/webview/SwitchStore'
import CloseEsc from '@/components/modules/CloseEsc'
import FrameIn from './frames/in'
import EmployeeDetail from './employeeDetail'
import { debounce } from 'vue-debounce'
import { QrcodeStream } from 'vue-qrcode-reader'

// Akmal 006475
export default {
  name: 'IndexAttendanceMobile',

  components: {
    SwitchStore,
    CloseEsc,
    FrameIn,
    EmployeeDetail,
    QrcodeStream
  },

  data() {
    return {
      userStores: null,
      accessToken: null,
      refreshToken: null,
      singleStore: null,
      loggedInUser: null,
      loadingElement: false,
      loading: false,
      ip: null,
      initStoreId: null,
      dateNow: moment().format('ddd, D MMMM YYYY'),
      clock: moment().format('HH:mm:ss'),
      dataGmt: [
        'Asia/Jakarta',
        'Asia/Makassar',
        'Asia/Jayapura'
      ],
      dataGmtLabels: [
        '(WIB)',
        '(WITA)',
        '(WIT)'
      ],
      visibleStoreList: false,
      dataEmployee: [],
      absens: false,
      tempEmployee: {
        data_absent_by_date: {
          time_going: null
        },
        data_absent_by_dates: [],
        is_in: false
      },
      form: {
        password: ''
      },
      dataKeyboard: [
        { id: 0, name: '1', value: 1 },
        { id: 3, name: '4', value: 4 },
        { id: 6, name: '7', value: 7 },
        { id: 9, name: 'C', value: 'C' },
        { id: 1, name: '2', value: 2 },
        { id: 4, name: '5', value: 5 },
        { id: 7, name: '8', value: 8 },
        { id: 10, name: '0', value: 0 },
        { id: 2, name: '3', value: 3 },
        { id: 5, name: '6', value: 6 },
        { id: 8, name: '9', value: 9 },
        { id: 11, name: 'icon', value: 'icon' },
      ],
      tempPass: [],
      moment,
      selectedGMT: localStorage.getItem('olsbowebview_selectedgmt') ? localStorage.getItem('olsbowebview_selectedgmt') : 'Asia/Jakarta',
      queryByAlpha: '',
      inputPass: '',
      loadingConfirmPin: false,
      employeeListByDate: [],
      visibleEmployeDetail: false,
      dataQr: null,
      visibleEmployeProfile: false,
      going: false,
      colorEsc: 'Primary',
      loadingHistory: false,
      showChangeEmployee: false,
      absenphone: false,
      visibleProfilePhone: false,
      dialogEmployeeDetail: false,
      visibleScan: false,
      sessionExpired: false,
      loadingBarcode: false,
      activePhone: false,
      params: {
        search_column: 'name',
        search_text: '',
        per_page: 100
      },
      loadingEmployee: false,
      locationLat: '',
      locationLon: '',
      locationIssue: false,
      locationBlock: false,
      disabledBtnPhone: true,
      timeNow: moment().format('HH:mm'),
      loadingEmployeeListByDate: false,
      loadingQR: false,
      source: 'pos',
      visibleDialogAccessibilityQR: false
    }
  },

  computed: {
    token() {
      if (this.$store.state.sessionToken) {
        return this.$store.state.tokenAttendance
      } else {
        return this.$store.getters.webviewToken
      }
    },
    lang() {
      return this.$store.getters.lang
    },
    langId() {
      return this.$store.getters.langId
    },
    selectedStore () {
      if (this.$store.getters.webviewSelectedStore) {
        return this.$store.getters.webviewSelectedStore
      } else {
        return {}
      }
      // return this.$store.getters.selectedStore
    },
    columns () {
      let columns = []
      let mid = Math.ceil(this.dataEmployee.length / 2)
      for (let col = 0; col < 2; col++) {
        columns.push(this.dataEmployee.slice(col * mid, col * mid + mid))
      }
      return columns
    },
    columnsKeyboard () {
      let columns = []
      let mid = Math.ceil(this.dataKeyboard.length / 3)
      for (let col = 0; col <= 2; col++) {
        columns.push(this.dataKeyboard.slice(col * mid, col * mid + mid))
      }
      return columns
    },
    computedAlphabets() {
      const alphabets = []
      if (this.dataEmployee.length) {
        this.dataEmployee.map(item => {
          const firstChar = item.name ? item.name.split('')[0] : null
          if (firstChar && !alphabets.includes(firstChar)) {
            alphabets.push(firstChar.toUpperCase())
          }
        })
      }
      // for (let index = 0; index < 20; index++) {
      //   alphabets.push(index)
      // }
      return alphabets
    },

    computedEmployeeList() {
      let data = []
      this.employeeListByDate.map(i => {
        this.dataEmployee.map(j => {
          if (i.id === j.id) {
            this.$set(i, 'pin', j.pin)
          }
        })
        if (i.presence.length) {
          this.$set(i, 'data_absent_by_date', {})
          i.presence_id = i.presence[0].presence_id
          i.data_absent_by_date = { ...i.presence[0] }
        } else {
          this.$set(i, 'data_absent_by_date', {
            already_absent: 0,
            time_coming: null,
            time_going: null,
            shifttime: null,
            selected_date: moment().format('YYYY-MM-DD')
          })
        }
        data.push({ ...i })
      })
      // data = { ...this.employeeListByDate}
      return data
    },

    computedEmployee() {
      if (this.queryByAlpha) {
        return this.computedEmployeeList.filter(item => {
          const firstChar = item.name ? item.name.split('')[0] : null
          if (firstChar && firstChar.toUpperCase() === this.queryByAlpha) {
            return item
          }
        })
      } else {
        return this.computedEmployeeList
      }
    },

    computedStyleImageAbsen() {
      return {
        backgroundImage: 'url(' + this.tempEmployee.photo + ')',
        width: '319px',
        height: '319px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }
    },

    computedDayOrNight () {
      let timeNow = moment(this.computedGMT.time, 'HH:mm')
      let timeNight = moment('18:00', 'HH:mm')
      let timeDay = moment('06:00', 'HH:mm')
      if (timeNow.isAfter(timeDay) && timeNow.isBefore(timeNight)) {
        return 'Day'
      } else {
        return 'Night'
      }
    },

    computedClass () {
      let night = {
        bg: 'attendance-mobile-wrapper--block attendance-mobile-wrapper--block--welcome pa-8 bg-blackview',
        pr: 'attendance-mobile-wrapper--block p-24 inputabsen-bg-blackview align-center employee-profile'
      } 
      let day = {
        bg: 'attendance-mobile-wrapper--block attendance-mobile-wrapper--block--welcome pa-8 bg-primary',
        pr: 'attendance-mobile-wrapper--block p-24 inputabsen-bg-primary align-center employee-profile'
      }
      if (this.computedDayOrNight === 'Night') {
        return {
          class_background: night.bg,
          class_profile: night.pr
        }
      } else {
        return {
          class_background: day.bg,
          class_profile: day.pr
        }
      }
    },

    computedBtnAbsenPhone () {
      return this.tempEmployee.presence.length === 2 && 
        this.tempEmployee.data_absent_by_date.already_absent === 1 && 
        this.tempEmployee.data_absent_by_date.time_going !== null
    },

    computedGMT () {
      if (this.selectedGMT) {
        const utcTime = moment.utc(this.timeNow)
        const time = utcTime.clone().tz(this.selectedGMT).format('HH:mm:ss')
        const date = utcTime.clone().tz(this.selectedGMT).format('ddd, D MMMM YYYY')
        return {
          time,
          date
        }
      } else {
        return {}
      }
    },

    computedGMTId () {
      const selectedIndex = this.dataGmt.findIndex((item) => {
        return item === this.selectedGMT
      })
      return selectedIndex + 7
    },

    computedRunningClock () {
      const clock = moment(this.clock, 'HH:mm:ss')
      return {
        time: clock.format('HH:mm'),
        second: clock.format(':ss')
      }
    }
  },

  watch: {
    absens() {
      this.inputPass = ''
    },
    selectedGMT(value) {
      if (value) {
        window.localStorage.setItem('olsbowebview_selectedgmt', value)
      }
    }
  },

  async mounted() {
    // http://0.0.0.0:7070/attendance-mobile?uid=7236&sid=122640&token=$2y$10$AAamhDBjP
    // {"uid":"7236","token":"$2y$10$AAamhDBjP","sid":"16981"}
    // $2y$10$QyJeOylSR prod token
    // ?uid=4&sid=22&token=$2y$10$QQcH5aWR1
    // 4
    // 22
    // $2y$10$QQcH5aWR1
    this.$store.commit('SET_WEBVIEW_MODE', true)
    const query = this.$route.query
    const password = query.token
    const username = query.uid
    const store_id = query.sid
    const lang = query.lang
    const localToken = JSON.parse(localStorage.getItem('olsbowebview_token'))
    const localSelectedStore = JSON.parse(localStorage.getItem('olsbowebview_selectedstore'))
    const tokenAttendance = JSON.parse(localStorage.getItem('olsbo_tokenAttendance'))
    const sessionToken = JSON.parse(localStorage.getItem('olsbo_sessionToken'))
    // device id validation
    const devId = query.dev_id ? query.dev_id : null

    this.getLocalization(lang)

    if ((password && username && store_id)) {
      this.$store.commit('REMOVE_WEBVIEW_TOKEN')
      this.$store.commit('REMOVE_WEBVIEW_SELECTED_STORE')
      // console.log('remove web token')
      this.initStoreId = await store_id
      await this.authWebview({username, password, store_id, dev_id: devId})
    } else if ((localToken && localSelectedStore) && (!password && !username && !store_id)) {
      if (this.$route.query.session_token) {
        this.getAuthAttendance(this.$route.query.session_token, devId)
      } else {
        this.getLoggedInUser()
      }
    } else if (this.$route.query.session_token) {
      this.getAuthAttendance(this.$route.query.session_token, devId)
    } else if (tokenAttendance && sessionToken) {
      this.getAuthAttendance(sessionToken, devId)
    } else {
      this.$message({
        type: 'error',
        message: 'Auth failed'
      })
      this.$router.push('/webview-unauthorized')
      return
    }
    // await this.getBarcode()
    this.colorEsc = this.computedDayOrNight === 'Night' ? 'Blackview' : 'Primary'
    this.getRealTime()
  },

  methods: {
    refreshData() {
      if (JSON.parse(localStorage.getItem('olsbo_idEmployeePresence'))) {
        let dataEmployee = JSON.parse(localStorage.getItem('olsbo_idEmployeePresence'))
        this.setEmployee(dataEmployee)
      } else {
        // this.checkPermissionGeoLocation()
        this.getClientPresenceList()
        this.getEmployee()
        this.getBarcode()
      }
    },

    authWebview(credential) {
      this.source = 'pos'
      this.loading = true
      const data = {
        uid: credential.username,
        token: credential.password,
        sid: credential.store_id,
        dev_id: credential.dev_id
      }
      this.$store.dispatch('webviewAttendanceLogin', data).then(() => {
        this.$store.dispatch('webviewFetchUserLoggedin').then(() => {
          this.$store.dispatch('webviewSetSelectedStore', credential.store_id).then(() => {
            this.refreshData()
            this.loading = false
          })
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
        this.loading = false
        this.$router.push('/webview-unauthorized')
      })
    },

    getLoggedInUser() {
      this.loading = true
      this.$store.dispatch('webviewFetchUserLoggedin').then(() => {
        this.refreshData()
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },

    async getLocalization(langId = null) {
      let fallbackLangId = langId
      if (!fallbackLangId) {
        fallbackLangId = 'id'
      }
      await HTTP.get('localization').then(response => {
        this.$store.dispatch('setLangLocally', {
          id: fallbackLangId,
          lang: response.data[fallbackLangId].admin.all
        })
      })
    },

    async getSingleStore(id) {
      this.loading = true
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        }
      }
      await HTTP.get('api/store/' + id, paramsRequest).then(async response => {
        this.singleStore = await Object.assign({}, response.data.data)
        // console.log(this.singleStore.pos_freemium)
        window.isViewingStoreId = this.singleStore
        vm.$emit('store-switched', this.singleStore)
        await this.$store.commit('SET_SELECTED_STORE', this.singleStore)
        await this.$store.commit('SET_STORE_PLAN', this.singleStore.pos_freemium)

        // set webview store
        this.$store.commit('SET_WEBVIEW_SELECTED_STORE', this.singleStore)
        this.getStoreData()
        this.refreshData()
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
      })
    },

    async getStoreData() {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/'),
        headers: headers
      }).then(response => {
        // set ini dari client
        // if (response.data.data.location_lat && response.data.data.location_lon) {
        //   this.locationLat = response.data.data.location_lat
        //   this.locationLon = response.data.data.location_lon
        // }
        this.loading = false
      })
      .catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
      })
    },

    // attendance
    getEmployee(search) {
      this.loadingEmployee = true
      let param = {
        per_page: 100
      }
      if (search) {
        param = this.params
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'attendance/employee'),
        headers: headers,
        params: param
      }).then(response => {
        this.dataEmployee = response.data.data
        this.loadingEmployee = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
        this.dataEmployee = []
        this.loadingEmployee = false
      })
    },

    getClientPresenceList(params) {
      this.loadingEmployeeListByDate = true
      let paramsData = {
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        per_page: 100
      }
      if (params) {
        paramsData = params
      }
      getClientPresenceListNew(paramsData).then(response => {
        this.employeeListByDate = response.data.data
        this.loadingEmployeeListByDate = false
      }).catch(error => {
        this.employeeListByDate = []
        this.loadingEmployeeListByDate = false
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
      })
    },

    async getBarcode() {
      this.loadingQR = true
      let paramsData = {
        is_preview: 1,
        custom_text: baseAppURL + 'attendance-mobile',
        custom_size: 145
      }
      getBarcode(paramsData).then(response => {
        this.dataQr = response.data.data.base64
        this.loadingQR = false
      }).catch(error => {
        this.loadingQR = false
        this.dataQr = null
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
      })
    },

    getAuthAttendance(session_token, dev_id) {
      this.source = 'phone'
      this.activePhone = true
      let paramsData = {
        session_token: session_token,
        dev_id
      }
      getAuthAttendance(paramsData).then(response => {
        // console.log('getAuthAttendance')
        this.accessToken = response.data.data.access_token
        this.refreshToken = response.data.data.refresh_token
        let token = {
          access_token: this.accessToken,
          refresh_token: this.refreshToken
        }
        this.$store.commit('SET_TOKEN_ATTENDANCE', token)
        this.$store.commit('SET_SESSION_TOKEN', session_token)
        // set webview token
        this.$store.commit('SET_WEBVIEW_TOKEN', token)
        //
        this.checkPermissionGeoLocation()
        this.getSingleStore(response.data.data.store_id)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
        if (this.source === 'phone' && error.statusCode === 401) {
          this.$router.push('/scan')
          this.sessionExpired = true
        } else {
          this.$router.push('/webview-unauthorized')
        }
      })
    },

    async setEmployee (data) {
      this.absens = await true
      this.tempEmployee = await { ...data }
      if (!this.tempEmployee.data_absent_by_dates) {
        this.tempEmployee.data_absent_by_dates = []
      }
      this.visibleEmployeProfile = true
      this.visibleProfilePhone = true
      this.showChangeEmployee = false
      if (this.activePhone) {
        this.$store.commit('SET_ID_EMPLOYEE_PRESENCE', this.tempEmployee)
      }
      this.getClientEmployeeDetail()
      // remove autofocus doesnt work as expected on mobile
      // this.$refs.inputPass.focus()
    },

    setPassword(item) {
      // console.log(item)
      if (item.id !== 9 && item.id !== 11 && this.inputPass.length < 6) {
        this.inputPass = this.inputPass + item.name
      } else if (item.id === 9) {
        this.inputPass = ''
      } else if (item.id === 11 && this.inputPass.length) {
        const inputPassArr = this.inputPass.split('')
        inputPassArr.pop()
        this.inputPass = inputPassArr.join('')
      }
    },

    handleClickAlphabet(item) {
      if (this.queryByAlpha === item) {
        this.queryByAlpha = ''
      } else {
        this.queryByAlpha = item
      }
    },

    handleChangeInputPass(char) {
      // console.log(parseInt(char), parseInt(char) === NaN)
      if (isNaN(char)) {
        const inputPassArr = this.inputPass.split('')
        inputPassArr.pop()
        this.inputPass = inputPassArr.join('')
      }
    },

    confirmPin() {
      if (this.source === 'phone') {
        this.checkPermissionGeoLocation()
      }
      if (this.inputPass.length === 6) {
        if (this.tempEmployee.pin === this.inputPass) {
          if (!this.going) {
            this.absentcoming()
          } else {
            this.absentgoing()
          }
        } else {
          this.$message({
            type: 'error',
            message: 'You\'ve entered the wrong pin number'
          })
          this.inputPass = ''
        }
      }
    },

    absentcoming() {
      this.loadingConfirmPin = true
      absentcoming({
        id: this.tempEmployee.id,
        pin: this.inputPass,
        lat: this.locationLat,
        lon: this.locationLon,
        gmt: this.computedGMTId,
        source: this.source
      }).then(response => {
        this.loadingConfirmPin = false
        this.going = false
        this.$set(this.tempEmployee, 'clock_in', moment(this.clock, 'HH:mm:ss').format('HH:mm'))
        this.$set(this.tempEmployee, 'is_in', true)
        setTimeout(() => {
          this.refreshData()
        }, 2000)
      }).catch(error => {
        this.loadingConfirmPin = false
        this.loadingConfirmPin = false
        if (error.statusCode === 403) {
          this.locationIssue = true
        } else {
          this.$message({
            type: 'error',
            message: this.parseErrorMessage(error)
          })
        }
      })
    },

    absentgoing() {
      // console.log(this.tempEmployee)
      this.loadingConfirmPin = true
      absentgoing({
        id: this.tempEmployee.id,
        presence_id: this.tempEmployee.presence_id,
        pin: this.inputPass,
        lat: this.locationLat,
        lon: this.locationLon,
        gmt: this.computedGMTId,
        source: this.source
      }).then(response => {
        this.loadingConfirmPin = false
        this.going = true
        this.$set(this.tempEmployee, 'clock_in', moment(this.clock, 'HH:mm:ss').format('HH:mm'))
        this.$set(this.tempEmployee, 'is_in', true)
        setTimeout(() => {
          this.refreshData()
        }, 2000)
      }).catch(error => {
        this.loadingConfirmPin = false
        if (error.statusCode === 403) {
          this.locationIssue = true
        } else {
          this.$message({
            type: 'error',
            message: this.parseErrorMessage(error)
          })
        }
      })
    },

    getClientEmployeeDetail() {
      getClientEmployeeDetail({
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        id: this.tempEmployee.id
      }).then(response => {
        if (response.data.data.presence.length) {
          let index = response.data.data.presence.length - 1
          this.tempEmployee.presence_id = response.data.data.presence[index].presence_id
          this.tempEmployee.data_absent_by_date = { ...response.data.data.presence[index] }
          if (response.data.data.presence[index].already_absent === 0) {
            this.going = false
          } else if (response.data.data.presence[index].already_absent === 1 && response.data.data.presence[index].time_going !== null) {
            this.going = false
          } else {
            this.going = true
          }
        }
      })
    },

    async showEmployeeDetail(data,phone) {
      this.loadingHistory = true
      this.tempEmployee = await { ...data }
      await this.$set(this.tempEmployee, 'data_absent_by_dates', [])
      await getClientPresenceListNew({
        start_date: moment().subtract(7, 'd').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        employee_id: this.tempEmployee.id
      }).then(response => {
        this.tempEmployee.data_absent_by_dates = response.data.data
        if (phone) {
          this.dialogEmployeeDetail = true
        }
        if (this.activePhone) {
          this.$store.commit('SET_ID_EMPLOYEE_PRESENCE', this.tempEmployee)
        }
        this.loadingHistory = false
      }).catch(error => {
        this.loadingHistory = false
        this.$message({
          type: 'error',
          message: this.parseErrorMessage(error)
        })
      })
      // this.absens = true
      this.visibleEmployeProfile = true
      this.visibleEmployeDetail = true
      this.visibleProfilePhone = true
      this.showChangeEmployee = false
    },

    handleBack(mobile) {
      if (mobile) {
        this.showChangeEmployee = !this.showChangeEmployee
      }
      if (this.visibleEmployeDetail && !this.absens) {
        this.visibleEmployeDetail = false
        this.visibleEmployeProfile = false
        // this.tempEmployee = {}
        this.colorEsc = this.computedDayOrNight === 'Night'? 'Blackview' :'Primary'
      } else if (this.visibleEmployeDetail && this.absens) {
        this.visibleEmployeDetail = false
      } else {
        this.visibleEmployeDetail = false
        this.visibleEmployeProfile = false
        this.absens = false
        this.$store.commit('REMOVE_ID_EMPLOYEE_PRESENCE')
        this.colorEsc = this.computedDayOrNight === 'Night'? 'Blackview' :'Primary'
      }
    },

    getDurationLabel(item) {
      if (!item.data_absent_by_date.time_going) {
        return {
          class_name: 'absent-success',
          label: 'Datang ' + item.data_absent_by_date.time_coming
        }
      } else {
        const coming = new moment(item.data_absent_by_date.time_coming, 'HH:mm')
        const going = new moment(item.data_absent_by_date.time_going, 'HH:mm')
        const duration = moment.duration(going.diff(coming))
        return {
          class_name: 'absent-finished',
          label: 'Durasi ' + parseFloat(duration.as('hours')).toFixed(2) + ' jam'
        }
      }
    },

    getDurationLabelPhone(item) {
      if (!item.time_going && item.time_coming) {
        return {
          class_name: 'absent-success',
          icon: 1,
          label: item.time_coming
        }
      } else if (!item.time_going && !item.time_coming) {
        return {
          class_name: '',
          icon: 0,
          label: 'Belum absen'
        }
      } else if (item.time_going && item.time_coming) {
        const coming = new moment(item.time_coming, 'HH:mm')
        const going = new moment(item.time_going, 'HH:mm')
        const duration = moment.duration(going.diff(coming))
        return {
          class_name: 'absent-finished',
          icon: 2,
          label: parseFloat(duration.as('hours')).toFixed(2) + ' jam'
        }
      }
    },

    handleShowProfile (data) {
      this.colorEsc = ''
      this.going = false
      this.setEmployee(data)
    },

    handleBackPhone (change) {
      this.absenphone = false
      this.absens = false
      this.visibleEmployeProfile = false
      
      this.visibleEmployeDetail = false
      if (!change) {
        this.setEmployee(this.tempEmployee)
        this.visibleProfilePhone = true
      } else {
        this.visibleProfilePhone = false
        this.$store.commit('REMOVE_ID_EMPLOYEE_PRESENCE')
      }
    },

    handleClose () {
      this.tempEmployee.is_in = false
      if (this.absenphone) {
        this.handleBackPhone(false)
      } else {
        this.handleBack()
      }
    },

    showScanner (data) {
      if (data) {
        setTimeout(() => {
          this.loadingBarcode = true
        }, 500)
        setTimeout(() => {
          this.loadingBarcode = false
          this.visibleScan = false
          this.absens = false
          window.open(data,'_top')
        }, 1200)
      }
    },

    handleShowAbsenPhone () {
      if (this.source === 'phone') {
        this.loadingConfirmPin = true
        if (JSON.parse(localStorage.getItem('olsbo_sessionToken'))) {
          let paramsData = {
            session_token: JSON.parse(localStorage.getItem('olsbo_sessionToken'))
            // session_token: 'adsadas8778'
          }
          getAuthAttendance(paramsData).then(response => {
            if (response.data.data.access_token) {
              this.absenphone = true
              this.absens = false
              this.loadingConfirmPin = false
            }
          }).catch(error => {
            this.loadingConfirmPin = false
            this.$message({
              type: 'error',
              message: this.parseErrorMessage(error)
            }) 
            if (error.statusCode === 401) {
              this.sessionExpired = true
            }
          })
        } else {
          this.loadingConfirmPin = false
          this.sessionExpired = true
        }
      } else {
        this.absenphone = true
        this.absens = false
      }
    },

    checkPermissionGeoLocation () {
      // console.log(this.source, navigator.permissions)
      if (this.source !== 'pos' && navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({
            name: 'geolocation'
        }).then((result) => {
          // console.log(result)
          if (result.state === 'granted') {
            this.getGeolocation()
          } else if (result.state === 'prompt') {
            this.getGeolocation()
          } else if (result.state === 'denied') {
            this.locationBlock = true
          }
        }).catch(error => {
          alert(error)
        })
      } else {
        // always call this.getLocation as doesn't work on non chrome browsers [navigator.permissions.query]
        this.getGeolocation()
      }
    },

    getGeolocation(enableHighAccuracy = true) {
      const options = {
        enableHighAccuracy,
        timeout: 5000
      }
      const handleSuccess = (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // console.log(pos)
        this.locationLat = pos.lat
        this.locationLon = pos.lng
      }
      const handleError = (err) => {
        this.$message({
          type: 'error',
          message: `ERROR fetching location coordinate: ${err.message}`
        })
        // this.getGeolocation(false)
      }
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options)
    },

    handleSearchEmployee (query) {
      let params = {
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        search_column: 'name',
        search_text: query,
        per_page: 100
      }
      if (params.search_text.length > 0) {
        this.getClientPresenceList(params)
      } else {
        this.$delete(params, 'search_column')
        this.$delete(params, 'search_text')
        this.getClientPresenceList(params)
      }
    },

    reloadPage () {
      window.location.reload()
    },

    getRealTime () {
      timeserver().then(response => {
        this.timeNow = response.data.data.date
        this.dateNow = response.data.data.date
        this.setRunningClock()
      })
    },

    setQueryString (queryString) {
      if (queryString) {
        const dFn = debounce(queryString => this.handleSearchEmployee(queryString), '400ms')
        dFn(queryString)
      } else {
        this.handleSearchEmployee('')
      }
    },

    setRunningClock () {
      const startTime = moment.utc(this.timeNow)
      const startRunnigClock = () => {
        var today = startTime.tz(this.selectedGMT).add(1, 'seconds')
        var h = today.format('HH')
        var m = today.format('mm')
        var s = today.format('ss')
        this.clock = h + ':' + m + ':' + s
        setTimeout(startRunnigClock, 1000)
      }
      startRunnigClock()
    },

    parseErrorMessage(error) {
      return 'Error code: ' + error.statusCode + ' ' + error.message
    }
  }
}
</script>
