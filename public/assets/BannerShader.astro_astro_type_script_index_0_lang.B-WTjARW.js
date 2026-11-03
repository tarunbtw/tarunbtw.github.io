const L=`#version 300 es
	void main() {
		vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
		gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
	}`,P=`#version 300 es
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
		float ra = uRes.x / uRes.y, ia = uImg.x / uImg.y;
		if (ra > ia) { float s = ia / ra; uv.y = uv.y * s + (1.0 - s) * 0.5; }
		else { float s = ra / ia; uv.x = uv.x * s + (1.0 - s) * 0.5; }
		return uv;
	}
	vec3 sampleRGB(vec2 uv, float ab) {
		return vec3(
			texture(uTex, cover(uv + vec2(ab, 0.0))).r,
			texture(uTex, cover(uv)).g,
			texture(uTex, cover(uv - vec2(ab, 0.0))).b);
	}
	void main() {
		vec2 uv = gl_FragCoord.xy / uRes;
		vec2 cc = uv - 0.5;
		vec2 bu = uv + cc * dot(cc, cc) * 0.06;           // slight tube curvature
		vec2 md = gl_FragCoord.xy - uMouse;                 // ripple out from the cursor
		float dist = length(md);
		float rip = sin(dist / (5.0 * uDpr) - uTime * 7.0) * exp(-dist / (110.0 * uDpr)) * uHover;
		bu += (md / max(dist, 1.0)) * rip * 0.004;
		vec3 col = sampleRGB(bu, 0.0012 + length(cc) * 0.003);
		float y = gl_FragCoord.y / uDpr;
		col *= 0.82 + 0.18 * sin(y * 3.14159);              // scanlines
		float m = mod(gl_FragCoord.x / uDpr, 3.0);          // aperture grille
		col *= vec3(m < 1.0 ? 1.0 : 0.86, (m >= 1.0 && m < 2.0) ? 1.0 : 0.86, m >= 2.0 ? 1.0 : 0.86);
		col *= 1.0 - dot(cc * vec2(1.0, 1.6), cc * vec2(1.0, 1.6)) * 0.9; // vignette
		col *= 0.975 + 0.025 * sin(uTime * 50.0);           // flicker
		col += 0.035 * smoothstep(0.96, 1.0, sin((uv.y * 0.6 + uTime * 0.12) * 6.2832)); // rolling bar
		col = pow(col * 1.08, vec3(0.95)) * vec3(1.03, 1.0, 0.94);
		// outside the curved tube is transparent, so the page shows through the corners
		vec2 edge = smoothstep(vec2(0.0), vec2(0.004), bu) * smoothstep(vec2(0.0), vec2(0.004), 1.0 - bu);
		float a = edge.x * edge.y;
		o = vec4(col * a, a);
	}`;function S(i){const t=i.querySelector("canvas"),e=t.getContext("webgl2",{antialias:!1,premultipliedAlpha:!0});if(!e)return;const b=(r,o)=>{const a=e.createShader(r);if(e.shaderSource(a,o),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(a)||"shader");return a},s=e.createProgram();try{e.attachShader(s,b(e.VERTEX_SHADER,L)),e.attachShader(s,b(e.FRAGMENT_SHADER,P))}catch(r){console.warn(r);return}e.linkProgram(s),e.useProgram(s),e.bindVertexArray(e.createVertexArray());const c=r=>e.getUniformLocation(s,r),D=(r,o,a)=>{const w=e.createTexture();e.activeTexture(e.TEXTURE0+r),e.bindTexture(e.TEXTURE_2D,w),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)};let n=1;const I=()=>{n=Math.min(window.devicePixelRatio||1,2),t.width=Math.round(i.clientWidth*n),t.height=Math.round(i.clientHeight*n),e.viewport(0,0,t.width,t.height),T=!0},x=matchMedia("(hover: none)").matches;let u=-1e4,l=-1e4,v=-1e4,m=-1e4,d=0,g=x?.9:0;t.addEventListener("pointermove",r=>{const o=t.getBoundingClientRect();v=(r.clientX-o.left)*n,m=(o.bottom-r.clientY)*n,d<.01&&(u=v,l=m),g=1}),t.addEventListener("pointerleave",()=>{g=x?.9:0});let R=!1,T=!0,E=0,p=null;const _=matchMedia("(prefers-reduced-motion: reduce)").matches,y=!_,M=performance.now(),A=r=>{if(E=0,!R||!p)return;const o=_?0:(r-M)/1e3;x&&!_&&(v=t.width*(.5+.38*Math.sin(o*.35)),m=t.height*(.5+.3*Math.sin(o*.53))),u+=(v-u)*.18,l+=(m-l)*.18,d+=(g-d)*.12;const a=Math.abs(v-u)+Math.abs(m-l)>.5||Math.abs(g-d)>.003;(T||a||y)&&(e.uniform2f(c("uRes"),t.width,t.height),e.uniform2f(c("uImg"),p.naturalWidth,p.naturalHeight),e.uniform2f(c("uMouse"),u,l),e.uniform1f(c("uHover"),d),e.uniform1f(c("uTime"),o),e.uniform1f(c("uDpr"),n),e.uniform1i(c("uTex"),0),e.drawArrays(e.TRIANGLES,0,3),i.classList.contains("gl-ready")||i.classList.add("gl-ready"),T=!1),(a||y)&&(E=requestAnimationFrame(A))},h=()=>{!E&&R&&(E=requestAnimationFrame(A))};t.addEventListener("pointermove",h),t.addEventListener("pointerleave",h),new ResizeObserver(()=>{I(),h()}).observe(i),new IntersectionObserver(([r])=>{R=r.isIntersecting,h()}).observe(i);const f=new Image;f.decoding="async",f.onload=()=>{p=f,D(0,f,e.LINEAR),T=!0,h()},f.src=i.dataset.src}document.querySelectorAll("[data-banner]").forEach(S);
