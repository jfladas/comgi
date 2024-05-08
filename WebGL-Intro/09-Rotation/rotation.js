"use strict"



window.onload = main;

function main ()
{
    let canvas = document.getElementById ("myCanvas");
    let gl = canvas.getContext ("webgl");

    let vertexShaderSource =
    `
        attribute vec2 aVertexPosition;
        attribute vec3 aColor;

        uniform mat3 uModelMatrix;

        varying vec3 v_Color;

        void main ()
        {
            vec3 v = vec3 (aVertexPosition, 1.0);
            vec3 w = uModelMatrix * v;
            gl_Position = vec4 (w, 1.0);
            v_Color = aColor;
        }
    `;

    let vertexShader = gl.createShader (gl.VERTEX_SHADER);
    gl. shaderSource (vertexShader, vertexShaderSource);
    gl. compileShader (vertexShader);

    let fragmentShaderSource =
    `
        precision mediump float;

        varying vec3 v_Color;

        void main ()
        {
            gl_FragColor = vec4 (v_Color, 1.0);
        }
    `;

    let fragmentShader = gl. createShader (gl.FRAGMENT_SHADER);
    gl.shaderSource (fragmentShader, fragmentShaderSource);
    gl.compileShader (fragmentShader);

    let shaderProgram = gl.createProgram();
    gl.attachShader (shaderProgram, vertexShader);
    gl.attachShader (shaderProgram, fragmentShader);
    gl.linkProgram (shaderProgram);
    gl.useProgram (shaderProgram);

    let x = [-0.6, 0.0, 0.6];
    let y = [-0.9, 0.3, 0.9];

    let vertices =
    [
        x [0], y [0],
        x [2], y [0],
        x [2], y [1],
        x [0], y [1],
        x [1], y [2]
    ];

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (vertices), gl.STATIC_DRAW );

    let aVertexPositionId = gl.getAttribLocation (shaderProgram , "aVertexPosition");
    gl.vertexAttribPointer (aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (aVertexPositionId);

    let indices = new Uint8Array
    ([
         0, 1, 2, 3, 4, 2, 0, 3, 1
    ]);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    let colors = new Float32Array
    ([
         0.0, 0.0, 1.0,
         0.0, 1.0, 1.0,
         0.0, 1.0, 0.0,
         1.0, 1.0, 0.0,
         1.0, 0.0, 0.0
    ]);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer (gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData (gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    let aColorId = gl.getAttribLocation (shaderProgram , "aColor");
    gl.vertexAttribPointer (aColorId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (aColorId);

    let transform = new Float32Array
    ([
         0.0, 1.0, 0.0,
         1.0, 0.0, 0.0,
         0.0, 0.0, 1.0
    ])

    let modelMatrix = gl.getUniformLocation (shaderProgram, 'uModelMatrix');
    gl.uniformMatrix3fv (modelMatrix, false, transform);

    gl.clearColor (0.4, 0.4, 0.4, 1.0);
    gl.clear (gl.COLOR_BUFFER_BIT);

    gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.lineWidth (10);
    gl.drawElements (gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);
}
