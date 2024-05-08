"use strict"



let gl



window.onload = function ()
{
    let canvas = document.getElementById ("myCanvas")
    gl = canvas.getContext ("webgl")

    let vertexShaderSource =
    `
        attribute vec2 aVertexPosition;

        void main ()
        {
            gl_Position = vec4 (aVertexPosition, 0.0, 1.0);
            gl_PointSize = 10.0;
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
            gl_FragColor = vec4 (1.0, 0.0, 0.0, 1.0);
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

    let vertices =
    [
        -0.5, -0.5,
         0.5, -0.5,
         0.5,  0.5,
        -0.5,  0.5
    ]

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (vertices), gl.STATIC_DRAW )

    let aVertexPositionId = gl.getAttribLocation (shaderProgram , "aVertexPosition")
    gl.vertexAttribPointer (aVertexPositionId, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray (aVertexPositionId)

    clear()
}



function clear ()
{
    gl.clearColor (0.8, 0.8, 0.8, 1.0)
    gl.clear (gl.COLOR_BUFFER_BIT)
}



function DrawPoints ()
{
    clear()
    gl.drawArrays (gl.POINTS, 0, 4)
}



function DrawLines ()
{
    clear()
    gl.drawArrays (gl.LINES, 0, 4)
}



function DrawLineStrip ()
{
    clear()
    gl.drawArrays (gl.LINE_STRIP, 0, 4)
}



function DrawLineLoop ()
{
    clear()
    gl.drawArrays (gl.LINE_LOOP, 0, 4)
}
