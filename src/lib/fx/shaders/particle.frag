precision mediump float;
uniform sampler2D uSprite;
uniform float uOpacity;
varying vec3 vCol;
void main() {
  float a = texture2D(uSprite, gl_PointCoord).a;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vCol * a, a * uOpacity);
}
