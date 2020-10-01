import * as THREE from './three.module.js';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
camera.position.y = 5;
camera.position.x = 5;

let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

class Light {
    constructor(x, y, z, color = 0xffffff) {
        this.light = new THREE.PointLight( color, 1, 10000 );
        this.light.position.set( x, y, z );
        scene.add( this.light );
    }
}

class Cube {
    constructor( x=0, y=0, z=0, color = 0x000000, width=3, height=0.5, depth=3) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;

        this.geometry = new THREE.BoxGeometry(width,0.5,depth);
        this.material = new THREE.MeshLambertMaterial( { color: color } );
        this.mesh = new THREE.Mesh( this.geometry, this.material );

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.setPosition(x, y, z)

        scene.add( this.mesh );
    }

    setPosition(x=this.x, y=this.y, z=this.z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.mesh.position.set(x, y, z);
    }

    getPosition() {
        return {'x': this.mesh.position.x, 'y': this.mesh.position.y, 'z': this.mesh.position.z}
    }
}

new Light(1400,500,1200)
new Light(0,1000,0)

let cubes = [];

function addCube() {
    let y;
    if (cubes.length !== 0) {
        y = cubes[cubes.length - 1].y + 0.5
        cubes.push(new Cube(0, y, 0, `#${Math.floor(Math.random()*16777215).toString(16)}`, 3, 0.5, 3));
        console.log(`Previous Cube - x: ${cubes[cubes.length - 1].getPosition().x}, y: ${cubes[cubes.length - 2].getPosition().y}, z: ${cubes[cubes.length - 1].getPosition().z}`)
    } else {
        cubes.push(new Cube(0, 0, 0, `#${Math.floor(Math.random()*16777215).toString(16)}`));
    }
    camera.position.y += 0.5;
    camera.lookAt(cubes[cubes.length - 1].mesh.position)
}

document.addEventListener("mousedown", () => {
    addCube();
    direction = !direction;
} )

let speed = 0.12;
let direction = true;
let topCube;

let baseCube = new Cube(0, -0.5, 0, `#${Math.floor(Math.random()*16777215).toString(16)}`)
camera.lookAt(baseCube.mesh.position);

function animate() {
    requestAnimationFrame( animate );

    if (cubes.length !== 0) {
        topCube = cubes[cubes.length - 1];
        if (direction) {
            if (topCube.z < -5) {
                speed = -speed;
            } else if (topCube.z > 5) {
                speed = -speed;
            }
            topCube.setPosition(topCube.x, topCube.y, topCube.z + speed)
        } else {
            if (topCube.x < -5) {
                speed = -speed;
            } else if (topCube.x > 5) {
                speed = -speed;
            }
            topCube.setPosition(topCube.x + speed, topCube.y, topCube.z)
        }
    }
    renderer.render( scene, camera );
}
animate();