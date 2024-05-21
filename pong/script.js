"use strict";

let gl;
let sp;

let Vertices;
let VertexBuffer;
let VertexLoc;
let uProjectionMatLoc;
let uModelMatLoc;
let ColorBuffer;
let ColorLoc;

let ball;
let paddle1;
let paddle2;
let middleLine;
let lastTime;
let keysPressed = {};

let score1 = 0;
let score2 = 0;
const winningScore = 5;
let gamePaused = false;

function main(agl, asp) {
  gl = agl;
  sp = asp;

  Vertices = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5];

  VertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vertices), gl.STATIC_DRAW);

  VertexLoc = gl.getAttribLocation(sp, "aVertex");
  gl.vertexAttribPointer(VertexLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(VertexLoc);

  uProjectionMatLoc = gl.getUniformLocation(sp, "uProjectionMat");
  uModelMatLoc = gl.getUniformLocation(sp, "uModelMat");

  ColorBuffer = gl.createBuffer();
  ColorLoc = gl.getAttribLocation(sp, "aColor");

  // Set colors for each game element
  const ballColor = [1.0, 0.9, 1.0]; // "White"
  const paddle1Color = [0.7, 0.4, 0.6]; // Pink
  const paddle2Color = [0.5, 0.6, 0.9]; // Blue
  const middleLineColor = [0.2, 0.0, 0.2]; // "Gray"

  // Projection Matrix: Orthographic projection for a 100x100 square in the center of the screen
  const projectionMatrix = [
    2 / gl.canvas.width, 0, 0,
    0, 2 / gl.canvas.height, 0,
    0, 0, 1,
  ];

  gl.uniformMatrix3fv(uProjectionMatLoc, false, projectionMatrix);

  gl.clearColor(0.05, 0.0, 0.05, 1.0); // "Black"
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Initialize game objects
  ball = { x: 0, y: 0, dx: 10, dy: 10, speedx: 1.5, speedy: 1.5, color: ballColor };
  paddle1 = { x: -gl.canvas.width / 2 + 40, y: 0, dx: 10, dy: 60, color: paddle1Color };
  paddle2 = { x: gl.canvas.width / 2 - 40, y: 0, dx: 10, dy: 60, color: paddle2Color };
  middleLine = { x: 0, y: 0, dx: 5, dy: 500, color: middleLineColor };

  // Initial drawing
  drawGameObjects();

  // Event listeners for keyboard input
  window.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
  });
  window.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false;
  });

  window.requestAnimationFrame(drawAnimated);
  console.log("Animation started!");
}

function drawRect(x0, y0, dx, dy, color) {
  // Model Matrix: Transformations matrix for each object
  const modelMatrix = [
    dx, 0, 0,
    0, dy, 0,
    x0, y0, 1,
  ];

  gl.uniformMatrix3fv(uModelMatLoc, false, modelMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color.concat(color, color, color)), gl.STATIC_DRAW);
  gl.vertexAttribPointer(ColorLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ColorLoc);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, Vertices.length / 2);
}

function drawGameObjects() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawRect(paddle1.x, paddle1.y, paddle1.dx, paddle1.dy, paddle1.color);
  drawRect(paddle2.x, paddle2.y, paddle2.dx, paddle2.dy, paddle2.color);
  drawRect(ball.x, ball.y, ball.dx, ball.dy, ball.color);
  drawRect(middleLine.x, middleLine.y, middleLine.dx, middleLine.dy, middleLine.color);
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById("score1").innerText = score1 >= winningScore ? "WIN" : score1;
  document.getElementById("score2").innerText = score2 >= winningScore ? "WIN" : score2;
}

function checkWin() {
  if (score1 >= winningScore || score2 >= winningScore) {
    updateScoreDisplay();
    gamePaused = true;
    ball.x = 1000;
    ball.y = 1000;
    setTimeout(resetGame, 3000);
  }
}

function resetGame() {
  score1 = 0;
  score2 = 0;
  ball.x = 0;
  ball.y = 0;
  ball.speedx = 1.5;
  ball.speedy = 1.5;
  gamePaused = false;
  drawGameObjects();
}

