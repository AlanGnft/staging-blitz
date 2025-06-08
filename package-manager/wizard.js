class CharacterCreationWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.characterData = {
    template: 'geometric',
    shape: 'sphere',
    size: 1.0,
    height: 1.0,
    width: 1.0,
    primaryColor: '#4A90E2',
    material: 'standard',
    metalness: 0.0,
    roughness: 0.5,
    eyes: 'simple',
    mouth: 'smile',
    accessory: 'none',
    particles: 'none',
    animation: 'none',
    name: '',
    description: '',
    category: 'custom',
    abilities: [],
    powerLevel: 5,
    rarity: 'common'
};
        
        // Three.js setup
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.character = null;
        this.autoRotate = true;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setup3DPreview();
        this.generateCharacter();
        this.updateProgressBar();
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('prev-btn').addEventListener('click', () => this.previousStep());
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('create-btn').addEventListener('click', () => this.createCharacter());
        
        // Template selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectTemplate(e.target.closest('.template-card')));
        });
        
        // Shape controls
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectShape(e.target));
        });
        
        // Range inputs
        document.getElementById('body-size').addEventListener('input', (e) => this.updateSize(e.target.value));
        document.getElementById('body-height').addEventListener('input', (e) => this.updateHeight(e.target.value));
        document.getElementById('body-width').addEventListener('input', (e) => this.updateWidth(e.target.value));
        
        // Color controls
        document.getElementById('primary-color').addEventListener('input', (e) => this.updateColor(e.target.value));
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => this.selectColorPreset(e.target));
        });
        
        // Material controls
        document.querySelectorAll('.material-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMaterial(e.target));
        });
        document.getElementById('metalness').addEventListener('input', (e) => this.updateMetalness(e.target.value));
        document.getElementById('roughness').addEventListener('input', (e) => this.updateRoughness(e.target.value));
        
        // Feature controls
        document.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectFeature(e.target));
        });
        
        // Info controls
        document.getElementById('char-name').addEventListener('input', (e) => this.updateName(e.target.value));
        document.getElementById('char-description').addEventListener('input', (e) => this.updateDescription(e.target.value));
        document.getElementById('char-category').addEventListener('change', (e) => this.updateCategory(e.target.value));

        document.getElementById('power-level').addEventListener('input', (e) => this.updatePowerLevel(e.target.value));
document.getElementById('char-rarity').addEventListener('change', (e) => this.updateRarity(e.target.value));

// Power preset buttons
document.querySelectorAll('.power-preset').forEach(btn => {
    btn.addEventListener('click', (e) => this.applyPowerPreset(e.target));
});


        
        // Abilities
        document.querySelector('.add-ability').addEventListener('click', () => this.addAbility());
        
        // Preview controls
        document.getElementById('reset-camera').addEventListener('click', () => this.resetCamera());
        document.getElementById('auto-rotate').addEventListener('click', () => this.toggleAutoRotate());
        
        // Update value displays for range inputs
        document.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const display = e.target.nextElementSibling;
                if (display && display.classList.contains('value-display')) {
                    display.textContent = parseFloat(e.target.value).toFixed(1);
                }
            });
        });
    }
    
    setup3DPreview() {
        const container = document.getElementById('character-preview');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        container.appendChild(this.renderer.domElement);
        
        // Controls (simplified - no OrbitControls import needed)
        this.setupSimpleControls();
        
        // Lighting setup
        this.setupLighting();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    }
    
    setupSimpleControls() {
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
            this.autoRotate = false;
            document.getElementById('auto-rotate').classList.remove('active');
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;
            
            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;
            
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const scale = e.deltaY > 0 ? 1.1 : 0.9;
            this.camera.position.multiplyScalar(scale);
            this.camera.position.clampLength(2, 10);
        });
        
        // Apply smooth rotation
        const updateRotation = () => {
            if (this.character) {
                currentRotationX += (targetRotationX - currentRotationX) * 0.1;
                currentRotationY += (targetRotationY - currentRotationY) * 0.1;
                
                this.character.rotation.x = currentRotationX;
                this.character.rotation.y = currentRotationY;
            }
            requestAnimationFrame(updateRotation);
        };
        updateRotation();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        this.scene.add(keyLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x4A90E2, 0.3);
        fillLight.position.set(-3, 2, 3);
        this.scene.add(fillLight);
        
        // Back light
        const backLight = new THREE.DirectionalLight(0xFF6B9D, 0.2);
        backLight.position.set(0, 3, -5);
        this.scene.add(backLight);
        
        // Top light
        const topLight = new THREE.DirectionalLight(0x7B68EE, 0.3);
        topLight.position.set(0, 10, 0);
        this.scene.add(topLight);
    }
    
    generateCharacter() {
    // Remove existing character
    if (this.character) {
        this.scene.remove(this.character);
    }
    
    // Reset animation data
    this.characterAnimation = null;
    
    // Create new character group
    this.character = new THREE.Group();
    
    // Create body based on shape
    const body = this.createBody();
    this.character.add(body);
    
    // Add features
    this.addEyes();
    this.addMouth();
    this.addAccessory();
    this.addParticleEffects();
    
    // Set up animations
    this.addAnimations();
    
    // Apply transformations
    this.character.scale.set(this.characterData.size, this.characterData.height, this.characterData.width);
    
    // Add to scene
    this.scene.add(this.character);
}
    
    createBody() {
    let geometry;
    const { shape, size } = this.characterData;
    
    switch (shape) {
        case 'cube':
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
            break;
        case 'cone':
            geometry = new THREE.ConeGeometry(0.5, 1, 16);
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(0.4, 0.2, 8, 16);
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(0.6, 0);
            break;
        case 'dodecahedron':
            geometry = new THREE.DodecahedronGeometry(0.6, 0);
            break;
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(0.6, 0);
            break;
        case 'tetrahedron':
            geometry = new THREE.TetrahedronGeometry(0.7, 0);
            break;
        case 'capsule':
            geometry = this.createCapsuleGeometry();
            break;
        case 'ring':
            geometry = new THREE.RingGeometry(0.3, 0.6, 16);
            break;
        case 'plane':
            geometry = new THREE.PlaneGeometry(1, 1);
            break;
        default: // sphere
            geometry = new THREE.SphereGeometry(0.5, 16, 16);
    }
    
    const material = this.createMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
}

