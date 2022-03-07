import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import * as THREE from 'three';
import { PuzzleDirection } from '../shared/puzzle-direction';
import { PuzzleInfo } from '../shared/puzzle-info';
import { PuzzleType } from '../shared/puzzle-type';
import { InteractionManager } from '../shared/three-interactive';

@Component({
  selector: 'app-three-dview',
  templateUrl: './three-dview.component.html',
  styleUrls: ['./three-dview.component.scss'],
})
export class ThreeDViewComponent implements OnInit, AfterViewInit, OnChanges {
  constructor() {}

  @Output()
  configurationChanged: EventEmitter<number> = new EventEmitter<number>();

  cubeClicked(i: number) {
    this.configurationChanged.emit(i);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public startView() {
    this.loadTextures();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['puzzleInfo']) {
      console.log('Changes');
      if (this.puzzleInfo && this.camera && this.scene) {
        this.loadBackground();
        this.buildDirectionArray();
        this.reCreateScene();
        this.createCamera();
        this.renderer.render(this.scene, this.camera);
      } else {
        this.loadBackground();
      }
    }
  }

  private cubeDirections: Array<PuzzleDirection> = [];

  @Input('puzzleId')
  public puzzleId: string;

  @Input()
  public puzzleInfo: PuzzleInfo | undefined;

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  @ViewChild('canvasHolder')
  private canvasHolderRef: ElementRef;

  private camera!: THREE.Camera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loader = new THREE.TextureLoader();

  private geometry = new THREE.BoxGeometry(1, 1, 1);

  private selectionGeometry = new THREE.ConeGeometry(0.25, -0.5, 8);

