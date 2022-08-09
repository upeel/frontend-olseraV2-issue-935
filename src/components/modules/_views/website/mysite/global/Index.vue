<template>
  <div v-loading="loading">
    <el-row :gutter="10" v-if="data">
      <el-col :md="12">
        <!-- appearances -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{ $lang[langId].appearances}}
            <div class="card-buttons">
              <el-button
                type="primary"
                size="small"
                @click="handleShowWeb">
                {{ lang.online_shop }}
                <svg-icon icon-class="external-link" />
              </el-button>
            </div>
          </div>
          <div>
            <template v-if="data.theme">
              <div class="card-sub-body">
                <div class="flex-container">
                  <div class="mr-4">
                    <h4 class="card-sub-body-title">{{ lang.design_and_theme }}</h4>
                    <h6 class="desc">{{ lang.your_store_theme }}</h6>
                  </div>
                  <div class="text-right" style="flex-grow: 1;">
                    <button-action-authenticated
                      :permission="['website/designtheme', 'edit']"
                      type="info"
                      size="mini"
                      icon="fa fa-code fa-fw"
                      @click="editCss">
                      {{ $lang[langId].edit_css }}
                    </button-action-authenticated>
                    <button-action-authenticated
                      :permission="['website/designtheme', 'edit']"
                      type="primary"
                      class="btn-plain"
                      size="mini"
                      icon="fa fa-cog fa-fw"
                      @click="editTheme">
                      {{ lang.change_theme }}
                    </button-action-authenticated>
                  </div>
                </div>

                <el-image :src="data.theme_photo" />

                <div class="bottom-desc" style="margin-top: 20px;">
                  <el-row :gutter="20">
                    <el-col :span="10">{{ $lang[langId].theme }}:
                      <strong>{{ data.theme.name }}</strong>
                    </el-col>
                    <el-col :span="7">{{ lang.layout }}:
                      <strong>{{ data.theme.layout }}</strong>
                    </el-col>
                    <el-col :span="7">{{ lang.color }}:
                      <button-action-authenticated :permission="['website/designtheme', 'edit']" size="mini" :style="getColorTheme"></button-action-authenticated>
                    </el-col>
                  </el-row>
                </div>
              </div>

              <div class="card-sub-body">
                <div class="flex-container">
                  <div v-if="data.logo" class="mr-4">
                    <el-avatar :src="data.logo" class="img-60 img-circle" />
                  </div>
                  <div style="flex-grow: 1;" class="mr-4">
                    <h4 class="card-sub-body-title">{{ $lang[langId].logo }}</h4>
                    <div class="size-12 oldgrey">{{ lang.click_to_change_your_logo }}</div>
                  </div>
                  <div class="text-right">
                    <button-action-authenticated :permission="['website/designtheme', 'edit']" class="btn-plain" type="primary"
                      size="mini" icon="el-icon-edit" @click="editUploadLogo">
                      {{ lang.edit }}
                    </button-action-authenticated>
                  </div>
                </div>
              </div>

              <div class="card-sub-body">
                <div class="flex-container">
                  <div v-if="data.website_favicon" class="mr-4">
                    <el-avatar :src="data.website_favicon" class="img-60 img-circle" />
                  </div>
                  <div style="flex-grow: 1;" class="mr-4">
                    <h4 class="card-sub-body-title">{{ $lang[langId].favicon }}</h4>
                    <div class="size-12 oldgrey">{{ lang.click_to_change_your_favicon }}</div>
                  </div>
                  <div class="text-right">
                    <button-action-authenticated :permission="['website/designtheme', 'edit']" class="btn-plain" type="primary"
                      size="mini" icon="el-icon-edit" @click="editUploadFavicon">
                      {{ lang.edit }}
                    </button-action-authenticated>
                  </div>
                </div>
              </div>

              <div class="card-sub-body">
                <div class="flex-container">
                  <div v-if="data.theme_background" class="mr-4">
                    <el-avatar :src="data.theme_background" class="img-60 img-circle" />
                  </div>
                  <div style="flex-grow: 1;" class="mr-4">
                    <h4 class="card-sub-body-title">{{ lang.theme_background }}</h4>
                    <div class="size-12 oldgrey">{{ $lang[langId].only_apply_to_layout_box }}</div>
                  </div>
                  <div class="text-right">
                    <button-action-authenticated :permission="['website/designtheme', 'edit']" class="btn-plain" type="primary"
                      size="mini" icon="el-icon-edit" @click="editUploadThemeBg">
                      {{ lang.edit }}
                    </button-action-authenticated>
                  </div>
                </div>
              </div>

              <div class="card-sub-body">
                <div class="flex-container">
                  <div style="flex-grow: 1;" class="mr-4">
                    <h4 class="card-sub-body-title">{{ $lang[langId].homepage }}</h4>
                    <div class="size-12 oldgrey">{{ $lang[langId].homepage_website }}</div>
                    <div class="bottom-desc">
                      <span class="size-12">{{ $lang[langId].recently }}: <strong>{{data.website_homepage_link_name}} ({{data.website_homepage_link_type}})</strong></span>
                    </div>
                  </div>
                  <div class="text-right">
                    <button-action-authenticated :permission="['website/designtheme', 'edit']" class="btn-plain" type="primary"
                      size="mini" icon="el-icon-edit" @click="editHomepage">
                      {{ lang.edit }}
                    </button-action-authenticated>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-card>

        <!-- slides -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{ lang.banner_slides }}
            <div class="card-buttons">
              <el-button
                v-if="saveSortView"
                size="small"
                type="success"
                @click="saveSlide">
                {{ lang.save }}
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="addSlide">
                {{ lang.add }}
              </el-button>
            </div>
          </div>

          <div>
            <template v-if="data.slides">
              <draggable
                :options="{group:{ name:'slides'}}"
                class="dd-list dragArea"
                v-model="data.slides"
                @change="changeBanner">
                <div class="dd-item" v-for="(item) in data.slides" :key="item.id">
                  <slide-item :item="item" @edit="handleEditSlideItem"></slide-item>
                </div>
              </draggable>
            </template>
          </div>
        </el-card>

        <!-- pengaturan lain -->
        <el-card class="box-card">
          <div slot="header">
            {{ $lang[langId].other_setting }}
          </div>
          <div>
            <el-form v-model="data" class="form-sidebyside form-myswebsite" @submit.native.prevent>
              <div class="open-create-body">
                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="$lang[langId].shopping_cart" class="form-subtitle" />
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.disable_shopping_cart">
                      <p>{{ lang.info_disable_shopping_cart }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="10">
                    <el-form-item>
                      <el-switch
                        v-model="data.disable_cart"
                        :active-value="1"
                        :inactive-value="0"
                        @change="promiseUpdate(data)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.checkout_mode" class="form-subtitle" />
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.checkout_without_register">
                      <p>{{ lang.info_checkout_without_register }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="10">
                    <el-form-item>
                      <el-switch
                        v-model="data.checkout_without_register"
                        :active-value="1"
                        :inactive-value="0"
                        @change="promiseUpdate(data)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.checkout_mode_is_inquiry">
                      <p>{{ lang.info_checkout_mode_is_inquiry }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="10">
                    <el-form-item>
                      <el-switch
                        v-model="data.inquiry_mode"
                        :active-value="1"
                        :inactive-value="0"
                        @change="promiseUpdate(data)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.transfer_stock" class="form-subtitle" />
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.require_recipient_store_acknowledgement">
                      <p>{{ lang.info_require_recipient_store_acknowledgement }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="10">
                    <el-form-item>
                      <el-switch
                        v-model="data.transfer_stock_manual_posting"
                        :active-value="1"
                        :inactive-value="0"
                        @change="promiseUpdate(data)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.order_qty" class="form-subtitle" />
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.allow_order_qty_in_decimal">
                      <p>{{ lang.info_allow_order_qty_in_decimal }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="10">
                    <el-form-item>
                      <el-switch
                        v-model="data.allow_qty_decimal"
                        :active-value="1"
                        :inactive-value="0"
                        @change="promiseUpdate(data)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.drop_ship" class="form-subtitle" />
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.allow_drop_ship">
                      <p>{{ lang.info_drop_ship }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="10">
                    <el-form-item>
                      <el-switch
                        v-model="data.drop_ship_enabled"
                        :active-value="1"
                        :inactive-value="0"
                        @change="promiseUpdate(data)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="$lang[langId].order_cancellation" class="form-subtitle" />
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :sm="14">
                    <el-form-item :label="lang.order_auto_cancellation">
                      <p>{{ lang.info_auto_cancel_pending_order }}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="10">
                    <el-form-item>
                      <el-input
                        v-model="data.auto_cancel_order_hour"
                        type="number"
                        @input="handleCurrency($event)"
                        @change="promiseUpdate(data)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :md="12">
        <!-- publicity -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{ $lang[langId].publicity }}
          </div>
          <div>
            <el-form :model="data">
              <el-form-item :label="lang.default_currency" label-width="180px">
                <el-select @change="updatePublicity('curr')" filterable v-model="data.website_default_currency_id">
                  <el-option
                    v-for="(item) in data.currencies"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="lang.website_language" label-width="180px">
                <el-select @change="updatePublicity('lang')" filterable v-model="data.website_lang_code">
                  <el-option
                    v-for="(item) in data.languages"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="lang.publish_website" label-width="180px">
                <el-switch @change="updatePublicity('publ')"
                  :inactive-value="0"
                  :active-value="1"
                  v-model="data.website_published"></el-switch>
                  <span v-if="data.website_published === 0">{{ lang.no }}</span>
                  <span v-if="data.website_published === 1">{{ lang.yes }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <!-- seo -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{ lang.seo }}
          </div>
          <div>
              <el-form :model="data" class="form-sidebyside form-myswebsite" @submit.native.prevent>
                <div class="open-create-body">
                  <el-row :gutter="10">
                    <el-col :sm="12">
                      <el-form-item :label="lang.home_page_title">
                        <p>{{ lang.info_home_page_title }}</p>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12">
                      <el-form-item>
                        <el-input @change="promiseUpdate(data)" type="textarea" autosize v-model="data.home_page_title"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :sm="12">
                      <el-form-item :label="lang.meta_keywords">
                        <p>{{ lang.info_meta_keywords_store }} {{ lang.info_input_tags_enter }}</p>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12">
                      <!-- <el-form-item>
                        <el-select
                          v-model="meta_keywords_temp"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          @change="prom">
                          <el-option
                            v-for="item in meta_keywords_options"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item> -->
                      <el-form-item>
                        <el-input @change="prom" type="text" autosize v-model="meta_keywords_options"></el-input>
                      </el-form-item>
                      <div class="tag-in-loop-wrapper">
                        <el-tag
                          v-for="(item, key) in meta_keywords_temp"
                          :key="key"
                          closable
                          @close="removeItem(key)">
                          {{ item.name }}
                        </el-tag>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :sm="12">
                      <el-form-item :label="lang.meta_description">
                        <p>{{ lang.info_meta_description }}</p>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12">
                      <el-form-item>
                        <el-input @change="promiseUpdate(data)" type="textarea" autosize v-model="data.meta_description"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
          </div>
        </el-card>
        <!-- sosial -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{ lang.social_networks }}
            <div class="card-buttons">
              <el-button
                v-if="countIncompletedSocialLink > 0"
                @click="addSocialLink"
                icon="el-icon-plus"
                type="success"
                size="small">
                {{ lang.add }}
              </el-button>
            </div>
          </div>

          <div>
            <div>
              <template v-for="(item, key) in arrSocialLink">
                <el-row v-if="item.value" :gutter="0" class="link-social-added" :key="key">
                  <el-col :span="16" style="position: relative; top: 3px;">
                    <span class="icon-bullet">
                      <i class="fa" :class="'fa-' + item.icon"></i>
                    </span>
                    {{item.name}} <span class="oldgrey size-11">{{ item.value }}</span>
                  </el-col>
                  <el-col :span="8" class="text-right">
                   <el-button type="primary" icon="el-icon-edit"
                    class="btn-plain" size="mini" @click="editSocialLink(key)">
                    {{ lang.edit }}
                  </el-button>
                  </el-col>
                </el-row>
              </template>
            </div>
          </div>
        </el-card>
        <!-- chatting -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{ lang.chatting }}
            <div class="card-buttons">
              <el-button
                v-if="countIncompletedChatting > 0"
                @click="addChatting"
                icon="el-icon-plus"
                type="success"
                size="small">
                {{ lang.add }}
              </el-button>
            </div>
          </div>

          <div>
            <div>
              <template v-for="(item, key) in arrChatting">
                <el-row v-if="item.value" :gutter="0" class="link-social-added" :key="key">
                  <el-col :span="16" style="position: relative; top: 3px;">
                    <span class="icon-bullet">
                      <i class="fa" :class="'fa-' + item.icon"></i>
                    </span>
                    {{item.name}}
                  </el-col>
                  <el-col :span="8" class="text-right">
                   <el-button type="primary" icon="el-icon-edit"
                    class="btn-plain" size="mini" @click="editChatting(key)">
                    {{ lang.edit }}
                  </el-button>
                  </el-col>
                </el-row>
              </template>
            </div>
          </div>
        </el-card>
        <!-- mobile app -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            {{ lang.mobile_app }}
            <div class="card-buttons">
              <el-button
                v-if="countIncompletedMobileApp > 0"
                @click="addMobileApp"
                icon="el-icon-plus"
                type="success"
                size="small">
                {{ lang.add }}
              </el-button>
            </div>
          </div>

          <div>
            <div>
              <template v-for="(item, key) in arrMobileApp">
                <el-row v-if="item.value" :gutter="0" class="link-social-added" :key="key">
                  <el-col :span="16" style="position: relative; top: 3px;">
                    <span class="icon-bullet">
                      <i class="fa" :class="'fa-' + item.icon"></i>
                    </span>
                    {{item.name}}
                  </el-col>
                  <el-col :span="8" class="text-right">
                   <el-button type="primary" icon="el-icon-edit"
                    class="btn-plain" size="mini" @click="editMobileApp(key)">
                    {{ lang.edit }}
                  </el-button>
                  </el-col>
                </el-row>
              </template>
            </div>
          </div>
        </el-card>

        <!-- customer view stock -->
        <el-card
          v-if="checkCustomPermission('website/storestockrefs', 'index')"
          class="box-card">
          <div slot="header" class="clearfix">
            {{ rootLang.customer_can_view_stock }}
            <div class="card-buttons">
              <button-action-authenticated
                :permission="['website/storestockrefs', 'store']"
                @click="addCustomerType"
                icon="el-icon-plus"
                type="success"
                size="small">
                {{ lang.add }}
              </button-action-authenticated>
            </div>
          </div>

          <div
            v-if="data.view_stock_customer_types && data.view_stock_customer_types.length"
            class="like-table-wrapper">
            <template v-for="(item, key) in data.view_stock_customer_types">
              <div class="flex-container like-table-wrapper--item" :key="key">
                <div class="full-width">
                  {{ item.name }}
                </div>
                <div class="text-right">
                  <button-action-authenticated
                    :permission="['website/storestockrefs', 'destroy']"
                    type="text"
                    icon="el-icon-close"
                    class="btn-plain"
                    size="mini"
                    @click="deleteCustomerType(key)"
                  />
                </div>
              </div>
            </template>
          </div>
          <div v-else>
            No data
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!--  dialog tambah social media -->
    <el-dialog :title="lang.add" @closed="loadData" :visible.sync="dialogSocialLink">
      <el-form :model="form">
        <el-form-item :label="lang.social_networks" label-width="140px">
          <el-select filterable v-model="selectedSocialLink">
            <template v-for="(item) in arrSocialLink">
              <el-option
                v-if="!item.value"
                :key="item.obj"
                :label="item.name"
                :value="item.obj">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <template v-for="(item, key) in arrSocialLink">
          <div v-if="selectedSocialLink === item.obj" :key="key">
            <el-form-item
              label="Link" label-width="140px">
              <el-input type="text" v-model="item.value"></el-input>
            </el-form-item>
            <el-form-item label-width="140px">
              <el-button @click="cancelEditSocialLink" :disabled="disabledButton" type="info" icon="el-icon-close">
                {{ lang.cancel }}
              </el-button>
              <el-button :disabled="disabledButton" type="success" @click="updateSocialLink" icon="el-icon-check">
                {{ lang.save }}
              </el-button>
            </el-form-item>
          </div>
        </template>
      </el-form>
    </el-dialog>
    <!--  dialog edit social media -->
    <el-dialog :title="lang.edit + ': ' + editingSocialLink.name" @closed="loadData" :visible.sync="dialogEditSocialLink">
      <el-form :model="editingSocialLink">
        <el-form-item
          :label="$lang[langId].link" label-width="140px">
          <el-input type="text" v-model="editingSocialLink.value" @keyup.enter="updateSocialLink"></el-input>
        </el-form-item>
        <el-form-item label-width="140px">
          <el-button :disabled="disabledButton" type="info" @click="cancelEditSocialLink" icon="el-icon-close">
            {{ lang.cancel }}
          </el-button>
          <el-button :disabled="disabledButton" type="success" @click="updateSocialLink" icon="el-icon-check">
            {{ lang.save }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  dialog tambah chatting -->
    <el-dialog :title="lang.add" @closed="loadData" :visible.sync="dialogChatting">
      <el-form :model="form">
        <el-form-item :label="$lang[langId].chat_app" label-width="140px">
          <el-select filterable v-model="selectedChatting">
            <template v-for="(item) in arrChatting">
              <el-option
                v-if="!item.value"
                :key="item.obj"
                :label="item.name"
                :value="item.obj">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <template v-for="(item, key) in arrChatting">
          <div v-if="selectedChatting === item.obj" :key="key">
            <el-form-item
              label="Link" label-width="140px">
              <el-input type="text" v-model="item.value"></el-input>
            </el-form-item>
            <el-form-item label-width="140px">
              <el-button @click="cancelEditChatting" :disabled="disabledButton" type="info" icon="el-icon-close">
                {{ lang.cancel }}
              </el-button>
              <el-button :disabled="disabledButton" type="success" @click="updateChatting" icon="el-icon-check">
                {{ lang.save }}
              </el-button>
            </el-form-item>
          </div>
        </template>
      </el-form>
    </el-dialog>
    <!--  dialog edit chatting -->
    <el-dialog :title="lang.edit + ': ' + editingChatting.name" @closed="loadData" :visible.sync="dialogEditChatting">
      <el-form :model="editingChatting">
        <el-form-item
          :label="$lang[langId].link" label-width="140px">
          <el-input type="text" v-model="editingChatting.value"></el-input>
        </el-form-item>
        <el-form-item label-width="140px">
          <el-button :disabled="disabledButton" type="info" @click="cancelEditChatting" icon="el-icon-close">
            {{ lang.cancel }}
          </el-button>
          <el-button :disabled="disabledButton" type="success" @click="updateChatting" icon="el-icon-check">
            {{ lang.save }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  dialog tambah mobile app -->
    <el-dialog :title="lang.add" @closed="loadData" :visible.sync="dialogMobileApp">
      <el-form :model="form">
        <el-form-item :label="lang.mobile_app" label-width="140px">
          <el-select filterable v-model="selectedMobileApp">
            <template v-for="(item) in arrMobileApp">
              <el-option
                v-if="!item.value"
                :key="item.obj"
                :label="item.name"
                :value="item.obj">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <template v-for="(item, key) in arrMobileApp">
          <div v-if="selectedMobileApp === item.obj" :key="key">
            <el-form-item
              label="Link" label-width="140px">
              <el-input type="text" v-model="item.value"></el-input>
            </el-form-item>
            <el-form-item label-width="140px">
              <el-button @click="cancelEditMobileApp" :disabled="disabledButton" type="info" icon="el-icon-close">
                {{ lang.cancel }}
              </el-button>
              <el-button :disabled="disabledButton" type="success" @click="updateMobileApp" icon="el-icon-check">
                {{ lang.save }}
              </el-button>
            </el-form-item>
          </div>
        </template>
      </el-form>
    </el-dialog>
    <!--  dialog edit mobile app -->
    <el-dialog :title="lang.edit + ': ' + editingMobileApp.name" @closed="loadData" :visible.sync="dialogEditMobileApp">
      <el-form :model="editingMobileApp">
        <el-form-item
          :label="$lang[langId].link" label-width="140px">
          <el-input type="text" v-model="editingMobileApp.value"></el-input>
        </el-form-item>
        <el-form-item label-width="140px">
          <el-button :disabled="disabledButton" type="info" @click="cancelEditMobileApp" icon="el-icon-close">
            {{ lang.cancel }}
          </el-button>
          <el-button :disabled="disabledButton" type="success" @click="updateMobileApp" icon="el-icon-check">
            {{ lang.save }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  dialog upload logo -->
    <el-dialog :title="lang.update_logo" :visible.sync="dialogEditUploadLogo">
      <el-row :gutter="10">
        <el-col :md="8">
          <p><strong>{{ lang.description }}</strong></p>
          <p class="size-12">{{ lang.click_to_change_your_logo }}</p>
        </el-col>
        <el-col :md="16">
          <el-upload
            drag
            style="width: 100%; max-width: 100%;"
            :action="urlUploadLogo"
            :file-list="fileList"
            :headers="headers"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
    <!--  dialog upload favicon -->
    <el-dialog :title="lang.change_favicon" :visible.sync="dialogEditUploadFavicon">
      <el-row :gutter="10">
        <el-col :md="8">
          <p><strong>{{ lang.description }}</strong></p>
          <p class="size-12">{{ lang.click_to_change_your_favicon }}</p>
        </el-col>
        <el-col :md="16">
          <el-upload
            drag
            style="width: 100%; max-width: 100%;"
            :action="urlUploadFavicon"
            :file-list="fileList"
            :headers="headers"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
    <!--  dialog upload Bg Theme -->
    <el-dialog :title="lang.change_background" :visible.sync="dialogEditUploadThemeBg">
      <el-row :gutter="10">
        <el-col :md="8">
          <p><strong>{{ lang.description }}</strong></p>
          <p class="size-12">{{ $lang[langId].only_apply_to_layout_box }}</p>
        </el-col>
        <el-col :md="16">
          <el-upload
            drag
            style="width: 100%; max-width: 100%;"
            :action="urlUploadThemeBg"
            :file-list="fileList"
            :headers="headers"
            :on-error="handleUploadFailed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- dialog edit css -->
    <el-dialog :title="lang.customize_theme_css" :visible.sync="dialogEditCss">
      <codemirror v-model="data.theme_css" :options="cmOptions"></codemirror>
      <div style="margin-top: 12px;" class="text-center">
        <el-button
          @click="cancelEditCss"
          :disabled="disabledButton"
          type="info"
          icon="el-icon-close">
          {{ lang.cancel }}
        </el-button>
        <el-button
          :disabled="disabledButton"
          type="success"
          @click="updateCss"
          icon="el-icon-check">
          {{ lang.save }}
        </el-button>
      </div>
    </el-dialog>
    <!--  dialog edit Homepage -->
    <el-dialog :title="lang.change_homepage" @closed="loadData" :visible.sync="dialogEditHomepage">
      <el-form :model="form">
        <el-form-item :label="lang.link_type" label-width="180px">
          <el-select filterable v-model="fresh.link_type_id">
            <el-option
              v-for="(item) in arrLinkType"
              :key="item.value"
              :label="item.title"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="fresh.link_type_id === 'PGR'"
          label-width="180px"
          :label="lang.product_groups">
          <el-select
            style="width: 100%;"
            v-model="fresh.product_group_id"
            filterable
            remote
            reserve-keyword
            :placeholder="lang.info_auto_complete_product_group"
            :remote-method="searchProductGroups"
            :loading="searchingProductGroups">
            <el-option
              v-for="item in searchResultProductGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="fresh.link_type_id === 'PCL'"
          label-width="180px"
          :label="$lang[langId].collection_product">
          <el-select
            style="width: 100%;"
            v-model="fresh.collection_id"
            filterable
            remote
            reserve-keyword
            :placeholder="lang.info_auto_complete_collection"
            :remote-method="searchCollections"
            :loading="searchingCollections">
            <el-option
              v-for="item in searchResultCollections"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="fresh.link_type_id === 'PRD'"
          label-width="180px"
          :label="lang.product">
          <el-select
            style="width: 100%;"
            v-model="fresh.product_id"
            filterable
            remote
            reserve-keyword
            :placeholder="lang.info_auto_complete_product"
            :remote-method="searchProducts"
            :loading="searchingProducts">
            <el-option
              v-for="item in searchResultProducts"
              :key="item.product_id"
              :label="item.name"
              :value="item.product_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="fresh.link_type_id === 'ATT'"
          label-width="180px"
          :label="lang.tag">
          <el-select
            style="width: 100%;"
            v-model="fresh.article_tag_id"
            filterable
            remote
            multiple
            reserve-keyword
            :placeholder="lang.info_auto_complete_product"
            :remote-method="searchArticleTags"
            :loading="searchingArticleTags">
            <el-option
              v-for="item in searchResultArticleTags"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="fresh.link_type_id === 'PAG'"
          label-width="180px"
          :label="lang.product">
          <el-select
            style="width: 100%;"
            v-model="fresh.page_id"
            filterable
            remote
            reserve-keyword
            :placeholder="lang.info_auto_complete_page"
            :remote-method="searchPages"
            :loading="searchingPages">
            <el-option
              v-for="item in searchResultPages"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="fresh.link_type_id === 'EXL'"
          :label="$lang[langId].link" label-width="180px">
          <el-input type="text" v-model="fresh.link_url" :placeholder="lang.info_external_url">
          </el-input>
        </el-form-item>

        <el-form-item label-width="180px">
          <el-button
            @click="cancelEditHomepage"
            :disabled="disabledButton"
            type="info"
            icon="el-icon-close">
            {{ lang.cancel }}
          </el-button>
          <el-button
            :disabled="disabledButton"
            type="success"
            @click="updateHomepage"
            icon="el-icon-check">
            {{ lang.save }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  dialog theme -->
    <template v-if="dialogTheme">
      <div class="full-page">
        <div class="full-page--page-top-menu">
          <el-row>
            <el-col :span="12">
              <el-button circle type="primary" icon="el-icon-back" @click="cancelEditTheme">
              </el-button>
            </el-col>
            <el-col :span="12" class="text-right">
              <el-select
                @change="filterThemes"
                style="width: 100px;"
                v-model="params.theme_category">
                <el-option v-for="cat in arrThemeCategories"
                  :label="cat.menuEn"
                  :value="cat.id"
                  :key="cat.index">
                </el-option>
              </el-select>
              <el-input type="text" style="width: 220px;" v-model="params.search"
                clearable @change="searchThemes" :placeholder="lang.search">
              </el-input>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="10" v-loading="loading">
          <el-col :md="12">
            <div class="theme-item" @click="loadThemeDetail(data.theme_id)">
              <div class="theme-photo-wrapper">
                <el-image :src="data.theme_photo" />
              </div>
              <div class="theme-meta">
                <template v-if="data.theme">
                  <strong>{{data.theme.name}}</strong>
                  <span class="size-12 oldgrey">{{ lang.used }}</span>
                </template>
              </div>
            </div>
          </el-col>
          <el-col :md="6" v-for="(theme, key) in themes" :key="key">
            <div v-if="theme.id !== data.theme_id">
              <div
                class="theme-item"
                @click="loadThemeDetail(theme.id)">
                <div class="theme-photo-wrapper">
                  <el-image img v-if="theme.photo" :src="theme.photo" />
                </div>
                <div class="theme-meta">
                  <strong>{{theme.name}}</strong>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-pagination
          v-if="paramstheme.total > 15"
          :total="paramstheme.total"
          :page-size="15"
          :current-page.sync="paramstheme.currentPage"
          background
          layout="prev, pager, next"
          @current-change="changeCurrentPage"
        />
      </div>
    </template>
    <!-- dialong single theme -->
    <el-dialog
      v-if="dialogSingleTheme"
      class="no-header"
      width="80%"
      @close="resetSingleTheme"
      :visible.sync="dialogSingleTheme">
      <div v-loading="loadingSingleTheme">
        <el-row :gutter="10" v-if="singleTheme">
          <el-col :md="14" v-if="singleTheme.screenshots">
            <el-carousel :interval="5000" arrow="always">
              <el-carousel-item v-for="photo in singleTheme.screenshots.photo" :key="photo.idx">
                <el-image :src="photo.url" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :md="10">
            <div class="single-theme-meta">
              <el-button type="default" @click="openpreview">
                {{ lang.preview }} <i class="fa fa-share-square-o fa-fw" aria-hidden="true"></i>
              </el-button>
              <el-button type="primary" @click="applyTheme">
                {{ $lang[langId].apply }}
              </el-button>
              <div style="margin-top: 20px;"></div>
              <p><span class="size-18"><strong>{{singleTheme.name}}</strong></span>
              <span class="size-12" v-if="singleTheme.version">
                {{ $lang[langId].version }} {{singleTheme.version.name}}
              </span></p>
              <p>{{singleTheme.description}}</p>

              <div style="margin-top: 40px;"></div>

              <template v-if="fresh.layouts.length > 0">
                <label>{{ lang.layout }}</label><br/>
                <el-select v-model="temp.layout">
                  <el-option
                    v-for="item in fresh.layouts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>

              <div style="margin-top: 10px;"></div>

              <template v-if="fresh.colors.length > 0">
                <label>{{ lang.color }}</label><br/>
                <el-select v-model="temp.color">
                  <el-option
                    v-for="item in fresh.colors"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>

              <div style="margin-top: 20px;"></div>

              <template v-if="singleTheme.author">
                <p>
                  <span class="oldgrey size-12">{{ $lang[langId].author }}</span><br/>
                  <strong>{{singleTheme.author.name}}</strong>
                </p>

                <p>
                  <span class="oldgrey size-12">{{ lang.email }}</span><br/>
                  <strong>{{singleTheme.author.email}}</strong>
                </p>

                <p>
                  <span class="oldgrey size-12">{{ lang.website }}</span><br/>
                  <strong>{{singleTheme.author.website}}</strong>
                </p>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--  dialog banner slide -->
    <el-dialog :title="lang.add" @closed="loadData" :visible.sync="dialogBannerSlide">
      <el-form :model="form" class="form-sidebyside form-myswebsite" @submit.native.prevent>
        <div class="open-create-body">
          <el-row :gutter="10">
            <el-col :sm="8">
              <el-form-item :label="lang.photo" :required="true"></el-form-item>
            </el-col>
            <el-col :sm="16">
              <el-form-item>
                <template v-if="!editingSlideItem.photo || editingSlideItem.change_photo">
                  <el-upload
                    ref="uploadBannerSlide"
                    :auto-upload="false"
                    :data="uploadSlideData"
                    :action="urlUploadSlideBanner"
                    :file-list="fileList"
                    :headers="headers"
                    :on-success="handleUploadBannerSlideSuccess"
                    :on-error="handleUploadFailed"
                    :before-upload="beforeUpload"
                    drag
                    style="width: 100%; max-width: 100%;"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">{{ $lang[langId].drop_file_or_click }}</div>
                  </el-upload>
                </template>

                <template v-else>
                  <el-image :src="editingSlideItem.photo" />
                </template>

                <template v-if="editingSlideItem.photo">
                  <div style="margin-top: 12px;"></div>
                  <el-button
                    v-if="!editingSlideItem.change_photo"
                    type="primary" class="btn-plain"
                    @click="editingSlideItem.change_photo = true">
                    {{ lang.change_photo }}
                  </el-button>
                  <el-button
                    v-else
                    type="default" class="btn-plain"
                    @click="editingSlideItem.change_photo = false">
                    {{ lang.cancel }}
                  </el-button>
                  <div style="margin-bottom: 12px;"></div>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :sm="8">
              <el-form-item :label="lang.title"></el-form-item>
            </el-col>
            <el-col :sm="16">
              <el-form-item>
                <el-input type="text" v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :sm="8">
              <el-form-item :label="lang.description"></el-form-item>
            </el-col>
            <el-col :sm="16">
              <el-form-item>
                <el-input type="text" v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :sm="8">
              <el-form-item :label="lang.banner_slide_with_link">
                <p>{{ lang.info_banner_slide_with_link }}</p>
              </el-form-item>
            </el-col>
            <el-col :sm="16">
              <el-form-item>
                <el-switch v-model="form.has_link"
                  :active-value="1" :inactive-value="0">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="form.has_link === 1">
            <el-col :sm="8">
              <el-form-item :label="lang.link_type"></el-form-item>
            </el-col>
            <el-col :sm="16">
              <el-form-item>
                <el-select filterable v-model="form.link_type_id">
                  <el-option
                    v-for="(item) in arrLinkType"
                    :key="item.value"
                    :label="item.title"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="form.link_type_id === 'PGR'">
                <el-select
                  style="width: 100%;"
                  v-model="form.product_group_id"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.info_auto_complete_product_group"
                  :remote-method="searchProductGroups"
                  :loading="searchingProductGroups">
                  <el-option
                    v-for="item in searchResultProductGroups"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.link_type_id === 'PCL'">
                <el-select
                  style="width: 100%;"
                  v-model="form.collection_id"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.info_auto_complete_collection"
                  :remote-method="searchCollections"
                  :loading="searchingCollections">
                  <el-option
                    v-for="item in searchResultCollections"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.link_type_id === 'PRD'">
                <el-select
                  style="width: 100%;"
                  v-model="form.product_id"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.info_auto_complete_product"
                  :remote-method="searchProducts"
                  :loading="searchingProducts">
                  <el-option
                    v-for="item in searchResultProducts"
                    :key="item.product_id"
                    :label="item.name"
                    :value="item.product_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.link_type_id === 'ATT'">
                <el-select
                  style="width: 100%;"
                  v-model="form.article_tag_id"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.info_auto_complete_product"
                  :remote-method="searchArticleTags"
                  :loading="searchingArticleTags">
                  <el-option
                    v-for="item in searchResultArticleTags"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.link_type_id === 'PAG'">
                <el-select
                  style="width: 100%;"
                  v-model="form.page_id"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="lang.info_auto_complete_page"
                  :remote-method="searchPages"
                  :loading="searchingPages">
                  <el-option
                    v-for="item in searchResultPages"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.link_type_id === 'EXL'">
                <el-input type="text" v-model="form.link_url" :placeholder="lang.info_external_url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item style="margin-top:10px;">
            <el-row>
              <el-col :span="10">
                <el-button v-if="editingSlideItem.id"
                  icon="el-icon-delete" class="btn-plain" type="danger"
                  :disabled="disabledButton"
                  @click="removeSlide(editingSlideItem.id)">
                </el-button>
              </el-col>
              <el-col :span="14" class="text-right">
                <el-button
                  @click="cancelEditBannerSlide"
                  :disabled="disabledButton"
                  type="info"
                  icon="el-icon-close">
                  {{ lang.cancel }}
                </el-button>
                <el-button
                  :disabled="disabledButton"
                  type="success"
                  @click="updateBannerSlide"
                  icon="el-icon-check">
                  {{ lang.save }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>

    <!-- dialog add customer type -->
    <el-dialog :title="lang.add + ' ' + lang.customer_type" @closed="loadData" :visible.sync="dialogCustomerAdd">
      <div>
        <span>{{ lang.customer_type }}</span>
        <el-select
          style="width: 100%;"
          v-model="dataCustomer"
          multiple
          filterable
          remote
          reserve-keyword
          :placeholder="$lang[langId].please_input + lang.customer_type"
          :remote-method="searchCustomerTypes"
          :loading="searchingCustomerTypes">
          <el-option
            v-for="item in searchResultCustomerTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div class="text-right mt-24"> 
          <el-button type="success" @click="updateCustomerType">{{ lang.save }}</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { baseApi } from 'src/http-common'
import axios from 'axios'
import draggable from 'vuedraggable'
import SlideItem from './SlideItem'
import SelectMultipleItems from 'src/components/modules/SelectMultipleItems'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import DataEmpty from '@/components/modules/DataEmpty.vue'
const constArrSocialLink = [
  {obj: 'link_blog', name: 'Blog', icon: 'wordpress'},
  {obj: 'link_facebook', name: 'Facebook', icon: 'facebook'},
  {obj: 'link_googleplus', name: 'Google Plus', icon: 'google-plus'},
  {obj: 'link_instagram', name: 'Instagram', icon: 'instagram'},
  {obj: 'link_pinterest', name: 'Pinterest', icon: 'pinterest'},
  {obj: 'link_tumblr', name: 'Tumblr', icon: 'tumblr'},
  {obj: 'link_twitter', name: 'Twitter', icon: 'twitter'},
  {obj: 'link_vimeo', name: 'Vimeo', icon: 'vimeo'},
  {obj: 'link_youtube', name: 'Youtube', icon: 'youtube'}
]
const constArrChatting = [
  {obj: 'chat_bbm', name: 'BBM', icon: 'comment'},
  {obj: 'chat_kakao', name: 'Kakao Talk', icon: 'comment'},
  {obj: 'chat_line', name: 'Line', icon: 'comment'},
  {obj: 'chat_skype', name: 'Skype', icon: 'skype'},
  {obj: 'chat_wechat', name: 'WeChat', icon: 'wechat'},
  {obj: 'chat_whatsapp', name: 'WhatsApp', icon: 'whatsapp'},
  {obj: 'chat_ym', name: 'Yahoo Messenger', icon: 'yahoo'}
]
const constArrMobileApp = [
  {obj: 'link_android_app', name: 'Android (Google Play)', icon: 'android'},
  {obj: 'link_ios_app', name: 'iOS (App Store)', icon: 'apple'}
]
const constThemeCategory = [
  {
    id: 'all',
    menuEn: 'All',
    menuId: 'Semua'
  },
  {
    id: 'is_featured',
    menuEn: 'Featured',
    menuId: 'Unggulan'
  },
  {
    id: 'is_popular',
    menuEn: 'Popular',
    menuId: 'Populer'
  },
  {
    id: 'my_theme',
    menuEn: 'My Theme',
    menuId: 'Themeku'
  }
]
export default {
  components: {
    draggable,
    SlideItem,
    codemirror,
    SelectMultipleItems,
    DataEmpty
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: false,
      loadingSingleTheme: false,
      dialogSocialLink: false,
      dialogEditSocialLink: false,
      dialogChatting: false,
      dialogEditChatting: false,
      dialogMobileApp: false,
      dialogEditMobileApp: false,
      dialogEditUploadLogo: false,
      dialogEditUploadFavicon: false,
      dialogEditUploadThemeBg: false,
      dialogEditCss: false,
      dialogEditHomepage: false,
      dialogTheme: false,
      dialogSingleTheme: false,
      dialogBannerSlide: false,
      selectedSocialLink: '',
      selectedChatting: '',
      selectedMobileApp: '',
      disabledButton: false,
      data: {},
      themes: [],
      singleTheme: {},
      arrSocialLink: [],
      arrChatting: [],
      arrMobileApp: [],
      arrLinkType: [
        {id: 0, value: 'HOM', judul: 'Beranda', title: this.$store.state.userStores.lang.home},
        {id: 1, value: 'CTL', judul: 'Semua Kategori', title: this.$lang[this.$store.state.userStores.langId].all_category},
        {id: 2, value: 'PGR', judul: 'Kategori Produk', title: this.$store.state.userStores.lang.product_category},
        {id: 3, value: 'PCL', judul: 'Koleksi Produk', title: this.$lang[this.$store.state.userStores.langId].collection_product},
        {id: 4, value: 'FEA', judul: 'Unggulan', title: this.$store.state.userStores.lang.featured},
        {id: 5, value: 'NRL', judul: 'Rilis Baru', title: this.$store.state.userStores.lang.new_release},
        {id: 6, value: 'POP', judul: 'Populer', title: this.$store.state.userStores.lang.popular},
        {id: 7, value: 'PRO', judul: 'Pre-order', title: this.$store.state.userStores.lang.preorder},
        {id: 8, value: 'SAL', judul: 'Sale', title: this.$store.state.userStores.lang.sales},
        {id: 9, value: 'PRD', judul: 'Produk', title: this.$store.state.userStores.lang.product},
        {id: 10, value: 'PCB', judul: 'Paket Produk', title: this.$store.state.userStores.lang.product_combo},
        {id: 11, value: 'PAG', judul: 'Halaman Web', title: this.$store.state.userStores.lang.page},
        {id: 12, value: 'ART', judul: 'Semua Artikel', title: this.$lang[this.$store.state.userStores.langId].all_article},
        {id: 13, value: 'ATT', judul: 'Artikel berdasarkan Tag', title: this.$lang[this.$store.state.userStores.langId].article_based_tag},
        {id: 14, value: 'FAQ', judul: 'Pertanyaan Umum', title: this.$store.state.userStores.lang.f_a_q},
        {id: 15, value: 'LBK', judul: 'Lookbook', title: this.$store.state.userStores.lang.look_book},
        {id: 16, value: 'TOU', judul: 'Ketentuan Penggunaan', title: this.$lang[this.$store.state.userStores.langId].term_of_use},
        {id: 17, value: 'PPO', judul: 'Kebijakan Privasi', title: this.$lang[this.$store.state.userStores.langId].privacy_policy},
        {id: 18, value: 'RFP', judul: 'Kebijakan Pengembalian', title: this.$lang[this.$store.state.userStores.langId].return_policy},
        {id: 19, value: 'EXL', judul: 'Link Eksternal', title: this.$store.state.userStores.lang.external_url}
      ],
      arrThemeCategories: constThemeCategory,
      editingSocialLink: {},
      editingChatting: {},
      editingMobileApp: {},
      editingSlideItem: {
        change_photo: false
      },
      form: {},
      fresh: {},
      fileList: '',
      params: {},
      showSavePublicity: false,
      cmOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/css',
        theme: 'base16-light'
      },
      searchingProductGroups: false,
      searchingCollections: false,
      searchingProducts: false,
      searchingPages: false,
      searchingArticleTags: false,
      searchResultProductGroups: [],
      searchResultCollections: [],
      searchResultProducts: [],
      searchResultPages: [],
      searchResultArticleTags: [],
      getColorTheme: {
        background: ''
      },
      preview: true,
      saveSortView: false,
      meta_keywords_options: '',
      meta_keywords_temp: [],
      temp: {
        color: '',
        layout: ''
      },
      paramstheme: {
        per_page: 15
      },
      dialogCustomerAdd: false,
      searchingCustomerTypes: false,
      searchResultCustomerTypes: [],
      dataCustomer: []
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
    countIncompletedSocialLink() {
      let incompleted = this.arrSocialLink.filter(item => {
        return item.value === ''
      })
      return incompleted.length
    },
    countIncompletedChatting() {
      let incompleted = this.arrChatting.filter(item => {
        return item.value === ''
      })
      return incompleted.length
    },
    countIncompletedMobileApp() {
      let incompleted = this.arrMobileApp.filter(item => {
        return item.value === ''
      })
      return incompleted.length
    },
    urlUploadLogo() {
      return baseApi(this.selectedStore.url_id, this.langId, 'mysite/uploadlogo')
    },
    urlUploadFavicon() {
      return baseApi(this.selectedStore.url_id, this.langId, 'mysite/uploadfavicon')
    },
    urlUploadThemeBg() {
      return baseApi(this.selectedStore.url_id, this.langId, 'mysite/uploadthemebackground')
    },
    urlUploadSlideBanner() {
      let endpoint = 'mysite/uploadslide'
      if (this.editingSlideItem.id) {
        endpoint = 'mysite/uploadslide'
      }
      return baseApi(this.selectedStore.url_id, this.langId, endpoint)
    },
    uploadSlideData() {
      if (this.editingSlideItem.id) {
        return {id: this.editingSlideItem.id}
      } else {
        return {id: ''}
      }
    }
  },

  watch: {
    '$store.getters.selectedStore': function(store) {
      this.loadData()
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      this.meta_keywords_options = ''
      this.resetState()
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      await axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'mysite'),
        headers: headers
      }).then(response => {
        this.data = Object.assign({}, response.data)
        if (this.data.meta_keywords.length > 1) {
          var keyword = this.data.meta_keywords.split(',')
          keyword.map(i => {
            this.meta_keywords_temp.push({
              name: i
            })
          })
          console.log('log', this.meta_keywords_temp)
        }

        this.arrMobileApp = []
        this.arrSocialLink = []
        this.arrChatting = []
        constArrSocialLink.map((item) => {
          this.arrSocialLink.push({...item, value: this.data[item.obj]})
        })
        constArrChatting.map((item) => {
          this.arrChatting.push({...item, value: this.data[item.obj]})
        })
        constArrMobileApp.map((item) => {
          this.arrMobileApp.push({...item, value: this.data[item.obj]})
        })

        if (!this.data.theme_css) {
          this.data.theme_css = ''
        }

        this.getColorTheme.background = this.data.theme.color
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    async loadThemes(params = {}, endpoint = 'theme') {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      await axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, endpoint),
        headers: headers,
        params: this.paramstheme
      }).then(response => {
        this.themes = response.data.data
        this.paramstheme.total = response.data.meta.total
        this.paramstheme.currentPage = response.data.meta.current_page
        this.loading = false
      }).catch((error) => {
        this.themes = []
        this.paramstheme.total = ''
        this.paramstheme.currentPage = ''
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
      })
    },

    async loadThemeDetail(themeId) {
      this.dialogSingleTheme = true
      this.loadingSingleTheme = true
      this.fresh.layouts = []
      this.fresh.colors = []
      this.temp = {
        color: '',
        layout: ''
      }
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      await axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'theme/' + themeId),
        headers: headers
      }).then(response => {
        this.singleTheme = {...response.data, id: themeId}
        if (this.singleTheme.layouts) {
          if (Array.isArray(this.singleTheme.layouts.option)) {
            this.fresh.layouts = this.singleTheme.layouts.option
          } else {
            this.fresh.layouts.push(this.singleTheme.layouts.option)
          }
          this.fresh.layout = this.fresh.layouts[0].id
          this.temp.layout = this.fresh.layouts[0].id
        }
        if (this.singleTheme.colors) {
          if (Array.isArray(this.singleTheme.colors.option)) {
            this.fresh.colors = this.singleTheme.colors.option
          } else {
            this.fresh.colors.push(this.singleTheme.colors.option)
          }
          this.fresh.color = this.fresh.colors[0].id
          this.temp.color = this.fresh.colors[0].id
        }
        this.loadingSingleTheme = false
      }).catch(() => {
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: 'Error'
        })
        this.dialogSingleTheme = false
        this.loadingSingleTheme = false
      })
    },

    async updateData(data, resolve, reject, endpoint = 'mysite', method = 'POST') {
      console.log(data.disable_cart, 'updateData')
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      await axios({
        method,
        url: baseApi(this.selectedStore.url_id, this.langId, endpoint),
        headers: headers,
        data
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    },

    prom(data) {
      this.meta_keywords_temp.push({
        name: data
      })
      var a = []
      this.meta_keywords_temp.map(i => {
        a.push(i.name)
      })
      this.data.meta_keywords = a.join(',')
      this.promiseUpdate(this.data)
      this.meta_keywords_temp = []
    },

    promiseUpdate(data, endpoint = 'mysite', method = 'POST') {
      this.loading = true
      this.disabledButton = true

      let promise = new Promise((resolve, reject) => {
        this.updateData(data, resolve, reject, endpoint, method)
      })

      promise.then(() => {
        this.$message({
          type: 'success',
          'message': 'Success'
        })
        this.loadData()

        this.dialogCustomerAdd = false
      }).catch((error) => {
        // this.$notify({
        //   type: 'warning',
        //   title: error.response.data.error.message,
        //   message: error.response.data.error.error
        // })
        var er = Object.getOwnPropertyNames(error.response.data.error.error)
        if (er.length >= 2) {
          var msg = []
          er.map((i,idx) => {
            msg.push(error.response.data.error.error[i][0])
          })
          var message = msg.join(', ')
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: message
          })
        } else {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[er[0]][0]
          })
        }
        this.loading = false
        this.disabledButton = false
      })
    },

    uploadHandler(endpoint) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {file: this.fileList}
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, endpoint),
        headers: headers,
        data
      }).then((res) => {
        this.handleUploadSuccess(res)
      }).catch(err => {
        this.handleUploadFailed(err)
      })
    },
    resetState() {
      this.arrSocialLink = []
      this.editingSocialLink = {}
      this.dialogSocialLink = false
      this.dialogEditSocialLink = false
      this.selectedSocialLink = ''

      this.arrMobileApp = []
      this.editingMobileApp = {}
      this.dialogMobileApp = false
      this.dialogEditMobileApp = false
      this.selectedMobileApp = ''

      this.arrChatting = []
      this.editingChatting = {}
      this.dialogChatting = false
      this.dialogEditChatting = false
      this.selectedChatting = ''

      this.dialogEditUploadLogo = false
      this.dialogEditUploadFavicon = false
      this.dialogEditUploadThemeBg = false
      this.dialogEditCss = false
      this.dialogEditHomepage = false
      this.dialogTheme = false
      this.dialogSingleTheme = false

      this.dialogBannerSlide = false
      this.editingSlideItem = {
        change_photo: false
      }

      this.fileList = []
      this.disabledButton = false
      this.form = {}
      this.fresh = {}
    },
    resetSingleTheme() {
      this.fresh = {}
      this.singleTheme = {}
    },
    updatePublicity(obj = '') {
      if (obj !== 'publ') {
        this.promiseUpdate(this.data)
      } else {
        this.loading = true
        let promise = new Promise((resolve, reject) => {
          this.updateData({status: this.data.website_published}, resolve, reject, 'mysite/updatepublishstatus')
        })

        promise.then(data => {
          this.data = data
          this.$message({
            type: 'success',
            'message': 'Success'
          })
          this.loading = false
        }).catch((error) => {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
          this.loading = false
          this.disabledButton = false
        })
      }
    },
    updateSocialLink() {
      this.arrSocialLink.map(item => {
        this.data[item.obj] = item.value
      })
      this.promiseUpdate(this.data)
    },
    updateChatting() {
      this.arrChatting.map(item => {
        this.data[item.obj] = item.value
      })
      this.promiseUpdate(this.data)
    },
    updateMobileApp() {
      this.arrMobileApp.map(item => {
        this.data[item.obj] = item.value
      })
      this.promiseUpdate(this.data)
    },
    updateCss() {
      this.promiseUpdate({css: this.data.theme_css}, 'mysite/updatethemecss')
    },
    updateHomepage() {
      this.promiseUpdate(this.fresh, 'mysite/updatehomepage')
    },
    updateBannerSlide() {
      this.disabledButton = true
      if (this.editingSlideItem.id && !this.editingSlideItem.change_photo) {
        this.updateSlideData()
      } else if (this.editingSlideItem.id && this.editingSlideItem.change_photo) {
        this.$refs.uploadBannerSlide.submit()
      } else {
        this.$refs.uploadBannerSlide.submit()
      }
    },
    updateSlideData() {
      let data = {...this.form, id: this.form.id}
      if (this.editingSlideItem.id) {
        data = {...this.editingSlideItem}
      }
      if (data.has_link === 0) {
        data.has_link = ''
        data.link_id = ''
        data.link_name = ''
        data.link_type_id = ''
        data.link_type_name = ''
        data.link_url = ''
      }
      this.$delete(data, 'photo')
      this.promiseUpdate(data, 'mysite/updateslidedetail/' + data.id, 'PUT')
    },
    cancelEditSocialLink() {
      this.loadData()
    },
    cancelEditChatting() {
      this.loadData()
    },
    cancelEditMobileApp() {
      this.loadData()
    },
    cancelEditCss() {
      this.loadData()
    },
    cancelEditHomepage() {
      this.loadData()
    },
    cancelEditTheme() {
      this.loadData()
    },
    cancelEditBannerSlide() {
      this.loadData()
    },
    editSocialLink(key) {
      this.editingSocialLink = this.arrSocialLink[key]
      this.dialogEditSocialLink = true
    },
    editChatting(key) {
      this.editingChatting = this.arrChatting[key]
      this.dialogEditChatting = true
    },
    editMobileApp(key) {
      this.editingMobileApp = this.arrMobileApp[key]
      this.dialogEditMobileApp = true
    },
    editUploadLogo() {
      this.dialogEditUploadLogo = true
    },
    editUploadFavicon() {
      this.dialogEditUploadFavicon = true
    },
    editUploadThemeBg() {
      this.dialogEditUploadThemeBg = true
    },
    editCss() {
      this.dialogEditCss = true
    },
    editHomepage() {
      this.dialogEditHomepage = true
    },
    editTheme() {
      this.dialogTheme = true
      this.loadThemes()
    },
    handleBeforeUploadSlide(file) {
      console.log(file)
      if (this.editingSlideItem.id) {
        return {
          file,
          id: this.editingSlideItem.id
        }
      } else {
        return ''
      }
    },
    handleUploadFailed(err) {
      this.$notify({
        type: 'warning',
        title: 'Failed',
        message: 'File too large or not match the type'
      })
      this.loading = false
      this.disabledButton = false
    },
    handleUploadSuccess(response) {
      this.loadData()
      this.$message({
        type: 'success',
        message: 'Success'
      })
    },
    handleUploadBannerSlideSuccess(response) {
      let slide = response.slides.slice(-1)
      if (!this.editingSlideItem.id) {
        let promise = new Promise((resolve, reject) => {
          slide.map((item, idx) => {
            this.form.id = item.id
            this.form.photo = item.photo
            if (idx === slide.length - 1) {
              resolve()
            }
          })
        })
        promise.then(() => {
          this.updateSlideData()
        })
      } else {
        let promise = new Promise((resolve, reject) => {
          slide.map((item, idx) => {
            this.editingSlideItem.photo = item.photo
            if (idx === slide.length - 1) {
              resolve()
            }
          })
        })
        promise.then(() => {
          this.updateSlideData()
        })
      }
    },
    handleEditSlideItem(data) {
      this.editingSlideItem = {...this.editingSlideItem, ...data}
      this.form = this.editingSlideItem
      this.dialogBannerSlide = true
    },
    addSocialLink() {
      this.dialogSocialLink = true
    },
    addChatting() {
      this.dialogChatting = true
    },
    addMobileApp() {
      this.dialogMobileApp = true
    },
    addSlide() {
      this.dialogBannerSlide = true
    },
    removeSlide(id) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'DELETE',
        url: baseApi(this.selectedStore.url_id, this.langId, 'mysite/removeslide/' + id),
        headers: headers
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'success'
        })
        this.loadData()
      }).catch(() => {
        this.loading = false
        this.$nofity({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    searchProductGroups(query) {
      //
      this.searchingProductGroups = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productgroup'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProductGroups = false
          this.searchResultProductGroups = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProductGroups = false
          this.searchResultProductGroups = []
        })
      }
    },
    searchCollections(query) {
      //
      this.searchingCollections = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'collection'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingCollections = false
          this.searchResultCollections = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingCollections = false
          this.searchResultCollections = []
        })
      }
    },
    searchProducts(query) {
      //
      this.searchingProducts = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'name',
        search_text: query,
        sort_column: 'name',
        sort_type: 'desc',
        per_page: 50
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'productvariantsearch'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingProducts = false
          this.searchResultProducts = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingProducts = false
          this.searchResultProducts = []
        })
      }
    },
    searchPages(query) {
      //
      this.searchingPages = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        search_column: 'title',
        search_text: query,
        sort_column: 'title',
        sort_type: 'desc'
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'page'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingPages = false
          this.searchResultPages = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingPages = false
          this.searchResultPages = []
        })
      }
    },
    searchArticleTags(query) {
      //
      this.searchingArticleTags = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let params = {
        name: query
      }
      if (query.length > 0) {
        axios({
          method: 'GET',
          url: baseApi(this.selectedStore.url_id, this.langId, 'article/searchtags'),
          headers: headers,
          params: params
        }).then(response => {
          this.searchingArticleTags = false
          this.searchResultArticleTags = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingArticleTags = false
          this.searchResultArticleTags = []
        })
      }
    },
    searchThemes() {
      if (!this.params.search) {
        this.$delete(this.paramstheme, 'search_text')
        this.$delete(this.paramstheme, 'search')
        this.$delete(this.paramstheme, 'search_column')
        this.loadThemes()
      } else {
          this.paramstheme.search_text = this.params.search,
          this.paramstheme.search = this.params.search,
          this.paramstheme.search_column = 'name'
        this.loadThemes()
      }
    },
    filterThemes() {
      let cat = this.params.theme_category
      if (!cat) {
        this.loadThemes()
      } else {
        let endpoint = 'theme'
        if (cat === 'my_theme') {
          endpoint = 'theme/mytheme'
        } else if (cat === 'is_featured') {
          endpoint = 'theme/featureds'
        } else if (cat === 'is_popular') {
          endpoint = 'theme/popular'
        }
        this.loadThemes({}, endpoint)
      }
    },
    applyTheme() {
      let data = {
        color: this.temp.color,
        layout: this.temp.layout
      }
      let endpoint = 'theme/' + this.singleTheme.id
      this.promiseUpdate(data, endpoint, 'PUT')
    },
    handleCurrency(ev) {
      let pattern = /^\d+$/
      if (!ev.match(pattern)) {
        this.data.auto_cancel_order_hour = 0
      }
    },
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },
    changeBanner(item) {
      this.saveSortView = true
    },

    saveSlide() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let sortedIds = this.data.slides
      sortedIds = sortedIds.map((item, idx) => {
        let data = {
          id: item.id
        }
        return data
      })
      let data = {
        sorted_ids: sortedIds
      }
      console.log('data', data)
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'mysite/sortingslides'),
        headers: headers,
        data
      }).then((res) => {
        this.loadData()
      }).catch(error => {
        console.log('data', error)
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    openpreview() {
      var endpoint = 'https://' + this.selectedStore.url_id + '.myolsera.com/?preview=' + this.singleTheme.id + '&layout=' + this.fresh.layout + '&color=' + this.fresh.color
      window.open(endpoint)
    },
    removeItem(key) {
      this.meta_keywords_temp.splice(key, 1)
      var a = []
      this.meta_keywords_temp.map(i => {
        a.push(i.name)
      })
      this.data.meta_keywords = a.join(',')
      this.promiseUpdate(this.data)
      this.meta_keywords_temp = []
    },
    handleShowWeb() {
      window.open('https://' + this.selectedStore.url_id + '.myolsera.com', '_blank')
    },

    changeCurrentPage(val) {
      this.paramstheme.currentPage = val
      this.paramstheme.page = val
      this.loadThemes()
    },

    addCustomerType () {
      this.dialogCustomerAdd = true
    },

    searchCustomerTypes(query) {
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
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = response.data.data.map(item => {
            return item
          })
        }).catch(() => {
          this.searchingCustomerTypes = false
          this.searchResultCustomerTypes = []
        })
      }
    },

    updateCustomerType () {
      
      if (this.data.view_stock_customer_types && this.data.view_stock_customer_types.length) {
        this.data.view_stock_customer_types.map(i => {
          this.dataCustomer.push(i.id)
        })
      }
      let data = {
        view_stock_customer_types: this.dataCustomer.join(',')
      }

      this.promiseUpdate(data)
    },

    deleteCustomerType (index) {
      let cst = []
      if (this.data.view_stock_customer_types && this.data.view_stock_customer_types.length) {
        this.data.view_stock_customer_types.map(i => {
          cst.push(i.id)
        })
        cst.splice(index, 1)
        
        let data = {
          view_stock_customer_types: cst.join(',')
        }
        console.log('aaa', data)
        this.promiseUpdate(data)
      }
    }
  }
}
</script>
