"use strict";

window.onload = function () {
    let canvas = document.getElementById("myCanvas");
    let gl = canvas.getContext("webgl");
    let grey = [0.9, 0.9, 0.9, 1.0]; // Grey
    let pink = [1.0, 0.5, 0.9, 1.0]; // Pink
    let black = [0.0, 0.0, 0.0, 1.0]; // Black
    let white = [1.0, 1.0, 1.0, 1.0]; // White
    let red = [1.0, 0.0, 0.0, 1.0]; // Red
    let blue = [0.0, 0.0, 1.0, 1.0]; // Blue
    let cyan = [0.0, 1.0, 1.0, 1.0]; // Cyan
    let green = [0, 0.9, 0.4, 1.0]; // Green

    // Load vertex shader source from external file
    fetch('vertexShader.glsl')
        .then(response => response.text())
        .then(vertexShaderSource => {
            // Load fragment shader source from external file
            fetch('fragmentShader.glsl')
                .then(response => response.text())
                .then(fragmentShaderSource => {
                    // Compile and link shaders
                    let vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
                    let fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
                    let shaderProgram = linkProgram(gl, vertexShader, fragmentShader);

                    // Use the shader program
                    gl.useProgram(shaderProgram);

                    let verticesBuffer = gl.createBuffer();

                    clear(grey);

                    document.getElementById("yoshi").onclick = function () {
                        drawYoshi();
                    }

                    document.getElementById("birdo").onclick = function () {
                        drawBirdo();
                    }

                    function drawBirdo() {
                        clear(grey);
                        drawRectangle([-0.4, 0.7, -0.05, 0], red);
                        drawRectangle([0.05, 0.7, 0.4, 0], red);
                        drawRectangle([-0.3, 0.55, 0.3, 0], red);
                        drawRectangle([-0.1, 0.5, 0.3, 0], pink);
                        drawRectangle([-0.2, 0.1, 0.6, -0.5], pink);
                        drawRectangle([-0.4, -0.4, 0.2, -1], pink);
                        drawRectangle([-0.05, 0.45, 0.3, 0], white);
                        drawRectangle([0, 0.4, 0.1, 0.1], black);
                        drawRectangle([0.15, 0.4, 0.25, 0.1], black);
                        drawRectangle([0.35, 0, 0.55, -0.4], black);
                    }

                    function drawYoshi() {
                        clear(grey);
                        drawRectangle([-0.1, 0.5, 0.3, 0], green);
                        drawRectangle([-0.2, 0.1, 0.6, -0.5], green);
                        drawRectangle([-0.4, -0.4, 0.2, -1], green);
                        drawRectangle([-0.05, 0.45, 0.3, 0], white);
                        drawRectangle([0, 0.4, 0.1, 0.1], black);
                        drawRectangle([0.15, 0.4, 0.25, 0.1], black);
                        drawRectangle([0.4, 0.05, 0.45, 0], black);
                        drawRectangle([0.5, 0.05, 0.55, 0], black);
                        drawRectangle([-0.55, -0.6, -0.35, -1], red);
                        drawRectangle([0.6, -0.25, 1, -0.35], red);
                    }

                    function drawRectangle(ver, col) {
                        let vertices = [
                            ver[0], ver[1],
                            ver[2], ver[1],
                            ver[2], ver[3],
                            ver[0], ver[3]
                        ];

                        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

                        let aVertexPositionId = gl.getAttribLocation(shaderProgram, "aVertexPosition");
                        gl.vertexAttribPointer(aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
                        gl.enableVertexAttribArray(aVertexPositionId);

                        let colorLocation = gl.getUniformLocation(shaderProgram, "color");
                        gl.uniform4fv(colorLocation, col);

                        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
                    }

                    function clear(col) {
                        gl.clearColor(col[0], col[1], col[2], col[3]);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                    }
                });
        });

    function compileShader(gl, source, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function linkProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Error linking program:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
}