createCapsuleGeometry() {
    // Create a capsule using cylinder + two spheres
    const group = new THREE.Group();
    
    // Main cylinder
    const cylinder = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
    const cylinderMesh = new THREE.Mesh(cylinder, this.createMaterial());
    
    // Top sphere
    const topSphere = new THREE.SphereGeometry(0.3, 16, 16);
    const topSphereMesh = new THREE.Mesh(topSphere, this.createMaterial());
    topSphereMesh.position.y = 0.3;
    
    // Bottom sphere
    const bottomSphere = new THREE.SphereGeometry(0.3, 16, 16);
    const bottomSphereMesh = new THREE.Mesh(bottomSphere, this.createMaterial());
    bottomSphereMesh.position.y = -0.3;
    
    group.add(cylinderMesh, topSphereMesh, bottomSphereMesh);
    return group;
}
    
    createMaterial() {
        const { primaryColor, material, metalness, roughness } = this.characterData;
        
        const materialProps = {
            color: new THREE.Color(primaryColor),
            metalness: parseFloat(metalness),
            roughness: parseFloat(roughness)
        };
        
        switch (material) {
            case 'metallic':
                materialProps.metalness = 0.8;
                materialProps.roughness = 0.2;
                break;
            case 'glossy':
                materialProps.metalness = 0.1;
                materialProps.roughness = 0.1;
                break;
            case 'matte':
                materialProps.metalness = 0.0;
                materialProps.roughness = 0.9;
                break;
        }
        
        return new THREE.MeshStandardMaterial(materialProps);
    }
    
    addEyes() {
    if (this.characterData.eyes === 'none') return;
    
    const eyeGroup = new THREE.Group();
    
    switch (this.characterData.eyes) {
        case 'simple':
            this.createSimpleEyes(eyeGroup);
            break;
        case 'large':
            this.createLargeEyes(eyeGroup);
            break;
        case 'glowing':
            this.createGlowingEyes(eyeGroup);
            break;
        case 'laser':
            this.createLaserEyes(eyeGroup);
            break;
        case 'sleepy':
            this.createSleepyEyes(eyeGroup);
            break;
        case 'angry':
            this.createAngryEyes(eyeGroup);
            break;
        case 'kawaii':
            this.createKawaiiEyes(eyeGroup);
            break;
    }
    
    this.character.add(eyeGroup);
}

createSimpleEyes(eyeGroup) {
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.1, 0.4);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.1, 0.4);
    
    eyeGroup.add(leftEye, rightEye);
}

createLargeEyes(eyeGroup) {
    const eyeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.1, 0.4);
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.15, 0.1, 0.45);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.1, 0.4);
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.15, 0.1, 0.45);
    
    eyeGroup.add(leftEye, leftPupil, rightEye, rightPupil);
}

createGlowingEyes(eyeGroup) {
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff,
        emissive: 0x004444,
        emissiveIntensity: 0.7
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.1, 0.4);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.1, 0.4);
    
    eyeGroup.add(leftEye, rightEye);
}

createLaserEyes(eyeGroup) {
    const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0x440000,
        emissiveIntensity: 0.8
    });
    
    // Laser beam effect
    const beamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const beamMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.1, 0.4);
    const leftBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    leftBeam.position.set(-0.15, 0.1, 1.2);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.1, 0.4);
    const rightBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    rightBeam.position.set(0.15, 0.1, 1.2);
    
    eyeGroup.add(leftEye, rightEye, leftBeam, rightBeam);
}

createSleepyEyes(eyeGroup) {
    // Create curved lines for sleepy eyes
    const curve = new THREE.EllipseCurve(0, 0, 0.1, 0.03, 0, Math.PI, false, 0);
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    
    const leftEye = new THREE.Line(geometry, material);
    leftEye.position.set(-0.15, 0.12, 0.4);
    
    const rightEye = new THREE.Line(geometry, material);
    rightEye.position.set(0.15, 0.12, 0.4);
    
    eyeGroup.add(leftEye, rightEye);
}

createAngryEyes(eyeGroup) {
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    
    // Create angry eyebrows
    const browGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.05);
    const browMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.1, 0.4);
    const leftBrow = new THREE.Mesh(browGeometry, browMaterial);
    leftBrow.position.set(-0.15, 0.2, 0.4);
    leftBrow.rotation.z = 0.3;
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.1, 0.4);
    const rightBrow = new THREE.Mesh(browGeometry, browMaterial);
    rightBrow.position.set(0.15, 0.2, 0.4);
    rightBrow.rotation.z = -0.3;
    
    eyeGroup.add(leftEye, rightEye, leftBrow, rightBrow);
}

createKawaiiEyes(eyeGroup) {
    // Large sparkly eyes with highlights
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const highlightGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const highlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.3
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.1, 0.4);
    const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    leftHighlight.position.set(-0.12, 0.15, 0.43);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.1, 0.4);
    const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    rightHighlight.position.set(0.18, 0.15, 0.43);
    
    eyeGroup.add(leftEye, rightEye, leftHighlight, rightHighlight);
}
    
    addMouth() {
    if (this.characterData.mouth === 'none') return;
    
    const mouthGroup = new THREE.Group();
    
    switch (this.characterData.mouth) {
        case 'smile':
            this.createSmileMouth(mouthGroup);
            break;
        case 'frown':
            this.createFrownMouth(mouthGroup);
            break;
        case 'surprised':
            this.createSurprisedMouth(mouthGroup);
            break;
        case 'fangs':
            this.createFangsMouth(mouthGroup);
            break;
        case 'grin':
            this.createGrinMouth(mouthGroup);
            break;
        case 'tongue':
            this.createTongueMouth(mouthGroup);
            break;
        case 'mustache':
            this.createMustacheMouth(mouthGroup);
            break;
    }
    
    this.character.add(mouthGroup);
}

createSmileMouth(mouthGroup) {
    const curve = new THREE.EllipseCurve(0, 0, 0.15, 0.08, 0, Math.PI, false, 0);
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const smile = new THREE.Line(geometry, material);
    smile.position.set(0, -0.1, 0.4);
    smile.rotation.z = Math.PI;
    mouthGroup.add(smile);
}

