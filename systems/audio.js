// ==================== AUDIO SYSTEM ====================
// Music and sound effects using HTML5 Audio
// No dependencies required!

// Make audio functions globally accessible
window.AudioSystem = {
    initializeAudio,
    playCoinSound,
    playRareCoinSound,
    playJumpSound,
    playCrashSound,
    playPowerUpSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    updateBackgroundMusic
};

// Audio elements
let backgroundMusic = null;
let currentTrackName = 'medieval'; // Track this separately from game's currentTrack
let audioInitialized = false;
let musicPlaying = false;

// Shuffle mode variables
let shuffleMode = false;
let shuffleQueue = [];
let currentShuffleIndex = 0;
let trackTransitioning = false;

// Make shuffle mode accessible globally
window.shuffleMode = false;

// Sound effect audio pool for better performance
const soundPool = {
    coin: [],
    jump: [],
    crash: [],
    powerup: [],
    rareCoin: []
};

// Initialize audio system
function initializeAudio() {
    audioInitialized = true;
    
    // Create audio pools for sound effects (3 instances each for overlap)
    // Note: ../assets because we're in the systems folder
    for (let i = 0; i < 3; i++) {
        soundPool.coin.push(new Audio('assets/audio/coin.mp3'));
        soundPool.jump.push(new Audio('assets/audio/jump.mp3'));
        soundPool.crash.push(new Audio('assets/audio/crash.mp3'));
        soundPool.powerup.push(new Audio('assets/audio/powerup.mp3'));
        soundPool.rareCoin.push(new Audio('assets/audio/rare-coin.mp3'));
    }
    
    // Set volumes for sound effects
    Object.values(soundPool).flat().forEach(audio => {
        audio.volume = 0.3; // Adjust as needed
    });
    
    debug('✅ Audio system initialized');
}

// Helper to play sound from pool
function playFromPool(pool) {
    if (!audioInitialized || !soundEffectsEnabled) return;
    
    // Find an audio instance that's not currently playing
    const audio = pool.find(a => a.paused) || pool[0];
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Sound effect functions
function playCoinSound() {
    playFromPool(soundPool.coin);
}

function playRareCoinSound() {
    playFromPool(soundPool.rareCoin);
}

function playJumpSound() {
    playFromPool(soundPool.jump);
}

function playCrashSound() {
    playFromPool(soundPool.crash);
}

function playPowerUpSound() {
    playFromPool(soundPool.powerup);
}

// Background music functions
function startBackgroundMusic() {
    if (!audioInitialized || musicPlaying || !backgroundMusicEnabled) return;
    
    // Stop existing music if any
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic = null;
    }
    
    // Get the track to play (shuffle or current)
    const trackToPlay = shuffleMode ? getNextShuffleTrack() : currentTrack;
    
    // Create new audio element for the current track
    // Note: ../assets because we're in the systems folder
    backgroundMusic = new Audio(`assets/audio/${trackToPlay}-track.mp3`);
    
    // Set loop based on shuffle mode
    backgroundMusic.loop = !shuffleMode;
    backgroundMusic.volume = 0.5; // Adjust as needed
    
    // Add event listener for track end (for shuffle mode)
    if (shuffleMode) {
        backgroundMusic.addEventListener('ended', handleTrackEnd);
    }
    
    // Play the music
    backgroundMusic.play().then(() => {
        musicPlaying = true;
        currentTrackName = trackToPlay;
        debug('✅ Background music started:', trackToPlay);
        
        // Show "Now Playing" notification if shuffle mode
        if (shuffleMode) {
            showNowPlayingNotification(trackToPlay);
        }
    }).catch(e => {
        console.log('Music play failed:', e);
        musicPlaying = false;
    });
}

function stopBackgroundMusic() {
    if (!backgroundMusic || !musicPlaying) return;
    
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicPlaying = false;
    debug('✅ Background music stopped');
}

