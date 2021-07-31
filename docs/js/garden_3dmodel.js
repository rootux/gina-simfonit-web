import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'

const file = '/img/hello_mesh.3dm'

const RENDER_SIZE = 1

// wait until the rhino3dm library is loaded, then load the 3dm file
rhino3dm().then(async m => {
    console.log('Loaded rhino3dm.')
    let rhino = m

    let res = await fetch(file)
    let buffer = await res.arrayBuffer()
    let arr = new Uint8Array(buffer)
    let doc = rhino.File3dm.fromByteArray(arr)

    init()

    let material = new THREE.MeshNormalMaterial()

    let objects = doc.objects()
    for (let i = 0; i < objects.count; i++) {
        let mesh = objects.get(i).geometry()
        if(mesh instanceof rhino.Mesh) {
            // convert all meshes in 3dm model into threejs objects
            let threeMesh = meshToThreejs(mesh, material)
            scene.add(threeMesh)
        }
    }

    document.getElementById('loader').style.display = 'none'
})

let scene, camera, renderer

function init(){
    THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1)
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1,1,1)
    camera = new THREE.PerspectiveCamera( 20, window.innerWidth /window.innerHeight, 0.1, 1000 )
    camera.position.set(0, 220, 0 )
    camera.rotation.x = 0
    camera.rotation.y = 0
    camera.rotation.z = 0

    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth * RENDER_SIZE, window.innerHeight  * RENDER_SIZE)
    const elem = document.getElementById('garden_model');
    elem.appendChild( renderer.domElement )

    const controls = new OrbitControls( camera, renderer.domElement )

    window.addEventListener( 'resize', onWindowResize, false )
    animate()
}

function animate () {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
}

function onWindowResize() {
    console.log(camera.rotation)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth * RENDER_SIZE, window.innerHeight * RENDER_SIZE)
    animate()
}

function meshToThreejs(mesh, material) {
    const loader = new THREE.BufferGeometryLoader()
    const geometry = loader.parse(mesh.toThreejsJSON())
    return new THREE.Mesh(geometry, material)
}

function getFormattedSensors(sensorsData) {
    let water_status = ''
    if(sensorsData.water_status == 1) {
        water_status = 'Over wattered'
    }else if(sensorsData.water_status == -1){
        water_status = 'Under wattered'
    }else {
        water_status = 'Perfect'
    }
    const sensorsFormatted = `Wind: ${sensorsData.wind_speed}KM/s (${sensorsData.wind_direction})
    Water status: ${water_status}`
    return sensorsFormatted;
}

function setSensorsData(sensorsData) {
    console.log(sensorsData);
    const formatted = getFormattedSensors(sensorsData);
    document.getElementById('sensors_data').innerText = formatted
}
window.setSensorsData = setSensorsData