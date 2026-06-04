/**
 * 道家仙气特效系统
 * 仙气飘飘，深沉内敛
 * 包含：水墨云雾、仙气粒子、太极能量场、气韵流动、古卷展开、五行流转
 */

// ========================================
// 1. 水墨云雾背景 - 缓缓流动的仙气
// ========================================

class InkMistBackground {
    constructor(container) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.clouds = [];
        this.time = 0;
        this.animationId = null;
        container.appendChild(this.canvas);
        this.init();
    }
    
    init() {
        this.canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 0; opacity: 0.4;
            mix-blend-mode: screen;
        `;
        this.resize();
        this.createClouds();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createClouds() {
        for (let i = 0; i < 8; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 150 + Math.random() * 250,
                speedX: (Math.random() - 0.5) * 0.15,
                speedY: (Math.random() - 0.5) * 0.08,
                opacity: 0.02 + Math.random() * 0.04,
                phase: Math.random() * Math.PI * 2,
                hue: 35 + Math.random() * 15, // 金棕色调
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.005;
        
        this.clouds.forEach(c => {
            c.x += c.speedX + Math.sin(this.time + c.phase) * 0.3;
            c.y += c.speedY + Math.cos(this.time * 0.7 + c.phase) * 0.2;
            
            // 边界循环
            if (c.x < -c.radius) c.x = this.canvas.width + c.radius;
            if (c.x > this.canvas.width + c.radius) c.x = -c.radius;
            if (c.y < -c.radius) c.y = this.canvas.height + c.radius;
            if (c.y > this.canvas.height + c.radius) c.y = -c.radius;
            
            // 水墨晕染效果 - 多层渐变
            const breathe = 1 + 0.15 * Math.sin(this.time * 2 + c.phase);
            const r = c.radius * breathe;
            
            const gradient = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
            gradient.addColorStop(0, `hsla(${c.hue}, 40%, 30%, ${c.opacity * 1.5})`);
            gradient.addColorStop(0.3, `hsla(${c.hue}, 30%, 25%, ${c.opacity})`);
            gradient.addColorStop(0.6, `hsla(${c.hue + 10}, 20%, 20%, ${c.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${c.hue}, 10%, 15%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        cancelAnimationFrame(this.animationId);
        this.canvas.remove();
    }
}

// ========================================
// 2. 仙气粒子 - 飘落的灵气光点 + 花瓣
// ========================================

class EtherealParticles {
    constructor(container) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.time = 0;
        this.animationId = null;
        container.appendChild(this.canvas);
        this.init();
    }
    
    init() {
        this.canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 2;
        `;
        this.resize();
        this.createParticles();
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const count = Math.min(60, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const types = ['dot', 'petal', 'qi', 'star'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        return {
            x: Math.random() * this.canvas.width,
            y: -10 - Math.random() * this.canvas.height,
            type: type,
            size: type === 'petal' ? 3 + Math.random() * 4 : 1 + Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: 0.2 + Math.random() * 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.03,
            opacity: 0.1 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
            // 仙气摆动
            swayAmplitude: 0.5 + Math.random() * 1.5,
            swaySpeed: 0.01 + Math.random() * 0.02,
            // 颜色
            color: this.getRandomColor(type),
        };
    }
    
    getRandomColor(type) {
        const colors = {
            dot: ['rgba(218,165,32,', 'rgba(255,215,0,', 'rgba(245,191,10,'],
            petal: ['rgba(255,182,193,', 'rgba(255,160,200,', 'rgba(255,200,220,'],
            qi: ['rgba(180,220,255,', 'rgba(200,230,255,', 'rgba(160,200,240,'],
            star: ['rgba(255,255,200,', 'rgba(255,255,240,', 'rgba(255,250,200,'],
        };
        const pool = colors[type] || colors.dot;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 1;
        
        this.particles.forEach((p, i) => {
            // 摆动
            p.x += p.speedX + Math.sin(this.time * p.swaySpeed + p.phase) * p.swayAmplitude;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;
            
            // 超出底部则重置到顶部
            if (p.y > this.canvas.height + 20) {
                Object.assign(p, this.createParticle());
                p.y = -20;
            }
            
            // 脉冲透明度
            const pulse = p.opacity * (0.7 + 0.3 * Math.sin(this.time * 0.02 + p.phase));
            
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.globalAlpha = pulse;
            
            if (p.type === 'petal') {
                this.drawPetal(p);
            } else if (p.type === 'qi') {
                this.drawQiFlame(p);
            } else if (p.type === 'star') {
                this.drawStar(p);
            } else {
                this.drawDot(p);
            }
            
            this.ctx.restore();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawDot(p) {
        // 灵气光点 - 带光晕
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
        gradient.addColorStop(0, p.color + '0.8)');
        gradient.addColorStop(0.5, p.color + '0.3)');
        gradient.addColorStop(1, p.color + '0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = p.color + '1)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPetal(p) {
        // 花瓣 - 椭圆 + 尖端
        this.ctx.fillStyle = p.color + '0.7)';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = p.color + '0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(p.size * 0.2, -p.size * 0.3, p.size * 0.2, p.size * 0.5, 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawQiFlame(p) {
        // 气焰 - 水滴形
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 4);
        gradient.addColorStop(0, p.color + '0.6)');
        gradient.addColorStop(0.4, p.color + '0.2)');
        gradient.addColorStop(1, p.color + '0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawStar(p) {
        // 星点 - 十字星
        this.ctx.strokeStyle = p.color + '0.6)';
        this.ctx.lineWidth = 0.5;
        const len = p.size * 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-len, 0);
        this.ctx.lineTo(len, 0);
        this.ctx.moveTo(0, -len);
        this.ctx.lineTo(0, len);
        this.ctx.stroke();
        
        this.ctx.fillStyle = p.color + '0.8)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 1, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    destroy() {
        cancelAnimationFrame(this.animationId);
        this.canvas.remove();
    }
}

// ========================================
// 3. 太极能量场 - 卡片周围的气韵光环
// ========================================

class TaijiEnergyField {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.rings = [];
        this.time = 0;
        this.animationId = null;
        this.active = false;
    }
    
    activate(element) {
        if (this.active) return;
        this.active = true;
        
        const rect = element.getBoundingClientRect();
        this.canvas.width = rect.width + 60;
        this.canvas.height = rect.height + 60;
        this.canvas.style.cssText = `
            position: absolute; top: ${rect.top - 30}px; left: ${rect.left - 30}px;
            width: ${this.canvas.width}px; height: ${this.canvas.height}px;
            pointer-events: none; z-index: 3;
        `;
        document.body.appendChild(this.canvas);
        
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 3; i++) {
            this.rings.push({
                radius: 50 + i * 30,
                opacity: 0.15 - i * 0.03,
                speed: 0.01 * (i % 2 === 0 ? 1 : -1),
                rotation: Math.random() * Math.PI * 2,
                dashPattern: [10 + i * 5, 15 + i * 5],
            });
        }
        
        this.animate();
        setTimeout(() => this.deactivate(), 4000);
    }
    
    animate() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.02;
        
        this.rings.forEach(ring => {
            ring.rotation += ring.speed;
            
            this.ctx.save();
            this.ctx.translate(this.centerX, this.centerY);
            this.ctx.rotate(ring.rotation);
            
            this.ctx.strokeStyle = `rgba(218, 165, 32, ${ring.opacity * (0.7 + 0.3 * Math.sin(this.time * 2))})`;
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash(ring.dashPattern);
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    deactivate() {
        this.active = false;
        cancelAnimationFrame(this.animationId);
        if (this.canvas.parentNode) {
            this.canvas.remove();
        }
        this.rings = [];
    }
}

// ========================================
// 4. 古卷展开效果 - 结果区域入场
// ========================================

class ScrollRevealEffect {
    static apply(element) {
        element.style.cssText += `
            clip-path: inset(0 50% 0 50%);
            transition: clip-path 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        `;
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                element.style.clipPath = 'inset(0 0 0 0)';
            });
        });
    }
}

// ========================================
// 5. 水墨晕染卡片入场
// ========================================

class InkWashReveal {
    static apply(element, options = {}) {
        const delay = options.delay || 0;
        const duration = options.duration || 1000;
        
        element.style.opacity = '0';
        element.style.filter = 'blur(10px) saturate(0)';
        element.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            element.style.transition = `
                opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1),
                filter ${duration}ms cubic-bezier(0.22, 1, 0.36, 1),
                transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)
            `;
            element.style.opacity = '1';
            element.style.filter = 'blur(0) saturate(1)';
            element.style.transform = 'scale(1)';
        }, delay);
    }
}

// ========================================
// 6. 五行流转光效 - 五行文字周围的能量流
// ========================================

class WuxingFlow {
    static apply(element) {
        const wuxingSymbols = {
            metal: { symbol: '金', color: '#C0C0C0', glow: 'rgba(192,192,192,0.4)' },
            wood: { symbol: '木', color: '#228B22', glow: 'rgba(34,139,34,0.4)' },
            water: { symbol: '水', color: '#1E90FF', glow: 'rgba(30,144,255,0.4)' },
            fire: { symbol: '火', color: '#FF4500', glow: 'rgba(255,69,0,0.4)' },
            earth: { symbol: '土', color: '#DAA520', glow: 'rgba(218,165,32,0.4)' },
        };
        
        element.querySelectorAll('.wuxing-item').forEach((item, index) => {
            const elementName = item.getAttribute('data-element');
            const data = wuxingSymbols[elementName];
            if (!data) return;
            
            // 入场延迟
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease-out';
                item.style.borderLeft = `3px solid ${data.color}`;
                item.style.boxShadow = `0 0 15px ${data.glow}`;
                
                setTimeout(() => {
                    item.style.boxShadow = 'none';
                    item.style.borderLeft = '3px solid transparent';
                }, 1500);
            }, index * 150);
        });
    }
}

// ========================================
// 7. 道家八卦阵 - 推演时的阵法动画
// ========================================

class BaguaFormation {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.animationId = null;
        this.active = false;
    }
    
    activate() {
        if (this.active) return;
        this.active = true;
        
        this.canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 999;
        `;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.container.appendChild(this.canvas);
        
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        this.animate();
        
        // 4秒后自动消失
        setTimeout(() => this.deactivate(), 4000);
    }
    
    animate() {
        if (!this.active) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.015;
        
        const fadeOut = this.time > 3 ? Math.max(0, 1 - (this.time - 3)) : Math.min(1, this.time / 0.5);
        
        // 外圈 - 八卦方位
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.time * 0.3;
            const radius = 150 + Math.sin(this.time * 2 + i) * 10;
            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius;
            
            // 能量线连接中心
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = `rgba(218, 165, 32, ${0.08 * fadeOut})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
            
            // 节点发光
            const glow = this.ctx.createRadialGradient(x, y, 0, x, y, 15);
            glow.addColorStop(0, `rgba(218, 165, 32, ${0.4 * fadeOut})`);
            glow.addColorStop(1, 'rgba(218, 165, 32, 0)');
            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制八卦符号
            this.ctx.fillStyle = `rgba(251, 191, 36, ${0.8 * fadeOut})`;
            this.ctx.font = '16px serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const baguaSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
            this.ctx.fillText(baguaSymbols[i], x, y);
        }
        
        // 中心太极
        const taijiRadius = 30 + Math.sin(this.time * 3) * 3;
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.time * 0.5);
        
        // 太极外圈发光
        const outerGlow = this.ctx.createRadialGradient(0, 0, taijiRadius * 0.8, 0, 0, taijiRadius * 2);
        outerGlow.addColorStop(0, `rgba(218, 165, 32, ${0.15 * fadeOut})`);
        outerGlow.addColorStop(1, 'rgba(218, 165, 32, 0)');
        this.ctx.fillStyle = outerGlow;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, taijiRadius * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 太极符号
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * fadeOut})`;
        this.ctx.font = `${taijiRadius * 1.5}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('☯', 0, 0);
        
        this.ctx.restore();
        
        // 旋转能量环
        for (let ring = 0; ring < 3; ring++) {
            const ringRadius = 80 + ring * 50;
            this.ctx.save();
            this.ctx.translate(this.centerX, this.centerY);
            this.ctx.rotate(this.time * (ring % 2 === 0 ? 0.3 : -0.2));
            
            this.ctx.setLineDash([3 + ring * 2, 8 + ring * 3]);
            this.ctx.strokeStyle = `rgba(218, 165, 32, ${(0.12 - ring * 0.03) * fadeOut})`;
            this.ctx.lineWidth = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    deactivate() {
        this.active = false;
        cancelAnimationFrame(this.animationId);
        if (this.canvas.parentNode) {
            this.canvas.remove();
        }
    }
}

// ========================================
// 8. 结果文字逐行浮现
// ========================================

class LineByLineReveal {
    static apply(container, options = {}) {
        const lines = container.querySelectorAll('p, h4, strong, div');
        if (lines.length === 0) return;
        
        const baseDelay = options.baseDelay || 50;
        const duration = options.duration || 600;
        
        lines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(8px)';
            line.style.transition = `all ${duration}ms ease-out`;
            
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * baseDelay + 200);
        });
    }
}

// ========================================
// 9. 道家金色光晕呼吸效果
// ========================================

class GoldenBreath {
    static apply(element) {
        let phase = 0;
        
        const breathe = () => {
            phase += 0.02;
            const intensity = 0.5 + 0.5 * Math.sin(phase);
            const shadowSize = 10 + intensity * 15;
            const shadowOpacity = 0.05 + intensity * 0.1;
            
            element.style.boxShadow = `
                0 0 ${shadowSize}px rgba(218, 165, 32, ${shadowOpacity}),
                0 ${shadowSize/2}px ${shadowSize}px rgba(0, 0, 0, 0.2)
            `;
            
            if (element._goldenBreathActive !== false) {
                requestAnimationFrame(breathe);
            }
        };
        
        element._goldenBreathActive = true;
        breathe();
        
        return () => {
            element._goldenBreathActive = false;
        };
    }
}

// ========================================
// 10. 深邃星空背景 - 内容区域下方
// ========================================

class DeepStarfield {
    constructor(container) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.time = 0;
        this.animationId = null;
        container.appendChild(this.canvas);
        this.init();
    }
    
    init() {
        this.canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 0;
        `;
        this.resize();
        this.createStars();
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        this.stars = [];
        for (let i = 0; i < 120; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.3,
                brightness: 0.3 + Math.random() * 0.7,
                twinkleSpeed: 0.005 + Math.random() * 0.02,
                phase: Math.random() * Math.PI * 2,
                // 深沉的颜色 - 不是纯白
                color: this.getStarColor(),
            });
        }
    }
    
    getStarColor() {
        const colors = [
            'rgba(255, 248, 220,', // 暖白
            'rgba(218, 165, 32,',  // 金色
            'rgba(200, 200, 220,', // 冷白
            'rgba(255, 220, 180,', // 暖色
            'rgba(180, 200, 255,', // 冷蓝
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.01;
        
        this.stars.forEach(star => {
            const twinkle = 0.5 + 0.5 * Math.sin(this.time * 100 * star.twinkleSpeed + star.phase);
            const alpha = star.brightness * twinkle * 0.6;
            
            // 微光晕
            if (star.size > 1) {
                const glow = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
                glow.addColorStop(0, star.color + (alpha * 0.3) + ')');
                glow.addColorStop(1, star.color + '0)');
                this.ctx.fillStyle = glow;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // 星点
            this.ctx.fillStyle = star.color + alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        cancelAnimationFrame(this.animationId);
        this.canvas.remove();
    }
}

// ========================================
// 主初始化函数
// ========================================

function initDaoistEffects() {
    const effects = {};
    
    // 深邃星空 - 最底层
    effects.starfield = new DeepStarfield(document.body);
    
    // 水墨云雾 - 中间层
    effects.inkMist = new InkMistBackground(document.body);
    
    // 仙气粒子 - 最上层
    effects.ethereal = new EtherealParticles(document.body);
    
    // 太极能量场实例
    effects.taijiEnergy = new TaijiEnergyField();
    
    // 八卦阵实例
    effects.baguaFormation = new BaguaFormation(document.body);
    
    // 标题区域 - 子元素墨染入场（h1 由 animations.js 的 BlurTextReveal 控制，不重复操作）
    const header = document.querySelector('.header');
    if (header) {
        const headerChildren = Array.from(header.children).filter(el => el.tagName !== 'H1');
        headerChildren.forEach((child, i) => {
            InkWashReveal.apply(child, { delay: 400 + i * 150, duration: 1000 });
        });
    }
    
    // 理论区域 - 古卷展开
    const theory = document.querySelector('.theory-banner');
    if (theory) {
        setTimeout(() => ScrollRevealEffect.apply(theory), 600);
    }
    
    // 金色文字发光效果 - 给重要标题（在 BlurTextReveal 完成后再添加光效）
    const h1 = document.querySelector('.header h1');
    if (h1) {
        let h1Phase = 0;
        const h1Glow = () => {
            h1Phase += 0.02;
            const intensity = 0.5 + 0.5 * Math.sin(h1Phase);
            const glowSize = 15 + intensity * 15;
            const glowOpacity = 0.2 + intensity * 0.3;
            // 使用 textShadow 而不是 box-shadow，避免破坏渐变文字
            h1.style.textShadow = `0 0 ${glowSize}px rgba(218, 165, 32, ${glowOpacity})`;
            requestAnimationFrame(h1Glow);
        };
        // 延迟足够时间，等 BlurTextReveal 完成（字符数 * delay + duration）
        setTimeout(h1Glow, 3000);
    }
    
    // 卡片悬停时显示能量场
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            effects.taijiEnergy.activate(card);
        });
    });
    
    // 推演按钮 - 点击时触发八卦阵
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) {
        const originalClick = calcBtn.onclick;
        calcBtn.addEventListener('click', () => {
            setTimeout(() => effects.baguaFormation.activate(), 100);
        });
    }
    
    return effects;
}

// 导出到全局
window.initDaoistEffects = initDaoistEffects;
window.InkWashReveal = InkWashReveal;
window.ScrollRevealEffect = ScrollRevealEffect;
window.LineByLineReveal = LineByLineReveal;
window.WuxingFlow = WuxingFlow;
window.GoldenBreath = GoldenBreath;

// 延迟初始化
let daoistEffects = null;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        daoistEffects = initDaoistEffects();
    }, 100);
});