createFrownMouth(mouthGroup) {
    const curve = new THREE.EllipseCurve(0, 0, 0.15, 0.08, 0, Math.PI, false, 0);
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const frown = new THREE.Line(geometry, material);
    frown.position.set(0, -0.1, 0.4);
    mouthGroup.add(frown);
}

createSurprisedMouth(mouthGroup) {
    const geometry = new THREE.RingGeometry(0.04, 0.06, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const mouth = new THREE.Mesh(geometry, material);
    mouth.position.set(0, -0.1, 0.4);
    mouthGroup.add(mouth);
}

createFangsMouth(mouthGroup) {
    // Base mouth
    const curve = new THREE.EllipseCurve(0, 0, 0.12, 0.06, 0, Math.PI, false, 0);
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const mouth = new THREE.Line(geometry, material);
    mouth.position.set(0, -0.1, 0.4);
    mouth.rotation.z = Math.PI;
    
    // Fangs
    const fangGeometry = new THREE.ConeGeometry(0.02, 0.08, 6);
    const fangMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const leftFang = new THREE.Mesh(fangGeometry, fangMaterial);
    leftFang.position.set(-0.06, -0.08, 0.42);
    leftFang.rotation.x = Math.PI;
    
    const rightFang = new THREE.Mesh(fangGeometry, fangMaterial);
    rightFang.position.set(0.06, -0.08, 0.42);
    rightFang.rotation.x = Math.PI;
    
    mouthGroup.add(mouth, leftFang, rightFang);
}

createGrinMouth(mouthGroup) {
    // Wide grin
    const curve = new THREE.EllipseCurve(0, 0, 0.25, 0.12, 0, Math.PI, false, 0);
    const points = curve.getPoints(30);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 });
    const grin = new THREE.Line(geometry, material);
    grin.position.set(0, -0.1, 0.4);
    grin.rotation.z = Math.PI;
    
    // Teeth
    for (let i = 0; i < 6; i++) {
        const toothGeometry = new THREE.BoxGeometry(0.03, 0.04, 0.02);
        const toothMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
        tooth.position.set(-0.15 + (i * 0.06), -0.08, 0.42);
        mouthGroup.add(tooth);
    }
    
    mouthGroup.add(grin);
}

createTongueMouth(mouthGroup) {
    // Base mouth
    const geometry = new THREE.RingGeometry(0.05, 0.08, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const mouth = new THREE.Mesh(geometry, material);
    mouth.position.set(0, -0.1, 0.4);
    
    // Tongue
    const tongueGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const tongueMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b9d });
    const tongue = new THREE.Mesh(tongueGeometry, tongueMaterial);
    tongue.position.set(0, -0.15, 0.45);
    tongue.scale.set(1.5, 0.8, 1);
    
    mouthGroup.add(mouth, tongue);
}

createMustacheMouth(mouthGroup) {
    // Simple smile
    const curve = new THREE.EllipseCurve(0, 0, 0.12, 0.06, 0, Math.PI, false, 0);
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const smile = new THREE.Line(geometry, material);
    smile.position.set(0, -0.1, 0.4);
    smile.rotation.z = Math.PI;
    
    // Mustache
    const mustacheGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const mustacheMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
    const mustache = new THREE.Mesh(mustacheGeometry, mustacheMaterial);
    mustache.position.set(0, -0.05, 0.42);
    mustache.scale.set(2, 0.5, 0.8);
    
    mouthGroup.add(smile, mustache);
}
    
    addAccessory() {
    if (this.characterData.accessory === 'none') return;
    
    const accessoryGroup = new THREE.Group();
    
    switch (this.characterData.accessory) {
        case 'hat':
            this.createHat(accessoryGroup);
            break;
        case 'crown':
            this.createCrown(accessoryGroup);
            break;
        case 'antennae':
            this.createAntennae(accessoryGroup);
            break;
        case 'spikes':
            this.createSpikes(accessoryGroup);
            break;
        case 'wings':
            this.createWings(accessoryGroup);
            break;
        case 'halo':
            this.createHalo(accessoryGroup);
            break;
        case 'horns':
           this.createHorns(accessoryGroup);
           break;
       case 'cape':
           this.createCape(accessoryGroup);
           break;
   }
   
   this.character.add(accessoryGroup);
}

addParticleEffects() {
    if (this.characterData.particles === 'none') return;
    
    const particleGroup = new THREE.Group();
    
    switch (this.characterData.particles) {
        case 'sparkles':
            this.createSparkleParticles(particleGroup);
            break;
        case 'fire':
            this.createFireParticles(particleGroup);
            break;
        case 'ice':
            this.createIceParticles(particleGroup);
            break;
        case 'stars':
            this.createStarParticles(particleGroup);
            break;
        case 'hearts':
            this.createHeartParticles(particleGroup);
            break;
        case 'lightning':
            this.createLightningParticles(particleGroup);
            break;
        case 'bubbles':
            this.createBubbleParticles(particleGroup);
            break;
    }
    
    this.character.add(particleGroup);
}

createSparkleParticles(particleGroup) {
    for (let i = 0; i < 20; i++) {
        const sparkleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
        const sparkleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffaa,
            emissiveIntensity: 0.5
        });
        const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
        
        sparkle.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        
        particleGroup.add(sparkle);
    }
}

createFireParticles(particleGroup) {
    for (let i = 0; i < 15; i++) {
        const flameGeometry = new THREE.SphereGeometry(0.03, 6, 6);
        const flameMaterial = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color().setHSL(0.1 - Math.random() * 0.1, 1, 0.5),
            emissive: 0xff4400,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.8
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        
        flame.position.set(
            (Math.random() - 0.5) * 1.5,
            Math.random() * 1.5,
            (Math.random() - 0.5) * 1.5
        );
        
        particleGroup.add(flame);
    }
}

createIceParticles(particleGroup) {
    for (let i = 0; i < 12; i++) {
        const crystalGeometry = new THREE.OctahedronGeometry(0.04, 0);
        const crystalMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x87ceeb,
            emissive: 0x004466,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.7
        });
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        
        crystal.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        crystal.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        particleGroup.add(crystal);
    }
}

