/* The Launch Era | Booking quote review before client confirmation. */
(()=>{
window.TLE_BOOKING_REVIEW=function(b,money,escapeHtml,langPick){
  const snap=b.price_snapshot||{},service=snap.service||{},calc=snap.estimate||{};
  const addons=Array.isArray(snap.addons)?snap.addons:[];
  const discount=b.discount_snapshot||{};
  const raw=b.status==="requested"?(b.quoted_total??snap.total):(snap.owner_review?.original_estimate??snap.total??b.quoted_total);
  const estimate=raw===null||raw===undefined?null:Number(raw);
  const valid=estimate!==null&&Number.isFinite(estimate)&&estimate>=0;
  const travelRaw=calc.travel_fee??b.price_snapshot?.owner_review?.travel_fee??0;
  const travel=Math.max(0,Number(travelRaw)||0);
  const rows=[];
  if(service.price!==null&&service.price!==undefined)rows.push([service.name||b.services?.name||"Service",Number(service.price)]);
  addons.forEach(a=>rows.push([a.name||"Add-on",Number(a.price||0)]));
  if(Number(calc.bedroom_adjustment||0)>0)rows.push([langPick("Bedroom adjustment","Ajuste de habitaciones","Ajustement chambres"),Number(calc.bedroom_adjustment)]);
  if(Number(calc.bathroom_adjustment||0)>0)rows.push([langPick("Bathroom adjustment","Ajuste de baños","Ajustement salles de bain"),Number(calc.bathroom_adjustment)]);
  if(Number(calc.sqft_adjustment||0)>0)rows.push([langPick("House size adjustment","Ajuste por tamaño","Ajustement de surface"),Number(calc.sqft_adjustment)]);
  if(Number(calc.recurring_discount||0)>0)rows.push([langPick("Frequency discount","Descuento de frecuencia","Remise fréquence"),-Number(calc.recurring_discount)]);
  if(Number(discount.discount_amount||0)>0)rows.push([discount.name||"Discount",-Number(discount.discount_amount)]);
  const rowHtml=rows.map(([name,value])=>'<div class="booking-price-breakdown-row"><span>'+escapeHtml(name)+'</span><strong>'+escapeHtml(money(value))+'</strong></div>').join("");
  const details=rowHtml?'<details class="booking-price-breakdown"><summary>'+escapeHtml(langPick("How the estimate was calculated","Cómo se calculó el estimado","Détail du calcul"))+'</summary><div>'+rowHtml+'</div></details>':"";
  const estimateHtml='<div class="booking-price-estimate"><span>'+escapeHtml(langPick("Calculator estimate · not final","Estimado de la calculadora · no definitivo","Estimation du calculateur"))+'</span><strong>'+escapeHtml(valid?money(estimate):"—")+'</strong></div>';
  if(b.status!=="requested"){
    const finalRaw=snap.owner_review?.final_total;
    return '<div class="booking-review-panel">'+estimateHtml+
      (finalRaw!==undefined?'<div class="booking-price-estimate"><span>'+escapeHtml(langPick("Quote sent","Cotización enviada","Devis envoyé"))+'</span><strong>'+escapeHtml(money(Number(finalRaw)))+'</strong></div>':"")+
      details+'</div>';
  }
  const amount=(valid?estimate+travel:0).toFixed(2);
  return '<div class="booking-review-panel">'+estimateHtml+details+
    '<div class="booking-owner-pricing">'+
      '<label class="booking-final-price-label">'+escapeHtml(langPick("Travel (verify location / distance)","Travel (verifica dirección / distancia)","Déplacement (vérifier distance)"))+
      '<input data-booking-travel type="number" step="0.01" min="0" max="100000" inputmode="decimal" value="'+escapeHtml(travel.toFixed(2))+'"></label>'+
      '<label class="booking-final-price-label">'+escapeHtml(langPick("Final quote to send","Precio final del quote","Devis final à envoyer"))+
      '<input data-booking-final-price="'+escapeHtml(b.id)+'" type="number" step="0.01" min="0.01" max="1000000" inputmode="decimal" value="'+escapeHtml(amount)+'"></label>'+
    '</div>'+
    '<small class="booking-price-note">'+escapeHtml(langPick("Check rooms, size, extras, discounts and travel. Edit the final price before sending. The booking is only confirmed after client acceptance.","Revisa habitaciones, tamaño, extras, descuentos y travel. Edita el precio antes de enviar. La reserva se confirma cuando la clienta acepte.","Vérifiez pièces, surface, suppléments, remises et déplacement. Le client doit accepter pour confirmer."))+'</small>'+
    '</div>';
};
})();
