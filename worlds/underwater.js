// Underwater World - Deep sea adventure
const UnderwaterWorld = {
    id: 'underwater',
    name: 'Ocean Depths',
    description: 'Explore the mysterious underwater realm with coral reefs and sea creatures',
    cost: 15000, // Make it a premium world
    
    colors: {
        sky: 0x004466,      // Deep ocean blue
        fog: 0x003355,      // Darker blue fog for depth
        ground: 0x334455    // Ocean floor color
    },
    
    lighting: {
        ambient: { color: 0x224466, intensity: 0.5 },      // Bluish ambient light
        directional: { color: 0x88BBDD, intensity: 0.4 }   // Filtered sunlight from above
    },
    
    // Unique obstacles for underwater world
    createObstacles: function() {
        return ['coralReef', 'giantClam', 'seaweedTangle', 'sunkenAnchor', 'rockFormation'];
    },
    
    // Underwater-specific scenery
    createScenery: function() {
        return ['kelpForest', 'schoolOfFish', 'bubbleStream', 'sunkenShip', 'glowingJellyfish'];
    },
    
    // Weather options for underwater
    weatherOptions: ['bubbles', 'current', 'particleDebris'],
    
    // Ambient sounds (for future)
    ambientSounds: ['underwater', 'bubbles', 'whale']
};

// Make it available globally
window.UnderwaterWorld = UnderwaterWorld;

// Underwater-specific obstacle creation functions
window.createCoralReef = function() {
    const coralGroup = new THREE.Group();
    
    // Base rock formation
    const baseGeometry = new THREE.DodecahedronGeometry(0.8, 1);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.9
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.scale.set(1.5, 0.4, 1.2);
    base.position.y = 0.2;
    coralGroup.add(base);
    
    // Brain coral
    const brainCoralGeometry = new THREE.SphereGeometry(0.4, 12, 8);
    const brainCoralMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF6B9D,
        roughness: 0.7,
        emissive: 0xFF6B9D,
        emissiveIntensity: 0.1
    });
    const brainCoral = new THREE.Mesh(brainCoralGeometry, brainCoralMaterial);
    brainCoral.position.set(-0.3, 0.5, 0.2);
    brainCoral.scale.set(1, 0.8, 1);
    coralGroup.add(brainCoral);
    
    // Staghorn coral branches
    for (let i = 0; i < 6; i++) {
        const branchGeometry = new THREE.CylinderGeometry(0.02, 0.05, 0.4, 6);
        const branchMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFA500,
            roughness: 0.8,
            emissive: 0xFFA500,
            emissiveIntensity: 0.1
        });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        
        const angle = (i / 6) * Math.PI * 2;
        branch.position.set(
            Math.cos(angle) * 0.3,
            0.4,
            Math.sin(angle) * 0.3
        );
        branch.rotation.set(
            Math.random() * 0.5 - 0.25,
            angle,
            Math.random() * 0.3
        );
        
        coralGroup.add(branch);
    }
    
    // Small decorative elements
    for (let i = 0; i < 8; i++) {
        const decorGeometry = new THREE.SphereGeometry(0.05, 6, 6);
        const decorColors = [0xFF69B4, 0x00CED1, 0xFFD700, 0x98FB98];
        const decorMaterial = new THREE.MeshStandardMaterial({
            color: decorColors[Math.floor(Math.random() * decorColors.length)],
            emissive: decorColors[Math.floor(Math.random() * decorColors.length)],
            emissiveIntensity: 0.2
        });
        const decor = new THREE.Mesh(decorGeometry, decorMaterial);
        decor.position.set(
            (Math.random() - 0.5) * 1.2,
            Math.random() * 0.6 + 0.1,
            (Math.random() - 0.5) * 1.2
        );
        coralGroup.add(decor);
    }
    
    return coralGroup;
};

