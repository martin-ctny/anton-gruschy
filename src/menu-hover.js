addEventListener("DOMContentLoaded", () => {
  const customCursor = document.createElement("div");
  customCursor.id = "custom-cursor";
  document.body.appendChild(customCursor);

  const textView = document.createElement("div");
  textView.className = "text-view";
  textView.textContent = "View";
  document.body.appendChild(textView);

  textView.style.position = "absolute";
  textView.style.transform = "translate(-50%, -50%)";
  textView.style.color = "#171717";
  textView.style.display = "none";
  textView.style.pointerEvents = "none";
  textView.style.zIndex = "9999";

  document.addEventListener("mousemove", function (e) {
    customCursor.style.left = e.pageX - 10 + "px";
    customCursor.style.top = e.pageY - 10 + "px";

    textView.style.left = e.pageX + "px";
    textView.style.top = e.pageY + "px";
  });

  document.addEventListener("wheel", function (e) {
    customCursor.style.left = e.pageX - 10 + "px";
    customCursor.style.top = e.pageY - 10 + "px";
    textView.style.left = e.pageX + "px";
    textView.style.top = e.pageY + "px";
  });

  const project = document.querySelectorAll(".project");
  project.forEach((el) => {
    const hr = el.querySelector("hr");
    el.addEventListener("mouseenter", (e) => {
      customCursor.style.transform = "scale(2.8)";
      customCursor.style.mixBlendMode = "normal";
      textView.style.display = "block";
      textView.style.left = e.pageX + "px";
      textView.style.top = e.pageY + "px";
      hr.style.height = "2.5px";
      hr.style.backgroundColor = "#e0e0e0";
      hr.style.borderColor = "#e0e0e0";
    });
    el.addEventListener("mouseleave", (e) => {
      customCursor.style.transform = "scale(1)";
      customCursor.style.mixBlendMode = "difference";
      textView.style.display = "none";
      hr.style.height = "0px";
      hr.style.backgroundColor = "#AEAEAE";
      hr.style.borderColor = "#AEAEAE";
    });
  });

  const items = document.querySelectorAll(".menu-item");

  items.forEach((el) => {
    let shuffleCount = 0;
    let originalText = el.textContent;

    el.addEventListener("mouseenter", (e) => {
      customCursor.style.transform = "scale(2)";
      if (shuffleCount < 3) {
        shuffleAnimation(el, originalText, shuffleCount);
      }
    });
    el.addEventListener("mouseleave", (e) => {
      customCursor.style.transform = "scale(1)";
    });
  });

  const nextWork = document.querySelector(".next-work");
  if (nextWork) {
    const leftBottomContent = nextWork.querySelector(".left");

    const rightBottomContent = nextWork.querySelector(".right");

    leftBottomContent.addEventListener("mouseenter", () => {
      customCursor.style.transform = "scale(2)";
    });
    leftBottomContent.addEventListener("mouseleave", () => {
      customCursor.style.transform = "scale(1)";
    });
    rightBottomContent.addEventListener("mouseenter", () => {
      customCursor.style.transform = "scale(2)";
    });
    rightBottomContent.addEventListener("mouseleave", () => {
      customCursor.style.transform = "scale(1)";
    });
  }

  const contactLinks = document.querySelectorAll(".contact-item");
  contactLinks.forEach((el) => {
    let shuffleCount = 0;
    let originalText = el.textContent;
    el.addEventListener("mouseenter", (e) => {
      console.log("mouseenter");
      customCursor.style.transform = "scale(2)";
      if (shuffleCount < 3) {
        shuffleAnimation(el, originalText, shuffleCount);
      }
    });
    el.addEventListener("mouseleave", (e) => {
      customCursor.style.transform = "scale(1)";
    });
  });
});

function getRandomChars(text) {
  const chars = text.split("");
  return chars.sort(() => Math.random() - 0.5).join("");
}

function shuffleAnimation(el, originalText, count) {
  setTimeout(() => {
    el.textContent = getRandomChars(originalText);
    count++;
    if (count < 4) {
      shuffleAnimation(el, originalText, count);
    } else {
      el.textContent = originalText;
    }
  }, 100);
}
