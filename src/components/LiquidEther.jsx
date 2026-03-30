import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}) {
  const mountRef = useRef(null);
  const webglRef = useRef(null);
  const rafRef = useRef(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops) {
      let arr = (Array.isArray(stops) && stops.length > 0) ? (stops.length === 1 ? [stops[0], stops[0]] : stops) : ['#ffffff', '#ffffff'];
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    const face_vert = `attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 uv;precision highp float;void main(){vec3 pos=position;vec2 scale=1.0-boundarySpace*2.0;pos.xy=pos.xy*scale;uv=vec2(0.5)+(pos.xy)*0.5;gl_Position=vec4(pos,1.0);}`;
    const line_vert = `attribute vec3 position;uniform vec2 px;precision highp float;varying vec2 uv;void main(){vec3 pos=position;uv=0.5+pos.xy*0.5;vec2 n=sign(pos.xy);pos.xy=abs(pos.xy)-px*1.0;pos.xy*=n;gl_Position=vec4(pos,1.0);}`;
    const mouse_vert = `precision highp float;attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(pos,0.0,1.0);}`;
    const advection_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform bool isBFECC;uniform vec2 fboSize;uniform vec2 px;varying vec2 uv;void main(){vec2 ratio=max(fboSize.x,fboSize.y)/fboSize;if(isBFECC==false){vec2 vel=texture2D(velocity,uv).xy;vec2 uv2=uv-vel*dt*ratio;vec2 nv=texture2D(velocity,uv2).xy;gl_FragColor=vec4(nv,0.0,0.0);}else{vec2 sn=uv;vec2 vo=texture2D(velocity,uv).xy;vec2 so=sn-vo*dt*ratio;vec2 vn1=texture2D(velocity,so).xy;vec2 sn2=so+vn1*dt*ratio;vec2 err=sn2-sn;vec2 sn3=sn-err/2.0;vec2 v2=texture2D(velocity,sn3).xy;vec2 so2=sn3-v2*dt*ratio;vec2 nv2=texture2D(velocity,so2).xy;gl_FragColor=vec4(nv2,0.0,0.0);}}`;
    const color_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;uniform vec4 bgColor;varying vec2 uv;void main(){vec2 vel=texture2D(velocity,uv).xy;float lenv=clamp(length(vel),0.0,1.0);vec3 c=texture2D(palette,vec2(lenv,0.5)).rgb;vec3 outRGB=mix(bgColor.rgb,c,lenv);float outA=mix(bgColor.a,1.0,lenv);gl_FragColor=vec4(outRGB,outA);}`;
    const divergence_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0=texture2D(velocity,uv-vec2(px.x,0.0)).x;float x1=texture2D(velocity,uv+vec2(px.x,0.0)).x;float y0=texture2D(velocity,uv-vec2(0.0,px.y)).y;float y1=texture2D(velocity,uv+vec2(0.0,px.y)).y;float d=(x1-x0+y1-y0)/2.0;gl_FragColor=vec4(d/dt);}`;
    const externalForce_frag = `precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 circle=(vUv-0.5)*2.0;float d=1.0-min(length(circle),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`;
    const poisson_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x*2.0,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x*2.0,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y*2.0)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y*2.0)).r;float div=texture2D(divergence,uv).r;float nP=(p0+p1+p2+p3)/4.0-div;gl_FragColor=vec4(nP);}`;
    const pressure_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float s=1.0;float p0=texture2D(pressure,uv+vec2(px.x*s,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x*s,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y*s)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y*s)).r;vec2 v=texture2D(velocity,uv).xy;vec2 gP=vec2(p0-p1,p2-p3)*0.5;v=v-gP*dt;gl_FragColor=vec4(v,0.0,1.0);}`;
    const viscous_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 old=texture2D(velocity,uv).xy;vec2 n0=texture2D(velocity_new,uv+vec2(px.x*2.0,0.0)).xy;vec2 n1=texture2D(velocity_new,uv-vec2(px.x*2.0,0.0)).xy;vec2 n2=texture2D(velocity_new,uv+vec2(0.0,px.y*2.0)).xy;vec2 n3=texture2D(velocity_new,uv-vec2(0.0,px.y*2.0)).xy;vec2 nv=4.0*old+v*dt*(n0+n1+n2+n3);nv/=4.0*(1.0+v*dt);gl_FragColor=vec4(nv,0.0,0.0);}`;

    // --- Minimal fluid simulation classes ---
    let Common_width = 0, Common_height = 0, Common_renderer = null, Common_clock = null;

    function commonInit(container) {
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      Common_width = Math.max(1, Math.floor(rect.width));
      Common_height = Math.max(1, Math.floor(rect.height));
      Common_renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      Common_renderer.autoClear = false;
      Common_renderer.setClearColor(0x000000, 0);
      Common_renderer.setPixelRatio(pr);
      Common_renderer.setSize(Common_width, Common_height);
      Common_renderer.domElement.style.width = '100%';
      Common_renderer.domElement.style.height = '100%';
      Common_renderer.domElement.style.display = 'block';
      Common_clock = new THREE.Clock();
      Common_clock.start();
    }

    function commonResize(container) {
      const rect = container.getBoundingClientRect();
      Common_width = Math.max(1, Math.floor(rect.width));
      Common_height = Math.max(1, Math.floor(rect.height));
      if (Common_renderer) Common_renderer.setSize(Common_width, Common_height, false);
    }

    // Mouse state
    let mouseCoords = new THREE.Vector2();
    let mouseCoords_old = new THREE.Vector2();
    let mouseDiff = new THREE.Vector2();
    let mouseMoved = false;
    let mouseTimer = null;
    let isHoverInside = false;
    let hasUserControl = false;
    let isAutoActive = false;
    let autoIntensityVal = autoIntensity;
    let takeoverActiveVal = false;
    let takeoverStartTimeVal = 0;
    let takeoverFromVal = new THREE.Vector2();
    let takeoverToVal = new THREE.Vector2();

    function setMouseCoords(x, y, container) {
      if (mouseTimer) clearTimeout(mouseTimer);
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (x - rect.left) / rect.width;
      const ny = (y - rect.top) / rect.height;
      mouseCoords.set(nx * 2 - 1, -(ny * 2 - 1));
      mouseMoved = true;
      mouseTimer = setTimeout(() => { mouseMoved = false; }, 100);
    }

    function isPointInside(cx, cy, container) {
      const rect = container.getBoundingClientRect();
      return cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
    }

    let lastUserInteraction = performance.now();

    // Auto driver
    let autoActive = false;
    let autoCurrent = new THREE.Vector2(0, 0);
    let autoTarget = new THREE.Vector2();
    let autoLastTime = performance.now();
    let autoActivationTime = 0;
    const autoMargin = 0.2;
    const autoRampMs = autoRampDuration * 1000;

    function pickAutoTarget() {
      autoTarget.set((Math.random() * 2 - 1) * (1 - autoMargin), (Math.random() * 2 - 1) * (1 - autoMargin));
    }
    pickAutoTarget();

    function updateAutoDriver() {
      if (!autoDemo) return;
      const now = performance.now();
      if (now - lastUserInteraction < autoResumeDelay) {
        if (autoActive) { autoActive = false; isAutoActive = false; }
        return;
      }
      if (isHoverInside) {
        if (autoActive) { autoActive = false; isAutoActive = false; }
        return;
      }
      if (!autoActive) {
        autoActive = true;
        autoCurrent.copy(mouseCoords);
        autoLastTime = now;
        autoActivationTime = now;
      }
      isAutoActive = true;
      let dtSec = (now - autoLastTime) / 1000;
      autoLastTime = now;
      if (dtSec > 0.2) dtSec = 0.016;
      const dir = new THREE.Vector2().subVectors(autoTarget, autoCurrent);
      const dist = dir.length();
      if (dist < 0.01) { pickAutoTarget(); return; }
      dir.normalize();
      let ramp = 1;
      if (autoRampMs > 0) {
        const t = Math.min(1, (now - autoActivationTime) / autoRampMs);
        ramp = t * t * (3 - 2 * t);
      }
      const move = Math.min(autoSpeed * dtSec * ramp, dist);
      autoCurrent.addScaledVector(dir, move);
      mouseCoords.set(autoCurrent.x, autoCurrent.y);
      mouseMoved = true;
    }

    function updateMouse() {
      if (takeoverActiveVal) {
        const t = (performance.now() - takeoverStartTimeVal) / (takeoverDuration * 1000);
        if (t >= 1) {
          takeoverActiveVal = false;
          mouseCoords.copy(takeoverToVal);
          mouseCoords_old.copy(mouseCoords);
          mouseDiff.set(0, 0);
        } else {
          const k = t * t * (3 - 2 * t);
          mouseCoords.copy(takeoverFromVal).lerp(takeoverToVal, k);
        }
      }
      mouseDiff.subVectors(mouseCoords, mouseCoords_old);
      mouseCoords_old.copy(mouseCoords);
      if (mouseCoords_old.x === 0 && mouseCoords_old.y === 0) mouseDiff.set(0, 0);
      if (isAutoActive && !takeoverActiveVal) mouseDiff.multiplyScalar(autoIntensityVal);
    }

    // Shader pass helper
    function createShaderPass(opts) {
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      if (opts.material) {
        const mat = new THREE.RawShaderMaterial(opts.material);
        const geo = new THREE.PlaneGeometry(2, 2);
        scene.add(new THREE.Mesh(geo, mat));
        return { scene, camera, material: mat, uniforms: mat.uniforms, output: opts.output };
      }
      return { scene, camera, output: opts.output };
    }

    function renderPass(pass) {
      Common_renderer.setRenderTarget(pass.output || null);
      Common_renderer.render(pass.scene, pass.camera);
      Common_renderer.setRenderTarget(null);
    }

    // Init
    const container = mountRef.current;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = 'hidden';
    commonInit(container);
    container.prepend(Common_renderer.domElement);

    // FBO setup
    const res = resolution;
    const fboW = Math.max(1, Math.round(res * Common_width));
    const fboH = Math.max(1, Math.round(res * Common_height));
    const cellScale = new THREE.Vector2(1 / fboW, 1 / fboH);
    const fboSize = new THREE.Vector2(fboW, fboH);
    const boundarySpace = new THREE.Vector2();

    function getFloatType() {
      return /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
    }

    function makeFBO() {
      return new THREE.WebGLRenderTarget(fboW, fboH, {
        type: getFloatType(), depthBuffer: false, stencilBuffer: false,
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping
      });
    }

    const fbos = {
      vel_0: makeFBO(), vel_1: makeFBO(),
      vel_viscous0: makeFBO(), vel_viscous1: makeFBO(),
      div: makeFBO(),
      pressure_0: makeFBO(), pressure_1: makeFBO()
    };

    // Advection
    const advectionPass = createShaderPass({
      material: {
        vertexShader: face_vert, fragmentShader: advection_frag,
        uniforms: {
          boundarySpace: { value: cellScale }, px: { value: cellScale }, fboSize: { value: fboSize },
          velocity: { value: fbos.vel_0.texture }, dt: { value: dt }, isBFECC: { value: true }
        }
      },
      output: fbos.vel_1
    });

    // Boundary lines for advection
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]), 3));
    const bMat = new THREE.RawShaderMaterial({ vertexShader: line_vert, fragmentShader: advection_frag, uniforms: advectionPass.uniforms });
    const bLine = new THREE.LineSegments(bGeo, bMat);
    bLine.visible = isBounce;
    advectionPass.scene.add(bLine);

    // External force (mouse)
    const forceScene = new THREE.Scene();
    const forceCamera = new THREE.Camera();
    const mouseGeo = new THREE.PlaneGeometry(1, 1);
    const mouseMat = new THREE.RawShaderMaterial({
      vertexShader: mouse_vert, fragmentShader: externalForce_frag,
      blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: {
        px: { value: cellScale },
        force: { value: new THREE.Vector2(0, 0) },
        center: { value: new THREE.Vector2(0, 0) },
        scale: { value: new THREE.Vector2(cursorSize, cursorSize) }
      }
    });
    forceScene.add(new THREE.Mesh(mouseGeo, mouseMat));

    // Viscous
    const viscousPass = createShaderPass({
      material: {
        vertexShader: face_vert, fragmentShader: viscous_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          velocity: { value: fbos.vel_1.texture },
          velocity_new: { value: fbos.vel_viscous0.texture },
          v: { value: viscous }, px: { value: cellScale }, dt: { value: dt }
        }
      },
      output: fbos.vel_viscous1
    });

    // Divergence
    const divPass = createShaderPass({
      material: {
        vertexShader: face_vert, fragmentShader: divergence_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          velocity: { value: fbos.vel_viscous0.texture },
          px: { value: cellScale }, dt: { value: dt }
        }
      },
      output: fbos.div
    });

    // Poisson
    const poissonPass = createShaderPass({
      material: {
        vertexShader: face_vert, fragmentShader: poisson_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          pressure: { value: fbos.pressure_0.texture },
          divergence: { value: fbos.div.texture },
          px: { value: cellScale }
        }
      },
      output: fbos.pressure_1
    });

    // Pressure
    const pressurePass = createShaderPass({
      material: {
        vertexShader: face_vert, fragmentShader: pressure_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          pressure: { value: fbos.pressure_0.texture },
          velocity: { value: fbos.vel_viscous0.texture },
          px: { value: cellScale }, dt: { value: dt }
        }
      },
      output: fbos.vel_0
    });

    // Color output
    const outputScene = new THREE.Scene();
    const outputCamera = new THREE.Camera();
    const outputMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        vertexShader: face_vert, fragmentShader: color_frag,
        transparent: true, depthWrite: false,
        uniforms: {
          velocity: { value: fbos.vel_0.texture },
          boundarySpace: { value: new THREE.Vector2() },
          palette: { value: paletteTex },
          bgColor: { value: bgVec4 }
        }
      })
    );
    outputScene.add(outputMesh);

    // Event handlers
    function onMouseMove(e) {
      if (!isPointInside(e.clientX, e.clientY, container)) { isHoverInside = false; return; }
      isHoverInside = true;
      lastUserInteraction = performance.now();
      if (autoActive) { autoActive = false; isAutoActive = false; }

      if (isAutoActive && !hasUserControl && !takeoverActiveVal) {
        const rect = container.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        takeoverFromVal.copy(mouseCoords);
        takeoverToVal.set(nx * 2 - 1, -(ny * 2 - 1));
        takeoverStartTimeVal = performance.now();
        takeoverActiveVal = true;
        hasUserControl = true;
        isAutoActive = false;
        return;
      }
      setMouseCoords(e.clientX, e.clientY, container);
      hasUserControl = true;
    }

    function onMouseLeave() { isHoverInside = false; }

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    let running = true;

    function loop() {
      if (!running) return;

      updateAutoDriver();
      updateMouse();

      // Advection
      advectionPass.uniforms.dt.value = dt;
      advectionPass.uniforms.isBFECC.value = BFECC;
      bLine.visible = isBounce;
      renderPass(advectionPass);

      // External force
      const fx = (mouseDiff.x / 2) * mouseForce;
      const fy = (mouseDiff.y / 2) * mouseForce;
      const csX = cursorSize * cellScale.x;
      const csY = cursorSize * cellScale.y;
      mouseMat.uniforms.force.value.set(fx, fy);
      mouseMat.uniforms.center.value.set(
        Math.min(Math.max(mouseCoords.x, -1 + csX + cellScale.x * 2), 1 - csX - cellScale.x * 2),
        Math.min(Math.max(mouseCoords.y, -1 + csY + cellScale.y * 2), 1 - csY - cellScale.y * 2)
      );
      mouseMat.uniforms.scale.value.set(cursorSize, cursorSize);
      Common_renderer.setRenderTarget(fbos.vel_1);
      Common_renderer.render(forceScene, forceCamera);
      Common_renderer.setRenderTarget(null);

      // Viscous
      let vel = fbos.vel_1;
      if (isViscous) {
        viscousPass.uniforms.v.value = viscous;
        let fin, fout;
        for (let i = 0; i < iterationsViscous; i++) {
          fin = i % 2 === 0 ? fbos.vel_viscous0 : fbos.vel_viscous1;
          fout = i % 2 === 0 ? fbos.vel_viscous1 : fbos.vel_viscous0;
          viscousPass.uniforms.velocity_new.value = fin.texture;
          viscousPass.output = fout;
          renderPass(viscousPass);
        }
        vel = fout;
      }

      // Divergence
      divPass.uniforms.velocity.value = vel.texture;
      renderPass(divPass);

      // Poisson
      let pOut;
      for (let i = 0; i < iterationsPoisson; i++) {
        const pIn = i % 2 === 0 ? fbos.pressure_0 : fbos.pressure_1;
        pOut = i % 2 === 0 ? fbos.pressure_1 : fbos.pressure_0;
        poissonPass.uniforms.pressure.value = pIn.texture;
        poissonPass.output = pOut;
        renderPass(poissonPass);
      }

      // Pressure
      pressurePass.uniforms.velocity.value = vel.texture;
      pressurePass.uniforms.pressure.value = pOut.texture;
      renderPass(pressurePass);

      // Output
      Common_renderer.setRenderTarget(null);
      Common_renderer.render(outputScene, outputCamera);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    // Resize
    function onResize() {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        commonResize(container);
      });
    }
    window.addEventListener('resize', onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      ro.disconnect();
      if (Common_renderer) {
        const canvas = Common_renderer.domElement;
        if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
        Common_renderer.dispose();
        Common_renderer.forceContextLoss();
      }
    };
  }, [colors, mouseForce, cursorSize, isViscous, viscous, iterationsViscous, iterationsPoisson, dt, BFECC, resolution, isBounce, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        ...style,
      }}
    />
  );
}
