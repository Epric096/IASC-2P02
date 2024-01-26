import * as THREE from "three"

/***********
 ** SCENE **
 ***********/

 // Canavs
const canvas = document.querySelector('.webgl')

 // Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('blue')

 // Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(0, 0, 5)
scene.add(camera)

 // Renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas
    }
)
renderer.setSize(window.innerWidth,window.innerHeight)

/************
** MESHES **
*************/

//testBox
const BoxGeometry = new THREE.BoxGeometry(1)
const BoxMaterial = new THREE.MeshNormalMaterial()
const testBox = new THREE.Mesh(BoxGeometry,BoxMaterial)

const TorusGeometry = new THREE.TorusGeometry(2,0.3,16,100)
const TorusMaterial = new THREE.MeshNormalMaterial()
const testTorus = new THREE.Mesh(TorusGeometry,TorusMaterial)

scene.add(testBox)
scene.add(testTorus)

 /*********************
  ** ANIMATION LOOP **
  *********************/

  const clock = new THREE.Clock()
  // Animate
const animation =  () => {

    // Return elapsedTime
    const elapsedTIme = clock.getElapsedTime()

    // Animate testBox
    testBox.rotation.x = Math.sin(elapsedTIme) *2
    testBox.rotation.y = Math.sin(elapsedTIme) *2
    testBox.rotation.z = Math.sin(elapsedTIme) *2

    testBox.scale.x = Math.sin(elapsedTIme * 0.5) *2
    testBox.scale.y = Math.sin(elapsedTIme * 0.5) *2
    testBox.scale.z = Math.sin(elapsedTIme * 0.5) *2

    testTorus.rotation.y = elapsedTIme

    // Renderer
    renderer.render(scene,camera)

    // Request next fram
    window.requestAnimationFrame(animation)
}

animation()