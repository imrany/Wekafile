<script lang="ts" setup>
import { inject, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";

const route=useRoute()
const toast=useToast()
const isLoading=ref(false)
const wait=ref("bg-green-400")
const userdata:any=inject("userdata")
const origin:any=inject("origin")
const error =ref("")
const dialog_close=()=>{
    const dialogElement=document.getElementById("shared-file-dialog") as HTMLDialogElement
    error.value=""
    dialogElement.close()
};

const dialog_open=(error:any)=>{
    const dialogElement=document.getElementById("shared-file-dialog") as HTMLDialogElement
    error.value=error
    dialogElement.close()
};

async function handleAdd(e:any){
    e.preventDefault()
    try {
        dialog_close()
        isLoading.value=true
        wait.value="cursor-progress bg-gray-400"
        const url=route.fullPath.includes('/uploads')?`${origin}/api/file/access/${userdata.email}`:`${origin}/api/group/file/access/${userdata.email}`
        const response=await fetch(url,{
            method:"POST",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                filename:route.query.filename,
                allowedEmail:e.target.name.value
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            dialog_open(parseRes.error)
            isLoading.value=false
            wait.value="cursor-pointer bg-green-400"
            e.target.reset()
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000
            })
            isLoading.value=false
            wait.value="cursor-pointer bg-green-400"
            window.location.reload()
            e.target.reset()
        }
    } catch (error:any) {
        error.value=error.message
        dialog_open(error.message)
        isLoading.value=false
        wait.value="cursor-pointer bg-green-400"
    }
}
</script>

<template>
   <dialog id="shared-file-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[83vw] h-fit text-[#808080] scale-[0.9] p-10 max-sm:px-5 max-sm:py-2">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-red-500 text-center max-md:text-lg max-sm:text-sm">{{error}}</p>
            <form class="flex flex-col items-center max-sm:text-xs my-4" @submit="handleAdd">
                <p class="max-md:text-lg mb-1 max-sm:text-sm max-md:text-center text-gray-600">Enter their account email</p>
                <input type="email" name="name" class="mt-2 border-green-400 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-green-400 w-[100%] py-2 px-4 placeholder:text-sm text-sm" placeholder="email@example.com" required/>
                <button :class="wait" :disabled="isLoading" class="mt-4 text-white w-fit px-5 py-2 flex justify-center items-center text-sm h-fit  cursor-pointer rounded-[5px]">
                    <i class="icon pi pi-plus mr-3"></i>
                   <span>Add</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
