<script lang="ts" setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

const toast=useToast()
const error=ref('')
const router=useRouter()
const email=ref("")
const origin:any=inject("origin")
const password=ref("")
const isLoading=ref(false)
const wait=ref("cursor-not-allowed")
let date=new Date()
let newObj = Intl.DateTimeFormat('en-US', {
    timeZone: "America/New_York"
})
let newDate = newObj.format(date);
let min=date.getMinutes()<10?`0${date.getMinutes()}`:`${date.getMinutes()}`
let time=date.getHours()>12?`${date.getHours()}:${min}PM`:`${date.getHours()}:${min}AM`
const lastLogin=`${newDate} ${time}`;
const platform=navigator.platform

const handleSubmit=async(e:any)=>{
    e.preventDefault()
    try {
        if(password.value.length<7){
            error.value="Requires a minimum of 8 letters"
        }else if(password.value.length>7){
            isLoading.value=true
            wait.value="cursor-progress bg-gray-400"
            const url=`${origin}/api/auth/login`
            const response=await fetch(url,{
                method:"POST",
                headers:{
                    "content-type":"application/json",
                },
                body:JSON.stringify({
                    data:{
                        email:email.value,
                        password:password.value,
                        lastLogin,
                        userPlatform:platform  
                    },
                })
            })
            const parseRes=await response.json()
            if(parseRes.error){
                toast.error(parseRes.error,{
                    duration:3000,
                    position:"top-right"
                })
                error.value=parseRes.error
                isLoading.value=false
                wait.value="cursor-pointer bg-[#e9972c]"
            }else{
                toast.success(parseRes.msg,{
                    position:"top-right",
                    duration:5000
                })
                const user_data=JSON.stringify(parseRes.data)
                localStorage.setItem("userdata",user_data)
                isLoading.value=false
                wait.value="cursor-pointer bg-[#e9972c]"
                window.location.reload()
            }
        }
    } catch (error:any) {
        isLoading.value=false
        wait.value="cursor-pointer bg-[#e9972c]"
        console.log(error.message)
        toast.error(error.message,{
            duration:3000,
            position:"top-right"
        })
    }
}

const checkInput=()=>{
    if(password.value.length<7&&!email.value){
        isLoading.value=true
        wait.value="cursor-not-allowed"
    }else if(password.value.length>7&&email.value){
        isLoading.value=false
        wait.value="cursor-pointer"
    }
}

const checkPassword=()=>{
    if(password.value.length>7&&password.value.length>0){
        error.value=''
    }else if(password.value.length<7&&password.value.length>0){
        error.value="Requires a minimum of 8 letters"
    }
}
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[350px] max-md:w-[80vw] ">
            <p class="text-2xl font-semibold mb-4 text-gray-700">Sign in to <span class="text-[#e9972c]">Wekafile</span></p>
            <form class="my-3 flex flex-col w-full" @submit="handleSubmit" @keyup="checkInput" >
                <label for="email" class="ml-1 flex justify-between max-md:text-sm"><span>Enter your email</span></label>
                <input type="email" v-model="email" id="email" name="email" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="johndoe@example.com" required/>
                <label for="password" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Enter password</span> <span class="text-red-600 text-sm">{{ error }}</span></label>
                <input type="password" @keyup="checkPassword" :minlength="7" :maxlength="24" v-model="password" id="password" name="password" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <div class="flex justify-between gap-2 max-sm:text-sm">
                    <button type="button" @click="router.back()" class="font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] w-[150px] border-[1px] border-gray-400 text-black">
                        Back
                    </button>
                    <button :class="wait" :disabled="isLoading" class="w-[150px] font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] bg-[#e9972c] text-white">
                        Sign in
                    </button>
                </div>
            </form>
            <div class="flex justify-between items-center gap-10 mb-10 w-full text-sm max-sm:text-xs">
                <div @click="router.push('/get_verified')" class="text-[#e9972c] font-semibold  cursor-pointer">Create an account?</div>
                <div  class="text-[#e9972c] font-semibold cursor-pointer">Forgot password?</div>
            </div>
        </div>
    </div>
</template>
