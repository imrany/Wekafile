import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import { useToast } from 'vue-toast-notification'
const toast= useToast()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landingpage',
      meta:{
        isRequiredAuth:false
      },
      component: LandingView
    },
    {
      path:"/home",
      name:"home",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/HomeView.vue")
    },
    {
      path:"/verify",
      name:"verify",
      meta:{
        isRequiredAuth:false
      },
      component:()=>import("../views/verifyEmail.vue")
    },
    {
      path:"/get_verified",
      name:"get_verified",
      meta:{
        isRequiredAuth:false
      },
      component:()=>import("../views/GetVerified.vue")
    },
    {
      path:"/signin",
      name:"signin",
      meta:{
        isRequiredAuth:false
      },
      component:()=>import("../views/SigninView.vue")
    },
    {
      path:"/signup",
      name:"signup",
      meta:{
        isRequiredAuth:false
      },
      component:()=>import("../views/SignupView.vue")
    },
    {
      path:"/provider",
      name:"provider",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/ChooseProvider.vue")
    },
    {
      path:"/storage",
      name:"storage",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/StorageView.vue")
    },
    {
      path:"/groups",
      name:"groups",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/GroupsView.vue")
    },
    {
      path:"/group",
      name:"group",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/GroupDetailView.vue")
    },
    {
      path:"/files",
      name:"file",
      meta:{
        isRequiredAuth:localStorage.getItem("userdata")?true:false
      },
      component:()=>import("../views/FileView.vue")
    },
    {
      path:"/upgrade",
      name:"upgrade",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/UpgradeView.vue")
    },
    {
      path:"/notifications",
      name:"notifications",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/NotificationView.vue")
    },
    {
      path:"/users",
      name:"settings",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/SettingsView.vue")
    },
    {
      path:"/shared",
      name:"shared",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/SharedView.vue")
    },
    {
      path:"/uploads",
      name:"uploads",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/MyUploadView.vue")
    },
    {
      path:"/help",
      name:"help",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/HelpView.vue")
    },
    {
      path:"/documentation",
      name:"docs",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/DocumentationView.vue")
    },
    {
      path:"/account",
      name:"account",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/AccountView.vue")
    },
    {
      path:"/privacy",
      name:"privacy",
      meta:{
        isRequiredAuth:true
      },
      component:()=>import("../views/PrivacyView.vue")
    },
    {
      path:"/:pathMatch(.*)*",
      name:"404",
      component:()=>import("../views/NotFoundView.vue")
    }
  ]
})

router.beforeEach((to,from,next)=>{
  const data:any=localStorage.getItem("userdata")
  let isUserAuthenticated=data?JSON.parse(data).token:null;
  
  const isRequiredAuth:boolean=to.matched.some(
    (record)=>record.meta.isRequiredAuth
  );
  //check for protected route
  if(!isRequiredAuth&&isUserAuthenticated!==null){
    next("/home")
  }else if(isRequiredAuth&&isUserAuthenticated===null){
    toast.warning("Not Authenticated!!",{
      position:'top-right',
      duration:5000
    })
    next("/")
  }else{
    next()
  }
})

export default router
