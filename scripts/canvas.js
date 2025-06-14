
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const trail = [];
const maxPoints = 10;
const shapes = [];
const numShapes = Math.floor(Math.random() * 6) + 5;
const particles = [];

function createRandomShape() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 20,
        sides: Math.floor(Math.random() * 3) + 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        hit: false,
        fade: 1,
    };
}

for (let i = 0; i < numShapes; i++) {
    shapes.push(createRandomShape());
}

function drawShape(shape) {
    if (shape.fade <= 0) return;
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.rotation);
    ctx.beginPath();
    for (let i = 0; i <= shape.sides; i++) {
        const angle = (i / shape.sides) * 2 * Math.PI;
        const x = shape.size * Math.cos(angle);
        const y = shape.size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${shape.fade * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

function isHit(shape, point) {
    const dx = shape.x - point.x;
    const dy = shape.y - point.y;
    return Math.sqrt(dx * dx + dy * dy) < shape.size;
}

function createExplosion(x, y) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x,
            y,
            angle: Math.random() * 2 * Math.PI,
            speed: Math.random() * 3 + 1,
            radius: Math.random() * 2 + 1,
            life: 1,
        });
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.life})`;
        ctx.fill();
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

window.addEventListener("mousemove", (e) => {
    trail.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        width: Math.random() * 6 + 2,
    });
    if (trail.length > maxPoints) trail.shift();
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((s, i) => {
        if (s.hit) {
            s.fade -= 0.03;
            s.size *= 0.95;
        } else {
            s.rotation += s.rotationSpeed;
        }
        drawShape(s);
    });

    if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length - 2; i++) {
            const xc = (trail[i].x + trail[i + 1].x) / 2;
            const yc = (trail[i].y + trail[i + 1].y) / 2;
            ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        }

        const gradient = ctx.createLinearGradient(
            trail[0].x,
            trail[0].y,
            trail[trail.length - 1].x,
            trail[trail.length - 1].y
        );
        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0.7)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }

    for (let s of shapes) {
        for (let p of trail) {
            if (!s.hit && isHit(s, p)) {
                s.hit = true;
                createExplosion(s.x, s.y);
                shapes.push(createRandomShape());
                break;
            }
        }
    }

    for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= 0.03;
        trail[i].width *= 0.96;
        if (trail[i].life <= 0 || trail[i].width < 0.5) {
            trail.splice(i, 1);
        }
    }

    drawParticles();
    requestAnimationFrame(animate);
}

animate();
