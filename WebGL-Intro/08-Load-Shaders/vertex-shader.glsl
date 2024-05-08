attribute vec2 aVertexPosition;
attribute vec3 aColor;

varying vec3 v_Color;

void main ()
{
    gl_Position = vec4 (aVertexPosition, 0.0, 1.0);
    v_Color = aColor;
}
