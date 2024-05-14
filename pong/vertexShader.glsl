attribute vec2 aPosition;
uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main() {
    // Berechnung der Modelview-Matrix
    mat3 modelViewMat = uProjectionMat * uModelMat;

    // Transformiere die Position des Quadrats
    vec3 position = vec3(aPosition, 1.0);
    vec3 transformedPosition = modelViewMat * position;

    // Setze die WebGL Position
    gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);
}
