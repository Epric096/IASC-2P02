import * as THREE from "three"
import * as dat from "lil-gui"
import {OrbitControls} from "OrbitControls"

/***********
 ** SETUP **
 ***********/
// Sizes
const sizes = {
    width: window.innerWidth / 2.5,
    height: window.innerHeight / 2.5,
    aspectRatio: 1
}

 /***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector('.webgl2')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

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

/***********
 ** LIGHT **
 ***********/
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/************
 ** MESHES **
 ************/

// sphere Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5)

// sphere Materials
const redMaterial = new THREE.MeshStandardMaterial(
    {
        color: new THREE.Color('red')
    }
)
const greenMaterial = new THREE.MeshStandardMaterial(
    {
        color: new THREE.Color('green')
    }
)
const blueMaterial = new THREE.MeshStandardMaterial(
    {
        color: new THREE.Color('blue')
    }
)

const drawSphere = (i, material) =>
{
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.x = (Math.random() - 0.5) * 10
    sphere.position.z = (Math.random() - 0.5) * 10
    sphere.position.y = i - 10

    sphere.rotation.x = Math.random() * 2 * Math.PI
    sphere.rotation.y = Math.random() * 2 * Math.PI
    sphere.rotation.z = Math.random() * 2 * Math.PI

    sphere.randomizer = Math.random()
    sphere.posRandom = (Math.random() - 0.5) * 10

    scene.add(sphere)
}

/***********************
 ** TEXT PARSERS & UI **
 ***********************/
 let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'bird',
    term2: 'hat',
    term3: 'fox',
    rotateCamera: false,
    animateBubbles: false
}

// Text Parsers
// Parse Text and Terms
const parseTextandTerms = () =>
{
    // strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()

    // Tokenize text
    uiobj.textArray = parsedText.split(/[^\w']+/)

    // Find term 1
    findTermInParsedText(uiobj.term1, redMaterial)

    // Find term 2
    findTermInParsedText(uiobj.term2, greenMaterial)

    // Find term 3
    findTermInParsedText(uiobj.term3, blueMaterial)

}

const findTermInParsedText = (term, material) =>
{
    for (let i = 0; i < uiobj.textArray.length; i++)
    {
        if(uiobj.textArray[i] === term)
        {
            // convert i into n, which is a value between 0 and 20
            const n = (100 / uiobj.textArray.length) * i * 0.2
            
            // call drawsphere function 5 times using converted n value
            for(let a = 0; a < 5; a++)
            {
                drawSphere(n, material)
            }
        }
    }
}

// Load source text
fetch("https://raw.githubusercontent.com/monicedy/monicedy.github.io/main/_posts/Prince.txt")
    .then(response => response.text())
    .then(
        (data) =>
        {
            uiobj.text = data
            parseTextandTerms()
        }
    )


// UI
const ui = new dat.GUI(
    {
        container: document.querySelector('#parent2')
    }
)

// Interaction Folder
// spheres Folder
const spheresFolder = ui.addFolder('Filter Term')

spheresFolder
    .add(redMaterial, 'visible')
    .name(`${uiobj.term1}`)

spheresFolder
    .add(greenMaterial, 'visible')
    .name(`${uiobj.term2}`)

spheresFolder
    .add(blueMaterial, 'visible')
    .name(`${uiobj.term3}`)

spheresFolder
    .add(uiobj, 'animateBubbles')
    .name('Animate Bubbles')

// Camera Folder
const cameraFolder = ui.addFolder('Camera')

cameraFolder
    .add(uiobj, 'rotateCamera')
    .name('Rotate Camera')

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

    // Camera Rotation
    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16
        camera.position.z = Math.cos(elapsedTime * 0.2)  * 16
    }

    // Animate bubble
    if(uiobj.animateBubbles){
        for(let i =0; i < scene.children.length; i++){
            if(scene.children[i].type === "Mesh"){
                scene.children[i].scale.x = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].scale.y = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].scale.z = Math.sin(elapsedTime * scene.children[i].randomizer)
                scene.children[i].position.z += Math.sin(elapsedTime * scene.children[i].posRandom) * 0.5 
                scene.children[i].position.x += Math.cos(elapsedTime * scene.children[i].posRandom) * 0.5
            }
        }
    }

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)

}

animation()