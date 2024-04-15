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
const canvas = document.querySelector('.webgl')

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
camera.position.set(3, 39, -15)
camera.rotation.y = 0.29

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

// octahedron Geometry
const octahedronGeometry = new THREE.OctahedronGeometry(0.5, 0)

// octahedron Materials
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

const drawoctahedron = (i, material) =>
{
    const octahedron = new THREE.Mesh(octahedronGeometry, material)
    octahedron.position.x = (Math.random() - 0.5) * 10
    octahedron.position.z = (Math.random() - 0.5) * 10
    octahedron.position.y = i + 10

    octahedron.rotation.x = Math.random() * 2 * Math.PI
    octahedron.rotation.y = Math.random() * 2 * Math.PI
    octahedron.rotation.z = Math.random() * 2 * Math.PI

    octahedron.randomizer = Math.random()

    scene.add(octahedron)
}

/***********************
 ** TEXT PARSERS & UI **
 ***********************/
 let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'rose',
    term2: 'prince',
    term3: 'fox',
    rotateCamera: false,
    starDrop: false
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
            
            // call drawoctahedron function 5 times using converted n value
            for(let a = 0; a < 5; a++)
            {
                drawoctahedron(n, material)
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
        container: document.querySelector('#parent1')
    }
)

// Interaction Folder

// octahedrons Folder
const octahedronsFolder = ui.addFolder('Filter Term')

octahedronsFolder
    .add(redMaterial, 'visible')
    .name(`${uiobj.term1}`)

octahedronsFolder
    .add(greenMaterial, 'visible')
    .name(`${uiobj.term2}`)

octahedronsFolder
    .add(blueMaterial, 'visible')
    .name(`${uiobj.term3}`)

octahedronsFolder
    .add(uiobj, 'starDrop')
    .name('Star Drop')

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
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16
    }
    if(uiobj.starDrop)
    {
        camera.position.set(0,0,20)
        for(let i =0; i < scene.children.length; i++){
            if(scene.children[i].type === "Mesh"){
                if(scene.children[i].position.y > (100 / uiobj.textArray.length) * i * 0.2)
                {
                    scene.children[i].position.y -= 0.05 * scene.children[i].randomizer;
                }
            }
        }

    }

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)

}

animation()