createStarParticles(particleGroup) {
    for (let i = 0; i < 10; i++) {
        const starGeometry = new THREE.SphereGeometry(0.03, 5, 5);
        const starMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.6
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        star.position.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
        );
        
        particleGroup.add(star);
    }
}

createHeartParticles(particleGroup) {
    for (let i = 0; i < 8; i++) {
        // Simple heart shape using two spheres
        const heartGroup = new THREE.Group();
        
        const leftHeart = new THREE.SphereGeometry(0.03, 8, 8);
        const leftMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff69b4,
            emissive: 0x660033,
            emissiveIntensity: 0.3
        });
        const leftMesh = new THREE.Mesh(leftHeart, leftMaterial);
        leftMesh.position.set(-0.02, 0.01, 0);
        
        const rightHeart = new THREE.SphereGeometry(0.03, 8, 8);
        const rightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff69b4,
            emissive: 0x660033,
            emissiveIntensity: 0.3
        });
        const rightMesh = new THREE.Mesh(rightHeart, rightMaterial);
        rightMesh.position.set(0.02, 0.01, 0);
        
        const bottomHeart = new THREE.ConeGeometry(0.04, 0.06, 4);
        const bottomMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff69b4,
            emissive: 0x660033,
            emissiveIntensity: 0.3
        });
        const bottomMesh = new THREE.Mesh(bottomHeart, bottomMaterial);
        bottomMesh.position.set(0, -0.03, 0);
        bottomMesh.rotation.x = Math.PI;
        
        heartGroup.add(leftMesh, rightMesh, bottomMesh);
        heartGroup.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        
        particleGroup.add(heartGroup);
    }
}

createLightningParticles(particleGroup) {
    for (let i = 0; i < 6; i++) {
        const boltGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 4);
        const boltMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.8
        });
        const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
        
        bolt.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        bolt.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        particleGroup.add(bolt);
    }
}

createBubbleParticles(particleGroup) {
    for (let i = 0; i < 15; i++) {
        const bubbleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const bubbleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.3,
            emissive: 0x004466,
            emissiveIntensity: 0.1
        });
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        bubble.position.set(
            (Math.random() - 0.5) * 2,
            Math.random() * 2,
            (Math.random() - 0.5) * 2
        );
        
        particleGroup.add(bubble);
    }
}

addAnimations() {
    if (this.characterData.animation === 'none') return;
    
    // Store animation data for the animate loop
    this.characterAnimation = {
        type: this.characterData.animation,
        time: 0
    };
}

updateCharacterAnimation() {
    if (!this.characterAnimation || !this.character) return;
    
    this.characterAnimation.time += 0.016; // Roughly 60fps
    const time = this.characterAnimation.time;
    
    switch (this.characterAnimation.type) {
        case 'bounce':
            this.character.position.y = Math.sin(time * 4) * 0.2;
            break;
        case 'spin':
            this.character.rotation.y = time * 2;
            break;
        case 'float':
            this.character.position.y = Math.sin(time * 2) * 0.1;
            this.character.rotation.z = Math.sin(time * 1.5) * 0.1;
            break;
        case 'pulse':
            const scale = 1 + Math.sin(time * 3) * 0.1;
            this.character.scale.set(scale, scale, scale);
            break;
        case 'wobble':
            this.character.rotation.x = Math.sin(time * 3) * 0.2;
            this.character.rotation.z = Math.cos(time * 2.5) * 0.15;
            break;
        case 'slide':
            this.character.position.x = Math.sin(time * 1.5) * 0.3;
            break;
    }
}

createHat(accessoryGroup) {
   const brimGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 16);
   const brimMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
   const brim = new THREE.Mesh(brimGeometry, brimMaterial);
   brim.position.set(0, 0.45, 0);
   
   const crownGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
   const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
   const crown = new THREE.Mesh(crownGeometry, crownMaterial);
   crown.position.set(0, 0.6, 0);
   
   accessoryGroup.add(brim, crown);
}

createCrown(accessoryGroup) {
   // Base crown ring
   const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
   const baseMaterial = new THREE.MeshStandardMaterial({ 
       color: 0xffd700,
       metalness: 0.8,
       roughness: 0.2
   });
   const base = new THREE.Mesh(baseGeometry, baseMaterial);
   base.position.set(0, 0.5, 0);
   
   // Crown spikes
   for (let i = 0; i < 8; i++) {
       const spikeGeometry = new THREE.ConeGeometry(0.05, 0.2, 6);
       const spikeMaterial = new THREE.MeshStandardMaterial({ 
           color: 0xffd700,
           metalness: 0.8,
           roughness: 0.2
       });
       const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
       const angle = (i / 8) * Math.PI * 2;
       spike.position.set(Math.cos(angle) * 0.35, 0.65, Math.sin(angle) * 0.35);
       accessoryGroup.add(spike);
   }
   
   accessoryGroup.add(base);
}

createAntennae(accessoryGroup) {
   const stalkGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
   const stalkMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
   
   const ballGeometry = new THREE.SphereGeometry(0.05, 8, 8);
   const ballMaterial = new THREE.MeshStandardMaterial({ 
       color: 0xff0000,
       emissive: 0x440000,
       emissiveIntensity: 0.3
   });
   
   const leftStalk = new THREE.Mesh(stalkGeometry, stalkMaterial);
   leftStalk.position.set(-0.15, 0.6, 0);
   const leftBall = new THREE.Mesh(ballGeometry, ballMaterial);
   leftBall.position.set(-0.15, 0.8, 0);
   
   const rightStalk = new THREE.Mesh(stalkGeometry, stalkMaterial);
   rightStalk.position.set(0.15, 0.6, 0);
   const rightBall = new THREE.Mesh(ballGeometry, ballMaterial);
   rightBall.position.set(0.15, 0.8, 0);
   
   accessoryGroup.add(leftStalk, leftBall, rightStalk, rightBall);
}

