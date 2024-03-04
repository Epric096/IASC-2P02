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
 const caveWallGeometry = new THREE.PlaneGeometry(20,8)
 const caveWall = new THREE.Mesh(caveWallGeometry,caveMaterial)
 caveWall.rotation.y = Math.PI/2
 caveWall.position.set(-5,0,0)
 caveWall.receiveShadow = true
 scene.add(caveWall)

 // barrierWall
const barrierWallGeometry = new THREE.PlaneGeometry(20,2)
const barrierWall = new THREE.Mesh(barrierWallGeometry,caveMaterial)
barrierWall.rotation.y = Math.PI/2
barrierWall.position.set(5,-3.5,0)
scene.add(barrierWall)

 // caveFloor
const caveFloorGeometry = new THREE.PlaneGeometry(10,20)
const caveFloor = new THREE.Mesh(caveFloorGeometry,caveMaterial)
caveFloor.rotation.x = Math.PI/2
caveFloor.position.set(0,-4,0)
scene.add(caveFloor)

// Objects

// jet plane
class CustomSinCurve extends THREE.Curve {

	constructor( scale = 1 ) {
		super();
		this.scale = scale;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = Math.sin( 5 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

const path = new CustomSinCurve( 2 );
const jetGeometry = new THREE.TubeGeometry( path, 8, 1, 8, false );
const jetMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const jet = new THREE.Mesh( jetGeometry, jetMaterial );
jet.castShadow = true
jet.rotation.y = 20.5
jet.rotation.x = 23.5
jet.position.set(20,1,0)
scene.add( jet );

// bullet
const fireGeometry = new THREE.ConeGeometry( 0.5, 2, 32 ); 
const fireMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const fire1 = new THREE.Mesh(fireGeometry, fireMaterial ); 
const fire2 = new THREE.Mesh(fireGeometry, fireMaterial ); 
fire1.rotation.x = 20.5
fire2.rotation.x = 20.5
fire1.position.set(20,3.5,-15)
fire2.position.set(20,-1.5,-40)
fire1.castShadow = true
fire2.castShadow = true

scene.add( fire1 );
scene.add( fire2 );

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
directionalLight.position.set(30,1.7,0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 4096
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

/********************
 ** DOM INTERACTIONS **
 ********************/

 // domObject
 const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
 }

 // continue-reading
document.querySelector('#continue-reading').onclick = function(){
    document.querySelector('#part-two').classList.remove('hidden')
    document.querySelector('#part-one').classList.add('hidden')
    domObject.part = 2
}

 // restart
 document.querySelector('#restart').onclick = function(){
    document.querySelector('#part-one').classList.remove('hidden')
    document.querySelector('#part-two').classList.add('hidden')
    domObject.part = 1

    // reset domObject changes
    domObject.firstChange = false
    domObject.secondChange = false
    domObject.thirdChange = false
    domObject.fourthChange = false

    // reset directionalLight
    directionalLight.position.set(30,1.7,0)

    // reset object locations
    fire1.position.set(20,3.5,-15)
    fire2.position.set(20,-1.5,-40)
    jet.position.set(20,1,0)
}

 // first change
 document.querySelector('#first-change').onclick = function(){
    domObject.firstChange = true
    domObject.secondChange = false
}

 // second change
 document.querySelector('#second-change').onclick = function(){
    domObject.secondChange = true   
}

 // third change
 document.querySelector('#third-change').onclick = function(){
    domObject.thirdChange = true
}

 // fourth change
 document.querySelector('#fourth-change').onclick = function(){
    domObject.fourthChange = true
}

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

 // Animation
 const animation = () =>
 {
    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // Update sun position to match directionalLight position
    sun.position.copy(directionalLight.position)

    // Controls
    controls.update()

    // DOM INTERACTIONS
    // part 1
    if(domObject.part == 1){
        camera.position.set(4, 0, 3)
        camera.lookAt(-5,0,1.5)
    }

    // part 2
    if(domObject.part ==2){
        camera.position.set(40,10,20)
    }
    // first-change
    if(domObject.firstChange){
        jet.position.z = Math.sin(elapsedTime / 2) * 10
        if(jet.position.z <= -9){
            jet.rotation.x = -23.5
        }
        else if (jet.position.z >= 9){
            jet.rotation.x = 23.5
        }
    }

    // second-change
    if(domObject.secondChange){
        jet.position.z = Math.sin(elapsedTime * 3) * 10
        if(jet.position.z <= -9){
            jet.rotation.x = -23.5
        }
        else if (jet.position.z >= 9.5){
            jet.rotation.x = 23.5
        }
    }
    // third-change
    if(domObject.thirdChange){
        jet.position.set(10,1,0)
        jet.rotation.x = 23.5
        jet.position.y = Math.sin(elapsedTime /2) * 4
        fire2.position.z += 0.05
        fire1.position.z += 0.05
    }
    // fourth-change
    if(domObject.fourthChange){
        directionalLight.position.y -= 0.03
    }
    // Renderer
    renderer.render(scene,camera)

    // Request next frame
    window.requestAnimationFrame(animation)
 }

 animation()
