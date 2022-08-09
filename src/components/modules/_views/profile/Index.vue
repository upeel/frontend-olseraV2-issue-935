<template>
  <div>
    <div class="content-wrapper">
      <section class="content sales-list no-subpage">
        <div class="mw-1200">
          <!-- <div
            v-if="data.need_verification === 1"
            class="dasboard-tokourl flex-container p-16"
            style="flex-basis: 50%; flex-grow: 1;">
            <div class="mr-8">
              <svg-icon icon-class="information-circle" style="width:24px; height:54px;"/>
            </div>
            <div class="font-14 mr-8" style="flex-grow: 1;">
              <div>
                Mohon verifikasi kembali akun anda untuk pengkinian data
              </div>
            </div>
            <el-button type="text" @click="showVerifyData = true">{{ rootLang.verify }}</el-button>
          </div> -->
          <div class="flex-container no-flex-sm flex-container--same-height flex-container--content-space-between">
            <div v-if="data.otp && data.otp.status === '0' || !data.otp"
              class="dasboard-tokourl flex-container full-width mr-8">
              <div class="mr-8">
                <svg-icon icon-class="icon_verify" style="width:24px; height:40px;"/>
              </div>
              <div class="font-14" style="flex-grow: 1;">
                <div class="font-12 font-bold color-primary">{{ data.mobile }}</div>
                {{ rootLang.mobile_verify_desc }}
              </div>
              <div style="padding-right: 20px">
                <el-button
                  type="text"
                  @click="visibleDialogCitCall = true">
                  {{ rootLang.verify }}
                </el-button>
              </div>
            </div>

            <div v-if="data.verified"
              class="dasboard-tokourl flex-container full-width">
              <div class="mr-8">
                <svg-icon icon-class="email-verify" style="width:24px; height:40px;"/>
              </div>
              <div class="font-14" style="flex-grow: 1;">
                <div class="font-12 font-bold color-primary">{{ data.email }}</div>
                {{ rootLang.email_verify_desc1 }}
              </div>
              <div style="padding-right: 20px">
                <el-button type="text" @click="showDialogEmail = true">{{ rootLang.verify }}</el-button>
              </div>
            </div>
          </div>

          <template v-if="userRole.role_id === 'OW' || userRole.role_id === 'SP'">
            <div
              class="full-width flex-container text-center justify-center photo-profil-position"
              style="flex-direction: column"
              :style="data.otp && data.otp.status === '0' || !data.otp ? 'top: 310px' : ''"
              @mouseover="setDisplay(true)"
              @mouseleave="setDisplay(false)">
              <el-upload
                :action="uploadUrl"
                :on-progress="handleUploadProcess"
                :on-error="handleUploadError"
                :show-file-list="false"
                :headers="{Authorization: 'Bearer ' + token.access_token}"
                :on-success="handleAvatarSuccess">
                <template
                  v-if="data.photo">
                  <div class="photo-avatar-edit">
                    <el-image
                      :src="data.photo"
                      class="img-circle border-white"
                      fit="cover"
                      style="width: 100px; height: 100px;"
                    />
                    <svg-icon icon-class="edit-2" class="photo-avatar-edit--trigger" ></svg-icon>
                  </div>
                </template>
                <template v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </template>
              </el-upload>
              <div class="mt-16 color-white">
                <div class="font-24">{{ data.name }}</div>
                <span class="font-12">{{ data.email }} • {{ data.role }}</span>
              </div>
            </div>
            <div class="photo-placeholder2">
              
            </div>
            <div class="flex-container justify-center" style="position: relative; z-index: 1000; top: -50px">
              <el-card class="box-card without-padding" style="width: 90%" v-loading="loading">
                <div class="flex-container no-flex-sm flex-container--start">
                  <div class="full-width p-24">
                    <div class="biodata">
                      <div class="font-24 font-bold mb-16">{{ lang.my_profile }}</div>
                      <div>
                        <el-form
                          ref="form" 
                          :model="data" 
                          label-position="top">
                          <el-form-item :label="lang.name" prop="name">
                            <div class="bg-f5 border border--form px-12 flex-container pointer" style="height: 40px" @click="handleEdit(1)">
                              <div class="font-16 font-bold full-width">{{ data.name }}</div>
                              <svg-icon icon-class="edit-2" class="color-primary font-20" slot="suffix"></svg-icon>
                            </div>
                          </el-form-item>

                          <el-form-item :label="lang.mobile" prop="mobile">
                            <div class="bg-f5 border border--form px-12 flex-container pointer" style="height: 40px" @click="handleEdit(2)">
                              <div class="font-16 font-bold full-width">{{ data.mobile }}</div>
                              <svg-icon icon-class="edit-2" class="color-primary font-20" slot="suffix"></svg-icon>
                            </div>
                          </el-form-item>

                          <el-form-item :label="lang.password" prop="mobile">
                            <div class="bg-f5 border border--form pl-10">
                              <el-button type="text" @click="handleEdit(3)">
                                {{ lang.change_password }}
                              </el-button>
                            </div>
                          </el-form-item>

                          <el-form-item :label="$lang[langId].change_language">
                            <el-select v-model="language" filterable :placeholder="lang.please_select" @change="setLang" class="full-width">
                              <el-option v-for="item in langSelect" :key="item.id" :label="item.name" :value="item.id">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                      </div>
                    </div>
                  </div>
                  <div class="full-width p-24">
                    <template v-if="data.data_sensitive === null">
                      <div class="text-center">
                        <div class="font-79">
                          <svg-icon icon-class="icon-profile-with-shield" />
                        </div>
                        <div class="font-bold text-left font-18">
                          Informasi akun Anda belum lengkap nih!
                        </div>
                        <div class="text-left font-14">
                          Lengkapi sekarang dan dapatkan manfaat maksimal dari Olsera.
                        </div>
                        <div class="radius-50 color-warning--soft--bg px-10 py-8 flex-container mt-16 justify-center">
                          <div class="full-width">
                            <svg-icon icon-class="information-circle-feather" />
                            Jenis Kelamin
                          </div>
                          <div class="full-width">
                            <svg-icon icon-class="information-circle-feather" />
                            Tanggal Lahir
                          </div>
                          <div class="full-width">
                            <svg-icon icon-class="information-circle-feather" />
                            Pendidikan
                          </div>
                        </div>
                        <div class="mt-45">
                          <el-button class="btn-block" @click="handleEditDataSensitive">Lengkapi sekarang</el-button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="font-24 font-bold mb-16 flex-container flex-container--start">
                        <div class="full-width">{{ rootLang.account_information }}</div>
                        <div class="container-icon color-primary pointer" @click="handleEditDataSensitive"><svg-icon icon-class="edit-2" /></div>
                      </div>
                      <div class="mt-24 p-8 flex-container">
                        <div class="full-width">Gender</div>
                        <div class="full-width font-bold text-right">{{ data.data_sensitive.gender === 'M' ? rootLang.male : data.data_sensitive.gender === 'F' ? rootLang.female : 'Rather not say'}}</div>
                      </div>
                      <div class="p-8 flex-container">
                        <div class="full-width">{{ rootLang.birth_date }}</div>
                        <div class="full-width font-bold text-right">{{ data.data_sensitive.fbirthday }}</div>
                      </div>
                      <div class="p-8 flex-container">
                        <div class="full-width">Nomor KTP</div>
                        <div class="full-width font-bold text-right">{{ data.data_sensitive.number_ktp }}</div>
                      </div>
                      <div class="p-8 flex-container">
                        <div class="full-width">Nomor NPWP</div>
                        <div class="full-width font-bold text-right">{{ data.data_sensitive.number_npwp }}</div>
                      </div>
                      <div class="p-8 flex-container">
                        <div class="full-width">Foto selfie pegang KTP</div>
                        <div class="full-width font-bold text-right">
                          <img
                            :src="data.data_sensitive.img_selfie_md" alt=""
                            class="img-document-grabfood--preview">
                        </div>
                      </div>
                      <div class="p-8 flex-container">
                        <div class="full-width">Foto KTP</div>
                        <div class="full-width font-bold text-right">
                          <img
                            :src="data.data_sensitive.img_ktp_md" alt=""
                            class="img-document-grabfood--preview">
                        </div>
                      </div>
                      <div class="p-8 flex-container">
                        <div class="full-width">Foto NPWP</div>
                        <div class="full-width font-bold text-right">
                          <img
                            :src="data.data_sensitive.img_npwp_md" alt=""
                            class="img-document-grabfood--preview">
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </el-card>
            </div>
          </template>

          <el-card v-else class="box-card without-padding" v-loading="loading">
            <div class="flex-container no-flex-sm">
              <div
                class="full-width flex-container text-center justify-center photo-placeholder"
                style="flex-direction: column"
                @mouseover="setDisplay(true)"
                @mouseleave="setDisplay(false)">
                <el-upload
                  :action="uploadUrl"
                  :on-progress="handleUploadProcess"
                  :on-error="handleUploadError"
                  :show-file-list="false"
                  :headers="{Authorization: 'Bearer ' + token.access_token}"
                  :on-success="handleAvatarSuccess">
                  <template
                    v-if="data.photo">
                    <div class="photo-avatar-edit">
                      <el-image
                        :src="data.photo"
                        class="img-circle border-white"
                        fit="cover"
                        style="width: 100px; height: 100px;"
                      />
                      <svg-icon icon-class="edit-2" class="photo-avatar-edit--trigger" ></svg-icon>
                    </div>
                  </template>
                  <template v-else>
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </template>
                </el-upload>
                <div class="mt-16 color-white">
                  <div class="font-24">{{ data.name }}</div>
                  <span class="font-12">{{ data.email }} • {{ data.role }}</span>
                </div>
              </div>

              <div class="full-width p-24" style="height: 400px;">
                <div class="biodata">
                  <div class="font-24 font-bold mb-16">{{ lang.my_profile }}</div>
                  <div>
                    <el-form
                      ref="form" 
                      :model="data" 
                      label-position="top">
                      <el-form-item :label="lang.name" prop="name">
                        <div class="bg-f5 border border--form px-12 flex-container pointer" style="height: 40px" @click="handleEdit(1)">
                          <div class="font-16 font-bold full-width">{{ data.name }}</div>
                          <svg-icon icon-class="edit-2" class="color-primary font-20" slot="suffix"></svg-icon>
                        </div>
                      </el-form-item>

                      <el-form-item :label="lang.mobile" prop="mobile">
                        <div class="bg-f5 border border--form px-12 flex-container pointer" style="height: 40px" @click="handleEdit(2)">
                          <div class="font-16 font-bold full-width">{{ data.mobile }}</div>
                          <svg-icon icon-class="edit-2" class="color-primary font-20" slot="suffix"></svg-icon>
                        </div>
                      </el-form-item>

                      <el-form-item :label="lang.password" prop="mobile">
                        <div class="bg-f5 border border--form pl-10">
                          <el-button type="text" @click="handleEdit(3)">
                            {{ lang.change_password }}
                          </el-button>
                        </div>
                      </el-form-item>

                      <el-form-item :label="$lang[langId].change_language">
                        <el-select v-model="language" filterable :placeholder="lang.please_select" @change="setLang">
                          <el-option v-for="item in langSelect" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <transition name="el-zoom-in-center">
          <div
            v-if="sidebarEdit"
            class="offscreen-right-sidebar">
            <div class="offscreen-right-sidebar--wrapper">
              <div class="offscreen-right-sidebar--header">
                <span v-if="temp.name">Ubah Nama</span>
                <span v-else-if="temp.mobile">Ubah Nomor HP</span>
                <span v-else-if="temp.password">Ubah Password</span>
                <close-esc @close="handleClose" />
              </div>
              <div>
                <el-form
                  ref="form" 
                  :model="tmp" 
                  label-position="top"
                  @submit.native.prevent>
                  <el-form-item v-if="temp.name" :label="lang.name" prop="name">
                    <el-input v-model="tmp.name" @keyup.native.enter="saveEdit" />
                  </el-form-item>
                  <el-form-item v-else-if="temp.mobile" :label="lang.mobile" prop="mobile">
                    <phone-number-input
                      v-model="tmp.mobile"
                      :translations="{
                        countrySelectorLabel: '',
                        countrySelectorError: '',
                        phoneNumberLabel: '',
                        example: ''
                      }"
                      :only-countries="['ID', 'SG']"
                      class="field-register"
                      default-country-code="ID"
                      @update="getPhone"
                      @keyup.enter.native="saveEdit"
                    />
                  </el-form-item>
                  <div v-else-if="temp.password">
                    <el-form-item prop="password" :label="lang.current_password">
                      <el-input
                        type="password"
                        v-model="password.password"
                      />
                    </el-form-item>

                    <el-form-item prop="password_new" :label="lang.new_password">
                      <el-input
                        type="password"
                        v-model="password.password_new"
                      />
                    </el-form-item>

                    <el-form-item prop="password_new_confirmation" :label="lang.confirm_new_password">
                      <el-input
                        type="password"
                        v-model="password.password_new_confirmation"
                        @keyup.native.enter="saveEdit"
                      />
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <div class="offscreen-right-sidebar--footer">
                <el-button
                  :loading="loadingState"
                  type="primary"
                  class="btn-block"
                  @click="saveEdit">
                  {{ lang.save }}
                </el-button>
              </div>
            </div>
          </div>
        </transition>

        <transition name="el-zoom-in-center">
          <div
            v-if="showVerifyData"
            class="offscreen-right-sidebar">
            <div class="offscreen-right-sidebar--wrapper">
              <div class="offscreen-right-sidebar--header">
                <span>{{ rootLang.verification_data }}</span>
                <close-esc @close="showVerifyData = false" />
              </div>
              <div class="mt-24">
                <perfect-scrollbar class="scrollSidebar">
                  <div class="full-width mt-16">
                    <span class="font-12">Gender</span>
                    <div>
                      <el-select v-model="dataVerify.gender" placeholder="Select" class="full-width">
                        <el-option
                          v-for="item in optionGender"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          class="full-width">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="full-width mt-16">
                    <span class="font-12">{{ rootLang.birth_date }}</span>
                    <div class="flex-container">
                      <!-- <single-date-picker v-model="dataVerify.birthday" :no-arrow="true" :clearable="true" /> -->
                      <el-select v-model="dataVerify.date_birthday" ref="dateBirthday" placeholder="Select" @change="updateDate">
                        <el-option
                          v-for="item in 31"
                          :key="item"
                          :label="item"
                          :value="item"
                          class="full-width">
                        </el-option>
                      </el-select>
                      <el-date-picker
                        v-model="dataVerify.month_birthday"
                        type="month"
                        placeholder="Pick a month"
                        format="MMMM"
                        value-format="MM"
                        popper-class="hide-header-datepicker"
                        @blur="updateDate">
                      </el-date-picker>
                      <el-date-picker
                        v-model="dataVerify.year_birthday"
                        type="year"
                        placeholder="Pick a year"
                        format="yyyy"
                        value-format="yyyy"
                        @blur="updateDate">
                      </el-date-picker>
                    </div>
                    <div class="color-danger font-12 mt-4" v-if="!isValidDate">{{ rootLang.date_is_invalid }}</div>
                  </div>
                  <div class="full-width mt-16">
                    <span class="font-12">{{ rootLang.last_education }}</span>
                    <div>
                      <el-select v-model="dataVerify.last_education" placeholder="Select" class="full-width">
                        <el-option
                          v-for="item in optionsListEducation"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="full-width mt-16">
                    <span class="font-12">{{ rootLang.idcard_number }}</span>
                    <div>
                      <el-input v-model="dataVerify.number_ktp" maxlength="16" />
                    </div>
                  </div>
                  <div class="full-width mt-16">
                    <span class="font-12">Nomor NPWP</span>
                    <div>
                      <!-- <el-input v-model="dataVerify.number_npwp" /> -->
                      <el-input class="input-radius" size="small" v-model="dataVerify.number_npwp" :maxlength="20"
                      onkeydown="return ( event.ctrlKey || event.altKey 
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9) 
                          || (event.keyCode>34 && event.keyCode<40) 
                          || (event.keyCode==46) )"
                          v-mask="'##.###.###.#-###.###'"/>
                    </div>
                  </div>
                  <div class="full-width mt-16 ">
                    <div class="border border--grey border--with-shadow radius-2 p-16 flex-container">
                      <div class="font-18 full-width">Foto Selfie
                        <div class="font-12 color-primary pointer" @click="handleShowExample('selfie')">{{ rootLang.example }}</div>
                      </div>
                      <div class="full-widht">
                        <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
                          <el-upload
                            v-loading="loadingUpload"
                            :action="uploadPhotoUrl"
                            :headers="headersReverify"
                            :before-upload="beforeUpload"
                            :show-file-list="false"
                            :on-progress="handleUploadProgress"
                            :on-success="handleUploadSelfieSuccess"
                            :on-error="handleUploadError"
                            list-type="document-grabfood"
                            >
                            <template v-if="dataVerify.img_selfie === null">
                              <img
                                :src="dataVerify.img_selfie_md" alt=""
                                class="img-document-grabfood"
                              >
                            </template>
                            <template v-else>
                              <img
                                v-if="Object.keys(dataVerify.img_selfie).length !== 0"
                                :src="dataVerify.img_selfie.photo_md" alt=""
                                class="img-document-grabfood"
                              >
                              <i v-else class="el-icon-camera"></i>
                            </template>
                          </el-upload>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="full-width mt-16 ">
                    <div class="border border--grey border--with-shadow radius-2 p-16 flex-container">
                      <div class="font-18 full-width">Foto KTP
                        <div class="font-12 color-primary pointer" @click="handleShowExample('ktp')">{{ rootLang.example }}</div>
                      </div>
                      <div class="full-widht">
                        <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
                          <el-upload
                            v-loading="loadingUpload"
                            :action="uploadPhotoUrl"
                            :headers="headersReverify"
                            :before-upload="beforeUpload"
                            :show-file-list="false"
                            :on-progress="handleUploadProgress"
                            :on-success="handleUploadIdCardSuccess"
                            :on-error="handleUploadError"
                            list-type="document-grabfood"
                            >
                            <template v-if="dataVerify.img_ktp === null">
                              <img
                                :src="dataVerify.img_ktp_md" alt=""
                                class="img-document-grabfood"
                              >
                            </template>
                            <template v-else>
                              <img
                                v-if="Object.keys(dataVerify.img_ktp).length !== 0"
                                :src="dataVerify.img_ktp.photo_md" alt=""
                                class="img-document-grabfood"
                              >
                              <i v-else class="el-icon-camera"></i>
                            </template>
                          </el-upload>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="full-width mt-16 ">
                    <div class="border border--grey border--with-shadow radius-2 p-16 flex-container">
                      <div class="font-18 full-width">Foto NPWP (Optional)
                        <div class="font-12 color-primary pointer" @click="handleShowExample('npwp')">{{ rootLang.example }}</div>
                      </div>
                      <div class="full-widht">
                        <div class="color-grey--bg flex-container justify-center" style="width: 56px; height: 56px">
                          <el-upload
                            v-loading="loadingUpload"
                            :action="uploadPhotoUrl"
                            :headers="headersReverify"
                            :before-upload="beforeUpload"
                            :show-file-list="false"
                            :on-progress="handleUploadProgress"
                            :on-success="handleUploadNpwpSuccess"
                            :on-error="handleUploadError"
                            list-type="document-grabfood"
                            >
                            <template v-if="dataVerify.img_npwp === null">
                              <img
                                :src="dataVerify.img_npwp_md" alt=""
                                class="img-document-grabfood"
                              >
                            </template>
                            <template v-else>
                              <img
                                v-if="Object.keys(dataVerify.img_npwp).length !== 0"
                                :src="dataVerify.img_npwp.photo_md" alt=""
                                class="img-document-grabfood"
                              >
                              <i v-else class="el-icon-camera"></i>
                            </template>
                          </el-upload>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="full-width mt-16">
                    <span class="font-12">Tipe Perusahaan</span>
                    <el-radio-group
                      v-model="dataVerify.is_company"
                      class="full-width flex-container border border--info">
                      <el-radio-button class="lpoint-type" :label="1">
                        Badan Usaha
                      </el-radio-button>
                      <el-radio-button class="lpoint-type" :label="0">
                        Personal
                      </el-radio-button>
                    </el-radio-group>
                  </div>
                  <div class="full-width mt-16">
                    <span class="font-12">{{ rootLang.business_name }}</span>
                    <div>
                      <el-input v-model="dataVerify.business_name" />
                    </div>
                  </div>
                  <div class="full-width mt-16">
                    <span class="font-12">Tipe Bisnis</span>
                    <el-select
                      v-model="dataVerify.business_type_id"
                      placeholder="Pilih tipe bisnis Anda"
                      filterable
                      style="width:100%">
                      <el-option
                        v-for="item in businessTypes"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      />
                    </el-select>
                  </div>
                  <div v-if="dataVerify.business_type_id === 17" class="full-width ml-16 mt-16">
                    <span class="font-12">Bisnis type lainnya</span>
                    <div>
                      <el-input v-model="dataVerify.business_type_other" />
                    </div>
                  </div>
                  <div class="full-width mt-16">
                    <span class="font-12">Bisnis Deskripsi</span>
                    <div>
                      <el-input v-model="dataVerify.business_description" />
                    </div>
                  </div> -->
                </perfect-scrollbar>
              </div>
              <div class="offscreen-right-sidebar--footer">
                <el-button
                  :disabled="!isValidDate"
                  :loading="loadingVerify"
                  type="primary"
                  class="btn-block"
                  @click="saveVerify">
                  {{ lang.save }}
                </el-button>
              </div>
            </div>
          </div>
        </transition>
      </section>
    </div>

    <el-dialog
      :visible.sync="showExample"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleCloseExample"
      append-to-body
      custom-class="dialog-transparant-bg">
      <div>
        <template v-for="(item, idx) in dataFoto">
          <el-image
            v-if="item.active === 1"
            :key="idx"
            :src="item.url"
          />
        </template>
      </div>
    </el-dialog>

    <dialog-input-password
      :show="showDialogPassword"
      :root-lang="rootLang"
      :data-profile="tmp"
      @save="handlePasswordConfirmSuccess"
      @close="showDialogPassword = false, handleClose"
    />

    <dialog-resend-email
      :show="showDialogEmail"
      :root-lang="rootLang"
      :data-profile="data"
      @close="showDialogEmail = false"
      @save="showDialogEmail = false" />

    <dialog-phone-verification
      ref="dialogPhoneVerification"
      :show="visibleDialogResendOtp"
      :data-profile="tmp"
      :verify-outside="verifyPhoneNumberOutside"
      :skip-input="skipInputPhoneNumberVerification"
      @verified="verify"
      @resend="handleResendOtp"
      @close="handleCloseDialogPhoneVerification"
      @changesms="changeSms(false)"
    />

    <!-- dialog phone number verification by citcall -->
    <dialog-cit-call-verification
    ref="dialogCitCallVerification"
      :data-profile="tmp"
      :show="visibleDialogCitCall"
      :otp-sent="hasMiscall"
      :count-dialog="countDialog"
      :dashboard="true"
      :verify-outside="verifyPhoneNumberOutside"
      :skip-input="skipInputPhoneNumberVerification"
      :error-call="errorCall"
      :error-call-data="errorCallData"
      @close="closeCitcall"
      @verified="verify"
      @resend="handleResendOtp"
      @changesms="changeSms(true)"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { baseApi, HTTP } from 'src/http-common'
