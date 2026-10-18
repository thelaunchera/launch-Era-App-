/* r82: restore the desktop navigation rail after mobile drawer/route transitions.
   Does not touch the phone drawer or change routes, permissions, or app data. */
(()=>{
  const desktop=window.matchMedia("(min-width:861px)");
  let frame=0;
  const restore=()=>{
    frame=0;
    const shell=document.getElementById("appShell");
    const rail=document.getElementById("sidebar");
    if(!desktop.matches||!shell||shell.hidden||!rail||!document.body.classList.contains("shell-app")||document.body.classList.contains("tle-drawer-open"))return;
    const required={
      display:"flex",visibility:"visible",opacity:"1",
      "pointer-events":"auto",transform:"none","-webkit-transform":"none",
      left:"0px",right:"auto"
    };
    for(const [property,value] of Object.entries(required)){
      if(rail.style.getPropertyValue(property)!==value||rail.style.getPropertyPriority(property)!=="important")
        rail.style.setProperty(property,value,"important");
    }
    if(rail.classList.contains("open"))rail.classList.remove("open");
  };
  const schedule=()=>{
    if(!frame)frame=requestAnimationFrame(restore);
  };
  const attach=()=>{
    const shell=document.getElementById("appShell");
    const rail=document.getElementById("sidebar");
    if(!shell||!rail)return;
    new MutationObserver(schedule).observe(rail,{attributes:true,attributeFilter:["style","class"]});
    new MutationObserver(schedule).observe(shell,{attributes:true,attributeFilter:["hidden"]});
    new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:["class"]});
    desktop.addEventListener?.("change",schedule);
    window.addEventListener("resize",schedule,{passive:true});
    window.addEventListener("pageshow",schedule);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)schedule();});
    document.addEventListener("click",event=>{
      if(event.target.closest?.("#appShell .nav-item,#appShell [data-jump],#appShell #menuToggle"))schedule();
    },{capture:true});
    schedule();
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach,{once:true});
  else attach();
})();
