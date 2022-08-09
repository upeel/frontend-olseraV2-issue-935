<template>
  <div class="shippings" id="settings">
    <el-card
      v-loading="loadingSetting"
      class="box-card el-card-null">
      <div class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="icon-timer" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ $lang[langId].cancel_automatically }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.use_cancel_automatically ? dataSetting.cancel_automatically : $lang[langId].inactive }}</span>
        </div>
        <div class="pointer" @click="showDialogTimer">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
      <div class="flex-container like-table-wrapper--item p-20">
        <div class="container-icon">
          <svg-icon icon-class="ico-payon-thespot" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ $lang[langId].payon_thespot }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.use_pay_on_the_spot ? $lang[langId].active : $lang[langId].inactive }}</span>
        </div>
        <div class="pointer">
          <el-switch
            v-model="dataSetting.use_pay_on_the_spot"
            :active-value="1"
            :inactive-value="0"
            @change="save(2)">
          </el-switch>
        </div>
      </div>
      <div class="flex-container like-table-wrapper--item p-20">
        <div class="container-icon">
          <svg-icon icon-class="ico-payon-thespot" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ $lang[langId].use_payment_va }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.use_payment_va ? $lang[langId].active : $lang[langId].inactive }}</span>
        </div>
        <div class="pointer">
          <el-switch
            v-model="dataSetting.use_payment_va"
            :active-value="1"
            :inactive-value="0"
            @change="save(2)">
          </el-switch>
        </div>
      </div>

      <template >
        <div class="flex-container like-table-wrapper--item p-20">
          <div class="container-icon">
            <svg-icon icon-class="ico-payon-thespot" class="font-20" />
          </div>
          <div class="full-width">
            <div class="font-14 font-semi-bold">{{ 'Minimum pembayaran virtual akun' }}</div>
            <span class="font-12 color-grey--placeholder">{{ dataSetting.active_minimum_payment_amount_va ? dataSetting.fminimum_payment_amount_va : $lang[langId].inactive }}</span>
          </div>
           <div class="pointer" @click="showDialogMinVa">
            <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
          </div>
        </div>
      </template>
      
      <div v-if="selectedStore.pos_resto_mode === 1" class="flex-container like-table-wrapper--item p-20">
        <div class="container-icon">
          <svg-icon icon-class="icon-feather-key" class="font-20" />
        </div>
        <div class="full-width" >
          <div class="font-14 font-semi-bold">{{ $lang[langId].allow_dine_in_without_login }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.no_auth_dinein ? $lang[langId].active : $lang[langId].inactive }}</span>
        </div>
        <div class="pointer">
          <el-switch
            v-model="dataSetting.no_auth_dinein"
            :active-value="1"
            :inactive-value="0"
            @change="save(2)">
          </el-switch>
        </div>
      </div>
      <div class="flex-container like-table-wrapper--item p-20" v-if="selectedStore.pos_resto_mode === 1">
        <div class="container-icon">
          <svg-icon icon-class="icon-price-dynamic" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ $lang[langId].dynamic_order_price }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.pos_dynamic_price_can_order ? $lang[langId].active : $lang[langId].inactive }}</span>
        </div>
        <div class="pointer">
          <el-switch
            v-model="dataSetting.pos_dynamic_price_can_order"
            :active-value="1"
            :inactive-value="0"
            @change="save(2)">
          </el-switch>
        </div>
      </div>
    </el-card>

    <el-card
      v-loading="loadingSetting"
      class="box-card el-card-null">
      <div class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="ico-whatsapp" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">Whatsapp</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.whatsapp ? dataSetting.whatsapp : $lang[langId].there_is_no }}</span>
        </div>
        <div class="pointer" @click="showDialogWA">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
      <div class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="globe" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">Time zone</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.timezone_id ? '(GMT ' + dataSetting.timezone.gmt_offset + ') ' + dataSetting.timezone.timezone : $lang[langId].there_is_no }}</span>
        </div>
        <div class="pointer" @click="showDialogTimezone">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
      <!-- <div class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="icon-fork-dinein" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">Pengecekan Dine In</div>
          <span v-if="dataSetting.use_radius_checking_dinein === 1" class="font-12 color-grey--placeholder">{{ rootLang.use_radius }} (100m)</span>
          <span v-if="dataSetting.use_unique_code_checking_dinein === 1" class="font-12 color-grey--placeholder">{{ rootLang.use_unicode_checking }}</span>
        </div>
        <div class="pointer" @click="showDialogCheckDinein">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div> -->
      <div
        v-if="(selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2' || selectedStore.url_id === 'testokoeemailnotfi') && dataSetting.tnc_store_default"
        class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="icon-feather-file-text" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ rootLang.tnc_store }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.tnc_store_default.last_updated }}</span>
        </div>
        <div class="pointer" @click="showTnc">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
      <div v-if="selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2' || selectedStore.url_id === 'testokoeemailnotfi'" class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="icon-feather-truck" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ rootLang.delivery }}</div>
        </div>
        <div class="pointer" @click="showDeliverySetting">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
      <div v-if="selectedStore.url_id === 'setdemo1' || selectedStore.url_id === 'allinolsera2' || selectedStore.url_id === 'testokoeemailnotfi'" 
      class="flex-container p-20 like-table-wrapper--item">
        <div class="container-icon">
          <svg-icon icon-class="icon-domain" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ rootLang.private_domain }}</div>
          <span class="font-12 color-grey--placeholder">{{ dataSetting.ext_domain }}</span>
        </div>
        <div class="pointer" @click="showDialogPrivateDomain">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
    </el-card>

    <el-card
      v-loading="loadingBanner"
      class="box-card">
      <div class="flex-container">
        <div class="container-icon">
          <svg-icon icon-class="icon-banner" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">Banner Online Order</div>
          <span class="font-12 color-grey--placeholder">{{ $lang[langId].active }}</span>
        </div>
        <div class="pointer" @click="handleEditBanner">
          <svg-icon icon-class="edit-2" class="font-20 color-primary" />
        </div>
      </div>
      <div class="flex-container mt-16">
        <div class="full-width mr-8">
          <!--
            BUTTON WARNA ABU2 GUNAKAN TYPE="INFO" saja
          -->
          <el-button class="btn-block" type="info" @click="sidebarBanner = true">{{ $lang[langId].show_banner }}</el-button>
        </div>
        <div class="full-width ml-8">
          <!--
            BUTTON WARNA ABU2 GUNAKAN TYPE="INFO" saja
          -->
          <el-button :loading="loadingDownload" class="btn-block" type="info" @click="getBanner(true)"> Download </el-button>
        </div>
      </div>
    </el-card>

    <el-row v-loading="loading" :gutter="10">
      <el-col :md="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>{{ $lang[langId].theme }}</h4>
          </div>

          <div class="card-body">
            <el-table
              :data="dataTheme"
              stripe>
              <el-table-column>
                <template slot-scope="scope">
                  <el-radio
                    v-model="radio"
                    :label="scope.row.id"
                    @change="handleSetColor(scope.row)">
                    {{ scope.row.name }}
                  </el-radio>
                </template>
              </el-table-column>

              <el-table-column>
                <template slot-scope="scope">
                  <div class="flex-container" style="justify-content: flex-end;">
                    <div class="circle-color" :style="scope.row.style1"></div>
                    <div class="circle-color" :style="scope.row.style2"></div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>

      <el-col :md="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>{{ $lang[langId].theme }}</h4>
            <!-- <div class="svg_preview">
              <el-button type="text" @click="handleShowWeb">
                <svg-icon icon-class="external-link" style="width:24px; height:24px;"/>
              </el-button>
            </div> -->
          </div>
          <div >
            <group-form :color1="color1" :color2="color2" style="width: 100%; height: 408px;"></group-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- v-if="selectedStore.pos_resto_mode && (accessByEmail.includes(loggedInUser.email) || accessByStore.includes(selectedStore.url_id) || stageLevel === 'sit')" -->
    <!-- <el-card
      v-loading="loadingBanner"
      v-if="selectedStore.pos_resto_mode"
      class="box-card el-card-null">
      <div class="flex-container p-20">
        <div class="container-icon">
          <svg-icon icon-class="icon-banner" class="font-20" />
        </div>
        <div class="full-width">
          <div class="font-14 font-semi-bold">{{ rootLang.banner_dinein }}</div>
          <span class="font-12 color-grey--placeholder">{{ rootLang.banner_dinein_note }}</span>
        </div>
        <div class="pointer" @click="showDialogLayout = true">
          <svg-icon icon-class="edit-2" class="font-20 color-primary"/>
        </div>
      </div>
    </el-card> -->

    <div
      v-if="sidebarBanner"
      class="offscreen-right-sidebar">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left">
          <span class="ml-8">Banner Online Order</span>
          <close-esc @close="sidebarBanner = false" />
        </div>
        <div>
          <div>
            <el-button
              :loading="loadingDownload"
              type="info"
              class="btn-block"
              @click="getBanner(true)">
              Download
            </el-button>
          </div>
          <div class="mt-24">
            <img :src="dataBanner.base64">
          </div>
        </div>
      </div>
    </div>

    <div v-if="isEdit" class="floating_div" :style="computedRes">
      <floating-div @confirm="setColor" @cancel="setCancel"></floating-div>
    </div>

    <el-dialog 
      :visible.sync="dialogTimer"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ $lang[langId].cancel_automatically }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogTimer = false">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingAuto" type="success" @click="save(2)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 color-grey--bg flex-container p-16">
            <div>
              <svg-icon icon-class="clock" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8">
              Jika aktif, pesanan akan dibatalkan jika pelanggan tidak membayar pesanan tersebut pada waktu yang ditentukan
            </div>
          </div>
          <div class="flex-container p-8 border border--input mt-16" style="border-radius: 2px">
            <div class="font-16 font-bold full-width">{{ $lang[langId].turn_on_auto_cancel_order }}</div>
            <div class="text-right" style="width: 120px;">
              <strong>{{ formEditCancelAuto.use_cancel_automatically === 1 ? $lang[langId].yes : $lang[langId].no }}</strong>
              <el-switch
                v-model="formEditCancelAuto.use_cancel_automatically"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </div>
          </div>
          <div class="mt-16">
            <div class="font-12">{{ $lang[langId].payment_duration }}</div>
            <el-time-select
              :disabled="formEditCancelAuto.use_cancel_automatically ? false : true"
              :placeholder="$lang[langId].pick_time"
              v-model="cancel_automatically"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '12:00'
              }"
              style="width: 100%; !important">
            </el-time-select>
          </div>
        </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogWhatsapp"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Whatsapp
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogWhatsapp = false">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingAuto" type="success" @click="save(2)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 color-grey--bg flex-container p-16">
            <div>
              <svg-icon icon-class="globe" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8">
              Nomor Whatsapp ini akan digunakan pelanggan untuk menghubungi toko Anda pada layanan Online Order
            </div>
          </div>
          <div class="mt-16">
            <div class="font-12">Nomor Whatsapp</div>
            <phone-number-input
              v-model="formEditWhatsapp.whatsapp"
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
          </div>
        </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogEditTimezone"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Time Zone
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogEditTimezone = false">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingTimezone" type="success" @click="save(4)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 color-grey--bg flex-container p-16">
            <div>
              <svg-icon icon-class="globe" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8">
              Time zone ini digunakan sebagai acuan waktu pada layanan Online Order Anda
            </div>
          </div>
          <div class="mt-16">
            <span class="font-14">Waktu Sekarang</span>
            <div class="font-14">{{ computedGMT.time ? computedGMT.time : timeNow }}</div>
          </div>
          <div class="mt-16">
            <div class="font-12">Time zone</div>
            <el-select
              class="inline-form"
              style="width: 100% !important"
              v-model="formEditTimezone.timezone_id"
              filterable
              @change="setSelectedGMT"
              :placeholder="lang.please_select" size="small">
              <el-option
                v-for="item in dataZone"
                :key="item.id"
                :label="'(GMT ' + item.gmt_offset + ') ' + item.timezone"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogEditDineinCheck"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Pengecekan Dine In
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogEditDineinCheck = false">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingDineinCheck" type="success" @click="save(5)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 color-grey--bg flex-container p-16">
            <div>
              <svg-icon icon-class="globe" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8 word-break">
              Pengecekan Dine In dilakukan untuk mengetahui apakah pelanggan memesan langsung di toko Anda
            </div>
          </div>
          <div class="mt-16">
            <el-radio-group v-model="dineinChecking" class="full-width">
              <div class="flex-container mr-8 p-8 radio-custom--no-shadow" @click="handleSetDineinChecking(0)">
                <div class="font-16 font-bold full-width pointer">{{ rootLang.use_radius }} (100m)</div>
                <el-radio :label="0" :class="dineinChecking === 0 ? 'radio-custom-normal radio-custom-normal--is-checked--no-background' : 'radio-custom-normal'">
                  <span></span>
                </el-radio>
              </div>
              <div class="flex-container mr-8 mt-8 p-8 radio-custom--no-shadow" @click="handleSetDineinChecking(1)">
                <div class="font-16 font-bold full-width pointer">{{ rootLang.use_unicode_checking }}</div>
                <el-radio :label="1" :class="dineinChecking === 1 ? 'radio-custom-normal radio-custom-normal--is-checked--no-background' : 'radio-custom-normal'">
                  <span></span>
                </el-radio>
              </div>
            </el-radio-group>
          </div>
          <div v-if="dineinChecking === 1" class="mt-8 container-unicode-dinein">
            <div class="unicode full-width">{{ formEditDineinCheck.unique_code_checking_dinein }}</div>
            <div class="pointer" @click="refreshCode">
              <svg-icon icon-class="icon-material-refresh" class="font-32" />
            </div>
          </div>
        </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogBanner"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            Banner Online Order
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="handleCancelBanner">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingQr" type="success" @click="save(3)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="mt-16">
            <div class="font-12">{{ $lang[langId].link_order }}</div>
            <el-input v-model="formEdit.link_order" v-debounce:300ms="getQrcode" id="link_order">
              <div class="pointer mr-8" slot="suffix" @click="copyText">
                <svg-icon icon-class="feather-copy" class="font-20 color-primary mt-8" />
              </div>
            </el-input>
          </div>
          <div class="font-12 mt-16">{{ $lang[langId].qr_code_order }}</div>
          <div class="border border--input flex-container" style="align-items: unset !important">
            <div class="full-width">
              <img :src="dataQr.base64">
            </div>
            <div class="mt-8 mr-8 pointer" @click="downloadBase">
              <svg-icon icon-class="feather-download" class="font-20 color-primary" />
            </div>
          </div>
        </div>
    </el-dialog>

    <el-dialog 
      :visible.sync="dialogMinVa"
      :show-close="false"
      custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ 'Minimum pembayaran virtual akun' }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogMinVa = false">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingAuto" type="success" @click="save(2)" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="radius-10 color-grey--bg flex-container p-16">
            <div>
              <svg-icon icon-class="clock" class="font-20 color-grey--icon"/>
            </div>
            <div class="ml-8">
              <!-- Jika aktif, pesanan akan dibatalkan jika pelanggan tidak membayar pesanan tersebut pada waktu yang ditentukan -->
            </div>
          </div>
          <div class="flex-container p-8 border border--input mt-16" style="border-radius: 2px">
            <div class="font-16 font-bold full-width">{{ 'Aktifkan minimal pembayaran virtual akun' }}</div>
            <div class="text-right" style="width: 120px;">
              <strong>{{ formEditMinVa.active_minimum_payment_amount_va === 1 ? $lang[langId].yes : $lang[langId].no }}</strong>
              <el-switch
                v-model="formEditMinVa.active_minimum_payment_amount_va"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </div>
          </div>
          <div class="mt-16">
            <div class="font-12">{{ 'Minimum pembayaran' }}</div>
            <input-money class="full-width" v-model="formEditMinVa.minimum_payment_amount_va" />
          </div>
        </div>
    </el-dialog>

    <dialog-layout
      :show="showDialogLayout"
      @close="showDialogLayout = false" />

    <dialog-tnc-store 
      ref="dialogtnc"
      :show="showDialogTnc"
      :data-setting="dataTnc"
      @close="closeDialogTnc" />

    <dialog-delivery-setting 
      ref="dialogdelivery"
     :show="showDialogDelivery"
     :data-setting="dataSetting"
     @close="handleCloseDeliverySetting"
     />

     <dialog-private-domain
      :show="dialogPrivateDomain"
      :form-edit-domain="formEditDomain"
      :loading-domain="loadingDomain"
      @save="handleSavePrivateDomain"
      @close="dialogPrivateDomain = false" />

  </div>