import { getBusinessTypes, reverifyProfile } from '@/api/auth'
import axios from 'axios'
import vm from 'src/eventHub'
import CloseEsc from '@/components/modules/CloseEsc'
import DialogResendEmail from '@/components/DialogResendEmail'
import DialogInputPassword from '@/components/DialogInputPassword'
import DialogPhoneVerification from '@/components/DialogPhoneVerification'
import DialogCitCallVerification from '@/components/DialogCitCallVerification'

import SingleDatePicker from '@/components/SingleDatePicker'

import { updateStore } from '@/api/store'

import basicComputedMixin from '@/mixins/basicComputedMixin'

const apiEndPoint = 'myprofile'
export default {
  name: 'MyProfile',
  components: {
    CloseEsc,
    DialogInputPassword,
    DialogResendEmail,
    DialogPhoneVerification,
    DialogCitCallVerification,
    SingleDatePicker
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: true,
      data: {
        otp: {
          status: ''
        }
      },
      tmp: {},
      password: {},
      language: this.$store.state.userStores.langId,
      langSelect: [{
        id: 'id',
        name: 'Bahasa Indonesia'
      }, {
        id: 'en',
        name: 'English'
      }],
      sidebarEdit: false,
      temp: {
        name: false,
        mobile: false,
        password: false
      },
      showDialogPassword: false,
      showDialogEmail: false,
      visibleDialogResendOtp: false,
      otpFor: 1,
      displayHover: 'display: none',
      loadingState: false,
      verifyPhoneNumberOutside: false,
      skipInputPhoneNumberVerification: false,
      visibleDialogCitCall: false,
      hasMiscall: false,
      countDialog: 2,
      countStart: '',
      countEnd: '',
      useMiscall: true,
      errorCall: false,
      errorCallData: {},
      dataStore: {},
      otpType: 2,
      showVerifyData: false,
      dataVerify: {
        gender: 'M',
        tempGender: 'M',
        birthday: '',
        last_education: '',
        img_ktp: '',
        number_ktp: '',
        number_npwp: '',
        img_selfie: '',
        img_npwp: '',
        business_name: '',
        business_type_id: '',
        business_type_other: '',
        business_description: '',
        is_company: 0,
      },
      optionGender: [
        {
          value: 'M',
          label: this.$lang[this.$store.state.userStores.langId].male
        },
        {
          value: 'F',
          label: this.$lang[this.$store.state.userStores.langId].female
        },
        {
          value: 'E',
          label: 'Rather not say'
        }
      ],
      optionsListEducation: [
        {
          value: 'SD',
          label: 'SD'
        },
        {
          value: 'SMP',
          label: 'SMP'
        },
        {
          value: 'SMA',
          label: 'SMA'
        },
        {
          value: 'SMK',
          label: 'SMK'
        },
        {
          value: 'S1',
          label: 'S1'
        },
        {
          value: 'S2',
          label: 'S2'
        }
      ],
      dataFoto: [
        {
          id: 'ktp',
          active: 0,
          url: '/static/img/service-activation/grab/ktp.png'
        },
        {
          id: 'selfie',
          active: 0,
          url: '/static/img/service-activation/grab/ktp_selfie.png'
        },
        {
          id: 'npwp',
          active: 0,
          url: '/static/img/service-activation/grab/npwp.png'
        },
      ],
      loadingUpload: false,
      businessTypes: [],
      showExample: false,
      loadingVerify: false,
      isValidDate: true
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
    rootLang() {
      return this.$lang[this.langId]
    },
    uploadUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, apiEndPoint + '/upload')
    },

    uploadPhotoUrl() {
      return baseApi(this.selectedStore.url_id, this.langId, 'upload-userdatasensitive')
    },

    headersReverify() {
      return {
        'Authorization': 'Bearer ' + this.token.access_token
      }
    },

    // validDate () {
    //   this.$forceUpdate()
    //   console.log('vv', 'aa')
    //   if (this.dataVerify.date_birthday && this.dataVerify.month_birthday && this.dataVerify.year_birthday) {
    //     let d = this.dataVerify.date_birthday.toString().length === 1? '0' + this.dataVerify.date_birthday : this.dataVerify.date_birthday
    //     let m = this.dataVerify.month_birthday.toString().length === 1? '0' + this.dataVerify.month_birthday : this.dataVerify.month_birthday
    //     let date = this.dataVerify.year_birthday + '-' + m + '-' + d 
    //     // let dateFormat = moment(date, 'YYYY-MM-dd')
    //     // console.log('date', date)
    //     // console.log('date', moment(date, 'YYYY-MM-DD', true).isValid())
    //     if (moment(date, 'YYYY-MM-DD', true).isValid()) {
    //       this.dataVerify.birthday = date
    //     } else {
    //       this.dataVerify.birthday = ''
    //     }
    //     return moment(date, 'YYYY-MM-DD', true).isValid()
    //   } else {
    //     return true
    //   }
    // }
  },

  mounted() {
    this.getData()
    this.getStoreData()
    this.getBusinessTypes()
    console.log('state', this.$store.state)
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        headers: headers
      }).then(response => {
        this.data = response.data.data
        if (this.data.mobile === '') {
          this.data.mobile = 0
        }
        this.tmp = { ...this.data }
        this.loading = false
      }).catch(error => {
        this.data = {}
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },
    save(block) {
      this.loadingState = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      let data = {}
      
      let url = ''
      let method = 'POST'
      if (this.temp.name) {
        data.name = this.tmp.name
        url = baseApi(this.selectedStore.url_id, this.langId, apiEndPoint)
        method = 'PUT'
      }
      else if (this.temp.mobile) {
        data.mobile = this.tmp.mobile
        data.password = this.tmp.password
        // if (this.useMiscall) {
          data.use_otp_type = this.otpType
        // }
        // this.useMiscall ? data.use_otp_miscall = 1 : data.use_otp_miscall = 0
        url = baseApi(this.selectedStore.url_id, this.langId, 'myprofile/changephone/resendotp')
      }
      else if (this.temp.password) {
        data = this.password
        this.useMiscall ? data.use_otp_miscall = 1 : data.use_otp_miscall = 0
        url = baseApi(this.selectedStore.url_id, this.langId, 'myprofile/changepassword/resendotp')
      }
      axios({
        method: method,
        url: url,
        headers: headers,
        data
      }).then(response => {
        // this.data = response.data.data
        this.sidebarEdit = false
        if (this.temp.password) {
          this.otpFor = 3
        } else if (this.temp.mobile) {
          this.otpFor = 2
          this.showDialogPassword = false
        } else if (this.temp.name) {
          this.data = response.data.data
          this.$store.dispatch('fetchUserLoggedin')
          this.handleClose()
        }
        if (this.otpFor === 3 || this.otpFor === 2) {
          this.verifyPhoneNumberOutside = true
          this.skipInputPhoneNumberVerification = true
          if (this.useMiscall) {
            this.tmp.tokenMiscall = '+' + response.data.data.token
            this.visibleDialogCitCall = true
            this.hasMiscall = true
            this.$nextTick(() => {
              console.log(this.$refs.dialogCitCallVerification)
              this.$refs.dialogCitCallVerification.updateInputOtp()
              this.$refs.dialogCitCallVerification.generateTimer()
            })
          } else {
            this.visibleDialogResendOtp = true
            this.$nextTick(() => {
              this.$refs.dialogPhoneVerification.generateTimer()
            })
          }
        }
        this.loadingState = false
        this.errorCall = false
        this.errorCallData = {}
        console.log('parent', this.$parent)
        this.$parent.handleProfile()
      }).catch(error => {
        this.loadingState = false
        if (error.statusCode !== 307) {
          this.$message({
            type: 'error',
            message: error.string
          })
        } else {
          this.errorCall = true
          this.errorCallData = error.response.data.error
        }
      })
    },
    verify(code) {
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, 'myprofile/verifyotp'),
        headers: headers,
        data: {
          otp: code,
          otp_for: this.otpFor
        }
      }).then(response => {
        // this.data = response.data.data
        this.$message({
          type: 'success',
          message: response.data.message
        })
        if (this.otpFor === 3) {
          this.$store.dispatch('logout')
          return
        }
        this.visibleDialogResendOtp = false
        this.visibleDialogCitCall = false
        this.verifyPhoneNumberOutside = false
        this.skipInputPhoneNumberVerification = false
        this.otpType = 2
        this.handleClose()
        this.getData()
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'danger',
          message: error.string
        })
      })
    },
    handleAvatarSuccess(response, file) {
      this.data = response.data
      if (this.data && this.data.photo) {
        this.$store.commit('SET_USER_PHOTO_PROFILE', this.data.photo)
      }
      this.loading = false
    },
    handleUploadProcess() {
      this.loading = true
    },
    handleUploadError(error) {
      this.loading = false
      this.loadingUpload = false
      this.$notify({
        type: 'warning',
        title: error.response.data.error.message,
        message: error.response.data.error.error
      })
    },
    setLang(localeId) {
      this.getLocalization(localeId)
    },
    async getLocalization(langId) {
      this.loading = true
      let fallbackLangId = langId
      if (!fallbackLangId) {
        fallbackLangId = 'id'
      }
      await HTTP.get('localization').then(response => {
        this.updateDataStore(fallbackLangId)
        this.$store.dispatch('setLangLocally', {
          id: fallbackLangId,
          lang: response.data[fallbackLangId].admin.all
        })
        console.log('trace', this.$store.getters)
      }).catch(() => {
        //
      })
      this.loading = false
    },
    handleEdit (type) {
      this.temp.name = false
      this.temp.mobile = false
      this.temp.password = false
      if (type === 1) {
        this.temp.name = true
        this.sidebarEdit = true
      }
      else if (type === 2) {
        this.temp.mobile = true
        this.showDialogPassword = true
      }
      else if (type === 3) {
        this.temp.password = true
        this.sidebarEdit = true
      }
      this.tmp = { ...this.data }
    },
    handleClose () {
      this.sidebarEdit = false
      this.tmp = {}
      this.password = {}
      this.temp = {
        name: false,
        mobile: false,
        password: false
      }
    },
    getPhone (value) {
      this.tmp.mobile = value.formattedNumber
    },
    handlePasswordConfirmSuccess (data) {
      this.tmp = { ...data }
      this.sidebarEdit = true
      this.showDialogPassword = false
    },
    saveEdit () {
      this.save()
    },
    handleResendOtp(typeOtp) {
      // if (this.temp.mobile) {
      //   this.visibleDialogResendOtp = false
      //   this.showDialogPassword = true
      // }
      // if (this.temp.password) {
      //   this.save()
      // }
      this.otpType = typeOtp
      this.save()
    },
    setDisplay (data) {
      if (data) {
        this.displayHover = 'display: flex'
      } else {
        this.displayHover = 'display: none'
      }
    },
    handleCloseDialogPhoneVerification() {
      this.skipInputPhoneNumberVerification = false
      this.verifyPhoneNumberOutside = false
      this.visibleDialogResendOtp = false
      this.useMiscall = true
    },

    closeCitcall () {
      this.visibleDialogCitCall = false
      this.hasMiscall = true
      this.skipInputPhoneNumberVerification = false
      this.verifyPhoneNumberOutside = false
      this.otpType = 2
      // this.tempProfile = { ...this.dataProfile}
    },

    changeSms (method) {
      this.visibleDialogCitCall = !method
      this.inputOtp = false
      this.hasMiscall = true
      this.visibleDialogResendOtp = method
      this.useMiscall = !method
      this.countDialog ++
      this.handleResendOtp()
    },

    resetOptionOtp () {
      // this.visibleDialogCitCall = false
      // this.inputOtp = false
      // this.hasMiscall = true
      // this.visibleDialogResendOtp = false
      this.useMiscall = true
    },

    getStoreData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'generalsetting/'),
        headers: headers
      })
        .then(response => {
          this.dataStore = response.data.data
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        })
    },

    async updateDataStore(langId) {
      this.loading = true
      let data = { 
        lang_code: langId,
        email: this.dataStore.email,
        name: this.dataStore.name
      }
      await updateStore(data).then(response => {
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

    handleGender (data) {
      console.log('d', this.dataVerify.gender)
      console.log('d', data)
      // if (this.dataVerify.tempGender === data) {
      //   this.dataVerify.gender = 'E'
      //   this.dataVerify.tempGender = 'E'
      // } else if (this.dataVerify.tempGender === 'E') {
      //   this.dataVerify.gender = data
      //   this.dataVerify.tempGender = data
      // } else {
      //   this.dataVerify.gender = data
      //   this.dataVerify.tempGender = data
      // }
      console.log('d', this.dataVerify.gender)
    },

    getBusinessTypes() {
      getBusinessTypes({ per_page: 100 }).then(response => {
        this.businessTypes = response.data.data
      })
    },

    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error(this.$lang[this.langId].error_upload_photo)
      }
      return isJpg || isPng
    },

    handleUploadProgress (args) {
      this.loadingUpload = true
    },

    handleUploadIdCardSuccess(response, file, fileList) {
      console.log('res', response)
      this.dataVerify.img_ktp = response.data[0]
      this.loadingUpload = false
    },

    handleUploadSelfieSuccess(response, file, fileList) {
      console.log('res', response)
      this.dataVerify.img_selfie = response.data[0]
      this.loadingUpload = false
    },

    handleUploadNpwpSuccess(response, file, fileList) {
      console.log('res', response)
      this.dataVerify.img_npwp = response.data[0]
      this.loadingUpload = false
    },

    handleShowExample(args) {
      this.dataFoto.map(i => { i.active = 0; if (i.id === args) { i.active = 1} })
      this.showExample = true
    },

    handleCloseExample() {
      this.dataFoto.map(i => { i.active = 0; })
      this.showExample = false
    },

    handleEditDataSensitive () {
      if (this.data.data_sensitive !== null && this.data.data_sensitive.id) {
        this.dataVerify = { ...this.data.data_sensitive}
        this.dataVerify.img_selfie = null
        this.dataVerify.img_ktp = null
        this.dataVerify.img_npwp = null
        
        this.dataVerify.date_birthday = moment(this.data.data_sensitive.birthday).format('DD')
        this.dataVerify.month_birthday = moment(this.data.data_sensitive.birthday).format('MM')
        this.dataVerify.year_birthday = moment(this.data.data_sensitive.birthday).format('YYYY')
      }
      this.showVerifyData = true
    },

    saveVerify () {
      this.loadingVerify = true
      let data = { ...this.dataVerify}
      if (data.img_ktp !== null && data.img_ktp.file_name) {
        data.img_ktp = this.dataVerify.img_ktp.file_name
      } else if (data.id && data.img_ktp_name) {
        data.img_ktp = data.img_ktp_name
      }

      if (data.img_selfie !== null && data.img_selfie.file_name) {
        data.img_selfie = this.dataVerify.img_selfie.file_name
      } else if (data.id && data.img_selfie_name) {
        data.img_selfie = data.img_selfie_name
      }

      if (data.img_npwp !== null && data.img_npwp.file_name) {
        data.img_npwp = this.dataVerify.img_npwp.file_name
      } else if (data.id && data.img_npwp_name) {
        data.img_npwp = data.img_npwp_name
      }

      if (data.id) {
        this.$delete(data, 'id')
      }

      reverifyProfile(data).then(response => {
        this.loadingVerify = false
        this.showVerifyData = false
        this.getData()
        console.log('parent', this.$parent)
        this.$parent.getProfile()
        this.$parent.getStoreData()
      }).catch(error => {
        this.loadingVerify = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    updateDate () {
      this.$forceUpdate()
      this.validDate()
    },

    validDate () {
      // this.$forceUpdate()
      if (this.dataVerify.date_birthday && this.dataVerify.month_birthday && this.dataVerify.year_birthday) {
        let d = this.dataVerify.date_birthday.toString().length === 1? '0' + this.dataVerify.date_birthday : this.dataVerify.date_birthday
        let m = this.dataVerify.month_birthday.toString().length === 1? '0' + this.dataVerify.month_birthday : this.dataVerify.month_birthday
        let date = this.dataVerify.year_birthday + '-' + m + '-' + d 
        // let dateFormat = moment(date, 'YYYY-MM-dd')
        // console.log('date', date)
        // console.log('date', moment(date, 'YYYY-MM-DD', true).isValid())
        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
          this.dataVerify.birthday = date
        } else {
          this.dataVerify.birthday = ''
        }
        this.isValidDate = moment(date, 'YYYY-MM-DD', true).isValid()
      } else {
        this.isValidDate = true
      }
    }
  }
}
</script>
