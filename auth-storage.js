// The Launch Era — resilient Supabase auth persistence for installed web apps.
// Keeps the auth session in one same-origin store at a time: IndexedDB when
// available, with localStorage only as a compatibility fallback.
(()=>{
  const DB_NAME="tle-auth-v1";
  const STORE_NAME="session";
  const DB_VERSION=1;
  const LOCAL_SOURCE_PREFIX="tle_auth_local_source:";

  let dbPromise=null;

  function localGet(key){
    try{return window.localStorage.getItem(key);}catch{return null;}
  }
  function localSet(key,value){
    try{window.localStorage.setItem(key,value);return true;}catch{return false;}
  }
  function localRemove(key){
    try{window.localStorage.removeItem(key);}catch{}
  }
  function sourceKey(key){return LOCAL_SOURCE_PREFIX+key;}

  function openDb(){
    if(dbPromise) return dbPromise;
    dbPromise=new Promise(resolve=>{
      if(!("indexedDB" in window)){resolve(null);return;}
      let settled=false;
      let request;
      const finish=value=>{
        if(settled) return;
        settled=true;
        resolve(value);
      };
      try{
        request=window.indexedDB.open(DB_NAME,DB_VERSION);
      }catch{
        finish(null);
        return;
      }
      const timer=setTimeout(()=>finish(null),1800);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      };
      request.onsuccess=()=>{
        clearTimeout(timer);
        const db=request.result;
        db.onversionchange=()=>{try{db.close();}catch{} dbPromise=null;};
        finish(db);
      };
      request.onerror=()=>{clearTimeout(timer);finish(null);};
      request.onblocked=()=>{clearTimeout(timer);finish(null);};
    });
    return dbPromise;
  }

  async function idbRead(key){
    const db=await openDb();
    if(!db) return null;
    return await new Promise(resolve=>{
      let done=false;
      const finish=value=>{if(done)return;done=true;resolve(value);};
      let tx;
      try{
        tx=db.transaction(STORE_NAME,"readonly");
        const request=tx.objectStore(STORE_NAME).get(key);
        const timer=setTimeout(()=>finish(null),1200);
        request.onsuccess=()=>{clearTimeout(timer);finish(request.result??null);};
        request.onerror=()=>{clearTimeout(timer);finish(null);};
        tx.onabort=()=>{clearTimeout(timer);finish(null);};
      }catch{
        finish(null);
      }
    });
  }

  async function idbWrite(key,value){
    const db=await openDb();
    if(!db) return false;
    return await new Promise(resolve=>{
      let done=false;
      const finish=value=>{if(done)return;done=true;resolve(value);};
      try{
        const tx=db.transaction(STORE_NAME,"readwrite");
        const timer=setTimeout(()=>finish(false),1400);
        tx.objectStore(STORE_NAME).put(value,key);
        tx.oncomplete=()=>{clearTimeout(timer);finish(true);};
        tx.onerror=()=>{clearTimeout(timer);finish(false);};
        tx.onabort=()=>{clearTimeout(timer);finish(false);};
      }catch{
        finish(false);
      }
    });
  }

  async function idbDelete(key){
    const db=await openDb();
    if(!db) return false;
    return await new Promise(resolve=>{
      let done=false;
      const finish=value=>{if(done)return;done=true;resolve(value);};
      try{
        const tx=db.transaction(STORE_NAME,"readwrite");
        const timer=setTimeout(()=>finish(false),1200);
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete=()=>{clearTimeout(timer);finish(true);};
        tx.onerror=()=>{clearTimeout(timer);finish(false);};
        tx.onabort=()=>{clearTimeout(timer);finish(false);};
      }catch{
        finish(false);
      }
    });
  }

  const storage={
    async getItem(key){
      // If a previous IndexedDB write failed, localStorage is temporarily the
      // source of truth. Migrate it back when IndexedDB becomes available.
      const localPreferred=localGet(sourceKey(key))==="1";
      if(localPreferred){
        const localValue=localGet(key);
        if(localValue!==null){
          if(await idbWrite(key,localValue)){
            localRemove(key);
            localRemove(sourceKey(key));
          }
          return localValue;
        }
        localRemove(sourceKey(key));
      }

      const indexedValue=await idbRead(key);
      if(indexedValue!==null) return indexedValue;

      // One-time migration from Supabase's former localStorage persistence.
      const legacyValue=localGet(key);
      if(legacyValue!==null){
        if(await idbWrite(key,legacyValue)){
          localRemove(key);
          localRemove(sourceKey(key));
        }else{
          localSet(sourceKey(key),"1");
        }
        return legacyValue;
      }
      return null;
    },

    async setItem(key,value){
      if(await idbWrite(key,value)){
        localRemove(key);
        localRemove(sourceKey(key));
        return;
      }
      localSet(key,value);
      localSet(sourceKey(key),"1");
    },

    async removeItem(key){
      await idbDelete(key);
      localRemove(key);
      localRemove(sourceKey(key));
    }
  };

  window.TLE_AUTH_STORAGE=storage;
})();