window.createGiantClam = function() {
    const clamGroup = new THREE.Group();
    
    // Bottom shell
    const bottomShellGeometry = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const shellMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4A574,
        roughness: 0.6
    });
    const bottomShell = new THREE.Mesh(bottomShellGeometry, shellMaterial);
    bottomShell.rotation.x = Math.PI;
    bottomShell.position.y = 0.3;
    clamGroup.add(bottomShell);
    
    // Top shell (can open/close)
    const topShellGeometry = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const topShell = new THREE.Mesh(topShellGeometry, shellMaterial);
    topShell.position.y = 0.3;
    topShell.rotation.x = -0.3; // Slightly open
    clamGroup.add(topShell);
    
    // Pearl inside
    const pearlGeometry = new THREE.SphereGeometry(0.15, 12, 12);
    const pearlMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFF8DC,
        emissive: 0xFFF8DC,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2
    });
    const pearl = new THREE.Mesh(pearlGeometry, pearlMaterial);
    pearl.position.y = 0.2;
    clamGroup.add(pearl);
    
    // Ridges on shells
    for (let i = 0; i < 8; i++) {
        const ridgeGeometry = new THREE.BoxGeometry(0.02, 0.1, 1.2);
        const ridge = new THREE.Mesh(ridgeGeometry, shellMaterial);
        const angle = (i / 8) * Math.PI;
        ridge.position.set(
            Math.cos(angle) * 0.3,
            0.3,
            0
        );
        ridge.rotation.y = angle;
        clamGroup.add(ridge);
    }
    
    return clamGroup;
};

window.createSeaweedTangle = function() {
    const seaweedGroup = new THREE.Group();
    
    // Multiple strands of seaweed
    for (let i = 0; i < 8; i++) {
        const strandGroup = new THREE.Group();
        
        // Create segmented seaweed strand
        let prevY = 0;
        for (let j = 0; j < 5; j++) {
            const segmentGeometry = new THREE.CylinderGeometry(0.08 - j * 0.01, 0.1 - j * 0.01, 0.3, 6);
            const segmentMaterial = new THREE.MeshStandardMaterial({
                color: 0x2F4F2F,
                roughness: 0.8,
                transparent: true,
                opacity: 0.9
            });
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.y = prevY + 0.15;
            prevY = segment.position.y;
            
            // Add slight rotation for natural look
            segment.rotation.x = Math.sin(j * 0.5) * 0.2;
            segment.rotation.z = Math.cos(j * 0.5) * 0.2;
            
            strandGroup.add(segment);
        }
        
        // Position strands around the obstacle area
        const angle = (i / 8) * Math.PI * 2;
        strandGroup.position.set(
            Math.cos(angle) * 0.5,
            0,
            Math.sin(angle) * 0.5
        );
        strandGroup.rotation.y = angle + Math.random() * 0.5;
        
        // Store animation data for swaying
        strandGroup.userData = {
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayAmount: Math.random() * 0.2 + 0.1,
            swayOffset: Math.random() * Math.PI * 2
        };
        
        seaweedGroup.add(strandGroup);
    }
    
    return seaweedGroup;
};

window.createSunkenAnchor = function() {
    const anchorGroup = new THREE.Group();
    
    // Main anchor body
    const bodyGeometry = new THREE.TorusGeometry(0.5, 0.15, 8, 12, Math.PI);
    const anchorMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.6,
        roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, anchorMaterial);
    body.rotation.z = Math.PI;
    body.position.y = 0.5;
    anchorGroup.add(body);
    
    // Anchor shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
    const shaft = new THREE.Mesh(shaftGeometry, anchorMaterial);
    shaft.position.y = 0.9;
    anchorGroup.add(shaft);
    
    // Anchor flukes (the pointed ends)
    for (let i = 0; i < 2; i++) {
        const flukeGeometry = new THREE.ConeGeometry(0.15, 0.4, 4);
        const fluke = new THREE.Mesh(flukeGeometry, anchorMaterial);
        fluke.position.set(i === 0 ? -0.4 : 0.4, 0.3, 0);
        fluke.rotation.z = i === 0 ? Math.PI / 4 : -Math.PI / 4;
        anchorGroup.add(fluke);
    }
    
    // Some rust/algae patches
    for (let i = 0; i < 6; i++) {
        const patchGeometry = new THREE.SphereGeometry(0.06, 6, 6);
        const patchMaterial = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0x8B4513 : 0x228B22,
            roughness: 1
        });
        const patch = new THREE.Mesh(patchGeometry, patchMaterial);
        patch.position.set(
            (Math.random() - 0.5) * 0.8,
            Math.random() * 0.8,
            (Math.random() - 0.5) * 0.3
        );
        patch.scale.set(1.5, 0.5, 1);
        anchorGroup.add(patch);
    }
    
    // Chain attached to anchor
    for (let i = 0; i < 3; i++) {
        const linkGeometry = new THREE.TorusGeometry(0.06, 0.02, 6, 8);
        const link = new THREE.Mesh(linkGeometry, anchorMaterial);
        link.position.set(0, 1.3 + i * 0.12, 0);
        link.rotation.x = i % 2 === 0 ? 0 : Math.PI / 2;
        anchorGroup.add(link);
    }
    
    return anchorGroup;
};

