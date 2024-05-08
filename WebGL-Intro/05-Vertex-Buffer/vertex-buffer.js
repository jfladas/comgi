"use strict"



window.onload = function ()
{
    let canvas = document.getElementById ("myCanvas")
    let gl = canvas.getContext ("webgl")

    let vertexShaderSource =
    `
        attribute vec2 aVertexPosition;

        void main ()
        {
            gl_Position = vec4 (aVertexPosition, 0.0, 1.0);
        }
    `

    let vertexShader = gl.createShader (gl.VERTEX_SHADER)
    gl.shaderSource (vertexShader, vertexShaderSource)
    gl.compileShader (vertexShader)

    let fragmentShaderSource =
    `
        precision mediump float;

        void main ()
        {
            gl_FragColor = vec4 (0.0, 0.0, 0.0, 1.0);
        }
    `

    let fragmentShader = gl. createShader (gl.FRAGMENT_SHADER)
    gl.shaderSource (fragmentShader, fragmentShaderSource)
    gl.compileShader (fragmentShader)

    let shaderProgram = gl.createProgram()
    gl.attachShader (shaderProgram, vertexShader)
    gl.attachShader (shaderProgram, fragmentShader)
    gl.linkProgram (shaderProgram)
    gl.useProgram (shaderProgram)

    let x = [-0.6, 0.0, 0.6]
    let y = [-0.9, 0.3, 0.9]

    let vertices =
    [
        x [0], y [0],
        x [2], y [0],
        x [2], y [1],
        x [0], y [1],
        x [1], y [2],
        x [2], y [1],
        x [0], y [0],
        x [0], y [1],
        x [2], y [0]
    ]

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (vertices), gl.STATIC_DRAW )

    gl.clearColor (0.8, 0.8, 0.8, 1.0)
    gl.clear (gl.COLOR_BUFFER_BIT)

    let aVertexPositionId = gl.getAttribLocation (shaderProgram , "aVertexPosition")
    gl.vertexAttribPointer (aVertexPositionId, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray (aVertexPositionId)
    gl.drawArrays (gl.LINE_STRIP, 0, vertices.length / 2)
}
