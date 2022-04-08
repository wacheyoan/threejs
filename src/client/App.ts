import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "dat-gui"

const getWindowWidthHeightAndRatio = () => {
  const [width, height] = [window.innerWidth, Math.max(window.innerHeight), 1]
  const ratio = width / height
  return { ratio, width, height }
}

export class App {

  readonly daMercure = 1.003196807
  readonly daVenus = 0.20
  readonly daTerre = 0.302521
  readonly daMars = 0.15
  readonly daLune = 5

  aMercure = 0
  aVenus = 0
  aTerre = 0
  aMars = 0
  aLune = 0

  rx = 0.01
  ry = 0.01
  oldTime = 0

  private constructor(
    private readonly _renderer: THREE.Renderer,
    private readonly _scene: THREE.Scene,
    private readonly _camera: THREE.PerspectiveCamera,
    private readonly _orbitControls: OrbitControls,
    private readonly _stats: Stats,
    private readonly _gui: GUI,
    private readonly _soleil: THREE.Mesh,
    private readonly _mercure: THREE.Mesh,
    private readonly _venus: THREE.Mesh,
    private readonly _lune: THREE.Mesh,
    private readonly _terre: THREE.Mesh,
    private readonly _mars: THREE.Mesh,

  ) {
    this._scene.add(this._mercure)
    this._scene.add(this._venus)
    this._scene.add(this._terre)
    this._scene.add(this._mars)
    this._scene.add(this._soleil)
    this._terre.add(this._lune)
    const geometry = new THREE.PlaneGeometry( 100, 100 );
    const material = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.y = -10;
    plane.position.x = 0
    plane.rotateX(180);
    // this._scene.add( plane );

    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 100, 1000, 100 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    this._soleil.add( spotLight );
  }

  private _processFrame(time: number) {
    requestAnimationFrame(this._processFrame.bind(this))
    const dt = time - this.oldTime

    this.aMercure = (this.aMercure - (this.daMercure * dt * 0.001)) % (2 * Math.PI)
    this._mercure.position.x = Math.cos(this.aMercure) * 3.8
    this._mercure.position.z = Math.sin(this.aMercure) * 3.8

    this.aVenus = (this.aVenus - (this.daVenus * dt * 0.001)) % (2 * Math.PI)
    this._venus.position.x = Math.cos(this.aVenus) * 7.2
    this._venus.position.z = Math.sin(this.aVenus) * 7.2

    this.aTerre = (this.aTerre - (this.daTerre * dt * 0.001)) % (2 * Math.PI)
    this._terre.position.x = Math.cos(this.aTerre) * 10
    this._terre.position.z = Math.sin(this.aTerre) * 10

    this.aMars = (this.aMars - (this.daMars * dt * 0.001)) % (2 * Math.PI)
    this._mars.position.x = Math.cos(this.aMars) * 15.2
    this._mars.position.z = Math.sin(this.aMars) * 15.2

    this.aLune = (this.aLune - (this.daLune * dt * 0.001)) % (2 * Math.PI)
    this._lune.position.x = Math.cos(this.aLune) * 1.5
    this._lune.position.z = Math.sin(this.aLune) * 1.5


    this.oldTime = time

    this._render()
    this._stats.update()
  }

