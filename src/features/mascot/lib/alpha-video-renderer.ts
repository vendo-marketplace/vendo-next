// Draws a "stacked alpha" video onto a WebGL canvas: each frame holds the picture in its top
// half and a greyscale matte (white = keep) in its bottom half. Browsers have no transparent
// video format that works everywhere, so the matte travels as ordinary video next to the picture.

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// The matte's edges still carry a little of the grey the video was shot on; it is lifted out
// (un-premultiplied against that grey) so fur edges don't look dusty on another background.
const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 uv;
uniform sampler2D frame;
uniform vec3 backdrop;
const vec3 shadowTint = vec3(0.18, 0.29, 0.52);
void main() {
  vec3 color = texture2D(frame, vec2(uv.x, uv.y * 0.5)).rgb;
  float alpha = texture2D(frame, vec2(uv.x, 0.5 + uv.y * 0.5)).r;
  vec3 clean = alpha > 0.004 ? clamp((color - backdrop * (1.0 - alpha)) / alpha, 0.0, 1.0) : vec3(0.0);
  // The floor shadow comes out dark grey; give it the page's cool blue so it sits on the backdrop.
  float shade = 1.0 - smoothstep(0.25, 0.5, dot(clean, vec3(0.299, 0.587, 0.114)));
  clean = mix(clean, shadowTint, shade * (1.0 - smoothstep(0.55, 0.9, alpha)));
  gl_FragColor = vec4(clean * alpha, alpha);
}`;

export type AlphaVideoRenderer = { draw: (video: HTMLVideoElement) => void };

// Returns null when WebGL is unavailable, so the caller can keep showing its still image.
export function createAlphaVideoRenderer(
  canvas: HTMLCanvasElement,
  backdrop: readonly [number, number, number],
): AlphaVideoRenderer | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform3fv(gl.getUniformLocation(program, "backdrop"), backdrop.map((channel) => channel / 255));

  return {
    draw: (video) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}