function updateBackgroundMusic() {
    if (!backgroundMusic || !musicPlaying) return;
    
    // Check if track changed
    if (currentTrack !== currentTrackName) {
        currentTrackName = currentTrack;
        stopBackgroundMusic();
        startBackgroundMusic();
        return;
    }
    
    // Adjust volume based on game speed (optional)
    const speedProgress = Math.min(currentSpeedLevel / 4, 1);
    const baseVolume = 0.5;
    const maxVolume = 0.7;
    backgroundMusic.volume = baseVolume + (speedProgress * (maxVolume - baseVolume));
    
    // You can also adjust playback rate for tempo changes (optional)
    // backgroundMusic.playbackRate = 1.0 + (speedProgress * 0.2); // Up to 20% faster
}

// ==================== SHUFFLE MODE FUNCTIONS ====================

// Initialize shuffle queue
function initializeShuffleQueue() {
    // INJECTION POINT: availableTracks should contain all your tracks
    shuffleQueue = [...availableTracks.map(track => track.id)];
    shuffleArray(shuffleQueue);
    currentShuffleIndex = 0;
    debug('🔀 Shuffle queue initialized:', shuffleQueue);
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Get next track in shuffle queue
function getNextShuffleTrack() {
    if (shuffleQueue.length === 0) {
        initializeShuffleQueue();
    }
    
    const track = shuffleQueue[currentShuffleIndex];
    currentShuffleIndex = (currentShuffleIndex + 1) % shuffleQueue.length;
    
    // Re-shuffle when we've played all tracks
    if (currentShuffleIndex === 0) {
        shuffleArray(shuffleQueue);
        debug('🔀 Re-shuffled queue:', shuffleQueue);
    }
    
    return track;
}

// Handle track end (for shuffle mode)
function handleTrackEnd() {
    if (!shuffleMode || trackTransitioning) return;
    
    trackTransitioning = true;
    debug('🎵 Track ended, transitioning to next...');
    
    // Smooth transition: fade out current, start next
    fadeOutAndSwitchTrack();
}

// Smooth transition between tracks
function fadeOutAndSwitchTrack() {
    if (!backgroundMusic) return;
    
    const fadeInterval = setInterval(() => {
        if (backgroundMusic.volume > 0.1) {
            backgroundMusic.volume = Math.max(0, backgroundMusic.volume - 0.1);
        } else {
            clearInterval(fadeInterval);
            
            // Start next track
            stopBackgroundMusic();
            trackTransitioning = false;
            
            // Small delay before next track
            setTimeout(() => {
                if (shuffleMode && backgroundMusicEnabled) {
                    startBackgroundMusic();
                }
            }, 500);
        }
    }, 100);
}

// Toggle shuffle mode
function toggleShuffleMode() {
    shuffleMode = !shuffleMode;
    window.shuffleMode = shuffleMode; // Keep global in sync
    debug(shuffleMode ? '🔀 Shuffle mode enabled' : '🔀 Shuffle mode disabled');
    
    if (shuffleMode) {
        initializeShuffleQueue();
        // Restart music if currently playing
        if (musicPlaying) {
            stopBackgroundMusic();
            startBackgroundMusic();
        }
    } else {
        // Return to normal loop mode
        if (musicPlaying && backgroundMusic) {
            backgroundMusic.loop = true;
            backgroundMusic.removeEventListener('ended', handleTrackEnd);
        }
    }
    
    // Update UI
    updateShuffleUI();
    
    // Save preference
    if (typeof saveGameData === 'function') {
        saveGameData('settings_change');
    }
}

// Update shuffle UI
function updateShuffleUI() {
    const shuffleBtn = document.getElementById('shuffleToggleBtn');
    if (shuffleBtn) {
        shuffleBtn.textContent = shuffleMode ? '🔀 Shuffle: ON' : '🔀 Shuffle: OFF';
        shuffleBtn.style.background = shuffleMode ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)';
        
        // Update global variable to keep everything in sync
        window.shuffleMode = shuffleMode;
    }
}