  static create(): App {
    const { ratio, width, height } = getWindowWidthHeightAndRatio()

    const stats = Stats()

    const rendered = new THREE.WebGLRenderer()
    rendered.setSize(width, height)
    document.body.appendChild(rendered.domElement)
    document.body.appendChild(stats.dom)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(80, ratio, 0.1, 1000)
    camera.position.z = 2

    const soleil = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true
    }))

    const mercure = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({
      color: 0xaaaaaa
    }))
    mercure.position.x = 3.8
    mercure.scale.x = 0.5 * 0.382
    mercure.scale.y = 0.5 * 0.382
    mercure.scale.z = 0.5 * 0.382

    const venus = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({
      color: 0xeac7aa
    }))
    venus.position.x = 7.2
    venus.scale.x = 0.5 * 0.948
    venus.scale.y = 0.5 * 0.948
    venus.scale.z = 0.5 * 0.948

    const diffuseTexture = new THREE.TextureLoader().load("/diffuseTexture.jpg")
    const bumpTexture = new THREE.TextureLoader().load("/bumpMappingTexture.jpg")
    const specularTexture = new THREE.TextureLoader().load("/specularTexture.jpg")

    const terre = new THREE.Mesh(
      new THREE.SphereGeometry(),
     new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.25
    }))
    terre.position.x = 10
    terre.scale.x = 0.5
    terre.scale.y = 0.5
    terre.scale.z = 0.5

    const lune = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({
      color: 0xffffff
    }))
    lune.position.x = 11
    lune.scale.x = 0.5 * 0.34
    lune.scale.y = 0.5 * 0.34
    lune.scale.z = 0.5 * 0.34


    const mars = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({
      color: 0xff00000
    }))
    mars.position.x = 15.2
    mars.scale.x = 0.532
    mars.scale.y = 0.532
    mars.scale.z = 0.532

    const orbitControls = new OrbitControls(camera, rendered.domElement)

    const gui = new GUI()

    const app = new App(rendered, scene, camera, orbitControls, stats, gui, soleil, mercure, venus, lune, terre, mars)
    window.addEventListener("resize", app._onWindowResize.bind(app), false)

    const planets = gui.addFolder("Planètes")
    const sunFolder = planets.addFolder("Soleil");
    const sunScaleFolder = sunFolder.addFolder("Scale");
    sunScaleFolder.add(soleil.scale,"x",0.5,1);
    sunScaleFolder.add(soleil.scale,"y",0.5,1);
    sunScaleFolder.add(soleil.scale,"z",0.5,1);
    const moonFolder = planets.addFolder("Lune");
    const moonScaleFolder = moonFolder.addFolder("Scale");
    moonScaleFolder.add(lune.scale,"x",0.5,1);
    moonScaleFolder.add(lune.scale,"y",0.5,1);
    moonScaleFolder.add(lune.scale,"z",0.5,1);
    const mercuryFolder = planets.addFolder("Mercure");
    const mercuryScaleFolder = mercuryFolder.addFolder("Scale");
    mercuryScaleFolder.add(mercure.scale,"x",0.5,1);
    mercuryScaleFolder.add(mercure.scale,"y",0.5,1);
    mercuryScaleFolder.add(mercure.scale,"z",0.5,1);
    const venusFolder = planets.addFolder("Vénus");
    const venusScaleFolder = venusFolder.addFolder("Scale");
    venusScaleFolder.add(venus.scale,"x",venus.scale.x / 2,venus.scale.x * 2);
    venusScaleFolder.add(venus.scale,"y",venus.scale.y / 2,venus.scale.y * 2);
    venusScaleFolder.add(venus.scale,"z",venus.scale.z / 2,venus.scale.z * 2);
    const marsFolder = planets.addFolder("Mars");
    marsFolder.add(mars.scale,"x",0.5,1);
    marsFolder.add(mars.scale,"y",0.5,1);
    marsFolder.add(mars.scale,"z",0.5,1);
    const terreFolder = planets.addFolder("Terre");
    terreFolder.add(terre.scale,"x",0.5,1);
    terreFolder.add(terre.scale,"y",0.5,1);
    terreFolder.add(terre.scale,"z",0.5,1);
    

    return app
  }

  run() {
    this._processFrame(0)
  }

  private _render() {
    this._renderer.render(this._scene, this._camera)
  }

  private _onWindowResize() {
    const { ratio, width, height } = getWindowWidthHeightAndRatio()
    this._camera.aspect = ratio
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(width, height)
    this._render()
  }
}