createSpikes(accessoryGroup) {
   const spikeGeometry = new THREE.ConeGeometry(0.08, 0.2, 6);
   const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
   
   for (let i = 0; i < 12; i++) {
       const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
       const angle = (i / 12) * Math.PI * 2;
       const radius = 0.6;
       spike.position.set(
           Math.cos(angle) * radius, 
           Math.sin(angle * 2) * 0.3, 
           Math.sin(angle) * radius
       );
       spike.rotation.z = -angle + Math.PI / 2;
       accessoryGroup.add(spike);
   }
}

createWings(accessoryGroup) {
   const wingGeometry = new THREE.SphereGeometry(0.3, 8, 8);
   const wingMaterial = new THREE.MeshStandardMaterial({ 
       color: 0xffffff,
       transparent: true,
       opacity: 0.8
   });
   
   const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
   leftWing.position.set(-0.4, 0, -0.2);
   leftWing.scale.set(0.3, 1.5, 0.1);
   leftWing.rotation.z = 0.3;
   
   const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
   rightWing.position.set(0.4, 0, -0.2);
   rightWing.scale.set(0.3, 1.5, 0.1);
   rightWing.rotation.z = -0.3;
   
   accessoryGroup.add(leftWing, rightWing);
}

createHalo(accessoryGroup) {
   const haloGeometry = new THREE.TorusGeometry(0.3, 0.03, 8, 16);
   const haloMaterial = new THREE.MeshStandardMaterial({ 
       color: 0xffd700,
       emissive: 0xffaa00,
       emissiveIntensity: 0.3
   });
   const halo = new THREE.Mesh(haloGeometry, haloMaterial);
   halo.position.set(0, 0.8, 0);
   halo.rotation.x = Math.PI / 2;
   
   accessoryGroup.add(halo);
}

createHorns(accessoryGroup) {
   const hornGeometry = new THREE.ConeGeometry(0.06, 0.25, 8);
   const hornMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
   
   const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
   leftHorn.position.set(-0.2, 0.6, 0);
   leftHorn.rotation.z = 0.3;
   
   const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
   rightHorn.position.set(0.2, 0.6, 0);
   rightHorn.rotation.z = -0.3;
   
   accessoryGroup.add(leftHorn, rightHorn);
}

