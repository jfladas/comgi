attribute vec3 aVertex;
attribute vec3 aColor;

uniform mat4 uModelView;
uniform mat4 uProjection;
varying vec3 vColor;

void main() {
    vec4 v = uModelView * vec4(aVertex, 1.0);
    vec4 w = uProjection * v;
    float z = v[2];
    float zmin = -1.0, zmax = 1.0;
    float cmin = 0.1, cmax = 1.0;
    //vColor = (z - zmin) / (zmax - zmin) * (cmax - cmin) + cmin;
    vColor = aColor;

    gl_Position = w / w[3];
}