window.createRockFormation = function() {
    const rockGroup = new THREE.Group();
    
    // Create underwater-styled rocks with algae
    for (let i = 0; i < 5; i++) {
        const size = Math.random() * 0.4 + 0.3;
        const rockGeometry = new THREE.DodecahedronGeometry(size, 1);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x4A4A4A,
            roughness: 0.9
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        
        rock.position.set(
            (Math.random() - 0.5) * 1.5,
            size / 2,
            (Math.random() - 0.5) * 1.5
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        rockGroup.add(rock);
        
        // Add algae on some rocks
        if (Math.random() > 0.5) {
            const algaeGeometry = new THREE.SphereGeometry(size * 0.3, 6, 6);
            const algaeMaterial = new THREE.MeshStandardMaterial({
                color: 0x2F4F2F,
                roughness: 1,
                transparent: true,
                opacity: 0.8
            });
            const algae = new THREE.Mesh(algaeGeometry, algaeMaterial);
            algae.position.copy(rock.position);
            algae.position.y += size * 0.3;
            algae.scale.set(2, 0.5, 2);
            rockGroup.add(algae);
        }
    }
    
    return rockGroup;
};

console.log('🌊 Underwater World loaded successfully!');

// Underwater-specific scenery creation functions
window.createKelpForest = function() {
    const kelpGroup = new THREE.Group();
    
    // Create multiple kelp strands of varying heights
    for (let i = 0; i < 12; i++) {
        const kelpStrand = new THREE.Group();
        const height = Math.random() * 3 + 4; // 4-7 units tall
        const segments = Math.floor(height * 3); // More segments for taller kelp
        
        // Build kelp from bottom up
        let currentY = 0;
        for (let j = 0; j < segments; j++) {
            const width = 0.3 - (j / segments) * 0.15; // Taper towards top
            const leafGeometry = new THREE.PlaneGeometry(width, 0.4);
            const leafMaterial = new THREE.MeshStandardMaterial({
                color: 0x3B5F3B,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
                roughness: 0.8
            });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            
            leaf.position.y = currentY;
            currentY += 0.3;
            
            // Slight rotation for natural look
            leaf.rotation.y = Math.sin(j * 0.3) * 0.3;
            leaf.rotation.z = Math.cos(j * 0.3) * 0.1;
            
            kelpStrand.add(leaf);
        }
        
        // Position kelp strands
        const angle = (i / 12) * Math.PI * 2;
        const radius = Math.random() * 2 + 1;
        kelpStrand.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
        
        // Add sway animation data
        kelpStrand.userData = {
            swaySpeed: Math.random() * 0.015 + 0.01,
            swayAmount: Math.random() * 0.3 + 0.2,
            swayOffset: Math.random() * Math.PI * 2,
            originalRotation: kelpStrand.rotation.z
        };
        
        kelpGroup.add(kelpStrand);
    }
    
    return kelpGroup;
};

window.createSchoolOfFish = function() {
    const schoolGroup = new THREE.Group();
    
    // Create 15-20 fish in a school
    const fishCount = Math.floor(Math.random() * 5) + 15;
    
    for (let i = 0; i < fishCount; i++) {
        const fishGroup = new THREE.Group();
        
        // Fish body (elongated ellipsoid)
        const bodyGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        const fishColors = [0x1E90FF, 0x00CED1, 0x4682B4, 0x5F9EA0];
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: fishColors[Math.floor(Math.random() * fishColors.length)],
            metalness: 0.3,
            roughness: 0.5
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1.5, 0.7, 0.5);
        fishGroup.add(body);
        
        // Tail fin
        const tailGeometry = new THREE.ConeGeometry(0.1, 0.2, 4);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.set(-0.2, 0, 0);
        tail.rotation.z = -Math.PI / 2;
        tail.scale.set(0.5, 1.2, 1);
        fishGroup.add(tail);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.2
        });
        for (let side of [-1, 1]) {
            const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eye.position.set(0.12, 0.03, 0.04 * side);
            fishGroup.add(eye);
        }
        
        // Position fish in school formation
        const spreadX = 2.5;
        const spreadY = 1.5;
        const spreadZ = 2.5;
        
        fishGroup.position.set(
            (Math.random() - 0.5) * spreadX,
            (Math.random() - 0.5) * spreadY + 2, // Elevated position
            (Math.random() - 0.5) * spreadZ
        );
        
        // All fish face roughly the same direction with slight variation
        fishGroup.rotation.y = Math.random() * 0.5 - 0.25;
        
        // Animation data for synchronized swimming
        fishGroup.userData = {
            swimSpeed: 0.02 + Math.random() * 0.005,
            swimOffset: Math.random() * Math.PI * 2,
            verticalFloat: Math.random() * 0.1 + 0.05,
            basePosition: fishGroup.position.clone()
        };
        
        schoolGroup.add(fishGroup);
    }
    
    // School movement data
    schoolGroup.userData = {
        schoolSpeed: 0.01,
        schoolDirection: Math.random() * Math.PI * 2
    };
    
    return schoolGroup;
};

