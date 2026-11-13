import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const icons = {
  fall: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 3.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM9.5 7l-2 5 3 2-2 5M11 8l3 3 3-1M7 21l3-5M17 14l3 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  health: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12h4l2-5 4 11 2-6h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 21S4 16.5 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5c0 7-8 11.5-8 11.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  daily: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 11h12a6 6 0 0 1-12 0ZM4 21h14M8 7c0-1 1-1.5 1-2.5S8 3 8 3M12 7c0-1 1-1.5 1-2.5S12 3 12 3M19 12h1a2 2 0 0 1 0 4h-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

const scenarios = [
  {
    id: 'fall', title: '老人跌倒处理', short: '跌倒处理', subtitle: '风险识别与应急响应', color: '#d88858', icon: icons.fall,
    resident: '陈奶奶 · AI 虚拟老人',
    steps: ['观察环境', '接近与沟通', '评估伤情', '规范处置', '监测与安抚', 'AI 训练报告'],
    durations: [6, 6, 7, 7, 6, 8],
    scores: [92, 88, 95, 86],
    coach: [
      ['先观察，再行动', '注意老人姿态、周围障碍物与可呼叫的支援。高风险护理情境中，规范判断比迅速搬动更重要。', '识别风险，确保现场安全'],
      ['先建立沟通，再接近', '从老人视线前方接近，自我介绍并询问：“陈奶奶，您听得见吗？哪里不舒服？”避免突然接触造成紧张。', '确认意识，给予情绪安全感'],
      ['评估伤情，不急于扶起', '观察出血、疼痛与肢体变形，询问跌倒经过。若怀疑骨折或头部受伤，不应贸然搬动老人。', '完成初步伤情判断'],
      ['呼叫支援，采取规范处置', '通知专业医护人员，并根据评估结果采取相应措施。演示中的操作仅用于流程训练，不替代临床规范。', '选择安全的处置与求助路径'],
      ['持续观察，也要持续安抚', '等待支援期间监测意识与呼吸，用清晰、平稳的语言解释每一步，减轻老人的不安。', '兼顾身体监测与心理关怀'],
      ['从过程记录走向能力成长', '系统依据情景互动与操作记录生成能力画像，帮助学员识别薄弱环节，并推荐下一轮针对性训练。', '理解反馈，形成持续学习计划']
    ],
    feedback: '你的现场安全意识与沟通表现良好。下一步可重点练习“疑似骨折时的处置选择”，在模拟分支中比较不同操作的后果。',
    recommendation: '进阶情景：疑似髋部骨折的应急处理'
  },
  {
    id: 'health', title: '突发健康状况', short: '突发健康状况', subtitle: '异常识别与协同求助', color: '#c66f72', icon: icons.health,
    resident: '陈奶奶 · AI 虚拟老人',
    steps: ['发现异常', '询问与评估', '呼叫支援', '持续监测', '记录与交接', 'AI 训练报告'],
    durations: [6, 7, 6, 7, 6, 8],
    scores: [90, 84, 93, 88],
    coach: [
      ['识别“和平时不一样”', '陈奶奶出现胸闷与不适。注意表情、姿态、皮肤状态和言语变化，及时识别异常信号。', '发现异常，启动应急意识'],
      ['用开放式问题快速评估', '询问不适出现的时间、部位与程度，保持老人安静。不要根据单一症状自行下诊断。', '收集关键信息，避免过早判断'],
      ['清楚表达，及时呼叫支援', '联系专业医护人员，清楚说明对象、地点、主要表现和已采取措施，并确认支援已收到信息。', '完成结构化求助与团队协同'],
      ['监测变化，准备必要信息', '持续关注意识和呼吸变化，在能力范围内使用智能监测设备，并留意设备数据的可能误差。', '正确使用设备，持续观察病情'],
      ['准确记录，完成交接', '记录发现时间、症状变化与处置过程。交接时区分观察到的事实与个人推测，避免信息遗漏。', '形成清晰、可追溯的交接信息'],
      ['把应急训练转化为稳定能力', 'AI 对关键时间节点、沟通内容和操作顺序进行回顾，帮助你在低风险环境中反复建立规范反应。', '复盘决策路径，强化应急能力']
    ],
    feedback: '你能及时发现异常并完成求助。建议加强交接表达训练，使用“现状—背景—评估—建议”的结构，减少紧急情境中的信息遗漏。',
    recommendation: '沟通训练：突发情境下的结构化交接'
  },
  {
    id: 'daily', title: '日常生活照护', short: '日常生活照护', subtitle: '生活协助与心理关怀', color: '#4c98ad', icon: icons.daily,
    resident: '陈奶奶 · AI 虚拟老人',
    steps: ['了解需求', '沟通与准备', '协助进食', '观察与调整', '整理与记录', 'AI 训练报告'],
    durations: [6, 6, 7, 7, 6, 8],
    scores: [94, 91, 89, 93],
    coach: [
      ['照护从了解一个人开始', '先了解陈奶奶今天的食欲、情绪与生活偏好。日常照护不是机械完成任务，而是支持老人的自主选择。', '识别身体需求与个人偏好'],
      ['解释操作，保留选择空间', '协助前说明准备做什么，询问是否方便，并调整坐姿、餐具和桌面高度，让老人尽可能参与。', '建立尊重、合作的照护关系'],
      ['观察节奏，提供适度协助', '根据咀嚼与吞咽情况控制进食节奏。避免催促，也不要在老人尚未准备好时继续递送食物。', '安全协助，同时维护自主性'],
      ['回应情绪，而非只完成任务', '注意老人的表情和回应。如果她表现出疲劳或抗拒，应暂停并询问原因，必要时调整照护方案。', '将心理关怀融入生活照护'],
      ['整理环境，记录真实变化', '清洁并整理用品，记录食量、异常表现和老人反馈，为后续照护提供连续、可靠的信息。', '完成环境整理与照护记录'],
      ['技术训练的最终目标仍是“人”', 'AI 与 VR 帮助学员反复练习观察和沟通，但同理心、关系建立与专业判断仍需在人际实践中持续发展。', '理解人机协作的边界与价值']
    ],
    feedback: '你在沟通和隐私尊重方面表现突出。可继续练习吞咽困难情景中的节奏调整，并学习如何识别需要停止进食的信号。',
    recommendation: '专项训练：吞咽困难老人的进食协助'
  }
];

const state = { scenario: 0, step: 0, playing: false, started: false, immersive: false, stepElapsed: 0, completed: false };
let toastTimer;

function scenarioMarkup(s, index) {
  return `<button class="scenario-card${index === 0 ? ' active' : ''}" style="--card-color:${s.color}" data-scenario="${index}" aria-pressed="${index === 0}">
    <span class="scenario-icon">${s.icon}</span>
    <span class="scenario-copy"><small>情景 0${index + 1}</small><strong>${s.title}</strong></span>
    <span class="scenario-arrow">›</span>
  </button>`;
}

function buildUI() {
  $('#scenario-list').innerHTML = scenarios.map(scenarioMarkup).join('');
  renderSteps();
  renderMetrics();
  updateUI();
}

function renderSteps() {
  const s = scenarios[state.scenario];
  $('#step-list').innerHTML = s.steps.map((name, i) => `<li class="step-item${i === state.step ? ' active' : ''}${i < state.step ? ' done' : ''}">
    <button class="step-button-ui" data-step="${i}" aria-current="${i === state.step ? 'step' : 'false'}">
      <span class="step-number"><span>0${i + 1}</span></span><span class="step-name">${name}</span>
    </button></li>`).join('');
  $$('#step-list [data-step]').forEach(button => button.addEventListener('click', () => {
    setStep(Number(button.dataset.step));
    showToast(`已跳转至：${s.steps[state.step]}`);
  }));
}

function renderMetrics() {
  const names = ['应急判断', '操作规范', '沟通关怀', '数字协作'];
  const scores = scenarios[state.scenario].scores;
  $('#mini-bars').innerHTML = names.map((name, i) => `<div class="mini-metric"><div class="mini-metric-head"><span>${name}</span><strong>${scores[i]}</strong></div><div class="mini-track"><i style="width:${scores[i]}%"></i></div></div>`).join('');
}

function updateUI() {
  const s = scenarios[state.scenario];
  const c = s.coach[state.step];
  document.documentElement.style.setProperty('--scenario', s.color);
  $$('#scenario-list .scenario-card').forEach((card, i) => {
    card.classList.toggle('active', i === state.scenario);
    card.setAttribute('aria-pressed', i === state.scenario);
  });
  $('#elder-label-text').textContent = s.resident;
  $('#scenario-chip').textContent = s.short;
  $('#scenario-chip').style.color = s.color;
  $('#coach-step-label').textContent = `步骤 ${state.step + 1} / 6 · ${s.steps[state.step]}`;
  $('#coach-title').textContent = c[0];
  $('#coach-text').textContent = c[1];
  $('#objective-text').textContent = `本步目标：${c[2]}`;
  $('#prev-step').disabled = state.step === 0;
  $('#next-step').disabled = state.step === 5;
  updatePlayButton();
}

function updatePlayButton() {
  const playing = state.playing;
  $('#play-icon').innerHTML = playing
    ? '<path d="M8 6h3v12H8zM14 6h3v12h-3z" fill="currentColor"/>'
    : '<path d="m9 6 9 6-9 6V6Z" fill="currentColor"/>';
  $('#play-text').textContent = playing ? '暂停' : (state.completed ? '重新训练' : (state.stepElapsed > 0 || state.step > 0 ? '继续' : '开始训练'));
  $('#play-button').setAttribute('aria-label', playing ? '暂停训练' : '播放训练');
  $('#playback-status').classList.toggle('playing', playing);
  $('#playback-status').innerHTML = `<i class="status-dot"></i>${playing ? '训练进行中' : (state.completed ? '训练已完成' : '演示已暂停')}`;
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function openDialog(id) {
  state.playing = false;
  updatePlayButton();
  const dialog = document.getElementById(id);
  if (!dialog.open) dialog.showModal();
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog.open) dialog.close();
}

function renderReport() {
  const s = scenarios[state.scenario];
  const names = ['应急判断', '操作规范', '沟通关怀', '数字协作'];
  const overall = Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length);
  $('#report-scenario').textContent = `情景 0${state.scenario + 1} · ${s.title}`;
  $('#overall-score').textContent = overall;
  $('.score-ring').style.background = `radial-gradient(circle at center, #fafcf9 61%, transparent 62%), conic-gradient(var(--teal) 0 ${overall}%, #dfe9e3 ${overall}%)`;
  $('#report-bars').innerHTML = names.map((name, i) => `<div class="report-metric"><div class="report-metric-head"><span>${name}</span><strong>${s.scores[i]} / 100</strong></div><div class="report-metric-track"><i data-width="${s.scores[i]}%"></i></div></div>`).join('');
  $('#report-feedback-text').textContent = s.feedback;
  $('#report-recommendation').textContent = s.recommendation;
  requestAnimationFrame(() => $$('#report-bars i').forEach(bar => { bar.style.width = bar.dataset.width; }));
}

