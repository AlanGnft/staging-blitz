console.log('🧙‍♂️ Loading Mystical Forest Wizard character...');

function createWizardCharacter() {
    const wizardGroup = new THREE.Group();
    
    // Flowing robes - wider base for mystical appearance
    const robeGeometry = new THREE.ConeGeometry(0.6, 1.2, 12);
    const robeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a237e, // Deep blue
        roughness: 0.7,
        metalness: 0.1,
        emissive: 0x000033,
        emissiveIntensity: 0.1
    });
    const robe = new THREE.Mesh(robeGeometry, robeMaterial);
    robe.position.y = -0.2;
    wizardGroup.add(robe);
    
    // Add silver stars on the robes
    for (let i = 0; i < 8; i++) {
        const starGeometry = new THREE.SphereGeometry(0.03, 6, 6);
        const starMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xC0C0C0, // Silver
            emissive: 0x404040,
            emissiveIntensity: 0.3
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        // Random positions around the robe
        const angle = (i / 8) * Math.PI * 2;
        const height = Math.random() * 0.8 - 0.6;
        const radius = 0.4 + Math.random() * 0.15;
        
        star.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        wizardGroup.add(star);
    }
    
    // Round, elderly head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFDBB3, // Warm skin tone
        roughness: 0.8,
        metalness: 0
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.6;
    wizardGroup.add(head);
    
    // Long white beard
    const beardGeometry = new THREE.ConeGeometry(0.2, 0.7, 8);
    const beardMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xF5F5F5, // Off-white
        roughness: 0.9,
        metalness: 0
    });
    const beard = new THREE.Mesh(beardGeometry, beardMaterial);
    beard.position.set(0, 0.3, 0.15);
    beard.rotation.x = 0.2; // Slight forward angle
    wizardGroup.add(beard);
    
    // Wise eyes
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4169E1, // Royal blue eyes
        emissive: 0x000066,
        emissiveIntensity: 0.2
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.08, 0.65, 0.18);
    wizardGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.08, 0.65, 0.18);
    wizardGroup.add(rightEye);
    
    // Tall pointed wizard hat
    const hatGeometry = new THREE.ConeGeometry(0.3, 0.8, 12);
    const hatMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0d47a1, // Darker blue than robes
        roughness: 0.6,
        metalness: 0.1
    });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 1.1;
    hat.rotation.z = 0.1; // Slight tilt for whimsical look
    wizardGroup.add(hat);
    
    // Hat brim
    const brimGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16);
    const brimMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0d47a1,
        roughness: 0.6
    });
    const brim = new THREE.Mesh(brimGeometry, brimMaterial);
    brim.position.y = 0.7;
    wizardGroup.add(brim);
    
    // Add stars to the hat
    for (let i = 0; i < 4; i++) {
        const hatStarGeometry = new THREE.SphereGeometry(0.025, 6, 6);
        const hatStarMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFD700, // Gold stars on hat
            emissive: 0x664400,
            emissiveIntensity: 0.4
        });
        const hatStar = new THREE.Mesh(hatStarGeometry, hatStarMaterial);
        
        const angle = (i / 4) * Math.PI * 2;
        const radius = 0.25;
        const height = 0.8 + (i * 0.15);
        
        hatStar.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        wizardGroup.add(hatStar);
    }
    
    // Wooden staff with crystal
    const staffGeometry = new THREE.CylinderGeometry(0.03, 0.04, 1.5, 8);
    const staffMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513, // Brown wood
        roughness: 0.8,
        metalness: 0
    });
    const staff = new THREE.Mesh(staffGeometry, staffMaterial);
    staff.position.set(0.4, 0.2, 0);
    staff.rotation.z = -0.2; // Leaning angle
    wizardGroup.add(staff);
    
    // Crystal at top of staff
    const crystalGeometry = new THREE.OctahedronGeometry(0.12, 0);
    const crystalMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x9966CC, // Purple crystal
        transparent: true,
        opacity: 0.8,
        emissive: 0x442266,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.3
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.set(0.25, 0.9, 0.1);
    wizardGroup.add(crystal);
    
    // Magic sparkles around crystal
    for (let i = 0; i < 6; i++) {
        const sparkleGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const sparkleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xAA77FF,
            transparent: true,
            opacity: 0.7,
            emissive: 0x6644AA,
            emissiveIntensity: 1.0
        });
        const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
        
        const angle = (i / 6) * Math.PI * 2;
        const radius = 0.2;
        sparkle.position.set(
            0.25 + Math.cos(angle) * radius,
            0.9 + Math.sin(angle * 2) * 0.1,
            0.1 + Math.sin(angle) * radius
        );
        wizardGroup.add(sparkle);
    }
    
    // Wizard sleeves
    const sleeveGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.4, 8);
    const sleeveMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a237e,
        roughness: 0.7
    });
    
    const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    leftSleeve.position.set(-0.3, 0.4, 0);
    leftSleeve.rotation.z = 0.3;
    wizardGroup.add(leftSleeve);
    
    const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    rightSleeve.position.set(0.2, 0.3, 0);
    rightSleeve.rotation.z = -0.8; // Holding staff
    wizardGroup.add(rightSleeve);
    
    return wizardGroup;
}

// Character metadata for the package manager
const wizardCharacterData = {
    id: 'wizard',
    name: 'Mystical Forest Wizard',
    description: 'An ancient wizard with flowing robes, starry patterns, and a powerful crystal staff!',
    creator: 'Running BlitZ Team',
    version: '1.0.0',
    abilities: ['Magic Shield', 'Teleport', 'Time Slow'],
    tags: ['fantasy', 'magic', 'mystical', 'wise'],
    createFunction: 'createWizardCharacter',
    previewRotation: { x: 0, y: 0.01, z: 0 }
};

// Export for package manager
if (typeof window !== 'undefined') {
    window.createWizardCharacter = createWizardCharacter;
    window.wizardCharacterData = wizardCharacterData;
}

console.log('🧙‍♂️ Mystical Forest Wizard character loaded successfully!');