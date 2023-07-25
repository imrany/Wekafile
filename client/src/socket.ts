import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: localStorage.getItem("status")
});

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
const URL=`http://localhost:8000`

export const socket = io(URL);

socket.on("disconnect", () => {
  localStorage.setItem("status",JSON.stringify(false))
});

socket.on('peers',(data)=>{
  localStorage.setItem("status",JSON.stringify(true))
  localStorage.setItem("peers",JSON.stringify(data.slice(1,data.length)))
  console.log(localStorage.getItem("peers"))
})
// socket.on("foo", (...args) => {
//   state.fooEvents.push(args);
// });

// socket.on("bar", (...args) => {
//   state.barEvents.push(args);
// });