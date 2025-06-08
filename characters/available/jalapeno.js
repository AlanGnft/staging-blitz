console.log('🌶️ Loading Jalapeño character...');

function createJalapenoCharacter() {
    const jalapenoGroup = new THREE.Group();
    
    // Main pepper body - use elongated sphere for natural pepper shape
    const pepperGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    // Scale to create the classic jalapeño proportions (wider top, narrow bottom)
    pepperGeometry.scale(0.8, 1.3, 0.7);
    
    const pepperMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22, // Dark green like a real jalapeño
        roughness: 0.1,  // Shiny pepper skin
        metalness: 0.05, // Slight metallic sheen for realistic look
        emissive: 0x001100, // Subtle green glow
        emissiveIntensity: 0.1
    });
    const pepperBody = new THREE.Mesh(pepperGeometry, pepperMaterial);
    
    // Position body so narrow end is at bottom
    pepperBody.position.y = 0.1;
    jalapenoGroup.add(pepperBody);
    
    // Create the characteristic jalapeño curve by adding a slight bend
    pepperBody.rotation.z = 0.1; // Subtle curve
    
    // Narrow tip at the bottom
    const tipGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
    const tipMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1F7A1F, // Slightly darker green for the tip
        roughness: 0.1,
        metalness: 0.05
    });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.y = -0.4;
    tip.rotation.z = 0.05; // Continue the curve
    jalapenoGroup.add(tip);
    
    // Black sphere eyeballs with white shine
    const eyeGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.1,
        metalness: 0.1
    });
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.3, 0.25);
    jalapenoGroup.add(leftEye);
    
    // Right eye  
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.3, 0.25);
    jalapenoGroup.add(rightEye);
    
    // White shine on eyes
    const shineGeometry = new THREE.SphereGeometry(0.03, 6, 6);
    const shineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.9
    });
    
    // Left eye shine
    const leftShine = new THREE.Mesh(shineGeometry, shineMaterial);
    leftShine.position.set(-0.12, 0.35, 0.28);
    jalapenoGroup.add(leftShine);
    
    // Right eye shine
    const rightShine = new THREE.Mesh(shineGeometry, shineMaterial);
    rightShine.position.set(0.18, 0.35, 0.28);
    jalapenoGroup.add(rightShine);
    
    // Stem coming from the top with a slight curve
    const stemGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.25, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3D7C47, // Darker green for stem
        roughness: 0.6
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.65;
    stem.rotation.z = -0.15; // Slight curve to the stem
    jalapenoGroup.add(stem);
    
    // Small cap where stem meets pepper
    const capGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.08, 8);
    const capMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2F5F35,
        roughness: 0.4
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.52;
    jalapenoGroup.add(cap);
    
    return jalapenoGroup;
}

// Character metadata for the package manager
const jalapenoCharacterData = {
    id: 'jalapeno',
    name: 'Jalapeño',
    description: 'A spicy green pepper with a fiery personality and shiny skin!',
    creator: 'Running BlitZ Team',
    version: '1.0.0',
    abilities: ['Speed Boost', 'Fire Trail', 'Heat Wave'],
    tags: ['food', 'spicy', 'green', 'hot'],
    createFunction: 'createJalapenoCharacter',
    previewRotation: { x: 0, y: 0.02, z: 0 }
};

// Export for package manager
if (typeof window !== 'undefined') {
    window.createJalapenoCharacter = createJalapenoCharacter;
    window.jalapenoCharacterData = jalapenoCharacterData;
}

console.log('🌶️ Jalapeño character loaded successfully!');