function togglePlay() {
  if (!state.started) {
    state.started = true;
    $('#welcome-overlay').classList.add('hidden');
  }
  if (state.completed) {
    setScenario(state.scenario, false);
    state.completed = false;
    $('#report-button').classList.remove('notice');
  }
  state.playing = !state.playing;
  updatePlayButton();
}

function setStep(index) {
  state.step = THREE.MathUtils.clamp(index, 0, 5);
  state.stepElapsed = 0;
  state.completed = false;
  $('#report-button').classList.remove('notice');
  renderSteps();
  updateUI();
  applyStepPose();
}

function setScenario(index, moveCamera = true) {
  state.scenario = (index + scenarios.length) % scenarios.length;
  state.step = 0;
  state.stepElapsed = 0;
  state.playing = false;
  state.completed = false;
  $('#report-button').classList.remove('notice');
  renderSteps();
  renderMetrics();
  updateUI();
  applyScenarioPose();
  if (moveCamera) setCameraForScenario();
}

// ---------- Three.js scene ----------
let renderer, scene, camera, controls, clock;
let elder, caregiver, elderShadow, caregiverShadow;
let fallProps, healthProps, dailyProps, scenarioRing;
let cameraGoal = null, targetGoal = null, cameraMoving = false;
const materialCache = new Map();
const labelVector = new THREE.Vector3();

