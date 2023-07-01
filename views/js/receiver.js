import { notification } from "./notification.js"
const root=document.getElementById("root")
const socket = io("/");

let start=`
    <div class="flex flex-col items-center pt-[20vh]">
        <p class="text-2xl font-semibold">Receive Files</p>
        <div class="receive flex flex-col"></div>
        <a href="../index.html" class="mt-[40px] font-semibold  text-lg text-blue-600">Back</a>
    </div>
`
root.innerHTML=start

socket.on("download", function(data) {
    console.log(data);
    notification.receive(data)
    let blob1 = new Blob([new Uint8Array(data.file)],{type:`${data.type}`}) 
    let url =URL.createObjectURL(blob1)
    
    
    document.querySelector(".receive").innerHTML+=`
        <a href="${url}" download="${data.file_name}">${data.file_name}</a>
    `
});