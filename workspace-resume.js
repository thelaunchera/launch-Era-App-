// Navigation-only memory for authenticated Cleaning App workspaces.
// No customer data, passwords, draft forms or session tokens are stored.
(()=>{
  const TWO_HOURS=2*60*60*1000;
  window.TLE_WORKSPACE_RESUME=function({key,allows,history,positions,active,view,top,open}){
    function save(id){
      if(!active()||!allows(id))return;
      const clean=Object.fromEntries(Object.entries(positions)
        .filter(([name,value])=>allows(name)&&Number.isFinite(value))
        .slice(-24));
      try{localStorage.setItem(key(),JSON.stringify({id,at:Date.now(),stack:history.slice(-24),positions:clean}));}catch{}
    }
    function restore(){
      let item=null;
      try{item=JSON.parse(localStorage.getItem(key())||"null");}catch{}
      const age=Date.now()-Number(item?.at||0);
      if(!item||age<0||age>TWO_HOURS||!allows(item.id)){
        history.splice(0,history.length,"today");
        open("today");
        return "today";
      }
      const stack=Array.isArray(item.stack)?item.stack.filter(allows).slice(-24):["today"];
      history.splice(0,history.length,...(stack.length?stack:["today"]));
      Object.assign(positions,Object.fromEntries(Object.entries(item.positions||{})
        .filter(([name,value])=>allows(name)&&Number.isFinite(value))));
      open(item.id);
      return item.id;
    }
    function remember(){
      if(!active())return;
      const id=view();
      if(!allows(id))return;
      try{positions[id]=Math.max(0,Number(top())||0);}catch{}
      save(id);
    }
    window.addEventListener("pagehide",remember);
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")remember();});
    return {save,restore};
  };
})();
