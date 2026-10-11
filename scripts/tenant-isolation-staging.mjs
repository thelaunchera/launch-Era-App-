// Read-only cross-tenant QA. Explicit staging credentials required.
const required=[
  "TLE_QA_SUPABASE_URL","TLE_QA_ANON_KEY",
  "TLE_QA_OWNER_A_EMAIL","TLE_QA_OWNER_A_PASSWORD","TLE_QA_BUSINESS_A_ID",
  "TLE_QA_OWNER_B_EMAIL","TLE_QA_OWNER_B_PASSWORD","TLE_QA_BUSINESS_B_ID"
];
const missing=required.filter(name=>!process.env[name]);
if(missing.length){
  console.error("STAGING_QA_NOT_READY: missing required settings: "+missing.join(", "));
  process.exit(2);
}
if(process.env.TLE_QA_NON_PRODUCTION!=="CONFIRMED_STAGING"){
  console.error("STAGING_ONLY: requires TLE_QA_NON_PRODUCTION=CONFIRMED_STAGING");
  process.exit(2);
}
const base=new URL(process.env.TLE_QA_SUPABASE_URL);
if(base.protocol!=="https:" || !/^[a-z0-9-]+\.supabase\.co$/.test(base.hostname) ||
  base.hostname==="bowacxhmjvrqixtwaikv.supabase.co"){
  console.error("STAGING_ONLY: URL must be a separate non-production Supabase project");
  process.exit(2);
}
const key=process.env.TLE_QA_ANON_KEY;
const businesses=[
  {name:"A",email:process.env.TLE_QA_OWNER_A_EMAIL,password:process.env.TLE_QA_OWNER_A_PASSWORD,id:process.env.TLE_QA_BUSINESS_A_ID},
  {name:"B",email:process.env.TLE_QA_OWNER_B_EMAIL,password:process.env.TLE_QA_OWNER_B_PASSWORD,id:process.env.TLE_QA_BUSINESS_B_ID}
];
if(businesses[0].id===businesses[1].id || businesses[0].email===businesses[1].email){
  throw new Error("STAGING_ONLY: businesses and owners must be distinct");
}
if(businesses.some(b=>!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(b.id))){
  throw new Error("STAGING_ONLY: each business needs a valid UUID");
}
async function login(actor){
  const url=new URL("/auth/v1/token",base);
  url.searchParams.set("grant_type","password");
  const response=await fetch(url,{method:"POST",headers:{"apikey":key,"Content-Type":"application/json"},body:JSON.stringify({email:actor.email,password:actor.password})});
  if(!response.ok) throw new Error("Unable to authenticate owner "+actor.name+" in staging (HTTP "+response.status+")");
  const data=await response.json();
  if(!data.access_token) throw new Error("No access token for owner "+actor.name);
  return data.access_token;
}
async function select(token,table,column,value){
  const url=new URL("/rest/v1/"+table,base);
  url.searchParams.set("select",table==="businesses"?"id":"id,business_id");
  url.searchParams.set(column,"eq."+value);
  url.searchParams.set("limit","1");
  const response=await fetch(url,{headers:{"apikey":key,"Authorization":"Bearer "+token,"Accept":"application/json"}});
  if(!response.ok) throw new Error("Read-only staging query failed for "+table+" (HTTP "+response.status+")");
  const data=await response.json();
  if(!Array.isArray(data))throw new Error("Unexpected result format for "+table);
  return data;
}
const [a,b]=await Promise.all(businesses.map(login));
const token={A:a,B:b};
const tables=["clients","jobs","quotes","invoices","services"];
let passed=0;
for(const current of businesses){
  const other=businesses.find(x=>x.name!==current.name);
  const visible=await select(token[current.name],"businesses","id",current.id);
  const hidden=await select(token[current.name],"businesses","id",other.id);
  if(visible.length!==1||hidden.length!==0)throw new Error("Tenant isolation failed for business identity "+current.name);
  console.log("PASS: owner "+current.name+" can access own business but not the other business");
  passed++;
  for(const table of tables){
    const own=await select(token[current.name],table,"business_id",current.id);
    if(own.length!==1)throw new Error("Missing staged "+table+" fixture for business "+current.name+"; test is not meaningful without data");
    const leaked=await select(token[current.name],table,"business_id",other.id);
    if(leaked.length)throw new Error("CROSS-TENANT DATA LEAK: "+table+" visible to owner "+current.name);
    console.log("PASS: "+current.name+" can read own "+table+" fixture but not "+other.name+"'s");
    passed++;
  }
}
console.log("STAGING_ISOLATION_OK: "+passed+" tenant/collection checks, no writes.");
