<template>
  <div v-loading="loadingDetail" class="innerpage-fullscreen" >
    <div class="innerpage-fullscreen--header">
      <el-button
        class="innerpage-fullscreen--back"
        type="text" @click="backDetail">
        <svg-icon icon-class="arrow-left" />
      </el-button>
      <h4 class="innerpage-fullscreen--title">{{ lang.customer_detail }}</h4>
    </div>

    <div
      class="innerpage-fullscreen--bodytokped">
      <div class="box-shadow-2 border border--grey radius-10 p-24 py-8 mb-8 color-primary--soft--bg">
        <div class="flex-container">
          <div class="flex-container full-width">
            <div class="full-width">
              <div class="font-32 font-semi-bold">{{ profileData.name }}</div>
              <div class="font-14">{{ profileData.code }}</div>
            </div>
          </div>
          <div class="flex-container flex-container--content-end full-width">
            <div v-loading="loadingDeposit" class="flex-container-same-height justify-center align-center p-12 pointer" :class="classHover.deposit" style="flex-direction: column" @click="getListDeposit" @mouseover="setHover('deposit')" @mouseleave="removeHover('deposit')">
              <div class="container-icon font-32">
                <svg-icon icon-class="icon-deposit-color" />
              </div>
              <span class="font-14 color-blue-dark font-bold">{{ profileData.fdeposit_balance }}</span>
            </div>
            <div class="flex-container-same-height justify-center align-center p-12 pointer" :class="classHover.loyalti" style="flex-direction: column" @click="getListLoyalty" @mouseover="setHover('loyalti')" @mouseleave="removeHover('loyalti')">
              <div class="container-icon font-32">
                <svg-icon icon-class="icon-point-color" />
              </div>
              <span class="font-14 color-warning font-bold">{{ profileData.fbalance_points }} pts</span>
            </div>
            <div class="flex-container-same-height justify-center align-center p-12 pointer" :class="classHover.item" style="flex-direction: column" @click="scrollBottom" @mouseover="setHover('item')" @mouseleave="removeHover('item')">
              <div class="container-icon font-32">
                <svg-icon icon-class="icon-market-color" />
              </div>
              <span class="font-14 font-bold color-blue-active">{{ lang.orders }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-24 p-24 border--with-shadow">
        <div class="flex-container">
          <div class="font-18 full-width">
            {{ lang.profile }} {{ lang.customer }}
          </div>
          <div>
            <el-button type="primary" @click="editData">{{ lang.edit }}</el-button>
          </div>
        </div>
        <div class="flex-container flex-container--start">
          <div class="full-width">
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.name }}</div>
              <div class="font-16">{{ profileData.name }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.customer_type }}</div>
              <div class="font-16">{{ profileData.customer_type_name }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.customer_code }}</div>
              <div class="font-16">{{ profileData.code }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.email }}</div>
              <div class="font-16 color-primary">{{ profileData.email }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">Nomor HP</div>
              <div class="font-16 color-primary">{{ profileData.phone }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.date_of_birth }}</div>
              <div class="font-16">-</div>
            </div>
          </div>
          <div class="full-width">
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.accept_newsletter }}</div>
              <div class="font-16">{{ profileData.accept_newsletter === 1? lang.yes : lang.no }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ $lang[langId].credit_limit }}</div>
              <div class="font-16">{{ profileData.fredit_limit }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.company }}</div>
              <div class="font-16">{{ profileData.company !== '' ? profileData.company : '-' }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.notes }}</div>
              <div class="font-16">{{ profileData.notes !== '' ? profileData.notes : '-' }}</div>
            </div>
            <div class="mt-16">
              <div class="font-12 color-grey--placeholder">{{ lang.address }}</div>
              <div class="font-16">{{ profileData.address !== '' ? profileData.address : '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="scrollbar"
        ref="innerPageNavigation"
        class="inner-page-navigation inner-page-navigation--position-unset mt-24">
        <!-- <el-button
          type="text"
          :class="isProfile ? 'active' : ''"
          @click="activateProfile">
          {{ lang.profile }}
        </el-button> -->
        <el-button
          type="text"
          :class="isOrder ? 'active' : ''"
          @click="activateOrder">
          {{ lang.orders }}
        </el-button>
        <el-button
          type="text"
          :class="isReturn ? 'active' : ''"
          @click="activateReturn">
          {{ lang.returns }}
        </el-button>
        <el-button
          type="text"
          :class="isItems ? 'active' : ''"
          @click="activateItem">
          {{ lang.item }}
        </el-button>
        <!-- <el-button
          type="text"
          :disabled="methodFeatureNameIsHidden('customer-loyaltypoint')"
          :class="isLoyaltyPoints ? 'active' : ''"
          @click="activateLoyaltyPoint">
          {{ lang.loyalty_point }}
        </el-button> -->
      </div>

      <div class="tab-content" style="margin-top: 0;" >
        <!-- <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isProfile}" v-if="isProfile">
          <customer-profile :dataDetail="profileData" @back="backDetail" @deleteBack="deleteDetail"></customer-profile>
        </div> -->
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isOrder}" v-if="isOrder">
          <customer-order :root-id="idDetail"></customer-order>
        </div>
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isReturn}" v-if="isReturn">
          <customer-return :root-id="idDetail"></customer-return>
        </div>
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isItems}" v-if="isItems">
          <customer-items :root-id="idDetail"></customer-items>
        </div>
        <!-- <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isLoyaltyPoints}" v-if="isLoyaltyPoints">
          <customer-loyalty :root-id="idDetail"></customer-loyalty>
        </div> -->
      </div>
    </div>
    
    <!-- <div class="inner-page-navigation-wrapper">
      <div class="tab-content" style="margin-top: 0;">
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isProfile}" v-if="isProfile">
          <customer-profile :dataDetail="profileData" @back="backDetail" @deleteBack="deleteDetail"></customer-profile>
        </div>
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isOrder}" v-if="isOrder">
          <customer-order :root-id="idDetail"></customer-order>
        </div>
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isItems}" v-if="isItems">
          <customer-items :root-id="idDetail"></customer-items>
        </div>
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isReturn}" v-if="isReturn">
          <customer-return :root-id="idDetail"></customer-return>
        </div>
        <div role="tabpanel" class="tab-pane fade" v-bind:class="{'active in': isLoyaltyPoints}" v-if="isLoyaltyPoints">
          <customer-loyalty :root-id="idDetail"></customer-loyalty>
        </div>
      </div>

      <div
        ref="innerPageNavigation"
        class="inner-page-navigation">
        <el-button
          type="text"
          :class="isProfile ? 'active' : ''"
          @click="activateProfile">
          {{ lang.profile }}
        </el-button>
        <el-button
          type="text"
          :class="isOrder ? 'active' : ''"
          @click="activateOrder">
          {{ lang.orders }}
        </el-button>
        <el-button
          type="text"
          :class="isItems ? 'active' : ''"
          @click="activateItem">
          {{ lang.item }}
        </el-button>
        <el-button
          type="text"
          :class="isReturn ? 'active' : ''"
          @click="activateReturn">
          {{ lang.returns }}
        </el-button>
        <el-button
          type="text"
          :disabled="methodFeatureNameIsHidden('customer-loyaltypoint')"
          :class="isLoyaltyPoints ? 'active' : ''"
          @click="activateLoyaltyPoint">
          {{ lang.loyalty_point }}
        </el-button>
      </div>
    </div> -->
    <div
      v-if="sidebarDeposit"
      class="offscreen-right-sidebar">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left">
          <div>
            <span class="ml-8">Deposit</span>
            <close-esc @close="sidebarDeposit = false" />
          </div>
        </div>
        <div class="offscreen-right-sidebar--header text-left mt-24" style="top: 50px; padding: unset">
          <div class="color-primary--soft--bg text-left p-40">
            <div class="flex-container">
              <div class="full-width">
                <span class="font-20">Total Deposit</span>
                <div class="font-32 color-blue-active">{{ profileData.fdeposit_balance }}</div>
              </div>
              <div>
                <div class="font-79">
                  <svg-icon icon-class="icon-deposit-color" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 220px">
          <div class="table-handler-flex full-width text-right px-24" style="display: contents">
            <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" size="small"></el-input>
          </div>

          <div class="like-table-wrapper mt-16">
            <div v-for="item in dataDeposit" :key="item.id" class="like-table-wrapper--item">
              <div class="flex-container full-width pointer" v-loading="loadingDetailDeposit" @click="showDetailDeposit(item)">
                <div class="full-width ml-8">{{ item.transaction_no }}</div>
                <div class="full-width text-right" :class="item.transaction_type === 'D' ? 'color-danger' : 'color-green--dark'"> 
                  {{ item.fearned_amount }} 
                  <i :class="item.transaction_type === 'D'? 'el-icon-remove color-danger' : 'el-icon-circle-plus color-green--dark'" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="sidebarLoyalty"
      class="offscreen-right-sidebar">
      <div class="offscreen-right-sidebar--wrapper">
        <div class="offscreen-right-sidebar--header text-left">
          <div>
            <span class="ml-8">Loyalty Point</span>
            <close-esc @close="sidebarLoyalty = false" />
          </div>
        </div>
        <div class="offscreen-right-sidebar--header text-left mt-24" style="top: 50px; padding: unset">
          <div class="color-warning--soft--bg text-left p-40">
            <div class="flex-container">
              <div class="full-width">
                <span class="font-20">Total Loyalty</span>
                <div class="font-32 color-warning">{{ profileData.fbalance_points }} pts</div>
              </div>
              <div>
                <div class="font-79">
                  <svg-icon icon-class="icon-point-color" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 220px">
          <!-- <div class="table-handler-flex full-width text-right px-24" style="display: contents">
            <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="search" @change="handleSearch" size="small"></el-input>
          </div> -->
          <div class="like-table-wrapper mt-16">
            <div v-for="item in dataLoyalty" :key="item.id" class="like-table-wrapper--item">
              <div class="flex-container full-width pointer" v-loading="loadingDetailDeposit" @click="showDetailLoyalty(item)">
                <div class="full-width ml-8 color-primary font-bold">{{ item.order_no }}</div>
                <!-- <div class="full-width text-right" :class="item.transaction_type === 'D' ? 'color-danger' : 'color-green--dark'"> 
                  {{ item.fearned_amount }} 
                  <i :class="item.transaction_type === 'D'? 'el-icon-remove color-danger' : 'el-icon-circle-plus color-green--dark'" />
                </div> -->
                <div>
                  <div v-if="parseInt(item.earned_points) !== 0" class="flex-container flex-container--content-end color-green--dark">
                    {{ item.earned_points }}
                    <i class="el-icon-circle-plus color-green--dark ml-4" />
                  </div>
                  <div v-if="parseInt(item.redeemed_points) !== 0" class="flex-container flex-container--content-end color-danger">
                    {{ item.redeemed_points }}
                    <i class="el-icon-remove color-danger ml-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogDetailDeposit" 
      width="536px" center
      :append-to-body="true"
      :close-on-click-modal="false" 
      :show-close="false">
      <div slot="title" class="text-left">
        <span class="ml-8 font-24">Detail Deposit</span>
        <close-esc @close="dialogDetailDeposit = false" />
      </div>
      <div class="p-16 like-table-wrapper">
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ lang.order_no }}
          </div>
          <div class="full-width text-right pointer color-primary font-bold">
            <!-- <router-link :to="{path: '/sales/completeorder/'+ dataDetailDeposit.transaction_no}"> -->
              {{ dataDetailDeposit.transaction_no }}
            <!-- </router-link> -->
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ lang.type }}
          </div>
          <div class="full-width text-right pointer font-bold" :class="dataDetailDeposit.transaction_type === 'D' ? 'color-danger' : 'color-green--dark'">
            {{ dataDetailDeposit.transaction_type === 'D'? 'Redeem Deposit' : 'Top Up Deposit' }}
            <i :class="dataDetailDeposit.transaction_type === 'D'? 'el-icon-remove color-danger' : 'el-icon-circle-plus color-green--dark'" />
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ lang.payment_date }}
          </div>
          <div class="full-width text-right pointer font-bold">
            {{ dataDetailDeposit.fpayment_date }}
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ rootLang.available_until }}
          </div>
          <div class="full-width text-right pointer font-bold">
            {{  }}
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ lang.buy_price }}
          </div>
          <div class="full-width text-right pointer font-bold">
            {{ dataDetailDeposit.fpayable_amount }}
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            Nilai Deposit
          </div>
          <div class="full-width text-right pointer font-bold">
            {{ dataDetailDeposit.fearned_amount }}
          </div>
        </div>
      </div>
    </el-dialog>


    <el-dialog
      :visible.sync="dialogDetailLoyalty" 
      width="536px" center
      :append-to-body="true"
      :close-on-click-modal="false" 
      :show-close="false">
      <div slot="title" class="text-left">
        <span class="ml-8 font-24">Detail Loyalty Point</span>
        <close-esc @close="dialogDetailLoyalty = false" />
      </div>
      <div class="p-16 like-table-wrapper">
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ lang.order_no }}
          </div>
          <div class="full-width text-right pointer color-primary font-bold">
            <!-- <router-link :to="{path: '/sales/completeorder/'+ dataDetailDeposit.transaction_no}"> -->
              {{ tempLoyaltyData.order_no }}
            <!-- </router-link> -->
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ rootLang.earned_points }}
          </div>
          <div class="full-width text-right pointer font-bold color-green--dark">
            {{ tempLoyaltyData.earned_points }}
            <i class="el-icon-circle-plus color-green--dark ml-4" />
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ rootLang.redeemed_points }}
          </div>
          <div class="full-width text-right pointer font-bold color-danger">
            {{ tempLoyaltyData.redeemed_points }}
            <i class="el-icon-remove color-danger ml-4" />
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            {{ rootLang.available_until }}
          </div>
          <div class="full-width text-right pointer font-bold">
            {{ tempLoyaltyData.expiry_date }}
          </div>
        </div>
        <div class="flex-container p-8 like-table-wrapper--item">
          <div class="full-width">
            Sisa
          </div>
          <div class="full-width text-right pointer font-bold">
            {{ tempLoyaltyData.balance_points }} pts
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogEdit" 
      width="536px" center
      :append-to-body="true"
      :close-on-click-modal="false" 
      :show-close="false">
      <div slot="title" class="text-left">
        <span class="ml-8 font-24">{{ lang.edit }} {{ lang.customer }}</span>
        <!-- <close-esc @close="dialogEdit = false" /> -->
        <div class="btn_save_dialog full-width text-right">
          <el-button type="info" @click="dialogEdit = false">{{ lang.cancel }}</el-button>
          <el-button :loading="loadingSave" type="success" @click="saveHandle" >{{ lang.save }}</el-button>
        </div>
      </div>
      <div>
        <div class="full-width">
          <span class="font-12">{{ lang.name }}</span>
          <div>
            <el-input v-model="profileData.name" ></el-input>
          </div>
        </div>
        <div class="full-width mt-16">
          <span class="font-12">{{ lang.customer_type }}</span>
          <div>
            <el-autocomplete
                style="width: 100%;"
                v-model="profileData.customer_type_name"
                :fetch-suggestions="searchCustomerTypes"
                :placeholder="lang.search"
                @select="handleSelected">
              </el-autocomplete>
            <!-- <el-select
              style="width: 100%;"
              v-model="profileData.customer_type_id"
              filterable
              remote
              :placeholder="$lang[langId].please_input + lang.customer_type"
              :remote-method="searchCustomerTypes"
              :loading="searchingCustomerTypes">
              <el-option
                v-for="item in searchResultCustomerTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> -->
          </div>
        </div>
        <div class="full-width mt-16">
          <span class="font-12">{{ lang.customer_code }}</span>
          <div>
            <el-input v-model="profileData.code" ></el-input>
          </div>
        </div>
        <div class="mt-16 font-bold font-18 flex-container pointer" @click="templateLogin = !templateLogin">
          <div class="full-width">
            Login
          </div>
          <div class="radius-50 pointer" style="box-shadow: 0px 2px 2px #0000001F; height: 24px; widht: 24px" >
            <i :class="templateLogin ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" />
          </div>
        </div>
        <template v-if="templateLogin" >
          <div class="mt-12 color-info--bg radius-5 flex-container p-8">
            <div class="container-icon">
              <svg-icon icon-class="information-circle" class="color-info" />
            </div>
            <div>
              Email dan password dapat digunakan pelanggan untuk mengakses layanan online toko Anda seperti Toko Online, Pesan Online, dan Mobile App.
            </div>
          </div>
          <div class="full-width mt-16">
            <span class="font-12">{{ lang.email }}</span>
            <div>
              <el-input v-model="profileData.email" ></el-input>
            </div>
          </div>
          <div class="full-width mt-16">
            <span class="font-12">{{ lang.phone }}</span>
            <div>
              <el-input v-model="profileData.phone" ></el-input>
            </div>
          </div>
        </template>
        
        <div class="mt-16 font-bold font-18 flex-container pointer"  @click="templateOther = !templateOther">
          <div class="full-width">Lainnya</div>
          <div class="radius-50 pointer" style="box-shadow: 0px 2px 2px #0000001F; height: 24px; widht: 24px">
            <i :class="templateOther ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" />
          </div>
        </div>
        <template v-if="templateOther">
          <div class="full-width mt-16">
            <span class="font-12">{{ lang.date_of_birth }}</span>
            <div>
              <el-date-picker
                v-model="profileData.dob"
                type="date"
                :placeholder="$lang[langId].pick_a_day"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
                class="full-width"
              />
            </div>
          </div>
          <div class="full-width mt-16">
            <div class="flex-container border border--form p-8">
              <div class="full-width">{{ lang.accept_newsletter }}</div>
              <el-switch v-model="profileData.accept_newsletter" :active-value="1" :inactive-value="0" />
            </div>
          </div>
          <div class="full-width mt-16">
            <span class="font-12">{{ rootLang.credit_limit }}</span>
            <div>
              <input-money v-model="profileData.credit_limit" />
            </div>
          </div>
          <div class="full-width mt-16">
            <div class="flex-container border border--form p-8">
              <div class="full-width">{{ rootLang.is_frozen }}</div>
              <el-switch v-model="profileData.is_frozen" :active-value="1" :inactive-value="0" />
            </div>
          </div>
          <div class="full-width mt-16">
            <span class="font-12">{{ lang.company_name }}</span>
            <div>
              <el-input v-model="profileData.company" />
            </div>
          </div>
          <div class="full-width mt-16">
            <span class="font-12">{{ lang.notes }}</span>
            <div>
              <el-input type="textarea" v-model="profileData.notes" />
            </div>
          </div>
        </template>

        <div class="mt-16 font-bold font-18 flex-container pointer" @click="templateAddress = !templateAddress">
          <div class="full-width">{{ lang.address }}</div>
          <div class="radius-50 pointer" style="box-shadow: 0px 2px 2px #0000001F; height: 24px; widht: 24px" >
            <i :class="templateAddress ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" />
          </div>
        </div>
        <template v-if="templateAddress">
          <div class="full-width mt-16">
            <span class="font-12">{{ lang.address }}</span>
            <div>
              <el-input type="textarea" v-model="profileData.address" ></el-input>
            </div>
          </div>
          <div>
            <div class="full-width mt-16">
              <span class="font-12">{{ lang.country }}</span>
              <div>
                <el-select filterable class="inline-form full-width" v-model="profileData.country_name" :placeholder="lang.please_select" size="small" @change="editCountry">
                  <el-option v-for="item in country" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <template v-if="profileData.country_id === 'ID'">
              <div class="full-width mt-16">
                <span class="font-12">{{ lang.province }}</span>
                <div>
                  <el-select filterable class="inline-form full-width" v-model="profileData.state_name" :placeholder="lang.please_select" size="small" @change="editStateCountry">
                    <el-option v-for="item in stateCountry" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="full-width mt-16">
                <span class="font-12">{{ lang.city }}</span>
                <el-select filterable class="inline-form full-width" v-model="profileData.city_name" :placeholder="lang.please_select" size="small" @change="editCity">
                  <el-option v-for="item in shippingCity" :key="item.id" :label="item.city" :value="item.id"></el-option>
                </el-select>
              </div>
              <div class="full-width mt-16">
                <span class="font-12">{{ lang.district }}</span>
                <el-select filterable class="inline-form full-width" v-model="profileData.city_subdistrict_name" :placeholder="lang.please_select" size="small" @change="editSubdistrict">
                  <el-option v-for="item in subDistrict" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
              <div class="full-width mt-16"> 
                <span class="font-12">{{ lang.postal_code }}</span>
                <div>
                  <el-input v-model="profileData.postal_code"></el-input>
                </div>
              </div>
            </template>
          </div>
        </template>
        <el-button
          @click="deleteDialog = true"
          class="btn-block mt-24 color-danger"
          icon="el-icon-delete"
        >
        {{ rootLang.delete }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="deleteDialog" width="50%" center :append-to-body="true" :close-on-click-modal="false" :show-close="false">
      <span slot="title">
        <svg-icon icon-class="alert-triangle" style="stroke: #F44336;"></svg-icon>
        {{ lang.notif_warn }}
      </span>
      <div class="text-center">
        <p>{{ $lang[langId].are_you_want_remove }} {{ lang.customer }}</p>
        <h5>{{ profileData.name }}</h5>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">{{ lang.cancel }}</el-button>
        <el-button type="danger" @click="deleteHandle" :loading="loadingDelete">{{ $lang[langId].delete }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'

import { getCustomerDeposit, getCustomerDetailDeposit, getCustomerLoyalty } from '@/api/customer-supplier'

import CustomerProfile from './CustomerProfile'
import CustomerOrder from './CustomerOrder'
import CustomerItems from './CustomerItems'
import CustomerReturn from './CustomerReturn'
import CustomerLoyalty from './CustomerLoyaltyPoints'
import { mixinHiddenFeatureByPlanType } from '@/mixins/mixinHiddenFeatureByPlanType'
import basicComputedMixin from '@/mixins/basicComputedMixin'

import CloseEsc from '@/components/modules/CloseEsc'

import InputMoney from '@/components/InputMoneyV2'

export default {
  name: 'CustomerDetailIndexV2',
  props: ['detailId'],
  components: {
    CustomerProfile,
    CustomerOrder,
    CustomerItems,
    CustomerReturn,
    CustomerLoyalty,
    CloseEsc,
    InputMoney
  },
  mixins: [mixinHiddenFeatureByPlanType, basicComputedMixin],
  data() {
    return {
      loadingDetail: false,
      active_el: 2,
      isProfile: false,
      isOrder: true,
      isLoyaltyPoints: false,
      isReturn: false,
      isItems: false,
      idDetail: null,
      profileData: {},
      sidebarDeposit: false,
      sidebarLoyalty: false,
      sidebarItem: false,
      loadingDeposit: false,
      loadingDetailDeposit: false,
      dataDeposit: [],
      dataDetailDeposit: [],
      dialogDetailDeposit: false,
      classHover: {
        deposit: '',
        loyalti: '',
        item: ''
      },
      dialogDetailLoyalty: false,
      tempLoyaltyData: {},
      dataLoyalty: [],
      dialogEdit: false,
      searchingCustomerTypes: false,
      searchResultCustomerTypes: [],
      loadingSave: false,
      country: [],
      stateCountry: [],
      shippingCity: [],
      subDistrict: [],
      templateLogin: false,
      templateAddress: false,
      templateOther: false,
      deleteDialog: false,
      loadingDelete: false
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
    }
  },
  watch: {
    '$store.getters.selectedStore'() {
      this.getProfileData()
    }
  },
  created() {
    this.idDetail = this.detailId
    if (this.$route.params.id) {
      this.idDetail = this.$route.params.id
    }
    this.getProfileData()
    this.activate()
  },

  mounted() {
    this.$nextTick(() => {
      this.affix()
      window.addEventListener('resize', this.affix)
    })
  },

  methods: {
    affix() {
      const ref = this.$refs.innerPageNavigation
      if (ref) {
        const parentWidth = ref.parentElement.offsetWidth
        ref.style.width = parentWidth + 'px'
      }
    },
    // loadPage() {
    //   this.getProfileData()
    //   this.isProfile = true
    // },
    initTabsState() {
      this.isProfile = false
      this.isOrder = false
      this.isItems = false
      this.isReturn = false
      this.isLoyaltyPoints = false
    },
    activateProfile() {
      this.initTabsState()
      this.active_el = 1
      this.isProfile = true
    },
    activateOrder() {
      this.initTabsState()
      this.active_el = 2
      this.isOrder = true
    },
    activateItem() {
      this.initTabsState()
      this.active_el = 3
      this.isItems = true
    },
    activateReturn() {
      this.initTabsState()
      this.active_el = 4
      this.isReturn = true
    },
    activateLoyaltyPoint() {
      this.initTabsState()
      this.active_el = 5
      this.isLoyaltyPoints = true
    },
    activate: function(el) {
      this.active_el = el
      this.isProfile = true
    },
    getProfileData() {
      this.loadingDetail = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          'customer/' + this.idDetail
        ),
        headers: headers
      })
        .then(response => {
          this.profileData = response.data.data
          this.loadingDetail = false
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loadingDetail = false
          console.log(error)
        })
    },
    backDetail() {
      this.profileData = {}
      this.$emit('back')
    },
    deleteDetail() {
      this.profileData = {}
      this.$emit('delete')
    },

    getListDeposit() {
      this.loadingDeposit = true
      let params = {
        id: this.profileData.id,
        per_page: 30
      }
      getCustomerDeposit(params).then(response => {
        this.dataDeposit = response.data.data
        this.loadingDeposit = false
        this.sidebarDeposit = true
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingDeposit = false
        console.log(error)
      })
    },

    showDetailDeposit(data) {
      this.loadingDetailDeposit = true
      getCustomerDetailDeposit(data).then(response => {
        this.dataDetailDeposit = response.data.data
        this.loadingDetailDeposit = false
        this.dialogDetailDeposit = true
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingDetailDeposit = false
        console.log(error)
      })
    },

    getListLoyalty() {
      console.log('aaa')
      this.loadingLoyalty = true
      let params = {
        id: this.profileData.id,
        per_page: 30
      }
      getCustomerLoyalty(params).then(response => {
        this.dataLoyalty = response.data.data
        this.loadingLoyalty = false
        this.sidebarLoyalty = true
      })
      .catch(error => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingLoyalty = false
        console.log(error)
      })
    },

    showDetailLoyalty (data) {
      this.tempLoyaltyData = { ...data}
      this.dialogDetailLoyalty = true
    },

    setHover (args) {
      if (args === 'deposit') {
        this.classHover.deposit = 'color-blue-dark--bg-trans'
      }
      if (args === 'loyalti') {
        this.classHover.loyalti = 'color-blue-dark--bg-trans'
      }
      if (args === 'item') {
        this.classHover.item = 'color-blue-dark--bg-trans'
      }
    },

    removeHover (args) {
      if (args === 'deposit') {
        this.classHover.deposit = ''
      }
      if (args === 'loyalti') {
        this.classHover.loyalti = ''
      }
      if (args === 'item') {
        this.classHover.item = ''
      }
    },

    scrollBottom () {
      var div = document.getElementById('scrollbar');
      $('#' + 'scrollbar').animate({
          // scrollTop: div.scrollHeight - div.clientHeight
          scrollTop : div.scrollIntoView()
      }, 500)

      // var element = document.getElementById("scrollbar");
      // element.scrollIntoView();
    },

    searchCustomerTypes(query, callback) {
      //
      this.searchingCustomerTypes = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'customertype'),
          headers: headers,
          params: params
        }).then(response => {
          for (let i of response.data.data) {
            i.value = i.name
            i.id = i.id
          }
          this.searchResultCustomerTypes = response.data.data
          callback(this.searchResultCustomerTypes)
          this.searchingCustomerTypes = false
          // this.searchResultCustomerTypes = response.data.data.map(item => {
          //   return item
          // })
        }).catch(() => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = []
        })
      }
    },

    handleSelected(val) {
      this.profileData.customer_type_id = val.id
    },

    saveHandle() {
      this.loadingSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let data = { ...this.profileData}

      axios({
        method: 'PUT',
        url: baseApi(
          this.selectedStore.url_id,
          this.langId,
          'customer/' + this.profileData.id
        ),
        headers: headers,
        data
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.profileData = response.data.data
            this.$message({
              message: 'Success',
              type: 'success'
            })
          } else {
            this.$message({
              message: 'error',
              type: 'error'
            })
          }
          this.loadingSave = false
          this.dialogEdit = false
          this.getProfileData()
        })
        .catch(error => {
          this.loadingSave = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    editData () {
      this.getCountry()
      if (this.profileData.country_id === 'ID') {
        this.getStateCountry()
        this.getShippingCity()
        this.getSubDistrict()
      }
      this.dialogEdit = true
    },

    getCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search: '',
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcountry'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.country = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editCountry(item) {
      this.profileData.country_id = item
      this.profileData.state_id = null
      this.profileData.state_name = ''
      this.profileData.city_name = ''
      this.profileData.city_subdistrict_name = ''
      this.profileData.city_id = null
      this.profileData.subdistrict_id = null
      this.getStateCountry()
    },
    getStateCountry() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'state'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.stateCountry = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editStateCountry(item) {
      this.profileData.state_id = item
      this.profileData.city_name = ''
      this.profileData.city_subdistrict_name = ''
      this.getShippingCity()
    },
    getShippingCity() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.profileData.state_id) {
        searchText = 0
      } else {
        searchText = this.profileData.state_id
      }
      let params = {
        search_column: 'state_id',
        search_operator: '=',
        search_text: searchText,
        per_page: 1000
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcity'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.shippingCity = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editCity(item) {
      this.profileData.city_id = item
      this.profileData.city_subdistrict_name = ''
      this.getSubDistrict()
    },
    getSubDistrict() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let searchText = null
      if (!this.profileData.city_id) {
        searchText = 0
      } else {
        searchText = this.profileData.city_id
      }
      let params = {
        search_column: 'city_id',
        search_operator: '=',
        search_text: searchText,
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'shippingcitysubdistrict'),
        headers: headers,
        params: params
      })
        .then(response => {
          this.subDistrict = response.data.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
        })
    },
    editSubdistrict(item) {
      this.profileData.subdistrict_id = item
    },

    deleteHandle() {
      this.loadingDelete = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'customer/' + this.profileData.id),
        headers: headers
      })
        .then(response => {
          this.result = response.data
          if (response.data.status === 200) {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
          this.deleteDialog = false
          this.dialogEdit = false
          this.loadingDelete = false
          this.backDetail()
          // this.$router.push({
          //   path: '/customersupplier/customer'
          // })
        })
        .catch(error => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.deleteDialog = false
          this.loading = false
        })
    },
  }
}
</script>

