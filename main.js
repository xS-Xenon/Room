import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

// Fog
scene.fog = new THREE.Fog(0xcccccc, 10, 15);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pinLight1 = new THREE.PointLight(0xff0000, 70, 100, 1.25);
pinLight1.position.set(0, -3, 0);
scene.add(pinLight1);

const pinLight2 = new THREE.PointLight(0xff0000, 70, 100, 1.25);
pinLight2.position.set(3, 3, 0);
scene.add(pinLight2);

const pinLight3 = new THREE.PointLight(0xff0000, 70, 100, 1.25);
pinLight3.position.set(-3, 3, 0);
scene.add(pinLight3);

const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(0, 10, 10);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;

// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

// Load GLB model
const loader = new GLTFLoader();
loader.load(
  "/free_cyberpunk_hovercar.glb",
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x4169e1,
          metalness: 1,
          roughness: 0.4,
          map: child.material.map,
        });
      }
    });

    model.position.set(0, 0, 0);
    // model.rotateOnAxis(new THREE.Vector3(0.5, 0, 0), 1);
    model.scale.set(1, 1, 1);

    const t1 = gsap.timeline({ defaults: { duration: 1 } });
    t1.fromTo(model.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
    t1.from("nav", { y: "-100%" }, { y: "0%" });
    t1.fromTo(".title", { opacity: 0 }, { opacity: 1 });
  },
  undefined,
  (error) => {
    console.error("An error occurred while loading the model:", error);
  }
);
