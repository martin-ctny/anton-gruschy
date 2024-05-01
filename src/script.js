import * as THREE from "three";
import GUI from "lil-gui";

import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

import particlesMorphingVertexShader from "./shaders/bgMorphing/vertex.glsl";
import particlesMorphingFragmentShader from "./shaders/bgMorphing/fragment.glsl";

import flagVertexShader from "./shaders/flag/vertex.glsl";
import flagFragmentShader from "./shaders/flag/fragment.glsl";

import planeVertexShader from "./shaders/plane/vertex.glsl";
import planeFragmentShader from "./shaders/plane/fragment.glsl";

import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// Debug

const gui = new GUI();

gsap.registerPlugin(ScrollTrigger);

if (window.location.href.endsWith("/#debug")) {
  gui.show();
} else {
  gui.hide();
}

const debugObject = {};
let objectsDistance = 20;

// Debug

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#181818");

// Loaders
const loadingElement = document.querySelector(".loading");
const loadingNumbersElement = document.querySelector(".loading-number");
const loadingManager = new THREE.LoadingManager(
  () => {
    window.setTimeout(() => {
      gsap.to(loadingElement, { opacity: 0 });
    }, 500);
  },

  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    loadingNumbersElement.textContent = `${progressRatio * 100}`;
    loadingNumbersElement.style.marginLeft = `${progressRatio * 85}%`;
  }
);
const textureLoader = new THREE.TextureLoader();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

const mixers = [];
const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
scene.add(ambientLight);

gltfLoader.load("spacex_flag/scene.gltf", (gltf) => {
  gltf.scene.scale.set(10, 8, 12);
  gltf.scene.position.set(0, 0, -3);
  if (sizes.width <= 820) {
    gltf.scene.scale.set(10, 8, 12);
    gltf.scene.position.set(0, 2, -15);
    gltf.scene.rotation.z = Math.PI / 2;
    gltf.scene.rotation.x = Math.PI;
  }

  const flag = textureLoader.load("drapeau2.png");
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.transparent = true;
      child.material.depthWrite = false;
      child.material.map = flag;
    }
  });
  scene.add(gltf.scene);

  // Vérifie s'il y a des animations dans le fichier GLTF
  if (gltf.animations && gltf.animations.length > 0) {
    // Récupère la première animation disponible
    const animation = gltf.animations[0]; // Vous pouvez modifier ceci pour récupérer une animation spécifique

    // Crée un mixer pour l'animation
    const mixer = new THREE.AnimationMixer(gltf.scene);

    // Ajoute l'animation au mixer
    const action = mixer.clipAction(animation);

    // Joue l'animation
    action.play();

    // Ajoute le mixer à la liste des mixers
    mixers.push(mixer);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  particlesMaterial.uniforms.uResolution.value.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

// Displacement

const displacement = {};

// 2d Canvas

displacement.canvas = document.createElement("canvas");
displacement.canvas.width = 128;
displacement.canvas.height = 128;
displacement.canvas.style.display = "none";
displacement.canvas.style.position = "fixed";
displacement.canvas.style.width = "256px";
displacement.canvas.style.height = "256px";
displacement.canvas.style.top = "0px";
displacement.canvas.style.left = "0px";
displacement.canvas.style.zIndex = 100;
document.body.append(displacement.canvas);

// Context

displacement.context = displacement.canvas.getContext("2d");
displacement.context.fillRect(
  0,
  0,
  displacement.canvas.width,
  displacement.canvas.height
);

// Glow Image

displacement.glowImage = new Image();
displacement.glowImage.src = "/glow.png";

// Interactive pplane
displacement.interactivePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(11, 13, 128, 128),
  new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
);
displacement.interactivePlane.visible = false;
displacement.interactivePlane.position.set(-sizes.width / 240, -3.5, 0);

if (sizes.width >= 820) {
  scene.add(displacement.interactivePlane);
}

// Raycaster

displacement.raycaster = new THREE.Raycaster();

// Coordinates

displacement.screenCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);

window.addEventListener("pointermove", (event) => {
  displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
  displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
});

// texutres

displacement.texture = new THREE.CanvasTexture(displacement.canvas);
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 20);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor("#181818");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(11, 13, 128, 128);
particlesGeometry.setIndex(null);
particlesGeometry.deleteAttribute("normal");

const intensityArray = new Float32Array(
  particlesGeometry.attributes.position.count
);
const angleArray = new Float32Array(
  particlesGeometry.attributes.position.count
);

for (let i = 0; i < intensityArray.length; i++) {
  intensityArray[i] = Math.random();
  angleArray[i] = Math.random() * Math.PI * 2;
}

particlesGeometry.setAttribute(
  "aIntensity",
  new THREE.BufferAttribute(intensityArray, 1)
);
particlesGeometry.setAttribute(
  "aAngle",
  new THREE.BufferAttribute(angleArray, 1)
);