// Show "Now Playing" notification
function showNowPlayingNotification(trackId) {
    // INJECTION POINT: Find track info from availableTracks array
    const track = availableTracks.find(t => t.id === trackId);
    if (!track) return;
    
    // Remove any existing notification
    const existing = document.getElementById('nowPlayingNotification');
    if (existing) {
        existing.remove();
    }
    
    // Detect if mobile (simple check)
    const isMobile = window.innerWidth <= 768;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'nowPlayingNotification';
    
    if (isMobile) {
        // Mobile: Compact scrolling ticker
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 10000;
            width: 280px;
            max-width: 90vw;
            height: 32px;
            border: 2px solid #4CAF50;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            transition: transform 0.4s ease;
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            align-items: center;
        `;
        
        // Create scrolling text
        const scrollText = document.createElement('div');
        scrollText.style.cssText = `
            animation: scrollText 4s linear infinite;
            font-weight: 500;
        `;
        scrollText.textContent = `♪ Now Playing: ${track.name} by ${track.artist || 'Unknown Artist'}`;
        
        notification.appendChild(scrollText);
        
        // Add CSS animation for scrolling
        if (!document.getElementById('scrollTextStyle')) {
            const style = document.createElement('style');
            style.id = 'scrollTextStyle';
            style.textContent = `
                @keyframes scrollText {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `;
            document.head.appendChild(style);
        }
        
    } else {
        // Desktop: Original style but slightly smaller
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 13px;
            z-index: 10000;
            max-width: 250px;
            border-left: 4px solid #4CAF50;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 2px; font-size: 11px;">♪ Now Playing</div>
            <div style="font-size: 12px;">${track.name}</div>
            <div style="font-size: 10px; opacity: 0.7;">by ${track.artist || 'Unknown Artist'}</div>
        `;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        if (isMobile) {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        } else {
            notification.style.transform = 'translateX(0)';
        }
    }, 100);
    
    // Auto-hide after appropriate time
    const hideDelay = isMobile ? 5000 : 4000; // Shorter since animation is smoother now
    setTimeout(() => {
        if (isMobile) {
            notification.style.transform = 'translateX(-50%) translateY(-100%)';
        } else {
            notification.style.transform = 'translateX(100%)';
        }
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, hideDelay);
}

// Make shuffle functions globally accessible
window.AudioSystem.toggleShuffleMode = toggleShuffleMode;
window.AudioSystem.getShuffleMode = () => shuffleMode;
window.toggleShuffleMode = toggleShuffleMode; // Also make it directly accessible

// Create placeholder sound effects using Web Audio API
// (These are temporary until you create proper MP3s)
function createPlaceholderSounds() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Helper to create simple beep sounds
    function createBeep(frequency, duration, type = 'sine') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Override the pool functions temporarily
    window.playCoinSound = () => {
        if (!audioInitialized || !soundEffectsEnabled) return;
        createBeep(800, 0.1, 'square');
    };
    
    window.playJumpSound = () => {
        if (!audioInitialized || !soundEffectsEnabled) return;
        createBeep(400, 0.2, 'sine');
    };
    
    window.playCrashSound = () => {
        if (!audioInitialized || !soundEffectsEnabled) return;
        createBeep(150, 0.3, 'sawtooth');
    };
    
    window.playPowerUpSound = () => {
        if (!audioInitialized || !soundEffectsEnabled) return;
        createBeep(600, 0.3, 'triangle');
    };
    
    window.playRareCoinSound = () => {
        if (!audioInitialized || !soundEffectsEnabled) return;
        createBeep(600, 0.1, 'triangle');
        setTimeout(() => createBeep(800, 0.1, 'triangle'), 100);
        setTimeout(() => createBeep(1000, 0.1, 'triangle'), 200);
    };
    
    debug('✅ Placeholder sounds created');
}

// Initialize placeholder sounds on first user interaction
document.addEventListener('click', () => {
    if (!window.tempSounds) {
        createPlaceholderSounds();
    }
}, { once: true });