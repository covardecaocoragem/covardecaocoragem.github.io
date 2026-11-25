const A=document.getElementById("app"),TYPES={game:"Games",model:"3D models",asset:"2D assets"};
const page=document.body.dataset.page;
function chrome(){
 const L=[["./","Home","home"],["projects.html","Projects","projects"],["about.html","About","about"]];
 document.body.insertAdjacentHTML("afterbegin",`<nav><div class="wrap"><a class="logo" href="./">${SITE.name}</a>${L.map(([h,t,p])=>`<a class="l ${page==p||(page=="item"&&p=="projects")?"on":""}" href="${h}">${t}</a>`).join("")}</div></nav>`);
 document.body.insertAdjacentHTML("beforeend",`<footer><div class="wrap">© ${new Date().getFullYear()} ${SITE.name} · ${SITE.links.map(l=>`<a href="${l.url}">${l.label}</a>`).join(" · ")}</div></footer>`);
}
const card=i=>`<a class="card" href="item.html?id=${i.id}"><div class="cov">${i.title[0]}${i.cover?`<img loading="lazy" src="${i.cover}" alt="" onerror="this.remove()">`:""}</div><h3>${i.title}</h3><p class="d">${i.desc||""}</p><div class="m">${i.tag||""}</div>${i.webbuild?'<span class="b">Play in browser</span>':""}</a>`;
const section=(n,l,c="")=>`<div class="sh"><h2>${n}</h2><span><button aria-label="Scroll left" data-d="-1">‹</button> <button aria-label="Scroll right" data-d="1">›</button></span></div><div class="row ${c}">${l.map(card).join("")}</div>`;
const ofType=t=>ITEMS.filter(x=>x.type==t);
const cta=i=>i.type=="game"?(i.webbuild?"Play in browser":"View game"):i.type=="model"?"View in 3D":"View assets";
const pan=i=>{const im=i.hero||i.cover;return `<section class="pan"><div class="bg">${i.title[0]}${im?`<img src="${im}" alt="" loading="lazy" onerror="this.remove()">`:""}</div><div class="tx"><div class="m">${TYPES[i.type]}${i.tag?" / "+i.tag:""}</div><h2>${i.title}</h2><p>${i.desc||""}</p><a class="btn" href="item.html?id=${i.id}">${cta(i)}</a></div></section>`};

function home(){
 document.documentElement.classList.add("snap");A.classList.add("full");
 const all=[...ITEMS.filter(x=>x.featured),...ITEMS.filter(x=>!x.featured)];
 A.innerHTML=`<section class="pan top"><div class="hero">${SITE.banner?`<img src="${SITE.banner}" alt="${SITE.name}">`:`<h1>zambal<b>dev</b></h1>`}<p>${SITE.tagline}. Scroll down to see my projects.</p></div></section>`+all.map(pan).join("");
}
function projects(){
 A.innerHTML=`<h1 class="t">Projects</h1>`+Object.entries(TYPES).map(([t,n])=>ofType(t).length?section(n,ofType(t)):"").join("");
}
function about(){
 A.innerHTML=`<h1 class="t">About</h1><div class="prose">${SITE.about.map(p=>`<p>${p}</p>`).join("")}</div><h2 class="sh">Tools</h2><div class="chips">${SITE.skills.map(s=>`<span class="b">${s}</span>`).join("")}</div><h2 class="sh">Find me</h2>${SITE.links.map(l=>`<a class="btn" href="${l.url}">${l.label}</a>`).join("")}`;
}
function item(){
 const i=ITEMS.find(x=>x.id==new URLSearchParams(location.search).get("id"));
 if(!i){A.innerHTML='<p>Project not found. <a href="projects.html">Back to projects</a></p>';return}
 document.title=`${i.title} — ${SITE.name}`;
 let v="";
 if(i.type=="model")v+=`<div class="view" id="v3d"></div>`;
 if(i.video)v+=`<h2 class="sh">Video</h2><div class="view">${i.video.startsWith("youtube:")?`<iframe src="https://www.youtube.com/embed/${i.video.slice(8)}" allowfullscreen></iframe>`:`<video src="${i.video}" controls></video>`}</div>`;
 if(i.webbuild)v+=`<h2 class="sh">Play</h2><div class="view" id="play" style="aspect-ratio:${i.ratio||"16/9"}"><button class="btn" id="go">Play in browser</button></div>`;
 A.innerHTML=`<h1 class="t">${i.title}</h1><div class="m" style="color:var(--dim)">${TYPES[i.type]}${i.tag?" / "+i.tag:""}</div>${(i.links||[]).map(l=>`<a class="btn" href="${l.url}">${l.label}</a>`).join("")}${v}${i.about?`<p class="prose">${i.about}</p>`:""}${i.images?.length?`<h2 class="sh">${i.type=="model"?"Renders":"Gallery"}</h2><div class="gal">${i.images.map(s=>`<img loading="lazy" src="${s}" alt="">`).join("")}</div>`:""}`;
 if(i.type=="model")import("./viewer.js?v=4").then(m=>m.mount(document.getElementById("v3d"),i.model,i));
 const go=document.getElementById("go");
 if(go)go.onclick=()=>{document.getElementById("play").innerHTML=`<iframe src="${i.webbuild}" allowfullscreen allow="fullscreen;autoplay"></iframe>`};
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-d]");
 if(b){const r=b.closest(".sh").nextElementSibling;r.scrollBy({left:b.dataset.d*r.clientWidth*.8,behavior:"smooth"})}
 const g=e.target.closest(".gal img");
 if(g){const l=document.createElement("div");l.className="lb";l.innerHTML=`<img src="${g.src}" alt="">`;l.onclick=()=>l.remove();document.body.append(l)}
});
chrome();({home,projects,about,item})[page]();
