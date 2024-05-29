precision mediump float;

varying vec3 vColor;
varying vec2 vTexture;
uniform sampler2D uSampler;
uniform bool uShowTexture;

void main() {
        gl_FragColor = texture2D(uSampler, vTexture);
}
