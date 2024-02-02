import * as THREE from "three"
import * as dat from "lil-gui"
import {OrbitControls} from "OrbitControls"

/***********
 ** SETUP **
 ***********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
}

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('purple')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)

camera.position.set(2,2,4)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas
    }
)
renderer.setSize(sizes.width, sizes.height)
renderer.localClippingEnabled = true

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/
// Clipping Plane
const clippingPlane = new THREE.Plane(new THREE.Vector3(0,1,0),0)
// plane
const planeGeometry = new THREE.PlaneGeometry(10,10,50,50)
const planeMaterial = new THREE.MeshBasicMaterial(
    {
        color: new THREE.Color('orange'),
        side: THREE.DoubleSide,
        wireframe: true
    }
)
const plane = new THREE.Mesh(planeGeometry,planeMaterial)

plane.rotation.x = Math.PI * 0.5
scene.add(plane)

// testSphere
const geometry = new THREE.SphereGeometry(1)
const material = new THREE.MeshNormalMaterial(
    {
        clippingPlanes: [clippingPlane]
    }
)
const testSphere = new THREE.Mesh(geometry,material)

scene.add(testSphere)

/********
 ** UI **
 ********/
const ui = new dat.GUI()

// UI Object
const uiObject = {}
uiObject.play = false
uiObject.speed= 0.5
uiObject.distance = 2

uiObject.reset = () =>{
    uiObject.speed= 0.5
    uiObject.distance = 2
}
// Plane UI
const planeFOlder = ui.addFolder('Plane')

planeFOlder.add(planeMaterial, 'wireframe')

// Shpere UI
const sphereFolder = ui.addFolder('Sphere')

sphereFolder
    .add(testSphere.position,'y')
    .min(-5)
    .max(5)
    .step(0.1)
    .name('Height')
    .listen()

sphereFolder
    .add(uiObject,'play')
    .name('Animate Sphere')

sphereFolder
    .add(uiObject, 'speed')
    .min(0)
    .max(5)
    .step(0.1)
    .name('speed')
    .listen()

sphereFolder
    .add(uiObject, 'distance')
    .min(0)
    .max(5)
    .step(1)
    .name('distance')
    .listen()

planeFOlder
    .add(renderer, 'localClippingEnabled')
    .name('Clipping')

sphereFolder
    .add(uiObject, 'reset')
    .name('reset')

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

 // Animation
 const animation = () =>
 {
    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate Sphere
    if(uiObject.play)
    {
        testSphere.position.y = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance
    }

    // Controls
    controls.update()

    // Renderer
    renderer.render(scene,camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

 animation()
