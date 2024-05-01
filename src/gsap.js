import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from "lenis";

console.log(Lenis);

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const menuItem = document.querySelectorAll(".menu-item");

menuItem.forEach((item) => {
  item.addEventListener("click", () => {
    const dataName = item.getAttribute("data-name");
    const sections = document.querySelectorAll(`[data-name="${dataName}"]`);

    sections.forEach((section) => {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: section.offsetTop,
        },
        ease: "power2.inOut",
      });
    });
  });
});

const logo = document.querySelector(".header > img");
logo.addEventListener("click", () => {
  gsap.to(window, {
    duration: 1,
    scrollTo: {
      y: 0,
    },
    ease: "power2.inOut",
  });
});

const mesElements = document.querySelectorAll(".hr");

const timelineHr = gsap.timeline({
  scrollTrigger: {
    trigger: mesElements,
    start: "top 60%",
    end: "=+2900",
    toggleClass: "visible",
    // markers: true,
    once: true,
  },
});
mesElements.forEach((element, index) => {
  timelineHr.add(() => {
    element.classList.add("visible");
  }, `+=${index * 0.025}`);
});

const bar = document.querySelector(".bar");
const point = document.querySelector(".point");

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: bar,
    start: "top 80%",
    end: "=+2900",
    toggleClass: "visible",
    // markers: true,
  },
});

const timelinePoint = gsap.timeline({
  scrollTrigger: {
    trigger: point,
    start: "top 80%",
    end: "=+2900",
    toggleClass: "visible-point",
  },
});
timelinePoint.from(
  point,
  { scale: 1.4, duration: 0.8, repeat: -1, yoyo: true },
  "-=0.1"
);
