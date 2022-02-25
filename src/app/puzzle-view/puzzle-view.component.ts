import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-puzzle-view',
  templateUrl: './puzzle-view.component.html',
  styleUrls: ['./puzzle-view.component.scss'],
})
export class PuzzleViewComponent implements OnInit, AfterViewInit {
  private puzzleId: string;

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  @ViewChild('canvasHolder')
  private canvasHolderRef: ElementRef;

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loader = new THREE.TextureLoader();

  private geometry = new THREE.BoxGeometry(1, 1, 1);

  private material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffffff),
  });

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    var self = this;
    this.route.queryParams.subscribe((params) => {
      self.puzzleId = params['id'];
      console.log('Puzzle ID: ' + self.puzzleId);
    });
  }

  ngAfterViewInit(): void {
    this.loadTextures();
  }

  /**
   * All textures are saved here, in this one spot
   */
  private textureMap: Map<String, THREE.MeshBasicMaterial> = new Map<
    String,
    THREE.MeshBasicMaterial
  >();

  private getTexture(assetName: string): THREE.MeshBasicMaterial {
    return this.textureMap.get(assetName)!;
  }

  private loadTextures() {
    let self = this;
    Promise.all([
      this.getTexturePromise('assets/cube-bee.png'),
      self.getTexturePromise('assets/cube-blank.png'),
      self.getTexturePromise('assets/cube-face.png'),
      self.getTexturePromise('assets/cube-zero.png'),
      self.getTexturePromise('assets/cube-one.png'),
      self.getTexturePromise('assets/cube-two.png'),
      self.getTexturePromise('assets/cube-three.png'),
    ]).then(function () {
      self.createScene();
      self.createRenderer();
    });
  }

  /**
   *
   * @param assetPath Used to convert a texture load event into a Promise
   * @returns Promise of (THREE.Texture)
   */
  private getTexturePromise(assetPath: string): Promise<THREE.Texture> {
    let loader = this.loader;
    let map = this.textureMap;

    return new Promise(function (resolve, reject) {
      function loadDone(texture: THREE.Texture) {
        console.log('loader successfully completed loading task: ' + assetPath);
        map.set(
          assetPath,
          new THREE.MeshBasicMaterial({
            map: texture,
          })
        );
        resolve(texture); // it went ok!
      }
      loader.load(assetPath, loadDone);
    });
  }

  private cubeList: Array<THREE.Mesh> = new Array();

  private createScene() {
    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color(0x000000);

    console.log(this.textureMap);

    const cubeMaterials = [
      this.getTexture('assets/cube-blank.png'), //right side
      this.getTexture('assets/cube-bee.png'), //left side
      this.getTexture('assets/cube-blank.png'), //top side
      this.getTexture('assets/cube-blank.png'), //bottom side
      this.getTexture('assets/cube-three.png'), //front side
      this.getTexture('assets/cube-blank.png'), //back side
    ];

    for (let i = 0; i < 3; i++) {
      let cube: THREE.Mesh = new THREE.Mesh(this.geometry, cubeMaterials);
      this.cubeList.push(cube);

      cube.position.set(i * 1.1, 0, i);

      this.scene.add(cube);
    }

    let aspectRatio = 640.0 / 480.0;
    this.camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1, 50);
    this.camera.position.z = 5;
    this.camera.position.y = 3;
    this.camera.lookAt(0, 0, 0);
  }

  private createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: true,
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    var sizes = this.getCanvasSize();
    this.renderer.setSize(sizes[0], sizes[1]);

    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: WindowEventMap) {
    var sizes = this.getCanvasSize();
    this.renderer.setSize(sizes[0], sizes[1]);
    this.renderer.render(this.scene, this.camera);
  }

  private getCanvasSize(): Array<number> {
    let width = this.canvasHolderRef.nativeElement.clientWidth - 20;
    let height = Math.floor(width * 0.75);
    return [width, height];
  }
}
