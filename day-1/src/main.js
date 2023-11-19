import "./style.css";

const container = document.querySelector(".typing-container");

const ROW_CLASS = "typing-row";
const COL_CLASS = "typing-col";
const CURSOR_CLASS = "typing-cursor";
const EMPHASIS = "emphasis";
const BLINK = "animate-blink";
const SPACE = "\u00a0";
const REG_EXP = /(\s*)/g;
const TYPE_SPEED = 100;
const ERASE_SPEED = 25;
const WAIT_ERASE = 3000;
const WAIT_TYPE = 1000;

const typingData = [
  [
    {
      colData: ["Hello!", "This", "is", "Jake"],
      emphasis: [0, 3],
    },
    {
      colData: ["Nice", "to", "meet", "you"],
      emphasis: [],
    },
  ],
  [
    {
      colData: ["I", "am", "a", "Front-End", "Developer"],
      emphasis: [3],
    },
  ],
  [
    {
      colData: ["Thank", "you", "for", "visiting", "my", "site"],
      emphasis: [0],
    },
    {
      colData: ["I", "hope", "you", "enjoy"],
      emphasis: [3],
    },
  ],
];

const cursor = document.createElement("span");
cursor.classList.add(CURSOR_CLASS);
cursor.append(SPACE);

let idx = 0;
function start() {
  // to start erasing when container is empty
  if (container.textContent.replace(REG_EXP, "")) {
    setTimeout(() => {
      erase().then(() => {
        start();
      });
    }, WAIT_ERASE);
  }

  // to start typing when container is not empty
  if (!container.textContent.replace(REG_EXP, "")) {
    setTimeout(() => {
      type(typingData[idx]).then(() => {
        start();
      });
      idx++;
    }, WAIT_TYPE);

    // reset typingData to the first when the data reach to the last
    if (idx > typingData.length - 1) idx = 0;
  }
}

function erase() {
  return new Promise((resolve) => {
    // remove blink animation to cursor
    cursor.classList.remove(BLINK);

    const rows = document.querySelectorAll("." + ROW_CLASS);
    const cols = document.querySelectorAll("." + COL_CLASS);

    let r = rows.length - 1;
    let c = cols.length - 1;
    function loop() {
      setTimeout(() => {
        // move cursor to row above
        if (!rows[r].querySelectorAll("." + COL_CLASS)[0].textContent) {
          rows[--r].appendChild(cursor);
        }

        // select certain text content to erase
        if (!cols[c].textContent) {
          c--;
        }

        // toggle emphasis style of cursor
        cols[c].classList.contains(EMPHASIS)
          ? cursor.classList.add(EMPHASIS)
          : cursor.classList.remove(EMPHASIS);

        // erase text letter by letter
        cols[c].textContent = cols[c].textContent.substring(
          cols[c].textContent.length - 1,
          0
        );

        // force to stop loop
        if (!cols[0].textContent.length) {
          // append space to the first of column for cursor positioning
          cols[0].append(SPACE);

          // add blink animation to cursor
          cursor.classList.add(BLINK);
          resolve();
          return;
        }

        loop();
      }, ERASE_SPEED);
    }

    loop();
  });
}

function type(data = typingData[0]) {
  return new Promise((resolve) => {
    if (document.querySelectorAll("." + ROW_CLASS).length) {
      document.querySelectorAll("." + ROW_CLASS).forEach((e) => e.remove());
    }

    data.forEach((d) => {
      const nr = document.createElement("div");
      nr.classList.add(ROW_CLASS);
      container.appendChild(nr);
      d.colData.forEach((dd, i) => {
        const nc = document.createElement("span");
        nc.classList.add(COL_CLASS);
        if (d.emphasis.includes(i)) nc.classList.add(EMPHASIS);
        nr.appendChild(nc);
      });
    });

    // remove blink animation to cursor
    cursor.classList.remove(BLINK);

    let r = 0;
    let c = 0;
    let i = 0;
    function loop() {
      setTimeout(() => {
        const row = document.querySelectorAll("." + ROW_CLASS)[r];
        const col = row.querySelectorAll("." + COL_CLASS)[c];

        col.classList.contains(EMPHASIS)
          ? cursor.classList.add(EMPHASIS)
          : cursor.classList.remove(EMPHASIS);
        row.appendChild(cursor);

        col.append(data[r]["colData"][c][i]);

        i++;

        if (col.textContent.replace(REG_EXP, "") === data[r]["colData"][c]) {
          col.append(SPACE);
          c++;
          i = 0;
        }

        if (c === data[r]["colData"].length) {
          r++;
          c = 0;
        }

        if (r === data.length) {
          cursor.classList.add(BLINK);
          resolve();
          return;
        }
        loop();
      }, TYPE_SPEED);
    }
    loop();
  });
}

start();

window.addEventListener("error", function (e) {
  console.error(e.message);
});
