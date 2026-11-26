
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TGALoader } from "three/addons/loaders/TGALoader.js";

export function mount(box, url) {
  box.innerHTML = '<span style="color:#8d8d8d">Loading model…</span>';

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100000);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1840, 1.8));

  const light = new THREE.DirectionalLight(0xffffff, 2.4);
  light.position.set(3, 5, 4);
  scene.add(light);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;

  let model;
  let modelRadius = 1;

  function fitCamera() {
    if (!model) return;

    const aspect = camera.aspect || 1;
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(
      Math.tan(verticalFov / 2) * aspect
    );

    const limitingFov = Math.min(verticalFov, horizontalFov);

    // Extra space around the model so it doesn't start zoomed in.
    const distance =
      (modelRadius / Math.sin(limitingFov / 2)) * 1.35;

    const direction = new THREE.Vector3(1, 0.45, 1).normalize();

    camera.position.copy(direction.multiplyScalar(distance));
    camera.near = Math.max(modelRadius / 1000, 0.001);
    camera.far = modelRadius * 100;
    camera.updateProjectionMatrix();

    controls.target.set(0, 0, 0);
    controls.minDistance = modelRadius * 0.15;
    controls.maxDistance = modelRadius * 10;
    controls.update();
  }

  function resize() {
    const width = box.clientWidth;
    const height = box.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (model) fitCamera();
  }

  new ResizeObserver(resize).observe(box);

  const manager = new THREE.LoadingManager();
  manager.addHandler(/\.tga$/i, new TGALoader(manager));

  const extension = url.split(".").pop().toLowerCase();
  const loader = extension === "fbx"
    ? new FBXLoader(manager)
    : new GLTFLoader();

  loader.load(
    url,
    (loaded) => {
      model = loaded.scene || loaded;
      scene.add(model);

      // Do not modify the FBX materials or their transparency settings.
      model.traverse((object) => {
        if (!object.isMesh) return;

        object.frustumCulled = false;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          if (!material) return;

          console.log("[viewer] mesh:", object.name);
          console.log("[viewer] material:", material.name, {
            type: material.type,
            map: !!material.map,
            alphaMap: !!material.alphaMap,
            transparent: material.transparent,
            opacity: material.opacity,
            alphaTest: material.alphaTest
          });
        });
      });

      model.updateMatrixWorld(true);

      // Centre the model without changing its original scale.
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());

      model.position.sub(center);
      model.updateMatrixWorld(true);

      const centeredBounds = new THREE.Box3().setFromObject(model);
      const sphere = centeredBounds.getBoundingSphere(
        new THREE.Sphere()
      );

      modelRadius = Math.max(sphere.radius, 0.01);

      box.innerHTML = "";
      box.append(renderer.domElement);

      resize();
      fitCamera();

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

            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            materials.forEach((material) => {
              if (material) material.wireframe = wireframe;
            });
          });
        }

        if (action === "reset") {
          fitCamera();
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
      console.error("[viewer] model loading error:", error);
      box.innerHTML =
        '<span style="color:#c084fc;padding:20px">' +
        'Couldn’t load the model. Check the model file path.' +
        '</span>';
    }
  );
}
