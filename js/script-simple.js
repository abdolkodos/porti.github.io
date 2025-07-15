// Global variables
let scene, camera, renderer, ship;
let isLoading = true;
let scrollY = 0;
let targetRotationY = 0;
let targetRotationX = 0;
let targetCameraY = 0;
let targetCameraZ = 5;

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    
    // Create renderer
    const canvas = document.getElementById('three-canvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add lights
    setupLights();
    
    // Create the ship
    createShip();
    
    // Add ocean
    createOcean();
    
    // Add stars
    createStars();
    
    // Start render loop
    animate();
    
    // Setup event listeners
    setupEventListeners();
}

function setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Point light for dramatic effect
    const pointLight = new THREE.PointLight(0x4facfe, 0.8, 100);
    pointLight.position.set(-10, 5, 10);
    scene.add(pointLight);
}

function createShip() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    
    // Create a basic ship-like geometry
    const shipGroup = new THREE.Group();
    
    // Hull (main body)
    const hullGeometry = new THREE.BoxGeometry(4, 0.8, 1.2);
    const hullMaterial = new THREE.MeshPhongMaterial({
        color: 0x2c3e50,
        shininess: 30,
        specular: 0x111111
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.castShadow = true;
    hull.receiveShadow = true;
    shipGroup.add(hull);
    
    // Superstructure (bridge area)
    const superGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.8);
    const superMaterial = new THREE.MeshPhongMaterial({
        color: 0x34495e,
        shininess: 30
    });
    const superstructure = new THREE.Mesh(superGeometry, superMaterial);
    superstructure.position.set(-1, 0.8, 0);
    superstructure.castShadow = true;
    shipGroup.add(superstructure);
    
    // Containers (cargo area)
    const containerColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
    for (let i = 0; i < 8; i++) {
        const containerGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.3);
        const containerMaterial = new THREE.MeshPhongMaterial({
            color: containerColors[i % containerColors.length]
        });
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        container.position.set(
            0.5 + (i % 4) * 0.5,
            0.6,
            (Math.floor(i / 4) - 0.5) * 0.4
        );
        container.castShadow = true;
        shipGroup.add(container);
    }
    
    // Smokestacks
    const stackGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
    const stackMaterial = new THREE.MeshPhongMaterial({ color: 0x7f8c8d });
    
    for (let i = 0; i < 2; i++) {
        const stack = new THREE.Mesh(stackGeometry, stackMaterial);
        stack.position.set(-1.2 + i * 0.3, 1.2, 0);
        stack.castShadow = true;
        shipGroup.add(stack);
    }
    
    // Set the ship group properties
    ship = shipGroup;
    ship.scale.set(0.8, 0.8, 0.8);
    ship.position.set(0, -1, 0);
    ship.rotation.y = Math.PI;
    
    scene.add(ship);
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 0.2;
        progressBar.style.width = (progress * 100) + '%';
        loadingText.textContent = `Loading: ${Math.round(progress * 100)}%`;
        
        if (progress >= 1) {
            clearInterval(loadingInterval);
            
            // Hide loading screen
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    isLoading = false;
                }, 500);
            }, 500);
            
            loadingText.textContent = 'Ready!';
        }
    }, 200);
}

function createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const oceanMaterial = new THREE.MeshPhongMaterial({
        color: 0x006994,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -2;
    ocean.receiveShadow = true;
    
    scene.add(ocean);
    
    // Animate ocean waves
    function animateOcean() {
        if (ocean) {
            const time = Date.now() * 0.001;
            const vertices = ocean.geometry.attributes.position.array;
            
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const z = vertices[i + 2];
                vertices[i + 1] = Math.sin(x * 0.1 + time) * 0.1 + Math.cos(z * 0.1 + time) * 0.1;
            }
            
            ocean.geometry.attributes.position.needsUpdate = true;
        }
        requestAnimationFrame(animateOcean);
    }
    animateOcean();
}

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: false
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = Math.random() * 100 + 20;
        const z = (Math.random() - 0.5) * 200;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Scroll events
    window.addEventListener('scroll', onScroll);
    
    // Mouse move for subtle interactions
    window.addEventListener('mousemove', onMouseMove);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
    if (isLoading) return;
    
    scrollY = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / maxScroll;
    
    // Update scroll progress indicator
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        progressBar.style.width = (scrollProgress * 100) + '%';
    }
    
    // Calculate scroll-based transformations
    updateScrollAnimations(scrollProgress);
}

