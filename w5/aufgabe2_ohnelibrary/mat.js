"use strict";

class Mat {
  static rotX(phi) {
    let t = (phi * Math.PI) / 180.0;
    let c = Math.cos(t);
    let s = Math.sin(t);

    return [
      [1.0, 0.0, 0.0, 0.0],
      [0.0, c, -s, 0.0],
      [0.0, s, c, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static rotY(phi) {
    let t = (phi * Math.PI) / 180.0;
    let c = Math.cos(t);
    let s = Math.sin(t);

    return [
      [c, 0.0, s, 0.0],
      [0.0, 1.0, 0.0, 0.0],
      [-s, 0.0, c, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static rotZ(phi) {
    let t = (phi * Math.PI) / 180.0;
    let c = Math.cos(t);
    let s = Math.sin(t);

    return [
      [c, -s, 0.0, 0.0],
      [s, c, 0.0, 0.0],
      [0.0, 0.0, 1.0, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static rot(axs, phi) {
    const a = Vec.normalize(axs);
    const t = (phi * Math.PI) / 180.0;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const d = 1 - c;

    const d00 = d * a[0] * a[0];
    const d01 = d * a[0] * a[1];
    const d02 = d * a[0] * a[2];
    const d11 = d * a[1] * a[1];
    const d12 = d * a[1] * a[2];
    const d22 = d * a[2] * a[2];

    const s0 = s * a[0];
    const s1 = s * a[1];
    const s2 = s * a[2];

    return [
      [d00 + c, d01 - s2, d02 + s1, 0.0],
      [d01 + s2, d11 + c, d12 - s0, 0.0],
      [d02 - s1, d12 + s0, d22 + c, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static trans(x, y, z) {
    return [
      [1.0, 0.0, 0.0, x],
      [0.0, 1.0, 0.0, y],
      [0.0, 0.0, 1.0, z],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static id() {
    return this.trans(0.0, 0.0, 0.0);
  }

  static einheitsmatrixMinusZ() {
    return [
      [1.0, 0.0, 0.0, 0.0],
      [0.0, 1.0, 0.0, 0.0],
      [0.0, 0.0, -1.0, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static scale(f, g, h) {
    if (g === undefined && h === undefined) g = h = f;

    return [
      [f, 0.0, 0.0, 0.0],
      [0.0, g, 0.0, 0.0],
      [0.0, 0.0, h, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static ortho(xmin, xmax, ymin, ymax, zmin, zmax) {
    const dx = xmax - xmin;
    const dy = ymax - ymin;
    const dz = zmax - zmin;

    return [
      [2 / dx, 0, 0, -(xmin + xmax) / dx],
      [0, 2 / dy, 0, -(ymin + ymax) / dy],
      [0, 0, -2 / dz, (zmin + zmax) / dz],
      [0, 0, 0, 1.0],
    ];
  }

  static perspective(d) {
    let f = 1 / d;

    return [
      [1.0, 0.0, 0.0, 0.0],
      [0.0, 1.0, 0.0, 0.0],
      [0.0, 0.0, -1.0, 0.0],
      [0.0, 0.0, -f, 1.0],
    ];
  }

  static lookAt(p, q, up) {
    const z = Vec.normalize(Vec.sub(q, p));
    const x = Vec.normCross(z, up);
    const y = Vec.normCross(x, z);
    return [
      [x[0], x[1], x[2], -Vec.dot(p, x)],
      [y[0], y[1], y[2], -Vec.dot(p, y)],
      [z[0], z[1], z[2], -Vec.dot(p, z)],
      [0.0, 0.0, 0.0, 1.0],
    ];
  }

  static mulMatMat(a, b) {
    const c = [[], [], [], []];

    for (let i = 0; i < 4; ++i)
      for (let k = 0; k < 4; ++k) {
        let s = 0.0;
        for (let j = 0; j < 4; ++j) s += a[i][j] * b[j][k];
        c[i][k] = s;
      }

    return c;
  }

  static mulMats() {
    if (arguments.length < 1) return this.id();

    let a = arguments[0];
    for (let i = 1; i < arguments.length; ++i) {
      const b = arguments[i];
      a = this.mulMatMat(a, b);
    }

    return a;
  }

  static log(a, width, precision) {
    if (width === undefined) width = 10;

    if (precision === undefined) precision = 5;

    const f = (val) => val.toFixed(precision).padStart(width);

    console.log(f(a[0][0]), f(a[0][1]), f(a[0][2]), f(a[0][3]));
    console.log(f(a[1][0]), f(a[1][1]), f(a[1][2]), f(a[1][3]));
    console.log(f(a[2][0]), f(a[2][1]), f(a[2][2]), f(a[2][3]));
    console.log(f(a[3][0]), f(a[3][1]), f(a[3][2]), f(a[3][3]));
  }

  static mulMatVec(m, v) {
    const x = m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3];
    const y = m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3];
    const z = m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3];
    const w = m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3];

    return [x / w, y / w, z];
  }

  static set(gl, loc, m) {
    let a = [
      m[0][0],
      m[1][0],
      m[2][0],
      m[3][0],
      m[0][1],
      m[1][1],
      m[2][1],
      m[3][1],
      m[0][2],
      m[1][2],
      m[2][2],
      m[3][2],
      m[0][3],
      m[1][3],
      m[2][3],
      m[3][3],
    ];

    gl.uniformMatrix4fv(loc, false, a);
  }
}
