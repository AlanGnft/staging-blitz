// Forest World - Enchanted woodland adventure
const ForestWorld = {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'Mystical woodland with towering trees and magical creatures',
    cost: 5000,
    
    colors: {
        sky: 0x228B22,      // Forest green sky
        fog: 0x90EE90,      // Light green fog
        ground: 0x2F4F2F    // Dark slate gray for forest floor
    },
    
    lighting: {
        ambient: { color: 0x404040, intensity: 0.4 },      // Dimmer ambient light
        directional: { color: 0xFFFFE0, intensity: 0.6 }   // Warm filtered sunlight
    },
    
    // Unique obstacles for forest world
    createObstacles: function() {
    return ['treeRoot', 'thornBush', 'fallenBranch', 'mushroomRing', 'puddlePatch'];
},
    
    // Forest-specific scenery
    createScenery: function() {
        return ['tallPine', 'mushrooms', 'ferns', 'fireflies'];
    },
    
    // Weather options for forest
    weatherOptions: ['mist', 'sunbeams', 'lightRain'],
    
    // Ambient sounds (for future)
    ambientSounds: ['birds', 'rustling', 'creek']
};

// Make it available globally
window.ForestWorld = ForestWorld;

// Forest-specific obstacle creation functions
window.createTreeRoot = function() {
    const rootGroup = new THREE.Group();
    
    // Main root spanning across lane
    const rootGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
    const rootMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.8
    });
    const mainRoot = new THREE.Mesh(rootGeometry, rootMaterial);
    mainRoot.rotation.z = Math.PI / 2; // Lay horizontally
    mainRoot.position.y = 0.2;
    rootGroup.add(mainRoot);
    
    // Smaller protruding roots
    for (let i = 0; i < 3; i++) {
        const smallRootGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 6);
        const smallRoot = new THREE.Mesh(smallRootGeometry, rootMaterial);
        
        const angle = (i / 3) * Math.PI * 2;
        smallRoot.position.set(
            Math.cos(angle) * 0.6,
            0.1,
            Math.sin(angle) * 0.6
        );
        smallRoot.rotation.set(
            Math.random() * 0.3,
            angle,
            Math.random() * 0.5
        );
        rootGroup.add(smallRoot);
    }
    
    // Add some moss
    for (let i = 0; i < 4; i++) {
        const mossGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const mossMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 1.0
        });
        const moss = new THREE.Mesh(mossGeometry, mossMaterial);
        moss.position.set(
            (Math.random() - 0.5) * 1.5,
            0.1 + Math.random() * 0.1,
            (Math.random() - 0.5) * 0.8
        );
        moss.scale.set(0.8, 0.4, 0.8);
        rootGroup.add(moss);
    }
    
    return rootGroup;
};

window.createThornBush = function() {
    const thornGroup = new THREE.Group();
    
    // Main bush body
    const bushGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    const bushMaterial = new THREE.MeshStandardMaterial({
        color: 0x2F4F2F, // Dark green
        roughness: 0.9
    });
    const bush = new THREE.Mesh(bushGeometry, bushMaterial);
    bush.position.y = 0.4;
    bush.scale.set(1.2, 0.8, 1.2);
    thornGroup.add(bush);
    
    // Add thorns
    for (let i = 0; i < 12; i++) {
        const thornGeometry = new THREE.ConeGeometry(0.03, 0.15, 6);
        const thornMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.8
        });
        const thorn = new THREE.Mesh(thornGeometry, thornMaterial);
        
        // Position thorns on surface of bush
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 0.45;
        
        thorn.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            0.4 + radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
        
        // Point thorn outward
        thorn.lookAt(
            thorn.position.x * 2,
            thorn.position.y,
            thorn.position.z * 2
        );
        
        thornGroup.add(thorn);
    }
    
    return thornGroup;
};

