const delay = ms => new Promise(res => setTimeout(res, ms));

function fadeAudio(audio, targetVolume, duration) {
    if (!audio) return;
    const startVolume = audio.volume;
    const startTime = performance.now();

    function update() {
        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else if (targetVolume === 0) {
            audio.pause();
        }
    }
    requestAnimationFrame(update);
}

const narrativePhrases = [
    "Gracias por esa sonrisa",
    "Espero que te vaya increíble",
    "Cuídate mucho",
    "Nunca dejes de ser quien eres",
    "Gracias por ese momento",
    "Te voy a recordar con mucho cariño"
];

const finalLetterText = `Tal vez solo compartimos un momento pequeño, pero para mí fue muy especial
A veces la vida pone personas bonitas en nuestro camino aunque sea por poquito tiempo
Solo quería desearte que te vaya increíble, que cumplas todo lo que sueñas y que nunca pierdas esa sonrisa tan bonita
Gracias por el tiempo que compartimos
Espero que la vida te trate bonito
Siempre
`;

async function initIntro() {
    const text1 = document.getElementById('intro-text-1');
    const action = document.getElementById('intro-action');

    await delay(2000);
    text1.style.opacity = 1;
    await delay(3000);
    text1.style.opacity = 0;
    await delay(2000);
    action.classList.remove('hidden');
    setTimeout(() => action.style.opacity = 1, 50);
}

async function startExperience() {
    const intro = document.getElementById('intro-overlay');
    const main = document.getElementById('main-container');
    const plane = document.getElementById('plane-container');
    const sky = document.getElementById('sky');
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-control');

    if (music) {
        music.volume = 0;
        music.play().catch(e => console.log("Audio bloqueado por el navegador hasta interacción."));
        fadeAudio(music, 0.2, 2000);
        musicBtn.classList.remove('hidden');
    }

    intro.style.opacity = 0;
    await delay(3000);
    intro.classList.add('hidden');
    main.style.opacity = 1;

    // Capítulo 1: Amanecer
    sky.style.backgroundImage = "var(--dawn)";
    await delay(1000);
    plane.style.left = "25%";
    plane.style.top = "35%";
    await showText("Hay personas que llegan sin avisar");
    
    await doAcrobatics('spin'); // Una pequeña pirueta al empezar

    // Capítulo 1.5: El Mar y las Gaviotas
    const sea = document.getElementById('sea');
    sea.style.opacity = "1";
    spawnSeagulls(5);
    await delay(1000);
    plane.style.top = "50%";
    plane.style.left = "20%";
    await delay(1000);
    await delay(4000);

    // Capítulo 1.6: La Tormenta
    // Capítulo 1.2: Montañas
    sea.style.opacity = "0";
    const mountains = document.getElementById('mountains');
    mountains.style.opacity = "1";
    await delay(1000);
    plane.style.top = "25%";
    plane.style.left = "35%";
    await showText("Explorando cimas que parecen lejanas");
    await delay(4000);

    // Capítulo 1.3: Bosques y Tormenta
    mountains.style.opacity = "0";
    const forest = document.getElementById('forest');
    const clouds = document.getElementById('clouds');
    forest.style.opacity = "1";
    
    await triggerStorm();
    await doAcrobatics('flip'); // Voltereta tras la tormenta (alivio)
    await showText("A veces el camino se pone difícil");
    plane.style.top = "45%";
    plane.style.left = "25%";
    await delay(1500);
    plane.style.top = "55%";
    await delay(1500);
    await delay(4000);

    forest.style.opacity = "0";
    clouds.style.opacity = "1"; // Activamos las nubes para llenar el cielo durante el día
    plane.style.top = "60%";
    plane.style.left = "30%";
    await showText("...y aun así dejan recuerdos muy bonitos");
    await delay(2000);

    // Capítulo 2: El Día y las Estrellas
    sky.style.backgroundImage = "var(--day)";
    spawnStars(20);
    await doAcrobatics('loop'); // Un gran giro al salir al sol
    
    for (const phrase of narrativePhrases) {
        plane.style.top = `${30 + Math.random() * 40}%`; // Movimiento activo
        plane.style.left = `${35 + Math.random() * 10}%`; // Leve movimiento lateral
        await delay(2000);
        await typeNarrative(phrase);
        await delay(1500);
        await hideText();
    }

    // Capítulo 3: Atardecer y Pétalos
    sky.style.backgroundImage = "var(--sunset)";
    document.getElementById('forest').classList.add('landscape-silhouette');
    document.getElementById('forest').style.opacity = "1"; // Mostramos bosque lejano al atardecer
    const petalInterval = startPetals();
    plane.style.left = "60%";
    await delay(2000);
    await showText("Hay momentos que duran muy poquito");
    plane.style.top = "45%";
    await showText("pero permanecen mucho tiempo");
    await delay(3000);

    // Capítulo 4: La Noche
    sky.style.backgroundImage = "var(--night)";
    document.getElementById('forest').style.opacity = "0";
    document.getElementById('stars').style.opacity = 1;
    document.getElementById('moon').classList.remove('hidden');
    setTimeout(() => document.getElementById('moon').style.opacity = 1, 100);
    
    // Empezar a soltar estrellas fugaces en la noche
    const shootingStarInterval = setInterval(spawnShootingStar, 3000);
    
    clearInterval(petalInterval);
    await delay(4000); 

    // Final
    clearInterval(shootingStarInterval);
    await endExperience();
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    if (music.paused) {
        music.play();
        icon.innerText = "🔊";
    } else {
        music.pause();
        icon.innerText = "🔇";
    }
}

