import { useEffect, useRef } from 'react'

const VS = `#version 300 es
void main() {
\tvec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
\tgl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FS = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;      // canvas, device px
uniform vec2 uImg;      // image size
uniform vec2 uMouse;    // device px, bottom-left origin
uniform float uHover;   // 0..1, eased
uniform float uTime;
uniform float uDpr;
out vec4 o;

vec2 cover(vec2 uv) {
\tfloat ra = uRes.x / uRes.y, ia = uImg.x / uImg.y;
\tif (ra > ia) { float s = ia / ra; uv.y = uv.y * s + (1.0 - s) * 0.5; }
\telse { float s = ra / ia; uv.x = uv.x * s + (1.0 - s) * 0.5; }
\treturn uv;
}
vec3 sampleRGB(vec2 uv, float ab) {
\treturn vec3(
\t\ttexture(uTex, cover(uv + vec2(ab, 0.0))).r,
\t\ttexture(uTex, cover(uv)).g,
\t\ttexture(uTex, cover(uv - vec2(ab, 0.0))).b);
}
void main() {
\tvec2 uv = gl_FragCoord.xy / uRes;
\tvec2 cc = uv - 0.5;
\tvec2 bu = uv + cc * dot(cc, cc) * 0.06;           // slight tube curvature
\tvec2 md = gl_FragCoord.xy - uMouse;                 // ripple out from the cursor
\tfloat dist = length(md);
\tfloat rip = sin(dist / (5.0 * uDpr) - uTime * 7.0) * exp(-dist / (110.0 * uDpr)) * uHover;
\tbu += (md / max(dist, 1.0)) * rip * 0.004;
\tvec3 col = sampleRGB(bu, 0.0012 + length(cc) * 0.003);
\tfloat y = gl_FragCoord.y / uDpr;
\tcol *= 0.82 + 0.18 * sin(y * 3.14159);              // scanlines
\tfloat m = mod(gl_FragCoord.x / uDpr, 3.0);          // aperture grille
\tcol *= vec3(m < 1.0 ? 1.0 : 0.86, (m >= 1.0 && m < 2.0) ? 1.0 : 0.86, m >= 2.0 ? 1.0 : 0.86);
\tcol *= 1.0 - dot(cc * vec2(1.0, 1.6), cc * vec2(1.0, 1.6)) * 0.9; // vignette
\tcol *= 0.975 + 0.025 * sin(uTime * 50.0);           // flicker
\tcol += 0.035 * smoothstep(0.96, 1.0, sin((uv.y * 0.6 + uTime * 0.12) * 6.2832)); // rolling bar
\tcol = pow(col * 1.08, vec3(0.95)) * vec3(1.03, 1.0, 0.94);
\t// outside the curved tube is transparent, so the page shows through the corners
\tvec2 edge = smoothstep(vec2(0.0), vec2(0.004), bu) * smoothstep(vec2(0.0), vec2(0.004), 1.0 - bu);
\tfloat a = edge.x * edge.y;
\to = vec4(col * a, a);
}`

export function BannerShader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      premultipliedAlpha: true,
    })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('Could not create shader')
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed')
      }
      return shader
    }

    const program = gl.createProgram()
    if (!program) return
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VS))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FS))
      gl.linkProgram(program)
      gl.useProgram(program)
      gl.bindVertexArray(gl.createVertexArray())
    } catch (e) {
      console.warn('WebGL initialization failed', e)
      return
    }

    const getLoc = (name: string) => gl.getUniformLocation(program, name)
    const loadTex = (unit: number, img: TexImageSource, filter: number) => {
      const tex = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    let dpr = 1
    let needsRender = true
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(container.clientWidth * dpr)
      canvas.height = Math.round(container.clientHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      needsRender = true
    }

    const touchDevice = matchMedia('(hover: none)').matches
    let mouseX = -10000,
      mouseY = -10000
    let targetX = -10000,
      targetY = -10000
    let hoverState = 0
    let targetHover = touchDevice ? 0.9 : 0

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetX = (e.clientX - rect.left) * dpr
      targetY = (rect.bottom - e.clientY) * dpr
      if (hoverState < 0.01) {
        mouseX = targetX
        mouseY = targetY
      }
      targetHover = 1
      startLoop()
    }

    const onPointerLeave = () => {
      targetHover = touchDevice ? 0.9 : 0
      startLoop()
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    let isVisible = false
    let animId = 0
    let imageObj: HTMLImageElement | null = null
    const prefersReducedMotion = matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const shouldAnimate = !prefersReducedMotion
    const startTime = performance.now()

    const renderLoop = (timeNow: number) => {
      animId = 0
      if (!isVisible || !imageObj) return

      const timeSec = prefersReducedMotion ? 0 : (timeNow - startTime) / 1000

      if (touchDevice && !prefersReducedMotion) {
        targetX = canvas.width * (0.5 + 0.38 * Math.sin(timeSec * 0.35))
        targetY = canvas.height * (0.5 + 0.3 * Math.sin(timeSec * 0.53))
      }

      mouseX += (targetX - mouseX) * 0.18
      mouseY += (targetY - mouseY) * 0.18
      hoverState += (targetHover - hoverState) * 0.12

      const isChanging =
        Math.abs(targetX - mouseX) + Math.abs(targetY - mouseY) > 0.5 ||
        Math.abs(targetHover - hoverState) > 0.003

      if (needsRender || isChanging || shouldAnimate) {
        gl.uniform2f(getLoc('uRes'), canvas.width, canvas.height)
        gl.uniform2f(
          getLoc('uImg'),
          imageObj.naturalWidth,
          imageObj.naturalHeight
        )
        gl.uniform2f(getLoc('uMouse'), mouseX, mouseY)
        gl.uniform1f(getLoc('uHover'), hoverState)
        gl.uniform1f(getLoc('uTime'), timeSec)
        gl.uniform1f(getLoc('uDpr'), dpr)
        gl.uniform1i(getLoc('uTex'), 0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        if (!container.classList.contains('gl-ready')) {
          container.classList.add('gl-ready')
        }
        needsRender = false
      }

      if (isChanging || shouldAnimate) {
        animId = requestAnimationFrame(renderLoop)
      }
    }

    const startLoop = () => {
      if (!animId && isVisible) {
        animId = requestAnimationFrame(renderLoop)
      }
    }

    const ro = new ResizeObserver(() => {
      resize()
      startLoop()
    })
    ro.observe(container)

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      startLoop()
    })
    io.observe(container)

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      imageObj = img
      loadTex(0, img, gl.LINEAR)
      needsRender = true
      startLoop()
    }
    img.src = '/banner.jpg'

    return () => {
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      ro.disconnect()
      io.disconnect()
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div ref={containerRef} className="banner hero-banner">
      <img
        className="banner-fallback"
        src="/banner.jpg"
        alt="A retro desk: a beige IBM PC, Monkey Island boxes and a boombox"
        width={1500}
        height={500}
        decoding="async"
      />
      <canvas ref={canvasRef} className="banner-gl" aria-hidden="true" />
    </div>
  )
}