function mat(color, roughness = 0.72, metalness = 0) {
  const key = `${color}-${roughness}-${metalness}`;
  if (!materialCache.has(key)) materialCache.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
  return materialCache.get(key);
}

function box(parent, w, h, d, color, x, y, z, radius = 0.035, options = {}) {
  const safeRadius = Math.min(radius, w / 3, h / 3, d / 3);
  const geometry = safeRadius > 0 ? new RoundedBoxGeometry(w, h, d, 2, safeRadius) : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geometry, options.material || mat(color, options.roughness ?? 0.72, options.metalness ?? 0));
  mesh.position.set(x, y, z);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, rt, rb, h, color, x, y, z, options = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, options.segments || 24), options.material || mat(color, options.roughness ?? 0.7, options.metalness ?? 0));
  mesh.position.set(x, y, z);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  parent.add(mesh);
  return mesh;
}

function sphere(parent, radius, color, x, y, z, options = {}) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, options.width || 24, options.height || 16), options.material || mat(color, options.roughness ?? 0.72));
  mesh.position.set(x, y, z);
  mesh.castShadow = options.castShadow !== false;
  parent.add(mesh);
  return mesh;
}

function makeShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 5, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(25,44,36,.42)');
  gradient.addColorStop(.45, 'rgba(25,44,36,.17)');
  gradient.addColorStop(1, 'rgba(25,44,36,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}
let shadowTexture;
function contactShadow(parent, x, z, w, d, opacity = .45, y = .012) {
  const material = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function makeFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#cbbba4';
  ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 64) {
    ctx.fillStyle = y % 128 === 0 ? 'rgba(255,255,255,.035)' : 'rgba(70,45,25,.025)';
    ctx.fillRect(0, y, 512, 64);
    ctx.strokeStyle = 'rgba(92,69,47,.18)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    for (let x = (y % 128 === 0 ? 128 : 320); x < 512; x += 256) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 64); ctx.stroke();
    }
  }
  for (let i = 0; i < 130; i++) {
    const y = Math.random() * 512;
    ctx.strokeStyle = `rgba(90,62,38,${Math.random() * .035})`;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(140, y + 5, 360, y - 5, 512, y); ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.2, 2.4);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  return texture;
}

function makeSignTexture(title, subtitle) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f5f3e9'; ctx.fillRect(0, 0, 1024, 512);
  ctx.fillStyle = '#1d6b5b'; ctx.fillRect(70, 72, 12, 170);
  ctx.font = '600 76px "Microsoft YaHei", sans-serif'; ctx.fillText(title, 125, 180);
  ctx.fillStyle = '#70887d'; ctx.font = '34px "Microsoft YaHei", sans-serif'; ctx.fillText(subtitle, 128, 250);
  ctx.strokeStyle = '#cbd9d0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(128, 310); ctx.lineTo(890, 310); ctx.stroke();
  ctx.fillStyle = '#9aaca2'; ctx.font = '26px sans-serif'; ctx.fillText('SMARTCARE VR · LEARNING SPACE 01', 128, 375);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeMonitorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 300;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#163d38'; ctx.fillRect(0, 0, 512, 300);
  ctx.fillStyle = '#9ed4bc'; ctx.font = '22px sans-serif'; ctx.fillText('SIMULATED VITAL SIGNS', 28, 38);
  ctx.strokeStyle = '#77d5a5'; ctx.lineWidth = 4; ctx.beginPath();
  ctx.moveTo(28, 112); ctx.lineTo(105, 112); ctx.lineTo(123, 76); ctx.lineTo(145, 153); ctx.lineTo(169, 95); ctx.lineTo(190, 112); ctx.lineTo(290, 112); ctx.stroke();
  ctx.fillStyle = '#d6f2df'; ctx.font = 'bold 50px sans-serif'; ctx.fillText('98', 365, 120);
  ctx.fillStyle = '#8fbeb0'; ctx.font = '20px sans-serif'; ctx.fillText('SpO₂  %', 370, 150);
  ctx.fillStyle = '#d6f2df'; ctx.font = 'bold 42px sans-serif'; ctx.fillText('128/82', 280, 230);
  ctx.fillStyle = '#8fbeb0'; ctx.font = '18px sans-serif'; ctx.fillText('演示数据 · 非临床监测', 28, 266);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createWindow(parent, x, width = 2.65) {
  const group = new THREE.Group(); group.position.set(x, 2.65, -5.68); parent.add(group);
  const skyMat = new THREE.MeshStandardMaterial({ color: '#c4dfd9', emissive: '#9dc6c1', emissiveIntensity: .35, roughness: .9 });
  box(group, width, 2.25, .045, '#c4dfd9', 0, 0, 0, 0, { material: skyMat, castShadow: false });
  const outsideMat = new THREE.MeshBasicMaterial({ color: '#86aa91', transparent: true, opacity: .55 });
  [-width * .28, width * .25].forEach((tx, i) => {
    const crown = new THREE.Mesh(new THREE.CircleGeometry(.47 + i * .08, 24), outsideMat);
    crown.position.set(tx, -.66 + i * .12, .028); group.add(crown);
  });
  const frame = '#f4f3e9';
  box(group, width + .16, .11, .12, frame, 0, 1.17, .06, .015);
  box(group, width + .16, .11, .12, frame, 0, -1.17, .06, .015);
  box(group, .11, 2.45, .12, frame, -width / 2 - .03, 0, .06, .015);
  box(group, .11, 2.45, .12, frame, width / 2 + .03, 0, .06, .015);
  box(group, .07, 2.25, .09, frame, 0, 0, .07, .01);
  box(group, width, .07, .09, frame, 0, 0, .07, .01);
  box(group, width + .4, .09, .34, '#e2ded2', 0, -1.23, .15, .02);
  const curtainMat = new THREE.MeshStandardMaterial({ color: '#f7f5e9', transparent: true, opacity: .48, roughness: 1, side: THREE.DoubleSide });
  const leftCurtain = new THREE.Mesh(new THREE.PlaneGeometry(.45, 2.5, 8, 1), curtainMat);
  leftCurtain.position.set(-width / 2 + .15, 0, .2); group.add(leftCurtain);
  const rightCurtain = leftCurtain.clone(); rightCurtain.position.x = width / 2 - .15; group.add(rightCurtain);
}

