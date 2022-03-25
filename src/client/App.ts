import * as THREE from "three";

export class App {

    private constructor(
        private readonly _renderer: THREE.Renderer,
        private readonly _scene: THREE.Scene,
        private readonly _camera: THREE.PerspectiveCamera,
        private readonly _cube: THREE.Mesh,
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
        camera.position.z = 2;
        renderer.setSize(w,h);
        document.body.appendChild(renderer.domElement);

        const res: App = new App(renderer,scene,camera,cube);
        window.addEventListener('resize',res._onWindowResize.bind(res),false);

        return res;
    }

    run() {
        this._processFrame(0);
    }

    private _processFrame(t: number){
        requestAnimationFrame(this._processFrame.bind(this));
        this._cube.rotation.x += 0.01;
        this._cube.rotation.z += 0.01;
        this._render();
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
        this._render();
    }
}
