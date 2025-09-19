class CyberProfile {
    constructor() {
        this.loadingMessages = [
            '正在连接神经网络...',
            '初始化量子处理器...',
            '加载赛博空间数据...',
            '建立安全连接...',
            '同步数字身份...',
            '启动全息界面...',
            '激活防火墙系统...',
            '解析数据流协议...',
            '系统准备就绪...'
        ];
        
        this.init();
        this.setupEventListeners();
        this.startLoadingSequence();
    }

    init() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadingCanvas = document.getElementById('loading-canvas');
        this.loadingCtx = this.loadingCanvas.getContext('2d');
        this.particles = [];
        this.loadingParticles = [];
        this.loadingWaves = [];
        this.audioEnabled = false;
        
        this.resizeCanvas();
        this.createLoadingParticles();
        this.createLoadingWaves();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Audio control
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle.addEventListener('click', () => this.toggleAudio());
        
        // Card hover effects
        const cards = document.querySelectorAll('.social-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.playHoverSound());
            card.addEventListener('click', (e) => this.playClickSound());
        });
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        if (this.loadingCanvas) {
            this.loadingCanvas.width = window.innerWidth;
            this.loadingCanvas.height = window.innerHeight;
        }
    }

    createLoadingParticles() {
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            this.loadingParticles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: this.getRandomNeonColor(),
                life: Math.random() * 200 + 100,
                trail: []
            });
        }
    }

    createLoadingWaves() {
        for (let i = 0; i < 5; i++) {
            this.loadingWaves.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                radius: 0,
                maxRadius: Math.random() * 300 + 200,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                color: this.getRandomNeonColor(),
                frequency: Math.random() * 0.02 + 0.01
            });
        }
    }

    animateLoadingParticles() {
        if (!this.loadingCtx) return;
        
        this.loadingCtx.clearRect(0, 0, this.loadingCanvas.width, this.loadingCanvas.height);
        
        // Draw waves
        this.loadingWaves.forEach(wave => {
            wave.radius += wave.speed;
            
            if (wave.radius > wave.maxRadius) {
                wave.radius = 0;
                wave.color = this.getRandomNeonColor();
            }
            
            this.loadingCtx.save();
            this.loadingCtx.globalAlpha = wave.opacity * (1 - wave.radius / wave.maxRadius);
            this.loadingCtx.strokeStyle = wave.color;
            this.loadingCtx.lineWidth = 2;
            this.loadingCtx.shadowBlur = 20;
            this.loadingCtx.shadowColor = wave.color;
            this.loadingCtx.beginPath();
            this.loadingCtx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            this.loadingCtx.stroke();
            this.loadingCtx.restore();
        });
        
        // Draw particles with trails
        this.loadingParticles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // Add to trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 10) {
                particle.trail.shift();
            }
            
            // Boundary check with bounce
            if (particle.x < 0 || particle.x > this.loadingCanvas.width) {
                particle.vx *= -0.8;
                particle.color = this.getRandomNeonColor();
            }
            if (particle.y < 0 || particle.y > this.loadingCanvas.height) {
                particle.vy *= -0.8;
                particle.color = this.getRandomNeonColor();
            }
            
            // Regenerate particle if life ends
            if (particle.life <= 0) {
                particle.x = Math.random() * this.loadingCanvas.width;
                particle.y = Math.random() * this.loadingCanvas.height;
                particle.vx = (Math.random() - 0.5) * 3;
                particle.vy = (Math.random() - 0.5) * 3;
                particle.life = Math.random() * 200 + 100;
                particle.color = this.getRandomNeonColor();
                particle.trail = [];
            }
            
            // Draw trail
            this.loadingCtx.save();
            particle.trail.forEach((point, trailIndex) => {
                const trailOpacity = (trailIndex / particle.trail.length) * particle.opacity * 0.5;
                this.loadingCtx.globalAlpha = trailOpacity;
                this.loadingCtx.fillStyle = particle.color;
                this.loadingCtx.shadowBlur = 10;
                this.loadingCtx.shadowColor = particle.color;
                this.loadingCtx.beginPath();
                this.loadingCtx.arc(point.x, point.y, particle.size * (trailIndex / particle.trail.length), 0, Math.PI * 2);
                this.loadingCtx.fill();
            });
            this.loadingCtx.restore();
            
            // Draw main particle
            this.loadingCtx.save();
            this.loadingCtx.globalAlpha = particle.opacity;
            this.loadingCtx.fillStyle = particle.color;
            this.loadingCtx.shadowBlur = 20;
            this.loadingCtx.shadowColor = particle.color;
            this.loadingCtx.beginPath();
            this.loadingCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.loadingCtx.fill();
            this.loadingCtx.restore();
            
            // Draw connections between nearby particles
            this.loadingParticles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const distance = Math.sqrt(
                        Math.pow(particle.x - otherParticle.x, 2) + 
                        Math.pow(particle.y - otherParticle.y, 2)
                    );
                    
                    if (distance < 80) {
                        this.loadingCtx.save();
                        this.loadingCtx.globalAlpha = (80 - distance) / 80 * 0.3;
                        this.loadingCtx.strokeStyle = particle.color;
                        this.loadingCtx.lineWidth = 1;
                        this.loadingCtx.shadowBlur = 5;
                        this.loadingCtx.shadowColor = particle.color;
                        this.loadingCtx.beginPath();
                        this.loadingCtx.moveTo(particle.x, particle.y);
                        this.loadingCtx.lineTo(otherParticle.x, otherParticle.y);
                        this.loadingCtx.stroke();
                        this.loadingCtx.restore();
                    }
                }
            });
        });
        
        // Draw scanning lines
        const time = Date.now() * 0.001;
        for (let i = 0; i < 3; i++) {
            const y = (Math.sin(time + i * 2) * 0.5 + 0.5) * this.loadingCanvas.height;
            this.loadingCtx.save();
            this.loadingCtx.globalAlpha = 0.6;
            this.loadingCtx.strokeStyle = '#00ffff';
            this.loadingCtx.lineWidth = 2;
            this.loadingCtx.shadowBlur = 10;
            this.loadingCtx.shadowColor = '#00ffff';
            this.loadingCtx.beginPath();
            this.loadingCtx.moveTo(0, y);
            this.loadingCtx.lineTo(this.loadingCanvas.width, y);
            this.loadingCtx.stroke();
            this.loadingCtx.restore();
        }
    }

    startLoadingSequence() {
        const progressBar = document.getElementById('loading-progress');
        const percentage = document.getElementById('loading-percentage');
        const messagesContainer = document.getElementById('loading-messages');
        
        let progress = 0;
        let messageIndex = 0;
        
        // Start loading particle animation
        const animateLoading = () => {
            this.animateLoadingParticles();
            if (document.getElementById('loading-screen').classList.contains('hidden')) {
                return;
            }
            requestAnimationFrame(animateLoading);
        };
        animateLoading();
        
        // Add dynamic loading effects
        this.addLoadingEffects();
        
        const updateProgress = () => {
            const increment = Math.random() * 4 + 2;
            progress += increment;
            
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            percentage.textContent = Math.floor(progress) + '%';
            
            // Update loading messages with glitch effect
            if (progress > (messageIndex + 1) * 11 && messageIndex < this.loadingMessages.length - 1) {
                messageIndex++;
                const messageElement = document.createElement('div');
                messageElement.className = 'loading-message';
                messageElement.textContent = this.loadingMessages[messageIndex];
                
                // Add glitch effect to message
                setTimeout(() => {
                    messageElement.style.animation = 'message-glitch 0.5s ease-in-out';
                }, 100);
                
                messagesContainer.innerHTML = '';
                messagesContainer.appendChild(messageElement);
            }
            
            if (progress < 100) {
                setTimeout(updateProgress, 80 + Math.random() * 120);
            } else {
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 1500);
            }
        };
        
        // Start progress after a short delay
        setTimeout(updateProgress, 800);
    }

    addLoadingEffects() {
        // Add dynamic CSS for enhanced loading effects
        const loadingStyle = document.createElement('style');
        loadingStyle.id = 'enhanced-loading-style';
        loadingStyle.textContent = `
            @keyframes message-glitch {
                0%, 100% { transform: translateX(0); }
                10% { transform: translateX(-2px) skew(-1deg); }
                20% { transform: translateX(2px) skew(1deg); }
                30% { transform: translateX(-1px) skew(-0.5deg); }
                40% { transform: translateX(1px) skew(0.5deg); }
                50% { transform: translateX(-2px) skew(-1deg); }
                60% { transform: translateX(2px) skew(1deg); }
                70% { transform: translateX(-1px) skew(-0.5deg); }
                80% { transform: translateX(1px) skew(0.5deg); }
                90% { transform: translateX(-1px); }
            }
            
            .loading-progress::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.4), 
                    transparent);
                animation: progress-shine 2s ease-in-out infinite;
            }
            
            @keyframes progress-shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .logo-char {
                position: relative;
            }
            
            .logo-char::after {
                content: attr(data-char);
                position: absolute;
                top: 0;
                left: 0;
                color: #ff00ff;
                z-index: -1;
                animation: logo-shadow 3s ease-in-out infinite;
            }
            
            @keyframes logo-shadow {
                0%, 100% { 
                    transform: translate(0, 0);
                    opacity: 0;
                }
                25% { 
                    transform: translate(2px, 2px);
                    opacity: 0.5;
                }
                50% { 
                    transform: translate(-1px, 1px);
                    opacity: 0.7;
                }
                75% { 
                    transform: translate(1px, -1px);
                    opacity: 0.3;
                }
            }
            
            .loading-decorations::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 200px;
                height: 200px;
                border: 1px solid #00ffff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: decoration-pulse 4s ease-in-out infinite;
            }
            
            @keyframes decoration-pulse {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.3;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0.8;
                }
            }
            
            .loading-decorations::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 150px;
                height: 150px;
                border: 2px solid #ff00ff;
                transform: translate(-50%, -50%) rotate(45deg);
                animation: decoration-rotate 6s linear infinite;
            }
            
            @keyframes decoration-rotate {
                from { transform: translate(-50%, -50%) rotate(45deg); }
                to { transform: translate(-50%, -50%) rotate(405deg); }
            }
        `;
        document.head.appendChild(loadingStyle);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            this.initMainContent();
            
            // Remove loading styles
            const loadingStyle = document.getElementById('enhanced-loading-style');
            if (loadingStyle) {
                loadingStyle.remove();
            }
        }, 1000);
    }

    initMainContent() {
        this.createParticles();
        this.createMatrixRain();
        this.initTypewriter();
        this.startAnimations();
        this.setupIntersectionObserver();
        this.playSystemSound();
    }

    createParticles() {
        const particleCount = Math.min(150, Math.floor(window.innerWidth / 10));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomNeonColor()
            });
        }
    }

    createMatrixRain() {
        const matrixContainer = document.getElementById('matrix-rain');
        // 使用数字、字母和符号替代日文
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        
        for (let i = 0; i < 50; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -100px;
                color: #00ff41;
                font-family: 'Orbitron', monospace;
                font-size: 14px;
                font-weight: bold;
                animation: matrix-fall ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                text-shadow: 0 0 5px #00ff41;
            `;
            
            let text = '';
            for (let j = 0; j < 25; j++) {
                text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
            }
            column.innerHTML = text;
            matrixContainer.appendChild(column);
        }

        // Add CSS for matrix animation
        if (!document.getElementById('matrix-style')) {
            const style = document.createElement('style');
            style.id = 'matrix-style';
            style.textContent = `
                @keyframes matrix-fall {
                    0% { 
                        transform: translateY(-100px); 
                        opacity: 0; 
                    }
                    10% { 
                        opacity: 1; 
                    }
                    90% { 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translateY(100vh); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    getRandomNeonColor() {
        const colors = ['#00ffff', '#ff00ff', '#39ff14', '#0080ff', '#ff0080', '#ffff00', '#ff4500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animateParticles() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Draw connections
            this.particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    const distance = Math.sqrt(
                        Math.pow(particle.x - otherParticle.x, 2) + 
                        Math.pow(particle.y - otherParticle.y, 2)
                    );
                    
                    if (distance < 100) {
                        this.ctx.save();
                        this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                        this.ctx.strokeStyle = particle.color;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                }
            });
        });
    }

    initTypewriter() {
        const mottoText = document.getElementById('motto-text');
        const messages = [
            '不为失败找理由，只为成功找方法',
            'Code is poetry in motion',
            '技术改变世界，创新驱动未来',
            'Stay hungry, stay foolish',
            '用代码编织梦想，用技术点亮未来'
        ];
        
        let messageIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeWriter = () => {
            const currentMessage = messages[messageIndex];
            
            if (!isDeleting) {
                mottoText.textContent = currentMessage.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentMessage.length) {
                    setTimeout(() => isDeleting = true, 2000);
                }
            } else {
                mottoText.textContent = currentMessage.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    messageIndex = (messageIndex + 1) % messages.length;
                }
            }
            
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeWriter, speed);
        };
        
        typeWriter();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);
        
        // Observe sections
        document.querySelectorAll('.social-section, .skills-section').forEach(section => {
            section.style.opacity = '0';
            observer.observe(section);
        });
        
        // Observe cards with staggered animation
        document.querySelectorAll('.social-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
        
        // Observe skill categories
        document.querySelectorAll('.skill-category').forEach((category, index) => {
            category.style.opacity = '0';
            category.style.animationDelay = `${index * 0.2}s`;
            observer.observe(category);
        });
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle.classList.toggle('muted', !this.audioEnabled);
        
        if (this.audioEnabled) {
            this.playSystemSound();
        }
    }

    playHoverSound() {
        if (!this.audioEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    playClickSound() {
        if (!this.audioEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    playSystemSound() {
        if (!this.audioEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    startAnimations() {
        const animate = () => {
            this.animateParticles();
            requestAnimationFrame(animate);
        };
        animate();
        
        // Update last update time
        const lastUpdate = document.getElementById('last-update');
        if (lastUpdate) {
            const now = new Date();
            lastUpdate.textContent = now.toISOString().split('T')[0];
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberProfile();
});

// Add mouse trail effect
document.addEventListener('mousemove', (e) => {
    // Only add trail effect after loading is complete
    if (document.getElementById('loading-screen') && 
        !document.getElementById('loading-screen').classList.contains('hidden')) {
        return;
    }
    
    const x = e.clientX;
    const y = e.clientY;
    
    // Create trailing effect with throttling
    if (Math.random() > 0.7) { // Only create trail 30% of the time for performance
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #00ffff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: trail-fade 0.5s ease-out forwards;
            box-shadow: 0 0 10px #00ffff;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (document.body.contains(trail)) {
                document.body.removeChild(trail);
            }
        }, 500);
    }
});

// Add trail fade animation
if (!document.getElementById('trail-style')) {
    const trailStyle = document.createElement('style');
    trailStyle.id = 'trail-style';
    trailStyle.textContent = `
        @keyframes trail-fade {
            0% { opacity: 0.8; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(trailStyle);
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Add focus styles for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .social-card:focus,
            .audio-toggle:focus {
                outline: 2px solid var(--neon-cyan);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
});

// Add performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
            console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
        }
    });
});

try {
    performanceObserver.observe({ entryTypes: ['navigation'] });
} catch (e) {
    console.log('Performance Observer not supported');
}

// Add error handling for canvas
window.addEventListener('error', (e) => {
    if (e.message.includes('canvas')) {
        console.warn('Canvas error detected, falling back to CSS animations only');
        // Hide canvas elements if there are issues
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            canvas.style.display = 'none';
        });
    }
});

// Add visibility change handling to pause animations when tab is not active
document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    const canvases = document.querySelectorAll('canvas');
    
    canvases.forEach(canvas => {
        if (isHidden) {
            canvas.style.animationPlayState = 'paused';
        } else {
            canvas.style.animationPlayState = 'running';
        }
    });
});

// Add smooth scroll for any internal navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading screen skip functionality (for development/testing)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('loading-screen') && 
        !document.getElementById('loading-screen').classList.contains('hidden')) {
        const cyberProfile = new CyberProfile();
        cyberProfile.hideLoadingScreen();
    }
});

// Add enhanced loading screen interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('div');
            const rect = loadingScreen.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0,255,255,0.3), transparent);
                pointer-events: none;
                animation: ripple-expand 0.8s ease-out forwards;
                z-index: 1000;
            `;
            
            loadingScreen.appendChild(ripple);
            
            setTimeout(() => {
                if (loadingScreen.contains(ripple)) {
                    loadingScreen.removeChild(ripple);
                }
            }, 800);
        });
    }
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-expand {
            0% {
                width: 0;
                height: 0;
                opacity: 0.8;
                transform: translate(-50%, -50%);
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
                transform: translate(-50%, -50%);
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