function updateScrollAnimations(progress) {
    if (!ship) return;
    
    // Create different animation phases based on scroll progress
    const phase1 = Math.min(progress * 4, 1); // 0-25%
    const phase2 = Math.max(0, Math.min((progress - 0.25) * 4, 1)); // 25-50%
    const phase3 = Math.max(0, Math.min((progress - 0.5) * 4, 1)); // 50-75%
    const phase4 = Math.max(0, Math.min((progress - 0.75) * 4, 1)); // 75-100%
    
    // Phase 1: Introduction - Close-up rotating view
    if (progress < 0.25) {
        targetRotationY = Math.PI + (phase1 * Math.PI * 2);
        targetRotationX = Math.sin(phase1 * Math.PI) * 0.1;
        targetCameraZ = 3 + phase1 * 1;
        targetCameraY = 1 + phase1 * 0.5;
    }
    // Phase 2: Exploration - Medium distance with detailed rotation
    else if (progress < 0.5) {
        targetRotationY = Math.PI + 2 * Math.PI + (phase2 * Math.PI * 3);
        targetRotationX = Math.sin(phase2 * Math.PI * 2) * 0.3;
        targetCameraZ = 4 + phase2 * 3;
        targetCameraY = 1.5 + phase2 * 2;
    }
    // Phase 3: Technical view - Wide angle with specifications focus
    else if (progress < 0.75) {
        targetRotationY = Math.PI + 5 * Math.PI + (phase3 * Math.PI);
        targetRotationX = -0.2 + phase3 * 0.4;
        targetCameraZ = 7 + phase3 * 4;
        targetCameraY = 3.5 + phase3 * 3;
    }
    // Phase 4: Final overview - Aerial perspective
    else {
        targetRotationY = Math.PI + 6 * Math.PI + (phase4 * Math.PI * 2);
        targetRotationX = 0.2 + phase4 * 0.6;
        targetCameraZ = 11 - phase4 * 2;
        targetCameraY = 6.5 + phase4 * 4;
    }
    
    // Smooth ship vertical movement
    const targetShipY = -1 + Math.sin(progress * Math.PI * 3) * 0.3;
    ship.position.y += (targetShipY - ship.position.y) * 0.03;
    
    // Add some ship tilting based on scroll
    const targetShipTilt = Math.sin(progress * Math.PI * 2) * 0.1;
    ship.rotation.z += (targetShipTilt - ship.rotation.z) * 0.02;
}

function onMouseMove(event) {
    if (isLoading || !ship) return;
    
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Subtle ship rotation based on mouse position
    const mouseInfluence = 0.05;
    targetRotationY += mouseX * mouseInfluence;
    targetRotationX += mouseY * mouseInfluence;
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!isLoading && ship) {
        // Smooth rotation interpolation
        ship.rotation.y += (targetRotationY - ship.rotation.y) * 0.05;
        ship.rotation.x += (targetRotationX - ship.rotation.x) * 0.05;
        
        // Smooth camera movement
        camera.position.y += (targetCameraY - camera.position.y) * 0.05;
        camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
        
        // Make camera look at ship
        camera.lookAt(ship.position);
        
        // Add subtle floating animation
        const time = Date.now() * 0.001;
        ship.position.y += Math.sin(time * 0.5) * 0.002;
    }
    
    renderer.render(scene, camera);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    console.log('3D Ship Explorer initialized successfully!');
});