// Update game logic function
function updateGame() {
  if (gamePaused) return;

  // Paddle movements
  if (keysPressed["ArrowDown"] && paddle2.y > -gl.canvas.height / 2 + paddle2.dy / 2) {
    paddle2.y -= 2;
  }
  if (keysPressed["ArrowUp"] && paddle2.y < gl.canvas.height / 2 - paddle2.dy / 2) {
    paddle2.y += 2;
  }
  if (keysPressed["s"] && paddle1.y > -gl.canvas.height / 2 + paddle1.dy / 2) {
    paddle1.y -= 2;
  }
  if (keysPressed["w"] && paddle1.y < gl.canvas.height / 2 - paddle1.dy / 2) {
    paddle1.y += 2;
  }

  // Update ball position
  ball.x += ball.speedx;
  ball.y += ball.speedy;

  // Collision with top and bottom walls
  if (ball.y <= -gl.canvas.height / 2 + ball.dy / 2 || ball.y >= gl.canvas.height / 2 - ball.dy / 2) {
    ball.speedy = -ball.speedy;
  }

  // Collision with paddles
  if (
    ball.x - ball.dx / 2 <= paddle1.x + paddle1.dx / 2 &&
    ball.x - ball.dx / 2 >= paddle1.x - paddle1.dx / 2 && // Increase paddle hitbox
    ball.y >= paddle1.y - paddle1.dy / 2 &&
    ball.y <= paddle1.y + paddle1.dy / 2
  ) {
    ball.speedx = Math.abs(ball.speedx); // Ensure the ball moves to the right
    ball.speedx *= 1.05; // Increase speed
    ball.speedy *= 1.05; // Increase speed
  }

  if (
    ball.x + ball.dx / 2 >= paddle2.x - paddle2.dx / 2 &&
    ball.x + ball.dx / 2 <= paddle2.x + paddle2.dx / 2 && // Increase paddle hitbox
    ball.y >= paddle2.y - paddle2.dy / 2 &&
    ball.y <= paddle2.y + paddle2.dy / 2
  ) {
    ball.speedx = -Math.abs(ball.speedx); // Ensure the ball moves to the left
    ball.speedx *= 1.05; // Increase speed
    ball.speedy *= 1.05; // Increase speed
  }

  // Points and reset
  if (ball.x < -gl.canvas.width / 2) {
    score2++;
    checkWin();
    if (!gamePaused) {
      ball.x = 0;
      ball.y = 0;
      ball.speedx = 1;
      ball.speedy = 1;
    }
  }

  if (ball.x > gl.canvas.width / 2) {
    score1++;
    checkWin();
    if (!gamePaused) {
      ball.x = 0;
      ball.y = 0;
      ball.speedx = -1;
      ball.speedy = 1;
    }
  }
}


// Updated drawing function
function drawAnimated(timeStamp) {
  if (!lastTime) lastTime = timeStamp;
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;

  updateGame();

  drawGameObjects();

  window.requestAnimationFrame(drawAnimated);
}

window.onload = function () {
  let canvas = document.getElementById("canvas");
  let gl = canvas.getContext("webgl");

  MakeShader(gl, "./vertex-shader.glsl", "./fragment-shader.glsl")
    .then(sp => main(gl, sp));
}

async function MakeShader(gl, vsfile, fsfile) {
  const vsprog = await fetch(vsfile)
    .then(result => result.text());
  let vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsprog);
  gl.compileShader(vs);

  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.error("Vertex shader compilation failed:", gl.getShaderInfoLog(vs));
    gl.deleteShader(vs);
    return null;
  }

  const fsprog = await fetch(fsfile)
    .then(result => result.text());
  let fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsprog);
  gl.compileShader(fs);

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error("Fragment shader compilation failed:", gl.getShaderInfoLog(fs));
    gl.deleteShader(fs);
    return null;
  }

  let sp = gl.createProgram();
  gl.attachShader(sp, vs);
  gl.attachShader(sp, fs);
  gl.linkProgram(sp);

  if (!gl.getProgramParameter(sp, gl.LINK_STATUS)) {
    console.error("Shader program linking failed:", gl.getProgramInfoLog(sp));
    gl.deleteProgram(sp);
    return null;
  }

  gl.useProgram(sp);
  return sp;
}
