// The Launch Era — resilient Supabase auth persistence for installed web apps.
// iOS can cold-start a Home Screen web app before IndexedDB is ready. Keep the
// Supabase session immediately available in localStorage, with IndexedDB as a
// same-origin mirror/rescue copy. This prevents a false signed-out state from
// flashing the password form and triggering iOS Password AutoFill / Face ID.
(()=>{
  const DB_NAME="tle-auth-v1";
  const STORE_NAME="session";
  const DB_VERSION=1;
  const LEGACY_LOCAL_SOURCE_PREFIX="tle_auth_local_source:";

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
  function legacySourceKey(key){return LEGACY_LOCAL_SOURCE_PREFIX+key;}

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
        dbPromise=null;
        finish(null);
        return;
      }
      const timer=setTimeout(()=>{
        // A slow iOS IndexedDB open must not poison the whole page lifetime.
        dbPromise=null;
        finish(null);
      },3500);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      };
      request.onsuccess=()=>{
        clearTimeout(timer);
        const db=request.result;
        if(settled){
          try{db.close();}catch{}
          return;
        }
        db.onversionchange=()=>{try{db.close();}catch{} dbPromise=null;};
        finish(db);
      };
      request.onerror=()=>{clearTimeout(timer);dbPromise=null;finish(null);};
      request.onblocked=()=>{clearTimeout(timer);dbPromise=null;finish(null);};
    });
    return dbPromise;
  }

  async function idbRead(key){
    const db=await openDb();
    if(!db) return null;
    return await new Promise(resolve=>{
      let done=false;
      const finish=value=>{if(done)return;done=true;resolve(value);};
      try{
        const tx=db.transaction(STORE_NAME,"readonly");
        const request=tx.objectStore(STORE_NAME).get(key);
        const timer=setTimeout(()=>finish(null),2500);
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
        const timer=setTimeout(()=>finish(false),2500);
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
        const timer=setTimeout(()=>finish(false),2200);
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
      // localStorage is synchronous and reliable during an iOS cold launch.
      const localValue=localGet(key);
      if(localValue!==null){
        // Clean the old migration marker and refresh the IndexedDB mirror
        // without delaying Supabase's initial session decision.
        localRemove(legacySourceKey(key));
        idbWrite(key,localValue).catch(()=>{});
        return localValue;
      }

      // Existing installs may still have the session only in IndexedDB.
      // Rescue it once and mirror it to localStorage for future cold starts.
      const indexedValue=await idbRead(key);
      if(indexedValue!==null){
        localSet(key,indexedValue);
        localRemove(legacySourceKey(key));
        return indexedValue;
      }
      return null;
    },

    async setItem(key,value){
      // Persist synchronously first so closing/backgrounding the PWA cannot
      // race an IndexedDB transaction and lose the login state.
      localSet(key,value);
      localRemove(legacySourceKey(key));
      idbWrite(key,value).catch(()=>{});
    },

    async removeItem(key){
      // Sign-out must clear both copies.
      localRemove(key);
      localRemove(legacySourceKey(key));
      await idbDelete(key);
    }
  };

  window.TLE_AUTH_STORAGE=storage;
})();
