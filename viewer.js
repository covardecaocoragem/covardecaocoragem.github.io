
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TGALoader } from "three/addons/loaders/TGALoader.js";

export function mount(box, url) {
  box.innerHTML =
    '<span style="color:#8d8d8d">Loading model…</span>';

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40, 1, 0.1, 1000
  );

  scene.add(
    new THREE.HemisphereLight(0xffffff, 0x2a1840, 1.8)
  );

  const light = new THREE.DirectionalLight(0xffffff, 2.4);
  light.position.set(3, 5, 4);
  scene.add(light);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;

  const resize = () => {
    const w = box.clientWidth;
    const h = box.clientHeight;

    if (!w || !h) return;

    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  new ResizeObserver(resize).observe(box);

  const extension = url.split(".").pop().toLowerCase();

  const manager = new THREE.LoadingManager();
  manager.addHandler(/\.tga$/i, new TGALoader(manager));

  const loader = extension === "fbx"
    ? new FBXLoader(manager)
    : new GLTFLoader();

  loader.load(
    url,

    (loaded) => {
      const model = loaded.scene || loaded;

      // Keep the loaded meshes and materials unchanged.
      model.traverse((object) => {
        if (object.isMesh) {
          object.frustumCulled = false;
        }
      });

      scene.add(model);

      // Centre and scale the model to fit the viewer.
      model.updateMatrixWorld(true);

      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const centre = bounds.getCenter(new THREE.Vector3());

      model.position.sub(centre);

      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDimension;

      model.scale.multiplyScalar(scale);
      model.position.multiplyScalar(scale);

      const resetCamera = () => {
        camera.position.set(1.6, 0.9, 2.6);
        controls.target.set(0, 0, 0);
        controls.update();
      };

      resetCamera();

      box.innerHTML = "";
      box.append(renderer.domElement);

      resize();

      box.insertAdjacentHTML(
        "beforeend",
        '<div class="tools">' +
          '<button class="on" data-a="rot">Auto-rotate</button>' +
          '<button data-a="wire">Wireframe</button>' +
          '<button data-a="reset">Reset</button>' +
        '</div>' +
        '<div class="hint">drag to rotate · scroll to zoom</div>'
      );

      let wireframe = false;

      box.querySelector(".tools").onclick = (event) => {
        const action = event.target.dataset.a;
        if (!action) return;

        if (action === "rot") {
          controls.autoRotate = !controls.autoRotate;
          event.target.classList.toggle("on");
        }

        if (action === "wire") {
          wireframe = !wireframe;
          event.target.classList.toggle("on");

          model.traverse((object) => {
            if (!object.isMesh) return;

            [].concat(object.material).forEach((material) => {
              material.wireframe = wireframe;
            });
          });
        }

        if (action === "reset") {
          resetCamera();
        }
      };

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }

      animate();
    },

    undefined,

    (error) => {
      console.error("[viewer] Model loading failed:", error);

      box.innerHTML =
        `<span style="color:#c084fc;padding:20px;text-align:center">
          Couldn’t load ${url}. Check the model file and path.
        </span>`;
    }
  );
}
