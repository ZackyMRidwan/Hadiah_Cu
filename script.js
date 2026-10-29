/* =========================================================
   KONFIGURASI
   ========================================================= */
   const CONFIG = {
    helloText: 'Hello',
    nameText: 'Suci',
    musicFile: 'music/die-with-a-smile.mp3',
    volume: 0.85,
  };
  
  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const rand = (a, b) => a + Math.random() * (b - a);
  
  /* =========================================================
     HURUF BERCAHAYA DI INTRO
     ========================================================= */
  function splitLetters(el, text, offset = 0) {
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.setProperty('--i', i + offset);
      el.appendChild(s);
    });
  }
  
  splitLetters($('helloA'), CONFIG.helloText, 0);
  splitLetters(
    $('helloB'),
    CONFIG.nameText,
    CONFIG.helloText.length
  );
  
  $('helloA')
    .closest('.hello')
    .setAttribute(
      'aria-label',
      `${CONFIG.helloText} ${CONFIG.nameText}`
    );
  
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      $('helloA').closest('.hello').classList.add('ready')
    )
  );
  
  /* =========================================================
     BINTANG
     ========================================================= */
  (function stars() {
    const wrap = $('stars');
    const n = innerWidth < 600 ? 38 : 70;
    const frag = document.createDocumentFragment();
  
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'star';
      s.style.cssText = `
        left:${rand(0, 100)}%;
        top:${rand(0, 100)}%;
        --sz:${rand(1.5, 3.5).toFixed(1)}px;
        --d:${rand(2.5, 6).toFixed(1)}s;
        --dl:${rand(0, 6).toFixed(1)}s;
      `;
      frag.appendChild(s);
    }
  
    wrap.appendChild(frag);
  })();
  
  /* =========================================================
     MEMBUAT BUNGA (SVG)
     ========================================================= */
  const SVGNS = 'http://www.w3.org/2000/svg';
  
  function petalPath(L, W) {
    return `M0 0C${-W} ${-L * 0.25} ${-W * 0.95} ${-L * 0.88} 0 ${-L}C${W * 0.95} ${-L * 0.88} ${W} ${-L * 0.25} 0 0Z`;
  }
  
  function buildHead(grad) {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '-50 -50 100 100');
  
    const rings = [
      { n: 8, L: 48, W: 17, off: 0, fill: `url(#${grad})` },
      { n: 8, L: 40, W: 15, off: 22.5, fill: `url(#${grad})` },
      { n: 6, L: 29, W: 12, off: 10, fill: 'url(#pgIn)' },
      { n: 5, L: 18, W: 8, off: 36, fill: 'url(#pg3)' },
    ];
  
    let k = 0;
  
    rings.forEach((r) => {
      for (let i = 0; i < r.n; i++) {
        const g = document.createElementNS(SVGNS, 'g');
        g.setAttribute(
          'transform',
          `rotate(${r.off + (360 / r.n) * i})`
        );
  
        const p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', petalPath(r.L, r.W));
        p.setAttribute('fill', r.fill);
        p.setAttribute('stroke', 'rgba(255,255,255,.28)');
        p.setAttribute('stroke-width', '.5');
        p.setAttribute('class', 'petal');
        p.style.setProperty('--k', k++ * 0.6);
  
        g.appendChild(p);
        svg.appendChild(g);
      }
    });
  
    const core = document.createElementNS(SVGNS, 'g');
    core.setAttribute('class', 'core');
  
    const c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('r', 7);
    c.setAttribute('fill', 'url(#pgCore)');
    core.appendChild(c);
  
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const d = document.createElementNS(SVGNS, 'circle');
  
      d.setAttribute('cx', Math.cos(a) * 11);
      d.setAttribute('cy', Math.sin(a) * 11);
      d.setAttribute('r', 1.5);
      d.setAttribute('fill', '#fff0f6');
  
      core.appendChild(d);
    }
  
    svg.appendChild(core);
    return svg;
  }
  
  const FLOWERS = [
    { x: 50, h: 58, s: 36, sw: 5.2, t0: 0, g: 'pg2' },
    { x: 27, h: 46, s: 29, sw: 6, t0: 0.5, g: 'pg1' },
    { x: 73, h: 47, s: 30, sw: 5.6, t0: 0.8, g: 'pg3' },
    { x: 10, h: 33, s: 22, sw: 6.4, t0: 1.2, g: 'pg2' },
    { x: 90, h: 34, s: 23, sw: 5.9, t0: 1.5, g: 'pg1' },
    { x: 38, h: 30, s: 20, sw: 4.8, t0: 1.9, g: 'pg3' },
    { x: 62, h: 28, s: 19, sw: 5.1, t0: 2.2, g: 'pg2' },
  ];
  
  (function garden() {
    const wrap = $('garden');
  
    FLOWERS.forEach((f) => {
      const el = document.createElement('div');
      el.className = 'flower';
  
      el.style.cssText = `
        --x:${f.x}%;
        --h:${f.h}vh;
        --s:calc(var(--u)*${f.s});
        --w:calc(var(--u)*${f.s * 0.55});
        --sw:${f.sw}s;
        --t0:${f.t0}s;
        --gd:${(1.6 + f.h / 60).toFixed(2)}s;
      `;
  
      const stem = document.createElementNS(SVGNS, 'svg');
      stem.setAttribute('class', 'stem');
      stem.setAttribute('viewBox', '0 0 100 100');
      stem.setAttribute('preserveAspectRatio', 'none');
  
      const path = document.createElementNS(SVGNS, 'path');
      const bend = (Math.random() > 0.5 ? 1 : -1) * rand(5, 10);
  
      path.setAttribute(
        'd',
        `M50 100C${50 + bend} 70 ${50 - bend} 38 50 0`
      );
      path.setAttribute('pathLength', '1');
  
      stem.appendChild(path);
      el.appendChild(stem);
  
      [[0.22, 'r', 30], [0.38, 'l', 30], [0.56, 'r', 24]]
        .forEach(([p, side, r]) => {
          const l = document.createElement('i');
          l.className = 'leaf' + (side === 'l' ? ' l' : '');
          l.style.cssText = `
            top:${(1 - p) * 100}%;
            --p:${p};
            --r:${side === 'l' ? r : -r}deg;
          `;
          el.appendChild(l);
        });
  
      const head = document.createElement('div');
      head.className = 'head';
      head.appendChild(buildHead(f.g));
      el.appendChild(head);
  
      wrap.appendChild(el);
    });
  })();
  
  /* =========================================================
     KELOPAK JATUH (CANVAS)
     ========================================================= */
  const canvas = $('petals');
  const ctx = canvas.getContext('2d');
  
  let W = 0;
  let H = 0;
  let DPR = 1;
  
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
  
    canvas.width = W * DPR;
    canvas.height = H * DPR;
  
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  
  resize();
  addEventListener('resize', resize);
  
  const COLORS = [
    '#ffc7dd', '#ffa6cb', '#ff86b8',
    '#ffb8d3', '#ff6aa6', '#ffd9e8',
  ];
  
  const petals = [];
  let target = innerWidth < 600 ? 14 : 22;
  const MAX = innerWidth < 600 ? 55 : 100;
  
  function spawn(x, y, burst) {
    const size = rand(8, 17) * (W < 600 ? 0.85 : 1.1);
  
    petals.push({
      x: x ?? rand(-20, W + 20),
      y: y ?? rand(-40, -10),
      s: size,
      vy: burst ? rand(-90, 60) : rand(28, 70),
      vx: burst ? rand(-120, 120) : rand(-12, 12),
      sway: rand(14, 38),
      freq: rand(0.7, 1.6),
      ph: rand(0, 6.28),
      rot: rand(0, 6.28),
      vr: rand(-1.4, 1.4),
      ft: rand(1.2, 2.6),
      fp: rand(0, 6.28),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      a: rand(0.75, 1),
      t: 0,
      burst,
    });
  }
  
  function drawPetal(p) {
    const s = p.s;
  
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.cos(p.t * p.ft + p.fp));
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.color;
  
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.75, s * 0.75, s * 0.6, 0, s);
    ctx.bezierCurveTo(-s * 0.75, s * 0.6, -s * 0.95, -s * 0.75, 0, -s);
    ctx.fill();
  
    ctx.globalAlpha = p.a * 0.35;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-s * 0.15, -s * 0.25, s * 0.18, s * 0.45, 0.3, 0, 6.283);
    ctx.fill();
  
    ctx.restore();
  }
  
  let last = performance.now();
  
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
  
    ctx.clearRect(0, 0, W, H);
  
    if (petals.length < target && Math.random() < dt * target * 0.35) {
      spawn();
    }
  
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.t += dt;
  
      if (p.burst) {
        p.vy += 110 * dt;
        p.vx *= 1 - dt * 0.9;
  
        if (p.vy > 70) {
          p.vy = rand(35, 70);
          p.burst = false;
        }
      }
  
      p.x += (p.vx + Math.sin(p.t * p.freq + p.ph) * p.sway) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
  
      if (p.y > H + 30 || p.x < -60 || p.x > W + 60) {
        petals.splice(i, 1);
        continue;
      }
  
      drawPetal(p);
    }
  
    requestAnimationFrame(frame);
  }
  
  requestAnimationFrame(frame);
  
  /* =========================================================
     MUSIK BACKGROUND
     ========================================================= */
  const bgm = $('bgm');
  const soundBtn = $('soundBtn');
  
  let muted = false;
  let useFallback = false;
  let fx = null;
  let started = false;
  let musicStarting = false;
  let fadeFrame = null;
  
  bgm.src = CONFIG.musicFile;
  bgm.loop = true;
  bgm.preload = 'auto';
  bgm.volume = 0;
  
  function fadeTo(volume, duration = 2500) {
    if (fadeFrame !== null) {
      cancelAnimationFrame(fadeFrame);
    }
  
    const from = bgm.volume;
    const start = performance.now();
  
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      bgm.volume = from + (volume - from) * progress;
  
      if (progress < 1) {
        fadeFrame = requestAnimationFrame(step);
      } else {
        fadeFrame = null;
      }
    }
  
    fadeFrame = requestAnimationFrame(step);
  }
  
  /* Musik cadangan jika file MP3 gagal */
  function startFallback() {
    if (fx) {
      fx.ac.resume().catch((err) => {
        console.error('AudioContext gagal aktif:', err);
      });
      return;
    }
  
    const AC = window.AudioContext || window.webkitAudioContext;
  
    if (!AC) {
      console.error('Browser tidak mendukung Web Audio API.');
      return;
    }
  
    try {
      const ac = new AC();
      const master = ac.createGain();
  
      master.gain.value = muted ? 0 : 0.5;
      master.connect(ac.destination);
  
      const chords = [
        [220, 261.6, 329.6],
        [174.6, 220, 261.6],
        [261.6, 329.6, 392],
        [196, 246.9, 293.7],
      ];
  
      const melody = [
        659.3, 587.3, 523.3, 587.3,
        659.3, 784, 659.3, 523.3,
      ];
  
      let step = 0;
      let next = ac.currentTime + 0.1;
  
      function note(freq, time, duration, type, volume) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
  
        osc.type = type;
        osc.frequency.value = freq;
  
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          time + duration
        );
  
        osc.connect(gain);
        gain.connect(master);
  
        osc.start(time);
        osc.stop(time + duration + 0.05);
      }
  
      const timer = setInterval(() => {
        while (next < ac.currentTime + 0.6) {
          const bar = Math.floor(step / 8) % chords.length;
  
          if (step % 8 === 0) {
            chords[bar].forEach((freq) => {
              note(freq / 2, next, 3.6, 'sine', 0.09);
            });
          }
  
          note(
            melody[step % 8] * (bar % 2 ? 0.75 : 1),
            next,
            1.1,
            'triangle',
            0.07
          );
  
          next += 0.55;
          step++;
        }
      }, 150);
  
      fx = { ac, master, timer };
  
      ac.resume().catch((err) => {
        console.error('Musik cadangan gagal aktif:', err);
      });
    } catch (err) {
      console.error('Gagal membuat musik cadangan:', err);
    }
  }
  
  function setMuted(value) {
    muted = value;
  
    soundBtn.textContent = muted ? '🔇' : '🔊';
    soundBtn.setAttribute(
      'aria-label',
      muted ? 'Nyalakan musik' : 'Matikan musik'
    );
  
    bgm.muted = muted;
  
    if (fx) {
      fx.master.gain.value = muted ? 0 : 0.5;
    }
  
    if (muted) {
      if (fadeFrame !== null) {
        cancelAnimationFrame(fadeFrame);
        fadeFrame = null;
      }
      bgm.volume = 0;
    } else if (started && !useFallback && bgm.paused) {
      startMusic();
    } else if (!muted && !useFallback) {
      fadeTo(CONFIG.volume);
    }
  
    if (!muted && fx) {
      fx.ac.resume().catch(console.error);
    }
  }
  
  async function startMusic() {
    if (musicStarting || muted) return;
  
    musicStarting = true;
    useFallback = false;
  
    if (fadeFrame !== null) {
      cancelAnimationFrame(fadeFrame);
      fadeFrame = null;
    }
  
    bgm.muted = false;
    bgm.volume = 0;
  
    try {
      await bgm.play();
  
      musicStarting = false;
      fadeTo(CONFIG.volume);
    } catch (err) {
      musicStarting = false;
  
      console.error('MP3 gagal diputar:', err);
  
      useFallback = true;
      startFallback();
    }
  }
  
  /* Jika MP3 gagal dimuat, gunakan musik cadangan */
  bgm.addEventListener('error', () => {
    if (started && !useFallback) {
      console.error(
        'File MP3 tidak dapat dimuat. Periksa lokasi file:',
        bgm.currentSrc
      );
  
      useFallback = true;
      startFallback();
    }
  });
  
  /* Jika audio berhenti karena error ketika sedang diputar */
  bgm.addEventListener('stalled', () => {
    console.warn('Pemuatan audio terhenti.');
  });
  
  /* Tombol musik */
  soundBtn.addEventListener('click', () => {
    setMuted(!muted);
  });
  
  /* Tangani perpindahan tab atau aplikasi */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      bgm.pause();
  
      if (fx) {
        fx.ac.suspend().catch(console.error);
      }
    } else if (started && !muted) {
      if (useFallback && fx) {
        fx.ac.resume().catch(console.error);
      } else if (!useFallback) {
        startMusic();
      }
    }
  });
  
  /* =========================================================
     TOMBOL BUKA HADIAH
     ========================================================= */
  $('openBtn').addEventListener('click', () => {
    if (started) return;
  
    started = true;
  
    soundBtn.hidden = false;
    setMuted(false);
  
    /* Memulai audio langsung dari interaksi pengguna */
    startMusic();
  
    $('intro').classList.add('out');
    body.classList.add('go');
  
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  
    /* Semburan kelopak pertama */
    for (let i = 0; i < (W < 600 ? 28 : 45); i++) {
      spawn(rand(0, W), rand(-60, H * 0.35), true);
    }
  
    setTimeout(() => {
      target = MAX * 0.55;
    }, 2200);
  
    setTimeout(() => {
      target = MAX;
      $('message').classList.add('show');
    }, 5200);
  });
  
  /* =========================================================
     SENTUH LAYAR UNTUK MENEBAR KELOPAK
     ========================================================= */
  addEventListener('pointerdown', (e) => {
    if (!started || e.target.closest('button')) return;
  
    for (let i = 0; i < 8; i++) {
      spawn(
        e.clientX + rand(-10, 10),
        e.clientY + rand(-10, 10),
        true
      );
    }
  
    if (petals.length > MAX + 40) {
      petals.splice(0, petals.length - MAX - 40);
    }
  });