"use strict"



window.onload = function ()
{
    let canvas = document.getElementById ("myCanvas")
    let gl = canvas.getContext ("webgl")

    MakeShader (gl, "./vertex-shader.glsl", "./fragment-shader.glsl")
        .then (sp => main (gl, sp))
}


async function MakeShader (gl, vsfile, fsfile)
{
    const vsprog = await fetch (vsfile)
        .then (result=> result.text())
    let vs = gl.createShader (gl.VERTEX_SHADER)
    gl.shaderSource (vs, vsprog)
    gl.compileShader (vs)

    const fsprog = await fetch (fsfile)
        .then (result=> result.text())
    let fs = gl.createShader (gl.FRAGMENT_SHADER)
    gl.shaderSource (fs, fsprog)
    gl.compileShader (fs)

    let sp = gl.createProgram()
    gl.attachShader (sp, vs)
    gl.attachShader (sp, fs)
    gl.linkProgram (sp)
    gl.useProgram (sp)

    console.log ("leaving loadShaders, calling main")
    return sp
}


function main (gl, sp)
{
    let x = [-0.6, 0.0, 0.6]
    let y = [-0.9, 0.3, 0.9]

    let vertices =
    [
        x [0], y [0],
        x [2], y [0],
        x [2], y [1],
        x [0], y [1],
        x [1], y [2]
    ]

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (vertices), gl.STATIC_DRAW )

    let aVertexPositionId = gl.getAttribLocation (sp , "aVertexPosition")
    gl.vertexAttribPointer (aVertexPositionId, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray (aVertexPositionId)

    let indices = new Uint8Array
    ([
         0, 1, 2, 3, 4, 2, 0, 3, 1
    ])

    let indexBuffer = gl.createBuffer()
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    let colors = new Float32Array
    ([
         0.0, 0.0, 1.0,
         0.0, 1.0, 1.0,
         0.0, 1.0, 0.0,
         1.0, 1.0, 0.0,
         1.0, 0.0, 0.0
    ])

    let colorBuffer = gl.createBuffer()
    gl.bindBuffer (gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData (gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

    let aColorId = gl.getAttribLocation (sp , "aColor")
    gl.vertexAttribPointer (aColorId, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray (aColorId)

    gl.clearColor (0.4, 0.4, 0.4, 1.0)
    gl.clear (gl.COLOR_BUFFER_BIT)

    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.lineWidth (10)
    gl.drawElements (gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0)
}