</template>

<script>
const moment = require('moment-timezone')

import basicComputedMixin from '@/mixins/basicComputedMixin'
import FloatingDiv from '../../FloatingDiv'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import GroupForm from './preview'
import CloseEsc from '@/components/modules/CloseEsc'
import DialogLayout from './setting/dialogLayout'
import DialogTncStore from './setting/dialogTncStore'
import DialogDeliverySetting from './setting/dialogDeliverySetting'
import DialogPrivateDomain from './setting/dialogPrivateDomain'

import InputMoney from '@/components/InputMoneyV2'

import { downloadQr, bannerSetting } from '@/api/onlineorder'
import { getTimezone, fetch as fetchStore } from '@/api/generalsetting'

export default {
  name: 'SettingTheme',
  components: {
    FloatingDiv,
    GroupForm,
    CloseEsc,
    DialogLayout,
    DialogTncStore,
    DialogDeliverySetting,
    DialogPrivateDomain,
    InputMoney
  },
  mixins: [basicComputedMixin],
  data() {
    return {
      loading: true,
      saved: false,
      data: [],
      isEdit: false,
      radio: 0,
      color1: '',
      color2: '',
      dataSetting: {},
      tempColor: {},
      cancel_automatically: '',
      dialogTimer: false,
      dialogBanner: false,
      dataBanner: {},
      dataQr: {},
      loadingQr: false,
      loadingAuto: false,
      sidebarBanner: false,
      loadingDownload: false,
      formEdit: {
        base64: ''
      },
      formEditCancelAuto: {},
      processEnv: process.env,
      loadingBanner: false,
      loadingSetting: false,
      dialogWhatsapp: false,
      formEditWhatsapp: {},
      loadingTimezone: false,
      dataZone: [],
      dialogEditTimezone: false,
      formEditTimezone: {},
      formEditDomain: {},
      selectedGMT: '',
      timeNow: moment().format('HH:mm a, dddd DD MMM YYYY'),
      showDialogLayout: false,
      dialogEditDineinCheck: false,
      formEditDineinCheck: {},
      loadingDineinCheck: false,
      dineinChecking: 0,
      dialogPrivateDomain: false,
      visiblePrivateDomainDesc: false,
      loadingDomain: false,
      showDialogTnc: false,
      dataTnc: {},
      showDialogDelivery: false,
      dataStore: {},
      dialogMinVa: false,
      formEditMinVa: {}
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    },
    dataTheme() {
      return [
        {
          id: 1,
          name: 'Warna 1',
          style1: 'background: #38B8FF; margin-right: 8px',
          style2: 'background: #76CCFC',
          color1: '#38B8FF',
          color2: '#76CCFC'
        },
        {
          id: 2,
          name: 'Warna 2',
          style1: 'background: #009EFD; margin-right: 8px',
          style2: 'background: #2AF598',
          color1: '#009EFD',
          color2: '#2AF598'
        },
        {
          id: 3,
          name: 'Warna 3',
          style1: 'background: #FDA085; margin-right: 8px',
          style2: 'background: #F6D365',
          color1: '#FDA085',
          color2: '#F6D365'
        },
        {
          id: 4,
          name: 'Warna 4',
          style1: 'background: #E50025; margin-right: 8px',
          style2: 'background: #F8BB08',
          color1: '#E50025',
          color2: '#F8BB08'
        },
        {
          id: 5,
          name: 'Warna 5',
          style1: 'background: #A71F2D; margin-right: 8px',
          style2: 'background: #D70B20',
          color1: '#A71F2D',
          color2: '#D70B20'
        },
        {
          id: 6,
          name: 'Warna 6',
          style1: 'background: #596164; margin-right: 8px',
          style2: 'background: #868F96',
          color1: '#596164',
          color2: '#868F96'
        },
        {
          id: 7,
          name: 'Warna 7',
          style1: 'background: #111111; margin-right: 8px',
          style2: 'background: #F1F21B',
          color1: '#111111',
          color2: '#F1F21B'
        },
        {
          id: 8,
          name: 'Warna 8',
          style1: 'background: #764BA2; margin-right: 8px',
          style2: 'background: #667EEA',
          color1: '#764BA2',
          color2: '#667EEA'
        }
      ]
    },
    getMinutes() {
      var str = '12:23:00'
      var p = str.split(':'),
        s = 0, m = 1;

      while (p.length > 0) {
          s += m * parseInt(p.pop(), 10);
          m *= 60;
      }

      return s;
    },
    computedGMT () {
      if (this.selectedGMT) {
        const utcTime = moment.tz(this.timeNow)
        const time = utcTime.clone().tz(this.selectedGMT).format('HH:mm a, dddd DD MMM YYYY')
        const date = utcTime.clone().tz(this.selectedGMT).format('ddd, D MMMM YYYY')
        return {
          time,
          date
        }
      } else {
        return {}
      }
    },
    loggedInUser () {
      return this.$store.getters.loggedInUser
    },
    stageLevel() {
      return process.env.ENV_CONFIG
    },
    accessByEmail () {
      return ['riko@olsera.com', 'harbun.olsera@gmail.com', 'akmal@olsera.com']
    },
    accessByStore () {
      return ['texturecafe', 
      'cincaicafe',
      'aftertaste',
      'samasama',
      'senewentimemenanggal',
      'djuries',
      'ayampenyetrialovinainn',
      'haicoffeepadangpanjang',
      'warkopkj',
      'restocaksisseafood',
      'waroengkebab',
      'koffienation',
      'nonacoffee9',
      'demorestobali',
      'jatim007',
      'jktfnb',
      'ironbee',
      'pelipurlaracoffee',
      'kayanacoffee',
      'demofnbmks',
      'omnicafe',
      'basecampcafebtm',
      'dapoersasak',
      'dsl',
      'warungdadakan',
      'warungdadakancitraland',
      'bakupi',
      'haltefoodbakery',
      'setdemo1']
    },

    computedRes () {
      // var elmt = document.getElementsByClassName('tab-content')[0].offsetWidth
      var w = document.getElementsByClassName('tab-content')[0].offsetWidth
      // var h = window.innerHeight
      let cls = 'max-width: ' + w + 'px; padding-right: unset !important'
      return cls
    }
  },

  mounted() {
    this.refreshView()
  },

  methods: {
    refreshView() {
      this.getDataColor()
      this.getSetting()
      this.getBanner()
      this.getListTimezone()
      this.getStoreData()
    },

    handleSetColor(data) {
      this.color1 = 'fill: ' + data.color1
      this.color2 = 'fill: ' + data.color2
      this.isEdit = true
      this.tempColor = data
    },

    setColor () {
      // this.color1 = 'fill: ' + this.tempColor.color1
      // this.color2 = 'fill: ' + this.tempColor.color2
      this.isEdit = false
      this.save(1)
    },

    getDataColor () {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/color'),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.dataTheme.map(i => {
          response.data.data.map(j => {
            if (i.id === j.id) {
              var col = j.color.split(',')
              i.style1 = 'background:' + col[0] + '; margin-right: 8px'
              i.style2 = 'background: ' + col[1]
              i.color1 = col[0]
              i.color2 = col[1]
              i.name = j.name
            }
          })
        })
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.message,
          message: error.string
        })
      })
    },

    getSetting () {
      this.loadingSetting = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers
      }).then(response => {
        this.dataSetting = response.data.data
        this.cancel_automatically = response.data.data.cancel_automatically
        this.radio = response.data.data.online_color_id
        var col = response.data.data.online_color.split(',')
        this.color1 = 'fill: ' + col[0]
        this.color2 = 'fill: ' + col[1]
        this.loadingSetting = false
        if (this.dataSetting.use_radius_checking_dinein === 1) {
          this.dineinChecking = 0
        }
        if (this.dataSetting.use_unique_code_checking_dinein === 1) {
          this.dineinChecking = 1
        }
        this.getQrcode()
      }).catch(error => {
        this.loadingSetting = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getBanner (download) {
      if (download) {
        this.loadingDownload = true
      } else {
        this.loadingBanner = true
      }
      let params = {
        is_preview: 1
      }
      bannerSetting(params).then(response => {
        this.dataBanner = response.data.data
        this.loadingBanner = false
        if (download) {
          var link = document.createElement('a')
          document.body.appendChild(link)
          link.setAttribute('href', response.data.data.base64)
          link.setAttribute('download', 'banner_online_order.jpeg')
          link.click()
          document.body.removeChild(link)
          this.loadingDownload = false
        }
      }).catch(error => {
        this.loadingBanner = false
        this.loadingDownload = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    save(setting) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      var data = {}
      if (setting === 1) {
        this.loading = true
        data = {
          online_color_id: this.tempColor.id
        }
      } else if (setting === 2) {
        this.loadingAuto = true
        data = {
          cancel_automatically: this.cancel_automatically,
          use_cancel_automatically: this.formEditCancelAuto.use_cancel_automatically,
          use_pay_on_the_spot: this.dataSetting.use_pay_on_the_spot,
          whatsapp: this.formEditWhatsapp.whatsapp,
          use_payment_va: this.dataSetting.use_payment_va,
          no_auth_dinein: this.dataSetting.no_auth_dinein,
          pos_dynamic_price_can_order: this.dataSetting.pos_dynamic_price_can_order,
          active_minimum_payment_amount_va: this.formEditMinVa.active_minimum_payment_amount_va,
          minimum_payment_amount_va: this.formEditMinVa.minimum_payment_amount_va
        }
      } else if (setting === 3) {
        this.loadingQr = true
        data = {
          link_order: this.formEdit.link_order
        }
      } else if (setting === 4) {
        this.loadingTimezone = true
        data = {
          cancel_automatically: this.cancel_automatically,
          use_cancel_automatically: this.formEditCancelAuto.use_cancel_automatically,
          use_pay_on_the_spot: this.dataSetting.use_pay_on_the_spot,
          timezone_id: this.formEditTimezone.timezone_id,
          use_payment_va: this.dataSetting.use_payment_va
        }
      } else if (setting === 5) {
        this.loadingDineinCheck = true
        if (this.dineinChecking === 0) {
          data = {
            use_radius_checking_dinein: 1
          }
        }
        if (this.dineinChecking === 1) {
          data = {
            use_radius_checking_dinein: 0,
            use_unique_code_checking_dinein: 1,
            unique_code_checking_dinein: this.formEditDineinCheck.unique_code_checking_dinein
          }
        }
      } else if (setting === 6) {
        this.loadingDomain = true
        data = {
          ext_domain: this.formEditDomain.ext_domain
        }
      }
      axios({
        method: 'PUT',
        url: baseApi(this.selectedStore.url_id, this.langId, 'online/settings'),
        headers: headers,
        data
      }).then(response => {
        this.refreshView()
        this.tempColor = {}
        this.$message({
          type: 'success',
          message: 'saved'
        })
        this.loading = false
        this.loadingQr = false
        this.loadingAuto = false
        this.loadingTimezone = false
        this.loadingDineinCheck = false
        this.dialogBanner = false
        this.dialogTimer = false
        this.dialogWhatsapp = false
        this.dialogEditTimezone = false
        this.dialogEditDineinCheck = false
        this.loadingDomain = false
        this.dialogPrivateDomain = false
        this.dialogMinVa = false
      }).catch(error => {
        this.saved = false
        this.loading = false
        this.loadingTimezone = false
        this.loadingDineinCheck = false
        this.loadingDomain = false
        this.tempColor = {}
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    setCancel () {
      this.isEdit = false
    },

    showDialogTimer () {
      this.dialogTimer = true
      this.formEditCancelAuto = { ...this.dataSetting}
    },

    showDialogWA () {
      this.dialogWhatsapp = true
      this.formEditWhatsapp = { ...this.dataSetting}
    },

    showDialogTimezone () {
      this.dialogEditTimezone = true
      this.formEditTimezone = { ...this.dataSetting}
    },

    showDialogCheckDinein () {
      this.dialogEditDineinCheck = true
      this.formEditDineinCheck = { ...this.dataSetting}
    },

    showDialogPrivateDomain () {
      this.dialogPrivateDomain = true
      this.formEditDomain = { ...this.dataSetting}
    },

    showDialogMinVa () {
      console.log('aaa')
      this.dialogMinVa = true
      this.formEditMinVa = { ...this.dataSetting}
    },

    getQrcode () {
      let params = {
        custom_text: this.formEdit.link_order,
        custom_size: 100,
        is_preview: 1
      }

      downloadQr(params).then(response => {
        this.dataQr = response.data.data
        this.formEdit.base64 = this.dataQr.base64
      }).catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    downloadBase () {
      let params = {
        custom_text: this.formEdit.link_order,
        custom_size: 500,
        is_preview: 1
      }
      downloadQr(params).then(response => {
        var link = document.createElement('a')
        document.body.appendChild(link)
        link.setAttribute("href", response.data.data.base64)
        link.setAttribute("download", 'QrCode.jpeg');
        link.click();
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    copyText() {
      var copyText = document.getElementById("link_order");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");
      this.$notify({
        type: 'info',
        message: 'Berhasil copy text'
      })
    },

    handleEditBanner () {
      this.formEdit = { ...this.dataSetting }
      this.getQrcode()
      this.dialogBanner = true
    },

    handleCancelBanner () {
      this.formEdit = {}
      this.dialogBanner = false
    },

    getPhone (value) {
      this.formEditWhatsapp.whatsapp = value.formattedNumber
    },

    getListTimezone () {
      this.loadingTimezone = true

      let params = {
        per_page: 100
      }

      getTimezone(params).then(response => {
        this.dataZone = response.data.data
        this.loadingTimezone = false
      }).catch(error => {
        this.loadingTimezone = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    setSelectedGMT (data) {
      let gmt = this.dataZone.filter(i => { return i.id === data})
      this.selectedGMT = gmt[0].timezone
      // console.log('trace', time)
    },

    randomString(len, charSet) {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },

    refreshCode () {
      this.formEditDineinCheck.unique_code_checking_dinein = this.randomString(6)
    },

    handleSetDineinChecking (data) {
      if (data === 0) {
        this.dineinChecking = 0
        this.formEditDineinCheck.unique_code_checking_dinein = this.dataSetting.unique_code_checking_dinein
      }
      if (data === 1) {
        this.dineinChecking = 1
        if (this.formEditDineinCheck.unique_code_checking_dinein === null) {
          this.formEditDineinCheck.unique_code_checking_dinein = this.randomString(6)
        }
      }
    },

    showTnc () {
      this.dataTnc = { ...this.dataSetting}
      this.showDialogTnc = true
    },

    closeDialogTnc () {
      this.showDialogTnc = false
      this.dataTnc = {}
      this.refreshView()
    },

    async getStoreData() {
      this.loadingSetting = true
      await fetchStore().then(response => {
        this.dataStore = response.data.data
        this.loadingSetting = false
      }).catch(error => {
        this.loadingSetting = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    showDeliverySetting () {
      if (this.dataSetting.pick_up_lat === null && this.dataSetting.pick_up_lon === null) {
        this.$refs.dialogdelivery.setDefaultLocation(this.dataStore)
      } else {
        this.dataStore.address = this.dataSetting.pick_up_address
        this.dataStore.location_lat = this.dataSetting.pick_up_lat
        this.dataStore.location_lon = this.dataSetting.pick_up_lon
        this.$refs.dialogdelivery.setDefaultLocation(this.dataStore)
      }
      this.$refs.dialogdelivery.setCourier(this.dataSetting, false)
      this.showDialogDelivery = true
    },

    handleCloseDeliverySetting () {
      this.showDialogDelivery = false
      this.refreshView()
    },

    handleSavePrivateDomain (data) {
      this.formEditDomain = { ...data}
      this.save(6)
    },

    handleShowWeb() {
      //
    }
  }
}
</script>