function createPlant(parent, x, z, scale = 1) {
  const group = new THREE.Group(); group.position.set(x, 0, z); group.scale.setScalar(scale); parent.add(group);
  cylinder(group, .34, .26, .58, '#b78463', 0, .29, 0);
  cylinder(group, .29, .29, .035, '#584b39', 0, .59, 0);
  const stemMat = mat('#58765a');
  for (let i = 0; i < 9; i++) {
    const angle = i * 2.4;
    const h = .85 + (i % 3) * .22;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.018, .025, h, 8), stemMat);
    stem.position.set(Math.sin(angle) * .08, .6 + h / 2, Math.cos(angle) * .08);
    stem.rotation.z = Math.sin(angle) * .18; group.add(stem);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(.24, 16, 10), mat(i % 2 ? '#5e8d68' : '#749c70'));
    leaf.scale.set(.65, 1.65, .35); leaf.position.set(Math.sin(angle) * .28, .7 + h, Math.cos(angle) * .28);
    leaf.rotation.z = Math.sin(angle) * .5; leaf.castShadow = true; group.add(leaf);
  }
  contactShadow(parent, x, z, 1.2 * scale, 1.2 * scale, .32);
}

function createSofa(parent) {
  const g = new THREE.Group(); g.position.set(-4.5, 0, -3.25); parent.add(g);
  const fabric = '#87a79a';
  box(g, 3.15, .38, 1.25, fabric, 0, .52, 0, .12);
  box(g, 3.05, 1.02, .28, fabric, 0, 1.06, -.52, .11);
  box(g, .28, .72, 1.28, '#78988c', -1.48, .75, 0, .1);
  box(g, .28, .72, 1.28, '#78988c', 1.48, .75, 0, .1);
  box(g, 1.35, .18, 1.04, '#a4bcb0', -.72, .79, .04, .08);
  box(g, 1.35, .18, 1.04, '#a4bcb0', .72, .79, .04, .08);
  box(g, .72, .62, .18, '#d6c7a9', -.86, 1.18, -.27, .1).rotation.z = -.12;
  box(g, .62, .54, .18, '#d8a27f', .83, 1.14, -.28, .1).rotation.z = .13;
  [-1.25, 1.25].forEach(x => [-.42, .42].forEach(z => cylinder(g, .055, .065, .28, '#806c55', x, .14, z)));
  contactShadow(parent, -4.5, -3.2, 4, 2, .35);
}

function createCoffeeTable(parent) {
  const g = new THREE.Group(); g.position.set(-3.9, 0, -.75); parent.add(g);
  box(g, 2.05, .14, 1.15, '#b69b7c', 0, .64, 0, .12);
  [-.78, .78].forEach(x => [-.38, .38].forEach(z => cylinder(g, .045, .06, .58, '#6f6656', x, .3, z)));
  box(g, .68, .045, .46, '#e3e6da', -.5, .735, 0, .02);
  cylinder(g, .09, .07, .16, '#f1eee2', .57, .79, -.15);
  contactShadow(parent, -3.9, -.75, 2.5, 1.6, .3);
}

function createBed(parent) {
  const g = new THREE.Group(); g.position.set(3.65, 0, -3.15); parent.add(g);
  box(g, 2.15, .28, 3.35, '#aa9379', 0, .52, 0, .06);
  box(g, 2.02, .32, 3.15, '#f1f0e7', 0, .81, 0, .11);
  box(g, 2.2, 1.35, .18, '#9b8268', 0, 1.05, -1.63, .06);
  box(g, 1.88, .14, 1.85, '#91b2a4', 0, 1.005, .55, .05);
  box(g, 1.65, .19, .7, '#faf9f0', 0, 1.055, -1.05, .12).rotation.x = -.07;
  box(g, .08, .26, 2.65, '#e1e7df', -1.04, .95, .18, .02);
  box(g, .08, .26, 2.65, '#e1e7df', 1.04, .95, .18, .02);
  [-.88, .88].forEach(x => [-1.35, 1.35].forEach(z => cylinder(g, .065, .075, .42, '#746653', x, .21, z)));
  contactShadow(parent, 3.65, -3.1, 3.2, 4.3, .38);
  const cabinet = new THREE.Group(); cabinet.position.set(5.45, 0, -4.15); parent.add(cabinet);
  box(cabinet, .95, .85, .8, '#c0aa8e', 0, .48, 0, .06);
  box(cabinet, .82, .24, .68, '#d0bda3', 0, .72, .07, .035);
  box(cabinet, .2, .035, .035, '#776c5b', 0, .72, .43, .01);
  cylinder(cabinet, .18, .14, .35, '#e8e5d8', 0, 1.08, 0);
  cylinder(cabinet, .26, .18, .36, '#e8d9b8', 0, 1.42, 0);
  const lamp = new THREE.PointLight('#ffdfaa', 6, 4, 2); lamp.position.set(0, 1.48, 0); cabinet.add(lamp);
}

