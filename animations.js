/**
 * React Bits 风格动画效果 - 手机端优化版
 * 灵感来源于 react-bits 开源组件库
 * 包含：粒子背景、文字模糊揭示、卡片滚动动画、发光效果
 */

// ========================================
// 1. 神秘粒子背景 (灵感: react-bits Backgrounds)
// ========================================

class MysticalParticles {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;
        this.isMobile = window.innerWidth < 768;
        
        this.init();
    }
    
    init() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: ${this.isMobile ? 0.4 : 0.6};
        `;
        this.container.prepend(this.canvas);
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isMobile = window.innerWidth < 768;
    }
    
    createParticles() {
        // 手机端大幅减少粒子数量以提升性能
        const count = this.isMobile 
            ? Math.min(20, Math.floor(window.innerWidth / 40))
            : Math.min(80, Math.floor(window.innerWidth / 15));
        this.particles = [];
        
        const symbols = ['☯', '✧', '◇', '○', '△', '☰', '☱', '☲', '☳'];
        const colors = [
            'rgba(218, 165, 32, 0.6)',
            'rgba(251, 191, 36, 0.4)',
            'rgba(139, 69, 19, 0.4)',
            'rgba(210, 105, 30, 0.3)',
            'rgba(255, 215, 0, 0.3)',
        ];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * (this.isMobile ? 0.3 : 0.5),
                speedY: (Math.random() - 0.5) * 0.3 - 0.1,
                opacity: Math.random() * 0.5 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                useSymbol: Math.random() > 0.6,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
            });
        }
    }
    
    bindEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 250);
        });
        
        // 手机端使用触摸事件
        if ('ontouchstart' in window) {
            document.addEventListener('touchmove', (e) => {
                if (e.touches[0]) {
                    this.mouseX = e.touches[0].clientX;
                    this.mouseY = e.touches[0].clientY;
                }
            }, { passive: true });
        } else {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.pulse += p.pulseSpeed;
            const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
            
            // 手机端跳过鼠标交互
            if (!this.isMobile) {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    p.x += dx * 0.001;
                    p.y += dy * 0.001;
                }
            }
            
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = this.canvas.height + 10;
            if (p.y > this.canvas.height + 10) p.y = -10;
            
            if (p.useSymbol) {
                this.ctx.font = `${p.size * 4}px serif`;
                this.ctx.fillStyle = p.color.replace(/[\d.]+\)$/, pulseOpacity + ')');
                this.ctx.fillText(p.symbol, p.x, p.y);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color.replace(/[\d.]+\)$/, pulseOpacity + ')');
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, (pulseOpacity * 0.3) + ')'));
                gradient.addColorStop(1, 'rgba(218, 165, 32, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        });
        
        this.drawConnections();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        // 手机端跳过连线绘制以提升性能
        if (this.isMobile) return;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(218, 165, 32, ${0.1 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.canvas.remove();
    }
}


// ========================================
// 2. 文字模糊揭示动画 (灵感: react-bits BlurText)
// ========================================

class BlurTextReveal {
    constructor(element, options = {}) {
        this.element = element;
        this.text = element.textContent;
        this.delay = options.delay || 50;
        this.duration = options.duration || 600;
        this.direction = options.direction || 'up';
        this.init();
    }
    
    init() {
        this.element.textContent = '';
        this.element.style.overflow = 'hidden';
        
        const chars = this.text.split('');
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                filter: blur(8px);
                transform: ${this.getInitialTransform()};
                transition: all ${this.duration}ms ease-out;
                transition-delay: ${index * this.delay}ms;
            `;
            span.className = 'blur-char';
            this.element.appendChild(span);
        });
    }
    
    getInitialTransform() {
        switch (this.direction) {
            case 'up': return 'translateY(20px)';
            case 'down': return 'translateY(-20px)';
            case 'left': return 'translateX(20px)';
            case 'right': return 'translateX(-20px)';
            default: return 'translateY(20px)';
        }
    }
    
    reveal() {
        const chars = this.element.querySelectorAll('.blur-char');
        chars.forEach(char => {
            char.style.opacity = '1';
            char.style.filter = 'blur(0)';
            char.style.transform = 'translate(0)';
        });
    }
}


// ========================================
// 3. 滚动触发动画 (灵感: react-bits ScrollReveal)
// ========================================

class ScrollReveal {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    if (entry.target.hasAttribute('data-blur-text')) {
                        const blurInstance = entry.target._blurInstance;
                        if (blurInstance) blurInstance.reveal();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });
    }
    
    observe(selector) {
        document.querySelectorAll(selector).forEach(el => {
            this.observer.observe(el);
            this.elements.push(el);
        });
    }
    
    destroy() {
        this.observer.disconnect();
    }
}


// ========================================
// 4. 发光脉冲效果 (灵感: react-bits GlowEffect)
// ========================================

