import { createRouter, createWebHistory } from 'vue-router'
import { useRecruitStore } from '@/stores/recruit'
import Main from '@/views/service/Main.vue'
import Login from '@/views/auth/Login.vue'
import Signup from '@/views/auth/Signup.vue'
import Chat from '@/views/service/Chat.vue'
import MyPage from '@/views/user/MyPage.vue'
import FindPassword from '@/views/auth/FindPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import Setting from '@/views/info/Setting.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'
import BlockList from '@/views/info/BlockList.vue'
import Notice from '@/views/info/Notice.vue'
import Notification from '@/views/info/Notification.vue'
import Terms from '@/views/info/Terms.vue'
import Privacy from '@/views/info/Privacy.vue'
import DriverLogin from '@/views/driver/DriverLogin.vue'
import DriverSignup from '@/views/driver/DriverSignup.vue'
import DriverPage from '@/views/driver/DriverPage.vue'
import NoticeDetail from '@/views/info/NoticeDetail.vue'
import SafeNumberSetting from '@/views/info/SafeNumberSetting.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', alias: '/main', name: 'main', component: Main, meta: { requiresAuth: true } },
    {
      path: '/chat/:id?',
      name: 'chat',
      component: Chat,
      meta: { requiresAuth: true, requiresActiveStatus: true },
    },
    { path: '/mypage', name: 'mypage', component: MyPage, meta: { requiresAuth: true } },
    { path: '/setting', name: 'setting', component: Setting, meta: { requiresAuth: true } },
    {
      path: '/changepassword',
      name: 'changepassword',
      component: ChangePassword,
      meta: { requiresAuth: true },
    },
    { path: '/blocklist', name: 'blocklist', component: BlockList, meta: { requiresAuth: true } },
    {
      path: '/safenumber',
      name: 'safenumber',
      component: SafeNumberSetting,
      meta: { requiresAuth: true },
    },
    { path: '/notice', name: 'notice', component: Notice, meta: { requiresAuth: true } },
    {
      path: '/noticedetail/:num',
      name: 'noticedetail',
      component: NoticeDetail,
      meta: { requiresAuth: true },
    },
    {
      path: '/notification',
      name: 'notification',
      component: Notification,
      meta: { requiresAuth: true },
    },
    { path: '/terms', name: 'terms', component: Terms, meta: { requiresAuth: true } },
    { path: '/privacy', name: 'privacy', component: Privacy, meta: { requiresAuth: true } },
    // hideNavbar: true 로그인 페이지에선 사이드바 숨김
    { path: '/login', name: 'login', component: Login, meta: { hideNavbar: true } },
    { path: '/signup', name: 'signup', component: Signup, meta: { hideNavbar: true } },
    {
      path: '/findpassword',
      name: 'findpassword',
      component: FindPassword,
      meta: { hideNavbar: true },
    },
    {
      path: '/resetpassword',
      name: 'resetpassword',
      component: ResetPassword,
      meta: { hideNavbar: true },
    },
    // hideDriverNavbar
    {
      path: '/driverlogin',
      name: 'driverlogin',
      component: DriverLogin,
      meta: { hideDriverNavbar: true },
    },
    {
      path: '/driversignup',
      name: 'driversignup',
      component: DriverSignup,
      meta: { hideDriverNavbar: true },
    },
    {
      path: '/driverpage',
      name: 'driverpage',
      component: DriverPage,
      meta: { hideDriverNavbar: false },
    },
    // 잘못된 주소로 접속하면 다른 페이지로 리다이렉트 아래 둘 중 하나 선택
    // 1. 메인으로 가게 처리
    // { path: '/:pathMatch(.*)*', redirect: '' },
    // 2. 에러 페이지로 이동
    {
      path: '/:pathMatch(.*)*',
      component: {
        template: '<div></div>',
        setup() {
          throw new Error('존재하지 않는 페이지입니다. 주소를 확인해주세요.')
        },
      },
    },
  ],
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  const recruitStore = useRecruitStore()
  const user = localStorage.getItem('USERINFO')
  const hostname = window.location.hostname // 현재 접속한 도메인 확인

  // 1. 기사님 도메인(driver) 처리
  if (hostname.includes('driver')) {
    // 기사님 로그인/회원가입 페이지는 무조건 허용 (무한 루프 방지)
    if (to.path === '/driverlogin' || to.path === '/driversignup') {
      return next()
    }

    // 기사님 도메인인데 로그인이 없으면 무조건 기사 로그인으로
    if (!user) {
      return next('/driverlogin')
    }

    // 로그인이 되어 있다면 기사 전용 페이지로 (유저용 메인 접근 차단)
    if (to.path === '/' || to.path === '/login') {
      return next('/driverpage')
    }
  }

  // 2. 일반 유저 도메인(www) 처리
  else {
    // 유저 도메인인데 기사 전용 페이지로 가려 하면 차단
    if (to.path.startsWith('/driver')) {
      return next('/login')
    }

    // 로그인 체크
    if (to.meta.requiresAuth && !user) {
      return next('/login')
    }

    // 참여 상태 체크
    if (to.meta.requiresActiveStatus && recruitStore.status === 'IDLE') {
      alert('참여 중인 채팅방이 없습니다.')
      return next('/')
    }
  }

  next() // 모든 조건 통과 시 이동
})

export default router
