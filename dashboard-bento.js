// Preview-only presentation. No database writes, timer controls or record copies.
(function(){
  if(document.documentElement.dataset.dashboardPreview!=="bento") return;
  let timerStartedAt=null;
  const get=id=>document.getElementById(id);
  function install(){
    const view=document.querySelector('.view[data-page="today"]');
    if(!view || get('bentoActivityCard')) return;
    const activity=document.createElement('article');
    activity.id='bentoActivityCard';activity.className='panel bento-activity-card';
    activity.setAttribute('data-admin-only','');
    activity.innerHTML=`<div class="bento-card-head"><h3 id="bentoActivityTitle">Weekly activity</h3><button type="button" class="bento-open" data-jump="reports" data-owner-only aria-label="Reports">↗</button></div><div class="bento-chart-summary"><strong id="bentoActivityTotal">0</strong><span id="bentoActivityLabel">Scheduled jobs</span></div><div id="bentoActivityChart" class="bento-bar-chart" role="list" aria-label="Scheduled jobs by day"></div>`;
    view.appendChild(activity);
    const timer=document.createElement('article');
    timer.id='bentoTimerCard';timer.className='bento-timer-card';
    timer.innerHTML=`<div class="bento-card-head"><h3 id="bentoTimerTitle">Time tracker</h3><span class="bento-timer-dot" aria-hidden="true"></span></div><p id="bentoTimerJob">No timer running.</p><strong id="bentoTimerElapsed" class="bento-timer-elapsed">00:00:00</strong><button type="button" class="bento-timer-action" data-jump="time"><span id="bentoTimerActionText">Manage timer</span><span aria-hidden="true">↗</span></button>`;
    view.appendChild(timer);
    const capacity=view.querySelector('.capacity-card');
    if(capacity){
      const gauge=document.createElement('div');gauge.className='bento-capacity-gauge';
      gauge.innerHTML='<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bento-gauge-track" cx="60" cy="60" r="48"></circle><circle id="bentoCapacityArc" class="bento-gauge-fill" cx="60" cy="60" r="48" pathLength="100" stroke-dasharray="0 100"></circle></svg>';
      const percent=get('capacityPercent');if(percent) gauge.appendChild(percent);
      capacity.querySelector('.capacity-top').after(gauge);
    }
    // Keep existing nodes, permission attributes and delegated actions intact.
    const schedule=view.querySelector('.schedule-panel');
    if(schedule)view.appendChild(schedule);
    if(capacity)view.appendChild(capacity);
    const week=view.querySelector('.week-growth-card');
    if(week)view.appendChild(week);
    const order=['#firstWinCard','#todayHeroCard','#businessPulse','#bentoActivityCard','.next-move-panel','.schedule-panel','.capacity-card','#bentoTimerCard','.attention-panel','.dashboard-quick-access','.week-growth-card','.presence-panel'];
    for(const selector of order){const node=view.querySelector(':scope > '+selector);if(node)view.appendChild(node);}
  }
  function elapsed(){
    const node=get('bentoTimerElapsed');if(!node)return;
    const seconds=timerStartedAt===null?0:Math.max(0,Math.floor((Date.now()-timerStartedAt)/1000));
    const parts=[Math.floor(seconds/3600),Math.floor(seconds%3600/60),seconds%60];
    node.textContent=parts.map(n=>String(n).padStart(2,'0')).join(':');
  }
  function render(data){
    install();
    const {weekJobs=[],weekStart,locale='en-US',timeZone,capacity={},activeTimer=null,copy={}}=data||{};
    const text=(id,value)=>{const node=get(id);if(node&&value!=null)node.textContent=value;};
    text('bentoActivityTitle',copy.activity);text('bentoActivityLabel',copy.jobs);text('bentoActivityTotal',weekJobs.length);
    text('bentoTimerTitle',copy.timer);text('bentoTimerActionText',copy.manage);
    text('bentoTimerJob',activeTimer?(activeTimer.jobs?.clients?.name||activeTimer.jobs?.services?.name||copy.running):copy.idle);
    const start=activeTimer?Date.parse(activeTimer.clocked_in_at):NaN;
    timerStartedAt=Number.isFinite(start)?start:null;
    get('bentoTimerCard')?.classList.toggle('is-running',timerStartedAt!==null);
    elapsed();
    const arc=get('bentoCapacityArc');
    if(arc)arc.setAttribute('stroke-dasharray',`${capacity.available?Math.max(0,Math.min(100,Number(capacity.percent)||0)):0} 100`);
    const chart=get('bentoActivityChart');
    if(!chart || !weekStart)return;
    const dayFormatter=new Intl.DateTimeFormat(locale,{weekday:'short',timeZone});
    const days=[];
    for(let i=0;i<7;i++){
      const start=new Date(weekStart);start.setDate(start.getDate()+i);
      const end=new Date(start);end.setDate(end.getDate()+1);
      const labelDate=new Date(start);labelDate.setHours(12);
      const count=weekJobs.filter(job=>{const timestamp=Date.parse(job.starts_at);return timestamp>=start.getTime()&&timestamp<end.getTime();}).length;
      days.push({label:dayFormatter.format(labelDate),count});
    }
    const max=Math.max(1,...days.map(day=>day.count));
    chart.replaceChildren();
    for(const day of days){
      const column=document.createElement('div');column.className='bento-bar-column';column.setAttribute('role','listitem');
      column.setAttribute('aria-label',`${day.label}: ${day.count}`);
      const value=document.createElement('span');value.className='bento-bar-value';value.textContent=day.count;
      const track=document.createElement('span');track.className='bento-bar-track';track.setAttribute('aria-hidden','true');
      const fill=document.createElement('span');fill.className='bento-bar-fill';fill.style.height=day.count?Math.max(8,day.count/max*100)+'%':'0%';track.appendChild(fill);
      const label=document.createElement('small');label.textContent=day.label;
      column.append(value,track,label);chart.appendChild(column);
    }
  }
  window.TLE_BENTO_DASHBOARD={render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  // Derive from the existing persisted start time; never create or restart a timer.
  setInterval(()=>{if(!document.hidden && document.querySelector('.view[data-page="today"].active'))elapsed();},1000);
})();
