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
scene.background = new THREE.Color('black')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)

camera.position.set(7,4,13)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        antialieas: true
    }
)
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/

 const caveMaterial = new THREE.MeshStandardMaterial(
    {
        color: new THREE.Color('white'),
        side: THREE.DoubleSide
    }
 )

 // cavewall
 const caveWallGeometry = new THREE.PlaneGeometry(10,5)
 const caveWall = new THREE.Mesh(caveWallGeometry,caveMaterial)
 caveWall.rotation.y = Math.PI/2
 caveWall.position.set(-5,0,0)
 caveWall.receiveShadow = true
 scene.add(caveWall)

 // barrierWall
const barrierWallGeometry = new THREE.PlaneGeometry(10,2)
const barrierWall = new THREE.Mesh(barrierWallGeometry,caveMaterial)
barrierWall.rotation.y = Math.PI/2
barrierWall.position.set(5,-1.5,0)
scene.add(barrierWall)

 // caveFloor
const caveFloorGeometry = new THREE.PlaneGeometry(10,10)
const caveFloor = new THREE.Mesh(caveFloorGeometry,caveMaterial)
caveFloor.rotation.x = Math.PI/2
caveFloor.position.set(0,-2.5,0)
scene.add(caveFloor)

// Objects
// TorusKnot
const torusKnotGeometry = new THREE.TorusKnotGeometry(1,0.2)
const toruKnotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(torusKnotGeometry,toruKnotMaterial)
torusKnot.position.set(6,1.5,0)
torusKnot.castShadow = true
scene.add(torusKnot)

// Sun
const sunGeometry = new THREE.SphereGeometry()
const sunMaterial = new THREE.MeshLambertMaterial({
    emissive: new THREE.Color('orange'),
    emissiveIntensity: 20
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

/************
 ** LIGHTS **
 ************/
// const ambientLight  = new THREE.ambientLight(
//     new THREE.Color('white')
// )
// scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
directionalLight.target = caveWall
directionalLight.position.set(8.6,1.7,0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
scene.add(directionalLight)



// Directional Light Helper
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(directionalLightHelper)

/********
 ** UI **
 ********/
const ui = new dat.GUI()

// UI Object
const uiObject = {}

uiObject.reset = () =>
{
    directionalLight.position.set(8.6,1.7,0)
}

//  Directional Light
const lightPositionFolder = ui.addFolder('Directional Light Position')

lightPositionFolder
    .add(directionalLight.position, 'x')
    .min(-10)
    .max(20)
    .step(0.1)
    .listen()

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .listen()

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .listen()

lightPositionFolder
    .add(uiObject,'reset')
    .name('reset position')

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

 // Animation
 const animation = () =>
 {
    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
    torusKnot.rotation.y = elapsedTime
    torusKnot.position.z = Math.sin(elapsedTime) * 2

    // Update directionalLightHelper
    // directionalLightHelper.update()

    // Update sun position to match directionalLight position
    sun.position.copy(directionalLight.position)
    
    // Controls
    controls.update()

    // Renderer
    renderer.render(scene,camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

 animation()
