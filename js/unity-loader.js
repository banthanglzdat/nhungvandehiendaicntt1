import { 
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    GridHelper,
    AxesHelper,
    Box3,
    Vector3,
    OrbitControls,
    MTLLoader,
    OBJLoader
} from './three.module.js';

let scene, camera, renderer, controls, model;

function showLoading(message = 'Loading model...') {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'block';
        loading.textContent = message;
    }
    console.log(message);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

function init() {
    console.log('Initializing scene...');
    
    // Scene setup
    scene = new Scene();
    scene.background = new Color(0xcccccc);

    // Container setup
    const container = document.getElementById('unityContainer');
    if (!container) {
        console.error('Container not found!');
        return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Camera setup
    camera = new PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(100, 100, 100);

    // Renderer setup
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 1;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 1.5;

    // Lights setup
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight1 = new DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-1, 1, -1);
    scene.add(directionalLight2);

    const hemisphereLight = new HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(hemisphereLight);

    // Helpers
    const gridHelper = new GridHelper(1000, 100);
    scene.add(gridHelper);

    const axesHelper = new AxesHelper(1000);
    scene.add(axesHelper);

    // Load model
    console.log('Starting model load...');
    loadModel();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCamera);
    }
    
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Start animation
    animate();
}

function loadModel() {
    showLoading('Loading materials...');

    const mtlLoader = new MTLLoader();
    const modelPath = '../models/source/';
    mtlLoader.setPath(modelPath);
    
    console.log('Loading MTL from:', modelPath + 'AQUINCUM.mtl');
    
    mtlLoader.load('AQUINCUM.mtl', 
        // Success callback
        function(materials) {
            materials.preload();
            showLoading('Loading 3D model...');

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(modelPath);

            console.log('Loading OBJ from:', modelPath + 'AQUINCUM.obj');

            objLoader.load('AQUINCUM.obj',
                // Success callback 
                function(object) {
                    console.log('Model loaded successfully');
                    model = object;

                    // Scale and center the model
                    const box = new Box3().setFromObject(model);
                    const size = box.getSize(new Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 100 / maxDim;
                    
                    model.scale.multiplyScalar(scale);
                    
                    const center = box.getCenter(new Vector3());
                    model.position.sub(center.multiplyScalar(scale));
                    
                    scene.add(model);
                    console.log('Model added to scene');
                    
                    // Position camera to see the whole model
                    const distance = maxDim * 2;
                    camera.position.set(distance, distance, distance);
                    controls.target.set(0, 0, 0);
                    controls.update();

                    hideLoading();
                },
                // Progress callback
                function(xhr) {
                    if (xhr.lengthComputable) {
                        const progress = xhr.loaded / xhr.total * 100;
                        showLoading(`Loading 3D model... ${Math.round(progress)}%`);
                    }
                },
                // Error callback
                function(error) {
                    console.error('Error loading model:', error);
                    showLoading('Error loading model. Check console for details.');
                }
            );
        },
        // Progress callback
        function(xhr) {
            if (xhr.lengthComputable) {
                const progress = xhr.loaded / xhr.total * 100;
                showLoading(`Loading materials... ${Math.round(progress)}%`);
            }
        },
        // Error callback
        function(error) {
            console.error('Error loading materials:', error);
            showLoading('Error loading materials. Check console for details.');
        }
    );
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    const container = document.getElementById('unityContainer');
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function resetCamera() {
    if (!model || !camera || !controls) return;
    
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2;
    
    camera.position.set(distance, distance, distance);
    controls.target.set(0, 0, 0);
    controls.update();
}

function toggleFullscreen() {
    const container = document.getElementById('unityContainer');
    if (!container) return;

    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
