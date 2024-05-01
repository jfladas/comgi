attribute vec2 aVertexPosition;
attribute vec4 aVertexColor; // Neues Attribut für die Farbe

varying vec4 vColor; // Definieren einer Varying-Variable für die Interpolation der Farbe

void main() {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    gl_PointSize = 5.0;

    vColor = aVertexColor; // Zuweisen der Farbe zur Varying-Variable
}
