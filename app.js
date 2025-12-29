/* =========================================================
   Random Jewel Tone Engine (AF 2.0)
   ========================================================= */

const JEWELS = [
  "#7a5cff", // violet
  "#5c7cff", // indigo
  "#22d3ee", // cyan
  "#34d98a", // emerald
  "#a3e635", // lime
  "#ffd166", // gold
  "#ff9f1c", // amber
  "#ff4d6d", // rose
  "#c13584"  // magenta
];

function randomJewel(){
  return JEWELS[Math.floor(Math.random() * JEWELS.length)];
}

function applyRandomJewel(){
  document.documentElement.style.setProperty("--jt", randomJewel());
}