const particlesMaterial = new THREE.ShaderMaterial({
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  uniforms: {
    uResolution: new THREE.Uniform(
      new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    ),
    uPictureTexture: new THREE.Uniform(textureLoader.load("/antonText.png")),
    // uPictureTexture: new THREE.Uniform(
    //   textureLoader.load("/mongrosprenomnegros.png")
    // ),
    uDisplacementTexture: { value: displacement.texture },
  },
  blending: THREE.AdditiveBlending,
  transparent: true,
});
const particlesName = new THREE.Points(particlesGeometry, particlesMaterial);

particlesName.position.set(-sizes.width / 240, -3.5, 0);

if (sizes.width >= 820) {
  scene.add(particlesName);
}
debugObject.speed = 0.05;

gui.add(debugObject, "speed").min(0).max(0.1).step(0.001).name("Speed");

// Particles Morphing
let particles = null;

gltfLoader.load("./modelsAnton.glb", (gltf) => {
  // console.log("gltf.scene.children", gltf.scene.children);
  particles = {};
  particles.index = 0;

  // console.log(gltf.scene.children);
  // Positions
  const positions = gltf.scene.children.map((child) => {
    // console.log("la", child.geometry.attributes.position);
    return child.geometry.attributes.position;
  });
  // console.log("positions", positions);

  particles.speed = 0.75;
  particles.delay = 0.4;
  particles.maxCount = 0;

  for (const position of positions) {
    if (position.count > particles.maxCount) {
      particles.maxCount = position.count;
    }
  }

  // console.log("particles.maxCount", particles.maxCount);

  particles.positions = [];
  for (const position of positions) {
    const originalArray = position.array;
    const newArray = new Float32Array(particles.maxCount * 3);

    for (let i = 0; i < particles.maxCount; i++) {
      const i3 = i * 3;
      if (i3 < originalArray.length) {
        newArray[i3] = originalArray[i3];
        newArray[i3 + 1] = originalArray[i3 + 1];
        newArray[i3 + 2] = originalArray[i3 + 2];
      } else {
        const randomIndex = Math.floor(Math.random() * position.count) * 3;
        newArray[i3] = originalArray[randomIndex];
        newArray[i3 + 1] = originalArray[randomIndex + 1];
        newArray[i3 + 2] = originalArray[randomIndex + 2];
      }
    }
    particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3));
  }

  // Geometry

  const sizesArray = new Float32Array(particles.maxCount);
  for (let i = 0; i < particles.maxCount; i++) {
    sizesArray[i] = Math.random();
  }
  particles.geometry = new THREE.BufferGeometry();
  particles.geometry.setAttribute(
    "position",
    particles.positions[particles.index]
  );
  particles.geometry.setAttribute("aPositionTarget", particles.positions[3]);
  particles.geometry.setAttribute(
    "aSize",
    new THREE.BufferAttribute(sizesArray, 1)
  );
  particles.geometry.setIndex(null);

  // Material
  particles.colorA = "#262626";
  particles.colorB = "#191919";

  particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesMorphingVertexShader,
    fragmentShader: particlesMorphingFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(0.4),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio
        )
      ),
      uProgress: new THREE.Uniform(0),
      uColorA: { value: new THREE.Color(particles.colorA) },
      uColorB: { value: new THREE.Color(particles.colorB) },
      uDelay: { value: particles.delay },
    },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Points
  particles.points = new THREE.Points(particles.geometry, particles.material);
  particles.points.frustumCulled = false;
  particles.points.rotation.x = Math.PI * 0.5;
  particles.points.position.y = -objectsDistance * 2;

  if (sizes.width >= 820) {
    scene.add(particles.points);
  }

  //   methods

  particles.morphs = (index) => {
    particles.geometry.attributes.position =
      particles.positions[particles.index];
    particles.geometry.attributes.aPositionTarget = particles.positions[index];

    //   animate uProgress
    gsap.fromTo(
      particles.material.uniforms.uProgress,
      { value: 0 },
      { value: 1, duration: particles.speed, ease: "linear" }
    );

    // Save index
    particles.index = index;
  };
  // Fonction pour gérer le morphing lorsque survolé
  let timeoutId;

  const handleHover = (index) => {
    particles.morphs(index);
  };
  document.querySelector(".Un").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      // console.log("Un");
      handleHover(3);
    }, 200); // 0.5 secondes
  });

  document.querySelector(".Un").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });

  document.querySelector(".Deux").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(5);
    }, 200);
  });

  document.querySelector(".Deux").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });

  document.querySelector(".Trois").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(7);
    }, 200);
  });

  document.querySelector(".Trois").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });

  document.querySelector(".Quatre").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(6);
    }, 200);
  });
  document.querySelector(".Quatre").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });
  document.querySelector(".Cinq").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(2);
    }, 200);
  });
  document.querySelector(".Cinq").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });
  document.querySelector(".Six").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(0);
    }, 200);
  });
  document.querySelector(".Six").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });
  document.querySelector(".Sept").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(8);
    }, 200);
  });
  document.querySelector(".Sept").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });
  document.querySelector(".Huit").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(4);
    }, 200);
  });
  document.querySelector(".Huit").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });
  document.querySelector(".Neuf").addEventListener("mouseover", () => {
    timeoutId = setTimeout(() => {
      handleHover(1);
    }, 200);
  });
  document.querySelector(".Neuf").addEventListener("mouseout", () => {
    clearTimeout(timeoutId);
  });

  particles.morphs0 = () => {
    particles.morphs(0);
  };
  particles.morphs1 = () => {
    particles.morphs(1);
  };
  particles.morphs2 = () => {
    particles.morphs(2);
  };
  particles.morphs3 = () => {
    particles.morphs(3);
  };
  particles.morphs4 = () => {
    particles.morphs(4);
  };
  particles.morphs5 = () => {
    particles.morphs(5);
  };
  particles.morphs6 = () => {
    particles.morphs(6);
  };
  particles.morphs7 = () => {
    particles.morphs(7);
  };
  particles.morphs8 = () => {
    particles.morphs(8);
  };

  const contact = document.querySelector(".contact");

  const changeBackgroundColor = (color) => {
    gsap.to(scene.background, {
      duration: 0.75,
      r: color.r,
      g: color.g,
      b: color.b,
    });
  };
  const texth2 = document.querySelector(".contact-text");

  const changeH2Color = (color) => {
    gsap.to(texth2, { color: color, duration: 0.5 });
  };

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: contact,
      start: "top 30%",
      end: "bottom 20%",
      onEnter: () => {
        changeH2Color("#171717");
        changeBackgroundColor({ r: 0.95, g: 0.02, b: 0.02 });
      },
      onLeaveBack: () => {
        changeH2Color("#fff");
        changeBackgroundColor({ r: 0.01, g: 0.01, b: 0.01 });
      },
    },
  });

  // Debug
  gui.addColor(particles, "colorA").onChange(() => {
    particles.material.uniforms.uColorA.value.set(particles.colorA);
  });

  gui.addColor(particles, "colorB").onChange(() => {
    particles.material.uniforms.uColorB.value.set(particles.colorB);
  });

  gui.add(particles, "speed").min(0).max(5).step(0.01).name("speed");

  gui
    .add(particles.material.uniforms.uSize, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("particleSize");

  gui
    .add(particles.material.uniforms.uProgress, "value")
    .min(0)
    .max(1)
    .name("progress")
    .listen();

  gui.add(particles, "delay").min(0.0).max(1.0).step(0.01).name("delay");

  gui.add(particles, "morphs0").name("morphs0");
  gui.add(particles, "morphs1").name("morphs1");
  gui.add(particles, "morphs2").name("morphs2");
  gui.add(particles, "morphs3").name("morphs3");
  gui.add(particles, "morphs4").name("morphs4");
  gui.add(particles, "morphs5").name("morphs5");
  gui.add(particles, "morphs6").name("morphs6");
  gui.add(particles, "morphs7").name("morphs7");
});