function createRoom() {
  const room = new THREE.Group(); scene.add(room);
  const floorMat = new THREE.MeshStandardMaterial({ map: makeFloorTexture(), roughness: .78, metalness: 0 });
  box(room, 16, .18, 12, '#cbbba4', 0, -.11, 0, 0, { material: floorMat });
  box(room, 16, 4.7, .18, '#e8e5da', 0, 2.3, -5.9, .02);
  box(room, .18, 4.7, 12, '#e3e5da', -7.9, 2.3, 0, .02);
  box(room, 16, .16, .1, '#c3b9a6', 0, .09, -5.75, .02);
  box(room, .1, .16, 12, '#bcb8a8', -7.75, .09, 0, .02);
  box(room, 16, .12, .2, '#f2f0e7', 0, 4.55, -5.75, .02);
  createWindow(room, -3.8, 2.8);
  createWindow(room, -.25, 2.8);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 1.28), new THREE.MeshStandardMaterial({ map: makeSignTexture('用心照护，以练促学', '专业判断 · 沟通关怀 · 数字协作'), roughness: .9 }));
  sign.position.set(4.65, 2.85, -5.79); room.add(sign);
  box(room, 2.68, 1.4, .055, '#d1c7b5', 4.65, 2.85, -5.83, .025);
  sign.position.z = -5.79;
  box(room, 5.1, .035, 3.5, '#c8d7cb', -.45, .015, .35, .02, { castShadow: false });
  const rugBorder = box(room, 4.95, .039, 3.35, '#dbe3d7', -.45, .018, .35, .02, { castShadow: false });
  rugBorder.receiveShadow = true;
  createSofa(room);
  createCoffeeTable(room);
  createBed(room);
  createPlant(room, -6.75, -4.55, 1.05);
  createPlant(room, -6.65, 3.65, .85);
  const pendant = new THREE.Group(); pendant.position.set(-.6, 0, -.2); room.add(pendant);
  cylinder(pendant, .015, .015, .7, '#7f8175', 0, 4.25, 0);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(.18, .48, .34, 32, 1, true), mat('#e5d7b8'));
  shade.position.y = 3.78; pendant.add(shade);
  const bulb = new THREE.PointLight('#ffe4b5', 11, 8, 2); bulb.position.set(0, 3.63, 0); pendant.add(bulb);
  const wallRail = box(room, .12, .12, 4.5, '#b9a58b', -7.65, 1.05, 1.2, .025);
  wallRail.castShadow = true;
  return room;
}

function createHuman(kind) {
  const isElder = kind === 'elder';
  const g = new THREE.Group();
  const skin = isElder ? '#d9ad8c' : '#dcae8d';
  const cloth = isElder ? '#c18e75' : '#367f78';
  const pants = isElder ? '#656d68' : '#285d59';
  const hair = isElder ? '#d6d3c9' : '#3b3531';
  const torso = box(g, .68, .77, .38, cloth, 0, 1.08, 0, .16);
  box(g, .56, .18, .35, pants, 0, .67, 0, .07);
  if (isElder) {
    box(g, .075, .63, .025, '#e6d5bd', 0, 1.09, .205, .015);
    [1.22, 1.06, .9].forEach(y => sphere(g, .018, '#eee2cc', .055, y, .225, { width: 10, height: 8 }));
  } else {
    const collarL = box(g, .22, .17, .025, '#d8ede5', -.1, 1.41, .2, .02); collarL.rotation.z = -.35;
    const collarR = box(g, .22, .17, .025, '#d8ede5', .1, 1.41, .2, .02); collarR.rotation.z = .35;
    box(g, .16, .21, .018, '#f4f7ef', .21, 1.22, .215, .018);
    box(g, .1, .025, .012, '#5a9f92', .21, 1.24, .228, .005);
  }
  const legs = [];
  [-.18, .18].forEach(x => {
    const pivot = new THREE.Group(); pivot.position.set(x, .7, 0); g.add(pivot);
    cylinder(pivot, .105, .09, .66, pants, 0, -.32, 0);
    box(pivot, .22, .14, .36, isElder ? '#574f47' : '#eef0e8', 0, -.68, .075, .065);
    legs.push(pivot);
  });
  const arms = [];
  [-1, 1].forEach(side => {
    const pivot = new THREE.Group(); pivot.position.set(side * .42, 1.36, 0); pivot.rotation.z = side * .08; g.add(pivot);
    cylinder(pivot, .09, .075, .53, cloth, 0, -.24, 0);
    sphere(pivot, .09, skin, 0, -.55, 0, { width: 16, height: 12 });
    arms.push(pivot);
  });
  cylinder(g, .075, .085, .13, skin, 0, 1.5, 0);
  const head = sphere(g, .245, skin, 0, 1.7, 0, { width: 32, height: 24 });
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(.252, 28, 16, 0, Math.PI * 2, 0, Math.PI * .54), mat(hair, .88));
  hairCap.position.set(0, 1.75, -.008); hairCap.castShadow = true; g.add(hairCap);
  sphere(g, .052, skin, -.242, 1.7, 0, { width: 14, height: 10 });
  sphere(g, .052, skin, .242, 1.7, 0, { width: 14, height: 10 });
  sphere(g, .035, skin, 0, 1.68, .236, { width: 14, height: 10 });
  [-.083, .083].forEach(x => sphere(g, .018, '#3d3832', x, 1.735, .222, { width: 12, height: 8 }));
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(.045, .008, 6, 16, Math.PI), mat('#a66f61'));
  mouth.position.set(0, 1.605, .226); mouth.rotation.z = Math.PI; g.add(mouth);
  if (isElder) {
    [-.085, .085].forEach(x => {
      const lens = new THREE.Mesh(new THREE.TorusGeometry(.065, .008, 6, 20), mat('#786f62', .35, .35));
      lens.position.set(x, 1.73, .242); g.add(lens);
    });
    box(g, .055, .012, .012, '#786f62', 0, 1.73, .245, .003);
  }
  g.userData = { torso, head, leftArm: arms[0], rightArm: arms[1], leftLeg: legs[0], rightLeg: legs[1], fallProgress: 0, fallTarget: 0, crouchTarget: 1, armTarget: 0 };
  g.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
  scene.add(g);
  return g;
}

