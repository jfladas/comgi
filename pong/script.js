var gl;
var program;

window.onload = function () {
    var canvas = document.getElementById('pongCanvas');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Lade die Shader
    var vsSource = loadShaderSource('vertexShader.glsl');
    var fsSource = loadShaderSource('fragmentShader.glsl');

    // Kompiliere Shader
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Erstelle und verlinke das Shader-Programm
    program = createProgram(gl, vertexShader, fragmentShader);

    // Definiere die Positionen der Eckpunkte des ersten Quadrats
    var vertices1 = [
        -50, -50,
        -50, 50,
        50, -50,
        50, 50
    ];

    // Erstelle ein Vertex Buffer Object (VBO) und lade die Eckpunkte für das erste Quadrat
    var vertexBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);

    // Definiere die Positionen der Eckpunkte des zweiten Quadrats
    var vertices2 = [
        -100, -100,
        -100, 0,
        0, -100,
        0, 0
    ];

    // Erstelle ein Vertex Buffer Object (VBO) und lade die Eckpunkte für das zweite Quadrat
    var vertexBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

    // Definiere das Attribut 'aPosition' im Shader
    var positionAttributeLocation = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Definition der Transformationsmatrizen
    var w = canvas.width;
    var h = canvas.height;
    var uProjectionMat = [
        2 / w, 0, 0,
        0, -2 / h, 0,
        0, 0, 1
    ];

    var uModelMat = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];

    // Übergeben der Matrizen an den Shader
    gl.useProgram(program);
    var projectionMatLocation = gl.getUniformLocation(program, 'uProjectionMat');
    gl.uniformMatrix3fv(projectionMatLocation, false, uProjectionMat);

    var modelMatLocation = gl.getUniformLocation(program, 'uModelMat');
    gl.uniformMatrix3fv(modelMatLocation, false, uModelMat);

    // Zeichne das erste Quadrat
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Schwarzer Hintergrund
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Zeichne das zweite Quadrat
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// Hilfsfunktionen zum Laden von Shader-Quellcodes
function loadShaderSource(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
}

// Hilfsfunktionen zum Kompilieren und Verlinken von Shadern
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error('Shader program linking failed:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
