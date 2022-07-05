import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { PointLightHelper } from "three";

//Loading
const textureLoader = new THREE.TextureLoader();
const golfNormalTexture = textureLoader.load("/textures/NormalMap.png");
const concreteNormalTexture = textureLoader.load(
  "/textures/concreteNormal.jpg"
);
const concreteHeight = textureLoader.load("/textures/concreteHeight.png");
const cubeTexture = textureLoader.load("/textures/gemTexture.jpg", () => {
  cubeTexture.wrapS = cubeTexture.wrapT = THREE.RepeatWrapping;
  cubeTexture.offset.set(0, 0);
  cubeTexture.repeat.set(2, 2);
});
const cubeNormal = textureLoader.load("/textures/gemNormal.jpg", () => {
  cubeNormal.wrapS = cubeNormal.wrapT = THREE.RepeatWrapping;
  cubeNormal.offset.set(0, 0);
  cubeNormal.repeat.set(2, 2);
});
const cubeHeight = textureLoader.load("/textures/gemHeight.jpg", () => {
  cubeHeight.wrapS = cubeHeight.wrapT = THREE.RepeatWrapping;
  cubeHeight.offset.set(0, 0);
  cubeHeight.repeat.set(2, 2);
});

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const golfGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const concreteGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// Materials

const golfMaterial = new THREE.MeshStandardMaterial(); //golf ball sphere
golfMaterial.metalness = 0.7;
golfMaterial.roughness = 0.09;
golfMaterial.normalMap = golfNormalTexture;
golfMaterial.color = new THREE.Color(0xffffff);

const concreteMaterial = new THREE.MeshStandardMaterial(); //concrete looking sphere
concreteMaterial.metalness = 0;
concreteMaterial.roughness = 1;
concreteMaterial.normalMap = concreteNormalTexture;
concreteMaterial.displacementMap = concreteHeight;
concreteMaterial.color = new THREE.Color(0x666666);

const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
cubeMaterial.map = cubeTexture;
cubeMaterial.normalMap = cubeNormal;
cubeMaterial.displacementMap = concreteHeight;

// Mesh
const golfSphere = new THREE.Mesh(golfGeometry, golfMaterial);

scene.add(golfSphere);
golfSphere.position.x = 1.6;
golfSphere.position.y = 0;
const concreteSphere = new THREE.Mesh(concreteGeometry, concreteMaterial);
scene.add(concreteSphere);
concreteSphere.position.y = -3;
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

gui.add(concreteMaterial, "roughness");
gui.add(concreteMaterial, "metalness");
// Lights

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x00ffff, 1.5);
pointLight2.position.set(-3.2, 1.8, -2.1);
pointLight2.intensity = 0.2;
scene.add(pointLight2);

gui.add(pointLight2.position, "x");
gui.add(pointLight2.position, "y");
gui.add(pointLight2.position, "z");
gui.add(pointLight2, "intensity");

const pointLight3 = new THREE.PointLight(0xff0000, 1);
pointLight3.position.set(5.6, -1.6, -5.2);
pointLight3.intensity = 0.4;
scene.add(pointLight3);

// gui.add(pointLight3.position, "x");
// gui.add(pointLight3.position, "y");
// gui.add(pointLight3.position, "z");
// gui.add(pointLight3, "intensity");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 8;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

const onDocumentMouseMove = (event) => {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
};

const updateSphere = (event) => {
  golfSphere.position.y = window.scrollY * 0.001;
};

document.addEventListener("mousemove", onDocumentMouseMove);
window.addEventListener("scroll", updateSphere);

const clock = new THREE.Clock();

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  golfSphere.rotation.y = 0.5 * elapsedTime;

  golfSphere.rotation.y += 0.5 * (targetX - golfSphere.rotation.y);
  golfSphere.rotation.x += 0.05 * (targetY - golfSphere.rotation.x);
  golfSphere.position.z += -0.05 * (targetY - golfSphere.rotation.x);

  concreteSphere.rotation.y = 0.5 * elapsedTime;

  concreteSphere.rotation.y += 0.5 * (targetX - concreteSphere.rotation.y);
  concreteSphere.rotation.x += 0.05 * (targetY - concreteSphere.rotation.x);
  concreteSphere.position.z += -0.05 * (targetY - concreteSphere.rotation.x);

  cube.rotation.y = 0.5 * elapsedTime;

  cube.rotation.y += 0.5 * (targetX - cube.rotation.y);
  cube.rotation.x += 0.05 * (targetY - cube.rotation.x);
  cube.position.z += -0.05 * (targetY - cube.rotation.x);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
