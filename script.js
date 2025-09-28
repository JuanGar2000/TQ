let scene, camera, renderer, controls;
let core, textTeAmo;
let floatingWords = [];
let bgStars;
let pulse = 0; // Se usará para el movimiento y para el cambio de color

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 15);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;

  // 🌌 Fondo de estrellas (blanco y dorado)
  createBackgroundStars();

  // 🟡 Núcleo central (Blanco Neón Pastel)
  createCore();

  // 💖 Texto “Te amo Aylin” con color dinámico
  addTeAmo();

  // ✨ Palabras flotantes alrededor con emojis
  createFloatingWords();

  window.addEventListener("resize", onWindowResize, false);
}

// ... (Funciones createBackgroundStars, createCore, makeTextSprite, pickColor, onWindowResize NO CAMBIAN) ...

/**
 * Función MODIFICADA para incluir "Aylin"
 */
function addTeAmo() {
  const loader = new THREE.FontLoader();
  loader.load(
    "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      // Texto: "Te amo Aylin"
      const textGeo = new THREE.TextGeometry("Te amo Zamy", {
        font: font,
        size: 0.7,
        height: 0.05,
        curveSegments: 12,
      });

      // Creamos un material base. El color se actualizará en animate().
      const textMat = new THREE.MeshBasicMaterial({ color: 0xff4444 }); 
      textTeAmo = new THREE.Mesh(textGeo, textMat);

      textGeo.computeBoundingBox();
      // Ajustamos el centrado para el nuevo texto más largo
      const centerX = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      const centerY = -0.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);

      textTeAmo.position.set(centerX, centerY, 0);
      textTeAmo.renderOrder = 999;
      core.add(textTeAmo);
    }
  );
}

// ... (El resto de las funciones hasta animate) ...

// ** RESTO DE createBackgroundStars (SIN CAMBIOS) **
function createBackgroundStars() {
  const numStars = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const color = new THREE.Color();
  const white = 0xffffff;
  const gold = 0xffd700;

  for (let i = 0; i < numStars; i++) {
    positions.push(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200
    );
    
    if (Math.random() < 0.6) {
        color.set(white);
    } else {
        color.set(gold);
    }
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));


  const material = new THREE.PointsMaterial({
    vertexColors: true, 
    size: 0.8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending 
  });

  bgStars = new THREE.Points(geometry, material);
  scene.add(bgStars);
}

// ** RESTO DE createCore (SIN CAMBIOS) **
function createCore() {
  const geometry = new THREE.SphereGeometry(3, 64, 64);
  const neonPastelYellow = 0xfcfca3; 
  
  const material = new THREE.MeshBasicMaterial({ 
      color: neonPastelYellow,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
  });
  
  core = new THREE.Mesh(geometry, material);
  scene.add(core);
}

// ** RESTO DE createFloatingWords (SIN CAMBIOS) **
function createFloatingWords() {
  const words = [
    "Mi estrella 🌟", "Mi flor 🌹", "Mi fiesta 🎉", "Mi mundo 🌍",
    "Magia ✨", "Esperanza 💫", "Recuerdos 📸", "Amor 💖",
    "Alegría 😍", "Dulzura 🍯", "Cariño 🥰", "Sueños 🌙",
    "Contigo 💞", "Mi vida ❤️", "Pasión 🔥", "Felicidad 😊",
    "Ilusión 🌈", "Eternidad ♾️", "Luz 🌞", "Canción 🎶",
    "Abrazo 🤗", "Destino 🕊️", "Mi tesoro 💎", "Mi paz ☮️",
    "Mi cielo ☁️", "Ternura 🐻", "Brillo ✨", "Corazón 💘"
  ];

  words.forEach((word, i) => {
    const sprite = makeTextSprite(word, { color: pickColor() });
    const angle = (i / words.length) * Math.PI * 2;
    const radius = 7;

    sprite.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random()-0.5)*3);
    scene.add(sprite);
    floatingWords.push(sprite);
  });
}

// ** RESTO DE makeTextSprite (SIN CAMBIOS) **
function makeTextSprite(message, parameters) {
  const fontface = "Arial";
  const fontsize = parameters.fontsize || 64;
  const color = parameters.color || "#ffffff";

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `Bold ${fontsize}px ${fontface}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);

  sprite.scale.set(5, 2, 1);
  return sprite;
}

// ** RESTO DE pickColor (SIN CAMBIOS) **
function pickColor() {
  const colors = ["#ffffff", "#ffcc00", "#ff66cc", "#66ccff", "#ff3300", "#aaffaa"];
  return colors[Math.floor(Math.random() * colors.length)];
}


/**
 * Función MODIFICADA para cambiar el color del texto central
 */
function animate() {
  requestAnimationFrame(animate);

  pulse += 0.01;

  // 🌈 CAMBIO DE COLOR DINÁMICO para "Te amo Aylin"
  if (textTeAmo) {
      // Usa el seno para oscilar el valor HUE (matiz) entre 0 y 1
      const hue = (Math.sin(pulse * 0.5) + 1) / 2;
      const saturation = 0.8; // Alta saturación para colores vivos
      const lightness = 0.6;  // Brillo medio-alto
      
      // Convierte HSL (Hue, Saturation, Lightness) a RGB y lo aplica al material
      textTeAmo.material.color.setHSL(hue, saturation, lightness);
  }

  if (floatingWords.length > 0) {
    floatingWords.forEach((sprite, i) => {
      // Movimiento circular/pulsación
      sprite.position.x = Math.cos(pulse + i) * 7;
      sprite.position.y = Math.sin(pulse + i) * 7;
      sprite.rotation.z += 0.002;
    });
  }

  if (bgStars) bgStars.rotation.y += 0.0003;

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}