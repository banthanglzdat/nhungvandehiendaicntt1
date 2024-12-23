// 3D Map Component using Three.js
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';

class Map3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.model = null;
        this.hotspots = [];
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Load 3D model
        this.loadModel();

        // Add event listeners
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            '/assets/models/prison.glb', // Path to your 3D model
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // Add hotspots after model is loaded
                this.addHotspots();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }

    addHotspots() {
        const hotspotData = [
            { position: new THREE.Vector3(2, 1, 0), name: 'Cổng chính', info: 'Cổng vào chính của nhà đày' },
            { position: new THREE.Vector3(-1, 1, 2), name: 'Khu giam giữ', info: 'Khu vực giam giữ tù nhân' },
            { position: new THREE.Vector3(1, 1, -2), name: 'Sân trong', info: 'Sân sinh hoạt chung' }
        ];

        hotspotData.forEach(data => {
            const hotspot = this.createHotspot(data);
            this.hotspots.push(hotspot);
            this.scene.add(hotspot);
        });
    }

    createHotspot(data) {
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const hotspot = new THREE.Mesh(geometry, material);
        
        hotspot.position.copy(data.position);
        hotspot.userData = {
            name: data.name,
            info: data.info
        };

        return hotspot;
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // Method to handle hotspot clicks
    handleHotspotClick(event) {
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        // Calculate mouse position in normalized device coordinates
        const rect = this.container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        // Check for intersections with hotspots
        const intersects = raycaster.intersectObjects(this.hotspots);
        
        if (intersects.length > 0) {
            const hotspot = intersects[0].object;
            this.showHotspotInfo(hotspot.userData);
        }
    }

    showHotspotInfo(data) {
        const infoBox = document.createElement('div');
        infoBox.className = 'hotspot-info';
        infoBox.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.info}</p>
        `;

        // Remove existing info box if any
        const existingInfo = document.querySelector('.hotspot-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        this.container.appendChild(infoBox);
    }
}

export default Map3D;
