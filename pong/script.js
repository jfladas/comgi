// WebGL initialisieren
function initWebGL() {
    var canvas = document.getElementById("glCanvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL not supported, falling back on experimental-webgl");
        gl = canvas.getContext("experimental-webgl");
    }
    if (!gl) {
        alert("Your browser does not support WebGL");
        return;
    }

    // WebGL Programm erstellen und kompilieren
    var vertexShaderSource = fetch('vertexShader.glsl').then(response => response.text());
    var fragmentShaderSource = fetch('fragmentShader.glsl').then(response => response.text());

    Promise.all([vertexShaderSource, fragmentShaderSource]).then(([vertexShaderSource, fragmentShaderSource]) => {
        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        var shaderProgram = createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(shaderProgram);

        // Matrizen definieren und an den Shader übergeben
        var uProjectionMat = gl.getUniformLocation(shaderProgram, "uProjectionMat");
        var uModelMat = gl.getUniformLocation(shaderProgram, "uModelMat");
        var projectionMat = [
            2 / canvas.width, 0, 0,
            0, -2 / canvas.height, 0,
            0, 0, 1
        ];
        gl.uniformMatrix3fv(uProjectionMat, false, new Float32Array(projectionMat));

        var squareSize = 100.0;
        var translation = [0, 0];
        var modelMat = [
            1, 0, 0,
            0, 1, 0,
            translation[0], translation[1], 1
        ];
        gl.uniformMatrix3fv(uModelMat, false, new Float32Array(modelMat));

        // Quadrat zeichnen
        var vertices = [
            -squareSize / 2, -squareSize / 2,
            squareSize / 2, -squareSize / 2,
            squareSize / 2, squareSize / 2,
            -squareSize / 2, squareSize / 2
        ];
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(aVertexPosition);
        gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Hintergrundfarbe
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    });
}

// Shader erstellen
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error: ", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

// Programm erstellen
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Shader program linking error: ", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// WebGL initialisieren, wenn das DOM geladen ist
document.addEventListener("DOMContentLoaded", function (event) {
    initWebGL();
});
