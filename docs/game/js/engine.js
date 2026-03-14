const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(20,20,20)

const renderer = new THREE.WebGLRenderer({antialias:true})

renderer.setSize(window.innerWidth,window.innerHeight)

document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera,renderer.domElement)

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(20,50,20)
scene.add(light)

const ambient = new THREE.AmbientLight(0xffffff,0.4)
scene.add(ambient)

const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshStandardMaterial({color:0x55aa55})

async function loadChunk(cx,cy,cz){

    const path = `chunks/y${cy}/x${cx}/chunk_${cz}.bin`

    const res = await fetch(path)

    const buffer = await res.arrayBuffer()

    const voxels = new Uint8Array(buffer)

    let i = 0

    for(let y=0;y<16;y++){
        for(let z=0;z<16;z++){
            for(let x=0;x<16;x++){

                const block = voxels[i++]

                if(block !== 0){

                    const cube = new THREE.Mesh(geometry,material)

                    cube.position.set(
                        x + cx*16,
                        y + cy*16,
                        z + cz*16
                    )

                    scene.add(cube)

                }

            }
        }
    }
}

loadChunk(0,0,0)
loadChunk(0,0,1)
loadChunk(1,0,0)

function animate(){

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene,camera)

}

animate()
