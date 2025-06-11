// ==================== OBSTACLE SYSTEM ====================
// Obstacle spawning, collision detection, and obstacle management
// Dependencies: World System, Game Loop, Audio System
// Functions: spawnObstacle(), createObstacle(), handleCollision(), etc.

// Make functions globally accessible
window.ObstacleSystem = {
    spawnObstacle,
    spawnWaterStream,
    createMeteor,
    createMeteorImpact
};


// Spawn obstacles with improved balancing
function spawnObstacle() {
    // Check if obstacles are loaded first
    if (!currentWorldObstaclesLoaded) {
        console.warn('Obstacles not loaded yet');
        return;
    }
    
    // Check if there are water streams nearby to ensure a clear path
    for (const stream of waterStreams) {
        const streamDistZ = stream.position.z;
        // Don't spawn obstacles too close to streams
        if (streamDistZ < -30 && streamDistZ > -70) {
            return; // Don't spawn obstacles near stream
        }
    }
    
    // 5% chance of spawning fallen tree (spans 2 lanes) - check this BEFORE determining obstacle count
    if (Math.random() < 0.05 && currentWorld === 'classic') {
        const fallenTree = getObstacleFromGLB('fallenTree');
        if (fallenTree) {
            const startLane = Math.floor(Math.random() * 2); // 0 or 1 (so we can span to 1 or 2)
            fallenTree.position.x = lanes[startLane] + 1; // Position between the two lanes
            fallenTree.position.z = -50;
            
            // Add metadata for collision detection
            fallenTree.userData.obstacleType = 'fallenTree';
            
            scene.add(fallenTree);
            obstacles.push(fallenTree);
            
            debug('🌳 Fallen tree spawned from GLB at position:', fallenTree.position);
            
            // Skip the normal obstacle spawning since we spawned a fallen tree
            return;
        }
    }
    
    // Dynamic obstacle count based on current speed level - more aggressive scaling
    let maxObstacles = 1;
    let doubleObstacleChance = 0;

    if (currentSpeedLevel === 1) {
        doubleObstacleChance = 0.2; // 20% chance
    } else if (currentSpeedLevel === 2) {
        doubleObstacleChance = 0.4; // 40% chance
    } else if (currentSpeedLevel === 3) {
        doubleObstacleChance = 0.6; // 60% chance - BLAZING level
    } else if (currentSpeedLevel >= 4) {
        doubleObstacleChance = 0.75; // 75% chance - MAXIMUM CHAOS
    }

    if (Math.random() < doubleObstacleChance) {
        maxObstacles = 2;
    }
    
    // Generate random lanes, but ensure at least one lane is always clear
    let laneIndices = [];
    const numObstacles = Math.floor(Math.random() * maxObstacles) + 1;
    
    // More challenging patterns at higher speeds
    if (numObstacles === 2) {
        if (currentSpeedLevel >= 3) {
            // At BLAZING and CHAOS levels, allow more challenging patterns
            const patterns = [
                [0, 2], // Left and right (leave center)
                [0, 1], // Left and center (leave right) - more challenging
                [1, 2]  // Center and right (leave left) - more challenging
            ];
            laneIndices = patterns[Math.floor(Math.random() * patterns.length)];
        } else {
            // Lower speeds: only use the safe pattern
            laneIndices = [0, 2]; // Only left and right, leave center clear
        }
    } else {
        // Single obstacle in random lane
        laneIndices = [Math.floor(Math.random() * 3)];
    }
    
    // Define available obstacles per world
    const worldObstacleTypes = {
        classic: ['rock', 'treeStump', 'log', 'bush', 'spikes'],
        forest: ['treeRoot', 'thornBush', 'fallenBranch', 'mushroomRing', 'puddlePatch'],
        desert: ['cactus', 'sandDune', 'quicksand', 'ancientRuin']
    };
    
    // Get available obstacles for current world
    const availableTypes = worldObstacleTypes[currentWorld] || worldObstacleTypes.classic;
    
    // Spawn obstacles in the selected lanes
    for (const laneIndex of laneIndices) {
        // Pick random obstacle type
        const obstacleType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        // Get obstacle from GLB pack
        const obstacle = getObstacleFromGLB(obstacleType);
        
        if (!obstacle) {
            console.error(`Failed to spawn obstacle: ${obstacleType}`);
            continue;  // Skip this lane and continue with next
        }
        
        // Position the obstacle
        obstacle.position.x = lanes[laneIndex];
        obstacle.position.z = -50;
        obstacle.position.y = 0;
        
        // Add any special properties needed for collision detection
        obstacle.userData.obstacleType = obstacleType;
        
        scene.add(obstacle);
        obstacles.push(obstacle);
        
        debug('🏗️ Spawned', obstacleType, 'from GLB at lane', laneIndex, 'position:', obstacle.position);
    }
}

// Spawn a stream across the track with better control
function spawnWaterStream() {
    // Only spawn if we haven't spawned one recently and it's been long enough
    if (streamSpawnCounter < currentStreamSpawnRate) {
        return null;
    }
    
    // Don't spawn stream if there are obstacles or other streams nearby
    for (const obstacle of obstacles) {
        if (obstacle.position.z < -30 && obstacle.position.z > -70) {
            return null;
        }
    }
    
    for (const stream of waterStreams) {
        if (stream.position.z < -20 && stream.position.z > -80) {
            return null;
        }
    }
    
    // Create and position the stream
    const stream = createWaterStream();
    // Reset counter when a stream is successfully spawned
    streamSpawnCounter = 0;
    streamCreated = true;
    return stream;
}