function faceToward(object, targetX, targetZ) {
  object.rotation.y = Math.atan2(targetX - object.position.x, targetZ - object.position.z);
}

function createScenarioProps() {
  fallProps = new THREE.Group(); scene.add(fallProps);
  const cane = cylinder(fallProps, .022, .026, 1.05, '#7b5d43', -.1, .08, 1.15);
  cane.rotation.z = Math.PI / 2; cane.rotation.y = .35;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.12, .025, 8, 18, Math.PI), mat('#7b5d43'));
  handle.position.set(.43, .09, .97); handle.rotation.x = Math.PI / 2; fallProps.add(handle);
  box(fallProps, .23, .055, .23, '#e3aa75', .9, .055, .95, .045);
  const crossH = box(fallProps, .12, .014, .035, '#fff5e9', .9, .089, .95, .006);
  const crossV = box(fallProps, .035, .014, .12, '#fff5e9', .9, .09, .95, .006);
  crossH.castShadow = crossV.castShadow = false;

  healthProps = new THREE.Group(); scene.add(healthProps);
  const monitor = new THREE.Group(); monitor.position.set(5.35, 0, -2.3); healthProps.add(monitor);
  cylinder(monitor, .045, .055, 1.35, '#a7b6ae', 0, .82, 0, { metalness: .35 });
  cylinder(monitor, .35, .35, .06, '#899d93', 0, .1, 0);
  box(monitor, 1.02, .7, .13, '#e7eee8', 0, 1.65, 0, .08);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(.88, .54), new THREE.MeshBasicMaterial({ map: makeMonitorTexture() }));
  screen.position.set(0, 1.65, .071); monitor.add(screen);
  box(healthProps, .16, .06, .25, '#6b9f99', 3.04, 1.12, -1.63, .025);

  dailyProps = new THREE.Group(); scene.add(dailyProps);
  const tray = new THREE.Group(); tray.position.set(-3.85, .77, -.72); dailyProps.add(tray);
  box(tray, 1.05, .045, .68, '#e7e6dc', 0, 0, 0, .06);
  cylinder(tray, .22, .16, .13, '#f5f3e8', -.18, .09, 0);
  cylinder(tray, .17, .17, .012, '#c5a773', -.18, .16, 0);
  cylinder(tray, .1, .08, .25, '#c2d7ce', .3, .145, -.06);
  const spoon = box(tray, .035, .018, .36, '#aab6ae', .08, .065, .12, .008, { metalness: .45 }); spoon.rotation.y = -.28;

  const ringMat = new THREE.MeshBasicMaterial({ color: scenarios[0].color, transparent: true, opacity: .38, side: THREE.DoubleSide, depthWrite: false });
  scenarioRing = new THREE.Mesh(new THREE.RingGeometry(1.12, 1.17, 64), ringMat);
  scenarioRing.rotation.x = -Math.PI / 2; scenarioRing.position.set(-.6, .035, .6); scene.add(scenarioRing);
  for (let i = 0; i < 3; i++) {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(.035, 16), new THREE.MeshBasicMaterial({ color: scenarios[0].color, transparent: true, opacity: .5 }));
    dot.rotation.x = -Math.PI / 2; dot.position.set(-2 + i * .32, .038, 1.25); scenarioRing.add(dot);
  }
}

function applyScenarioPose() {
  if (!elder || !caregiver) return;
  elder.rotation.set(0, 0, 0); caregiver.rotation.set(0, 0, 0);
  elder.scale.setScalar(1); caregiver.scale.setScalar(1);
  elder.userData.fallProgress = elder.userData.fallTarget = 0;
  elder.userData.leftLeg.rotation.x = elder.userData.rightLeg.rotation.x = 0;
  caregiver.userData.crouchTarget = 1;
  fallProps.visible = state.scenario === 0;
  healthProps.visible = state.scenario === 1;
  dailyProps.visible = state.scenario === 2;
  scenarioRing.material.color.set(scenarios[state.scenario].color);
  if (state.scenario === 0) {
    elder.position.set(-.6, 0, .6); elder.rotation.y = .25;
    caregiver.position.set(1.45, 0, 1.55); faceToward(caregiver, elder.position.x, elder.position.z);
    scenarioRing.position.set(-.6, .035, .6);
  } else if (state.scenario === 1) {
    elder.position.set(3.65, 1.07, -1.63); elder.rotation.x = -Math.PI / 2;
    caregiver.position.set(2.05, 0, -1.35); faceToward(caregiver, 3.65, -2.3);
    scenarioRing.position.set(3.65, .035, -2.4);
  } else {
    elder.position.set(-4.5, .52, -2.75); elder.rotation.y = 0;
    elder.userData.leftLeg.rotation.x = elder.userData.rightLeg.rotation.x = -1.25;
    caregiver.position.set(-2.45, 0, -.65); faceToward(caregiver, -4.5, -2.75);
    scenarioRing.position.set(-3.8, .035, -1.4);
  }
  elderShadow.position.set(elder.position.x, .025, elder.position.z);
  caregiverShadow.position.set(caregiver.position.x, .025, caregiver.position.z);
  applyStepPose();
}

