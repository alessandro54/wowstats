attribute vec3 aPos;
attribute vec3 aCol;
attribute float aSize;
uniform vec2 uViewport;
uniform vec2 uCamOff;
uniform vec2 uRot;
varying vec3 vCol;
void main() {
  vCol = aCol;
  float x = aPos.x + uCamOff.x;
  float y = aPos.y + uCamOff.y;
  float z = aPos.z;
  // Rotate around Y then X (small angles, approximate)
  float rx = x - uRot.x * z;
  float ry = y + uRot.y * z;
  float rz = z + uRot.x * x - uRot.y * y;
  // Simple perspective: fov=60, camera at z=100
  float depth = 100.0 - rz;
  float scale = 1.7321 / depth;
  gl_Position = vec4(
    rx * scale / (uViewport.x / uViewport.y),
    ry * scale,
    0.0, 1.0
  );
  gl_PointSize = max(aSize * uViewport.y * scale * 0.5, 0.0);
}
