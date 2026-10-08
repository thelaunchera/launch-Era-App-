/* Owner-facing review of the booking estimate, travel and final quote. */
(()=>{
  window.TLE_BOOKING_REVIEW=function(b,money,esc,langPick){
    const snap=b.price_snapshot||{},calc=snap.estimate||{},service=snap.service||{},discount=b.discount_snapshot||{};
    const addonRows=Array.isArray(snap.addons)?snap.addons:[];
    const original=snap.owner_review?.original_estimate??b.quoted_total??snap.total;
    const est=original===null||original===undefined?null:Number(original);
    const valid=est!==null&&Number.isFinite(est);
    const final=Number(snap.owner_review?.final_total);
    const amount=valid?money(est):"—";
    const entries=[];
    const add=(name,n)=>{
      if(n===undefined||n===null||n==="")return;
      const numeric=Number(n);if(!Number.isFinite(numeric)||!numeric)return;
      entries.push('<div class="booking-price-breakdown-row"><span>'+esc(name)+'</span><strong>'+esc(money(numeric))+'</strong></div>');
    };
    if(calc.service_base!==undefined){
      add(service.name||b.services?.name||"Service",calc.service_base);
      add(langPick("Extra bedrooms","Habitaciones adicionales","Chambres supplémentaires"),calc.bedroom_adjustment);
      add(langPick("Extra bathrooms","Baños adicionales","Salles de bain supplémentaires"),calc.bathroom_adjustment);
      add(langPick("Home size","Tamaño de la casa","Surface"),calc.sqft_adjustment);
      add(langPick("Frequency discount","Descuento por frecuencia","Remise récurrence"),-Number(calc.recurring_discount||0));
    }else add(service.name||b.services?.name||"Service",service.price);
    addonRows.forEach(a=>add(a.name||"Add-on",a.price));
    add(discount.name||langPick("Discount","Descuento","Remise"),-Number(discount.discount_amount||0));
    const details=entries.length?'<details class="booking-price-breakdown"><summary>'+esc(langPick("View estimated breakdown","Ver desglose del estimado","Voir le détail du devis"))+'</summary><div>'+entries.join("")+'</div></details>':"";
    const header='<div class="booking-price-estimate"><span>'+esc(langPick("Automatic estimate · not final","Estimado automático · no definitivo","Estimation automatique · non définitive"))+'</span><strong>'+esc(amount)+'</strong></div>';
    if(b.status!=="requested"){
      const label=b.status==="quote_sent"?langPick("Quote sent · awaiting acceptance","Quote enviado · esperando aceptación","Devis envoyé · en attente"):
        b.status==="converted"?langPick("Quote accepted · confirmed","Quote aceptado · confirmado","Devis accepté · confirmé"):
        langPick("Request reviewed","Solicitud revisada","Demande examinée");
      return '<div class="booking-review-panel">'+header+details+'<div class="booking-price-estimate"><span>'+esc(label)+'</span><strong>'+esc(Number.isFinite(final)&&snap.owner_review?.final_total!=null?money(final):"—")+'</strong></div></div>';
    }
    const fromData=Number(calc.travel_fee||0);
    const travel=Number.isFinite(fromData)&&fromData>=0?fromData:0;
    return '<div class="booking-review-panel" data-review-booking="'+esc(b.id)+'">'+header+details+
      '<div class="booking-review-price-fields">'+
      '<label class="booking-final-price-label"><span>'+esc(langPick("Travel · verify distance","Travel · verificar distancia","Déplacement · vérifier distance"))+'</span>'+
      '<input type="number" inputmode="decimal" min="0" max="100000" step="0.01" data-booking-travel="'+esc(b.id)+'" value="'+esc(travel.toFixed(2))+'"></label>'+
      '<label class="booking-final-price-label"><span>'+esc(langPick("Final quote amount · editable","Precio final del quote · editable","Montant du devis · modifiable"))+'</span>'+
      '<input type="number" inputmode="decimal" min="0.01" max="1000000" step="0.01" data-booking-final-price="'+esc(b.id)+'" value="'+esc(valid?(est+travel).toFixed(2):"")+'" required></label></div>'+
      '<small class="booking-price-note">'+esc(langPick("Review bedrooms, size, add-ons, travel and discounts. The quote is emailed only after you approve its final amount. The client must accept before booking confirmation.",
        "Revisa habitaciones, tamaño, add-ons, travel y descuentos. El quote se envía solo cuando apruebes el precio final. La clienta debe aceptarlo antes de confirmar la cita.",
        "Vérifiez les détails et le déplacement. Le client doit accepter le devis."))+'</small></div>';
  };
  document.addEventListener("change",event=>{
    const field=event.target.closest?.("[data-booking-travel]");
    if(!field)return;
    const group=field.closest("[data-review-booking]");
    const price=group?.querySelector("[data-booking-final-price]");
    if(!price)return;
    const initial=Number(field.dataset.lastTravel||0),now=Number(field.value),old=Number(price.value);
    if(!Number.isFinite(now)||!Number.isFinite(old))return;
    const updated=Math.round((old+now-initial)*100)/100;
    if(Number.isFinite(updated)&&updated>=0)price.value=updated.toFixed(2);
    field.dataset.lastTravel=String(now);
  });
})();
