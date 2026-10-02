// The Launch Era — dashboard home v2 UI shell.
(function(){
  function ensureDashboardHomeV2(){
    const hero=document.getElementById("todayHeroCard");
    if(hero && !document.querySelector(".dashboard-quick-access")){
      hero.insertAdjacentHTML("afterend", `
        <section class="dashboard-quick-access" aria-label="Quick access">
          <div class="dashboard-section-head">
            <h3>Quick access</h3>
          </div>
          <div class="dashboard-quick-grid">
            <button class="dashboard-quick-card quick-calendar" type="button" data-jump="calendar">
              <span class="dashboard-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 10h18"></path></svg></span>
              <strong>Calendar</strong><small>View & manage jobs</small><span class="dashboard-quick-arrow" aria-hidden="true">›</span>
            </button>
            <button class="dashboard-quick-card quick-booking" type="button" data-jump="booking" data-admin-only>
              <span class="dashboard-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 4h14v16H5z"></path><path d="M8 8h8M8 12h5M8 16h6"></path></svg></span>
              <strong>Bookings</strong><small>New requests & quotes</small><span class="dashboard-quick-arrow" aria-hidden="true">›</span>
            </button>
            <button class="dashboard-quick-card quick-customers" type="button" data-jump="clients" data-admin-only>
              <span class="dashboard-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"></circle><path d="M3 19c0-3.2 2.4-5 6-5s6 1.8 6 5"></path><path d="M16 6.5c2.2.2 3.5 1.5 3.5 3.2 0 1.6-1.2 2.7-3 3M17 14c2.5.5 4 2 4 4"></path></svg></span>
              <strong>Clients</strong><small>View & manage clients</small><span class="dashboard-quick-arrow" aria-hidden="true">›</span>
            </button>
            <button class="dashboard-quick-card quick-money" type="button" data-jump="invoices" data-admin-only>
              <span class="dashboard-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M15 8.5c-.8-.8-1.8-1.2-3-1.2-1.7 0-3 1-3 2.3 0 3.5 6.2 1.5 6.2 5 0 1.4-1.3 2.5-3.2 2.5-1.4 0-2.7-.5-3.6-1.4M12 5.8v12.4"></path></svg></span>
              <strong>Money</strong><small>Invoices, payments & more</small><span class="dashboard-quick-arrow" aria-hidden="true">›</span>
            </button>
            <button class="dashboard-quick-card quick-weather" type="button" data-weather-focus>
              <span class="dashboard-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 8.4 4.5 4.5 0 0 0 7 17Z"></path><path d="M9 20h6"></path></svg></span>
              <strong>Weather</strong><small id="quickWeatherSummary">Current local weather</small><span class="dashboard-quick-arrow" aria-hidden="true">›</span>
            </button>
            <button class="dashboard-quick-card quick-services" type="button" data-jump="services" data-admin-only>
              <span class="dashboard-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path><circle cx="8" cy="6" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="10" cy="18" r="1.5"></circle></svg></span>
              <strong>Services</strong><small>Prices, durations & add-ons</small><span class="dashboard-quick-arrow" aria-hidden="true">›</span>
            </button>
          </div>
        </section>`);
    }

    const appShell=document.getElementById("appShell");
    if(appShell && !document.querySelector(".mobile-bottom-nav")){
      appShell.insertAdjacentHTML("beforeend", `
        <nav class="mobile-bottom-nav" aria-label="Primary app navigation">
          <button class="mobile-bottom-item active" type="button" data-mobile-root="home" data-jump="today" aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V21h14V9.5"></path><path d="M9 21v-6h6v6"></path></svg><span>Home</span>
          </button>
          <button class="mobile-bottom-item" type="button" data-mobile-root="schedule" data-jump="calendar" aria-label="Schedule">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 10h18"></path></svg><span>Schedule</span>
          </button>
          <button class="mobile-bottom-item" type="button" data-mobile-root="customers" data-jump="clients" aria-label="Clients" data-admin-only>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"></circle><path d="M3 20c0-3.4 2.5-5.5 6-5.5s6 2.1 6 5.5"></path><path d="M16 7c2.4.1 4 1.5 4 3.4 0 1.8-1.4 3.1-3.5 3.3M17 15c2.5.6 4 2.2 4 4.5"></path></svg><span>Clients</span>
          </button>
          <button class="mobile-bottom-item" type="button" data-mobile-root="money" data-jump="invoices" aria-label="Money" data-admin-only>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M15 8.5c-.8-.8-1.8-1.2-3-1.2-1.7 0-3 1-3 2.3 0 3.5 6.2 1.5 6.2 5 0 1.4-1.3 2.5-3.2 2.5-1.4 0-2.7-.5-3.6-1.4M12 5.8v12.4"></path></svg><span>Money</span>
          </button>
          <button class="mobile-bottom-item" type="button" data-mobile-root="more" data-mobile-more aria-label="More">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg><span>More</span>
          </button>
        </nav>`);
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",ensureDashboardHomeV2,{once:true});
  else ensureDashboardHomeV2();
})();
