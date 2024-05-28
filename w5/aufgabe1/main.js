"use strict"



function main(gl, sp) {
    console.log("main")

    let a = 0.4

    let A = [-a, -a, -a]
    let B = [a, -a, -a]
    let C = [a, a, -a]
    let D = [-a, a, -a]
    let E = [-a, -a, a]
    let F = [a, -a, a]
    let G = [a, a, a]
    let H = [-a, a, a]

    let red = [1, 0, 0];
    let blue = [0, 0, 1];
    let green = [0, 1, 0];
    let yellow = [1, 1, 0];
    let cyan = [0, 1, 1];
    let magenta = [1, 0, 1];
    let white = [1, 1, 1];

    let vertices =
        [
            ...E, ...F, ...G, ...H,
            ...A, ...D, ...C, ...B,
            ...A, ...B, ...F, ...E,
            ...D, ...H, ...G, ...C,
            ...A, ...E, ...H, ...D,
        ];

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    let aVertexLoc = gl.getAttribLocation(sp, "aVertex")
    gl.vertexAttribPointer(aVertexLoc, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aVertexLoc)

    let colors = [
        ...magenta, ...magenta, ...cyan, ...cyan,
        ...white, ...yellow, ...yellow, ...white,
        ...white, ...white, ...magenta, ...magenta,
        ...white, ...cyan, ...cyan, ...white,
        ...magenta, ...magenta, ...cyan, ...white,
    ];

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let aColorLoc = gl.getAttribLocation(sp, "aColor");
    gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColorLoc);

    let indices =
        [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19
        ]

    let indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW)

    let mvw = Mat.id()
    let prj = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, -1.0, 0.0],
        [0.0, 0.0, 0, 1.0]
    ]

    switch (6) {
        case 0:
            mvw = Mat.mulMats(
                Mat.trans(0, 0, -1.5),
                Mat.lookAt([-1, -1, 1], [1, 1, -1], [0, 1, 0])
            )
            break

        case 1:
            prj = Mat.perspective(3)
            break

        case 2:
            prj = Mat.perspective(1)
            break

        case 3:
            mvw = Mat.mulMats(Mat.rotX(-35), Mat.rotY(45))
            //prj = Mat.perspective(1)
            break

        case 4:
            mvw = Mat.rotY(30)
            prj = Mat.perspective(1)
            break

        case 5:
            mvw = Mat.rotY(30)
            break

        case 6:
            mvw = Mat.mulMats(Mat.rotX(20), Mat.rotY(20));
            break
    }

    let uProjectionLoc = gl.getUniformLocation(sp, "uProjection")
    Mat.set(gl, uProjectionLoc, prj)

    let uModelViewLoc = gl.getUniformLocation(sp, "uModelView")
    Mat.set(gl, uModelViewLoc, mvw)

    gl.clearColor(1.0, 1.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.CULL_FACE)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.enable(gl.DEPTH_TEST)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}