async function showText(text) {
    const container = document.getElementById('narrative-text');
    container.style.opacity = 0;
    await delay(500);
    container.innerText = text;
    container.style.opacity = 1;
    await delay(3000);
    container.style.opacity = 0;
    await delay(1000);
}

/** Ejecuta piruetas en el avioncito */
async function doAcrobatics(type) {
    const planeSvg = document.getElementById('paper-plane-svg');
    const cls = type === 'loop' ? 'do-loop' : type === 'spin' ? 'do-spin' : 'do-flip';
    
    planeSvg.classList.add(cls);
    await delay(2000); // Tiempo para que termine la animación
    planeSvg.classList.remove(cls);
}

async function typeNarrative(text) {
    const container = document.getElementById('narrative-text');
    container.innerText = "";
    container.style.opacity = 1;
    for (let char of text) {
        container.innerText += char;
        await delay(40);
    }
}

async function hideText() {
    document.getElementById('narrative-text').style.opacity = 0;
    await delay(800);
}

function spawnStars(count) {
    const starsLayer = document.getElementById('stars');
    starsLayer.innerHTML = ""; // Limpiar antes de generar
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 80}%`;
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsLayer.appendChild(star);
    }
}

function spawnShootingStar() {
    const container = document.getElementById('stars');
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    const startX = Math.random() * 100;
    const startY = Math.random() * 50;
    
    star.style.left = `${startX}%`;
    star.style.top = `${startY}%`;
    
    container.appendChild(star);
    
    setTimeout(() => star.remove(), 3000);
}

async function triggerStorm() {
    const flash = document.getElementById('storm-flash');
    for(let i=0; i<3; i++) {
        await delay(Math.random() * 2000);
        flash.classList.add('flash-active');
        setTimeout(() => flash.classList.remove('flash-active'), 200);
    }
}

function spawnSeagulls(count) {
    const container = document.getElementById('main-container');
    for(let i=0; i<count; i++) {
        setTimeout(() => {
            const bird = document.createElement('div');
            bird.className = 'seagull';
            bird.innerText = '🐦'; // Gaviotas
            bird.style.top = `${Math.random() * 40 + 10}%`;
            container.appendChild(bird);
            setTimeout(() => bird.remove(), 5000);
        }, i * 1500);
    }
}

function startPetals() {
    return setInterval(() => {
        if (document.getElementById('final-scene').classList.contains('hidden')) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.width = `${Math.random() * 10 + 5}px`;
            petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
            document.body.appendChild(petal);
            setTimeout(() => petal.remove(), 10000);
        }
    }, 500);
}

async function endExperience() {
    const plane = document.getElementById('plane-container');
    const finalScene = document.getElementById('final-scene');
    const music = document.getElementById('bg-music');

    // El avión viaja al centro y se estabiliza
    plane.style.transition = "all 5s cubic-bezier(0.19, 1, 0.22, 1)";
    plane.style.left = "50%";
    plane.style.top = "50%";
    plane.style.transform = "translate(-50%, -50%) scale(0.6)";
    
    await delay(5000);
    
    // Transformación: El avión se desvanece y aparece el sobre en su lugar
    finalScene.classList.remove('hidden');
    finalScene.style.opacity = "0";

    // Bajar volumen al 10% cuando aparece la carta
    if (music) music.volume = 0.1;
    
    setTimeout(() => {
        finalScene.style.opacity = "1";
        plane.style.opacity = "0";
    }, 100);

    await delay(2000);
    plane.style.display = 'none';
}

let isTyping = false;

async function openLetter() {
    const env = document.getElementById('envelope');
    if (isTyping || env.classList.contains('open')) return;
    
    isTyping = true;
    env.classList.add('open');
    
    const openBtn = document.getElementById('open-btn');
    if (openBtn) openBtn.classList.add('hidden');
    
    const letter = document.getElementById('letter-text');
    letter.innerText = "";
    
    await delay(1200); // Esperar a que la carta suba

    for (let char of finalLetterText) {
        letter.innerText += char;
        const paper = document.querySelector('.envelope-paper');
        paper.scrollTop = paper.scrollHeight;
        await delay(35);
    }

    isTyping = false;
    document.getElementById('close-letter-btn').classList.remove('hidden');
}

async function closeLetter() {
    const env = document.getElementById('envelope');
    const finalScene = document.getElementById('final-scene');
    const plane = document.getElementById('plane-container');
    const music = document.getElementById('bg-music');
    const letter = document.getElementById('letter-text');

    // Cerrar la carta
    env.classList.remove('open');
    document.getElementById('close-letter-btn').classList.add('hidden');
    letter.innerText = "";
    await delay(2000);
    
    // Salir de la escena final
    finalScene.style.opacity = 0;
    await delay(2000);
    finalScene.classList.add('hidden');
    
    // El avión reaparece y despega
    plane.style.opacity = 1;
    plane.style.transition = "all 8s cubic-bezier(0.4, 0, 0.2, 1)";
    await delay(500);
    
    // Se aleja hacia el horizonte
    plane.style.left = "150%";
    plane.style.top = "30%";
    plane.style.transform = "translate(-50%, -50%) scale(0.1) rotate(-15deg)";

    await delay(2000);
    await showText("Buen viaje");
    await delay(4000);
    await showText("Gracias por formar parte de un recuerdo bonito");
    await delay(3000);
    
    // Fundido final
    const blackout = document.createElement('div');
    blackout.className = 'blackout';
    document.body.appendChild(blackout);

    // Fade out de la música de 3 segundos al finalizar
    if (music) fadeAudio(music, 0, 3000);

    setTimeout(() => {
        blackout.style.opacity = 1;
        blackout.style.pointerEvents = 'all'; // Permite interactuar con el botón
        
        // Mostrar el botón de reiniciar después de que el fondo sea negro
        setTimeout(() => {
            const restartBtn = document.createElement('button');
            restartBtn.className = 'btn-minimal';
            restartBtn.style.opacity = 0;
            restartBtn.style.transition = 'opacity 2s ease';
            restartBtn.innerText = 'Volver a empezar';
            restartBtn.onclick = () => location.reload();
            blackout.appendChild(restartBtn);
            setTimeout(() => restartBtn.style.opacity = 1, 100);
        }, 3000);
    }, 100);
}

window.onload = initIntro;