"use strict"



window.onload = main;



let GL;
let NumberOfItems;
let Angle = 0;
const AngleIncrement = 10;
let ModelMatrix;
let X0 = 0;
let Y0 = 0;



function main ()
{
    let canvas = document.getElementById ("myCanvas");
    GL = canvas.getContext ("webgl");

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

    let vertexShader = GL.createShader (GL.VERTEX_SHADER);
    GL. shaderSource (vertexShader, vertexShaderSource);
    GL. compileShader (vertexShader);

    let fragmentShaderSource =
    `
        precision mediump float;

        varying vec3 v_Color;

        void main ()
        {
            gl_FragColor = vec4 (v_Color, 1.0);
        }
    `;

    let fragmentShader = GL. createShader (GL.FRAGMENT_SHADER);
    GL.shaderSource (fragmentShader, fragmentShaderSource);
    GL.compileShader (fragmentShader);

    let shaderProgram = GL.createProgram();
    GL.attachShader (shaderProgram, vertexShader);
    GL.attachShader (shaderProgram, fragmentShader);
    GL.linkProgram (shaderProgram);
    GL.useProgram (shaderProgram);

    let x = [-0.4, 0.0, 0.4];
    let y = [-0.4, 0.4, 0.8];
    X0 = 0.4;
    Y0 = 0.4;

    let vertices =
    [
        x [0], y [0],
        x [2], y [0],
        x [2], y [1],
        x [0], y [1],
        x [1], y [2]
    ];

    let vertexBuffer = GL.createBuffer();
    GL.bindBuffer (GL.ARRAY_BUFFER, vertexBuffer);
    GL.bufferData (GL.ARRAY_BUFFER, new Float32Array (vertices), GL.STATIC_DRAW );

    let aVertexPositionId = GL.getAttribLocation (shaderProgram , "aVertexPosition");
    GL.vertexAttribPointer (aVertexPositionId, 2, GL.FLOAT, false, 0, 0);
    GL.enableVertexAttribArray (aVertexPositionId);

    let indices = new Uint8Array
    ([
         0, 1, 2, 3, 4, 2, 0, 3, 1
    ]);

    let indexBuffer = GL.createBuffer();
    GL.bindBuffer (GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    GL.bufferData (GL.ELEMENT_ARRAY_BUFFER, indices, GL.STATIC_DRAW);
    NumberOfItems = indices.length;

    let colors = new Float32Array
    ([
         0.0, 0.0, 1.0,
         0.0, 1.0, 1.0,
         0.0, 1.0, 0.0,
         1.0, 1.0, 0.0,
         1.0, 0.0, 0.0
    ]);

    let colorBuffer = GL.createBuffer();
    GL.bindBuffer (GL.ARRAY_BUFFER, colorBuffer);
    GL.bufferData (GL.ARRAY_BUFFER, colors, GL.STATIC_DRAW);

    let aColorId = GL.getAttribLocation (shaderProgram , "aColor");
    GL.vertexAttribPointer (aColorId, 3, GL.FLOAT, false, 0, 0);
    GL.enableVertexAttribArray (aColorId);

    ModelMatrix = GL.getUniformLocation (shaderProgram, 'uModelMatrix');

    GL.bindBuffer (GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    draw (0);
}



function Rot (phi)
{
    let t = Math.PI * phi / 180;
    let c = Math.cos (t);
    let s = Math.sin (t);
    return new Float32Array
    ([
           c,  -s, 0.0,
           s,   c, 0.0,
         0.0, 0.0, 1.0
    ])
}



function Trn (x, y)
{
    return new Float32Array
    ([
         1.0, 0.0,   x,
         0.0, 1.0,   y,
         0.0, 0.0, 1.0
    ])
}



function T (a)
{
    return new Float32Array
    ([
         a [0], a [3], a [6],
         a [1], a [4], a [7],
         a [2], a [5], a [8]
    ])
}



function Mul (a, b)
{
    return new Float32Array
    ([
         a [0] * b [0] + a [1] * b [3] + a [2] * b [6],
         a [0] * b [1] + a [1] * b [4] + a [2] * b [7],
         a [0] * b [2] + a [1] * b [5] + a [2] * b [8],

         a [3] * b [0] + a [4] * b [3] + a [5] * b [6],
         a [3] * b [1] + a [4] * b [4] + a [5] * b [7],
         a [3] * b [2] + a [4] * b [5] + a [5] * b [8],

         a [6] * b [0] + a [7] * b [3] + a [8] * b [6],
         a [6] * b [1] + a [7] * b [4] + a [8] * b [7],
         a [6] * b [2] + a [7] * b [5] + a [8] * b [8]
    ])
}



function draw (increment)
{
    GL.clearColor (0.4, 0.4, 0.4, 1.0);
    GL.clear (GL.COLOR_BUFFER_BIT);

    Angle += increment;
    let transform = new Trn (-X0, -Y0);
    transform = new Mul (new Rot (Angle), transform);
    transform = new Mul (new Trn (X0, Y0), transform);
    transform = new T (transform);
    GL.uniformMatrix3fv (ModelMatrix, false, transform);

    GL.drawElements (GL.LINE_STRIP, NumberOfItems, GL.UNSIGNED_BYTE, 0);
}



function RotLeft ()
{
    draw (AngleIncrement);
}



function RotRight ()
{
    draw (-AngleIncrement);
}
