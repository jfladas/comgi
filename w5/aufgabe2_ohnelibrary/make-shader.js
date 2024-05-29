"use strict";

async function MakeShader(gl, vsfile, fsfile) {
  const vsprog = await fetch(vsfile).then((result) => result.text());
  let vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsprog);
  gl.compileShader(vs);

  const fsprog = await fetch(fsfile).then((result) => result.text());
  let fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsprog);
  gl.compileShader(fs);

  let sp = gl.createProgram();
  gl.attachShader(sp, vs);
  gl.attachShader(sp, fs);
  gl.linkProgram(sp);
  gl.useProgram(sp);

  return sp;
}