// Create falling meteor - exclusive to Maximum Chaos level
function createMeteor() {
    debug("createMeteor function called!");
    const meteorGroup = new THREE.Group();
    
    // Main meteor body - rough, rocky appearance (bigger and brighter)
    const meteorGeometry = new THREE.DodecahedronGeometry(0.8, 2);
    const meteorMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF6600, // Brighter orange/rock color
        roughness: 0.7,
        metalness: 0.2,
        emissive: 0xFF4500, // Fiery glow
        emissiveIntensity: 0.8 // Much brighter glow
    });
    
    const meteorCore = new THREE.Mesh(meteorGeometry, meteorMaterial);
    meteorGroup.add(meteorCore);

    // Add a bright glowing aura around the meteor to make it super visible
    const auraGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF4500,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    meteorGroup.add(aura);
    
    // Add some smaller rock chunks around it
    for (let i = 0; i < 8; i++) {
        const chunkSize = Math.random() * 0.15 + 0.05;
        const chunkGeometry = new THREE.OctahedronGeometry(chunkSize, 1);
        const chunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321, // Darker brown
            roughness: 1.0,
            emissive: 0xFF6600,
            emissiveIntensity: 0.2
        });
        
        const chunk = new THREE.Mesh(chunkGeometry, chunkMaterial);
        
        // Position chunks randomly around the meteor
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 0.3 + 0.2;
        chunk.position.set(
            Math.cos(angle) * distance,
            (Math.random() - 0.5) * 0.4,
            Math.sin(angle) * distance
        );
        
        // Animation properties for floating chunks
        chunk.userData = {
            orbitSpeed: Math.random() * 0.02 + 0.01,
            orbitAngle: angle,
            orbitRadius: distance
        };
        
        meteorGroup.add(chunk);
    }

    // Add fire trail particles
   for (let i = 0; i < 12; i++) {
       const trailGeometry = new THREE.SphereGeometry(0.08, 8, 8);
       const trailMaterial = new THREE.MeshStandardMaterial({
           color: i < 6 ? 0xFF4500 : 0xFFFF00, // Mix of orange and yellow
           emissive: i < 6 ? 0xFF4500 : 0xFFFF00,
           emissiveIntensity: 0.5,
           transparent: true,
           opacity: 0.7 - (i * 0.05) // Fade out towards the back
       });
       
       const trailParticle = new THREE.Mesh(trailGeometry, trailMaterial);
       trailParticle.position.set(
           (Math.random() - 0.5) * 0.3,
           i * 0.15 + 0.5, // Trail going upward behind the meteor
           (Math.random() - 0.5) * 0.3
       );
       
       // Animation properties
       trailParticle.userData = {
           flickerSpeed: Math.random() * 0.1 + 0.05,
           originalOpacity: trailParticle.material.opacity
       };
       
       meteorGroup.add(trailParticle);
   }
   
   // Choose a random lane to target
   const targetLane = Math.floor(Math.random() * 3);

   // Start high above and ahead of the player so they can see it coming
   meteorGroup.position.set(
       lanes[targetLane], // Exact lane position
       20 + Math.random() * 5, // High in the sky but not too high
       player.position.z - 40 // Start ahead of player (visible in distance)
   );

   // Add meteor properties
   meteorGroup.userData = {
       targetLane: targetLane,
       fallSpeed: 0.3 + Math.random() * 0.1, // Faster fall speed so they're more dramatic
       rotationSpeed: Math.random() * 0.1 + 0.05,
       targetX: lanes[targetLane],
       chunks: meteorGroup.children.filter(child => child.userData.orbitSpeed),
       trailParticles: meteorGroup.children.filter(child => child.userData.flickerSpeed)
   };
   
   scene.add(meteorGroup);
   meteors.push(meteorGroup);
   debug(`Meteor created at position: ${meteorGroup.position.x}, ${meteorGroup.position.y}, ${meteorGroup.position.z}`);
   debug(`Total meteors: ${meteors.length}`);
}

// Create impact effect when meteor hits ground
function createMeteorImpact(position) {
   // Create explosion particles
   for (let i = 0; i < 15; i++) {
       const impactGeometry = new THREE.SphereGeometry(0.1, 8, 8);
       const impactMaterial = new THREE.MeshBasicMaterial({
           color: i < 8 ? 0xFF4500 : 0xFFFF00, // Orange and yellow
           transparent: true,
           opacity: 0.8
       });
       
       const impactParticle = new THREE.Mesh(impactGeometry, impactMaterial);
       impactParticle.position.copy(position);
       impactParticle.position.y = 0; // At ground level
       
       // Random velocity
       impactParticle.userData.velocity = new THREE.Vector3(
           (Math.random() - 0.5) * 0.2,
           Math.random() * 0.15,
           (Math.random() - 0.5) * 0.2
       );
       
       scene.add(impactParticle);
       explosionParticles.push(impactParticle);
   }
}