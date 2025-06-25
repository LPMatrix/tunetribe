<template>
  <div class="layout-container flex h-full grow flex-col">
    <div class="px-40 flex flex-1 justify-center py-5">
      <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div class="flex flex-wrap justify-between gap-3 p-4">
          <div class="flex min-w-72 flex-col gap-3">
            <h1 class="text-white tracking-light text-[32px] font-bold leading-tight">Archive</h1>
            <p class="text-[#90adcb] text-sm font-normal leading-normal">Browse and listen to playlists from previous months.</p>
          </div>
        </div>

        <h3 class="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">2023</h3>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          <div v-for="month in months2023" :key="month.name" class="flex flex-col gap-3 pb-3">
            <router-link to="/tracks">
            <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg" :style="`background-image: url('${month.image}')`"></div>
            <p class="text-white text-base font-medium leading-normal">{{ month.name }}</p>
            </router-link>
          </div>
        </div>

        <h3 class="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">2022</h3>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          <div v-for="month in months2022" :key="month.name" class="flex flex-col gap-3 pb-3">
            <router-link to="/tracks">
            <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg" :style="`background-image: url('${month.image}')`"></div>
            <p class="text-white text-base font-medium leading-normal">{{ month.name }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArchivePage',
  data() {
    return {
      months2023: [
        { name: 'December', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzMxNoWpOynhwouEyXI-f02kdYdoDuA04umErgRcvfPRBWhCgIaIPKVQvR_8ga8u0LdpEZuepJHF2UuMMbRYXdZAFto0FkTOvtbAw1GDQJEw97_xo4zBGZtpKzTFnlwxecz8nPWx1xzSKifad9FEwC-b1KMDh17_jD_zIjV-dqJj6v-ky4hbyvPvj2v6JYkIH4vclMBX2f6yXhC8ZvrPZEP4buwdsenTqp-2eUrzMehglHCsKEegEoxa4M9YeeFNEH70-6UcDiSLw2' },
        { name: 'November', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwDEYEMgJn--BAMfkm64cfgozbptXnsTR62kvAp9AR0-2LjUe729h2tj8h6PlUhrSfVlkZqix_ixbWh0GoE1iYi0yzw39o6Qi18TsCCo1VGQLddEMmJbxJuql2l7m2nNRVjKHKAcLHzGO3SVVPatp_G9RuUYMQGo-5nvJdpgZiaRCGw7Qo5WeFWihhw2AVtUeLBsGeR6VMLDO3mWjgvre40ECRE0_wGf-Bk0Ya9W23F9BL1a0GpBC5Io5W_YjWaTM6ZcU0oh3vYi0M' },
        { name: 'October', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7fa608YA82xxCVHgkL_Z_FgCfSU9UpGoBUr7Gmk1jVwZZVbHLy46V8OcnEFAsal7cjfTUKKbado7ILFvKW9qyuW3kjkXq7Q_66gzF1oGtAaMC7MVx6ix5UcZ8MMFNpngE9_ctJLrDnUQRPSxCNyfd7i8y89BHL7mh45hI8pM1lUHglQAqdP5_TItl8V236XWQ3ermPmKEtlsAD0sPw-JqqzrWWPw3ntvWwfBSr5bDPL3rHS90K4_eP4z298nkpqEPLAZuOsqy7yLq' },
        { name: 'September', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi7LSs8ZNrE_s1PlGURxKRTxGr7txLcsrRBIZZdzPpa9e9zB0uPLm_ATDENLQXU12M04EvlYjQl_ABEx4QMjGtU0MGA-XeiHD7CxayWWW3Mmsw6WdhXBQD0HvjO0hu-587M5tyj1Mbfkl90UfxpeB_ArXT4WQRaY1btbrFP8C7xvjolFer1pzh8ASocbaPGUDF-JRP3OKkdo1HKh8wXQv_BH56avpHygQ66laQKPxyu4m5UkqnO0TdCTPSn42SobJj9bpDDOgjjoqO' },
        { name: 'August', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAenE3i_rM9rlB-v_rdOAu_5GTjBwcvFPySzYd_t9R79QUwayP8eW-8sV_qNKY0dbSmb6HxCYiegiMqElrjmcvqWZ118wErlF-UIr0aytw_sAyjH4JSQgj4avWXDqVNVQsCxf_MjuIPkGtUayOoWRcgnHLMPHVGL6WG9pFCK0s7Vnm5YaqoudnT82tBEZo9AxfC3WrBXEFTzz9w74ORYXsoQWjUIVnOM6d0OffJCTWvIvSLxlIuYK9qBrmBE6fzakJGqZ32Y2Dx7RNo' },
        { name: 'July', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYqxWfj-ZKMY7Vy8UV991Y8MJLx2aqU8fLZ304MvOcYkBXnSSDMVRumTR2u9h1llHB8IwsygA9GO9gQ2W9gSHlJO4lFwbWhN4R55uHJLfRuxf5UtMZcL1P2bnE7pZjeoywCYlDC0gYavszgswkFpZpAm3xoPX8mR1RhCtsCGxd19wB91F9vLWGI6JkhuRLR0gVYA0XCZ7_hHNwW5koMJJ9klQPfOgLiIOQZHgY2spfWhL7shovOL27fU7Wad2ae_xJx6MqeHmbv1tx' },
        { name: 'June', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZji53KoXdy_80dSN7FcXwMdj2bZLpswHRmWpOYz3X43eG5U7f-ON_B5lPb6CrKIKFRMSDckH04xA-xf11BoQoUx3MA9z7oQSQlXjb8Of-UzMyKCIyU8aDBEaR6Ia0oHbApf63JBqFL9ankOMHsC80wOwD8Tp3FsWSWxvieg6Dc1fzKz9rHQ-1vZGYvoFIyiWjo5ihYEH_jhn7lQuyR1NaY3VhERKOxdcrm5Gps8PzlFxxYs7XFC-91NtpSrGN7WOAObL1gggpUhLg' },
        { name: 'May', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCMosKt9pGapzmSn1viNSqdtHldcmvtGBb6GXbSX5OH_R3K6PgrYaJz6tqAxUAw1NNVP_IPBSejjaqBuVCTDE6sCO2Ds9PqZR6ecU4BtW3hTiZT5v3h1qETOGV-Kcsel2WNR4T_sBvnPORGzsjpr--d66Qt5cXxXdWfZmH7mx1lIGDvyyU1KgnDhnendKNI5OrxpfciY8ooq-Bc5pv5hWmLUQLB3Ng4E2hGJCzzY8NbRjSp9LttkfqAQyX4rIqkG4pcZyXxjpuJy7z' },
        { name: 'April', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs9lSnCVmirWEL7Uk2qqotvHuzpjcOeWr1HJ9qd0BxtyYxg9-jKXroZUd25kgr6cyGC1Cy9UtBIanvfkha-5GTuND894JbL0vNfhaMNybfQ5EomV20GBaRWh0rFR8z7zsd5F9_efO59YIJ6PX9C4WS5ZvBp87wNVGb2plZll-YUPM7eVhoYIsQx758OPlvGAohnibjStOYQNbfG3za1RdH376ze-FX5nIYl_XRZWV4xuYzAKtBxcYvXrLGxuQkhh-VeaPF6PiN8w7R' },
        { name: 'March', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW3VGBkHFwYVkArg7heaG__0SSjZY7XPfSXsNaieF0oVdsdn4gzyvEjfO-v5bbvfNtohbjr7gwm3yoNYE68wkL53e7EbD39qTbHO1KqgeeE30KZ5cxmwDgyOSJOStVH9sLtlEEas5XtVuI-fvji7-HLlG9JmO61Ja4zoJiUMlO2fZ_D0QMmf69edOb2SYydpzysYSKHufqsEBz-o6NsaTLQNvJ3txQDaaGUR7fAQ5h7vqt7cwp1j-6634U3nASBAjIwKx6S1odqJ8B' },
        { name: 'February', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ3CC031DWOCeJeE7EAZa2xsQbtNvGw1Gv2Z_vgIgnoR5aPuPLi5syu_h2JPkVkUedNVc4iQoQ2_u_gpMYWENkUpgndV-gx4v5BHntalugM9TBWYdDhv-ug_7tQlSrYR-Nc0gCyrq7MbTRZKfWqE0CsFC4OpaPQJ547__FQCgrdl5BEGWIIMdy3z01Kp_hziWPnINLsTrsZGIIOpRXgs5DTc5eKYo1ki9KrLShNrdjwIQA2hrXMS7xjlFQ5e0jMHR-FnD9Yw8ZtOAb' },
        { name: 'January', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc8jmS_1azZ0Z56x1GVbL1OVvkYpK9mpXSKw2EPsTgfr_eKH_ZdhiEJed14yua9cKQIziWFAryPvSk8g1ySkDc_jnMSqgY48EAJv_-n4ZPO_RT3nNbc6uphQpJgV4LbnKoNrnBMRM2_EvrJYG-01_9rFiGL7LvOpht_8qdsdC2rxTZXL2UYbQOzBECUjy6Cy7AWU_bxAP7RyNqxwi1Uj1tnzNeW1tY-F5vfdFTBRVhxFSsfECp-jUKV2UfkDsopXHWXkKm4YdNQZWl' }
      ],
      months2022: [
        { name: 'December', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhJ72hK_KGhkIBsgvWBHZbG2E7_VdbqlfN8DQ2C2QgwvHgpZh6pVJGuBtOKp5sjhXbH7jT8pj03nr69wbm6XZ26NyWg6NeeISvgGvqNOwbwGi8WlSYjBV7RS0k92fCmrR_cw6N9gRDhJVyetZD7VYfnTFqfDl4SdNz7WC2ofC8ZROyUU1noo9GBZ6U9p63BGshJ9GgpwIEwfOX0ZtDgu5SSoLzQdFCmKSMBBGJ1ryF2sUHbXnjSE37Mghz3dfnsficEBfbHXfyosWK' },
        { name: 'November', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAze6pqAe84znkC8ETJaS08aRcKzPWj3nMtDu7L3lEQhX737RZ_2TI18MK3U51zSYTU7sAO4ouHyhlspyZL3_BEX_6cdxN0l_uD32NFne13hlOhKHxl9FV9WC3ZaKIbATp6Ci-jRQ3QkSmgaTtEicWWVIImRlLs5w4ddaeEyHyX77u086nk6R-hwClGFaoJKuIjbjlEnHwrInFTvbrDa7zPC7dZ4T8KxKbrw6faO4Nt6oZc2aIhpVB4dO8KsCeM0k4HcRKYBh5D2T37' },
        { name: 'October', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjBqAfHDtyeS1hAtVLqaM-TdJyFcYJfkuR-GKR1pOSwUvx4kBRFG0eYzf2fZyTGyVHxoJm-k5LNzVYaQemYJjcLP_e-Ru3c5PAZecxAnn0J1MAG2_e2Hz6SBOd9wkLGt9iRgyyP0NIXWVNMmWtW7X40a7ieUtHxj3u45hM1jykxYxAqRaq2cAQE2UwjxpRMRwTjymDt8zovDPDAWG9Jo55Lv1AAd4QKPvgcCYT0t-q5AUWGgFgWzd7KP_mJ_xdGmVL49zd3t_hrVVH' },
        { name: 'September', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWFJmXBPDDf8UUdTjYMAd6wX1capWp6KgOfscjAi8UQpyKmCknurPL2ar1sfOkza1ADFAyu8QKMvhTa280xSVVjQ9av4RT4HcRIdUDPuzkMt55rfEANvp1j05Zlas6Pr7tkUIU63srWx2S2AbYQQIFXmzBRBKt3QGox1c8eKS8pmrF4h8KOTM5GGmH1-0vDlF3_s86K8-WLDb_ZjYXlYxpKBxOXoNLVDosBua-Xu-8Fa89mchXrwr-7DdzimTsUgvCReqfhapqg126' },
        { name: 'August', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4m3oRFwPR31R4RdUmgMV9WFGy4lR8_B3DCZJKBeL2yQG2Imu7B1j4sY6q5-xvAXrqSHKWyV_MnOhiQhoRSYXUTIDY906vaBSY7tu6hPlfV0jW2crebGL2yt7uyW155MaUblI50oNhNqd8bjm3z8KXdlr6v1rwH_FbGKbO8gc8jGjqxVcJaOE6um4biTFLTHIMMkTLVqDnFeTLxhljiz_IvZck-Tfp3jHyN81TjFCeXnnNu-M-wJk9QW7O_oddpVygQt194__GDwzT' },
        { name: 'July', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1axZnjH4TOZ2kWgsOF3pjpBahcGuZ7squftfVHp2SEVT2mT7zAr52oXFEvANmPjasebv8Zc4Ghwg1MOFihvgj5Lect8z4jgynQylh5MY8rVthbrPUpks-wsjr5Ehhz81LLN5AWyPfHLK3CwpM69AziCxxyYTl8LBR7BHIkh3sWmAqxsEJ2HUtzf4sp8iZO7pt2Hue4zkXYUlL8vTrRfft-ysqri0Qkqx-ABJWfJd2PD0K70NDBFw3utmRKiUnqp6sxgYmSjwaV-8m' },
        { name: 'June', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM2xfXP43_DtigabkkZ4tqoMo36O7sMkzDzo_9jA8VrQoeoHfo_ZMQIzuCmeZQbAvKScx-HwlWryI7jYtCNuiA2GDRW5a-J0QF8yDvqKfh9Z3Mri1pKdZFY1zgCk0tvJdLH6JwyyUcPdTsgYiYfy_zsn4sRV5Fl-wJShymyItidrQNyuNtjmR6v_zGNNURXEPwjxadmYiyIH-u5T_Cexpaos4B4jx0_4MuLhT3TyQBlLNVKhQ7YUQsWyfA489PVURwXENZhG2jZpd0' },
        { name: 'May', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-EDekgKocfXtVbOVCYsTw8ZJdaHqKNimpNg8xpns0x_AM5Ctp3H7X7sen8PiDTKX0tuMtfr1_FpSU1GeAaWNo8UcWhyFGwnXUaLWSwzcdZmakse9nt68o-8Lq9uePjRWDXSvzl4EsDymw88lRx6niNh56iSlj3Oy7ysSpsC7BAjnYCqUjLYndz-vvCV93O7V8eQgzuoAqfWfBvG23X-sF-FLJr12tHCcZJPsnFYkUR37zJv6bWAHHTuBR-tKNWJatqQud0guoaXjV' },
        { name: 'April', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd9FCXUEat_EX62_0hFTa_sU6zsbLrHTeklPr3Y6aPYj1L5xKnoVqJqOeOXIQ88e-ugNne8WaZ6tmMQEA5bZXdwpptGREsNP6OPgCh46mkRRrvLqNIX37lAHL-cnh_MGcbMksTASmNRsSEOCN99MfjkXmCMU-2CxLVvY93_6etvmT2XO-4izrtdob4fIBxu88G75N6AbnlTW7NfFZjpzPoL1rGW2xwqjUaYKyOAv2Stcxri3nhZzMfpXpwWEiXVXMGitDqzKvHh3dm' },
        { name: 'March', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDELBCSVpId5KzDam1uiH9rvQCID-RkX072VlaQi35TbFvJ3lJURihUWuR2FPY7Tbd89fjizUKTJVHLkiWf6xPFF6dTcQoUATs457uQACvPIsCrUjFmq49KYu3qMEqg9YcqnsHABsiwyKLC3SHrsX-5BV8sentRSkmTuGQT0Hi0eozEchU96WVszkDlvoiYpsRTAaxX8nMe4Ae8LhZm3FvEXYupC-8ZnsUrDkN_gS-uVOKfq_MfmQhaxV0NEl8sL2WLgrlmAPx7Vmza' },
        { name: 'February', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsccHDQlZbyEndsLLvnxfHoAtovDdyfD9-qPQ6eVjIWYl58VYOfYKkd11b1B8fsF77fUAqDaUG9hC-eEQwD4hfomxsbI02-bW4X9KS09s_J6o9WasYlgWGknc67ukUZFaN7sijBTZkClS5NzHqiBASCPsmppacvfsSZCd0V_qnwi8Gzwyn04PjwCrOGwFgHBmrscSSZrqeI140fcpRfmBvcE9TPsRNBtiCIt397P_HEuGayFYbN7OHdyGqE1mLRI-GFIUceCLLAdCB' },
        { name: 'January', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCtPaOmcaDx4ncBazAzLGz1Wstza8uP0p3hWclINIjEIQn6OIhsM5zVrYNSLumLCi0FKoDkSZsO_4uKaTq1z3Vd_qCz8bSMX_QlfKXgQWhbu37PUjZXMgICpaadfn37J8OIJbXwCoiynSOn_lnr4Df_C2HTle0S94QRfppx2HRLzpRrsB3cXd4mkGqDJhruKXG5jRBNtowxYSDI44wbK5mYDnzxIBzMT5bXZqOj2YHTj-qosZz4X4RpACMcfQymUQ2Xahcx1rhcCdv' }
      ]
    }
  }
}
</script>