window.createBubbleStream = function() {
    const bubbleGroup = new THREE.Group();
    
    // Create source (like a crack in the ocean floor)
    const crackGeometry = new THREE.PlaneGeometry(0.3, 1.5);
    const crackMaterial = new THREE.MeshStandardMaterial({
        color: 0x2C2C2C,
        roughness: 1,
        side: THREE.DoubleSide
    });
    const crack = new THREE.Mesh(crackGeometry, crackMaterial);
    crack.rotation.x = -Math.PI / 2;
    crack.position.y = 0.01;
    bubbleGroup.add(crack);
    
    // Create rising bubbles
    for (let i = 0; i < 20; i++) {
        const bubbleSize = Math.random() * 0.08 + 0.04;
        const bubbleGeometry = new THREE.SphereGeometry(bubbleSize, 8, 8);
        const bubbleMaterial = new THREE.MeshStandardMaterial({
            color: 0xE0FFFF,
            transparent: true,
            opacity: 0.4,
            metalness: 0.8,
            roughness: 0.1,
            emissive: 0xE0FFFF,
            emissiveIntensity: 0.1
        });
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        // Start bubbles at different heights
        bubble.position.set(
            (Math.random() - 0.5) * 0.3,
            Math.random() * 4,
            (Math.random() - 0.5) * 0.3
        );
        
        // Animation data
        bubble.userData = {
            riseSpeed: Math.random() * 0.02 + 0.02,
            wobbleSpeed: Math.random() * 0.05 + 0.03,
            wobbleAmount: Math.random() * 0.1 + 0.05,
            startY: bubble.position.y,
            size: bubbleSize
        };
        
        bubbleGroup.add(bubble);
    }
    
    return bubbleGroup;
};

