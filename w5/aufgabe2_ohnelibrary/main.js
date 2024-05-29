"use strict";
let Tex;
let gl, sp;
let NumIndices;
let Axis = [1, 1, 1];
let Angle = 0;
let Omega = 5E-2;
let uModelViewLoc;
let mvw;
let prj;

function main(agl, asp) {
  console.log("main");
  gl = agl;
  sp = asp;
  LoadTex();

  let ShowTexLoc = gl.getUniformLocation(sp, "uShowTexture");
  gl.uniform1i(ShowTexLoc, 1);
}

function LoadTex() {
  Tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, Tex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([178, 178, 255, 255])
  );
  gl.bindTexture(gl.TEXTURE_2D, null);

  const uSamplerLoc = gl.getUniformLocation(sp, "uSampler");
  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(uSamplerLoc, 0);

  let Img = new Image();
  Img.src = "./mandrill.png";
  Img.addEventListener("load", function () {
    ImgLoaded(gl, Tex, Img);
  });
}

function ImgLoaded(gl, Tex, Img) {
  gl.bindTexture(gl.TEXTURE_2D, Tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);

  Draw();
}

function Draw() {
  let a = 0.4;

  let A = [-a, -a, -a];
  let B = [a, -a, -a];
  let C = [a, a, -a];
  let D = [-a, a, -a];
  let E = [-a, -a, a];
  let F = [a, -a, a];
  let G = [a, a, a];
  let H = [-a, a, a];

  // prettier-ignore
  let vertices = [
    ...E, ...F, ...G, ...H, // 0, 1, 2, 3
    ...A, ...D, ...C, ...B, // 4, 5, 6, 7
    ...A, ...B, ...F, ...E, // 8, 9, 10, 11
    ...D, ...H, ...G, ...C, // 12, 13, 14, 15
    ...B, ...C, ...G, ...F, // 16, 17, 18, 19
    ...A, ...E, ...H, ...D  // 20, 21, 22, 23
  ];

  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  let aVertexLoc = gl.getAttribLocation(sp, "aVertex");
  gl.vertexAttribPointer(aVertexLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aVertexLoc);

  // Add texture coordinates (assuming they are needed)
  // prettier-ignore
  let textureCoordinates = [
    // Add appropriate texture coordinates for each vertex
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,  // Front face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,  // Back face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,  // Top face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,  // Bottom face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,  // Right face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0   // Left face
  ];

  let texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  const aTextureLoc = gl.getAttribLocation(sp, "aTexture");
  gl.vertexAttribPointer(aTextureLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aTextureLoc);

  // prettier-ignore
  let colors = [
    [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], // Red
    [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], // Green
    [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], // Blue
    [1, 1, 0], [1, 1, 0], [1, 1, 0], [1, 1, 0], // Yellow
    [0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1], // Cyan
    [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1]  // Magenta
  ];

  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat()), gl.STATIC_DRAW);

  let aColorLoc = gl.getAttribLocation(sp, "aColor");
  gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColorLoc);

  // prettier-ignore
  let indices = [
    0, 1, 2, 0, 2, 3, // Front
    4, 5, 6, 4, 6, 7, // Back
    8, 9, 10, 8, 10, 11, // Top
    12, 13, 14, 12, 14, 15, // Bottom
    16, 17, 18, 16, 18, 19, // Right
    20, 21, 22, 20, 22, 23  // Left
  ];

  NumIndices = indices.length;

  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

  // Set up the projection and model-view matrices
  mvw = Mat.id();
  prj = Mat.einheitsmatrixMinusZ();

  switch (6) {
    case 0:
      mvw = Mat.mulMats(Mat.trans(0, 0, -1.5), Mat.lookAt([-1, -1, 1], [1, 1, -1], [0, 1, 0]));
      break;
    case 1:
      prj = Mat.perspective(3);
      break;
    case 2:
      prj = Mat.perspective(1);
      break;
    case 3:
      mvw = Mat.mulMats(Mat.rotX(-35), Mat.rotY(45));
      prj = Mat.perspective(1);
      break;
    case 4:
      mvw = Mat.rotY(30);
      prj = Mat.perspective(1);
      break;
    case 5:
      mvw = Mat.rotY(30);
      break;
    case 6:
      mvw = Mat.mulMats(Mat.rotX(20), Mat.rotY(20));
      break;
  }

  let uProjectionLoc = gl.getUniformLocation(sp, "uProjection");
  Mat.set(gl, uProjectionLoc, prj);

  uModelViewLoc = gl.getUniformLocation(sp, "uModelView");
  Mat.set(gl, uModelViewLoc, mvw);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.bindTexture(gl.TEXTURE_2D, Tex);
  gl.drawElements(gl.TRIANGLES, NumIndices, gl.UNSIGNED_BYTE, 0);

  gl.bindTexture(gl.TEXTURE_2D, null);
  window.requestAnimationFrame(Animate);
}

function Animate(time) {
  Angle = Omega * time;
  const rotationMatrix = Mat.rot(Axis, Angle);
  const newModelViewMatrix = Mat.mulMats(mvw, rotationMatrix);

  Mat.set(gl, uModelViewLoc, newModelViewMatrix);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bindTexture(gl.TEXTURE_2D, Tex);
  gl.drawElements(gl.TRIANGLES, NumIndices, gl.UNSIGNED_BYTE, 0);

  window.requestAnimationFrame(Animate);
}
