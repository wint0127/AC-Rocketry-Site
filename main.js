import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, canvas, fieldOfView, aspectRatio, pixelRatio, nearPlane, farPlane, renderer, rocket, HEIGHT, WIDTH, DIVIDEAMOUNT;

// makes the scene
const createScene = () => {

  pixelRatio = window.devicePixelRatio;
  HEIGHT = window.innerHeight * pixelRatio | 0;
  WIDTH = window.innerWidth * pixelRatio | 0;
  DIVIDEAMOUNT = 1.5;
  scene = new THREE.Scene();
  //const axisHelper = new THREE.AxesHelper(50);
  canvas = document.querySelector('#rocket-view-container');
  aspectRatio = WIDTH / (HEIGHT/DIVIDEAMOUNT);
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  //scene.add(axisHelper)
  // Defining the camera
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Defining the renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas
  });

  // Defining the loader
  const loader = new GLTFLoader();
  loader.load( "models/rocket.glb",
    (gltf) => {
      rocket = gltf.scene;
      rocket.position.x = 0;
      rocket.position.y = 55;
      rocket.position.z = -290;
  
      rocket.rotation.y = 55;
      rocket.rotation.z = -1.58;
      //rocket.position.x = -85;
      //rocket.position.y = -15;
      //rocket.position.z = 50;
      scene.add(rocket);
    }
  );

  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = -5;

  scene.fog = new THREE.Fog(0xffffff, 10, 1200);
  //scene.background = new THREE.Color(0xff0000)
  renderer.setSize(WIDTH, (HEIGHT/DIVIDEAMOUNT));
  renderer.shadowMap.enabled = true;

  window.addEventListener("resize", handleWindowResize, false); // on resize

};

// Handles what happens when the window resizes
const handleWindowResize = () => {
 // HEIGHT = document.getElementById('rocket-view-container').clientHeight
  //WIDTH = document.getElementById('rocket-view-container').clientWidth
  pixelRatio = window.devicePixelRatio;
  HEIGHT = window.innerHeight * pixelRatio | 0;
  WIDTH = window.innerWidth * pixelRatio | 0;

  console.log(HEIGHT)
  console.log(WIDTH)

  if (WIDTH > 401 && WIDTH < 960) {
    console.log("tablet mode")
  }

  rocket.updateMatrix()
  
  renderer.setSize(WIDTH, (HEIGHT/DIVIDEAMOUNT));
  camera.aspect = WIDTH / (HEIGHT/DIVIDEAMOUNT);
  camera.updateProjectionMatrix();
};

// Creates lights
const createLights = () => {
  const ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
  const pointLight = new THREE.PointLight(0xffffff, 2, 2000, 3);

  directionalLight.position.set(-100, 100, 600);
  pointLight.position.set(200, -100, 50);

  scene.add(ambientLight, directionalLight, pointLight);
};

const targetRocketPosition = 10;
const animationDuration = 2000;

// Loop 
const loop = () => {
  const t = (Date.now() % animationDuration) / animationDuration;
  renderer.render(scene, camera);
  const delta = targetRocketPosition * Math.sin(Math.PI * 2 * t);
  if (rocket) {
    rocket.rotation.y += 0.007;

    //rocket.rotation.x += 0.007;

    //rocket.rotation.z += 0.1;
    //rocket.position.y = delta;
  }

  requestAnimationFrame(loop);

};

const main = () => {
  createScene();
  createLights();
  renderer.render(scene, camera);
  loop();
};

main();
