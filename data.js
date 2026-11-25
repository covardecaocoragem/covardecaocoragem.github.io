/* ===== EDIT THIS FILE — it is the only file you need to touch to add content =====
   Add a project = copy one object in ITEMS, change the fields. Every page updates by itself.
   type: "game" | "model" | "asset"
   id:   unique, no spaces (used in the URL: item.html?id=hearth)
   cover: image shown on cards, e.g. "assets/img/hearth.png"
   images: extra screenshots / renders shown as a gallery (click = fullscreen)
   links: any buttons, e.g. {label:"Itch.io",url:"..."}
   hero: optional wide image (16:9, e.g. 1920x1080) for the full-screen Home panel; falls back to cover
   featured: true = shown first on Home
   game  extras: video ("youtube:VIDEO_ID" or "assets/img/trailer.mp4"), webbuild ("assets/builds/hearth/index.html"), ratio ("16/9")
   model extras: model ("assets/models/sumo.fbx" or .glb)  */
const SITE={
  name:"zambaldev",
  banner:"assets/img/banner.png",
  tagline:"Unity game developer (C#) — Bristol",
  links:[{label:"itch.io",url:"https://zambaldev.itch.io/"},{label:"GitHub",url:"https://github.com/covardecaocoragem"},{label:"YouTube",url:"https://www.youtube.com/@SEUCANAL"},{label:"Email",url:"mailto:ukfelipelopes@gmail.com"}],
  about:["I’m a game development student focused on building clean, playable Unity prototypes.","I enjoy gameplay systems and polishing the feel of controls. I also model and animate my own characters."],
  skills:["Unity","C#","Blender","Gameplay systems","UI","3D modelling"]
};
const ITEMS=[
 {id:"hearth",type:"game",title:"Hearth",tag:"Survival",desc:"Keep the fire going, survive",cover:"assets/img/hearth.png",featured:true,
  video:"",webbuild:"assets/builds/hearth/index.html",ratio:"16/9",
  about:"Longer description: what the game is, what you built (systems, UI, controls) and what you learned.",
  images:[],links:[{label:"Play on itch.io",url:"https://zambaldev.itch.io/"},{label:"Code",url:"https://github.com/covardecaocoragem"}]},
 {id:"teocalli",type:"game",title:"Teocalli",tag:"Puzzle",desc:"A puzzle game.",cover:"assets/img/teocalli.png",video:"youtube:VIDEO_ID",about:"",images:[],links:[]},
 {id:"patient-n",type:"game",title:"Patient N",tag:"Platformer",desc:"A first-time project.",cover:"assets/img/patient-n.png",featured:true,webbuild:"assets/builds/patient-n/index.html",about:"",images:[],links:[]},
 {id:"shinobaby",type:"game",title:"Shinobaby",tag:"Action",desc:"Baby shinobi fighting.",cover:"assets/img/shinobaby.png",about:"",images:[],links:[]},
 {id:"onion-boy",type:"game",title:"Onion Boy Experience",tag:"Platformer",desc:"Onion Boy.",cover:"assets/img/onion-boy.png",about:"",images:[],links:[]},
 {id:"sumo",type:"model",title:"Sumo fighter 3D model",tag:"Character",desc:"My second character.",cover:"assets/img/sumo.png",featured:true,model:"assets/models/sumo.fbx", roughness:0.6, about:"Modelled in Blender. Drag to rotate, scroll to zoom.",images:[],links:[]},
 {id:"baby-samurai",type:"model",title:"Baby Samurai",tag:"Character",desc:"My first ever 3D character.",cover:"assets/img/baby-samurai.png",model:"assets/models/baby-samurai.fbx",about:"",images:[],links:[]},
 {id:"ui-icons",type:"asset",title:"Example 2D asset pack",tag:"Icons",desc:"Sprites, icons or textures.",cover:"assets/img/icons-cover.png",about:"Describe the pack.",images:["assets/img/icons-1.png","assets/img/icons-2.png"],links:[{label:"Download",url:"#"}]}
];
