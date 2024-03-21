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
    aspectRatio: window.innerWidth / window.innerHeight
}

let xDistance = 1
let meshSize = 1

// Mobile
if(sizes.aspectRatio < 1){
    xDistance = 1
    meshSize = 1
}

// Resizing
window.addEventListener('resize', () =>
{
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight
    
    // Update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

 /***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('white')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, -20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        antialias: true
    }
)
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/
// Cube Geometry
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)

// Cube Materials
const redMaterial = new THREE.MeshBasicMaterial(
    {
        color: new THREE.Color('red')
    }
)
const greenMaterial = new THREE.MeshBasicMaterial(
    {
        color: new THREE.Color('green')
    }
)
const blueMaterial = new THREE.MeshBasicMaterial(
    {
        color: new THREE.Color('blue')
    }
)

const drawCube = (i, material) =>
{
    const cube = new THREE.Mesh(cubeGeometry, material)
    cube.position.set(i,0,0)
    scene.add(cube)
}

/******************
 ** TEXT PARSERS **
 ******************/
const uiobj = {
    text: ''
}

// Text Parsers
// Load source text
fetch("https://raw.githubusercontent.com/amephraim/nlp/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer's%20Stone.txt")
    .then(response => response.text())
    .then(
        (data) =>
        {
            uiobj.text = data
            parseTextandTerms()
        }
    )

// Parse Text and Terms
const parseTextandTerms = () =>
{
    // strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()

}

parseTextandTerms()
/***************
 ** ANIMATION **
 ***************/
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Orbit Controls
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)

}

animation()