  private material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffffff),
  });

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private interactionManager!: InteractionManager;

  private _90 = 1.5707963268;

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

  private loadBackground() {
    if (this.canvasHolderRef) {
      if (this.puzzleInfo && this.puzzleInfo.type != PuzzleType.BROKEN) {
        this.canvasHolderRef.nativeElement.setAttribute(
          'style',
          'background-size: cover;background-image:url(./assets/backgrounds/' +
            this.puzzleInfo!.id +
            '.jpg)'
        );
      } else {
        this.canvasHolderRef.nativeElement.setAttribute(
          'style',
          'background-size: cover;background-image:url(./assets/backgrounds/static.gif)'
        );
      }
    }
  }

  private buildDirectionArray() {
    this.cubeDirections = [];
    for (let i = 0; i < this.puzzleInfo!.count; i++) {
      this.cubeDirections[i] = this.puzzleInfo!.directions[i];
    }
  }

  private loadTextures() {
    this.loadBackground();

    this.buildDirectionArray();

    Promise.all([
      this.getTexturePromise('assets/cube-at.png'),
      this.getTexturePromise('assets/cube-bee.png'),
      this.getTexturePromise('assets/cube-blank.png'),
      this.getTexturePromise('assets/cube-face.png'),
      this.getTexturePromise('assets/cube-zero.png'),
      this.getTexturePromise('assets/cube-one.png'),
      this.getTexturePromise('assets/cube-two.png'),
      this.getTexturePromise('assets/cube-three.png'),
      this.getTexturePromise('assets/cube-down_arrow.png'),
    ]).then(() => {
      this.createScene();
      this.createRenderer();
      this.createInteractionManager();
      this.update(0);
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
        //console.log('loader successfully completed loading task: ' + assetPath);
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

  private selectionNode: THREE.Mesh | undefined;

  private reCreateScene() {
    let cubeMaterials: Array<THREE.MeshBasicMaterial> = [];

    for (let i = 0; i < this.cubeList.length; i++) {
      this.scene.remove(this.cubeList[i]);
    }
    this.cubeList = [];

    switch (this.puzzleInfo!.type) {
      case PuzzleType.SPIN:
        {
          cubeMaterials.push(this.getTexture('assets/cube-bee.png')); //right side
          cubeMaterials.push(this.getTexture('assets/cube-at.png')); //left side
          cubeMaterials.push(this.getTexture('assets/cube-down_arrow.png')); //top side
          cubeMaterials.push(this.getTexture('assets/cube-blank.png')); //bottom side
          cubeMaterials.push(this.getTexture('assets/cube-three.png')); //front side
          cubeMaterials.push(this.getTexture('assets/cube-face.png')); //back side
        }
        break;
      case PuzzleType.LIGHT:
        {
          cubeMaterials.push(this.getTexture('assets/cube-one.png')); //right side
          cubeMaterials.push(this.getTexture('assets/cube-three.png')); //left side
          cubeMaterials.push(this.getTexture('assets/cube-blank.png')); //top side
          cubeMaterials.push(this.getTexture('assets/cube-blank.png')); //bottom side
          cubeMaterials.push(this.getTexture('assets/cube-zero.png')); //front side
          cubeMaterials.push(this.getTexture('assets/cube-two.png')); //back side
        }
        break;
      default:
        {
          cubeMaterials.push(this.getTexture('assets/cube-bee.png')); //right side
          cubeMaterials.push(this.getTexture('assets/cube-at.png')); //left side
          cubeMaterials.push(this.getTexture('assets/cube-blank.png')); //top side
          cubeMaterials.push(this.getTexture('assets/cube-blank.png')); //bottom side
          cubeMaterials.push(this.getTexture('assets/cube-three.png')); //front side
          cubeMaterials.push(this.getTexture('assets/cube-face.png')); //back side
        }
        break;
    }

    if (this.puzzleInfo?.type !== PuzzleType.BROKEN) {
      for (let i = 0; i < this.puzzleInfo!.count; i++) {
        let cube: THREE.Mesh = new THREE.Mesh(this.geometry, cubeMaterials);
        this.cubeList.push(cube);

        cube.position.set(
          this.puzzleInfo!.position[i][0],
          this.puzzleInfo!.position[i][1],
          this.puzzleInfo!.position[i][2]
        );

        this.scene.add(cube);

        this.updateCubeDirection(i);
      }
    }
  }

  private createCamera() {
    let aspectRatio = 640.0 / 480.0;

    if (this.puzzleInfo!.type == PuzzleType.LIGHT) {
      let w = this.puzzleInfo!.orthoWidth / 2;
      let h = (this.puzzleInfo!.orthoWidth * 0.75) / 2;
      this.camera = new THREE.OrthographicCamera(-w, w, h, -h, 0.1, 50);
    } else {
      this.camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1, 50);

      this.camera.position.x = this.puzzleInfo!.camera[0];
      this.camera.position.y = this.puzzleInfo!.camera[1];
      this.camera.position.z = this.puzzleInfo!.camera[2];

      this.camera.lookAt(0, 0, 0);
    }
  }

  private createScene() {
    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color(0x000000);

    //console.log(this.textureMap);

    this.reCreateScene();

    this.selectionNode = new THREE.Mesh(
      this.selectionGeometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.selectionNode.visible = false;
    this.scene.add(this.selectionNode);

    this.createCamera();
  }

  public updateDirections(
    directions: Array<PuzzleDirection>,
    highlightIndex: number = -1
  ) {
    for (let i = 0; i < this.puzzleInfo!.count; i++) {
      this.cubeDirections[i] = directions[i];
      if (i == highlightIndex) {
        this.selectionNode!.position.x = this.cubeList[i].position.x;
        this.selectionNode!.position.y = this.cubeList[i].position.y + 1;
        this.selectionNode!.position.z = this.cubeList[i].position.z;
      }
      this.updateCubeDirection(i);
    }
    this.selectionNode!.visible = highlightIndex >= 0;
    this.renderer.render(this.scene, this.camera);
  }

  private updateCubeDirection(index: number) {
    let rot: number = 0;
    switch (this.cubeDirections[index]) {
      case PuzzleDirection.NORTH:
        rot = this._90 * 2;
        break;
      case PuzzleDirection.EAST:
        rot = this._90;
        break;
      case PuzzleDirection.SOUTH:
        rot = 0;
        break;
      case PuzzleDirection.WEST:
        rot = -this._90;
        break;
      case PuzzleDirection.TWO:
        rot = this._90 * 2;
        break;
      case PuzzleDirection.ONE:
        rot = -this._90;
        break;
      case PuzzleDirection.ZERO:
        rot = 0;
        break;
      case PuzzleDirection.THREE:
        rot = this._90;
        break;
    }

    if (this.puzzleInfo!.type == PuzzleType.SPIN) {
      switch (this.puzzleInfo!.facing) {
        case PuzzleDirection.NORTH:
          break;
        case PuzzleDirection.EAST:
          rot += this._90;
          break;
        case PuzzleDirection.SOUTH:
          rot -= this._90 * 2;
          break;
        case PuzzleDirection.WEST:
          rot -= this._90;
          break;
      }
    }

    this.cubeList[index].rotation.y = rot;
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

  private createInteractionManager() {
    this.interactionManager = new InteractionManager(
      this.renderer,
      this.camera,
      this.canvas,
      undefined
    );

    for (let i = 0; i < this.cubeList.length; i++) {
      const cube = this.cubeList[i];
      this.interactionManager.add(cube);

      cube.addEventListener('click', (ev) => {
        ev['stopPropagation']();
        // TODO: Should this work like the in-game puzzles, and rotate multiple cubes?
        console.log('Clicked on cube', i);
        this.cubeClicked(i);
      });

      cube.addEventListener('mouseover', (ev) => {
        cube.scale.set(1.1, 1.1, 1.1);
        this.renderer.render(this.scene, this.camera);
      });
      cube.addEventListener('mouseout', (ev) => {
        cube.scale.set(1, 1, 1);
        this.renderer.render(this.scene, this.camera);
      });
    }
  }

  private update(time: DOMHighResTimeStamp) {
    this.interactionManager.update();

    requestAnimationFrame(this.update.bind(this));
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: WindowEventMap) {
    if (this.puzzleInfo != null) {
      var sizes = this.getCanvasSize();
      this.renderer.setSize(sizes[0], sizes[1]);
      this.renderer.render(this.scene, this.camera);
    }
  }

  private getCanvasSize(): Array<number> {
    let width = this.canvasHolderRef.nativeElement.clientWidth;
    let height = Math.floor(width * 0.75);
    return [width, height];
  }

  public getFacingDirectionText() {
    if (this.puzzleInfo) {
      switch (this.puzzleInfo.facing) {
        case PuzzleDirection.NORTH:
          return 'North';
        case PuzzleDirection.EAST:
          return 'East';
        case PuzzleDirection.SOUTH:
          return 'South';
        case PuzzleDirection.WEST:
          return 'West';
      }
    }
    return '';
  }

  public getFacingDirectionClass() {
    if (this.puzzleInfo) {
      switch (this.puzzleInfo.facing) {
        case PuzzleDirection.NORTH:
          return 'arrow-alt-circle-up';
        case PuzzleDirection.EAST:
          return 'arrow-alt-circle-right';
        case PuzzleDirection.SOUTH:
          return 'arrow-alt-circle-down';
        case PuzzleDirection.WEST:
          return 'arrow-alt-circle-left';
      }
    }
    return 'arrow-alt-circle-up';
  }
}
