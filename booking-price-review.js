/* Booking estimate review UI isolated from main bundle. */
(()=>{
window.TLE_BOOKING_REVIEW=function(b,money,escapeHtml,langPick){
  const snap=b.price_snapshot||{};
  const service=snap.service||{};
  const addons=Array.isArray(snap.addons)?snap.addons:[];
  const discount=b.discount_snapshot||{};
  const raw=b.status==="requested" ? (b.quoted_total??snap.total) : (snap.owner_review?.estimated_total??snap.total??b.quoted_total);
  const estimated=raw===null||raw===undefined||raw===""?null:Number(raw);
  const valid=estimated!==null&&Number.isFinite(estimated)&&estimated>=0;
  const finalRaw=snap.owner_review?.final_total??b.quoted_total??snap.total;
  const finalPrice=finalRaw===null||finalRaw===undefined?null:Number(finalRaw);
  const rows=[];
  const base=Number(service.price);
  if(service.price!==null&&service.price!==undefined&&Number.isFinite(base)) rows.push([service.name||b.services?.name||"Service",money(base)]);
  addons.forEach(a=>rows.push([a.name||"Add-on","+"+money(Number(a.price||0))]));
  const discountAmount=Number(discount.discount_amount||0);
  if(discountAmount>0) rows.push([discount.name||langPick("Discount","Descuento","Remise"),"−"+money(discountAmount)]);
  const details=rows.length ? '<details class="booking-price-breakdown"><summary>'+escapeHtml(langPick("View estimate details","Ver detalles del estimado","Voir le détail de l’estimation"))+'</summary><div>'+rows.map(row=>'<div class="booking-price-breakdown-row"><span>'+escapeHtml(row[0])+'</span><strong>'+escapeHtml(row[1])+'</strong></div>').join("")+'</div></details>' : "";
  const price=valid?money(estimated):langPick("Needs review","Por revisar","À vérifier");
  const estimateHtml='<div class="booking-price-estimate"><span>'+escapeHtml(langPick("Estimated total · not final","Total aproximado · no definitivo","Total estimé · non définitif"))+'</span><strong>'+escapeHtml(price)+'</strong></div>';
  if(b.status!=="requested"){
    const amount=finalPrice!==null&&Number.isFinite(finalPrice)?money(finalPrice):"—";
    return '<div class="booking-review-panel">'+estimateHtml+'<div class="booking-price-estimate"><span>'+escapeHtml(langPick("Confirmed price","Precio confirmado","Prix confirmé"))+'</span><strong>'+escapeHtml(amount)+'</strong></div>'+details+'</div>';
  }
  const value=valid?estimated.toFixed(2):"";
  return '<div class="booking-review-panel">'+estimateHtml+details+
    '<label class="booking-final-price-label" for="booking-price-'+escapeHtml(b.id)+'"><span>'+escapeHtml(langPick("Final price (editable)","Precio final (editable)","Prix final (modifiable)"))+'</span>'+
    '<input id="booking-price-'+escapeHtml(b.id)+'" data-booking-final-price="'+escapeHtml(b.id)+'" type="number" inputmode="decimal" min="0" max="1000000" step="0.01" required value="'+escapeHtml(value)+'" placeholder="0.00"></label>'+
    '<small class="booking-price-note">'+escapeHtml(langPick("Adjust before approval. Your final price will be used in the invoice and confirmation email.","Modifícalo antes de aprobar. Este precio final se usará en la factura y confirmación.","Modifiez avant d’approuver. Ce prix final sera utilisé sur la facture et le courriel."))+'</small></div>';
};
})();
