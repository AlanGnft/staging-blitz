// Desert Mirage World - Scorching sand dunes and shimmering heat
const DesertWorld = {
    id: 'desert',
    name: 'Desert Mirage',
    description: 'Scorching sand dunes with mysterious mirages and ancient secrets',
    cost: 10000,
    
    colors: {
        sky: 0xFFE4B5,      // Sandy beige sky
        fog: 0xDEB887,      // Burlywood fog
        ground: 0xF4A460    // Sandy brown ground
    },
    
    lighting: {
        ambient: { color: 0xFFE4B5, intensity: 0.7 },      // Warm ambient light
        directional: { color: 0xFFF8DC, intensity: 1.0 }   // Bright desert sun
    },
    
    // Unique obstacles for desert world
    createObstacles: function() {
        return ['cactus', 'sandDune', 'quicksand', 'ancientRuin'];
    },
    
    // Desert-specific scenery
    createScenery: function() {
        return ['palmOasis', 'mirage', 'tumbleweed', 'pyramidDistance'];
    },
    
    // Weather options for desert
    weatherOptions: ['heatWave', 'sandstorm', 'clear'],
    
    // Ambient sounds (for future)
    ambientSounds: ['wind', 'sandShifting', 'distantCamels']
};

// Make it available globally
window.DesertWorld = DesertWorld;

// Desert-specific obstacle creation functions
window.createCactus = function() {
    const cactusGroup = new THREE.Group();
    
    // Main cactus body
    const mainGeometry = new THREE.CylinderGeometry(0.3, 0.35, 2.5, 8);
    const cactusMaterial = new THREE.MeshStandardMaterial({
        color: 0x228B22, // Dark green
        roughness: 0.8
    });
    const mainBody = new THREE.Mesh(mainGeometry, cactusMaterial);
    mainBody.position.y = 1.25;
    cactusGroup.add(mainBody);
    
    // Add cactus arms
    for (let i = 0; i < 2; i++) {
        const armGeometry = new THREE.CylinderGeometry(0.15, 0.18, 1.2, 8);
        const arm = new THREE.Mesh(armGeometry, cactusMaterial);
        
        const side = i === 0 ? -1 : 1;
        arm.position.set(side * 0.4, 1.5, 0);
        arm.rotation.z = side * Math.PI / 6; // Angle outward
        cactusGroup.add(arm);
        
        // Add elbow bend
        const elbowGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.8, 8);
        const elbow = new THREE.Mesh(elbowGeometry, cactusMaterial);
        elbow.position.set(side * 0.7, 2.0, 0);
        elbow.rotation.x = Math.PI / 2; // Point upward
        cactusGroup.add(elbow);
    }
    
    // Add spines all over
    for (let i = 0; i < 50; i++) {
        const spineGeometry = new THREE.ConeGeometry(0.02, 0.15, 6);
        const spineMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFE0, // Light yellow
            roughness: 0.3
        });
        const spine = new THREE.Mesh(spineGeometry, spineMaterial);
        
        // Position spines randomly on cactus surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 0.35;
        const height = Math.random() * 2 + 0.5;
        
        spine.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            height,
            radius * Math.sin(phi) * Math.sin(theta)
        );
        
        // Point spine outward
        spine.lookAt(
            spine.position.x * 2,
            spine.position.y,
            spine.position.z * 2
        );
        
        cactusGroup.add(spine);
    }
    
    // Add a cactus flower on top
    const flowerGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const flowerMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF69B4, // Hot pink
        emissive: 0xFF1493,
        emissiveIntensity: 0.3
    });
    const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
    flower.position.y = 2.6;
    cactusGroup.add(flower);
    
    return cactusGroup;
};

