/* Special spaces use a custom quote while the database keeps a valid property subtype. */
(()=>{
  let block=null;
  const dictionary={
    en:["Tell us about your special space","A unique project needs a personalized quote.","Type of space","Large or unusual home","Salon, studio or business","Other residential","Other commercial","Approximate size (optional)","Area unit","Square feet","Square meters","Describe your special cleaning needs","Rooms, surfaces, equipment or priorities the cleaner should know."],
    es:["Cuéntanos sobre este espacio especial","Los proyectos especiales necesitan una cotización personalizada.","Tipo de espacio","Casa grande o poco común","Salón, estudio o negocio","Otro residencial","Otro comercial","Tamaño aproximado (opcional)","Unidad","Pies cuadrados","Metros cuadrados","Describe lo especial de tu limpieza","Áreas, superficies, equipos o prioridades que deba saber el negocio."],
    fr:["Parlez-nous de cet espace spécial","Ce projet nécessite un devis personnalisé.","Type d’espace","Grande maison ou maison particulière","Salon, studio ou entreprise","Autre résidentiel","Autre commercial","Surface approximative (facultatif)","Unité","Pieds carrés","Mètres carrés","Décrivez le nettoyage demandé","Pièces, surfaces et priorités."],
    ht:["Pale nou de espas espesyal ou","Pwojè espesyal sa a bezwen estimasyon pa li.","Kalite espas","Gwo kay oswa kay espesyal","Salon, estidyo oswa biznis","Lòt rezidansyèl","Lòt komèsyal","Gwosè apeprè (si ou konnen)","Inite","Pye kare","Mèt kare","Dekri netwayaj espesyal ou bezwen","Pyès, sifas ak sa ki pi enpòtan."]
  };
  function labels(){
    const lang=String(window.TLE_I18N?.language||"en").toLowerCase();
    return dictionary[lang]||dictionary.en;
  }
  function translate(){
    if(!block)return;
    const words=labels();
    block.querySelectorAll("[data-special-text]").forEach(el=>{
      el.textContent=words[Number(el.dataset.specialText)]||"";
    });
    const text=block.querySelector('[name="special_space_description"]');
    if(text)text.placeholder=words[12];
  }
  function init(){
    if(block)return;
    const switcher=document.getElementById("publicCleaningTypeSwitch");
    const anchor=switcher?.closest(".public-demo-cleaning-type");
    if(!anchor)return;
    block=document.createElement("section");
    block.id="publicSpecialDetails";
    block.className="full public-special-request-details";
    block.hidden=true;
    block.innerHTML=[
      '<header class="public-special-heading"><strong data-special-text="0"></strong><p data-special-text="1"></p></header>',
      '<div class="public-special-fields">',
      '<label class="full"><span data-special-text="2"></span>',
      '<select name="special_space_kind"><option value="large_home" data-special-text="3"></option>',
      '<option value="salon_studio" data-special-text="4"></option>',
      '<option value="other_residential" data-special-text="5"></option>',
      '<option value="other_commercial" data-special-text="6"></option></select></label>',
      '<label><span data-special-text="7"></span>',
      '<input name="special_property_size" type="number" inputmode="numeric" min="1" step="1" placeholder="1500"></label>',
      '<label><span data-special-text="8"></span><select name="special_property_size_unit">',
      '<option value="sqft" data-special-text="9"></option><option value="sqm" data-special-text="10"></option></select></label>',
      '<label class="full"><span data-special-text="11"></span>',
      '<textarea name="special_space_description" maxlength="1800" rows="3"></textarea></label></div>'
    ].join("");
    anchor.insertAdjacentElement("afterend",block);
    translate();
    window.addEventListener("tle:languagechange",translate);
    setVisible(document.getElementById("publicPropertyType")?.value==="special");
  }
  function setVisible(visible){
    if(!block)init();
    if(!block)return;
    block.hidden=!visible;
    for(const key of ["special_space_kind","special_space_description"]){
      const el=block.querySelector('[name="'+key+'"]');
      if(el)el.required=Boolean(visible);
    }
  }
  function backendType(fd){
    if(String(fd.get("property_type")||"")!=="special")return null;
    const kind=String(fd.get("special_space_kind")||"large_home");
    return kind==="salon_studio"||kind==="other_commercial"?"commercial":"residential";
  }
  function note(fd){
    if(String(fd.get("property_type")||"")!=="special")return "";
    const kind=String(fd.get("special_space_kind")||"large_home");
    const description=String(fd.get("special_space_description")||"").trim();
    const size=String(fd.get("special_property_size")||"").trim();
    const unit=String(fd.get("special_property_size_unit")||"sqft");
    const category={
      large_home:"Large / unusual home",salon_studio:"Salon / studio / business",
      other_residential:"Other residential space",other_commercial:"Other commercial space"
    }[kind]||"Special space";
    return ["SPECIAL CLEANING REQUEST — custom quote","Special space category: "+category,
      size?"Special space area: "+size+" "+unit:"",
      description?"Special requirements: "+description:""].filter(Boolean).join("\n");
  }
  window.TLE_SPECIAL_REQUEST={init,setVisible,backendType,note};
})();