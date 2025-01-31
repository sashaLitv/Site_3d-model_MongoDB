import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { showPreloader, hidePreloader } from './use_preloader.js';

const container = document.getElementById("model-container");

const scene = new THREE.Scene();
const camera = createCamera();
const renderer = createRenderer();

addLighting();
addFloor();

let model;
let chair;
let isChairMoved;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const loader = new GLTFLoader();

showPreloader();
loadModel(loader);
setupEventListeners();
setTimeout(hidePreloader, 2000);



// Функція для створення камери
function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        50, 
        window.innerWidth / window.innerHeight, 
        0.01, 
        1000 
    );
    camera.position.set(-18, 19, 30);
    camera.rotation.set(-Math.PI / 180 * 32, -Math.PI / 180 * 27, -Math.PI / 180 * 18);
    return camera;
}

// Функція для створення рендерера
function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    return renderer;
}

// Функція для налаштування освітлення
function addLighting() {
    const ambientLight = new THREE.AmbientLight(0xE0F7FF, 1.0);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xE0F7FF, 1.5, 0, 0.6, 0, 2);
    spotLight.position.set(1, 20, 16);
    spotLight.castShadow = true;
    scene.add(spotLight);
}

// Функція для додавання підлоги
function addFloor() {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);
}

// Функція для завантаження 3D моделі
function loadModel(loader) {
    loader.load("../3d_models/wooden_writing_desk/scene.gltf", function (gltf) {
        model = gltf.scene;
        model.scale.set(10, 10, 10);
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.material.emissive.set(0xC5BEFF); 
                child.material.emissiveIntensity = 0.04; 
            }
        });

        scene.add(model);
    }, undefined, function (error) {
        console.error("Помилка завантаження моделі:", error);
    });
}

// Функція для налаштування обробників подій
function setupEventListeners() {
    let isDragging = false;
    let previousMouseX = 0;

    container.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMouseX = event.clientX;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - previousMouseX;
            model.rotation.y += deltaX * 0.01;
            previousMouseX = event.clientX;
        }
    });

    container.addEventListener("click", (event) => {
        if (isChairMoved) {
            return;
        }
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(model, true);

        if(intersects.length > 0){
            const clickedObject = intersects[0].object;

            if(clickedObject.parent.name.includes("Chair_11") || clickedObject.parent.name.includes("Table_17")) {
                chair = clickedObject;
                moveChairAndCamera();
            }
        }
    });
}

// Функція для анімації переміщення стільця та камери
function moveChairAndCamera() {
    let chairStartPosition = chair.position.clone(); 
    let chairTargetPosition = chairStartPosition.clone().add(new THREE.Vector3(-0.2, 0, 0.5)); 

    let cameraStartPosition = camera.position.clone(); 
    let cameraTargetPosition = cameraStartPosition.clone().add(new THREE.Vector3(6, 3, -11)); 

    let cameraLookAtTarget = new THREE.Vector3(0, 0, 0); 

    let duration = 900; 
    let startTime = performance.now();  


    function animate() {
        let elapsed = performance.now() - startTime;
        let progress = Math.min(elapsed / duration, 1);  

        chair.position.x = THREE.MathUtils.lerp(chairStartPosition.x, chairTargetPosition.x, progress);  
        chair.position.y = THREE.MathUtils.lerp(chairStartPosition.y, chairTargetPosition.y, progress);  
        chair.position.z = THREE.MathUtils.lerp(chairStartPosition.z, chairTargetPosition.z, progress);  

        camera.position.x = THREE.MathUtils.lerp(cameraStartPosition.x, cameraTargetPosition.x, progress);  
        camera.position.y = THREE.MathUtils.lerp(cameraStartPosition.y, cameraTargetPosition.y, progress);  
        camera.position.z = THREE.MathUtils.lerp(cameraStartPosition.z, cameraTargetPosition.z, progress);  

        camera.lookAt(cameraLookAtTarget);  

        renderer.render(scene, camera);  

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            setTimeout(() => {
                window.location.href = "../html/planning-page.html"; 
            }, 500);
        }
    }
    animate();
    isChairMoved = true;
}

// Основна анімація
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();