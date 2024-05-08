attribute vec2 aVertexPosition;
uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main() {
    vec3 transformedPosition = uProjectionMat * uModelMat * vec3(aVertexPosition, 1.0);
    gl_Position = vec4(transformedPosition, 1.0);
}