createCape(accessoryGroup) {
   const capeGeometry = new THREE.PlaneGeometry(0.8, 1.2);
   const capeMaterial = new THREE.MeshStandardMaterial({ 
       color: 0x8b0000,
       side: THREE.DoubleSide
   });
   const cape = new THREE.Mesh(capeGeometry, capeMaterial);
   cape.position.set(0, -0.2, -0.4);
   cape.rotation.x = 0.2;
   
   accessoryGroup.add(cape);
}
    
    animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Update character animations
    this.updateCharacterAnimation();
    
    // Auto-rotate if enabled (but don't override character animations)
    if (this.autoRotate && this.character && (!this.characterAnimation || this.characterAnimation.type !== 'spin')) {
        this.character.rotation.y += 0.01;
    }
    
    this.renderer.render(this.scene, this.camera);
}   
    
    onWindowResize() {
        const container = document.getElementById('character-preview');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    // Step Navigation
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStep();
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStep();
        }
    }
    
    updateStep() {
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        document.getElementById(`step-${this.currentStep}`).classList.add('active');
        
        // Update navigation buttons
        document.getElementById('prev-btn').disabled = this.currentStep === 1;
        
        if (this.currentStep === this.totalSteps) {
            document.getElementById('next-btn').style.display = 'none';
            document.getElementById('create-btn').style.display = 'block';
        } else {
            document.getElementById('next-btn').style.display = 'block';
            document.getElementById('create-btn').style.display = 'none';
        }
        
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
    }
    
    // Template Selection
    selectTemplate(card) {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.characterData.template = card.dataset.template;
        this.applyTemplate();
    }
    
    applyTemplate() {
    const templates = {
        geometric: { 
            shape: 'cube', primaryColor: '#4A90E2', material: 'standard',
            eyes: 'simple', mouth: 'none', accessory: 'none', particles: 'none', animation: 'spin'
        },
        organic: { 
            shape: 'sphere', primaryColor: '#96CEB4', material: 'matte',
            eyes: 'large', mouth: 'smile', accessory: 'none', particles: 'sparkles', animation: 'float'
        },
        mechanical: { 
            shape: 'cylinder', primaryColor: '#666666', material: 'metallic',
            eyes: 'laser', mouth: 'none', accessory: 'antennae', particles: 'lightning', animation: 'none'
        },
        food: { 
            shape: 'torus', primaryColor: '#FECA57', material: 'glossy',
            eyes: 'kawaii', mouth: 'smile', accessory: 'none', particles: 'hearts', animation: 'bounce'
        },
        creature: { 
            shape: 'sphere', primaryColor: '#FF6B9D', material: 'standard',
            eyes: 'glowing', mouth: 'fangs', accessory: 'horns', particles: 'fire', animation: 'wobble'
        },
        space: { 
            shape: 'octahedron', primaryColor: '#8B5CF6', material: 'metallic',
            eyes: 'glowing', mouth: 'none', accessory: 'antennae', particles: 'stars', animation: 'spin'
        },
        nature: { 
            shape: 'sphere', primaryColor: '#10B981', material: 'matte',
            eyes: 'simple', mouth: 'smile', accessory: 'none', particles: 'sparkles', animation: 'float'
        },
        action: { 
            shape: 'capsule', primaryColor: '#EF4444', material: 'standard',
            eyes: 'angry', mouth: 'grin', accessory: 'cape', particles: 'lightning', animation: 'pulse'
        },
        cute: { 
            shape: 'sphere', primaryColor: '#F472B6', material: 'glossy',
            eyes: 'kawaii', mouth: 'smile', accessory: 'halo', particles: 'hearts', animation: 'bounce'
        },
        spooky: { 
            shape: 'sphere', primaryColor: '#6B7280', material: 'matte',
            eyes: 'glowing', mouth: 'fangs', accessory: 'horns', particles: 'fire', animation: 'float'
        },
        elemental: { 
            shape: 'icosahedron', primaryColor: '#F59E0B', material: 'standard',
            eyes: 'glowing', mouth: 'none', accessory: 'none', particles: 'fire', animation: 'pulse'
        },
        custom: { 
            shape: 'sphere', primaryColor: '#4A90E2', material: 'standard',
            eyes: 'simple', mouth: 'smile', accessory: 'none', particles: 'none', animation: 'none'
        }
    };
    
    const template = templates[this.characterData.template];
    if (template) {
        Object.assign(this.characterData, template);
        this.updateUIFromData();
        this.generateCharacter();
    }
}
    
    updateUIFromData() {
        // Update shape buttons
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.shape === this.characterData.shape);
        });
        
        // Update color picker
        document.getElementById('primary-color').value = this.characterData.primaryColor;
        
        // Update material buttons
        document.querySelectorAll('.material-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.material === this.characterData.material);
        });
        
        // Update sliders
        document.getElementById('body-size').value = this.characterData.size;
        document.getElementById('body-height').value = this.characterData.height;
        document.getElementById('body-width').value = this.characterData.width;
        document.getElementById('metalness').value = this.characterData.metalness;
        document.getElementById('roughness').value = this.characterData.roughness;
        
        // Update value displays
        document.querySelectorAll('input[type="range"]').forEach(input => {
            const display = input.nextElementSibling;
            if (display && display.classList.contains('value-display')) {
                display.textContent = parseFloat(input.value).toFixed(1);
            }
        });
    }
    
    // Control Handlers
    selectShape(btn) {
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.characterData.shape = btn.dataset.shape;
        this.generateCharacter();
    }
    
    updateSize(value) {
        this.characterData.size = parseFloat(value);
        this.generateCharacter();
    }
    
    updateHeight(value) {
        this.characterData.height = parseFloat(value);
        this.generateCharacter();
    }
    
    updateWidth(value) {
        this.characterData.width = parseFloat(value);
        this.generateCharacter();
    }
    
    updateColor(color) {
        this.characterData.primaryColor = color;
        this.generateCharacter();
    }
    
    selectColorPreset(preset) {
        const color = preset.dataset.color;
        this.characterData.primaryColor = color;
        document.getElementById('primary-color').value = color;
        this.generateCharacter();
    }
    
    selectMaterial(btn) {
        document.querySelectorAll('.material-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.characterData.material = btn.dataset.material;
        this.generateCharacter();
    }
    
    updateMetalness(value) {
        this.characterData.metalness = parseFloat(value);
        this.generateCharacter();
    }
    
    updateRoughness(value) {
        this.characterData.roughness = parseFloat(value);
        this.generateCharacter();
    }
    
    selectFeature(btn) {
        const feature = btn.dataset.feature;
        const type = btn.dataset.type;
        
        // Remove active from same feature group
        document.querySelectorAll(`[data-feature="${feature}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.characterData[feature] = type;
        this.generateCharacter();
    }
    
    updateName(name) {
        this.characterData.name = name;
    }
    
    updateDescription(description) {
        this.characterData.description = description;
    }
    
    updateCategory(category) {
        this.characterData.category = category;
    }
    
    addAbility() {
        const container = document.querySelector('.abilities-list');
        const abilityDiv = document.createElement('div');
        abilityDiv.className = 'ability-input';
        abilityDiv.innerHTML = `
            <input type="text" placeholder="e.g., Speed Boost">
            <button class="remove-ability" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(abilityDiv);
    }
    
    resetCamera() {
        this.camera.position.set(0, 0, 5);
        if (this.character) {
            this.character.rotation.set(0, 0, 0);
        }
    }
    
    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        document.getElementById('auto-rotate').classList.toggle('active', this.autoRotate);
    }
    
    createCharacter() {
        // Gather all abilities
        const abilityInputs = document.querySelectorAll('.ability-input input');
        this.characterData.abilities = Array.from(abilityInputs)
            .map(input => input.value.trim())
            .filter(ability => ability.length > 0);
        
        // Validate required fields
        if (!this.characterData.name.trim()) {
            alert('Please enter a character name!');
            return;
        }
        
        // Generate the character code
        const characterCode = this.generateCharacterCode();
        
        // Create download
        this.downloadCharacterFile(characterCode);
        
        // Show success message
        this.showSuccessMessage();
    }
    
    generateCharacterCode() {
        const name = this.characterData.name.replace(/[^a-zA-Z0-9]/g, '');
        const functionName = `create${name}Character`;
        
        return `// Generated by Running Blitz Character Creation Wizard
// Character: ${this.characterData.name}

function ${functionName}() {
    const ${name.toLowerCase()}Group = new THREE.Group();
    
    // Create body
    const body = create${name}Body();
    ${name.toLowerCase()}Group.add(body);
    
    // Add features
    ${this.generateFeatureCode(name.toLowerCase())}
    
    // Apply transformations
    ${name.toLowerCase()}Group.scale.set(${this.characterData.size}, ${this.characterData.height}, ${this.characterData.width});
    
    return ${name.toLowerCase()}Group;
}

function create${name}Body() {
    ${this.generateBodyCode()}
    
    const material = new THREE.MeshStandardMaterial({
        color: 0x${this.characterData.primaryColor.substring(1)},
        metalness: ${this.characterData.metalness},
        roughness: ${this.characterData.roughness}
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
}

${this.generateFeatureFunctions(name)}

// Character metadata
const ${name.toLowerCase()}CharacterData = {
    id: '${name.toLowerCase()}',
    name: '${this.characterData.name}',
    description: '${this.characterData.description || 'A custom character created with the Character Wizard!'}',
    abilities: ${JSON.stringify(this.characterData.abilities)},
    tags: ['${this.characterData.category}', 'custom', 'wizard-created'],
    createFunction: '${functionName}'
};

// Export to global scope
if (typeof window !== 'undefined') {
    window.${functionName} = ${functionName};
    window.${name.toLowerCase()}CharacterData = ${name.toLowerCase()}CharacterData;
}`;
    }
    
    generateBodyCode() {
       switch (this.characterData.shape) {
           case 'cube':
               return `const geometry = new THREE.BoxGeometry(1, 1, 1);`;
           case 'cylinder':
               return `const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);`;
           case 'cone':
               return `const geometry = new THREE.ConeGeometry(0.5, 1, 16);`;
           case 'torus':
               return `const geometry = new THREE.TorusGeometry(0.4, 0.2, 8, 16);`;
           default: // sphere
               return `const geometry = new THREE.SphereGeometry(0.5, 16, 16);`;
       }
   }
   
   generateFeatureCode(name) {
       let code = '';
       
       if (this.characterData.eyes !== 'none') {
           code += `    const eyes = create${name.charAt(0).toUpperCase() + name.slice(1)}Eyes();\n`;
           code += `    ${name}Group.add(eyes);\n\n`;
       }
       
       if (this.characterData.mouth !== 'none') {
           code += `    const mouth = create${name.charAt(0).toUpperCase() + name.slice(1)}Mouth();\n`;
           code += `    ${name}Group.add(mouth);\n\n`;
       }
       
       if (this.characterData.accessory !== 'none') {
           code += `    const accessory = create${name.charAt(0).toUpperCase() + name.slice(1)}Accessory();\n`;
           code += `    ${name}Group.add(accessory);\n\n`;
       }
       
       return code;
   }
   
   generateFeatureFunctions(name) {
       let functions = '';
       
       // Eyes function
       if (this.characterData.eyes !== 'none') {
           functions += `\nfunction create${name}Eyes() {\n`;
           functions += `    const eyeGroup = new THREE.Group();\n\n`;
           
           switch (this.characterData.eyes) {
               case 'simple':
                   functions += `    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);\n`;
                   functions += `    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });\n\n`;
                   functions += `    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);\n`;
                   functions += `    leftEye.position.set(-0.15, 0.1, 0.4);\n\n`;
                   functions += `    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);\n`;
                   functions += `    rightEye.position.set(0.15, 0.1, 0.4);\n\n`;
                   functions += `    eyeGroup.add(leftEye, rightEye);\n`;
                   break;
               case 'large':
                   functions += `    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);\n`;
                   functions += `    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });\n`;
                   functions += `    const pupilGeometry = new THREE.SphereGeometry(0.05, 8, 8);\n`;
                   functions += `    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });\n\n`;
                   functions += `    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);\n`;
                   functions += `    leftEye.position.set(-0.15, 0.1, 0.4);\n`;
                   functions += `    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);\n`;
                   functions += `    leftPupil.position.set(-0.15, 0.1, 0.45);\n\n`;
                   functions += `    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);\n`;
                   functions += `    rightEye.position.set(0.15, 0.1, 0.4);\n`;
                   functions += `    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);\n`;
                   functions += `    rightPupil.position.set(0.15, 0.1, 0.45);\n\n`;
                   functions += `    eyeGroup.add(leftEye, leftPupil, rightEye, rightPupil);\n`;
                   break;
               case 'glowing':
                   functions += `    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);\n`;
                   functions += `    const eyeMaterial = new THREE.MeshStandardMaterial({\n`;
                   functions += `        color: 0x00ffff,\n`;
                   functions += `        emissive: 0x004444,\n`;
                   functions += `        emissiveIntensity: 0.5\n`;
                   functions += `    });\n\n`;
                   functions += `    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);\n`;
                   functions += `    leftEye.position.set(-0.15, 0.1, 0.4);\n\n`;
                   functions += `    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);\n`;
                   functions += `    rightEye.position.set(0.15, 0.1, 0.4);\n\n`;
                   functions += `    eyeGroup.add(leftEye, rightEye);\n`;
                   break;
           }
           
           functions += `\n    return eyeGroup;\n}\n`;
       }
       
       // Mouth function
       if (this.characterData.mouth !== 'none') {
           functions += `\nfunction create${name}Mouth() {\n`;
           functions += `    const mouthGroup = new THREE.Group();\n\n`;
           
           switch (this.characterData.mouth) {
               case 'smile':
                   functions += `    const curve = new THREE.EllipseCurve(0, 0, 0.15, 0.08, 0, Math.PI, false, 0);\n`;
                   functions += `    const points = curve.getPoints(20);\n`;
                   functions += `    const geometry = new THREE.BufferGeometry().setFromPoints(points);\n`;
                   functions += `    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });\n`;
                   functions += `    const smile = new THREE.Line(geometry, material);\n`;
                   functions += `    smile.position.set(0, -0.1, 0.4);\n`;
                   functions += `    smile.rotation.z = Math.PI;\n`;
                   functions += `    mouthGroup.add(smile);\n`;
                   break;
               case 'frown':
                   functions += `    const curve = new THREE.EllipseCurve(0, 0, 0.15, 0.08, 0, Math.PI, false, 0);\n`;
                   functions += `    const points = curve.getPoints(20);\n`;
                   functions += `    const geometry = new THREE.BufferGeometry().setFromPoints(points);\n`;
                   functions += `    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });\n`;
                   functions += `    const frown = new THREE.Line(geometry, material);\n`;
                   functions += `    frown.position.set(0, -0.1, 0.4);\n`;
                   functions += `    mouthGroup.add(frown);\n`;
                   break;
               case 'surprised':
                   functions += `    const geometry = new THREE.RingGeometry(0.03, 0.05, 8);\n`;
                   functions += `    const material = new THREE.MeshStandardMaterial({ color: 0x000000 });\n`;
                   functions += `    const mouth = new THREE.Mesh(geometry, material);\n`;
                   functions += `    mouth.position.set(0, -0.1, 0.4);\n`;
                   functions += `    mouthGroup.add(mouth);\n`;
                   break;
           }
           
           functions += `\n    return mouthGroup;\n}\n`;
       }
       
       // Accessory function
       if (this.characterData.accessory !== 'none') {
           functions += `\nfunction create${name}Accessory() {\n`;
           functions += `    const accessoryGroup = new THREE.Group();\n\n`;
           
           switch (this.characterData.accessory) {
               case 'hat':
                   functions += `    const brimGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 16);\n`;
                   functions += `    const brimMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });\n`;
                   functions += `    const brim = new THREE.Mesh(brimGeometry, brimMaterial);\n`;
                   functions += `    brim.position.set(0, 0.45, 0);\n\n`;
                   functions += `    const crownGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);\n`;
                   functions += `    const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });\n`;
                   functions += `    const crown = new THREE.Mesh(crownGeometry, crownMaterial);\n`;
                   functions += `    crown.position.set(0, 0.6, 0);\n\n`;
                   functions += `    accessoryGroup.add(brim, crown);\n`;
                   break;
               case 'antennae':
                   functions += `    const stalkGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);\n`;
                   functions += `    const stalkMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });\n\n`;
                   functions += `    const ballGeometry = new THREE.SphereGeometry(0.05, 8, 8);\n`;
                   functions += `    const ballMaterial = new THREE.MeshStandardMaterial({\n`;
                   functions += `        color: 0xff0000,\n`;
                   functions += `        emissive: 0x440000,\n`;
                   functions += `        emissiveIntensity: 0.3\n`;
                   functions += `    });\n\n`;
                   functions += `    const leftStalk = new THREE.Mesh(stalkGeometry, stalkMaterial);\n`;
                   functions += `    leftStalk.position.set(-0.15, 0.6, 0);\n`;
                   functions += `    const leftBall = new THREE.Mesh(ballGeometry, ballMaterial);\n`;
                   functions += `    leftBall.position.set(-0.15, 0.8, 0);\n\n`;
                   functions += `    const rightStalk = new THREE.Mesh(stalkGeometry, stalkMaterial);\n`;
                   functions += `    rightStalk.position.set(0.15, 0.6, 0);\n`;
                   functions += `    const rightBall = new THREE.Mesh(ballGeometry, ballMaterial);\n`;
                   functions += `    rightBall.position.set(0.15, 0.8, 0);\n\n`;
                   functions += `    accessoryGroup.add(leftStalk, leftBall, rightStalk, rightBall);\n`;
                   break;
               case 'spikes':
                   functions += `    const spikeGeometry = new THREE.ConeGeometry(0.08, 0.2, 6);\n`;
                   functions += `    const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });\n\n`;
                   functions += `    for (let i = 0; i < 8; i++) {\n`;
                   functions += `        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);\n`;
                   functions += `        const angle = (i / 8) * Math.PI * 2;\n`;
                   functions += `        spike.position.set(Math.cos(angle) * 0.6, Math.sin(angle) * 0.3, 0);\n`;
                   functions += `        spike.rotation.z = -angle + Math.PI / 2;\n`;
                   functions += `        accessoryGroup.add(spike);\n`;
                   functions += `    }\n`;
                   break;
           }
           
           functions += `\n    return accessoryGroup;\n}\n`;
       }
       
       return functions;
   }
   
   downloadCharacterFile(code) {
       const name = this.characterData.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
       const filename = `${name}.js`;
       
       const blob = new Blob([code], { type: 'text/javascript' });
       const url = URL.createObjectURL(blob);
       
       const a = document.createElement('a');
       a.href = url;
       a.download = filename;
       a.style.display = 'none';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
   }
   
   showSuccessMessage() {
       const message = document.createElement('div');
       message.style.cssText = `
           position: fixed;
           top: 50%;
           left: 50%;
           transform: translate(-50%, -50%);
           background: linear-gradient(45deg, #4A90E2, #7B68EE);
           color: white;
           padding: 30px;
           border-radius: 20px;
           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
           text-align: center;
           z-index: 10000;
           font-family: inherit;
       `;
       
       message.innerHTML = `
           <h2 style="margin: 0 0 15px 0; font-size: 1.5rem;">🎉 Character Created!</h2>
           <p style="margin: 0 0 20px 0;">Your character "${this.characterData.name}" has been generated and downloaded!</p>
           <div style="display: flex; gap: 15px; justify-content: center;">
               <button onclick="this.parentElement.parentElement.remove()" style="
                   background: rgba(255, 255, 255, 0.2);
                   border: 2px solid rgba(255, 255, 255, 0.3);
                   color: white;
                   padding: 10px 20px;
                   border-radius: 10px;
                   cursor: pointer;
                   font-family: inherit;
               ">Close</button>
               <button onclick="window.location.href='manager.html'" style="
                   background: rgba(255, 255, 255, 0.3);
                   border: 2px solid rgba(255, 255, 255, 0.5);
                   color: white;
                   padding: 10px 20px;
                   border-radius: 10px;
                   cursor: pointer;
                   font-family: inherit;
               ">Open Package Manager</button>
           </div>
       `;
       
       document.body.appendChild(message);
       
       // Auto-remove after 10 seconds
       setTimeout(() => {
           if (message.parentElement) {
               message.remove();
           }
       }, 10000);
   }
   
   destroy() {
       // Clean up Three.js resources
       if (this.animationId) {
           cancelAnimationFrame(this.animationId);
       }
       
       if (this.renderer) {
           this.renderer.dispose();
       }
       
       if (this.character) {
           this.scene.remove(this.character);
       }
   }

updatePowerLevel(level) {
    this.characterData.powerLevel = parseInt(level);
}

updateRarity(rarity) {
    this.characterData.rarity = rarity;
}

applyPowerPreset(button) {
    const powers = button.dataset.powers.split(',');
    
    // Clear existing abilities
    this.characterData.abilities = [];
    
    // Add the preset powers
    powers.forEach(power => {
        this.characterData.abilities.push(power.trim());
    });
    
    // Update the UI
    this.updateAbilitiesUI();
    
    // Visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

updateAbilitiesUI() {
    const container = document.querySelector('.abilities-list');
    container.innerHTML = '';
    
    this.characterData.abilities.forEach(ability => {
        const abilityDiv = document.createElement('div');
        abilityDiv.className = 'ability-input';
        abilityDiv.innerHTML = `
            <input type="text" value="${ability}">
            <button class="remove-ability" type="button" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(abilityDiv);
    });
    
    // Add empty input for new ability
    const abilityDiv = document.createElement('div');
    abilityDiv.className = 'ability-input';
    abilityDiv.innerHTML = `
        <input type="text" placeholder="e.g., Speed Boost, Double Jump, Fire Trail">
        <button class="remove-ability" type="button" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(abilityDiv);
}

}

// Initialize the wizard when the page loads
document.addEventListener('DOMContentLoaded', () => {
   window.characterWizard = new CharacterCreationWizard();
});

// Clean up when the page unloads
window.addEventListener('beforeunload', () => {
   if (window.characterWizard) {
       window.characterWizard.destroy();
   }
});