function applyStepPose() {
  if (!elder || !caregiver) return;
  elder.userData.fallTarget = state.scenario === 0 && state.step >= 2 ? 1 : 0;
  caregiver.userData.crouchTarget = state.scenario === 0 && state.step >= 2 && state.step <= 4 ? .8 : 1;
  caregiver.userData.armTarget = [0, .45, 1.05, 1.25, .7, .25][state.step];
  if (state.scenario === 2 && state.step === 2) caregiver.userData.armTarget = 1.35;
  elderShadow.scale.set(state.scenario === 0 && state.step >= 2 ? 1.6 : 1, state.scenario === 0 && state.step >= 2 ? 1.6 : 1, 1);
}

const cameraViews = [
  { position: [7.4, 5.6, 9.2], target: [-.25, .85, .15], immersive: [1.45, 1.55, 1.45], focus: [-.6, 1.05, .6] },
  { position: [8.4, 4.8, 4.6], target: [3.3, 1.0, -2.5], immersive: [2.05, 1.55, -1.35], focus: [3.65, 1.15, -2.55] },
  { position: [2.1, 4.3, 6.7], target: [-3.6, .9, -1.9], immersive: [-2.45, 1.55, -.65], focus: [-4.5, 1.35, -2.75] }
];

function moveCamera(position, target) {
  cameraGoal = new THREE.Vector3(...position);
  targetGoal = new THREE.Vector3(...target);
  cameraMoving = true;
}

function setCameraForScenario() {
  const view = cameraViews[state.scenario];
  if (state.immersive) moveCamera(view.immersive, view.focus);
  else moveCamera(view.position, view.target);
}

function setViewMode(immersive) {
  state.immersive = immersive;
  $('#orbit-view').classList.toggle('active', !immersive);
  $('#immersive-view').classList.toggle('active', immersive);
  $('#orbit-view').setAttribute('aria-pressed', !immersive);
  $('#immersive-view').setAttribute('aria-pressed', immersive);
  controls.enablePan = !immersive;
  controls.minDistance = immersive ? .6 : 4;
  controls.maxDistance = immersive ? 7 : 22;
  setCameraForScenario();
  showToast(immersive ? '学员视角：从护理员位置观察情景' : '导师视角：拖动旋转，滚轮缩放');
}

function positionLabel(element, object, height) {
  if (!object || !object.visible) { element.style.opacity = 0; return; }
  labelVector.set(0, height, 0).applyMatrix4(object.matrixWorld).project(camera);
  const visible = labelVector.z > -1 && labelVector.z < 1 && Math.abs(labelVector.x) < .96 && Math.abs(labelVector.y) < .9;
  if (!visible) { element.style.opacity = 0; return; }
  const x = (labelVector.x * .5 + .5) * innerWidth;
  const y = (-labelVector.y * .5 + .5) * innerHeight;
  element.style.transform = `translate(-50%,-100%) translate(${x}px,${y}px)`;
  element.style.opacity = 1;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), .05);
  const elapsed = clock.elapsedTime;
  if (state.playing && state.started && !document.querySelector('dialog[open]')) {
    state.stepElapsed += dt;
    const duration = scenarios[state.scenario].durations[state.step];
    if (state.stepElapsed >= duration) {
      if (state.step < 5) setStep(state.step + 1);
      else {
        state.stepElapsed = duration;
        state.playing = false;
        state.completed = true;
        $('#report-button').classList.add('notice');
        updatePlayButton();
        showToast('本轮训练完成，训练报告已生成');
      }
    }
  }
  const duration = scenarios[state.scenario].durations[state.step];
  $('#step-progress').style.width = `${Math.min(100, state.stepElapsed / duration * 100)}%`;
  const current = Math.floor(Math.min(state.stepElapsed, duration));
  $('#step-timer').textContent = `00:${String(current).padStart(2, '0')} / 00:${String(duration).padStart(2, '0')}`;

  if (elder && caregiver) {
    const fall = THREE.MathUtils.damp(elder.userData.fallProgress, elder.userData.fallTarget, 4.5, dt);
    elder.userData.fallProgress = fall;
    if (state.scenario === 0) {
      elder.rotation.x = -Math.PI / 2 * THREE.MathUtils.smoothstep(fall, 0, 1);
      elder.position.y = .14 * fall;
      elderShadow.position.z = .6 - .55 * fall;
    }
    const crouch = THREE.MathUtils.damp(caregiver.scale.y, caregiver.userData.crouchTarget, 5, dt);
    caregiver.scale.y = crouch;
    const arm = caregiver.userData.armTarget;
    caregiver.userData.rightArm.rotation.x = THREE.MathUtils.damp(caregiver.userData.rightArm.rotation.x, -arm, 5, dt);
    caregiver.userData.leftArm.rotation.x = THREE.MathUtils.damp(caregiver.userData.leftArm.rotation.x, -arm * .35, 5, dt);
    caregiver.userData.rightArm.rotation.z = -.12 - arm * .13;
    elder.userData.head.rotation.y = Math.sin(elapsed * .65) * .025;
    if (state.scenario === 0 && state.step === 1) elder.rotation.z = Math.sin(elapsed * 4) * .015;
    else elder.rotation.z = 0;
    scenarioRing.material.opacity = .22 + Math.sin(elapsed * 1.7) * .08;
    const pulse = 1 + Math.sin(elapsed * 1.7) * .025;
    scenarioRing.scale.setScalar(pulse);
  }

  if (cameraMoving && cameraGoal && targetGoal) {
    camera.position.lerp(cameraGoal, 1 - Math.exp(-dt * 3.6));
    controls.target.lerp(targetGoal, 1 - Math.exp(-dt * 4.2));
    if (camera.position.distanceTo(cameraGoal) < .015 && controls.target.distanceTo(targetGoal) < .015) cameraMoving = false;
  }
  controls.update();
  scene.updateMatrixWorld();
  positionLabel($('#elder-label'), elder, 2.1);
  positionLabel($('#caregiver-label'), caregiver, 2.08);
  renderer.render(scene, camera);
}