window.createFallenBranch = function() {
    const branchGroup = new THREE.Group();
    
    // Main branch
    const branchGeometry = new THREE.CylinderGeometry(0.15, 0.1, 1.8, 8);
    const branchMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.8
    });
    const mainBranch = new THREE.Mesh(branchGeometry, branchMaterial);
    mainBranch.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    mainBranch.position.y = 0.15;
    branchGroup.add(mainBranch);
    
    // Smaller twigs
    for (let i = 0; i < 5; i++) {
        const twigGeometry = new THREE.CylinderGeometry(0.02, 0.04, 0.4, 6);
        const twig = new THREE.Mesh(twigGeometry, branchMaterial);
        
        twig.position.set(
            (Math.random() - 0.5) * 1.4,
            0.15 + Math.random() * 0.1,
            (Math.random() - 0.5) * 0.3
        );
        twig.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        branchGroup.add(twig);
    }
    
    // Add some leaves
    for (let i = 0; i < 8; i++) {
        const leafGeometry = new THREE.CircleGeometry(0.06, 6);
        const leafMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        leaf.position.set(
            (Math.random() - 0.5) * 1.6,
            0.1 + Math.random() * 0.2,
            (Math.random() - 0.5) * 0.4
        );
        leaf.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        leaf.rotation.z = Math.random() * Math.PI * 2;
        
        branchGroup.add(leaf);
    }
    
    return branchGroup;
};

window.createMushroomRing = function() {
    const mushroomGroup = new THREE.Group();
    
    // Create ring of mushrooms
    const numMushrooms = 6;
    for (let i = 0; i < numMushrooms; i++) {
        const angle = (i / numMushrooms) * Math.PI * 2;
        const radius = 0.8;
        
        // Mushroom stem
        const stemGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({
            color: 0xF5DEB3, // Beige
            roughness: 0.8
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(
            Math.cos(angle) * radius,
            0.15,
            Math.sin(angle) * radius
        );
        mushroomGroup.add(stem);
        
        // Mushroom cap
        const capGeometry = new THREE.SphereGeometry(0.12, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const capMaterial = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0xFF4500 : 0x8B4513, // Alternating colors
            roughness: 0.6
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.set(
            Math.cos(angle) * radius,
            0.3,
            Math.sin(angle) * radius
        );
        mushroomGroup.add(cap);
        
        // Add spots to some mushrooms
        if (i % 2 === 0) {
            for (let j = 0; j < 3; j++) {
                const spotGeometry = new THREE.SphereGeometry(0.02, 6, 6);
                const spotMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF
                });
                const spot = new THREE.Mesh(spotGeometry, spotMaterial);
                spot.position.set(
                    Math.cos(angle) * radius + (Math.random() - 0.5) * 0.15,
                    0.32,
                    Math.sin(angle) * radius + (Math.random() - 0.5) * 0.15
                );
                mushroomGroup.add(spot);
            }
        }
    }
    
    return mushroomGroup;
};

window.createPuddlePatch = function() {
    const puddleGroup = new THREE.Group();
    
    // Main muddy puddle base
    const puddleGeometry = new THREE.CircleGeometry(0.8, 16);
    const puddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x4A4A2A, // Dark muddy brown
        roughness: 0.1,  // Shiny/wet surface
        metalness: 0.3,  // Slight reflectivity
        transparent: true,
        opacity: 0.9
    });
    const puddle = new THREE.Mesh(puddleGeometry, puddleMaterial);
    puddle.rotation.x = -Math.PI / 2; // Lay flat on ground
    puddle.position.y = 0.01; // Slightly above ground
    puddleGroup.add(puddle);
    
    // Add muddy rim around puddle
    const rimGeometry = new THREE.RingGeometry(0.8, 1.0, 16);
    const rimMaterial = new THREE.MeshStandardMaterial({
        color: 0x3D2B1F, // Darker mud color
        roughness: 0.8,
        side: THREE.DoubleSide
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.005; // Just below puddle surface
    puddleGroup.add(rim);
    
    
    // Add small stones around puddle
    for (let i = 0; i < 4; i++) {
        const stoneGeometry = new THREE.DodecahedronGeometry(0.06, 1);
        const stoneMaterial = new THREE.MeshStandardMaterial({
            color: 0x696969, // Gray
            roughness: 0.9
        });
        const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
        
        const angle = Math.random() * Math.PI * 2;
        stone.position.set(
            Math.cos(angle) * (0.7 + Math.random() * 0.4),
            0.03,
            Math.sin(angle) * (0.7 + Math.random() * 0.4)
        );
        stone.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        puddleGroup.add(stone);
    }
    
    return puddleGroup;
};

console.log('🌲 Forest World loaded successfully!');

