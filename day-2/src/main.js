import "./style.css";

const background = document.querySelector(".slow-moving-background");
const container = document.querySelector(".slow-moving-background .container");

container.addEventListener("scroll", () => {
  console.log(1);
  background.setAttribute(
    "style",
    `
    background-position-y: 10%
  `
  );
});