window.createSandDune = function() {
    const duneGroup = new THREE.Group();
    
    // Main sand dune
    const duneGeometry = new THREE.SphereGeometry(1.5, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const duneMaterial = new THREE.MeshStandardMaterial({
        color: 0xF4A460, // Sandy brown
        roughness: 0.9
    });
    const dune = new THREE.Mesh(duneGeometry, duneMaterial);
    dune.position.y = 0;
    dune.scale.set(1.5, 0.8, 1); // Make it longer and lower
    duneGroup.add(dune);
    
    // Add smaller sand mounds
    for (let i = 0; i < 5; i++) {
        const moundGeometry = new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const mound = new THREE.Mesh(moundGeometry, duneMaterial);
        
        mound.position.set(
            (Math.random() - 0.5) * 3,
            0,
            (Math.random() - 0.5) * 2
        );
        mound.scale.set(
            0.8 + Math.random() * 0.4,
            0.5 + Math.random() * 0.3,
            0.8 + Math.random() * 0.4
        );
        
        duneGroup.add(mound);
    }
    
    // Add some scattered rocks
    for (let i = 0; i < 3; i++) {
        const rockGeometry = new THREE.DodecahedronGeometry(0.15, 1);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B7355, // Dark tan
            roughness: 0.9
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        
        rock.position.set(
            (Math.random() - 0.5) * 2.5,
            0.1,
            (Math.random() - 0.5) * 1.5
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        duneGroup.add(rock);
    }
    
    return duneGroup;
};

window.createQuicksand = function() {
    const quicksandGroup = new THREE.Group();
    
    // Main quicksand pit
    const pitGeometry = new THREE.CircleGeometry(1.2, 16);
    const pitMaterial = new THREE.MeshStandardMaterial({
        color: 0xD2B48C, // Light tan
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: 0.8
    });
    const pit = new THREE.Mesh(pitGeometry, pitMaterial);
    pit.rotation.x = -Math.PI / 2;
    pit.position.y = -0.1;
    quicksandGroup.add(pit);
    
    // Add bubbling effect
    for (let i = 0; i < 12; i++) {
        const bubbleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const bubbleMaterial = new THREE.MeshStandardMaterial({
            color: 0xDEB887,
            transparent: true,
            opacity: 0.6,
            roughness: 0.2
        });
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        const angle = (i / 12) * Math.PI * 2;
        const radius = Math.random() * 1.0 + 0.2;
        bubble.position.set(
            Math.cos(angle) * radius,
            0.05,
            Math.sin(angle) * radius
        );
        
        // Animation data for bubbling
        bubble.userData = {
            bubbleSpeed: Math.random() * 0.03 + 0.02,
            bubblePhase: Math.random() * Math.PI * 2,
            originalY: bubble.position.y
        };
        
        quicksandGroup.add(bubble);
    }
    
    // Add warning signs (bleached bones)
    for (let i = 0; i < 4; i++) {
        const boneGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6);
        const boneMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFF8DC, // Cornsilk (bleached bone color)
            roughness: 0.8
        });
        const bone = new THREE.Mesh(boneGeometry, boneMaterial);
        
        const angle = (i / 4) * Math.PI * 2;
        bone.position.set(
            Math.cos(angle) * 1.4,
            0.15,
            Math.sin(angle) * 1.4
        );
        bone.rotation.set(
            Math.random() * 0.5,
            angle,
            Math.random() * 0.5
        );
        
        quicksandGroup.add(bone);
    }
    
    return quicksandGroup;
};

window.createAncientRuin = function() {
    const ruinGroup = new THREE.Group();
    
    // Crumbling pillar
    const pillarGeometry = new THREE.CylinderGeometry(0.4, 0.5, 3, 8);
    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0xD2B48C, // Light tan stone
        roughness: 0.9
    });
    const pillar = new THREE.Mesh(pillarGeometry, stoneMaterial);
    pillar.position.y = 1.5;
pillar.rotation.z = Math.PI / 12; // Slight lean
pillar.userData.isMainPillar = true; // Mark as the main collision target
ruinGroup.add(pillar);
    
    // Broken top piece
    const topGeometry = new THREE.BoxGeometry(1, 0.3, 1);
    const top = new THREE.Mesh(topGeometry, stoneMaterial);
    top.position.set(0.2, 3.2, 0);
    top.rotation.z = Math.PI / 8;
    ruinGroup.add(top);
    
    // Scattered rubble
    for (let i = 0; i < 8; i++) {
        const rubbleGeometry = new THREE.BoxGeometry(
            Math.random() * 0.3 + 0.1,
            Math.random() * 0.2 + 0.1,
            Math.random() * 0.3 + 0.1
        );
        const rubble = new THREE.Mesh(rubbleGeometry, stoneMaterial);
        
        rubble.position.set(
            (Math.random() - 0.5) * 3,
            Math.random() * 0.2,
            (Math.random() - 0.5) * 3
        );
        rubble.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        ruinGroup.add(rubble);
    }
    
    // Add hieroglyphs to the pillar
    for (let i = 0; i < 6; i++) {
        const glyphGeometry = new THREE.RingGeometry(0.05, 0.08, 6);
        const glyphMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // Dark brown
            side: THREE.DoubleSide
        });
        const glyph = new THREE.Mesh(glyphGeometry, glyphMaterial);
        
        const height = 0.5 + i * 0.4;
        const angle = (i * Math.PI / 3);
        
        glyph.position.set(
            Math.cos(angle) * 0.42,
            height,
            Math.sin(angle) * 0.42
        );
        glyph.lookAt(glyph.position.x * 2, glyph.position.y, glyph.position.z * 2);
        
        ruinGroup.add(glyph);
    }
    
    return ruinGroup;
};

console.log('🏜️ Desert Mirage World loaded successfully!');

