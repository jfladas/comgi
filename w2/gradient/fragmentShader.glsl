precision mediump float;

varying vec4 vColor; // Varying-Variable für die Interpolation der Farbe

void main() {
    gl_FragColor = vColor; // Verwenden der interpolierten Farbe
}
