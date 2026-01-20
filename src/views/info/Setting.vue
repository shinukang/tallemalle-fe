<script setup>
/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import { ref } from 'vue'
import { Bell, ShieldCheck, ExternalLink } from 'lucide-vue-next'
import SettingPageLayout from '@/components/setting/SettingPageLayout.vue'
import SettingSection from '@/components/setting/SettingSection.vue'
import SettingGoToPageItem from '@/components/setting/SettingGoToPageItem.vue'

/**
 * ==============================================================================
 * 3. STATE & REFS (상태 변수)
 * ==============================================================================
 */
// 마케팅 수신 동의 상태 (토글용)
const marketingConsent = ref(true)
</script>

<template>
  <SettingPageLayout title="환경 설정" description="앱 알림, 보안 및 고객 지원 설정을 관리합니다.">
    
    <div class="max-w-4xl mx-auto space-y-8 w-full">
      
      <SettingSection title="알림 설정" :icon="Bell">
        <div class="space-y-6">
          <div class="flex items-center justify-between px-2">
            <div>
              <p class="text-sm font-bold text-slate-700">마케팅 정보 수신</p>
              <p class="text-xs text-slate-400 mt-1">
                이벤트, 쿠폰 및 프로모션 소식을 푸시 알림으로 받습니다.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="marketingConsent" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
              ></div>
            </label>
          </div>
        </div>
      </SettingSection>

      <SettingSection title="계정 및 보안" :icon="ShieldCheck">
        <div class="divide-y divide-slate-50">
          <SettingGoToPageItem 
            label="비밀번호 변경" 
            to="/changepassword" 
          />
          
          <SettingGoToPageItem 
            label="차단한 사용자 관리" 
            to="/blocklist" 
          />

          <SettingGoToPageItem 
            label="안심번호 사용 설정" 
            to="/safenumber"
          >
            <template #right>
              <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                사용 중
              </span>
            </template>
          </SettingGoToPageItem>
        </div>
      </SettingSection>

      <div class="pb-12">
        <div class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <h3 class="text-sm font-bold text-slate-900 mb-4">앱 정보</h3>
          <div class="space-y-3 text-sm text-slate-500">
            <div class="flex justify-between">
              <span>현재 버전</span>
              <span class="font-bold text-slate-800">v1.2.4</span>
            </div>
            <router-link
              to="/terms"
              class="flex justify-between cursor-pointer hover:text-indigo-600 group transition-colors"
            >
              <span class="group-hover:font-semibold">이용약관</span>
              <ExternalLink class="w-4 h-4" />
            </router-link>
            <router-link
              to="/privacy"
              class="flex justify-between cursor-pointer hover:text-indigo-600 group transition-colors"
            >
              <span class="group-hover:font-semibold">개인정보 처리방침</span>
              <ExternalLink class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </SettingPageLayout>
</template>