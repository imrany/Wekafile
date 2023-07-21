async function indexedDB(){
    return new Promise((resolve, reject)=>{
        const indexedDB =
        window.indexedDB 
    
        if (!indexedDB) {
            console.log("IndexedDB could not be found in this browser.");
            reject("IndexedDB could not be found in this browser.")
        }
    
        const dbName="Fileshare"
        const request = window.indexedDB.open(dbName, 3);
        request.onerror = (event:any) => {
            console.log(event.target.result)
        };
    
        request.onsuccess=(event:any)=>{
            resolve(event.target.result);
        }

        request.onupgradeneeded = (event:any) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore("All_files", { keyPath: "id" });
            // lastModifiedDate :  Tue Mar 28 2023 14:51:08 GMT+0300 (East Africa Time) {}
            // name:  "walling-e_MdMMKrgdY-unsplash.jpg"
            // size:  1282897
            // type : "image/jpeg"
            objectStore.createIndex("uploadedAt", ["uploadedAt"], { unique: false });
            objectStore.createIndex("filename", ["filename"], { unique: false });
            objectStore.createIndex("size", ["size"], { unique: false });
            objectStore.createIndex("file", ["file"], { unique: false });
            objectStore.createIndex("type", ["type"], { unique: false });
            objectStore.createIndex("path", ["path"], { unique: true });
            objectStore.createIndex("sharedTo", ["sharedTo"], { unique: false });
        };
    });
}
export default indexedDB;