function init3D() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#e5eee9');
  scene.fog = new THREE.Fog('#e5eee9', 22, 44);
  camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .08, 100);
  camera.position.set(...cameraViews[0].position);
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  $('#scene').appendChild(renderer.domElement);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment(renderer);
  scene.environment = pmrem.fromScene(environment, .04).texture;
  environment.dispose(); pmrem.dispose();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...cameraViews[0].target);
  controls.enableDamping = true;
  controls.dampingFactor = .07;
  controls.minDistance = 4;
  controls.maxDistance = 22;
  controls.minPolarAngle = .22;
  controls.maxPolarAngle = Math.PI / 2.06;
  controls.panSpeed = .65;
  controls.rotateSpeed = .55;
  controls.zoomSpeed = .75;
  controls.addEventListener('start', () => { cameraMoving = false; });

  const hemisphere = new THREE.HemisphereLight('#f1faf5', '#8d7d68', 1.35); scene.add(hemisphere);
  const sun = new THREE.DirectionalLight('#fff0d7', 2.6);
  sun.position.set(-4.5, 9, 5.5); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -10; sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -8;
  sun.shadow.camera.near = .5; sun.shadow.camera.far = 30;
  sun.shadow.bias = -.00025; sun.shadow.normalBias = .025;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#c9e4dc', .75); fill.position.set(7, 5, 2); scene.add(fill);

  shadowTexture = makeShadowTexture();
  createRoom();
  createScenarioProps();
  elder = createHuman('elder');
  caregiver = createHuman('caregiver');
  elderShadow = contactShadow(scene, 0, 0, 1.05, 1.05, .38, .025);
  caregiverShadow = contactShadow(scene, 0, 0, 1.0, 1.0, .35, .025);
  applyScenarioPose();
  clock = new THREE.Clock();
  animate();
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault(); state.playing = false; updatePlayButton(); showToast('3D 渲染已暂停，请刷新页面恢复');
  });
}

function bindEvents() {
  $$('#scenario-list [data-scenario]').forEach(button => button.addEventListener('click', () => {
    setScenario(Number(button.dataset.scenario));
    $('#training-panel').classList.remove('open');
  }));
  $('#play-button').addEventListener('click', togglePlay);
  $('#prev-step').addEventListener('click', () => setStep(state.step - 1));
  $('#next-step').addEventListener('click', () => setStep(state.step + 1));
  $('#orbit-view').addEventListener('click', () => setViewMode(false));
  $('#immersive-view').addEventListener('click', () => setViewMode(true));
  $('#reset-camera').addEventListener('click', () => { setCameraForScenario(); showToast('已恢复当前情景的推荐视角'); });
  $('#start-training').addEventListener('click', () => {
    state.started = true; state.playing = true;
    $('#welcome-overlay').classList.add('hidden');
    updatePlayButton(); showToast('训练开始：先观察环境，再采取行动');
  });
  $('#explore-space').addEventListener('click', () => {
    state.started = true; state.playing = false;
    $('#welcome-overlay').classList.add('hidden');
    updatePlayButton(); showToast('自由探索模式：点击左侧情景可切换空间');
  });
  $('#about-button').addEventListener('click', () => openDialog('about-dialog'));
  $('#report-button').addEventListener('click', () => { renderReport(); openDialog('report-dialog'); });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(button.dataset.close)));
  $$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  $('#replay-scenario').addEventListener('click', () => {
    closeDialog('report-dialog'); setScenario(state.scenario); state.started = true; state.playing = true; updatePlayButton();
  });
  $('#next-scenario').addEventListener('click', () => {
    closeDialog('report-dialog'); setScenario(state.scenario + 1); state.started = true; state.playing = true; updatePlayButton();
  });
  $('#elder-label').addEventListener('click', () => showToast('AI 虚拟老人：模拟健康状态、性格与沟通反应'));
  $('#caregiver-label').addEventListener('click', () => showToast('护理学员：在情景中完成观察、判断、操作与沟通'));
  $('#flow-toggle').addEventListener('click', () => $('#training-panel').classList.add('open'));
  $('#flow-close').addEventListener('click', () => $('#training-panel').classList.remove('open'));
  $('#fullscreen-button').addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch { showToast('当前浏览器不支持全屏，可使用浏览器全屏功能'); }
  });
  document.addEventListener('fullscreenchange', () => {
    $('#fullscreen-button').setAttribute('aria-label', document.fullscreenElement ? '退出全屏' : '进入全屏');
  });
  document.addEventListener('keydown', event => {
    if (document.querySelector('dialog[open]') || !$('#welcome-overlay').classList.contains('hidden')) return;
    if (event.code === 'Space') { event.preventDefault(); togglePlay(); }
    if (event.code === 'ArrowRight') setStep(state.step + 1);
    if (event.code === 'ArrowLeft') setStep(state.step - 1);
  });
}

buildUI();
bindEvents();
try {
  init3D();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $('#loading-overlay').classList.add('done');
    $('#welcome-overlay').classList.remove('hidden');
    window.smartCareReady = true;
  }));
} catch (error) {
  console.error(error);
  $('#loading-overlay p').textContent = '3D 空间加载失败，请使用支持 WebGL 的现代浏览器并刷新。';
  $('#loading-overlay .loading-track').style.display = 'none';
}
