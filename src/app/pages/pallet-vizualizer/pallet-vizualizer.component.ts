import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
@Component({
  selector: 'app-pallet-vizualizer',
  imports: [],
  templateUrl: './pallet-vizualizer.component.html',
  styleUrl: './pallet-vizualizer.component.scss'
})
export class PalletVisualizerComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls!: OrbitControls; // Объявляем OrbitControls

  private boxWidth = 0.5;  // Ширина коробки
  private boxHeight = 0.5; // Высота коробки
  private boxDepth = 0.5;  // Глубина коробки
  private rows = 4;        // Количество рядов коробок
  private columns = 4;     // Количество колонок коробок
  private layers = 3;      // Количество слоев коробок

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
  }

  ngOnInit() {
    this.camera.position.z = 10;
  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.nativeElement.appendChild(this.renderer.domElement);

    // Инициализируем OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Включаем плавное движение
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;  // Отключаем панорамирование экрана
    this.controls.maxPolarAngle = Math.PI / 2; // Ограничиваем вертикальный угол

    this.addPallet(); // Добавляем паллет
    this.addBoxes();  // Добавляем коробки
    this.animate();   // Запускаем анимацию
  }

  addPallet() {
    // Создание паллета
    const palletGeometry = new THREE.BoxGeometry(3, 1, 3); // Размеры паллета
    const palletMaterial = new THREE.MeshBasicMaterial({ color: 0x777777 });
    const pallet = new THREE.Mesh(palletGeometry, palletMaterial);
    this.scene.add(pallet);
  }

  addBoxes() {
    // Добавление коробок
    for (let z = 0; z < this.layers; z++) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          const geometry = new THREE.BoxGeometry(this.boxWidth, this.boxHeight, this.boxDepth);
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
          const box = new THREE.Mesh(geometry, material);

          box.position.set(
            x * this.boxWidth - (this.columns * this.boxWidth) / 2,
            y * this.boxHeight - (this.rows * this.boxHeight) / 2,
            z * this.boxDepth - (this.layers * this.boxDepth) / 2
          );

          this.scene.add(box);
        }
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Обновляем контроллер OrbitControls
    this.controls.update();

    // Рендерим сцену
    this.renderer.render(this.scene, this.camera);
  }
}