import { useToast } from "vue-toast-notification";

const user_data:any=localStorage.getItem("userdata")
export const userdata=JSON.parse(user_data)
//export const origin="http://localhost:8080"
 export const origin='https://fireshare-server.onrender.com'

const toast=useToast()
export const loader={
    on(){
        const loader=document.querySelector('.preload') as HTMLDivElement;
        loader.style.display='block';
    },
    off(){
        const loader=document.querySelector('.preload') as HTMLDivElement;
        loader.style.display='none';
    }
}

export function install_function(){
    window.addEventListener('beforeinstallprompt',(e:any) => {
        const btn = document.querySelector('#install') as HTMLButtonElement
        btn.style.display="block"
        btn.onclick =()=> {
            e.prompt()
            btn.style.display="none"
        };
        return e.preventDefault();
    });
}

export function update_function(){
    window.addEventListener('appinstalled',(e:any) => {
        window.addEventListener("online",()=>{
            
        })
        const btn = document.querySelector('#update') as HTMLDivElement
        btn.style.display="block"
        btn.onclick =()=> {
            // "site-static"
            update_cache("site-dynamic")
            // localStorage.setItem("version",)
            btn.style.display="none"
        };
        return e.preventDefault();
    });
}

export function update_cache(name:string) {
    caches.delete(name).then((m:any)=>{
        console.log(m)
        window.location.reload()
    }).catch((err:any)=>{
        alert(err.message)
    })
}

export const allow_notifications=()=>{
    if(Notification.permission === 'granted'){
        //showNotification();
        window.location.pathname="/notifications"
    }else if(Notification.permission !== 'denied'){
        Notification.requestPermission().then(permission =>{
            if(permission === "granted"){
                //showNotification();
                window.location.pathname="/notifications"
            }
        });
    }else if(Notification.permission === 'denied'){
        toast.info("Turn on your notifications!!",{
            position:"top-right",
            duration:5000
        })
    };
}

export function share_app(){
    if (navigator.share) {
        navigator.share({
          title: 'Wekafile',
          text: 'Try Wekafile \n',
          url: 'https://wekafile.web.app/',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
}
export function share_url(title:string,url:string){
    if (navigator.share) {
        navigator.share({
          title,
          text:``,
          url,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
}
export function share_file(title:string,file:File){
    if (navigator.share) {
        navigator.share({
          title,
          text:title,
          files:[file],
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
}

export  async function fetchUserDetails() {
    try {
        if(userdata){
          const url=`${origin}/api/accounts/${userdata.email}`
          const response=await fetch(url,{
            method:"GET",
            headers:{
                "authorization":`Bearer ${userdata.token}`
            }
          })
          const parseRes=await response.json()
          if (parseRes.error) {
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
          } else {
            localStorage.removeItem('userdata')
            const userdt:any=JSON.stringify(parseRes.data)
            localStorage.setItem('userdata',userdt)
        }
      }    
    } catch (error:any) {
        console.log(error.message)
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
    }
}

export function typeMe(string:string,element:HTMLElement){
    var curr=0;
    function write(){
        element.textContent+=string.charAt(curr);
        curr++;
        if(curr<string.length){
            setTimeout(write,50)
        }
    }
    write()
}