class GlowPulse {
    static apply(element, options = {}) {
        const color = options.color || 'rgba(218, 165, 32, 0.3)';
        const intensity = options.intensity || 20;
        const speed = options.speed || 2;
        
        element.style.animation = `glowPulse ${speed}s ease-in-out infinite`;
        element.style.setProperty('--glow-color', color);
        element.style.setProperty('--glow-intensity', intensity + 'px');
    }
}


// ========================================
// 5. 文字打字效果 (灵感: react-bits TypewriterText)
// ========================================

class TypewriterText {
    constructor(element, options = {}) {
        this.element = element;
        this.text = options.text || element.textContent;
        this.speed = options.speed || 30;
        this.delay = options.delay || 0;
        this.onComplete = options.onComplete || null;
        this.currentIndex = 0;
    }
    
    start() {
        this.element.textContent = '';
        this.currentIndex = 0;
        
        setTimeout(() => {
            this.type();
        }, this.delay);
    }
    
    type() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text[this.currentIndex];
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.onComplete) {
            this.onComplete();
        }
    }
    
    stop() {
        this.currentIndex = this.text.length;
        this.element.textContent = this.text;
    }
}


// ========================================
// 6. 道家八卦旋转动画增强
// ========================================

class BaguaRotation {
    constructor(element) {
        this.element = element;
        this.rotation = 0;
        this.speed = 0.5;
        this.isSpinning = false;
        this.animationId = null;
    }
    
    startSlow() {
        this.isSpinning = true;
        this.animate();
    }
    
    animate() {
        if (!this.isSpinning) return;
        this.rotation += this.speed;
        this.element.style.transform = `rotate(${this.rotation}deg)`;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    burst(duration = 1000) {
        const originalSpeed = this.speed;
        this.speed = 8;
        
        setTimeout(() => {
            this.speed = originalSpeed;
        }, duration);
    }
    
    stop() {
        this.isSpinning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}


// ========================================
// 7. 卡片浮动效果
// ========================================

class FloatingEffect {
    static apply(element, options = {}) {
        const amplitude = options.amplitude || 5;
        const speed = options.speed || 2;
        const delay = options.delay || 0;
        
        element.style.animation = `floating ${speed}s ease-in-out ${delay}s infinite`;
        element.style.setProperty('--float-amplitude', amplitude + 'px');
    }
}


// ========================================
// 8. 光标追踪光效
// ========================================

class CursorGlow {
    constructor() {
        // 手机端不创建光标光效
        if ('ontouchstart' in window || window.innerWidth < 768) {
            this.glow = null;
            return;
        }
        this.glow = document.createElement('div');
        this.init();
    }
    
    init() {
        this.glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(218, 165, 32, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 1;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(this.glow);
        
        document.addEventListener('mousemove', (e) => {
            this.glow.style.left = e.clientX + 'px';
            this.glow.style.top = e.clientY + 'px';
            this.glow.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.glow.style.opacity = '0';
        });
    }
    
    destroy() {
        if (this.glow) {
            this.glow.remove();
        }
    }
}


// ========================================
// 9. 初始化所有动画
// ========================================

function initReactBitsAnimations() {
    const particles = new MysticalParticles(document.body);
    const cursorGlow = new CursorGlow();
    const scrollReveal = new ScrollReveal();
    
    const isMobile = window.innerWidth < 768;
    
    // 标题文字动画
    const headerTitle = document.querySelector('.header h1');
    if (headerTitle) {
        headerTitle.style.opacity = '0';
        headerTitle.style.transform = 'translateY(10px)';
        headerTitle.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        headerTitle.style.opacity = '1';
                        headerTitle.style.transform = 'translateY(0)';
                    }, 300);
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        titleObserver.observe(headerTitle);
    }
    
    // 副标题动画
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(10px)';
        subtitle.style.transition = 'all 0.8s ease-out';
        setTimeout(() => {
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 800);
    }
    
    // 卡片滚动揭示
    scrollReveal.observe('.card');
    scrollReveal.observe('.theory-banner');
    scrollReveal.observe('.footer');
    
    // 八卦增强旋转
    const baguaSymbol = document.querySelector('.bagua-symbol');
    if (baguaSymbol) {
        const bagua = new BaguaRotation(baguaSymbol);
        bagua.startSlow();
    }
    
    // 按钮悬浮效果（手机端跳过浮动动画）
    if (!isMobile) {
        const primaryBtn = document.querySelector('.primary-btn');
        if (primaryBtn) {
            FloatingEffect.apply(primaryBtn, { amplitude: 3, speed: 3 });
        }
    }
    
    // 方法按钮入场动画
    const methodBtns = document.querySelectorAll('.method-btn');
    methodBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px) scale(0.95)';
        btn.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
        
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0) scale(1)';
        }, 200);
    });
    
    // 理论引用
    const theoryQuote = document.querySelector('.theory-quote');
    if (theoryQuote) {
        theoryQuote._originalHTML = theoryQuote.innerHTML;
    }
    
    return {
        particles,
        cursorGlow,
        scrollReveal
    };
}

let animationInstances = null;
document.addEventListener('DOMContentLoaded', () => {
    animationInstances = initReactBitsAnimations();
});