<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

const router=useRouter()
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()
const groupname=ref("")
const grouptype=ref("")
const password=ref("")
const confirm=ref("")
const isLoading=ref(false)
const wait=ref("bg-green-600")
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
        if(groupname.value.length<5||password.value.length<8||confirm.value!==password.value){
            toast.info("Kindly, fill in the fields as required.",{
                duration:3000,
                position:"top-right"
            }) 
        }else if(groupname.value.length>5&&password.value.length>8||password.value.length===8){
            isLoading.value=true
            wait.value="cursor-progress bg-gray-400"
            const url=`${origin}/api/auth/group/register`
            const response=await fetch(url,{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    email:route.query.email,
                    groupname:groupname.value,
                    grouptype:grouptype.value,
                    password:confirm.value,
                    lastLogin,
                    userPlatform:platform,
                    privacy:e.target.privacy.value
                })
            })
           const parseRes=await response.json()
           if(parseRes.error){
                toast.error(parseRes.error,{
                    duration:3000,
                    position:"top-right"
                })
            }else{
                toast.success(parseRes.msg,{
                    position:"top-right",
                    duration:5000
                })
                const user_data=JSON.stringify(parseRes.data)
                localStorage.setItem("userdata",user_data)
                sessionStorage.removeItem("group_code")
                window.location.reload()    
           }
        }
        isLoading.value=false
        wait.value="cursor-pointer bg-green-600"
    } catch (error:any) {
        console.log(error.message)
        toast.error(error.message,{
            duration:3000,
            position:"top-right"
        })
        isLoading.value=false
        wait.value="cursor-pointer bg-green-600"
    }
}

onMounted(()=>{
   
})
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[450px] max-md:w-[80vw] my-24">
            <p class="text-2xl text-gray-700 lg:text-4xl font-semibold mb-4">Welcome to <span class="text-green-400">Groups</span></p>
            <form class="my-3 flex flex-col w-full" @submit="handleSubmit">
                <label for="groupname" class="ml-1 flex justify-between max-md:text-sm"><span>Enter your organization name</span><span class="text-red-600 text-sm" v-if="groupname.length>0&&groupname.length<5">Too short</span><span class="text-green-600 text-sm" v-else-if="groupname.length>4">Good</span></label>
                <input type="text" v-model="groupname" id="groupname" name="groupname" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-green-600 py-2 px-4 placeholder:text-gray-900" placeholder="Organization name" required/>
                <label for="grouptype" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Enter your organization specifications</span><span class="text-red-600 text-sm" v-if="grouptype.length>0&&grouptype.length<5">Invalid</span><span class="text-green-600 text-sm" v-else-if="grouptype.length>4">Valid</span></label>
                <input type="text" v-model="grouptype" id="grouptype" name="grouptype" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-green-600 py-2 px-4 placeholder:text-gray-900" placeholder="organization specifications" required/>
                <label for="password" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Enter password</span> <span class="text-red-600 text-sm" v-if="password.length<8&&password.length>0">Requires a minimum of 8 letters</span><span class="text-green-600 text-sm" v-else-if="password.length>7&&password.length<11">Good</span><span class="text-green-600 text-sm" v-else-if="password.length>10">Strong</span></label>
                <input type="password" v-model="password" id="password" name="password" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-green-600 py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <label for="confirm" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Confirm password</span> <span class="text-red-600 text-sm" v-if="confirm!==password&&confirm.length>0">Doesn't match</span><span class="text-green-600 text-sm" v-else-if="confirm===password&&confirm.length>0">Perfect match</span></label>
                <input type="password" v-model="confirm" id="confirm" name="confirm" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-green-600 py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <label for="privacy" class="ml-1 flex items-center cursor-pointer mt-4 max-md:text-sm">
                    <input :checked="true" :value="false" type="checkbox" name="privacy" id="privacy" class="w-[18px] h-[18px]">
                    <span class="ml-2">Make group public</span>
                </label>
                <div class="flex justify-between gap-2 max-sm:text-sm">
                    <button type="button" @click="router.back()" class="font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] w-[150px] border-[1px] border-gray-400 text-black">
                        Back
                    </button>
                    <button :class="wait" :disabled="isLoading" class="w-[150px] font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] text-white">
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
