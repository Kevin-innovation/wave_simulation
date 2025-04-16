const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const config = {
    lineCount: 120, // 47에서 94로 두 배 증가
    linePoints: 100,
    amplitude: canvas.width / 20,
    frequency: 0.009,
    waveSpeed: Math.PI / 4,
    lineWidth: 1,
    lineColor: '#8B4513', // 짙은 갈색
    hoverColor: '#FF0000', // 호버 시 빨간색
    mouseInfluenceRadius: 50, // 100에서 50으로 좁힘
    crumpleStrength: 60 // 꾸겨짐 효과 강도
};

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    config.amplitude = canvas.width / 20;
});

function drawWaveLine(i, time) {
    const W = canvas.width;
    const H = canvas.height;
    const S = W / (config.lineCount + 5); // 선 간격 좁힘
    const xBase = i * S;
    const phi = i * (Math.PI * 2 / config.lineCount) + config.waveSpeed * time;

    const mouseDistance = Math.abs(mouseX - xBase);
    const isHovered = mouseDistance < config.mouseInfluenceRadius;

    ctx.beginPath();
    ctx.lineWidth = config.lineWidth;
    ctx.strokeStyle = isHovered ? config.hoverColor : config.lineColor;

    for (let j = 0; j < config.linePoints; j++) {
        const y = j * (H / (config.linePoints - 1));
        let x = xBase + config.amplitude * Math.sin(config.frequency * y + phi);

        if (isHovered) {
            const dist = Math.hypot(x - mouseX, y - mouseY);
            if (dist < config.mouseInfluenceRadius) {
                const crumpleFactor = (1 - dist / config.mouseInfluenceRadius);
                const crumpleOffset = Math.sin(y * 0.05 + phi) * crumpleFactor * config.crumpleStrength;
                x += crumpleOffset; // 꾸겨짐 효과
            }
        }

        if (j === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

function animate() {
    const time = performance.now() / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < config.lineCount; i++) {
        drawWaveLine(i, time);
    }

    requestAnimationFrame(animate);
}

animate();