import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#portfolioGame");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#050509");

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 8, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight("#ffffff", 0.7);
scene.add(ambientLight);

const purpleLight = new THREE.PointLight("#6d4ff2", 5, 25);
purpleLight.position.set(0, 7, 4);
scene.add(purpleLight);

const blueLight = new THREE.PointLight("#00d9ff", 2.5, 18);
blueLight.position.set(-5, 5, -3);
scene.add(blueLight);

const floorGeometry = new THREE.PlaneGeometry(18, 12);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: "#080812",
  roughness: 0.7,
  metalness: 0.2
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.25;
scene.add(floor);

const projects = [
  {
    name: "Projeto 01",
    desc: "Landing page moderna com visual responsivo.",
    link: "#"
  },
  {
    name: "Projeto 02",
    desc: "Formulário com validação usando JavaScript.",
    link: "#"
  },
  {
    name: "Projeto 03",
    desc: "Dashboard com cards e dados visuais.",
    link: "#"
  },
  {
    name: "Projeto 04",
    desc: "Sistema web com visual profissional.",
    link: "#"
  },
  {
    name: "Projeto 05",
    desc: "Projeto interativo com animações.",
    link: "#"
  },
  {
    name: "Projeto 06",
    desc: "Área de apresentação com estilo tecnológico.",
    link: "#"
  }
];

const pathPositions = [
  [-5, 0, 2],
  [-3, 0, 1],
  [-1, 0, 2],
  [1, 0, 1],
  [3, 0, 2],
  [5, 0, 1]
];

const tileBaseMaterial = new THREE.MeshStandardMaterial({
  color: "#171421",
  roughness: 0.28,
  metalness: 0.75,
  emissive: "#230066",
  emissiveIntensity: 0.35
});

const tiles = [];

pathPositions.forEach((position, index) => {
  const geometry = new THREE.BoxGeometry(1.6, 0.35, 1.6);
  const material = tileBaseMaterial.clone();

  const tile = new THREE.Mesh(geometry, material);
  tile.position.set(position[0], position[1], position[2]);
  tile.userData.index = index;

  scene.add(tile);
  tiles.push(tile);

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: "#8b5cff"
  });

  const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  tile.add(edges);
});

const linePoints = pathPositions.map(
  p => new THREE.Vector3(p[0], 0.3, p[2])
);

const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

const lineMaterial = new THREE.LineBasicMaterial({
  color: "#8b5cff"
});

const pathLine = new THREE.Line(lineGeometry, lineMaterial);
scene.add(pathLine);

const robot = new THREE.Group();

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: "#f1f3ff",
  roughness: 0.18,
  metalness: 0.55
});

const darkMaterial = new THREE.MeshStandardMaterial({
  color: "#050509",
  roughness: 0.2,
  metalness: 0.8,
  emissive: "#060013",
  emissiveIntensity: 0.6
});

const neonMaterial = new THREE.MeshStandardMaterial({
  color: "#00d9ff",
  emissive: "#00d9ff",
  emissiveIntensity: 2.2,
  roughness: 0.2,
  metalness: 0.4
});

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.65, 48, 48),
  bodyMaterial
);
head.scale.set(1.25, 0.85, 0.9);
head.position.y = 0.55;
robot.add(head);

const visor = new THREE.Mesh(
  new THREE.BoxGeometry(0.95, 0.35, 0.08),
  darkMaterial
);
visor.position.set(0, 0.6, 0.55);
robot.add(visor);

const leftEye = new THREE.Mesh(
  new THREE.SphereGeometry(0.06, 16, 16),
  neonMaterial
);
leftEye.position.set(-0.22, 0.64, 0.61);
robot.add(leftEye);

const rightEye = leftEye.clone();
rightEye.position.x = 0.22;
robot.add(rightEye);

const body = new THREE.Mesh(
  new THREE.SphereGeometry(0.48, 40, 40),
  bodyMaterial
);
body.scale.set(0.8, 1.15, 0.7);
body.position.y = -0.25;
robot.add(body);

const leftEar = new THREE.Mesh(
  new THREE.SphereGeometry(0.18, 24, 24),
  bodyMaterial
);
leftEar.position.set(-0.78, 0.55, 0);
robot.add(leftEar);

const rightEar = leftEar.clone();
rightEar.position.x = 0.78;
robot.add(rightEar);

const glow = new THREE.PointLight("#8b5cff", 3, 5);
glow.position.set(0, -0.9, 0);
robot.add(glow);

robot.position.set(pathPositions[0][0], 1.1, pathPositions[0][2]);
scene.add(robot);

let selectedIndex = 0;
let targetPosition = new THREE.Vector3(
  pathPositions[0][0],
  1.1,
  pathPositions[0][2]
);

tiles[0].material.color.set("#6d4ff2");
tiles[0].material.emissive.set("#6d4ff2");
tiles[0].material.emissiveIntensity = 0.9;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const nomeProjeto = document.querySelector("#nomeProjeto");
const descProjeto = document.querySelector("#descProjeto");
const linkProjeto = document.querySelector("#linkProjeto");

function updateHud(index) {
  nomeProjeto.textContent = projects[index].name;
  descProjeto.textContent = projects[index].desc;
  linkProjeto.href = projects[index].link;
}

updateHud(0);

window.addEventListener("click", event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(tiles);

  if (hits.length > 0) {
    const tile = hits[0].object;
    selectedIndex = tile.userData.index;

    targetPosition.set(
      tile.position.x,
      1.1,
      tile.position.z
    );

    tiles.forEach(t => {
      t.material.color.set("#171421");
      t.material.emissive.set("#230066");
      t.material.emissiveIntensity = 0.35;
    });

    tile.material.color.set("#6d4ff2");
    tile.material.emissive.set("#6d4ff2");
    tile.material.emissiveIntensity = 0.95;

    updateHud(selectedIndex);
  }
});

window.addEventListener("mousemove", event => {
  const x = (event.clientX / window.innerWidth - 0.5) * 0.8;
  const y = (event.clientY / window.innerHeight - 0.5) * 0.5;

  camera.position.x = x;
  camera.position.y = 8 - y;
  camera.lookAt(0, 0, 1);
});

const clock = new THREE.Clock();

function animate() {
  const time = clock.getElapsedTime();

  robot.position.x += (targetPosition.x - robot.position.x) * 0.045;
  robot.position.z += (targetPosition.z - robot.position.z) * 0.045;

  robot.position.y = targetPosition.y + Math.sin(time * 3) * 0.16;

  robot.rotation.y = Math.sin(time * 2) * 0.15;
  robot.rotation.z = Math.sin(time * 2.3) * 0.04;

  leftEye.scale.y = 1 + Math.sin(time * 5) * 0.25;
  rightEye.scale.y = 1 + Math.sin(time * 5) * 0.25;

  purpleLight.position.x = Math.sin(time * 0.8) * 5;
  purpleLight.position.z = Math.cos(time * 0.8) * 4;

  tiles.forEach((tile, index) => {
    if (index === selectedIndex) {
      tile.position.y = Math.sin(time * 3) * 0.07;
      tile.rotation.y = Math.sin(time * 2) * 0.03;
    } else {
      tile.position.y += (0 - tile.position.y) * 0.08;
      tile.rotation.y += (0 - tile.rotation.y) * 0.08;
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
