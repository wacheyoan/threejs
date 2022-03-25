import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat-gui";

export class App {

    rx = 0.01;
    ry = 0.01;

    private constructor(
        private readonly _renderer: THREE.Renderer,
        private readonly _scene: THREE.Scene,
        private readonly _camera: THREE.PerspectiveCamera,
        private readonly _cube: THREE.Mesh,
        private readonly _orbitControls: OrbitControls,
        private readonly _stats: Stats,
        private readonly _gui: GUI
    ) {
        this._scene.add(this._cube);
    }

    static create(): App {
        const [w, h] = [window.innerWidth, Math.max(window.innerHeight, 1)];
        const ratio = w / h;
        const renderer = new THREE.WebGLRenderer();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(80,ratio,0.1,1000);
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0xff0000
            })
        );
        const orbitsControls = new OrbitControls(camera,renderer.domElement);
        camera.position.z = 2;
        renderer.setSize(w,h);
        document.body.appendChild(renderer.domElement);

        const stats = Stats();
        document.body.appendChild(stats.dom);

        const gui = new GUI();
        const res: App = new App(renderer,scene,camera,cube,orbitsControls,stats,gui);

        const cubeFolder = gui.addFolder("Cube");
        cubeFolder.add(cube.scale,'x',0.1,10);
        cubeFolder.add(cube.scale,'y',0.1,10);
        cubeFolder.add(cube.scale,'z',0.1,10);
        cubeFolder.open();
        const rotationFolder = cubeFolder.addFolder("Rotation")
        rotationFolder.add(res,"rx",-1,1);
        rotationFolder.add(res,"ry",-1,1);
        rotationFolder.open();


        window.addEventListener('resize',res._onWindowResize.bind(res),false);

        return res;
    }

    run() {
        this._processFrame(0);
    }

    private _processFrame(t: number){
        requestAnimationFrame(this._processFrame.bind(this));
        this._cube.rotation.x += this.rx;
        this._cube.rotation.z += this.ry;
        this._render();
        this._stats.update();
    }

    private _render(){
        this._renderer.render(
            this._scene,
            this._camera
        );
    }

    private _onWindowResize() {
        const [w, h] = [window.innerWidth, Math.max(window.innerHeight, 1)];
        const ratio = w / h;

        this._camera.aspect = ratio;
        this._camera.updateProjectionMatrix();        
        this._renderer.setSize(w,h);
    }
}
