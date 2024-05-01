import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const heroeWork = document.querySelector(".heroe-work");
const mesElements = document.querySelectorAll(".hr");
const h1 = document.querySelector(".h1");
const img = document.querySelector(".img");
const right = document.querySelector(".right");
const lignes = document.querySelectorAll(".ligne");

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: heroeWork,
    start: "top 80%",
    end: "bottom 50%",
    toggleClass: "visible",
  },
});
timeline.from(img, { opacity: 0.2, y: -20, duration: 0.8 });
timeline.from(h1, { opacity: 0, y: 10, duration: 1 });
timeline.from(right, { opacity: 0, y: 50, duration: 1 }, "-=0.9");
mesElements.forEach((element, index) => {
  timeline.add(() => {
    element.classList.add("visible");
  }, `+=${index * 0.025}`);
});
lignes.forEach((ligne) => {
  timeline.from(ligne, { opacity: 0, y: 50, duration: 1 }, "-=0.9");
});
// timeline.from(bouttonteaser, { opacity: 0, y: 50, duration: 1 }, "-=0.7");

const text = document.querySelectorAll(".text");

text.forEach((text, index) => {
  const allText = text.querySelectorAll("p");
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: text,
      start: "top center",
      end: "bottom center",
      toggleActions: "play none none none",
    },
  });
  allText.forEach((text, index) => {
    tl.from(text, { opacity: 0, y: 20, duration: 0.75 }, `+=${index * 0.1}`);
  });
});

const video = document.querySelectorAll(".video");
gsap.fromTo(
  video,
  {
    opacity: 0,
    y: -20,
  },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: video,
      start: "top 50%",
      end: "bottom 20%",
    },
  }
);

const duoImg = document.querySelectorAll(".duo-img");

duoImg.forEach((imgContainer) => {
  const imgs = imgContainer.querySelectorAll("img");
  imgs.forEach((img, index) => {
    const direction = index % 2 === 0 ? -1 : 1;
    const initialX = direction === -1 ? -30 : 30;
    gsap.fromTo(
      img,
      {
        opacity: 0,
        x: initialX,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: img,
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );
  });
});

const images = document.querySelectorAll(".image");
images.forEach((img, index) => {
  gsap.fromTo(
    img,
    {
      opacity: 0,
      y: -30,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: img,
        start: "top 80%",
        end: "bottom 20%",
      },
    }
  );
});
