"use strict"



window.onload = function ()
{
    let canvas = document.getElementById ("myCanvas")
    let gl = canvas.getContext ("webgl")

    let vertexShaderSource =
    `
        void main ()
        {
            gl_Position = vec4 (0.0, 0.0, 0.0, 1.0);
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

    let fragmentShader = gl.createShader (gl.FRAGMENT_SHADER)
    gl.shaderSource (fragmentShader, fragmentShaderSource)
    gl.compileShader (fragmentShader)

    let shaderProgram = gl.createProgram()
    gl.attachShader (shaderProgram, vertexShader)
    gl.attachShader (shaderProgram, fragmentShader)
    gl.linkProgram (shaderProgram)
    gl.useProgram (shaderProgram)

    gl.clearColor (0.8, 0.8, 0.8, 1.0)
    gl.clear (gl.COLOR_BUFFER_BIT)

    gl.drawArrays (gl.POINTS, 0, 1)
}