// scroll
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Raycaster
  displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
  const intersections = displacement.raycaster.intersectObject(
    displacement.interactivePlane
  );
  if (intersections.length) {
    const uv = intersections[0].uv;
    displacement.canvasCursor.x = uv.x * displacement.canvas.width;
    displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
  }
  //   Displacement
  displacement.context.globalCompositeOperation = "source-over";
  displacement.context.globalAlpha = debugObject.speed;
  displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height
  );
  //   speed alpha
  const cursorDistance = displacement.canvasCursor.distanceTo(
    displacement.canvasCursorPrevious
  );

  displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
  const alpha = Math.min(cursorDistance * 0.5, 1);
  // Glow Size

  const glowSize = displacement.canvas.width * 0.25;
  displacement.context.globalCompositeOperation = "lighten";
  displacement.context.globalAlpha = alpha;
  displacement.context.drawImage(
    displacement.glowImage,
    displacement.canvasCursor.x - glowSize * 0.5,
    displacement.canvasCursor.y - glowSize * 0.5,
    glowSize,
    glowSize
  );

  // Update time
  // planeMaterial.uniforms.uTime.value = performance.now() / 1000;

  // Update Plane
  // planeMaterial.uniforms.uTime.value = elapsedTime;
  // console.log("scrollValue", scrollValue);

  for (const mixer of mixers) {
    mixer.update(0.008);
  }

  // update Camera
  // if (sizes.width <= 820) {
  //   console.log("mobile");
  // }
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;
  // Update texture
  displacement.texture.needsUpdate = true;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
