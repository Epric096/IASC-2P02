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

//testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry,sphereMaterial)

scene.add(testSphere)

 /*********************
  ** ANIMATION LOOP **
  *********************/

  const clock = new THREE.Clock()
  // Animate
const animation =  () => {

    // Return elapsedTime
    const elapsedTIme = clock.getElapsedTime()

    // Animate testSphere
    testSphere.position.y = Math.sin(elapsedTIme)
    testSphere.position.x = Math.cos(elapsedTIme)


    // Renderer
    renderer.render(scene,camera)

    // Request next fram
    window.requestAnimationFrame(animation)
}

animation()