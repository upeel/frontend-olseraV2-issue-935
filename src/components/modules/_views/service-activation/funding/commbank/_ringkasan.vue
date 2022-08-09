<template>
  <div class="form-wizard--content__wrapper">
    <div class="wizard-content">
      <h3 style="margin-top: 0;" class="mb-24">Ringkasan Pengajuan</h3>
      <div v-if="Ringkasan && Ringkasan.jumlah_pinjaman" class="flex-grow-1">
        <!-- jumlah pinjaman -->
        <template>
          <div class="like-table-wrapper mb-24">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{ rootLang.jumlah_pinjaman }}
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{ rootLang.jumlah_pinjaman }}</div>
                <div class="text-right">{{ formatPrice(Ringkasan.jumlah_pinjaman.amount) }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{ rootLang.plafond }}</div>
                <div class="text-right">{{ Ringkasan.jumlah_pinjaman.plafond }} {{rootLang.months}}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{ rootLang.loan_purpose }} ({{rootLang.optional}})</div>
                <div class="text-right">{{ Ringkasan.jumlah_pinjaman.purpose }}</div>
              </div>
            </div>
          </div>
          <div class="like-table-wrapper mb-24">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{rootLang.address_based_idcard}}
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{lang.address}}</div>
                <div class="text-right">{{ Ringkasan.alamat_ktp.address }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.province}}</div>
                <div class="text-right">{{ Ringkasan.alamat_ktp.provinsi_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.city_district}}</div>
                <div class="text-right">{{ Ringkasan.alamat_ktp.kabupaten_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.sub_district}} ({{rootLang.optional}})</div>
                <div class="text-right">{{ Ringkasan.alamat_ktp.kecamatan_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{lang.postal_code}}</div>
                <div class="text-right">{{ Ringkasan.alamat_ktp.kode_pos  }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.neighbourhood}}/{{rootLang.hamlet}}</div>
                <div class="text-right">{{ Ringkasan.alamat_ktp.rt +'/'+ Ringkasan.alamat_ktp.rw}}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.ownership}} ({{rootLang.optional}})</div>
                <div class="text-right">{{ Ringkasan.alamat_ktp.kepemilikan }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.long_settled}} ({{rootLang.optional}})</div>
                <div class="text-right" v-if="Ringkasan.alamat_domisili.lama_menetap">{{ Ringkasan.alamat_ktp.lama_menetap }} {{rootLang.months}}</div>
              </div>
            </div>
          </div>
          <div class="like-table-wrapper mb-24">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{rootLang.domicile_address}}
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{lang.address}}</div>
                <div class="text-right">{{ Ringkasan.alamat_domisili.address }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.province}}</div>
                <div class="text-right">{{ Ringkasan.alamat_domisili.provinsi_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.city_district}}</div>
                <div class="text-right">{{ Ringkasan.alamat_domisili.kabupaten_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.sub_district}} ({{rootLang.optional}})</div>
                <div class="text-right">{{ Ringkasan.alamat_domisili.kecamatan_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{lang.postal_code}}</div>
                <div class="text-right">{{ Ringkasan.alamat_domisili.kode_pos  }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.neighbourhood}}/{{rootLang.hamlet}}</div>
                <div class="text-right">{{ Ringkasan.alamat_domisili.rt +'/'+ Ringkasan.alamat_domisili.rw}}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.ownership}} ({{rootLang.optional}})</div>
                <div class="text-right">{{ Ringkasan.alamat_domisili.kepemilikan }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.long_settled}} ({{rootLang.optional}})</div>
                <div class="text-right" v-if="Ringkasan.alamat_domisili.lama_menetap">{{ Ringkasan.alamat_domisili.lama_menetap }} {{rootLang.months}}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="Ringkasan && Ringkasan.data_peminjam" class="wizard-content">
      <div class="flex-grow-1">
        <template>
          <div class="like-table-wrapper mb-24">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{rootLang.borrower_data}}
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.name_based_idcard}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.nama }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.id_card_number}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.ktp }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.taxpayer_number}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.npwp }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.gender}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.gender === 'M' ? 'Laki-Laki' : 'Perempuan'}}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.place_of_birth}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.tempat_lahir }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{lang.date_of_birth}}</div>
                <div class="text-right">{{ dateFormat(Ringkasan.data_peminjam.tanggal_lahir) }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.marital_status}}</div>
                <div class="text-right">
                  <span v-if="Ringkasan.data_peminjam.marital_status === 1">
                    {{rootLang.single}}
                  </span>
                  <span v-if="Ringkasan.data_peminjam.marital_status === 2">
                    {{rootLang.married}}
                  </span>
                  <span v-if="Ringkasan.data_peminjam.marital_status === 3">
                    {{rootLang.widow}}
                  </span>
                </div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.mother_name}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.nama_ibu_kandung }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.phone_number}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.phone }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.other_phone_number}}</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.phone_other }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">Email</div>
                <div class="text-right">{{ Ringkasan.data_peminjam.email }}</div>
              </div>
            </div>
          </div>
          <div class="like-table-wrapper mb-24">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{rootLang.data_business}}
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.economic_sectors}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.sektor_ekonomi }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.business_sector}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.business_type_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.business_type}}</div>
                <div class="text-right">
                  <span v-if="Ringkasan.data_usaha.jenis_usaha === 1">
                    {{rootLang.just_offline}}
                  </span>
                  <span v-else-if="Ringkasan.data_usaha.jenis_usaha === 2">
                    {{rootLang.just_online}}
                  </span>
                  <span v-else-if="Ringkasan.data_usaha.jenis_usaha === 3">
                    {{rootLang.online_offline}}
                  </span>
                </div>
              </div>
            </div>
            <div class="like-table-wrapper--item" v-if="Ringkasan.data_usaha.jenis_usaha !== 1">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.shipping_origin}} ({{rootLang.optional}})</div>
                <div class="text-right">{{ Ringkasan.data_usaha.asal_pengiriman }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{lang.address}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.address }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.province}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.provinsi_name  }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.city_district}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.kabupaten_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.sub_district}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.kecamatan_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{lang.postal_code}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.kode_pos }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.neighbourhood}}/{{rootLang.hamlet}}</div>
                <div class="text-right">{{ Ringkasan.data_usaha.rt +'/'+ Ringkasan.data_usaha.rw}}</div>
              </div>
            </div>
          </div>
          <div class="like-table-wrapper mb-24"  v-if="'bank_0' in Ringkasan">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{rootLang.bank_account}} 1
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.bank_name}}</div>
                <div class="text-right">{{ Ringkasan.bank_0.bank_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.bank_account_owner}}</div>
                <div class="text-right">{{ Ringkasan.bank_0.bank_owner_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.account_number_bank}}</div>
                <div class="text-right">{{ Ringkasan.bank_0.bank_account_number  }}</div>
              </div>
            </div>
          </div>
          <div class="like-table-wrapper mb-24" v-if="'bank_1' in Ringkasan">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{rootLang.bank_account}} 2
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.bank_name}}</div>
                <div class="text-right">{{ Ringkasan.bank_1.bank_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.bank_account_owner}}</div>
                <div class="text-right">{{ Ringkasan.bank_1.bank_owner_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.account_number_bank}}</div>
                <div class="text-right">{{ Ringkasan.bank_1.bank_account_number  }}</div>
              </div>
            </div>
          </div>
          <div class="like-table-wrapper mb-24" v-if="'bank_2' in Ringkasan">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{rootLang.bank_account}} 3
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.bank_name}}</div>
                <div class="text-right">{{ Ringkasan.bank_2.bank_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.bank_account_owner}}</div>
                <div class="text-right">{{ Ringkasan.bank_2.bank_owner_name }}</div>
              </div>
            </div>
            <div class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{rootLang.account_number_bank}}</div>
                <div class="text-right">{{ Ringkasan.bank_2.bank_account_number  }}</div>
              </div>
            </div>
          </div>
        </template>
        <!-- jumlah pinjaman -->
        <!-- <template
          v-for="(item, key, index) in Ringkasan">
          <div
            v-if="index >= 4"
            :key="index"
            class="like-table-wrapper mb-24">
            <div class="like-table-wrapper--item">
              <div class="font-18 font-semi-bold">
                {{ key }}
              </div>
            </div>
            <div
              v-for="(detail, detailKey) in item"
              :key="detailKey"
              class="like-table-wrapper--item">
              <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                <div style="width: 120px;">{{ detailKey }}</div>
                <div
                  v-html="detail"
                  class="text-right"
                />
              </div>
            </div>
          </div>
        </template> -->

        <el-button
          type="success"
          class="btn-block"
          @click="handleSubmit"
          :disabled="stillSubmit"
          >
          <loading
            v-if="stillSubmit"
            :active="true"
            color= '#1bb4e6'
            loader="dots"
            :width="28"
            :height="10"
            backgroundColor='#ffffff'>
          </loading>
          <span v-else>
            {{ rootLang.next }}
          </span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import basicComputedMixin from '@/mixins/basicComputedMixin'
import mixinAccounting from '@/mixins/mixinAccounting'
export default {
  components: {Loading},
  mixins: [basicComputedMixin, mixinAccounting],

  props: {
    Ringkasan: {
      type: Object,
      default: () => {
        return {}
      }
    },

    stillSubmit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      //
    }
  },

  methods: {
    handleSubmit() {
      this.$emit('next', 4)
    }
  }
}
</script>
