import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
export function mount(box,url){
 box.innerHTML='<span style="color:#8d8d8d">Loading model…</span>';
 const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
 const s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,1000);
 s.add(new THREE.HemisphereLight(0xffffff,0x2a1840,1.8));
 const d=new THREE.DirectionalLight(0xffffff,2.4);d.position.set(3,5,4);s.add(d);
 const c=new OrbitControls(cam,r.domElement);c.enableDamping=true;c.autoRotate=true;c.autoRotateSpeed=2;
 const size=()=>{const w=box.clientWidth,h=box.clientHeight;if(w&&h){r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}};
 new ResizeObserver(size).observe(box);
 const ext=url.split(".").pop().toLowerCase();
 (ext=="fbx"?new FBXLoader():new GLTFLoader()).load(url,g=>{
  const m=g.scene||g;s.add(m);
  m.traverse(o=>{if(!o.isMesh)return;o.frustumCulled=false;[].concat(o.material).forEach(x=>{if(!x)return;if(x.map){x.map.colorSpace=THREE.SRGBColorSpace;x.alphaTest=.5;if(x.transparent){x.transparent=false;x.depthWrite=true}}x.needsUpdate=true})});
  m.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(m,true),sz=bb.getSize(new THREE.Vector3()).length();
  m.position.sub(bb.getCenter(new THREE.Vector3()));          // centre at origin
  const k=3/sz;m.scale.multiplyScalar(k);m.position.multiplyScalar(k); // auto-fit: any export scale works
  const home=()=>{cam.position.set(1.6,.9,2.6);c.target.set(0,0,0);c.update()};home();
  box.innerHTML="";box.append(r.domElement);size();
  box.insertAdjacentHTML("beforeend",'<div class="tools"><button class="on" data-a="rot">Auto-rotate</button><button data-a="wire">Wireframe</button><button data-a="reset">Reset</button></div><div class="hint">drag to rotate · scroll to zoom</div>');
  let wire=false;
  box.querySelector(".tools").onclick=e=>{const a=e.target.dataset.a;if(!a)return;
   if(a=="rot"){c.autoRotate=!c.autoRotate;e.target.classList.toggle("on")}
   if(a=="wire"){wire=!wire;e.target.classList.toggle("on");m.traverse(o=>{if(o.isMesh)[].concat(o.material).forEach(x=>x.wireframe=wire)})}
   if(a=="reset")home()};
  (function loop(){requestAnimationFrame(loop);c.update();r.render(s,cam)})();
 },undefined,()=>{box.innerHTML=`<span style="color:#c084fc;padding:20px;text-align:center">Couldn’t load ${url}.<br>Check the file exists in assets/models/ and the path in data.js matches.</span>`});
}