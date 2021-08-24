import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/3DMLoader.js'

let scene, camera, renderer;
let modelObj;

const file = '/img/garden.3dm';

const RENDER_SIZE = 1

const loader = new Rhino3dmLoader();

init();

loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' );
loader.load( file, ( obj ) => {
    document.getElementById('loader').style.display = 'none';
    modelObj = obj;
    scene.add(modelObj);
        }, (xhr) => [
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
], (err) =>{
    console.error(err);
});

function init() {
    let scale = 1;
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if(width < 868) {
        scale = 2.1;
    }else if (width < 1024) {
        scale = 1.5;
    }
    THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1)
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1,1,1)
    camera = new THREE.PerspectiveCamera( 45 * scale, window.innerWidth /window.innerHeight, 0.1, 10000 )
    camera.position.set(-150, -100, 40 )
    // Offset the y
    camera.setViewOffset( window.innerWidth, window.innerHeight, 0, 100 * scale, window.innerWidth, window.innerHeight );

    renderer = new THREE.WebGLRenderer({antialias: true}) //helps with performance
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth * RENDER_SIZE, window.innerHeight  * RENDER_SIZE)
    const elem = document.getElementById('garden_model');
    elem.appendChild( renderer.domElement )

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    const light2 = new THREE.HemisphereLight( 0xffffbb, 0x8ea7ff, 0.2 );
    scene.add( light2 );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6);
    scene.add( directionalLight );
    const controls = new OrbitControls( camera, renderer.domElement )

    window.addEventListener( 'resize', onWindowResize, false )
    animate()
}

function animate () {
    if(modelObj) {
        modelObj.rotation.z += 0.0005;
    }
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth * RENDER_SIZE, window.innerHeight * RENDER_SIZE)
}

function meshToThreejs(mesh, material) {
    const loader = new THREE.BufferGeometryLoader()
    const geometry = loader.parse(mesh.toThreejsJSON())
    return new THREE.Mesh(geometry, material)
}

function getFormattedSensors(sensorsData) {
    // let water_status = ''
    // if(sensorsData.water_status == 1) {
    //     water_status = 'Over wattered'
    // }else if(sensorsData.water_status == -1){
    //     water_status = 'Under wattered'
    // }else {
    //     water_status = 'Perfect'
    // }
    // const sensorsFormatted = `Wind: ${sensorsData.wind_speed}KM/s (${sensorsData.wind_direction})
    // Water status: ${water_status}`
    //return sensorsFormatted;
    return 'TBD'
}

function setSensorsData(sensorsData) {
    console.log(sensorsData);
    const formatted = getFormattedSensors(sensorsData);
    document.getElementById('sensors_data').innerText = formatted
}
window.setSensorsData = setSensorsData