window.createSunkenShip = function() {
    const shipGroup = new THREE.Group();
    
    // Hull (tilted and partially buried)
    const hullGeometry = new THREE.BoxGeometry(4, 2, 1.5);
    const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x4A3C28,
        roughness: 0.9
    });
    const hull = new THREE.Mesh(hullGeometry, woodMaterial);
    hull.position.set(0, 0.5, 0);
    hull.rotation.z = Math.PI / 12; // Tilted
    hull.rotation.y = Math.PI / 8; // Slight angle
    shipGroup.add(hull);
    
    // Broken mast
    const mastGeometry = new THREE.CylinderGeometry(0.15, 0.2, 3, 8);
    const mast = new THREE.Mesh(mastGeometry, woodMaterial);
    mast.position.set(0.5, 1.5, 0);
    mast.rotation.z = -Math.PI / 6; // Broken angle
    shipGroup.add(mast);
    
    // Torn sail remnant
    const sailGeometry = new THREE.PlaneGeometry(1.5, 1.2);
    const sailMaterial = new THREE.MeshStandardMaterial({
        color: 0xCCCCCC,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 1
    });
    const sail = new THREE.Mesh(sailGeometry, sailMaterial);
    sail.position.set(0.8, 2, 0);
    sail.rotation.y = Math.PI / 4;
    
    // Add tears to sail
    sail.userData = {
        waveSpeed: 0.02,
        waveAmount: 0.1
    };
    shipGroup.add(sail);
    
    // Treasure chest
    const chestGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.3);
    const chestMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        metalness: 0.3,
        roughness: 0.7
    });
    const chest = new THREE.Mesh(chestGeometry, chestMaterial);
    chest.position.set(-0.8, 0.2, 0.4);
    chest.rotation.y = Math.PI / 6;
    shipGroup.add(chest);
    
    // Gold coins spilling out
    for (let i = 0; i < 8; i++) {
        const coinGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.01, 8);
        const coinMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xFFD700,
            emissiveIntensity: 0.1
        });
        const coin = new THREE.Mesh(coinGeometry, coinMaterial);
        coin.position.set(
            chest.position.x + (Math.random() - 0.5) * 0.3,
            0.1,
            chest.position.z + (Math.random() - 0.5) * 0.3
        );
        coin.rotation.x = Math.random() * Math.PI;
        shipGroup.add(coin);
    }
    
    // Barnacles and growth on hull
    for (let i = 0; i < 15; i++) {
        const barnacleGeometry = new THREE.ConeGeometry(0.04, 0.06, 6);
        const barnacleMaterial = new THREE.MeshStandardMaterial({
            color: 0xE0E0E0,
            roughness: 1
        });
        const barnacle = new THREE.Mesh(barnacleGeometry, barnacleMaterial);
        
        // Place on hull surface
        const side = Math.random() > 0.5 ? 1 : -1;
        barnacle.position.set(
            (Math.random() - 0.5) * 3.5,
            Math.random() * 1.5,
            side * 0.75
        );
        barnacle.lookAt(barnacle.position.x, barnacle.position.y, side * 2);
        
        shipGroup.add(barnacle);
    }
    
    // Seaweed draped over parts
    for (let i = 0; i < 4; i++) {
        const weedGeometry = new THREE.PlaneGeometry(0.3, 1);
        const weedMaterial = new THREE.MeshStandardMaterial({
            color: 0x2F4F2F,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const weed = new THREE.Mesh(weedGeometry, weedMaterial);
        weed.position.set(
            (Math.random() - 0.5) * 3,
            1 + Math.random() * 0.5,
            (Math.random() - 0.5) * 1
        );
        weed.rotation.x = Math.PI / 6;
        
        // Sway animation data
        weed.userData = {
            swaySpeed: 0.02,
            swayAmount: 0.1
        };
        
        shipGroup.add(weed);
    }
    
    return shipGroup;
};

window.createGlowingJellyfish = function() {
    const jellyfishGroup = new THREE.Group();
    
    // Create 3-5 jellyfish at different heights
    const jellyfishCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < jellyfishCount; i++) {
        const jellyfish = new THREE.Group();
        
        // Bell (main body)
        const bellGeometry = new THREE.SphereGeometry(0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.5);
        const bellMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF69B4,
            transparent: true,
            opacity: 0.6,
            emissive: 0xFF69B4,
            emissiveIntensity: 0.4,
            side: THREE.DoubleSide
        });
        const bell = new THREE.Mesh(bellGeometry, bellMaterial);
        jellyfish.add(bell);
        
        // Inner glow
        const glowGeometry = new THREE.SphereGeometry(0.25, 12, 8);
        const glowMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0xFF69B4,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        jellyfish.add(glow);
        
        // Tentacles
        const tentacleCount = 8;
        for (let j = 0; j < tentacleCount; j++) {
            const tentacle = new THREE.Group();
            
            // Create segmented tentacle
            let currentY = -0.2;
            for (let k = 0; k < 6; k++) {
                const segmentGeometry = new THREE.CylinderGeometry(
                    0.01 + (0.02 * (1 - k/6)),
                    0.01 + (0.03 * (1 - k/6)),
                    0.2,
                    6
                );
                const segmentMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFF69B4,
                    transparent: true,
                    opacity: 0.7 - (k * 0.1),
                    emissive: 0xFF69B4,
                    emissiveIntensity: 0.2
                });
                const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
                segment.position.y = currentY;
                currentY -= 0.15;
                
                tentacle.add(segment);
            }
            
            // Position tentacles around the bell
            const angle = (j / tentacleCount) * Math.PI * 2;
            tentacle.position.set(
                Math.cos(angle) * 0.2,
                -0.1,
                Math.sin(angle) * 0.2
            );
            
            // Animation data for tentacle
            tentacle.userData = {
                waveSpeed: Math.random() * 0.03 + 0.02,
                waveOffset: Math.random() * Math.PI * 2,
                waveAmount: 0.1
            };
            
            jellyfish.add(tentacle);
        }
        
        // Position jellyfish
        jellyfish.position.set(
            (Math.random() - 0.5) * 4,
            Math.random() * 3 + 1.5,
            (Math.random() - 0.5) * 4
        );
        
        // Animation data for floating
        jellyfish.userData = {
            floatSpeed: Math.random() * 0.01 + 0.01,
            floatRange: Math.random() * 0.5 + 0.5,
            pulseSpeed: Math.random() * 0.03 + 0.02,
            baseY: jellyfish.position.y
        };
        
        jellyfishGroup.add(jellyfish);
    }
    
    return jellyfishGroup;
};