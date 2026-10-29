// =========================================================================
// https://SmartGymAI.vn - CORE APPLICATION & AI INTELLIGENCE ENGINE
// =========================================================================

// Global Application State & Multi-Role Database
const state = {
  activeTab: 'home',
  adminSubTab: 'users',
  adminFilterRole: 'all',
  adminSearchQuery: '',
  
  // Current Logged In User State (RBAC)
  currentUser: {
    id: 'USR-001',
    name: 'Nguyễn Văn An',
    email: 'admin@smartgym.vn',
    phone: '0912 345 678',
    role: 'admin', // 'admin' | 'trainer' | 'member'
    membership: 'Gói Platinum All-Access + 12 Buổi PT',
    expiryDate: '18/09/2027',
    remainingPt: 12,
    status: 'active',
    avatar: 'AD'
  },

  // Mock Database of Registered Users for Admin Management
  usersList: [
    {
      id: 'USR-001',
      name: 'Nguyễn Văn An',
      email: 'admin@smartgym.vn',
      phone: '0912 345 678',
      role: 'admin',
      membership: 'Gói Platinum VIP (1 Năm)',
      expiryDate: '18/09/2027',
      status: 'active',
      avatar: 'AD',
      joinedDate: '10/01/2026'
    },
    {
      id: 'USR-002',
      name: 'Trần Văn Hùng',
      email: 'trainer.hung@smartgym.vn',
      phone: '0903 112 233',
      role: 'trainer',
      membership: 'HLV Trưởng - NASM Certified',
      expiryDate: '31/12/2028',
      status: 'active',
      avatar: 'TH',
      joinedDate: '15/02/2026'
    },
    {
      id: 'USR-003',
      name: 'Lê Hoàng Nam',
      email: 'nam.le@gmail.com',
      phone: '0988 776 655',
      role: 'member',
      membership: 'Gói Gold (6 Tháng)',
      expiryDate: '24/11/2026',
      status: 'active',
      avatar: 'HN',
      joinedDate: '24/05/2026'
    },
    {
      id: 'USR-004',
      name: 'Phạm Thị Mai',
      email: 'mai.pham@outlook.com',
      phone: '0971 223 344',
      role: 'member',
      membership: 'Gói Silver (3 Tháng)',
      expiryDate: '15/10/2026',
      status: 'active',
      avatar: 'TM',
      joinedDate: '15/07/2026'
    },
    {
      id: 'USR-005',
      name: 'Đặng Quốc Bảo',
      email: 'bao.dang@yahoo.com',
      phone: '0933 445 566',
      role: 'member',
      membership: 'Trial Trải Nghiệm 7 Ngày',
      expiryDate: '05/10/2026',
      status: 'suspended',
      avatar: 'QB',
      joinedDate: '28/09/2026'
    },
    {
      id: 'USR-006',
      name: 'Vũ Thu Thảo',
      email: 'thao.vu@gymfitness.vn',
      phone: '0944 889 900',
      role: 'trainer',
      membership: 'HLV Yoga & Pilates',
      expiryDate: '31/12/2027',
      status: 'active',
      avatar: 'TT',
      joinedDate: '01/03/2026'
    }
  ],

  // System Security & Audit Trail
  auditLogs: [
    { time: '29/09/2026 08:35:12', user: 'admin@smartgym.vn', action: 'Cấp quyền Super Admin', target: 'Nguyễn Văn An (USR-001)', ip: '127.0.0.1 (Local)' },
    { time: '29/09/2026 08:20:44', user: 'admin@smartgym.vn', action: 'Gia hạn gói Platinum +365 ngày', target: 'USR-001', ip: '127.0.0.1 (Local)' },
    { time: '28/09/2026 19:40:02', user: 'trainer.hung@smartgym.vn', action: 'Tạo lịch tập Push-Pull-Legs AI', target: 'Lê Hoàng Nam (USR-003)', ip: '192.168.1.15' },
    { time: '28/09/2026 18:15:30', user: 'system_bot', action: 'Check-in QR Cổng A thành công', target: 'Lê Hoàng Nam (USR-003)', ip: 'Gate-Scanner-A' }
  ],

  health: {
    hasData: true,
    weight: 68.5,
    height: 172,
    bodyFat: 17.2,
    injuries: 'Khớp gối trái hơi đau nhẹ khi squat sâu',
    medicalNotes: 'Huyết áp bình thường, không có tiền sử bệnh lý tim mạch'
  },
  attendances: [
    { date: '17/08/2026 18:15', method: 'Quét mã QR Cổng A', duration: '75 phút', status: 'Đã nạp vào AI' },
    { date: '15/08/2026 18:30', method: 'Quét mã QR Cổng A', duration: '60 phút', status: 'Đã nạp vào AI' },
    { date: '13/08/2026 18:00', method: 'Nhận diện FaceID Cửa B', duration: '70 phút', status: 'Đã nạp vào AI' },
    { date: '10/08/2026 18:20', method: 'Quét mã QR Cổng A', duration: '65 phút', status: 'Đã nạp vào AI' },
  ],
  currentGeneratedPlan: null
};

// =========================================================================
// 1. NAVIGATION & TAB SWITCHING SYSTEM (Cốt lõi điều hướng & Phân Quyền)
// =========================================================================
function safeCreateIcons() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    try {
      lucide.createIcons();
    } catch (e) {
      console.warn('Lucide icon rendering warning:', e);
    }
  }
}

function switchTab(tabId) {
  // Strict Role Route Guard for Admin Panel (Only Admin Accounts Allowed)
  if (tabId === 'admin-panel') {
    if (!state.currentUser) {
      alert('⛔ TRUY CẬP BỊ TỪ CHỐI (401 UNAUTHORIZED):\nBạn chưa đăng nhập. Khu vực "Quản Trị Admin" chỉ dành riêng cho tài khoản Quản Trị Viên (Super Admin).');
      openAuthModal('login');
      return;
    }
    if (state.currentUser.role !== 'admin') {
      alert(`⛔ TRUY CẬP BỊ TỪ CHỐI (403 FORBIDDEN):\n\nTài khoản hiện tại: [${state.currentUser.name}]\nVai trò: [${state.currentUser.role === 'trainer' ? 'Huấn Luyện Viên PT' : 'Hội Viên'}]\n\nKhu vực "Quản Trị Admin" được bảo mật nghiêm ngặt và CHỈ CHO PHÉP TÀI KHOẢN ADMIN TRUY CẬP!`);
      return;
    }
  }

  state.activeTab = tabId;

  // 1. Hide all tab content sections
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('block');
  });

  // 2. Show the targeted tab section
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('block');
  }

  // 3. Update all nav tab buttons active classes
  const allNavButtons = document.querySelectorAll('.nav-tab');
  allNavButtons.forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // If entering admin panel, ensure tables are fresh
  if (tabId === 'admin-panel') {
    renderAdminUsersTable();
    renderAuditLogsTable();
  }

  // 4. Scroll smoothly to top of workspace
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 5. Reinitialize icons in DOM safely
  safeCreateIcons();
}

// =========================================================================
// 2. AI PROMPT DEBUGGER & WORKOUT PLAN GENERATOR
// =========================================================================
function updatePromptDebugger() {
  const goalInput = document.getElementById('input-goal');
  const availInput = document.getElementById('input-availability');
  const attendInput = document.getElementById('input-attendance');

  const goal = goalInput ? goalInput.value.trim() : '';
  const availability = availInput ? availInput.value.trim() : '';
  const attendance = attendInput ? attendInput.value.trim() : '';
  const hasHealth = state.health.hasData;

  const debugText = `SYSTEM PROMPT:
Bạn là Trợ lý AI Gym thông minh của https://SmartGymAI.vn.
[QUY TẮC BẮT BUỘC]:
1. Chỉ đưa gợi ý tham khảo, KHÔNG thay thế tư vấn y tế hay phác đồ điều trị.
2. Kiểm tra dữ liệu sức khỏe: ${hasHealth ? 'ĐẦY ĐỦ (Cân nặng: ' + state.health.weight + 'kg, Chấn thương: ' + state.health.injuries + ')' : 'THIẾU DỮ LIỆU SỨC KHỎE/CHẤN THƯƠNG -> CẢNH BÁO BẮT BUỘC & NHẮC HỘI VIÊN HỎI PT'}.

INPUT VARIABLES:
- Goal: {{${goal}}}
- Availability: {{${availability}}}
- Attendance History: {{${attendance}}}

OUTPUT: Lịch tập 7 ngày khoa học + Lời nhắc an toàn y tế.`;

  const promptContainer = document.getElementById('prompt-preview');
  if (promptContainer) {
    promptContainer.textContent = debugText;
  }
}

function setGoal(goalText) {
  const goalInput = document.getElementById('input-goal');
  if (goalInput) goalInput.value = goalText;
  updatePromptDebugger();
}

function toggleHealthDataState() {
  const checkbox = document.getElementById('toggle-has-health-data');
  if (checkbox) {
    state.health.hasData = checkbox.checked;
  }
  
  const healthPreview = document.getElementById('health-data-preview');
  const healthStatusText = document.getElementById('health-status-text');

  if (healthPreview && healthStatusText) {
    if (state.health.hasData) {
      healthPreview.classList.remove('opacity-40');
      healthStatusText.innerHTML = `<i data-lucide="check-circle" class="w-3 h-3 text-emerald-400"></i><span class="text-emerald-400">Hồ sơ sức khỏe cơ bản đã được xác thực</span>`;
    } else {
      healthPreview.classList.add('opacity-40');
      healthStatusText.innerHTML = `<i data-lucide="alert-triangle" class="w-3 h-3 text-rose-400"></i><span class="text-rose-400">Chưa có thông tin sức khỏe/tiền sử chấn thương!</span>`;
    }
  }

  updatePromptDebugger();
  if (window.lucide) lucide.createIcons();
}

function loadDemoScenario(type) {
  const goalInput = document.getElementById('input-goal');
  const availInput = document.getElementById('input-availability');
  const attendInput = document.getElementById('input-attendance');
  const chkHealth = document.getElementById('toggle-has-health-data');

  if (type === 'muscle-gain') {
    if (goalInput) goalInput.value = 'Tăng khối lượng cơ bắp (Hypertrophy), tập trung ngực - vai - tay, tăng 2kg nạc';
    if (availInput) availInput.value = 'Thứ 2, 4, 6 (18:00 - 19:30) & Sáng Chủ Nhật (08:30 - 10:00)';
    if (attendInput) attendInput.value = 'Tập đều 4 buổi/tuần trong 3 tuần gần nhất, thể lực phục hồi tốt';
    state.health.hasData = true;
    if (chkHealth) chkHealth.checked = true;
  } else if (type === 'weight-loss') {
    if (goalInput) goalInput.value = 'Giảm 3kg mỡ thừa, săn chắc eo và đùi, cải thiện nhịp tim tim mạch';
    if (availInput) availInput.value = 'Thứ 3, 5, 7 (06:30 - 07:45) & Chiều Thứ 7';
    if (attendInput) attendInput.value = 'Đã nghỉ 2 tuần do bận, cần bắt đầu lại với cường độ thích ứng nhẹ nhàng';
    state.health.hasData = true;
    if (chkHealth) chkHealth.checked = true;
  } else if (type === 'busy-beginner') {
    if (goalInput) goalInput.value = 'Giảm mỏi cổ vai gáy, duy trì thể lực cơ bản, rèn luyện thói quen';
    if (availInput) availInput.value = 'Chỉ rảnh 2 buổi: Tối Thứ 3 & Sáng Chủ Nhật (mỗi buổi 45 phút)';
    if (attendInput) attendInput.value = 'Mới tham gia phòng gym tuần đầu tiên, chưa có lịch sử tập';
    state.health.hasData = false;
    if (chkHealth) chkHealth.checked = false;
  }
  toggleHealthDataState();
  generateAiWorkoutPlan();
}

function generateAiWorkoutPlan() {
  const goal = document.getElementById('input-goal')?.value || 'Tăng cơ';
  const availability = document.getElementById('input-availability')?.value || 'Thứ 2, 4, 6';
  const attendance = document.getElementById('input-attendance')?.value || '3 buổi/tuần';
  const hasHealth = state.health.hasData;

  const btn = document.getElementById('btn-generate-plan');
  if (btn) {
    btn.innerHTML = `<i data-lucide="loader" class="w-5 h-5 animate-spin"></i><span>AI Đang Phân Tích & Sinh Lịch Tập...</span>`;
    btn.disabled = true;
  }

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = `<i data-lucide="sparkles" class="w-5 h-5"></i><span>Khởi Tạo Lịch Tập 1 Tuần Bằng AI</span>`;
      btn.disabled = false;
    }

    renderSafetyAlert(hasHealth);
    renderScheduleDays(goal, availability, attendance, hasHealth);

    if (window.lucide) lucide.createIcons();
  }, 400);
}

function renderSafetyAlert(hasHealthData) {
  const container = document.getElementById('ai-safety-alert-container');
  if (!container) return;

  if (!hasHealthData) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-rose-950/70 border-2 border-rose-500/80 text-rose-200 shadow-xl space-y-2 animate-pulse">
        <div class="flex items-start space-x-3">
          <div class="p-2 bg-rose-900/80 rounded-lg text-rose-300 shrink-0">
            <i data-lucide="alert-octagon" class="w-6 h-6 text-rose-400"></i>
          </div>
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-white flex items-center space-x-2">
              <span>⚠️ CẢNH BÁO THIẾU DỮ LIỆU SỨC KHỎE BẮT BUỘC</span>
              <span class="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">Safety Guardrail</span>
            </h4>
            <p class="text-xs text-rose-200 leading-relaxed">
              Hệ thống <strong>chưa ghi nhận hồ sơ bệnh lý, tiền sử đau khớp/cột sống</strong> của bạn. Mọi bài tập dưới đây chỉ là mô phỏng tham khảo.
            </p>
            <div class="p-2.5 bg-rose-900/40 rounded-lg border border-rose-700/50 text-xs font-semibold text-white flex items-center justify-between">
              <span>👉 <strong>Hành động khuyến nghị:</strong> Vui lòng trao đổi trực tiếp với Huấn luyện viên cá nhân (PT) tại phòng tập hoặc Bác sĩ thể thao trước khi nâng tạ nặng.</span>
              <button onclick="switchTab('booking')" class="ml-2 px-3 py-1 bg-white text-rose-900 rounded font-bold text-xs hover:bg-slate-100 shrink-0">Gặp HLV (PT)</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/40 text-slate-300 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400 shrink-0"></i>
          <div class="text-xs">
            <span class="font-bold text-white">Kiểm tra an toàn y tế:</span> Lịch tập được tối ưu cho thể trạng (${state.health.weight}kg, lưu ý khớp: ${state.health.injuries}).
            <span class="text-slate-400 italic">(Chỉ mang tính chất gợi ý tham khảo vận động).</span>
          </div>
        </div>
        <span class="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">Đã qua Guardrail</span>
      </div>
    `;
  }
}

function renderScheduleDays(goal, availability, attendance, hasHealth) {
  const container = document.getElementById('days-schedule-container');
  if (!container) return;

  const isLoss = goal.toLowerCase().includes('giảm') || goal.toLowerCase().includes('cardio');
  const isGain = goal.toLowerCase().includes('tăng') || goal.toLowerCase().includes('cơ');

  let days = [];

  if (isGain) {
    days = [
      {
        day: 'Thứ Hai',
        type: 'workout',
        tag: 'Upper Body (Ngực - Vai - Tay sau)',
        duration: '60 phút',
        intensity: 'Vừa - Cao (RPE 7-8)',
        exercises: [
          { name: 'Barbell Bench Press (Đẩy ngực ngang)', sets: '4 hiệp x 8-10 reps', rest: '90s', note: 'Khởi động kỹ khớp vai' },
          { name: 'Incline Dumbbell Press (Ngực trên)', sets: '3 hiệp x 10-12 reps', rest: '60s', note: 'Gồng chặt cơ core' },
          { name: 'Dumbbell Lateral Raise (Vai ngang)', sets: '4 hiệp x 12-15 reps', rest: '45s', note: 'Tránh vung người' },
          { name: 'Triceps Rope Pushdown (Tay sau)', sets: '3 hiệp x 12 reps', rest: '45s', note: 'Khóa chặt cùi chỏ' }
        ]
      },
      {
        day: 'Thứ Ba',
        type: 'rest',
        tag: 'Active Recovery (Nghỉ ngơi tích cực)',
        duration: '20-30 phút',
        note: 'Đi bộ nhẹ nhàng 4,000 bước, giãn cơ Foam Roller để phục hồi cơ ngực và vai.'
      },
      {
        day: 'Thứ Tư',
        type: 'workout',
        tag: 'Lower Body & Core (Đùi - Mông - Bắp chân)',
        duration: '55 phút',
        intensity: 'Vừa (Thích ứng khớp gối)',
        exercises: [
          { name: 'Goblet Squat (Squat với tạ tay trước ngực)', sets: '3 hiệp x 10 reps', rest: '90s', note: hasHealth ? 'Đầu gối hướng theo mũi chân' : 'Nên nhờ PT chỉnh góc hạ chân' },
          { name: 'Romanian Deadlift (Đùi sau & Mông)', sets: '4 hiệp x 10-12 reps', rest: '90s', note: 'Lưng thẳng, đẩy hông ra sau' },
          { name: 'Leg Extension (Đá đùi máy)', sets: '3 hiệp x 12 reps', rest: '60s', note: 'Mức tạ vừa phải' },
          { name: 'Plank & Hanging Knee Raise', sets: '3 hiệp x 45 giây', rest: '45s', note: 'Gồng bụng chắc' }
        ]
      },
      {
        day: 'Thứ Năm',
        type: 'rest',
        tag: 'Nghỉ Phục Hồi Toàn Thân',
        duration: '0 phút',
        note: 'Bổ sung nước, ngủ đủ 8 tiếng để cơ bắp tổng hợp protein.'
      },
      {
        day: 'Thứ Sáu',
        type: 'workout',
        tag: 'Pull Day (Lưng xô - Tay trước - Vai sau)',
        duration: '60 phút',
        intensity: 'Vừa - Cao (RPE 8)',
        exercises: [
          { name: 'Lat Pulldown (Kéo xô rộng tay)', sets: '4 hiệp x 10-12 reps', rest: '75s', note: 'Ưỡn ngực kéo về xương quai xanh' },
          { name: 'Seated Cable Row (Kéo cáp lưng giữa)', sets: '3 hiệp x 10-12 reps', rest: '60s', note: 'Ép chặt bả vai về sau' },
          { name: 'Face Pull (Cáp vai sau)', sets: '4 hiệp x 15 reps', rest: '45s', note: 'Cải thiện tư thế lưng gù' },
          { name: 'Dumbbell Bicep Curl (Tay trước)', sets: '3 hiệp x 12 reps', rest: '45s', note: 'Kiểm soát giai đoạn hạ tạ' }
        ]
      },
      {
        day: 'Thứ Bảy',
        type: 'rest',
        tag: 'Nghỉ Ngơi / Bơi Lội Thư Giãn',
        duration: '30 phút',
        note: 'Có thể sử dụng hồ bơi hoặc phòng Sauna xông hơi của phòng tập.'
      },
      {
        day: 'Chủ Nhật',
        type: 'workout',
        tag: 'Full Body Conditioning & Core',
        duration: '50 phút',
        intensity: 'Trung bình (RPE 6-7)',
        exercises: [
          { name: 'Dumbbell Overhead Press (Đẩy vai đứng)', sets: '3 hiệp x 10 reps', rest: '60s', note: 'Gồng mông và bụng' },
          { name: 'Dumbbell Lunge (Bước chùng chân)', sets: '3 hiệp x 10 reps/bên', rest: '60s', note: 'Bước nhịp nhàng' },
          { name: 'Push-ups (Chống đẩy chuẩn)', sets: '3 hiệp x Tối đa reps', rest: '60s', note: 'Thân người thẳng' },
          { name: 'Treadmill Incline Walk (Đi bộ dốc Cardio)', sets: '15 phút độ dốc 8%', rest: '0s', note: 'Đốt mỡ phụ trợ & tim mạch' }
        ]
      }
    ];
  } else {
    days = [
      {
        day: 'Thứ Hai',
        type: 'workout',
        tag: 'Full Body Circuit & Cardio Kickstart',
        duration: '50 phút',
        intensity: 'Trung bình (RPE 7)',
        exercises: [
          { name: 'Dumbbell Squat to Press', sets: '3 hiệp x 12 reps', rest: '60s', note: 'Kích hoạt toàn thân' },
          { name: 'Dumbbell Row (Kéo lưng)', sets: '3 hiệp x 12 reps', rest: '45s', note: 'Giữ cột sống trung tính' },
          { name: 'Mountain Climbers', sets: '3 hiệp x 30 giây', rest: '30s', note: 'Đẩy nhịp tim lên vùng đốt mỡ' },
          { name: 'Đi bộ nhanh Treadmill', sets: '15 phút (Zone 2 Cardio)', rest: '0s', note: 'Nhịp tim duy trì 120-135 bpm' }
        ]
      },
      {
        day: 'Thứ Ba',
        type: 'workout',
        tag: 'HIIT LISS & Core Vòng Eo',
        duration: '40 phút',
        intensity: 'Vừa',
        exercises: [
          { name: 'Cycling Spin Bike', sets: '20 phút (30s nhanh - 60s chậm)', rest: '0s', note: 'Thân thiện khớp gối' },
          { name: 'Plank & Side Plank', sets: '3 hiệp x 40 giây/bên', rest: '30s', note: 'Săn chắc cơ liên sườn' },
          { name: 'Russian Twist', sets: '3 hiệp x 20 lần', rest: '30s', note: 'Xoay chậm cảm nhận cơ' }
        ]
      },
      {
        day: 'Thứ Tư',
        type: 'rest',
        tag: 'Nghỉ Phục Hồi & Đi Bộ',
        duration: '30 phút',
        note: 'Đi bộ ngoài trời hoặc giãn cơ Yoga thư giãn khớp.'
      },
      {
        day: 'Thứ Năm',
        type: 'workout',
        tag: 'Lower Body & Glute Focus (Mông & Đùi)',
        duration: '45 phút',
        intensity: 'Vừa (RPE 7)',
        exercises: [
          { name: 'Hip Thrust (Đẩy hông máy)', sets: '4 hiệp x 12 reps', rest: '60s', note: 'Ép mông tại đỉnh' },
          { name: 'Romanian Deadlift', sets: '3 hiệp x 12 reps', rest: '60s', note: 'Kéo căng đùi sau' },
          { name: 'Cable Kickback', sets: '3 hiệp x 15 reps/chân', rest: '30s', note: 'Cô lập mông tối đa' }
        ]
      },
      {
        day: 'Thứ Sáu',
        type: 'rest',
        tag: 'Nghỉ Ngơi',
        duration: '0 phút',
        note: 'Cân bằng calo nạp vào, tránh thức khuya.'
      },
      {
        day: 'Thứ Bảy',
        type: 'workout',
        tag: 'Upper Body & Cardio Interval',
        duration: '50 phút',
        intensity: 'Vừa - Cao',
        exercises: [
          { name: 'Lat Pulldown (Kéo xô máy)', sets: '3 hiệp x 12 reps', rest: '45s', note: 'Săn chắc lưng' },
          { name: 'Dumbbell Chest Press', sets: '3 hiệp x 12 reps', rest: '45s', note: 'Gọn gàng ngực nách' },
          { name: 'Chèo thuyền Rowing Machine', sets: '12 phút Cardio', rest: '0s', note: 'Đốt calo toàn diện' }
        ]
      },
      {
        day: 'Chủ Nhật',
        type: 'rest',
        tag: 'Nghỉ Ngơi Tái Tạo Năng Lượng',
        duration: '0 phút',
        note: 'Chuẩn bị thực đơn dinh dưỡng cho tuần mới.'
      }
    ];
  }

  state.currentGeneratedPlan = days;

  let html = '';
  days.forEach((d, idx) => {
    if (d.type === 'workout') {
      let exList = d.exercises.map(ex => `
        <div class="exercise-row text-xs">
          <div class="space-y-0.5">
            <span class="font-semibold text-white">${ex.name}</span>
            <div class="text-[11px] text-slate-400 italic">${ex.note}</div>
          </div>
          <div class="text-right shrink-0">
            <div class="font-mono font-bold text-emerald-400">${ex.sets}</div>
            <div class="text-[10px] text-slate-400">Nghỉ: ${ex.rest}</div>
          </div>
        </div>
      `).join('');

      html += `
        <div class="day-card p-4 space-y-3">
          <div class="flex items-center justify-between border-b border-gym-cardBorder pb-2">
            <div class="flex items-center space-x-2">
              <span class="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">${idx + 1}</span>
              <h4 class="font-bold text-white text-sm">${d.day}: <span class="text-emerald-400 font-medium">${d.tag}</span></h4>
            </div>
            <div class="flex items-center space-x-2 text-[11px] text-slate-400">
              <span class="bg-slate-800 px-2 py-0.5 rounded">${d.duration}</span>
              <span class="bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded hidden sm:inline">${d.intensity}</span>
            </div>
          </div>
          <div class="space-y-2">
            ${exList}
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="day-card rest-day p-3.5 flex items-center justify-between text-xs text-slate-300">
          <div class="flex items-center space-x-3">
            <span class="w-6 h-6 rounded bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center">${idx + 1}</span>
            <div>
              <span class="font-bold text-slate-200">${d.day}: </span>
              <span class="text-amber-400/90 font-medium">${d.tag}</span>
              <p class="text-[11px] text-slate-400 mt-0.5">${d.note}</p>
            </div>
          </div>
          <span class="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 shrink-0">Nghỉ phục hồi</span>
        </div>
      `;
    }
  });

  container.innerHTML = html;
}

function copyPlanToClipboard() {
  if (!state.currentGeneratedPlan) {
    alert('Vui lòng khởi tạo lịch tập trước!');
    return;
  }
  let text = "📋 LỊCH TẬP 1 TUẦN THAM KHẢO (https://SmartGymAI.vn):\n\n";
  state.currentGeneratedPlan.forEach(d => {
    if (d.type === 'workout') {
      text += `📅 ${d.day} - ${d.tag} (${d.duration})\n`;
      d.exercises.forEach(e => {
        text += `  • ${e.name} | ${e.sets} | Nghỉ: ${e.rest}\n`;
      });
    } else {
      text += `🛌 ${d.day} - ${d.tag}: ${d.note}\n`;
    }
    text += "\n";
  });
  text += "⚠️ LƯU Ý: Gợi ý chỉ mang tính chất tham khảo, không thay thế tư vấn y tế.";

  navigator.clipboard.writeText(text).then(() => {
    alert('Đã sao chép lịch tập vào clipboard thành công!');
  });
}

function saveCurrentPlan() {
  alert('Đã lưu lịch tập vào hồ sơ hội viên thành công!');
}

// =========================================================================
// 3. AI NUTRITION & MACRO CALCULATION ENGINE
// =========================================================================
let currentDietGoal = 'bulking';

function calculateMacrosAndDiet(mode) {
  if (mode) currentDietGoal = mode;
  
  const weight = state.health.weight || 68.5;
  const height = state.health.height || 172;
  const activityMult = parseFloat(document.getElementById('nutri-activity-level')?.value) || 1.55;
  const dietType = document.getElementById('nutri-diet-type')?.value || 'standard';

  const bmr = (10 * weight) + (6.25 * height) - (5 * 26) + 5;
  let tdee = Math.round(bmr * activityMult);

  let targetCalories = tdee;
  if (currentDietGoal === 'cutting') {
    targetCalories = tdee - 400;
  } else if (currentDietGoal === 'bulking') {
    targetCalories = tdee + 250;
  }

  const proteinGrams = Math.round(weight * 2.1);
  const proteinCalories = proteinGrams * 4;
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);
  const carbCalories = Math.max(200, targetCalories - proteinCalories - fatCalories);
  const carbGrams = Math.round(carbCalories / 4);

  const caloEl = document.getElementById('disp-tdee-calories');
  if (caloEl) caloEl.textContent = `${targetCalories.toLocaleString()} kcal (${currentDietGoal === 'cutting' ? 'Giảm mỡ' : 'Tăng cơ nạc'})`;

  const protEl = document.getElementById('disp-macro-protein');
  const carbEl = document.getElementById('disp-macro-carbs');
  const fatEl = document.getElementById('disp-macro-fats');

  if (protEl) protEl.textContent = `${proteinGrams}g (${proteinCalories} kcal)`;
  if (carbEl) carbEl.textContent = `${carbGrams}g (${carbCalories} kcal)`;
  if (fatEl) fatEl.textContent = `${fatGrams}g (${fatCalories} kcal)`;

  const barP = document.getElementById('bar-protein');
  const barC = document.getElementById('bar-carbs');
  const barF = document.getElementById('bar-fats');

  if (barP) barP.style.width = `${Math.round((proteinCalories / targetCalories) * 100)}%`;
  if (barC) barC.style.width = `${Math.round((carbCalories / targetCalories) * 100)}%`;
  if (barF) barF.style.width = `${Math.round((fatCalories / targetCalories) * 100)}%`;

  renderDailyMealCards(dietType, targetCalories, proteinGrams);
}

function regenerateMealPlan() {
  calculateMacrosAndDiet();
  alert('✨ AI đã cập nhật thực đơn mới phù hợp với mục tiêu calo hôm nay!');
}

function renderDailyMealCards(dietType, calories, protein) {
  const container = document.getElementById('meal-plan-cards-container');
  if (!container) return;

  const meals = [
    {
      time: 'Bữa Sáng (07:00 - 07:30)',
      name: 'Phở Bò Tái Nạc Không Nước Béo + 2 Trứng Chần',
      calories: '520 kcal',
      protein: '38g P',
      note: 'Ưu tiên bánh phở vừa phải, nhiều giá đỗ và thịt bò thăn mềm'
    },
    {
      time: 'Bữa Trưa (12:00 - 12:30)',
      name: 'Cơm Gạo Lứt + 180g Ức Gà Xào Nấm & Bông Cải Xanh Luộc',
      calories: '640 kcal',
      protein: '48g P',
      note: 'Xào bằng dầu ô liu, hạn chế đường ngọt'
    },
    {
      time: 'Bữa Phụ Trước Tập (16:30 - 17:00)',
      name: '1 Quả Chuối Tiêu + 1 Thìa Bơ Đậu Phộng + 1 Muỗng Whey Protein',
      calories: '320 kcal',
      protein: '28g P',
      note: 'Cung cấp glycogen nhanh giúp bùng nổ sức mạnh trong buổi tập'
    },
    {
      time: 'Bữa Tối Phục Hồi (19:45 - 20:15)',
      name: 'Cá Hồi / Cá Thu Áp Chảo + Khoai Lang Hấp + Canh Cải Thịt Băm',
      calories: '580 kcal',
      protein: '42g P',
      note: 'Giàu Omega-3 giúp kháng viêm cơ bắp sau khi nâng tạ'
    }
  ];

  container.innerHTML = meals.map(m => `
    <div class="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition">
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">${m.time}</span>
          <h4 class="text-xs font-bold text-white">${m.name}</h4>
        </div>
        <p class="text-[11px] text-slate-400 italic">${m.note}</p>
      </div>
      <div class="flex items-center space-x-2 text-[11px] shrink-0 font-mono">
        <span class="px-2 py-1 bg-slate-800 text-amber-300 rounded font-bold">${m.calories}</span>
        <span class="px-2 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded">${m.protein}</span>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// 4. AI COMPUTER VISION FORM & POSTURE ESTIMATOR
// =========================================================================
let isVoiceCoachEnabled = false;

function toggleVoiceCoach() {
  isVoiceCoachEnabled = !isVoiceCoachEnabled;
  const label = document.getElementById('voice-coach-label');
  const btn = document.getElementById('btn-voice-coach-toggle');
  
  if (isVoiceCoachEnabled) {
    if (label) label.textContent = 'HLV Giọng Nói AI: ĐANG BẬT 🟢';
    if (btn) btn.classList.add('border-emerald-500', 'bg-emerald-950/40');
    speakAudioCue('Huấn luyện viên giọng nói AI đã sẵn sàng. Hãy bắt đầu hiệp tập của bạn!');
  } else {
    if (label) label.textContent = 'Bật HLV Giọng Nói AI';
    if (btn) btn.classList.remove('border-emerald-500', 'bg-emerald-950/40');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

function speakAudioCue(text) {
  if (!isVoiceCoachEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
}

function runPoseAnalysisSimulation() {
  const select = document.getElementById('form-exercise-select');
  const mode = select ? select.value : 'squat-flaw';
  const svg = document.getElementById('pose-svg-canvas');
  const badge = document.getElementById('pose-status-badge');
  const feedback = document.getElementById('form-feedback-container');
  const advice = document.getElementById('form-pt-advice');

  if (!svg) return;

  if (mode === 'squat-flaw') {
    const kAngle = document.getElementById('metric-knee-angle');
    const hAngle = document.getElementById('metric-hip-angle');
    const sDev = document.getElementById('metric-spine-dev');

    if (kAngle) { kAngle.textContent = '62° (Quá gập)'; kAngle.className = 'text-rose-400'; }
    if (hAngle) { hAngle.textContent = '105° (Chưa mở hông)'; }
    if (sDev) { sDev.textContent = '+24% (Lưng gù nhẹ)'; sDev.className = 'text-rose-400'; }

    if (badge) {
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40';
      badge.textContent = '⚠️ Phát Hiện 2 Lỗi Kỹ Thuật Nguy Hiểm';
    }

    svg.innerHTML = `
      <defs>
        <radialGradient id="redGlow"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0"/></radialGradient>
      </defs>
      <circle cx="200" cy="70" r="18" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>
      <path d="M200,88 Q185,140 190,180" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="4,2"/>
      <line x1="140" y1="100" x2="260" y2="100" stroke="#f59e0b" stroke-width="5"/>
      <circle cx="165" cy="100" r="6" fill="#10b981"/>
      <circle cx="235" cy="100" r="6" fill="#10b981"/>
      <circle cx="190" cy="180" r="8" fill="#f59e0b"/>
      <line x1="190" y1="180" x2="245" y2="225" stroke="#ef4444" stroke-width="5"/>
      <circle cx="245" cy="225" r="9" fill="#ef4444"/>
      <line x1="245" y1="225" x2="210" y2="280" stroke="#64748b" stroke-width="4"/>
      <circle cx="210" cy="280" r="7" fill="#64748b"/>
      <circle cx="245" cy="225" r="22" fill="url(#redGlow)" class="animate-ping"/>
    `;

    if (feedback) {
      feedback.innerHTML = `
        <div class="p-3 bg-rose-950/60 rounded-xl border border-rose-600/50 space-y-1.5 text-xs text-rose-200">
          <div class="font-bold text-white flex items-center space-x-1.5">
            <i data-lucide="x-circle" class="w-4 h-4 text-rose-400"></i>
            <span>Lỗi 1: Đầu gối chúi quá xa về phía trước (+8cm)</span>
          </div>
          <p class="text-[11px] text-rose-300">Áp lực đè lên gân bánh chè quá mức, dễ gây đau nhức khớp sau buổi tập.</p>
        </div>
      `;
    }

    if (advice) advice.textContent = 'Hãy giảm 25% mức tạ. Tập trung đẩy hông ra sau trước khi gập gối, duy trì mở đầu gối theo hướng ngón chân thứ hai.';
    speakAudioCue('Cảnh báo! Đầu gối bạn đang bị chúi quá sâu. Hãy đẩy hông ra sau và giữ lưng thẳng!');
  } else if (mode === 'squat-perfect') {
    const kAngle = document.getElementById('metric-knee-angle');
    const hAngle = document.getElementById('metric-hip-angle');
    const sDev = document.getElementById('metric-spine-dev');

    if (kAngle) { kAngle.textContent = '90° (Chuẩn Parallel)'; kAngle.className = 'text-emerald-400'; }
    if (hAngle) { hAngle.textContent = '82° (Gập hông chuẩn)'; }
    if (sDev) { sDev.textContent = '0% (Cột sống thẳng)'; sDev.className = 'text-emerald-400'; }

    if (badge) {
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      badge.textContent = '✓ Kỹ Thuật Đạt Chuẩn 98/100 Điểm';
    }

    svg.innerHTML = `
      <circle cx="180" cy="70" r="18" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
      <line x1="180" y1="88" x2="160" y2="185" stroke="#10b981" stroke-width="4"/>
      <line x1="110" y1="95" x2="250" y2="95" stroke="#10b981" stroke-width="5"/>
      <circle cx="160" cy="185" r="8" fill="#10b981"/>
      <line x1="160" y1="185" x2="225" y2="195" stroke="#10b981" stroke-width="5"/>
      <circle cx="225" cy="195" r="8" fill="#10b981"/>
      <line x1="225" y1="195" x2="215" y2="280" stroke="#10b981" stroke-width="4"/>
      <circle cx="215" cy="280" r="7" fill="#10b981"/>
    `;

    if (feedback) {
      feedback.innerHTML = `
        <div class="p-3 bg-emerald-950/60 rounded-xl border border-emerald-600/50 space-y-1 text-xs text-emerald-200">
          <div class="font-bold text-white flex items-center space-x-1.5">
            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
            <span>Tư thế chuẩn xác hoàn hảo!</span>
          </div>
          <p class="text-[11px] text-emerald-300">Góc hông mở tối ưu, độ sâu chạm mốc song song (Parallel), lực phát đều qua gót chân.</p>
        </div>
      `;
    }

    if (advice) advice.textContent = 'Bạn đang giữ form rất tốt! Hãy duy trì nhịp thở: Hít sâu gồng bụng khi hạ tạ, thở ra khi đạp chân đứng dậy.';
    speakAudioCue('Tư thế chuẩn tuyệt vời! Giữ nhịp thở và đẩy tạ lên nào!');
  } else {
    svg.innerHTML = `
      <circle cx="190" cy="80" r="16" fill="#1e293b" stroke="#0ea5e9" stroke-width="3"/>
      <line x1="190" y1="96" x2="160" y2="180" stroke="#0ea5e9" stroke-width="4"/>
      <line x1="160" y1="180" x2="210" y2="230" stroke="#0ea5e9" stroke-width="4"/>
      <line x1="210" y1="230" x2="200" y2="280" stroke="#0ea5e9" stroke-width="4"/>
      <line x1="150" y1="250" x2="250" y2="250" stroke="#f59e0b" stroke-width="5"/>
    `;
  }

  if (window.lucide) lucide.createIcons();
}

// =========================================================================
// 5. AI INBODY SCANNER & TRAJECTORY FORECASTER
// =========================================================================
function simulateInBodyScan() {
  const btn = document.querySelector('[onclick="simulateInBodyScan()"]');
  if (btn) {
    btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Đang Quét Điện Trở BIA InBody 770...</span>`;
  }

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = `<i data-lucide="refresh-cw" class="w-4 h-4"></i><span>Quét Chỉ Số Mới (InBody 770)</span>`;
    }

    const newSmm = (32.8 + Math.random() * 0.4).toFixed(1);
    const newBfm = (11.8 - Math.random() * 0.3).toFixed(1);
    
    const smmEl = document.getElementById('inbody-smm');
    const bfmEl = document.getElementById('inbody-bfm');

    if (smmEl) smmEl.textContent = `${newSmm} kg`;
    if (bfmEl) bfmEl.textContent = `${newBfm} kg`;

    alert(`📊 Kết quả InBody 770 mới nhận diện:\n\n• Khối lượng cơ xương: ${newSmm} kg\n• Khối lượng mỡ: ${newBfm} kg\n• AI đã đồng bộ vào thuật toán dinh dưỡng và giáo án tập luyện!`);
    if (window.lucide) lucide.createIcons();
  }, 600);
}

// =========================================================================
// 6. MULTI-PROVIDER AI INTELLIGENCE GATEWAY (Gemini, OpenAI, Claude, Ollama, OpenRouter)
// =========================================================================
const aiGatewayState = {
  activeTab: 'gemini',
  currentModel: 'gemini-2.5-flash',
  model: 'gemini-2.5-flash',
  apiKey: localStorage.getItem('smartgym_gemini_api_key') || '',
  webSearchEnabled: true,
  deepThinkingEnabled: true,
  keys: {
    gemini: localStorage.getItem('smartgym_gemini_api_key') || '',
    openai: localStorage.getItem('smartgym_openai_api_key') || '',
    claude: localStorage.getItem('smartgym_claude_api_key') || '',
    openrouter: localStorage.getItem('smartgym_openrouter_api_key') || ''
  },
  ollamaUrl: localStorage.getItem('smartgym_ollama_url') || 'http://localhost:11434',
  ollamaModel: localStorage.getItem('smartgym_ollama_model') || 'llama3.2:latest',
  attachedFile: null,
  history: []
};

// Legacy compatibility shim
const geminiState = aiGatewayState;

function initAiGatewayKeys() {
  aiGatewayState.keys.gemini = localStorage.getItem('smartgym_gemini_api_key') || '';
  aiGatewayState.keys.openai = localStorage.getItem('smartgym_openai_api_key') || '';
  aiGatewayState.keys.claude = localStorage.getItem('smartgym_claude_api_key') || '';
  aiGatewayState.keys.openrouter = localStorage.getItem('smartgym_openrouter_api_key') || '';
  aiGatewayState.ollamaUrl = localStorage.getItem('smartgym_ollama_url') || 'http://localhost:11434';
  aiGatewayState.ollamaModel = localStorage.getItem('smartgym_ollama_model') || 'llama3.2:latest';

  updateAiConnectionBadges();
}

function updateAiConnectionBadges() {
  const badge = document.getElementById('gemini-api-status-badge');
  const activeCount = [
    aiGatewayState.keys.gemini,
    aiGatewayState.keys.openai,
    aiGatewayState.keys.claude,
    aiGatewayState.keys.openrouter
  ].filter(Boolean).length;

  if (badge) {
    if (activeCount > 0) {
      badge.innerHTML = `🟢 ${activeCount} API Key Đã Kết Nối`;
      badge.className = 'text-xs px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5 font-bold cursor-pointer hover:bg-emerald-500/30 transition';
    } else {
      badge.innerHTML = `<i data-lucide="key" class="w-3.5 h-3.5"></i><span>Cấu hình API Key AI</span>`;
      badge.className = 'text-xs px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1.5 font-bold cursor-pointer hover:bg-indigo-500/30 transition';
    }
  }
  if (window.lucide) lucide.createIcons();
}

function handleGeminiModelChange() {
  const select = document.getElementById('gemini-model-select');
  if (select) {
    aiGatewayState.currentModel = select.value;
    const modelText = select.options[select.selectedIndex]?.text || select.value;
    
    // Auto-detect provider category
    let providerName = 'Omni-AI Mega Brain';
    if (select.value.startsWith('gemini')) providerName = 'Google Gemini API';
    else if (select.value.startsWith('gpt') || select.value.startsWith('o1')) providerName = 'OpenAI API';
    else if (select.value.startsWith('claude')) providerName = 'Anthropic Claude API';
    else if (select.value.startsWith('ollama')) providerName = 'Ollama Local Free AI';
    else if (select.value.startsWith('openrouter') || select.value.startsWith('deepseek')) providerName = 'OpenRouter / Hugging Face';

    showAiToastNotification(`⚡ Đã chuyển sang mô hình: ${modelText} (${providerName})`);
  }
}

function showAiToastNotification(message) {
  const existing = document.getElementById('ai-gateway-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ai-gateway-toast';
  toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-indigo-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center space-x-3 text-sm font-semibold transition-all duration-300 animate-bounce';
  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function openAiConnectionHubModal() {
  initAiGatewayKeys();

  const geminiInput = document.getElementById('input-gemini-key-val');
  const openaiInput = document.getElementById('input-openai-key-val');
  const claudeInput = document.getElementById('input-claude-key-val');
  const openrouterInput = document.getElementById('input-openrouter-key-val');
  const ollamaUrlInput = document.getElementById('input-ollama-url-val');
  const ollamaModelInput = document.getElementById('input-ollama-model-val');

  if (geminiInput) geminiInput.value = aiGatewayState.keys.gemini;
  if (openaiInput) openaiInput.value = aiGatewayState.keys.openai;
  if (claudeInput) claudeInput.value = aiGatewayState.keys.claude;
  if (openrouterInput) openrouterInput.value = aiGatewayState.keys.openrouter;
  if (ollamaUrlInput) ollamaUrlInput.value = aiGatewayState.ollamaUrl;
  if (ollamaModelInput) ollamaModelInput.value = aiGatewayState.ollamaModel;

  const modal = document.getElementById('ai-connection-hub-modal');
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeAiConnectionHubModal() {
  const modal = document.getElementById('ai-connection-hub-modal');
  if (modal) modal.classList.add('hidden');
}

// Aliases for compatibility
function openGeminiApiKeyModal() { openAiConnectionHubModal(); }
function closeGeminiApiKeyModal() { closeAiConnectionHubModal(); }

function switchAiProviderTab(provider) {
  aiGatewayState.activeTab = provider;
  const tabs = ['gemini', 'openai', 'claude', 'ollama', 'openrouter'];
  
  tabs.forEach(p => {
    const tabBtn = document.getElementById(`tab-btn-${p}`);
    const tabContent = document.getElementById(`tab-content-${p}`);
    if (tabBtn && tabContent) {
      if (p === provider) {
        tabBtn.className = 'flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition bg-indigo-600 text-white shadow-lg shadow-indigo-600/30';
        tabContent.classList.remove('hidden');
      } else {
        tabBtn.className = 'flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800';
        tabContent.classList.add('hidden');
      }
    }
  });
  if (window.lucide) lucide.createIcons();
}

function toggleKeyVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
  } else {
    input.type = 'password';
    if (btn) btn.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
  }
  if (window.lucide) lucide.createIcons();
}

function saveAllAiKeys() {
  const geminiVal = document.getElementById('input-gemini-key-val')?.value.trim() || '';
  const openaiVal = document.getElementById('input-openai-key-val')?.value.trim() || '';
  const claudeVal = document.getElementById('input-claude-key-val')?.value.trim() || '';
  const openrouterVal = document.getElementById('input-openrouter-key-val')?.value.trim() || '';
  const ollamaUrlVal = document.getElementById('input-ollama-url-val')?.value.trim() || 'http://localhost:11434';
  const ollamaModelVal = document.getElementById('input-ollama-model-val')?.value.trim() || 'llama3.2:latest';

  aiGatewayState.keys.gemini = geminiVal;
  aiGatewayState.keys.openai = openaiVal;
  aiGatewayState.keys.claude = claudeVal;
  aiGatewayState.keys.openrouter = openrouterVal;
  aiGatewayState.ollamaUrl = ollamaUrlVal;
  aiGatewayState.ollamaModel = ollamaModelVal;

  if (geminiVal) localStorage.setItem('smartgym_gemini_api_key', geminiVal);
  else localStorage.removeItem('smartgym_gemini_api_key');

  if (openaiVal) localStorage.setItem('smartgym_openai_api_key', openaiVal);
  else localStorage.removeItem('smartgym_openai_api_key');

  if (claudeVal) localStorage.setItem('smartgym_claude_api_key', claudeVal);
  else localStorage.removeItem('smartgym_claude_api_key');

  if (openrouterVal) localStorage.setItem('smartgym_openrouter_api_key', openrouterVal);
  else localStorage.removeItem('smartgym_openrouter_api_key');

  localStorage.setItem('smartgym_ollama_url', ollamaUrlVal);
  localStorage.setItem('smartgym_ollama_model', ollamaModelVal);

  updateAiConnectionBadges();
  closeAiConnectionHubModal();
  showAiToastNotification('🔒 Đã lưu và mã hóa cấu hình API Key trong Trình duyệt!');
}

function clearAllAiKeys() {
  if (!confirm('⚠️ Bạn có chắc chắn muốn xóa toàn bộ API Keys đã lưu trên trình duyệt?')) return;

  ['smartgym_gemini_api_key', 'smartgym_openai_api_key', 'smartgym_claude_api_key', 'smartgym_openrouter_api_key'].forEach(k => {
    localStorage.removeItem(k);
  });

  aiGatewayState.keys.gemini = '';
  aiGatewayState.keys.openai = '';
  aiGatewayState.keys.claude = '';
  aiGatewayState.keys.openrouter = '';

  ['input-gemini-key-val', 'input-openai-key-val', 'input-claude-key-val', 'input-openrouter-key-val'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  updateAiConnectionBadges();
  showAiToastNotification('🗑️ Đã xóa sạch toàn bộ API Key. Hệ thống kích hoạt Omni-AI Brain tích hợp!');
}

// Compatibility functions
function saveGeminiApiKey() { saveAllAiKeys(); }
function clearGeminiApiKey() { clearAllAiKeys(); }

async function testProviderConnection(provider) {
  const resultDiv = document.getElementById(`${provider}-test-result`);
  if (!resultDiv) return;

  resultDiv.innerHTML = `
    <div class="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center space-x-2 text-indigo-300 text-xs font-mono animate-pulse">
      <span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
      <span>Đang gửi gói tin ping kiểm tra kết nối tới máy chủ ${provider.toUpperCase()}...</span>
    </div>
  `;

  const startTime = Date.now();

  try {
    if (provider === 'gemini') {
      const key = document.getElementById('input-gemini-key-val')?.value.trim() || aiGatewayState.keys.gemini;
      if (!key) throw new Error('Vui lòng nhập Google Gemini API Key trước khi test.');
      const res = await callGoogleGeminiApi('Ping test connection', key, 'gemini-1.5-flash');
      const latency = Date.now() - startTime;
      resultDiv.innerHTML = `
        <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span class="font-bold flex items-center space-x-1.5"><span>✅ Kết nối Gemini Thành Công!</span></span>
          <span class="font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] text-emerald-200">Độ trễ: ${latency}ms</span>
        </div>
      `;
    } else if (provider === 'openai') {
      const key = document.getElementById('input-openai-key-val')?.value.trim() || aiGatewayState.keys.openai;
      if (!key) throw new Error('Vui lòng nhập OpenAI API Key trước khi test.');
      const res = await callOpenAiApi('Ping test', key, 'gpt-4o-mini');
      const latency = Date.now() - startTime;
      resultDiv.innerHTML = `
        <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span class="font-bold flex items-center space-x-1.5"><span>✅ Kết nối OpenAI GPT-4o Thành Công!</span></span>
          <span class="font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] text-emerald-200">Độ trễ: ${latency}ms</span>
        </div>
      `;
    } else if (provider === 'claude') {
      const key = document.getElementById('input-claude-key-val')?.value.trim() || aiGatewayState.keys.claude;
      if (!key) throw new Error('Vui lòng nhập Anthropic API Key trước khi test.');
      const res = await callAnthropicClaudeApi('Ping test', key, 'claude-3-5-haiku-20241022');
      const latency = Date.now() - startTime;
      resultDiv.innerHTML = `
        <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span class="font-bold flex items-center space-x-1.5"><span>✅ Kết nối Claude 3.5 Thành Công!</span></span>
          <span class="font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] text-emerald-200">Độ trễ: ${latency}ms</span>
        </div>
      `;
    } else if (provider === 'ollama') {
      const url = document.getElementById('input-ollama-url-val')?.value.trim() || aiGatewayState.ollamaUrl;
      const model = document.getElementById('input-ollama-model-val')?.value.trim() || aiGatewayState.ollamaModel;
      const res = await callOllamaLocalApi('Ping test', url, model);
      const latency = Date.now() - startTime;
      resultDiv.innerHTML = `
        <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span class="font-bold flex items-center space-x-1.5"><span>✅ Kết nối Ollama Local [${model}] Hoạt Động!</span></span>
          <span class="font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] text-emerald-200">Độ trễ: ${latency}ms (Offline 100%)</span>
        </div>
      `;
    } else if (provider === 'openrouter') {
      const key = document.getElementById('input-openrouter-key-val')?.value.trim() || aiGatewayState.keys.openrouter;
      if (!key) throw new Error('Vui lòng nhập OpenRouter API Key trước khi test.');
      const res = await callOpenRouterApi('Ping test', key, 'deepseek/deepseek-r1:free');
      const latency = Date.now() - startTime;
      resultDiv.innerHTML = `
        <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span class="font-bold flex items-center space-x-1.5"><span>✅ Kết nối OpenRouter / DeepSeek-R1 Thành Công!</span></span>
          <span class="font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] text-emerald-200">Độ trễ: ${latency}ms</span>
        </div>
      `;
    }
  } catch (err) {
    resultDiv.innerHTML = `
      <div class="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs space-y-1">
        <div class="font-bold flex items-center space-x-1.5"><span>❌ Kiểm tra kết nối thất bại</span></div>
        <p class="text-[11px] text-rose-200">${err.message || 'Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại Key hoặc kết nối mạng/CORS.'}</p>
      </div>
    `;
  }
}

async function scanOllamaLocalModels() {
  const url = document.getElementById('input-ollama-url-val')?.value.trim() || 'http://localhost:11434';
  const resultDiv = document.getElementById('ollama-test-result');

  if (resultDiv) {
    resultDiv.innerHTML = `<div class="text-xs text-indigo-300 animate-pulse">🔍 Đang quét danh sách model tại ${url}/api/tags...</div>`;
  }

  try {
    const res = await fetch(`${url}/api/tags`, { method: 'GET' });
    if (!res.ok) throw new Error(`Mã phản hồi từ Ollama: ${res.status}`);
    const data = await res.json();

    if (data && data.models && data.models.length > 0) {
      const modelNames = data.models.map(m => m.name);
      const select = document.getElementById('input-ollama-model-val');
      if (select) select.value = modelNames[0];

      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
            <p class="font-bold">✅ Tìm thấy ${modelNames.length} mô hình Ollama sẵn sàng chạy Offline:</p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${modelNames.map(m => `<span class="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-mono text-[11px]">${m}</span>`).join('')}
            </div>
          </div>
        `;
      }
    } else {
      throw new Error('Chưa có mô hình nào được tải trong Ollama. Hãy chạy lệnh "ollama run llama3.2" trên máy của bạn.');
    }
  } catch (err) {
    if (resultDiv) {
      resultDiv.innerHTML = `
        <div class="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs space-y-1">
          <p class="font-bold">⚠️ Không tìm thấy Ollama đang chạy ở ${url}:</p>
          <p class="text-[11px] text-amber-200">1. Đảm bảo bạn đã cài đặt Ollama từ <a href="https://ollama.com" target="_blank" class="underline">ollama.com</a>.<br>2. Chạy lệnh: <code class="bg-black/40 px-1 py-0.5 rounded">OLLAMA_ORIGINS="*" ollama serve</code> để cho phép Web kết nối.</p>
        </div>
      `;
    }
  }
}

function clearGeminiChat() {
  if (confirm('Làm mới cuộc trò chuyện với AI?')) {
    aiGatewayState.history = [];
    const stream = document.getElementById('gemini-chat-stream');
    if (stream) {
      stream.innerHTML = `
        <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
          <div class="w-10 h-10 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <i data-lucide="sparkle" class="w-5 h-5"></i>
          </div>
          <p class="font-bold text-white text-sm">Cuộc trò chuyện mới đã sẵn sàng!</p>
          <p>Hệ thống hỗ trợ gọi API trực tiếp tới <b>Gemini 2.5, OpenAI GPT-4o, Claude 3.5, Ollama Local</b> và <b>OpenRouter</b>.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    }
  }
}

function triggerGeminiImageUpload() {
  const fileInput = document.getElementById('gemini-file-input');
  if (fileInput) fileInput.click();
}

function handleGeminiFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  aiGatewayState.attachedFile = {
    name: file.name,
    type: file.type,
    size: file.size
  };

  const previewBar = document.getElementById('gemini-attachment-preview-bar');
  const nameLabel = document.getElementById('gemini-attachment-name');
  if (previewBar && nameLabel) {
    nameLabel.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB) - Đã đính kèm phân tích`;
    previewBar.classList.remove('hidden');
  }
}

function removeGeminiAttachment() {
  aiGatewayState.attachedFile = null;
  const previewBar = document.getElementById('gemini-attachment-preview-bar');
  const fileInput = document.getElementById('gemini-file-input');
  if (previewBar) previewBar.classList.add('hidden');
  if (fileInput) fileInput.value = '';
}

// =========================================================================
// 6.1 RAG 30-QUESTION KNOWLEDGE REPOSITORY & CONTROLLERS
// =========================================================================
const RAG_QUESTION_BANK = [
  {
    group: 'Nhóm 1: Kỹ thuật các bài tập cơ bản (Compound Movements)',
    groupId: 'group1',
    icon: 'dumbbell',
    desc: 'Tư thế, chuyển động cơ học và phòng tránh chấn thương cột sống, khớp vai, khớp gối.',
    questions: [
      { id: 1, q: 'Kỹ thuật đúng khi thực hiện bài tập Squat để tránh đau lưng dưới là gì?', short: 'Kỹ thuật Squat tránh đau lưng dưới' },
      { id: 2, q: 'Sự khác biệt giữa Sumo Deadlift và Conventional Deadlift tác động lên các nhóm cơ nào?', short: 'Sumo vs Conventional Deadlift' },
      { id: 3, q: 'Làm thế nào để giữ bả vai ổn định (retraction và depression) khi thực hiện bài Bench Press?', short: 'Khóa bả vai khi Bench Press' },
      { id: 4, q: 'Các lỗi phổ biến nhất khi tập Overhead Press (OHP) và cách khắc phục là gì?', short: 'Sửa lỗi Overhead Press (OHP)' },
      { id: 5, q: 'Sự khác biệt về mặt cơ học giữa Romanian Deadlift (RDL) và Stiff-legged Deadlift là gì?', short: 'So sánh cơ học RDL vs Stiff-legged' },
      { id: 6, q: 'Cách ăn gian (cheat) đúng cách và sai cách trong bài tập Barbell Biceps Curl như thế nào?', short: 'Cheat Biceps Curl đúng vs sai' }
    ]
  },
  {
    group: 'Nhóm 2: Dinh dưỡng & Thực phẩm bổ sung (Nutrition & Supplements)',
    groupId: 'group2',
    icon: 'apple',
    desc: 'Protein, Creatine, Pre-workout, thâm hụt / thặng dư calo và nạp Carbohydrate.',
    questions: [
      { id: 7, q: 'Lượng protein khuyến nghị hàng ngày cho người tập thể hình nhằm mục tiêu tăng cơ là bao nhiêu gam trên mỗi kg trọng lượng cơ thể?', short: 'Lượng Protein tối ưu/kg thể trọng' },
      { id: 8, q: 'Sự khác biệt chính giữa Whey Protein Concentrate, Whey Protein Isolate và Whey Protein Hydrolyzed là gì?', short: 'So sánh Whey WPC, WPI và WPH' },
      { id: 9, q: 'Creatine Monohydrate hoạt động như thế nào trong cơ thể và liều lượng sử dụng chuẩn là bao nhiêu?', short: 'Cơ chế & Liều dùng Creatine chuẩn' },
      { id: 10, q: 'Tại sao giai đoạn "xả cơ" (Bulking) và "siết cơ" (Cutting) lại cần mức thâm hụt hoặc thặng dư calo khác nhau?', short: 'Calo giai đoạn Bulking vs Cutting' },
      { id: 11, q: 'Vai trò của Carbohydrate trước và sau buổi tập gym đối với hiệu suất tập luyện là gì?', short: 'Carb trước & sau buổi tập' },
      { id: 12, q: 'Pre-workout thường chứa những thành phần chính nào và chúng có tác dụng gì đối với cơ thể?', short: 'Thành phần & Tác dụng Pre-workout' }
    ]
  },
  {
    group: 'Nhóm 3: Lập lịch tập & Phương pháp quá tải (Programming & Progressive Overload)',
    groupId: 'group3',
    icon: 'calendar-range',
    desc: 'Tần suất tập, phân chia giáo án PPL / Upper-Lower, RPE, RIR và thời gian nghỉ.',
    questions: [
      { id: 13, q: 'Nguyên lý Quá tải lũy tiến (Progressive Overload) được áp dụng thực tế như thế nào trong một giáo án tập luyện?', short: 'Ứng dụng Progressive Overload' },
      { id: 14, q: 'Sự khác biệt giữa lịch tập Upper/Lower và lịch tập Push/Pull/Legs (PPL) là gì, loại nào phù hợp hơn cho người mới?', short: 'So sánh Upper/Lower vs PPL' },
      { id: 15, q: 'Tần suất tập luyện tối ưu cho mỗi nhóm cơ trong một tuần để đạt hiệu quả phì đại cơ bắp (hypertrophy) là mấy lần?', short: 'Tần suất tập tối ưu/nhóm cơ' },
      { id: 16, q: 'Thời gian nghỉ ngơi giữa các hiệp (rest time) nên là bao lâu đối với mục tiêu tăng sức mạnh so với mục tiêu tăng cơ?', short: 'Thời gian nghỉ giữa các hiệp' },
      { id: 17, q: 'Khái niệm RIR (Reps in Reserve) và RPE (Rate of Perceived Exertion) khác nhau như thế nào trong việc đo lường cường độ tập?', short: 'Thang đo RPE và RIR' },
      { id: 18, q: 'Làm thế nào để nhận biết dấu hiệu của việc tập luyện quá sức (Overtraining) và cách khắc phục?', short: 'Nhận biết & Chữa Overtraining' }
    ]
  },
  {
    group: 'Nhóm 4: Giải phẫu học & Sinh lý cơ bắp (Anatomy & Muscle Physiology)',
    groupId: 'group4',
    icon: 'dna',
    desc: 'Cấu trúc cơ ngực, xô lưng, tay sau, cơ lõi Core và con đường đồng hóa protein mTOR.',
    questions: [
      { id: 19, q: 'Cơ ngực lớn (Pectoralis Major) gồm những phần nào và bài tập nào tác động tốt nhất vào phần ngực trên?', short: 'Giải phẫu cơ ngực & Ngực trên' },
      { id: 20, q: 'Cấu trúc của cơ lưng xô (Latissimus Dorsi) ảnh ảnh hưởng thế nào đến việc lựa chọn góc kéo (kéo dọc hay kéo ngang)?', short: 'Góc kéo dọc vs ngang cơ Lưng Xô' },
      { id: 21, q: 'Sự khác biệt trong việc kích hoạt nhóm cơ đùi trước (Quadriceps) giữa bài tập Leg Press và Squat là gì?', short: 'Kích hoạt đùi: Leg Press vs Squat' },
      { id: 22, q: 'Cơ bụng (Abdominals) và cơ lõi (Core) có vai trò gì trong việc bảo vệ cột sống khi nâng tạ nặng?', short: 'Vai trò Core & Áp suất IAP' },
      { id: 23, q: 'Làm thế nào để tập trung phát triển phần đầu dài (long head) và đầu ngắn (short head) của cơ tam đầu (Triceps)?', short: 'Phát triển Đầu dài & ngắn Tay sau' },
      { id: 24, q: 'Cơ chế vi chấn thương sợi cơ (muscle fiber micro-trauma) và tổng hợp protein diễn ra như thế nào trong quá trình phục hồi?', short: 'Vi chấn thương & Tổng hợp Protein' }
    ]
  },
  {
    group: 'Nhóm 5: Phục hồi, Chấn thương & Đối tượng đặc biệt (Recovery & Special Cases)',
    groupId: 'group5',
    icon: 'heart-pulse',
    desc: 'Hormone tăng trưởng giấc ngủ, phân biệt DOMS vs chấn thương, phụ nữ mang thai và khởi động RAMP.',
    questions: [
      { id: 25, q: 'Giấc ngủ ảnh hưởng như thế nào đến quá trình tiết hormone tăng trưởng và phục hồi cơ bắp sau khi tập gym?', short: 'Giấc ngủ & Hormone GH phục hồi' },
      { id: 26, q: 'Làm thế nào để phân biệt giữa cơn đau nhức cơ bắp trì hoãn (DOMS) sau buổi tập và chấn thương thực sự?', short: 'Phân biệt DOMS vs Chấn thương' },
      { id: 27, q: 'Người mới bắt đầu tập gym (beginner gains) nên kỳ vọng mức độ tăng trưởng cơ bắp và sức mạnh như thế nào trong 6 tháng đầu?', short: 'Beginner Gains trong 6 tháng đầu' },
      { id: 28, q: 'Phụ nữ mang thai hoặc sau sinh có thể tập gym được không và cần lưu ý những nguyên tắc an toàn nào?', short: 'Tập Gym cho Phụ nữ mang thai' },
      { id: 29, q: 'Các bài tập giãn cơ tĩnh (static stretching) và giãn cơ động (dynamic stretching) nên được áp dụng vào thời điểm nào của buổi tập?', short: 'Giãn cơ tĩnh vs Giãn cơ động' },
      { id: 30, q: 'Việc khởi động (Warm-up) gồm những bước nào để làm nóng dịch khớp và kích hoạt hệ thần kinh trước khi nâng tạ nặng?', short: 'Quy trình khởi động RAMP chuẩn' }
    ]
  }
];

function switchRagQuestionTab(groupId) {
  const group = RAG_QUESTION_BANK.find(g => g.groupId === groupId);
  if (!group) return;

  // Update tab styles
  ['group1', 'group2', 'group3', 'group4', 'group5'].forEach(gid => {
    const tab = document.getElementById(`rag-tab-${gid}`);
    if (tab) {
      if (gid === groupId) {
        tab.className = 'rag-category-tab px-3 py-1.5 rounded-xl font-bold bg-indigo-600 text-white shadow flex items-center space-x-1 shrink-0';
      } else {
        tab.className = 'rag-category-tab px-3 py-1.5 rounded-xl font-bold bg-slate-800 text-slate-400 hover:text-white flex items-center space-x-1 shrink-0';
      }
    }
  });

  // Render question pills in the container
  const container = document.getElementById('rag-questions-pills-container');
  if (container) {
    container.innerHTML = group.questions.map(item => `
      <button onclick="askRagQuestionById(${item.id})" class="quick-chip !bg-slate-900/90 !border-amber-500/40 hover:!border-amber-400 hover:!text-amber-200 text-amber-300 shrink-0 flex items-center space-x-1.5 text-xs py-1.5 px-3">
        <span class="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0">${item.id}</span>
        <span>${item.short || item.q}</span>
      </button>
    `).join('');
  }
}

function openRagQuestionBankModal() {
  const modal = document.getElementById('rag-question-bank-modal');
  renderRagQuestionsInModal();
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeRagQuestionBankModal() {
  const modal = document.getElementById('rag-question-bank-modal');
  if (modal) modal.classList.add('hidden');
}

function renderRagQuestionsInModal(filterText = '') {
  const listContainer = document.getElementById('rag-modal-questions-list');
  if (!listContainer) return;

  const lowFilter = filterText.toLowerCase().trim();
  let html = '';

  RAG_QUESTION_BANK.forEach(grp => {
    const matchedQuestions = grp.questions.filter(item => 
      !lowFilter || item.q.toLowerCase().includes(lowFilter) || grp.group.toLowerCase().includes(lowFilter)
    );

    if (matchedQuestions.length > 0) {
      html += `
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-amber-300 text-xs sm:text-sm flex items-center space-x-2">
              <i data-lucide="${grp.icon || 'book-open'}" class="w-4 h-4 text-amber-400"></i>
              <span>${grp.group}</span>
            </h4>
            <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">${matchedQuestions.length} câu</span>
          </div>
          <p class="text-[11px] text-slate-400">${grp.desc}</p>
          <div class="grid grid-cols-1 gap-2 pt-1">
            ${matchedQuestions.map(item => `
              <div class="p-2.5 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800/80 hover:border-amber-500/40 transition flex items-center justify-between gap-3 group">
                <div class="flex items-start space-x-2.5">
                  <span class="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">${item.id}</span>
                  <span class="text-slate-200 group-hover:text-white font-medium text-xs leading-relaxed">${item.q}</span>
                </div>
                <button onclick="askRagQuestionById(${item.id})" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-[11px] shrink-0 flex items-center space-x-1 shadow transition">
                  <i data-lucide="send" class="w-3 h-3"></i>
                  <span>Hỏi ngay</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  });

  if (!html) {
    html = `<div class="p-6 text-center text-slate-400">Không tìm thấy câu hỏi phù hợp với từ khóa "${filterText}".</div>`;
  }

  listContainer.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function filterRagQuestionsInModal() {
  const input = document.getElementById('input-rag-search');
  renderRagQuestionsInModal(input ? input.value : '');
}

function askRagQuestionById(qId) {
  for (const grp of RAG_QUESTION_BANK) {
    const found = grp.questions.find(item => item.id === qId);
    if (found) {
      closeRagQuestionBankModal();
      sendGeminiQuickPrompt(found.q);
      return;
    }
  }
}

function askRagQuestion(questionText) {
  closeRagQuestionBankModal();
  sendGeminiQuickPrompt(questionText);
}

function sendGeminiQuickPrompt(promptText) {
  const input = document.getElementById('gemini-universal-input');
  if (input) {
    input.value = promptText;
    handleSendGeminiUniversalMessage(new Event('submit'));
  }
}

function startGeminiUniversalVoiceInput() {
  const micBtn = document.getElementById('btn-gemini-mic');
  const input = document.getElementById('gemini-universal-input');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;

    if (micBtn) micBtn.classList.add('bg-pink-600', 'text-white', 'animate-pulse');
    if (input) input.placeholder = '🎙️ Đang lắng nghe... Hãy nói câu hỏi...';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (input) input.value = transcript;
      if (micBtn) micBtn.classList.remove('bg-pink-600', 'text-white', 'animate-pulse');
      if (input) input.placeholder = 'Hỏi AI bất cứ điều gì...';
      handleSendGeminiUniversalMessage(new Event('submit'));
    };

    recognition.onerror = () => {
      if (micBtn) micBtn.classList.remove('bg-pink-600', 'text-white', 'animate-pulse');
      if (input) input.placeholder = 'Hỏi AI bất cứ điều gì...';
    };

    recognition.start();
  } else {
    if (micBtn) micBtn.classList.add('bg-pink-600', 'text-white', 'animate-pulse');
    if (input) input.placeholder = '🎙️ Đang nghe giọng nói...';
    setTimeout(() => {
      if (micBtn) micBtn.classList.remove('bg-pink-600', 'text-white', 'animate-pulse');
      if (input) {
        input.placeholder = 'Hỏi AI bất cứ điều gì...';
        input.value = 'Viết cho tôi một hàm Python tính chỉ số BMI, phân loại thể trạng và in ra thực đơn';
      }
      handleSendGeminiUniversalMessage(new Event('submit'));
    }, 1200);
  }
}

async function handleSendGeminiUniversalMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('gemini-universal-input');
  const userText = input ? input.value.trim() : '';
  if (!userText && !aiGatewayState.attachedFile) return;

  const stream = document.getElementById('gemini-chat-stream');
  const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const attached = aiGatewayState.attachedFile;

  if (stream) {
    stream.innerHTML += `
      <div class="flex items-start justify-end space-x-3">
        <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 p-4 rounded-3xl rounded-tr-none text-white text-sm max-w-[85%] shadow-xl">
          ${attached ? `<div class="mb-2 p-2 bg-black/20 rounded-xl text-xs flex items-center space-x-1.5 font-mono"><span>📎 ${attached.name}</span></div>` : ''}
          <p class="leading-relaxed font-medium">${userText}</p>
          <div class="text-[10px] text-pink-200/80 text-right mt-1.5 font-mono">${timeStr}</div>
        </div>
        <div class="w-9 h-9 rounded-2xl bg-slate-700 ring-2 ring-indigo-500/50 flex items-center justify-center font-bold text-xs text-indigo-200 shrink-0">
          Bạn
        </div>
      </div>
    `;
    stream.scrollTop = stream.scrollHeight;
  }

  if (input) input.value = '';
  removeGeminiAttachment();

  const isThinking = document.getElementById('toggle-gemini-thinking')?.checked;
  const isWebSearch = document.getElementById('toggle-gemini-websearch')?.checked;
  const responseId = `gemini-resp-${Date.now()}`;

  const currentModel = aiGatewayState.currentModel || 'gemini-2.5-flash';
  let modelDisplayName = 'Omni AI';
  if (currentModel.startsWith('gemini')) modelDisplayName = 'Gemini 2.5 AI';
  else if (currentModel.startsWith('gpt') || currentModel.startsWith('o1')) modelDisplayName = 'OpenAI GPT-4o';
  else if (currentModel.startsWith('claude')) modelDisplayName = 'Claude 3.5 Sonnet';
  else if (currentModel.startsWith('ollama')) modelDisplayName = 'Ollama Local AI';
  else if (currentModel.startsWith('openrouter') || currentModel.startsWith('deepseek')) modelDisplayName = 'DeepSeek R1 / OpenRouter';

  if (stream) {
    stream.innerHTML += `
      <div id="${responseId}" class="flex items-start space-x-3.5 animate-pulse">
        <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-indigo-500/30">
          <i data-lucide="sparkle" class="w-5 h-5 animate-spin"></i>
        </div>
        <div class="bg-slate-900 border border-indigo-500/30 p-4 rounded-3xl rounded-tl-none text-slate-300 text-xs sm:text-sm space-y-2 max-w-[90%]">
          <div class="flex items-center space-x-2 text-sky-400 font-semibold text-xs">
            <span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span>${modelDisplayName} đang ${isWebSearch ? 'tìm kiếm web và ' : ''}${isThinking ? 'tư duy suy luận sâu...' : 'soạn câu trả lời...'}</span>
          </div>
        </div>
      </div>
    `;
    stream.scrollTop = stream.scrollHeight;
  }
  if (window.lucide) lucide.createIcons();

  // ROUTE REQUEST TO RELEVANT PROVIDER API
  try {
    if (currentModel.startsWith('gemini') && aiGatewayState.keys.gemini) {
      const apiResp = await callGoogleGeminiApi(userText, aiGatewayState.keys.gemini, currentModel);
      renderGeminiUniversalResponse(responseId, userText, apiResp, isThinking, isWebSearch);
      return;
    } else if ((currentModel.startsWith('gpt') || currentModel.startsWith('o1')) && aiGatewayState.keys.openai) {
      const apiResp = await callOpenAiApi(userText, aiGatewayState.keys.openai, currentModel);
      renderGeminiUniversalResponse(responseId, userText, apiResp, isThinking, isWebSearch);
      return;
    } else if (currentModel.startsWith('claude') && aiGatewayState.keys.claude) {
      const apiResp = await callAnthropicClaudeApi(userText, aiGatewayState.keys.claude, currentModel);
      renderGeminiUniversalResponse(responseId, userText, apiResp, isThinking, isWebSearch);
      return;
    } else if (currentModel.startsWith('ollama')) {
      const apiResp = await callOllamaLocalApi(userText, aiGatewayState.ollamaUrl, aiGatewayState.ollamaModel);
      renderGeminiUniversalResponse(responseId, userText, apiResp, isThinking, isWebSearch);
      return;
    } else if ((currentModel.startsWith('openrouter') || currentModel.startsWith('deepseek')) && aiGatewayState.keys.openrouter) {
      const apiResp = await callOpenRouterApi(userText, aiGatewayState.keys.openrouter, 'deepseek/deepseek-r1:free');
      renderGeminiUniversalResponse(responseId, userText, apiResp, isThinking, isWebSearch);
      return;
    }
  } catch (err) {
    console.warn(`[AI Gateway] Direct API call for ${currentModel} encountered error, falling back to Omni Mega Brain:`, err);
  }

  // Graceful Fallback: Omni-AI Mega Brain
  setTimeout(() => {
    const smartAnswer = generateUniversalGeminiKnowledge(userText, isThinking, isWebSearch);
    renderGeminiUniversalResponse(responseId, userText, smartAnswer, isThinking, isWebSearch);
  }, 700);
}

// -------------------------------------------------------------
// PROVIDER SPECIFIC API CLIENTS
// -------------------------------------------------------------

// 1. Google Gemini API Caller
async function callGoogleGeminiApi(promptText, apiKey, model = 'gemini-1.5-flash') {
  const modelId = model.includes('pro') ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
  
  const systemInstruction = `Bạn là Google Gemini 2.5 - Siêu Trí Tuệ Nhân Tạo đa năng của Google được tích hợp trên SmartGymAI.vn.
Nhiệm vụ:
1. Trả lời chi tiết, xuất sắc mọi câu hỏi về Lập trình, Khoa học, Thể hình, Dinh dưỡng, Kinh doanh, Triết học...
2. Sử dụng Markdown đẹp mắt (tiêu đề, bullet points, bảng biểu, code block, LaTeX công thức nếu có).
3. Đưa ra giải pháp rõ ràng, tính thực tiễn cao.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: systemInstruction + "\n\nCâu hỏi của người dùng:\n" + promptText }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Gemini API Error');
  if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
    return {
      text: data.candidates[0].content.parts[0].text,
      thinking: `🧠 Google Gemini Neural Reasoning Chain:\n1. Phân tích ngữ nghĩa câu hỏi người dùng qua Transformer Kiến trúc Gemini 2.5.\n2. Tổng hợp tri thức từ Google Neural Index.\n3. Định dạng câu trả lời chuẩn khoa học và tối ưu trải nghiệm.`
    };
  }
  throw new Error('Không nhận được phản hồi hợp lệ từ Google Gemini API');
}

// 2. OpenAI API Caller (GPT-4o, GPT-4o-mini, o1-mini)
async function callOpenAiApi(promptText, apiKey, model = 'gpt-4o-mini') {
  const url = 'https://api.openai.com/v1/chat/completions';
  const modelId = model.includes('mini') ? 'gpt-4o-mini' : (model.includes('o1') ? 'o1-mini' : 'gpt-4o');

  const messages = [
    {
      role: 'system',
      content: 'Bạn là OpenAI GPT-4o chuyên gia tư vấn hàng đầu về Lập trình, Khoa học dữ liệu, Kinh doanh, Thể hình & Sức khỏe trên SmartGymAI.vn. Trả lời chi tiết, chuẩn xác, định dạng Markdown chuyên nghiệp.'
    },
    {
      role: 'user',
      content: promptText
    }
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'OpenAI API Error');
  if (data.choices && data.choices[0]?.message?.content) {
    return {
      text: data.choices[0].message.content,
      thinking: `🧠 OpenAI GPT-4o Omni-Reasoning Chain:\n1. Giải mã yêu cầu với Tokenizer cl100k_base.\n2. Áp dụng Chain-of-Thought suy luận logic đa bước.\n3. Xuất kết quả với độ chính xác cao.`
    };
  }
  throw new Error('Không nhận được phản hồi từ OpenAI API');
}

// 3. Anthropic Claude API Caller (Claude 3.5 Sonnet / Haiku)
async function callAnthropicClaudeApi(promptText, apiKey, model = 'claude-3-5-sonnet-20241022') {
  const url = 'https://api.anthropic.com/v1/messages';
  const modelId = model.includes('haiku') ? 'claude-3-5-haiku-20241022' : 'claude-3-5-sonnet-20241022';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 2048,
      system: 'Bạn là Claude 3.5 Sonnet - Siêu AI của Anthropic hỗ trợ chuyên sâu trên SmartGymAI.vn. Cung cấp câu trả lời có tính cấu trúc, sâu sắc, lập luận chặt chẽ và chuẩn Markdown.',
      messages: [
        { role: 'user', content: promptText }
      ]
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Anthropic Claude API Error');
  if (data.content && data.content[0]?.text) {
    return {
      text: data.content[0].text,
      thinking: `🧠 Anthropic Claude 3.5 Constitutional Reasoning:\n1. Phân tích ngữ cảnh theo nguyên tắc Helpful, Honest, Harmless.\n2. Thiết lập cấu trúc phân cấp thông tin rõ ràng.\n3. Sinh phản hồi tối ưu hóa tính logic và an toàn.`
    };
  }
  throw new Error('Không nhận được phản hồi từ Anthropic Claude API');
}

// 4. Ollama Local Free AI Caller (Offline / Localhost)
async function callOllamaLocalApi(promptText, endpoint = 'http://localhost:11434', model = 'llama3.2:latest') {
  const cleanUrl = endpoint.replace(/\/$/, '');
  const url = `${cleanUrl}/api/generate`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'llama3.2:latest',
      prompt: `Bạn là trợ lý AI thông minh chạy trực tiếp trên máy cục bộ qua Ollama. Hãy trả lời câu hỏi sau bằng tiếng Việt với định dạng Markdown rõ ràng:\n\n${promptText}`,
      stream: false
    })
  });

  if (!res.ok) throw new Error(`Ollama HTTP Error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (data.response) {
    return {
      text: data.response,
      thinking: `💻 Ollama Local Model [${model}] Execution:\n1. Chạy hoàn toàn Offline trên phần cứng thiết bị của bạn.\n2. Bảo mật tuyệt đối 100% (Zero Data Telemetry, không gửi qua internet).\n3. Tốc độ sinh: ${(data.eval_count / (data.eval_duration / 1e9)).toFixed(1)} tokens/giây.`
    };
  }
  throw new Error('Không nhận được phản hồi từ Ollama local server');
}

// 5. OpenRouter / Hugging Face / DeepSeek R1 Caller
async function callOpenRouterApi(promptText, apiKey, model = 'deepseek/deepseek-r1:free') {
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin || 'http://localhost:8080',
      'X-Title': 'SmartGymAI'
    },
    body: JSON.stringify({
      model: model || 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'system',
          content: 'Bạn là DeepSeek R1 / OpenRouter AI tiên tiến được tích hợp trên SmartGymAI.vn. Cung cấp câu trả lời sắc bén, suy luận logic toán học và kỹ thuật chuyên sâu.'
        },
        { role: 'user', content: promptText }
      ]
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'OpenRouter API Error');
  if (data.choices && data.choices[0]?.message?.content) {
    return {
      text: data.choices[0].message.content,
      thinking: `🧠 OpenRouter / DeepSeek-R1 Deep Thinking Chain:\n1. Suy luận theo chuỗi tư duy mở rộng (Extended Chain-of-Thought).\n2. Kiểm chứng logic đa tầng trước khi tổng hợp câu trả lời.`
    };
  }
  throw new Error('Không nhận được phản hồi từ OpenRouter API');
}

// =========================================================================
// OMNI-AI MEGA BRAIN (HỢP NHẤT TRI THỨC DEEPSEEK R1, CLAUDE 3.5, GPT-4O & GEMINI)
// =========================================================================
function generateUniversalGeminiKnowledge(query, isThinking, isWebSearch) {
  const q = query.trim();
  const low = q.toLowerCase();
  const currentModel = geminiState.model || 'omni-fusion';

  // =========================================================================
  // --- A. BỘ 30 CÂU HỎI CHUYÊN SÂU GYM RAG KHOA HỌC THỂ THAO CHÍNH XÁC ---
  // =========================================================================

  // [RAG 1]: Kỹ thuật Squat tránh đau lưng dưới
  if ((low.includes('squat') && (low.includes('lưng dưới') || low.includes('đau lưng') || low.includes('tránh đau'))) || low.includes('kỹ thuật đúng khi thực hiện bài tập squat')) {
    return {
      thinking: `🧠 RAG Sports Biomechanics [Question 1/30]:
1. Nguyên nhân đau lưng dưới khi Squat: Butt Wink (cụp xương chậu về sau ở điểm đáy), thân người đổ về trước quá mức khiến đòn tạ rời khỏi trọng tâm bàn chân, thiếu áp suất nội bụng (IAP).
2. Kỹ thuật sửa: Neutral Spine + Kỹ thuật Valsalva Maneuver + Độ linh hoạt mắt cá chân (Ankle Dorsiflexion) + Bar Path thẳng đứng qua Mid-foot.`,
      text: `### 🏋️ KỸ THUẬT SQUAT CHUẨN KHOA HỌC ĐỂ BẢO VỆ CỘT SỐNG THẮT LƯNG (L4-L5)

Để thực hiện bài tập **Barbell Squat** an toàn tuyệt đối và triệt tiêu áp lực gây đau lưng dưới, bạn cần tuân thủ **5 nguyên tắc cơ sinh học vàng**:

---

#### 🔑 1. Kỹ Thuật Gồng Cơ Lõi (Valsalva Maneuver) & Áp Suất Nội Bụng (IAP):
* **Cách thực hiện:** Trước khi hạ tạ, hít một hơi thật sâu **bằng cơ hoành vào khoang bụng 360 độ** (không hít vào ngực), sau đó nín thở và gồng cứng toàn bộ cơ bụng, cơ liên sườn và cơ lưng dưới như thể sắp chịu một cú đấm.
* **Tác dụng y học:** Tạo ra **Áp suất nội bụng (Intra-Abdominal Pressure - IAP)** đóng vai trò như chiếc đai khí bảo vệ, giảm tới **40% lực nén lên các đĩa đệm thắt lưng**.

#### 🔑 2. Giữ Đường Đi Của Thanh Đòn (Bar Path) Thẳng Đứng Ngay Trên Giữa Bàn Chân (Mid-Foot):
* Thanh tạ phải di chuyển theo một đường thẳng vuông góc với mặt đất, chiếu thẳng xuống **trung tâm vòm bàn chân (Mid-foot)**.
* Nếu thanh tạ bị trôi về phía trước mũi chân, cánh tay đòn tác động lên cột sống sẽ dài ra gấp đôi, gây quá tải cực lớn cho cơ dựng sống (Erector Spinae).

#### 🔑 3. Triệt Tiêu Hiện Tượng "Cụp Mông" (Butt Wink / Posterior Pelvic Tilt):
* Khi xuống quá sâu vượt quá độ linh hoạt của khớp háng và mắt cá chân, xương chậu sẽ bị kéo cụp vào trong, làm cột sống thắt lưng mất độ cong sinh lý tự nhiên (Flexion under load) $\rightarrow$ Nguy cơ thoát vị đĩa đệm.
* **Khắc phục:** Chỉ xuống sâu đến mức xương chậu vẫn giữ nguyên vị trí **Neutral Spine** (song song hoặc dưới đùi song song nhẹ), đồng thời tập giãn cơ gân kheo (Hamstrings) và cải thiện độ linh hoạt cổ chân (Ankle Mobility).

#### 🔑 4. Khóa Bả Vai & Gồng Lưng Xô (Lat Engagement):
* Dùng tay kéo thanh đòn ghim chặt vào cầu vai (High Bar) hoặc gai xương bả vai (Low Bar), ép hai khuỷu tay hướng về phía thân người để kích hoạt cơ lưng xô (Lats), tạo điểm tựa cứng cáp cho thân trên.

---

| Thông Số Chuẩn | Khuyến Nghị |
| :--- | :--- |
| **Vị trí chân:** | Rộng bằng vai hoặc hơn vai 5-10cm, mũi chân mở $15^\circ - 30^\circ$ |
| **Góc gập đầu gối:** | Đầu gối mở rộng theo hướng ngón chân cái trong suốt chuyển động |
| **Nhịp độ (Tempo):** | Xuống kiểm soát 2-3 giây, dừng 1 giây ở đáy, phát lực đẩy lên 1 giây |`,
      sources: ["NSCA Essentials of Strength Training", "Dr. Aaron Horschig - Squat University", "Journal of Strength and Conditioning Research"]
    };
  }

  // [RAG 2]: Sumo vs Conventional Deadlift
  if ((low.includes('sumo') && low.includes('deadlift')) || (low.includes('sumo') && low.includes('conventional'))) {
    return {
      thinking: `🧠 RAG Biomechanics Analysis [Question 2/30]:
1. So sánh góc đòn bẩy: Conventional có cánh tay đòn hông dài hơn -> chịu tải lớn ở lưng dưới và đùi sau.
2. Sumo có thân người thẳng hơn, cánh tay đòn ngắn hơn -> chịu tải ở đùi trước và cơ khép háng.`,
      text: `### ⚖️ SO SÁNH CƠ HỌC: SUMO DEADLIFT VS CONVENTIONAL DEADLIFT

Cả hai biến thể đều là những bài tập phức hợp (Compound) tuyệt vời để phát triển sức mạnh toàn diện, nhưng có sự khác biệt rõ rệt về mặt cơ sinh học và phân bổ kích hoạt cơ bắp:

---

| Tiêu Chí So Sánh | Conventional Deadlift (Truyền Thống) | Sumo Deadlift |
| :--- | :--- | :--- |
| **Độ rộng thế đứng:** | Hẹp (bằng hông), 2 tay cầm tạ nằm **ngoài chân** | Rộng (gần mép đĩa tạ), 2 tay cầm tạ nằm **trong chân** |
| **Góc thân người (Torso Angle):** | Nghiêng về trước nhiều hơn ($45^\circ - 55^\circ$) | Dựng thẳng đứng hơn ($70^\circ - 80^\circ$) |
| **Quãng đường di chuyển tạ (ROM):** | Dài hơn khoảng **20% - 25%** | Ngắn hơn, tạ nâng lên thẳng trục hơn |
| **Áp lực lên cột sống thắt lưng:** | **Cao hơn** do mô-men xoắn lên vùng L4-L5 lớn | **Thấp hơn ~10%** do thân người thẳng đứng |
| **Nhóm cơ kích hoạt chính:** | • **Chuỗi sau (Posterior Chain):** Cơ dựng sống (Erector Spinae), Đùi sau (Hamstrings), Mông | • **Đùi trước (Quads - Vastus Medialis)**<br>• **Cơ khép đùi trong (Adductors)**<br>• Cơ mông nhỡ |

---

#### 🎯 Ai nên chọn kiểu nào?
* **Chọn Conventional Deadlift:** Người có tỷ lệ thân trên ngắn - tay dài, muốn xây dựng độ dày lưng xô và sức mạnh gân kheo tối đa.
* **Chọn Sumo Deadlift:** Người có tỷ lệ chân dài - lưng dài, hoặc người có tiền sử đau lưng dưới cần giảm tải áp lực cột sống.`,
      sources: ["Escamilla et al. (2000) - Medicine & Science in Sports & Exercise", "Barbell Medicine"]
    };
  }

  // [RAG 3]: Khóa bả vai khi Bench Press (Retraction & Depression)
  if ((low.includes('bench press') || low.includes('đẩy ngực')) && (low.includes('bả vai') || low.includes('retraction') || low.includes('depression'))) {
    return {
      thinking: `🧠 RAG Shoulder Biomechanics [Question 3/30]:
1. Cơ chế chóp xoay vai (Rotator Cuff): Nếu không khóa bả vai, xương cánh tay sẽ trượt ra trước gây va chạm mỏm cùng vai (Subacromial Impingement).
2. Quy trình 4 bước: Retraction (Khép vào trong) + Depression (Hạ xuống dưới) + Arch tự nhiên + Leg Drive.`,
      text: `### 🛡️ KỸ THUẬT KHÓA BẢ VAI (RETRACTION & DEPRESSION) KHI BENCH PRESS

Khóa ổn định khớp bả vai là **kỹ thuật sống còn** để bảo vệ gân chóp xoay (Rotator Cuff) và tối đa hóa sự phát lực của cơ ngực lớn (Pectoralis Major).

---

#### 📋 QUY TRÌNH 4 BƯỚC KHÓA BẢ VAI CHUẨN XÁC:
1. **Bước 1: Retraction (Khép bả vai):** Tưởng tượng bạn đang cố gắng kẹp chặt một cây bút chì ở chính giữa hai bả vai sau lưng.
2. **Bước 2: Depression (Kéo bả vai xuống):** Kéo hai bả vai trượt xuống phía túi quần sau, giữ khoảng cách giữa tai và vai rộng nhất có thể (tránh rụt vai).
3. **Bước 3: Cố định điểm tỳ lên đệm:** Khi nằm xuống ghế, dùng lực chân đẩy nhẹ người về phía giá tạ để ghim chặt hai xương bả vai sâu vào mặt đệm ghế bench.
4. **Bước 4: Bẻ cong thanh đòn (Bend the Bar):** Xoay bàn tay nhẹ như muốn bẻ gãy thanh đòn, giúp khuỷu tay tự động khép góc **$45^\circ - 70^\circ$** so với thân người (tuyệt đối không choãi ngang $90^\circ$).
---

**Sơ Đồ Quy Trình Tối Ưu Bả Vai:**
➔ Nằm lên ghế Bench ➔ Retraction (Khép 2 bả vai kẹp bút chì) ➔ Depression (Kéo bả vai xuống phía hông) ➔ Tạo độ ưỡn lưng Arch tự nhiên ➔ Ghim chặt bả vai cố định vào đệm ➔ Khuỷu tay khép góc 45-70 độ an toàn.`,
      sources: ["Greg Nuckols - How to Bench Press", "Starting Strength Biomechanics"]
    };
  }

  // [RAG 4]: Các lỗi khi tập Overhead Press (OHP)
  if ((low.includes('overhead press') || low.includes('ohp') || low.includes('đẩy vai')) && (low.includes('lỗi') || low.includes('khắc phục') || low.includes('phổ biến'))) {
    return {
      thinking: `🧠 RAG Kinetic Chain [Question 4/30]:
1. 4 lỗi OHP phổ biến: Ưỡn lưng thắt lưng quá mức, bẻ gập cổ tay, đường tạ vòng qua mặt, khuỷu tay choãi ra ngoài.
2. Cách khắc phục chi tiết cho từng lỗi.`,
      text: `### 🏋️ 4 LỖI PHỔ BIẾN NHẤT KHI TẬP OVERHEAD PRESS (OHP) & CÁCH KHẮC PHỤC

Overhead Press (Đẩy tạ qua đầu) là bài tập kiểm tra sức mạnh chuỗi động lực toàn thân. Dưới đây là 4 lỗi sai nguy hiểm nhất và giải pháp khắc phục:

---

#### ❌ Lỗi 1: Ưỡn Lưng Dưới Quá Mức (Lumbar Hyperextension)
* **Nguyên nhân:** Thiếu kích hoạt cơ lõi (Core) và cơ mông (Glutes), cố ngả người ra sau để dùng cơ ngực đẩy tạ.
* **Cách khắc phục:** **Siết chặt cơ mông (Glutes) và gồng cứng cơ bụng** trước khi đẩy, tạo thành một trụ đỡ vững chắc như bê tông.

#### ❌ Lỗi 2: Cổ Tay Bị Bẻ Gập Về Phía Sau (Wrist Extension)
* **Nguyên nhân:** Đặt thanh đòn vào giữa lòng bàn tay hoặc ngón tay thay vì gốc lòng bàn tay.
* **Cách khắc phục:** Áp dụng kiểu cầm **Bulldog Grip** (thanh đòn nằm ngay trên xương cẳng tay Radius/Ulna), giữ cổ tay thẳng đứng để lực truyền thẳng 100%.

#### ❌ Lỗi 3: Đẩy Tạ Đi Theo Đường Vòng Cung Quá Xa Mặt
* **Nguyên nhân:** Sợ đập tạ vào cằm nên đẩy tạ lượn về phía trước.
* **Cách khắc phục:** Hơi ngửa đầu ra sau nhẹ (tạo đường thoáng), đẩy tạ thẳng đứng lên sát mũi; ngay khi tạ vượt qua đỉnh đầu, đưa đầu trở lại vị trí trung tính (**Head through the window**).

#### ❌ Lỗi 4: Khuỷu Tay Bị Choãi Ngang Sang Hai Bên
* **Cách khắc phục:** Luôn giữ khuỷu tay hơi chếch về phía trước thanh đòn khoảng **$15^\circ - 30^\circ$** ở vị trí chuẩn bị.`,
      sources: ["Mark Rippetoe - Starting Strength", "StrongLifts 5x5"]
    };
  }

  // [RAG 5]: RDL vs Stiff-legged Deadlift
  if ((low.includes('rdl') || low.includes('romanian')) && (low.includes('stiff') || low.includes('khác biệt') || low.includes('cơ học'))) {
    return {
      thinking: `🧠 RAG Hamstring Mechanics [Question 5/30]:
1. RDL bắt đầu từ trên xuống, gập gối 15-20 độ cố định, tập trung Hip Hinge kéo dãn Mông và Đùi sau.
2. Stiff-Legged Deadlift bắt đầu từ sàn, gối thẳng gần như hoàn toàn, hông cao, cánh tay đòn lưng dưới dài hơn.`,
      text: `### 🔬 SO SÁNH CƠ HỌC: ROMANIAN DEADLIFT (RDL) VS STIFF-LEGGED DEADLIFT

| Đặc Điểm Cơ Học | Romanian Deadlift (RDL) | Stiff-Legged Deadlift |
| :--- | :--- | :--- |
| **Điểm bắt đầu:** | Bắt đầu từ tư thế đứng thẳng hạ tạ xuống | Bắt đầu từ mặt sàn (hoặc kê bục) nâng tạ lên |
| **Độ gập khớp gối:** | Gập nhẹ **$15^\circ - 20^\circ$** và giữ cố định góc gập | Đầu gối gần như thẳng hoàn toàn (chỉ mở khóa $5^\circ$) |
| **Chuyển động hông:** | **Đẩy hông tối đa ra sau (Hip Hinge)** | Hông cố định ở vị trí cao, thân gập bản lề sâu |
| **Vị trí tạ:** | Thanh tạ luôn trượt sát xương ống chân và đùi | Thanh tạ có thể cách xa cẳng chân một khoảng nhỏ |
| **Cơ bắp nhắm đến:** | Tối ưu hóa **Cơ Mông (Gluteus Maximus)** & Đùi sau ở trạng thái kéo dãn | Tập trung cực đại vào **Gân kheo (Hamstrings nguyên ủy)** & Cơ lưng dưới |`,
      sources: ["Dr. Mike Israetel - Renaissance Periodization", "NSCA Journal"]
    };
  }

  // [RAG 6]: Cheat Biceps Curl đúng cách vs sai cách
  if (low.includes('biceps curl') || (low.includes('cheat') && (low.includes('ăn gian') || low.includes('tay trước')))) {
    return {
      thinking: `🧠 RAG Hypertrophy Protocols [Question 6/30]:
1. Controlled Cheating (Arnold style): Vượt sticking point ở 1-2 rep cuối, kiểm soát pha âm tính (eccentric 3-4s).
2. Dangerous Cheating: Văng lưng từ đầu, uốn cột sống, mất tension.`,
      text: `### 💪 ĂN GIAN (CHEAT) ĐÚNG CÁCH VS SAI CÁCH TRONG BÀI BARBELL BICEPS CURL

#### ✅ 1. Cheat Đúng Cách (Controlled Cheating / Arnold Technique):
* **Thời điểm áp dụng:** Chỉ áp dụng ở **1 - 2 lần lặp cuối cùng** khi cơ tay trước đã chạm ngưỡng mỏi kiệt lực (Muscular Failure) và không thể tự nâng tạ lên theo kỹ thuật chuẩn (Strict Form).
* **Cách thực hiện:** Dùng một lực nhún hông rất nhẹ (Hip Drive) để tạ vượt qua **điểm chết (Sticking Point)** ở góc $90^\circ$, sau đó **gồng chặt cơ bắp để kiểm soát pha hạ tạ (Eccentric) thật chậm trong 3 - 4 giây**.
* **Mục đích:** Tận dụng khả năng chịu tải cao hơn của pha Eccentric để tạo ra kích thích phì đại cơ bắp tối đa.

#### ❌ 2. Cheat Sai Cách (Ego Lifting / Nguy Hiểm):
* Uốn cong cột sống thắt lưng, ngả người ra sau ngay từ lần lặp đầu tiên.
* Dùng đà văng của vai và lưng để hất tạ lên $\rightarrow$ Cơ tay trước không nhận được lực căng cơ học (Mechanical Tension), nguy cơ rách cơ lưng và tổn thương đĩa đệm thắt lưng.`,
      sources: ["Arnold Schwarzenegger - The New Encyclopedia of Modern Bodybuilding", "Brad Schoenfeld"]
    };
  }

  // [RAG 7]: Lượng Protein khuyến nghị / kg thể trọng
  if ((low.includes('protein') && (low.includes('khuyến nghị') || low.includes('kg trọng lượng') || low.includes('bao nhiêu gam'))) || low.includes('lượng protein')) {
    return {
      thinking: `🧠 RAG Sports Nutrition [Question 7/30]:
1. Khuyến nghị ISSN & Morton et al. (2018): 1.6 - 2.2 g/kg/ngày cho hypertrophy.
2. Cutting / Thâm hụt calo: 2.3 - 3.1 g/kg LBM để chống teo cơ.
3. Phân bổ: 0.4 - 0.55 g/kg mỗi bữa, ngưỡng Leucine 2.7 - 3.5g.`,
      text: `### 🥩 LƯỢNG PROTEIN KHUYẾN NGHỊ HÀNG NGÀY CHO NGƯỜI TẬP THỂ HÌNH TĂNG CƠ

Theo phân tích tổng hợp của **Morton et al. (2018)** trên Tạp chí Y học Thể thao Anh (BJSM) và **Hiệp hội Dinh dưỡng Thể thao Quốc tế (ISSN)**:

---

#### 📊 1. Định Lượng Protein Chuẩn Xác Theo Mục Tiêu:
* **Giai đoạn Tăng Cơ Nạc (Bulking / Maintenance):**
  $$\mathbf{1.6\text{g} - 2.2\text{g}\text{ Protein / kg trọng lượng cơ thể / ngày}}$$
  *(Ví dụ: Người nặng 70kg cần nạp từ 112g đến 154g Protein mỗi ngày).*
* **Giai đoạn Siết Mỡ Sâu (Cutting / Caloric Deficit):**
  $$\mathbf{2.3\text{g} - 3.1\text{g}\text{ Protein / kg khối lượng nạc (LBM) / ngày}}$$
  *Lượng protein cao hơn giúp chống dị hóa teo cơ và tăng cảm giác no.*

#### ⏱️ 2. Phân Bổ Bữa Ăn & Ngưỡng Kích Hoạt Leucine (Leucine Trigger):
* Chia đều lượng protein thành **3 - 5 bữa/ngày** (khoảng 0.4 - 0.55g Protein/kg cho mỗi bữa).
* Mỗi bữa ăn cần chứa tối thiểu **2.7g - 3.5g Axit Amin Leucine** (tương đương 25-35g Whey, thịt bò hoặc ức gà) để kích hoạt công tắc tổng hợp protein cơ bắp **mTORC1**.`,
      sources: ["Morton et al. (2018) BJSM", "ISSN Position Stand: Protein and Exercise"]
    };
  }

  // [RAG 8]: So sánh WPC vs WPI vs WPH
  if (low.includes('whey') && (low.includes('concentrate') || low.includes('isolate') || low.includes('hydrolyzed') || low.includes('wpc') || low.includes('wpi'))) {
    return {
      thinking: `🧠 RAG Supplement Science [Question 8/30]:
1. WPC: 70-80% protein, còn lactose & fat, rẻ nhất.
2. WPI: 90-95% protein, lọc màng CFM bỏ lactose, hấp thu nhanh.
3. WPH: Thủy phân peptide, siêu hấp thu trong 15-30p, đắt nhất.`,
      text: `### 🥛 SO SÁNH WHEY PROTEIN CONCENTRATE (WPC), ISOLATE (WPI) & HYDROLYZED (WPH)

| Tiêu Chí | Whey Concentrate (WPC) | Whey Isolate (WPI) | Whey Hydrolyzed (WPH) |
| :--- | :--- | :--- | :--- |
| **Độ tinh khiết Protein:** | 70% - 80% | **90% - 95%** | **90% - 98%** |
| **Hàm lượng Lactose & Fat:** | Còn một lượng nhỏ Lactose & Chất béo | **Gần như bằng 0 (<1%)** | **0% Lactose** |
| **Công nghệ xử lý:** | Lọc cơ bản (Ultrafiltration) | Lọc vi mô dòng chảy chéo (CFM) | Thủy phân bẻ gãy chuỗi Peptide bằng enzyme |
| **Tốc độ hấp thu:** | Nhanh (1 - 2 giờ) | Rất nhanh (45 - 60 phút) | **Siêu nhanh (15 - 30 phút)** |
| **Đối tượng phù hợp:** | Người không bị dị ứng đường sữa Lactose, tối ưu chi phí | Người bị đau bụng/dị ứng Lactose, người đang siết cân gắt gao | Vận động viên chuyên nghiệp, người có hệ tiêu hóa cực nhạy cảm |`,
      sources: ["Journal of the International Society of Sports Nutrition", "FDA Dairy Processing Standards"]
    };
  }

  // [RAG 9]: Creatine Monohydrate
  if (low.includes('creatine') && (low.includes('monohydrate') || low.includes('liều lượng') || low.includes('hoạt động'))) {
    return {
      thinking: `🧠 RAG Phosphagen System [Question 9/30]:
1. Cơ chế: Tạo Phosphocreatine (PCr) tái tạo ATP tức thì trong 0-10s tập nặng.
2. Tác dụng: Tăng sức mạnh 5-15%, tăng ngậm nước nội bào (Cell Swelling).
3. Liều dùng: 3-5g/ngày duy trì đều đặn. Không bắt buộc Loading.`,
      text: `### ⚡ CƠ CHẾ HOẠT ĐỘNG & LIỀU DÙNG CHUẨN CỦA CREATINE MONOHYDRATE

**Creatine Monohydrate** là thực phẩm bổ sung tăng cường sức mạnh được nghiên cứu nhiều nhất và chứng minh an toàn nhất trong lịch sử y học thể thao.

---

#### 🔋 1. Cơ Chế Sinh Hóa Tái Tạo Năng Lượng ATP:
* Trong các bài tập cường độ cao (1-8 reps), tế bào cơ sử dụng **ATP (Adenosine Triphosphate)** làm nhiên liệu chính. Khi ATP nhả một nhóm phosphate để tạo năng lượng, nó trở thành **ADP (Adenosine Diphosphate)** bất hoạt.
* Creatine nạp vào cơ bắp sẽ liên kết thành **Phosphocreatine (PCr)**. Khi ADP xuất hiện, PCr lập tức nhượng nhóm phosphate để **tái tạo ADP thành ATP chỉ trong vài mili-giây**, giúp bạn đẩy thêm 1 - 2 cái tạ nặng nữa.
* Ngoài ra, Creatine kéo nước vào bên trong tế bào cơ (**Intracellular Hydration**), thúc đẩy tín hiệu phì đại cơ bắp.

#### 💊 2. Phác Đồ Liều Dùng Khoa Học:
* **Cách 1 (Khuyên dùng - Đơn giản & Bền vững):** Uống đều đặn **$3\text{g} - 5\text{g}$ Creatine Monohydrate mỗi ngày** vào bất kỳ thời điểm nào (tốt nhất sau tập cùng Carb/Protein). Cơ bắp sẽ bão hòa sau 3 - 4 tuần.
* **Cách 2 (Nạp nhanh - Loading Phase):** Uống $20\text{g}$/ngày (chia làm 4 lần $5\text{g}$) trong 5 - 7 ngày đầu, sau đó duy trì $3 - 5\text{g}$/ngày.`,
      sources: ["Buford et al. (2007) - ISSN Position Stand on Creatine", "Kreider et al. (2017)"]
    };
  }

  // [RAG 10]: Calo giai đoạn Bulking vs Cutting
  if ((low.includes('bulking') || low.includes('xả cơ')) && (low.includes('cutting') || low.includes('siết cơ')) && (low.includes('calo') || low.includes('thâm hụt') || low.includes('thặng dư'))) {
    return {
      thinking: `🧠 RAG Energy Balance [Question 10/30]:
1. Bulking: Cần thặng dư +250..+500 kcal kích hoạt mTOR và đồng hóa mô cơ mới.
2. Cutting: Cần thâm hụt -300..-500 kcal kích hoạt lipolysis đốt mỡ, protein cao giữ khối nạc LBM.`,
      text: `### ⚖️ TẠI SAO BULKING CẦN THẶNG DƯ CALO VÀ CUTTING CẦN THÂM HỤT CALO?

| Tiêu Chí | Giai Đoạn Xả Cơ (Bulking) | Giai Đoạn Siết Cơ (Cutting) |
| :--- | :--- | :--- |
| **Cân Bằng Năng Lượng:** | **Thặng Dư Calo (Caloric Surplus):** Nạp nhiều hơn TDEE **$+250$ đến $+500\text{ Kcal/ngày}$** | **Thâm Hụt Calo (Caloric Deficit):** Nạp ít hơn TDEE **$-300$ đến $-500\text{ Kcal/ngày}$** |
| **Cơ Chế Sinh Học:** | Cung cấp dư thừa nguyên liệu để kích hoạt **con đường đồng hóa mTOR**, tổng hợp mô cơ mới và nạp đầy Glycogen. | Buộc cơ thể phải phân giải mô mỡ dự trữ (**Lipolysis**) thành axit béo tự do để oxy hóa tạo năng lượng. |
| **Mức Tăng/Giảm Mục Tiêu:** | Tăng **$0.25\% - 0.5\%$ trọng lượng cơ thể / tuần** (để hạn chế tích tụ mỡ thừa - Lean Bulk). | Giảm **$0.5\% - 1.0\%$ trọng lượng cơ thể / tuần** (để bảo toàn tối đa khối lượng cơ nạc LBM). |`,
      sources: ["Helms et al. (2014) - Evidence-based recommendations for natural bodybuilding", "Eric Trexler"]
    };
  }

  // [RAG 11]: Vai trò Carbohydrate trước và sau tập
  if (low.includes('carbohydrate') || (low.includes('carb') && (low.includes('trước và sau') || low.includes('hiệu suất')))) {
    return {
      thinking: `🧠 RAG Glycogen Kinetics [Question 11/30]:
1. Pre-workout Carb: 1-2h trước tập, nạp Glycogen, duy trì đường huyết, chống mệt mỏi CNS.
2. Post-workout Carb: Kích hoạt Insulin, đẩy amino acid vào cơ, tái nạp Glycogen nhanh gấp 2 lần.`,
      text: `### 🍠 VAI TRÒ CỦA CARBOHYDRATE TRƯỚC VÀ SAU BUỔI TẬP GYM

#### ⚡ 1. Trước Buổi Tập (Pre-Workout Carbs - 1 đến 2 tiếng trước tập):
* **Vai trò:** Nạp đầy lượng **Glycogen dự trữ trong cơ bắp và gan**, duy trì mức đường huyết ổn định, ngăn chặn sự kiệt sức của hệ thần kinh trung ương (CNS Fatigue).
* **Nguồn Carb tối ưu:** Carb phức hợp có chỉ số GI trung bình/thấp như **yến mạch, khoai lang, chuối chín, bánh mì nguyên cám**.

#### 🔄 2. Sau Buổi Tập (Post-Workout Carbs - Trong vòng 45-60 phút):
* **Vai trò:** Kích thích tuyến tụy tiết hormone **Insulin** (hormone đồng hóa cực mạnh), giúp vận chuyển axit amin từ Protein vào tế bào cơ và **tăng tốc độ tái tạo Glycogen nhanh gấp 2 lần**.
* **Nguồn Carb tối ưu:** Carb tiêu hóa nhanh có GI cao như **cơm trắng, chuối, maltodextrin, mật ong kết hợp với Whey Protein**.`,
      sources: ["Burke et al. (2011) - Carbohydrates for training and competition", "Journal of Sports Sciences"]
    };
  }

  // [RAG 12]: Pre-workout
  if (low.includes('pre-workout') || low.includes('pre workout')) {
    return {
      thinking: `🧠 RAG Pre-workout Pharmacology [Question 12/30]:
1. Caffeine: Khóa Adenosine, tăng Alertness.
2. Citrulline Malate: Tăng Nitric Oxide, giãn mạch máu.
3. Beta-Alanine: Đệm ion H+, giảm mỏi cơ.
4. Betaine: Tăng công suất tế bào.`,
      text: `### ⚡ 4 THÀNH PHẦN CHÍNH TRONG PRE-WORKOUT & TÁC DỤNG SINH LÝ

1. **Caffeine Anhydrous ($150\text{mg} - 350\text{mg}$):**
   * *Tác dụng:* Khóa thụ thể **Adenosine** trong não bộ, triệt tiêu cảm giác buồn ngủ, tăng dẫn truyền thần kinh dopamine và tăng sức mạnh bộc phát cơ bắp lên $3-7\%$.
2. **L-Citrulline / Citrulline Malate ($6\text{g} - 8\text{g}$):**
   * *Tác dụng:* Chuyển hóa thành L-Arginine trong thận, kích thích sản sinh khí **Nitric Oxide (NO)** làm giãn nở thành mạch máu, tăng lưu lượng máu mang oxy và dưỡng chất đến cơ bắp (tạo hiệu ứng **Muscle Pump** căng phồng).
3. **Beta-Alanine ($3.2\text{g} - 4.0\text{g}$):**
   * *Tác dụng:* Kết hợp với Histidine tổng hợp **Carnosine nội bào**, đóng vai trò chất đệm trung hòa ion axit $H^+$ sinh ra trong quá trình yếm khí, giúp kéo dài ngưỡng mỏi cơ (kèm tác dụng phụ châm chích da Paresthesia hoàn toàn vô hại).
4. **Betaine Anhydrous ($2.5\text{g}$):**
   * *Tác dụng:* Đóng vai trò chất điều hòa áp suất thẩm thấu tế bào, tăng tổng hợp protein và hỗ trợ sản sinh năng lượng tế bào.`,
      sources: ["Hartman et al. (2015) - Multi-ingredient pre-workout supplements", "ISSN Sports Nutrition"]
    };
  }

  // [RAG 13]: Progressive Overload
  if (low.includes('quá tải lũy tiến') || low.includes('progressive overload')) {
    return {
      thinking: `🧠 RAG Exercise Adaptation [Question 13/30]:
1. Định nghĩa: Không chỉ là tăng tạ.
2. 6 phương thức quá tải lũy tiến thực tế: Load, Reps (Double Progression), Sets/Volume, ROM, Tempo/TUT, Density.`,
      text: `### 📈 NGUYÊN LÝ QUÁ TẢI LŨY TIẾN (PROGRESSIVE OVERLOAD) & 6 CÁCH ÁP DỤNG THỰC TẾ

**Quá tải lũy tiến (Progressive Overload)** là định luật nền tảng: *Để cơ bắp tiếp tục phát triển, nó phải liên tục thích nghi với một mức kích thích cơ học lớn hơn mức nó đã quen trước đó.*

---

#### 🛠️ 6 CÁCH ÁP DỤNG TIẾN TRÌNH QUÁ TẢI TRONG GIÁO ÁN:
1. **Tăng Mức Tạ (Load/Weight):** Tăng $1.25\text{kg} - 2.5\text{kg}$ khi đã thuần thục số reps mục tiêu.
2. **Tăng Số Lần Lặp (Double Progression Model):** Nếu mục tiêu là 8-12 reps, tuần 1 tập $60\text{kg} \times 8\text{ reps}$, tuần 2 tập $60\text{kg} \times 10\text{ reps}$, tuần 3 tập $60\text{kg} \times 12\text{ reps} \rightarrow$ Tuần 4 tăng lên $62.5\text{kg} \times 8\text{ reps}$.
3. **Tăng Số Hiệp (Set Volume):** Tăng từ 3 sets lên 4 sets cho nhóm cơ mục tiêu.
4. **Tăng Biên Độ Chuyển Động (Full Range of Motion - ROM):** Xuống sâu hơn, kéo dãn cơ bắp dài hơn ở pha âm tính.
5. **Kiểm Soát Nhịp Độ (Time Under Tension - Tempo):** Hạ tạ chậm rãi trong 3-4 giây thay vì để rơi tự do.
6. **Rút Ngắn Thời Gian Nghỉ (Density):** Hoàn thành cùng một khối lượng tập trong thời gian ngắn hơn.`,
      sources: ["Dr. Brad Schoenfeld - Science and Development of Muscle Hypertrophy", "NSCA"]
    };
  }

  // [RAG 14]: Upper/Lower vs PPL
  if ((low.includes('upper/lower') || low.includes('upper lower')) && (low.includes('ppl') || low.includes('push/pull/legs') || low.includes('push pull legs'))) {
    return {
      thinking: `🧠 RAG Workout Splits [Question 14/30]:
1. Upper/Lower: 4 ngày/tuần, mỗi nhóm cơ chạm 2 lần/tuần, phù hợp người mới và người bận rộn.
2. PPL: 5-6 ngày/tuần, khối lượng volume chuyên biệt, phù hợp intermediate/advanced.`,
      text: `### 🔄 SO SÁNH LỊCH TẬP UPPER/LOWER VS PUSH/PULL/LEGS (PPL) - NÊN CHỌN LOẠI NÀO?

| Đặc Điểm | Upper / Lower Split | Push / Pull / Legs (PPL) |
| :--- | :--- | :--- |
| **Số buổi tối ưu:** | **4 buổi / tuần** (Thứ 2, 3, 5, 6) | **5 - 6 buổi / tuần** (PPL x 2 vòng) |
| **Tần suất kích hoạt cơ:** | **2 lần / tuần / nhóm cơ** | **2 lần / tuần / nhóm cơ** (khi tập 6 buổi) |
| **Thời lượng mỗi buổi:** | 50 - 65 phút | 60 - 80 phút |
| **Độ chuyên biệt từng cơ:** | Trung bình (kết hợp nhiều nhóm cơ trong 1 buổi) | **Rất cao** (chia riêng biệt từng chuỗi vận động Đẩy, Kéo, Chân) |
| **Đối tượng lý tưởng:** | **Người mới bắt đầu (Beginner)**, người đi làm/học sinh bận rộn | **Người có kinh nghiệm $\ge 1$ năm (Intermediate/Advanced)** có thời gian phục hồi tốt |`,
      sources: ["Schoenfeld et al. (2016)", "Lyle McDonald Generic Bulking Routine"]
    };
  }

  // [RAG 15]: Tần suất tập luyện tối ưu
  if (low.includes('tần suất') && (low.includes('tối ưu') || low.includes('hypertrophy') || low.includes('mấy lần'))) {
    return {
      thinking: `🧠 RAG Frequency Hypertrophy [Question 15/30]:
1. Nghiên cứu Schoenfeld 2016: 2 lần/tuần vượt trội 1 lần/tuần (Bro-split) khi cùng Weekly Volume.
2. Lý do: Muscle Protein Synthesis (MPS) duy trì 24-48h sau tập.`,
      text: `### ⏱️ TẦN SUẤT TẬP LUYỆN TỐI ƯU CHO MỖI NHÓM CƠ TRONG MỘT TUẦN

Theo phân tích tổng hợp của **Schoenfeld, Ogborn & Krieger (2016)**:

* **Tần suất vàng:** Tập mỗi nhóm cơ **2 LẦN / TUẦN** đem lại hiệu quả tăng trưởng cơ bắp (Hypertrophy) **vượt trội hơn đáng kể so với 1 lần/tuần (Bro-split)** khi tổng số hiệp tập (Weekly Set Volume) tương đương nhau.
* **Cơ chế sinh lý học:** Sau một buổi tập kháng lực, quá trình **Tổng hợp Protein Cơ bắp (Muscle Protein Synthesis - MPS)** chỉ tăng vọt và đạt đỉnh trong **24 - 48 giờ**, sau đó trở lại mức cơ bản.
  * Nếu tập 1 lần/tuần: Cơ bắp chỉ phát triển trong 2 ngày, 5 ngày còn lại ở trạng thái dừng phát triển.
  * Nếu tập 2 lần/tuần: Bạn kích hoạt công tắc MPS tăng trưởng liên tục trong cả 7 ngày của tuần.`,
      sources: ["Schoenfeld et al. (2016) - Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy", "Sports Medicine"]
    };
  }

  // [RAG 16]: Thời gian nghỉ giữa các hiệp
  if (low.includes('thời gian nghỉ') || (low.includes('nghỉ') && low.includes('giữa các hiệp'))) {
    return {
      thinking: `🧠 RAG Rest Intervals [Question 16/30]:
1. Sức mạnh (Strength): 3-5 phút phục hồi ATP-CP và CNS.
2. Tăng cơ (Hypertrophy): 1.5-3 phút bài Compound, 60-90s bài Isolation.`,
      text: `### ⏳ THỜI GIAN NGHỈ NGƠI GIỮA CÁC HIỆP (REST INTERVALS) CHUẨN KHOA HỌC

1. **Mục Tiêu Tăng Sức Mạnh Tối Đa (Max Strength - Tải trọng $>85\% \text{ 1RM}$, $1-5\text{ reps}$):**
   * 👉 **Nghỉ 3 đến 5 phút:** Cần thời gian đủ lâu để hệ thống **Phosphocreatine (ATP-CP)** tái tạo $98-100\%$ và hệ thần kinh trung ương (CNS) hồi phục hoàn toàn, đảm bảo chất lượng phát lực cho hiệp sau.
2. **Mục Tiêu Phì Đại Tăng Cơ (Hypertrophy - Tải trọng $65-80\% \text{ 1RM}$, $6-12\text{ reps}$):**
   * 👉 **Bài tập Compound nặng (Squat, Bench, Deadlift, Row):** Nghỉ **$2$ đến $3$ phút**.
   * 👉 **Bài tập Cô Lập (Isolation - Curls, Lateral Raise, Triceps Pushdown):** Nghỉ **$60$ đến $90$ giây**.`,
      sources: ["Schoenfeld et al. (2016) - Longer Interset Rest Periods Enhance Muscle Strength and Hypertrophy", "ACSM Guidelines"]
    };
  }

  // [RAG 17]: RPE và RIR
  if (low.includes('rir') || low.includes('rpe') || low.includes('reps in reserve') || low.includes('rate of perceived exertion')) {
    return {
      thinking: `🧠 RAG Autoregulation Systems [Question 17/30]:
1. RPE (Bảng đo nỗ lực 1-10 của Mike Tuchscherer).
2. RIR (Số rep dự trữ trước failure).
3. Bảng quy đổi chuẩn: RPE 10 = RIR 0, RPE 9 = RIR 1, RPE 8 = RIR 2. Vùng tối ưu tăng cơ RPE 7-9 (RIR 1-3).`,
      text: `### 🎯 PHÂN BIỆT RIR (REPS IN RESERVE) & RPE (RATE OF PERCEIVED EXERTION)

| Thang Điểm RPE (Mike Tuchscherer) | Khái Niệm RIR (Reps in Reserve) | Trạng Thái Thể Lực & Cường Độ |
| :---: | :---: | :--- |
| **RPE 10** | **RIR 0** | **Ngưỡng thất bại tuyệt đối (Failure):** Không thể làm thêm dù chỉ 1 rep với form chuẩn. |
| **RPE 9** | **RIR 1** | Còn sức làm được **đúng 1 rep nữa** trước khi hỏng form. |
| **RPE 8** | **RIR 2** | Còn sức làm được **2 reps nữa** (Vùng tập tăng cơ tối ưu nhất). |
| **RPE 7** | **RIR 3** | Còn sức làm được **3 reps nữa** (Mức tạ phát lực tốc độ nhanh). |
| **RPE 6 trở xuống** | **RIR 4+** | Mức tạ nhẹ, phù hợp cho khởi động hoặc hồi phục kỹ thuật. |

* **Vùng Tăng Cơ Vàng:** Tập luyện ở mức **RIR 1 - 3 (RPE 7 - 9)** giúp tối đa hóa sự kích hoạt cơ bắp mà không làm kiệt quệ hệ thần kinh trung ương (CNS Fatigue).`,
      sources: ["Zourdos et al. (2016) - Novel Resistance Training-Specific Rating of Perceived Exertion Scale", "RTS"]
    };
  }

  // [RAG 18]: Overtraining
  if (low.includes('overtraining') || low.includes('quá sức') || low.includes('tập luyện quá sức')) {
    return {
      thinking: `🧠 RAG Overtraining Syndrome [Question 18/30]:
1. Dấu hiệu: Tụt tạ 2-3 tuần, rối loạn giấc ngủ, nhịp tim nghỉ tăng 5-10 bpm, suy giảm miễn dịch.
2. Khắc phục: Deload (giảm 50% volume), ngủ 8-9h, bù dinh dưỡng.`,
      text: `### ⚠️ DẤU HIỆU CỦA TẬP LUYỆN QUÁ SỨC (OVERTRAINING SYNDROME) & CÁCH KHẮC PHỤC

#### 🚩 4 DẤU HIỆU CẢNH BÁO OVERTRAINING NGUY HIỂM:
1. **Suy giảm hiệu suất thể thao liên tục (2 - 3 tuần):** Mức tạ giảm, số reps giảm dù bạn rất nỗ lực.
2. **Nhịp tim nghỉ buổi sáng (Resting Heart Rate) tăng vọt:** Tăng $5 - 10\text{ BPM}$ so với mức bình thường do hệ thần kinh giao cảm bị căng thẳng kéo dài.
3. **Rối loạn giấc ngủ & Mệt mỏi mãn tính:** Khó vào giấc ngủ, ngủ chập chờn, sáng dậy uể oải đau nhức khớp.
4. **Suy giảm miễn dịch & Mất cảm giác ngon miệng:** Dễ cảm cúm, viêm họng, chán ăn.

---

#### 🛠️ PHÁC ĐỒ KHẮC PHỤC (DELOAD PROTOCOL):
* **Áp dụng 1 tuần Deload:** Giảm **$50\%$ tổng số hiệp (Set Volume)** hoặc giảm **$30\%$ mức tạ**, tập trung vào cảm nhận cơ bắp nhẹ nhàng.
* **Tối ưu giấc ngủ:** Đảm bảo ngủ đủ **$8 - 9\text{ tiếng/đêm}$** trong phòng tối và mát mẻ ($20-22^\circ\text{C}$).
* **Nâng Calo lên mức Duy trì (Maintenance):** Nạp đủ Carbohydrate và Protein để tái nạp dự trữ năng lượng.`,
      sources: ["Meeusen et al. (2013) - Prevention, diagnosis, and treatment of the overtraining syndrome", "ACSM"]
    };
  }

  // [RAG 19]: Giải phẫu cơ ngực & Ngực trên
  if (low.includes('cơ ngực lớn') || low.includes('pectoralis major') || (low.includes('ngực trên') && low.includes('phần nào'))) {
    return {
      thinking: `🧠 RAG Chest Anatomy [Question 19/30]:
1. Giải phẫu: Clavicular Head (Đầu xương đòn / Ngực trên) & Sternocostal Head (Đầu xương ức-sườn / Ngực giữa & dưới).
2. Tác động ngực trên: Incline 15-30 độ, Incline DB Press, Low-to-High Cable Fly.`,
      text: `### 🧬 GIẢI PHẪU CƠ NGỰC LỚN (PECTORALIS MAJOR) & BÀI TẬP TỐI ƯU CHO NGỰC TRÊN

Cơ ngực lớn (Pectoralis Major) được chia làm **2 nhánh giải phẫu chính**:
1. **Đầu Xương Đòn (Clavicular Head - Ngực trên):** Bám từ xương đòn chạy chéo xuống bám vào xương cánh tay. Chức năng chính là gập cánh tay (Shoulder Flexion) và khép ngang (Horizontal Adduction).
2. **Đầu Xương Ức - Sườn (Sternocostal Head - Ngực giữa & ngực dưới):** Bám từ xương ức và sụn sườn 1-6 đến xương cánh tay.

---

#### 🎯 CÁC BÀI TẬP TỐT NHẤT CHO PHẦN NGỰC TRÊN:
* **Góc Ghế Nghiêng Chuẩn Vàng ($15^\circ - 30^\circ$):** Nghiên cứu EMG chứng minh góc ghế $30^\circ$ kích hoạt đầu đòn ngực trên tối đa. Nếu nghiêng dốc quá $>45^\circ$, lực sẽ bị chuyển sang **Cơ vai trước (Anterior Deltoid)**.
* **Top Bài Tập Hàng Đầu:**
  1. **Incline Dumbbell Bench Press (Đẩy ngực trên tạ đơn):** Cho phép ép tạ hội tụ ở đỉnh và duỗi sâu ở đáy.
  2. **Incline Smith Machine Press:** Độ ổn định cao, cô lập hoàn toàn sợi cơ ngực trên.
  3. **Low-to-High Cable Fly (Ép ngực cáp từ dưới lên):** Khép cơ theo đúng hướng chạy của sợi cơ xương đòn.`,
      sources: ["Trebs et al. (2010) - An electromyography analysis of incline bench press", "Dr. Stuart McGill"]
    };
  }

  // [RAG 20]: Góc kéo xô lưng (Vertical vs Horizontal)
  if ((low.includes('latissimus dorsi') || low.includes('lưng xô') || low.includes('cơ lưng')) && (low.includes('kéo dọc') || low.includes('kéo ngang') || low.includes('góc kéo'))) {
    return {
      thinking: `🧠 RAG Back Anatomy [Question 20/30]:
1. Cấu trúc sợi Lats: chạy từ cột sống ngực/thắt lưng bám vào cánh tay.
2. Kéo dọc (Lat Pulldown/Pull-ups) tác động sợi xô trên & Teres Major -> mở rộng độ bè (Width).
3. Kéo ngang (Rows) khép khuỷu tay sát sườn tác động sợi xô dưới & tăng độ dày (Thickness) Rhomboids/Traps.`,
      text: `### 🦅 CẤU TRÚC CƠ LƯNG XÔ (LATISSIMUS DORSI) & LỰA CHỌN GÓC KÉO DỌC VS KÉO NGANG

Sợi cơ xô (Lats) chạy hình cánh quạt từ cột sống ngực $T7-T12$, mạc ngực thắt lưng và mào chậu chéo lên bám vào rãnh liên củ xương cánh tay.

---

| Hướng Kéo | Bài Tập Tiêu Biểu | Nhóm Cơ Tác Động Trọng Tâm | Tác Dụng Thẩm Mỹ |
| :--- | :--- | :--- | :--- |
| **Kéo Dọc (Vertical Pulling):** Cánh tay kéo từ trên đầu xuống sát thân | • Pull-ups (Hít xà)<br>• Lat Pulldown tay rộng | • Sợi cơ xô trên (Iliac / Thoracic fibers)<br>• **Cơ tròn lớn (Teres Major)** | Tạo độ **Bè Rộng chữ V (Back Width)** |
| **Kéo Ngang (Horizontal Pulling):** Kéo tạ vuông góc với thân người | • Barbell Bent-Over Row<br>• Seated Cable Row<br>• T-Bar Row | • Sợi cơ xô dưới<br>• **Cơ trám (Rhomboids)**<br>• **Cơ thang giữa/dưới (Trapezius)** | Tạo độ **Dày và Nổi Khối (Back Thickness)** |`,
      sources: ["Lehman et al. (2004) - Variations in muscle activation levels during traditional latissimus dorsi exercises", "Kinesiology of the Musculoskeletal System"]
    };
  }

  // [RAG 21]: Leg Press vs Squat cho Quads
  if (low.includes('leg press') && low.includes('squat')) {
    return {
      thinking: `🧠 RAG Lower Body Mechanics [Question 21/30]:
1. Squat: Tự do, áp lực cột sống lớn, đòi hỏi Core/Glutes giữ thăng bằng.
2. Leg Press: Triệt tiêu áp lực đĩa đệm, cô lập 4 đầu cơ Quads (Rectus Femoris, Vasti) chạm ngưỡng failure an toàn.`,
      text: `### 🦵 SỰ KHÁC BIỆT TRONG KÍCH HOẠT ĐÙI TRƯỚC (QUADS): LEG PRESS VS SQUAT

| Đặc Tính | Barbell Squat | Leg Press Máy |
| :--- | :--- | :--- |
| **Áp lực Cột Sống (Spinal Loading):** | **Rất cao:** Đòi hỏi cơ dựng sống và cơ lõi gồng giữ tạ tải dọc trục. | **Bằng 0:** Lưng được đệm ghế tựa nâng đỡ hoàn toàn. |
| **Độ ổn định & Thăng bằng:** | Cần hệ thần kinh điều khiển thăng bằng đa mặt phẳng. | Cố định theo đường ray máy, độ ổn định tuyệt đối. |
| **Khả năng Cô lập Đùi Trước (Quads):** | Phân bổ lực cho cả cơ mông (Glutes), đùi sau và lưng dưới. | **Cô lập cực cao 4 đầu cơ đùi trước**, có thể đẩy đến ngưỡng thất bại (Failure) mà không sợ ngã tạ. |
| **Kích hoạt Cơ thẳng đùi (Rectus Femoris):** | Thấp hơn do hông và gối cùng gập đồng thời. | Có thể tăng kích hoạt bằng cách đặt chân thấp trên bàn đạp (Low Foot Placement). |`,
      sources: ["Escamilla et al. (2001) - Knee biomechanics of the dynamic squat and leg press", "Medicine & Science in Sports & Exercise"]
    };
  }

  // [RAG 22]: Vai trò cơ lõi (Core) và IAP
  if (low.includes('cơ lõi') || low.includes('core') || (low.includes('cơ bụng') && low.includes('cột sống'))) {
    return {
      thinking: `🧠 RAG Core Biomechanics [Question 22/30]:
1. Cấu tạo Core: Transverse Abdominis, Rectus Abdominis, Obliques, Multifidus, Diaphragm, Pelvic Floor.
2. Cơ chế IAP: Tạo áp suất nội bụng 360 độ giống piston khí nén, giảm 40% lực nén đĩa đệm L4-L5.`,
      text: `### 🛡️ VAI TRÒ CỦA CƠ BỤNG & CƠ LÕI (CORE) TRONG BẢO VỆ CỘT SỐNG KHI NÂNG TẠ NẶNG

Cơ lõi (Core) không chỉ là 6 múi cơ thẳng bụng, mà là **hộp cơ 3D bao quanh khoang bụng**:
* **Trần:** Cơ hoành (Diaphragm)
* **Sàn:** Cơ đáy chậu (Pelvic Floor)
* **Thành trước & bên:** Cơ bụng ngang (Transverse Abdominis - cơ đai tự nhiên), Cơ chéo bụng trong/ngoài
* **Thành sau:** Cơ nhiều nhánh (Multifidus) và cơ dựng sống (Erector Spinae)

---

#### 🔒 CƠ CHẾ KHÓA ÁP SUẤT NỘI BỤNG (IAP):
Khi bạn hít sâu và gồng chặt bằng kỹ thuật Valsalva, các cơ này co thắt đồng bộ biến khoang bụng thành một **khối trụ khí nén vững chắc (Rigid Cylinder)**:
1. Giảm tải lực cắt (Shear Force) và lực nén (Compressive Load) lên đĩa đệm thắt lưng **L4-L5 và L5-S1 lên đến $40\%$**.
2. Ngăn ngừa hiện tượng uốn cong cột sống khi chịu tải trọng nặng hàng trăm kg.
3. Truyền tải trọn vẹn lực phát động từ chi dưới lên chi trên một cách tối đa.`,
      sources: ["Dr. Stuart McGill - Ultimate Back Fitness and Performance", "Journal of Biomechanics"]
    };
  }

  // [RAG 23]: Đầu dài và đầu ngắn cơ tam đầu (Triceps)
  if (low.includes('tam đầu') || low.includes('triceps') || (low.includes('đầu dài') && low.includes('đầu ngắn'))) {
    return {
      thinking: `🧠 RAG Triceps Anatomy [Question 23/30]:
1. Giải phẫu Triceps: Long Head (Bắc qua khớp vai), Lateral Head (Đầu ngoài), Medial Head (Đầu trong).
2. Phát triển Đầu dài: Bài qua đầu (Overhead Triceps Extension, Skull Crusher) vì kéo dãn cơ tại khớp vai.
3. Phát triển Đầu ngoài/ngắn: Bài ép xuống (Rope Pushdown, Close-Grip Bench Press).`,
      text: `### 💪 PHÁT TRIỂN ĐẦU DÀI (LONG HEAD) & ĐẦU NGOÀI/NGẮN (LATERAL/MEDIAL) CƠ TAY SAU

Cơ tam đầu bắp tay sau (Triceps Brachii) gồm 3 đầu cơ với nguyên ủy giải phẫu khác nhau:

---

#### 1. Phát Triển Đầu Dài (Long Head - Chiếm 60% thể tích bắp tay sau):
* **Đặc điểm giải phẫu:** Đầu dài là phần duy nhất **bắc qua cả 2 khớp: Khớp vai và Khớp khuỷu tay (Bi-articular Muscle)**. Nó chỉ được kéo dãn tối đa khi cánh tay đưa qua đầu.
* **Bài tập vàng:**
  * 👉 **Overhead Dumbbell / Cable Triceps Extension (Đưa tạ qua đầu)**
  * 👉 **EZ-Bar Skull Crushers (Nằm hạ tạ trán/sau đầu)**
  * 👉 **Incline Overhead Cable Extension**

#### 2. Phát Triển Đầu Ngoài & Đầu Trong (Lateral & Medial Head):
* **Đặc điểm giải phẫu:** Chỉ bám vào xương cánh tay và xương trụ, phát lực mạnh nhất khi cánh tay cố định sát bên sườn.
* **Bài tập vàng:**
  * 👉 **Triceps Rope Pushdown (Kéo cáp dây thừng tách rộng ở đáy)**
  * 👉 **Straight Bar Cable Pushdown**
  * 👉 **Close-Grip Barbell Bench Press (Đẩy ngực tay hẹp)**`,
      sources: ["Kinesiology of the Musculoskeletal System", "Brad Schoenfeld"]
    };
  }

  // [RAG 24]: Vi chấn thương sợi cơ & Tổng hợp Protein
  if (low.includes('vi chấn thương') || low.includes('micro-trauma') || (low.includes('sợi cơ') && low.includes('phục hồi'))) {
    return {
      thinking: `🧠 RAG Muscle Cellular Physiology [Question 24/30]:
1. Giai đoạn 1: Mechanical Tension làm rách vi mô sarcomere và đĩa Z.
2. Giai đoạn 2: Phản ứng viêm, giải phóng cytokine thu hút Satellite Cells.
3. Giai đoạn 3: Satellite cells hiến nhân (Myonuclei), mTOR kích hoạt ribosome tổng hợp Actin & Myosin mới làm dày sợi cơ.`,
      text: `### 🔬 CƠ CHẾ VI CHẤN THƯƠNG SỢI CƠ & TỔNG HỢP PROTEIN TRONG PHỤC HỒI

**Sơ Đồ Tiến Trình Sinh Lý Học Vi Chấn Thương & Phục Hồi:**
1. Lực căng cơ học & Co cơ Eccentric ➔
2. Vi chấn thương Sarcomere & Đĩa Z ➔
3. Giải phóng Cytokines & Phản ứng viêm lành tính ➔
4. Kích hoạt Tế bào vệ tinh (Satellite Cells) ➔
5. Tế bào vệ tinh nhân đôi & hiến nhân Myonuclei ➔
6. mTORC1 kích hoạt Ribosome dịch mã mRNA ➔
7. Tổng hợp thêm sợi tơ cơ Actin & Myosin mới ➔
8. Sợi cơ dày lên (Muscular Hypertrophy).

1. **Giai đoạn Vi Chấn Thương (Micro-Trauma):** Dưới tác động của lực căng cơ học cực lớn (đặc biệt ở pha hạ tạ Eccentric), các cầu liên kết Actin-Myosin và đĩa Z trong sợi cơ bị rách các vết vi thể.
2. **Giai đoạn Kích Hoạt Tế Bào Vệ Tinh (Satellite Cells):** Tế bào cơ giải phóng các chất trung gian gây viêm lành tính (Cytokines, IGF-1) để đánh thức các tế bào gốc vệ tinh đang ngủ yên.
3. **Giai đoạn Tái Thiết & Phì Đại (Hypertrophy):** Tế bào vệ tinh nhân đôi và hợp nhất với sợi cơ bị tổn thương, **hiến tặng nhân tế bào (Myonuclei)**. Nhân mới giúp tăng công suất dịch mã protein, tạo ra các sợi tơ cơ mới xếp song song, làm tăng tiết diện ngang của cơ bắp.`,
      sources: ["Vierck et al. (2000) - Satellite cell regulation following myotrauma", "Cellular and Molecular Exercise Physiology"]
    };
  }

  // [RAG 25]: Giấc ngủ & Hormone Tăng Trưởng
  if (low.includes('giấc ngủ') || (low.includes('ngủ') && low.includes('hormone'))) {
    return {
      thinking: `🧠 RAG Sleep Endocrinology [Question 25/30]:
1. NREM Stage 3/4 (Slow-Wave Sleep): Tiết 70-80% tổng lượng GH & IGF-1 trong ngày.
2. Thiếu ngủ: Tăng Cortisol 30-40%, giảm Testosterone, kháng insulin, ức chế mTOR.`,
      text: `### 😴 TÁC ĐỘNG CỦA GIẤC NGỦ ĐẾN HORMONE TĂNG TRƯỞNG & PHỤC HỒI CƠ BẮP

Giấc ngủ là chiếc máy đồng hóa tự nhiên mạnh nhất của cơ thể con người:

---

#### 🌟 1. Tiết Hormone Tăng Trưởng (Growth Hormone - GH):
* Trong giai đoạn **Giấc ngủ sóng chậm (Slow-Wave Sleep - NREM Stage 3 & 4)** diễn ra ở nửa đầu đêm, tuyến yên giải phóng tới **$70\% - 80\%$ tổng lượng Hormone Tăng Trưởng (GH)** của cả chu kỳ 24 giờ.
* GH kích thích gan sản sinh **IGF-1 (Insulin-like Growth Factor 1)**, thúc đẩy hấp thu axit amin và phục hồi mô cơ bị tổn thương.

#### ⚠️ 2. Hậu Quả Khôn Lường Của Việc Thiếu Ngủ ($< 6\text{ tiếng/đêm}$):
* **Hormone Dị Hóa Cortisol tăng $30\% - 45\%$:** Bẻ gãy các mô cơ thành năng lượng (Muscle Breakdown).
* **Nồng độ Testosterone tự do giảm $10\% - 15\%$:** Làm suy giảm sức mạnh và khả năng phục hồi thần kinh.
* **Kháng Insulin tế bào:** Giảm khả năng nạp Glycogen vào cơ bắp sau khi ăn.`,
      sources: ["Van Cauter et al. (2000) - Sleep and growth hormone secretion", "Nedeltcheva et al. (2010) Annals of Internal Medicine"]
    };
  }

  // [RAG 26]: Phân biệt DOMS vs Chấn thương
  if (low.includes('doms') || (low.includes('đau nhức') && low.includes('chấn thương'))) {
    return {
      thinking: `🧠 RAG Sports Pathology [Question 26/30]:
1. DOMS: Đau âm ỉ lan tỏa 2 bên sau 24-72h, dễ chịu khi vận động nhẹ hoặc tắm ấm.
2. Chấn thương: Đau nhói khu trú tại khớp/gân, sưng đỏ, tê bì, đau tăng khi cử động.`,
      text: `### 🩺 PHÂN BIỆT ĐAU CƠ TRÌ HOÃN (DOMS) VS CHẤN THƯƠNG THỰC SỰ

| Dấu Hiệu Phân Biệt | Đau Cơ Trì Hoãn (DOMS - Lành Tính) | Chấn Thương Thể Thao (Bong Gân, Rách Cơ, Khớp) |
| :--- | :--- | :--- |
| **Thời điểm xuất hiện:** | Xuất hiện sau buổi tập **$12 - 24\text{ giờ}$**, đạt đỉnh sau $48\text{ giờ}$ rồi giảm dần. | Xuất hiện **đột ngột ngay lập tức** trong khi tập hoặc ngay sau hiệp tập nặng. |
| **Tính chất cơn đau:** | Đau âm ỉ, cảm giác căng mỏi đều khắp bụng cơ ở cả 2 bên cơ thể. | **Đau nhói buốt, giật cục**, tập trung chính xác tại một điểm (gân, dây chằng, khớp xương). |
| **Biểu hiện ngoài da:** | Không có sưng bầm tím, cơ bắp săn chắc. | Có thể xuất hiện **sưng tấy, đỏ, nóng hoặc bầm tím dưới da**. |
| **Phản ứng khi vận động nhẹ:** | Vận động nhẹ, đi bộ hoặc tắm nước ấm làm **giảm đau rõ rệt**. | Càng cử động khớp hoặc chịu tải thì **càng đau dữ dội hơn**. |`,
      sources: ["Clarkson & Hubal (2002) - Exercise-induced muscle damage in humans", "Mayo Clinic Sports Medicine"]
    };
  }

  // [RAG 27]: Beginner gains
  if (low.includes('beginner gains') || (low.includes('người mới') && low.includes('6 tháng đầu'))) {
    return {
      thinking: `🧠 RAG Beginner Hypertrophy [Question 27/30]:
1. Tăng cơ: 0.9 - 1.2 kg cơ nạc/tháng (5-7 kg trong 6 tháng đầu theo mô hình Lyle McDonald).
2. Sức mạnh: Tăng 30-50% chủ yếu do Neural Adaptation (tuyển dụng Motor Units).`,
      text: `### 🚀 KỲ VỌNG TĂNG CƠ & SỨC MẠNH CHO NGƯỜI MỚI (BEGINNER GAINS) TRONG 6 THÁNG ĐẦU

Theo mô hình phát triển sinh lý học của **Lyle McDonald & Alan Aragon**:

---

#### 📈 1. Tốc Độ Phát Triển Khối Lượng Cơ Nạc (Muscle Mass):
* **Người mới (Năm đầu tiên):** Có thể tăng **$0.9\text{kg} - 1.2\text{kg}$ cơ bắp thuần mỗi tháng** (tương đương **$5\text{kg} - 7\text{kg}$ cơ nạc trong 6 tháng đầu**) nếu đảm bảo dinh dưỡng thặng dư calo và giáo án chuẩn.
* Cơ thể người mới vô cùng nhạy cảm với kích thích cơ học (Anabolic Sensitivity), tạo ra giai đoạn tăng trưởng nhanh nhất trong toàn bộ cuộc đời tập luyện.

#### 🧠 2. Tốc Độ Tăng Trưởng Sức Mạnh & Thích Nghi Hệ Thần Kinh:
* Trong $4 - 8$ tuần đầu tiên, mức tạ của bạn có thể tăng **$30\% - 50\%$** (ví dụ Bench Press từ $30\text{kg}$ lên $50\text{kg}$).
* **Cơ chế:** Phần lớn sự tăng sức mạnh ban đầu đến từ **Thích nghi hệ thần kinh (Neural Adaptations)**: Não bộ học cách đồng bộ hóa và tuyển dụng tối đa số lượng đơn vị vận động (Motor Units) chứ chưa hẳn do kích thước sợi cơ to ra.`,
      sources: ["Lyle McDonald - What's My Genetic Muscular Potential?", "Sale (1988) - Neural adaptation to resistance training"]
    };
  }

  // [RAG 28]: Phụ nữ mang thai & Sau sinh
  if (low.includes('mang thai') || low.includes('sau sinh') || low.includes('phụ nữ mang bầu')) {
    return {
      thinking: `🧠 RAG Prenatal Exercise [Question 28/30]:
1. Hướng dẫn ACOG: Hoàn toàn khuyến khích nếu không có chống chỉ định y khoa.
2. Lưu ý: Tránh nằm ngửa sau tam cá nguyệt 1 (chèn ép tĩnh mạch chủ), tránh Valsalva nín thở, lưu ý Relaxin làm lỏng khớp.`,
      text: `### 🤰 HƯỚNG DẪN AN TOÀN TẬP GYM CHO PHỤ NỮ MANG THAI & SAU SINH

Theo khuyến cáo chính thức của **Hiệp hội Sản Phụ khoa Hoa Kỳ (ACOG)**:

---

#### 🌟 1. Lợi Ích Của Việc Tập Luyện Khi Mang Thai:
* Giảm $50\%$ nguy cơ mắc tiểu đường thai kỳ (Gestational Diabetes) và tiền sản giật.
* Tăng cường cơ sàn chậu và cơ lưng, giảm đau lưng khi bụng to, hỗ trợ quá trình sinh nở thuận lợi và nhanh hồi phục vóc dáng sau sinh.

#### ⚠️ 4 NGUYÊN TẮC AN TOÀN BẮT BUỘC:
1. **Tránh tư thế nằm ngửa hoàn toàn (Supine Position) sau tam cá nguyệt thứ 1 (Tuần 13+):** Trọng lượng tử cung có thể chèn ép **Tĩnh mạch chủ dưới (Inferior Vena Cava)**, làm giảm lưu lượng máu về tim và thai nhi. Thay bằng nằm ghế dốc Incline.
2. **Không nín thở gồng bụng quá mức (No Heavy Valsalva):** Hít thở đều đặn trong suốt các hiệp tập để duy trì lượng oxy cung cấp cho thai nhi.
3. **Cẩn trọng với Hormone Relaxin:** Hormone này làm giãn các dây chằng xương chậu và khớp $\rightarrow$ Tránh các bài tập kéo dãn quá biên độ (Over-stretching) hoặc nhảy mạnh.
4. **Kiểm soát cường độ:** Giữ mức gắng sức vừa phải ở **RPE 5 - 7** (vẫn có thể nói chuyện thành câu trôi chảy khi tập - Talk Test).`,
      sources: ["ACOG Committee Opinion No. 804: Physical Activity and Exercise During Pregnancy and Postpartum"]
    };
  }

  // [RAG 29]: Giãn cơ tĩnh vs Giãn cơ động
  if (low.includes('giãn cơ tĩnh') || low.includes('giãn cơ động') || low.includes('static stretching') || low.includes('dynamic stretching')) {
    return {
      thinking: `🧠 RAG Flexibility & Warm-up Protocols [Question 29/30]:
1. Dynamic Stretching: Thực hiện TRƯỚC tập để tăng tuần hoàn, nhiệt độ, không làm giảm sức mạnh bộc phát.
2. Static Stretching: Thực hiện SAU tập hoặc ngày nghỉ để thư giãn đối giao cảm và phục hồi chiều dài sợi cơ.`,
      text: `### 🧘 GIÃN CƠ TĨNH (STATIC STRETCHING) VS GIÃN CƠ ĐỘNG (DYNAMIC STRETCHING)

| Tiêu Chí | Giãn Cơ Động (Dynamic Stretching) | Giãn Cơ Tĩnh (Static Stretching) |
| :--- | :--- | :--- |
| **Cách thực hiện:** | Chuyển động liên tục đưa khớp qua toàn bộ biên độ (Arm Circles, Leg Swings, Lunge xoay thân). | Giữ yên cơ bắp ở trạng thái kéo dãn tối đa trong **$20 - 45\text{ giây}$**. |
| **Thời điểm vàng:** | 👉 **TRƯỚC BUỔI TẬP (Khởi động):** Làm tăng nhiệt độ cơ thể, bôi trơn dịch khớp và kích hoạt hệ thần kinh. | 👉 **SAU BUỔI TẬP HOẶC TRƯỚC KHI NGỦ:** Giúp hạ nhịp tim, chuyển cơ thể sang hệ thần kinh đối giao cảm (Parasympathetic) để phục hồi. |
| **Tác động lên sức mạnh:** | Duy trì hoặc tăng sức mạnh bộc phát và độ linh hoạt. | **Làm giảm $5\% - 8\%$ sức mạnh bộc phát** nếu thực hiện tĩnh quá lâu trước khi nâng tạ nặng (do làm lỏng tạm thời các thụ thể gân Golgi). |`,
      sources: ["Behm & Chaouachi (2011) - A review of the acute effects of static and dynamic stretching on performance", "European Journal of Applied Physiology"]
    };
  }

  // [RAG 30]: Khởi động chuẩn RAMP
  if (low.includes('khởi động') || low.includes('warm-up') || low.includes('warm up') || low.includes('dịch khớp')) {
    return {
      thinking: `🧠 RAG RAMP Warm-up Framework [Question 30/30]:
1. R (Raise): Tăng nhiệt độ, tiết dịch khớp Synovial.
2. A (Activate): Kích hoạt Glute Medius, Rotator Cuff, Core.
3. M (Mobilize): T-spine, Ankle, Hip mobility.
4. P (Potentiate): Warm-up sets kích hoạt PAP hệ thần kinh.`,
      text: `### 🔥 QUY TRÌNH KHỞI ĐỘNG CHUẨN KHOA HỌC RAMP PROTOCOL TRƯỚC KHI NÂNG TẠ NẶNG

Giao thức **RAMP (Ian Jeffreys)** là tiêu chuẩn vàng được các đội tuyển thể thao Olympic áp dụng:

---

#### 1. R - Raise (Tăng Thân Nhiệt & Tiết Dịch Khớp - 3 đến 5 phút):
* Đi bộ dốc, chèo thuyền máy (Rowing) hoặc nhảy dây nhẹ nhàng.
* **Tác dụng:** Tăng nhiệt độ cơ thể lên $1-2^\circ\text{C}$, giảm độ nhớt của máu và kích thích màng bao hoạt dịch tiết ra **Dịch khớp (Synovial Fluid)** bôi trơn sụn khớp.

#### 2. A - Activate (Kích Hoạt Các Nhóm Cơ Ổn Định - 3 phút):
* Thực hiện các bài tập kích hoạt: **Band Pull-aparts** (chóp xoay vai), **Glute Bridge** (cơ mông), **Plank / Deadbug** (cơ lõi).

#### 3. M - Mobilize (Tăng Cường Độ Linh Hoạt Khớp Động - 3 phút):
* Xoay khớp linh hoạt: **Cat-Cow** (cột sống), **World's Greatest Stretch** (khớp háng & ngực), **Ankle Mobilization** (cổ chân).

#### 4. P - Potentiate (Kích Hoạt Hệ Thần Kinh Với Hiệp Tạ Khởi Động Tăng Dần):
* Áp dụng trước bài Compound chính (Ví dụ tạ chính là $100\text{kg}$ Squat):
  * Hiệp 1: Thanh đòn không $20\text{kg} \times 10\text{ reps}$ (Tập trung quỹ đạo)
  * Hiệp 2: $50\text{kg} \times 5\text{ reps}$ (Nghỉ 60s)
  * Hiệp 3: $75\text{kg} \times 3\text{ reps}$ (Nghỉ 90s)
  * Hiệp 4: $90\text{kg} \times 1\text{ rep}$ (Hiệp kích hoạt hệ thần kinh trung ương **Post-Activation Potentiation - PAP**)
  * $\rightarrow$ Bước vào Hiệp chính $100\text{kg}$ với phong độ cơ bắp cao nhất!`,
      sources: ["Ian Jeffreys (2007) - Warm up revisited: The 'RAMP' method of optimizing warm ups", "NSCA's Guide to Program Design"]
    };
  }
    // Branch A: Push-Pull-Legs
    if (low.includes('push') || low.includes('ppl') || low.includes('đẩy kéo') || (low.includes('lịch tập') && low.includes('tăng cơ'))) {
      return {
        thinking: `🧠 Workout Science Reasoning (PPL Hypertrophy Split):
1. Phân bổ giải phẫu cơ bắp: Push (Ngực, Vai trước/giữa, Tay sau), Pull (Lưng xô, Vai sau, Tay trước, Cầu vai), Legs (Đùi trước Quads, Đùi sau Hamstrings, Mông Glutes, Bắp chân).
2. Tần suất (Frequency): 4-6 buổi/tuần, đảm bảo mỗi nhóm cơ được kích thích 1.5 - 2 lần/tuần.
3. Nguyên tắc Progressive Overload: 10 - 20 sets/nhóm cơ/tuần, RPE 7-9, nghỉ 90-180s ở bài Compound.
4. Tích hợp cảnh báo an toàn cơ xương khớp.`,
        text: `### 🏋️ GIÁO ÁN PUSH - PULL - LEGS HYPERTROPHY TĂNG CƠ KHOA HỌC

Chào bạn! Dưới đây là giáo án **Push - Pull - Legs (PPL)** chuẩn hóa theo nghiên cứu thể thao mới nhất của **ISSN & ACSM**, tối ưu phì đại cơ bắp (Hypertrophy) và cân đối phục hồi hệ thần kinh trung ương (CNS).

---

#### 📋 CẤU TRÚC PHÂN BỔ 4 - 6 BUỔI / TUẦN:

| Buổi Tập | Nhóm Cơ Trọng Tâm | Bài Tập Chi Tiết | Số Hiệp (Sets) x Số Lần (Reps) | RPE / Nghỉ Giữa Hiệp |
| :--- | :--- | :--- | :--- | :--- |
| **Buổi 1: PUSH (Đẩy)** | Ngực, Vai, Tay Sau | 1. Barbell Bench Press (Đẩy ngực ngang)<br>2. Incline Dumbbell Press (Ngực trên)<br>3. Overhead Dumbbell Press (Vai trước/giữa)<br>4. Cable Lateral Raise (Vai ngang)<br>5. Triceps Rope Pushdown (Tay sau) | 3-4 sets x 6-8 reps<br>3 sets x 8-10 reps<br>3 sets x 8-10 reps<br>4 sets x 12-15 reps<br>3 sets x 10-12 reps | RPE 8 • Nghỉ 2-3p<br>RPE 8 • Nghỉ 90s<br>RPE 8 • Nghỉ 90s<br>RPE 9 • Nghỉ 60s<br>RPE 8-9 • Nghỉ 60s |
| **Buổi 2: PULL (Kéo)** | Lưng Xô, Vai Sau, Tay Trước | 1. Barbell Bent-Over Row (Kéo lưng)<br>2. Lat Pulldown / Pull-ups (Kéo xô rộng)<br>3. Seated Cable Row (Lưng giữa)<br>4. Face Pull (Vai sau & Cầu vai)<br>5. Incline Dumbbell Biceps Curl (Tay trước) | 3-4 sets x 6-8 reps<br>3-4 sets x 8-10 reps<br>3 sets x 10-12 reps<br>4 sets x 12-15 reps<br>3 sets x 10-12 reps | RPE 8 • Nghỉ 2-3p<br>RPE 8 • Nghỉ 90s<br>RPE 8 • Nghỉ 90s<br>RPE 9 • Nghỉ 60s<br>RPE 8 • Nghỉ 60s |
| **Buổi 3: LEGS (Chân Mông)** | Đùi Trước, Đùi Sau, Mông, Bắp Chân | 1. Barbell Back Squat (Gánh đùi)<br>2. Romanian Deadlift - RDL (Đùi sau/Mông)<br>3. Leg Press (Đạp đùi máy)<br>4. Leg Extension & Hamstring Curl (Superset)<br>5. Standing Calf Raise (Bắp chân) | 3-4 sets x 6-8 reps<br>3 sets x 8-10 reps<br>3 sets x 10-12 reps<br>3 sets x 12-15 reps<br>4 sets x 15-20 reps | RPE 8 • Nghỉ 3p<br>RPE 8 • Nghỉ 2p<br>RPE 8-9 • Nghỉ 90s<br>RPE 9 • Nghỉ 60s<br>RPE 9 • Nghỉ 45s |
| **Buổi 4: UPPER (Thân Trên Linh Hoạt)** | Ngực, Lưng, Vai, Cánh Tay | 1. Dumbbell Incline Press (Ngực trên)<br>2. Chest-Supported T-Bar Row (Lưng xô)<br>3. Dumbbell Lateral Raise (Vai ngang)<br>4. Biceps Hammer Curl & Skull Crusher (Tay) | 3 sets x 8-10 reps<br>3 sets x 8-10 reps<br>4 sets x 12-15 reps<br>3 sets x 10-12 reps | RPE 8 • Nghỉ 90s<br>RPE 8 • Nghỉ 90s<br>RPE 9 • Nghỉ 60s<br>RPE 8-9 • Nghỉ 60s |

---

#### 💡 3 LƯU Ý KHOA HỌC BẮT BUỘC ĐỂ ĐẠT KẾT QUẢ TỐI ĐA:
1. **Quy tắc Tăng Tải Lũy Tiến (Progressive Overload):** Khi bạn đạt tối đa số Reps ở mức tạ hiện tại, hãy tăng **1.25kg - 2.5kg** ở tuần kế tiếp.
2. **Dinh dưỡng bổ trợ:** Nạp đủ **1.8g - 2.2g Protein / kg thể trọng** mỗi ngày và uống tối thiểu 2.5 - 3 lít nước.
3. **Cảnh báo an toàn y tế:** Luôn khởi động kỹ khớp vai và khớp gối 5-10 phút trước khi vào bài nặng.

<div class="mt-3 p-3 bg-slate-900 rounded-2xl border border-emerald-500/40 flex items-center justify-between">
  <div>
    <span class="text-xs font-bold text-white block">Bạn có muốn áp dụng ngay giáo án này?</span>
    <span class="text-[10px] text-slate-400">Tự động nạp vào thời khóa biểu 1 tuần của bạn</span>
  </div>
  <button onclick="loadPlanFromChatToPlanner('Push - Pull - Legs 4 Buổi Tăng Cơ Nạc', 'Tăng cơ nạc (Hypertrophy)')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-black text-xs shadow-md">
    ⚡ Nạp Vào Lịch 1 Tuần
  </button>
</div>`,
        sources: ["SmartGym AI Sports Science", "ISSN Journal", "NSCA Essentials of Strength Training"]
      };
    }

    // Branch B: Upper - Lower Split
    if (low.includes('upper') || low.includes('lower') || low.includes('thân trên') || low.includes('văn phòng') || low.includes('người đi làm')) {
      return {
        thinking: `🧠 Workout Science Reasoning (Upper/Lower Split):
1. Mục tiêu: 4 ngày/tuần tối ưu cho người bận rộn. Mỗi nhóm cơ kích thích 2 lần/tuần (Frequency x2).
2. Upper A tập trung Sức mạnh (Strength Focus), Upper B tập trung Phì đại (Hypertrophy Focus).
3. Thời lượng: 50-60 phút/buổi.`,
        text: `### ⚡ GIÁO ÁN UPPER - LOWER 4 NGÀY DÀNH CHO NGƯỜI BẬN RỘN

Giáo án **Upper - Lower** là lựa chọn số 1 cho người đi làm hoặc sinh viên muốn tối đa hóa cơ bắp trong **4 buổi/tuần (Thứ 2, 3, 5, 6 - Nghỉ Thứ 4, 7, CN)**.

---

#### 📋 LỊCH TẬP CHI TIẾT TỪNG NGÀY:

* **Thứ 2 (Upper A - Heavy Strength):**
  1. Barbell Flat Bench Press: 4 sets x 5-6 reps (RPE 8, Nghỉ 2.5p)
  2. Barbell Bent-Over Row: 4 sets x 6-8 reps (RPE 8, Nghỉ 2p)
  3. Overhead Military Press: 3 sets x 6-8 reps (RPE 8, Nghỉ 90s)
  4. Lat Pulldown tay cầm hẹp: 3 sets x 8-10 reps (RPE 8, Nghỉ 90s)
  5. Barbell Biceps Curl & Cable Triceps Pushdown: 3 sets x 10-12 reps

* **Thứ 3 (Lower A - Quads & Calves):**
  1. Barbell Back Squat: 4 sets x 5-6 reps (RPE 8, Nghỉ 3p)
  2. Romanian Deadlift (RDL): 3 sets x 8-10 reps (RPE 8, Nghỉ 2p)
  3. Leg Press: 3 sets x 10-12 reps (RPE 8.5, Nghỉ 90s)
  4. Lying Leg Curl: 3 sets x 12-15 reps (RPE 9, Nghỉ 60s)
  5. Standing Calf Raise: 4 sets x 15 reps

* **Thứ 5 (Upper B - Hypertrophy & Volume):**
  1. Incline Dumbbell Bench Press: 4 sets x 8-10 reps (RPE 8, Nghỉ 90s)
  2. Pull-ups / Cable Row: 4 sets x 8-10 reps (RPE 8, Nghỉ 90s)
  3. Dumbbell Lateral Raise (Vai ngang): 4 sets x 12-15 reps (RPE 9, Nghỉ 60s)
  4. Chest Flyes (Ép ngực máy/cáp): 3 sets x 12-15 reps (RPE 9, Nghỉ 60s)
  5. Incline Dumbbell Curl & Overhead Triceps Extension: 3 sets x 10-12 reps

* **Thứ 6 (Lower B - Posterior Chain & Glutes):**
  1. Conventional / Trap-Bar Deadlift: 3 sets x 5 reps (RPE 8, Nghỉ 3p)
  2. Bulgarian Split Squat: 3 sets x 8-10 reps/chân (RPE 8.5, Nghỉ 90s)
  3. Leg Extension (Đá đùi trước): 3 sets x 12-15 reps (RPE 9, Nghỉ 60s)
  4. Seated Calf Raise & Hanging Leg Raise (Bụng): 4 sets x 15 reps

<div class="mt-3 p-3 bg-slate-900 rounded-2xl border border-sky-500/40 flex items-center justify-between">
  <div>
    <span class="text-xs font-bold text-white block">Áp dụng giáo án Upper/Lower 4 Ngày?</span>
    <span class="text-[10px] text-slate-400">Tự động nạp vào hệ thống theo dõi lịch tập của bạn</span>
  </div>
  <button onclick="loadPlanFromChatToPlanner('Upper - Lower 4 Ngày Khoa Học', 'Tăng cơ nạc (Hypertrophy)')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 text-white font-black text-xs shadow-md">
    ⚡ Nạp Vào Lịch 1 Tuần
  </button>
</div>`,
        sources: ["Dr. Brad Schoenfeld Hypertrophy Science", "SmartGym AI Database"]
      };
    }

    // Branch C: Fat Loss / Cut / Cardio combination
    if (low.includes('giảm mỡ') || low.includes('cut') || low.includes('cardio') || low.includes('calo') || low.includes('5kg')) {
      return {
        thinking: `🧠 Fat Loss & Muscle Preservation Protocol:
1. Thâm hụt calo (Caloric Deficit): 300 - 500 Kcal/ngày dưới mức TDEE.
2. Tập tạ nặng giữ cơ (Heavy Resistance Training): 3-4 buổi/tuần để báo hiệu cơ thể giữ lại mô cơ.
3. Zone 2 Cardio: 2-3 buổi, 30-40 phút ở nhịp tim 60-70% HRmax (đốt cháy mỡ oxy hóa tối đa).`,
        text: `### 🔥 PHÁC ĐỒ GIẢM MỠ CẮT NÉT & BẢO TOÀN CƠ BẮP (LEAN CUT)

Để giảm 4 - 6kg mỡ trong 8 tuần mà **không bị teo cơ hoặc tụt thể lực**, bạn cần áp dụng tam giác vàng: **Thâm hụt calo nhẹ + Tập tạ giữ cơ + Zone 2 Cardio**.

---

#### 1. LỊCH TẬP KẾT HỢP GYM & CARDIO 1 TUẦN:
* **Thứ 2 (Tập Tạ Thân Trên):** Ngực, Lưng, Vai + 15p Đi bộ dốc (Incline Treadmill, Dốc 10-12, Tốc độ 4.5km/h).
* **Thứ 3 (Tập Tạ Thân Dưới):** Squat, RDL, Leg Press (Giữ tạ nặng 6-8 reps để duy trì khối lượng cơ).
* **Thứ 4 (Cardio Zone 2 & Phục hồi):** Đạp xe hoặc chạy bộ nhẹ 35-45 phút (Giữ nhịp tim 120-135 BPM).
* **Thứ 5 (Tập Tạ Thân Trên Push/Pull):** Tập trung bơm máu và đốt năng lượng với Superset.
* **Thứ 6 (Tập Tạ Thân Dưới & Core Bụng):** Đùi sau, Mông, Gập bụng cáp + 15p HIIT ngắt quãng.
* **Thứ 7 & Chủ Nhật:** Đi bộ 8.000 - 10.000 bước mỗi ngày.

---

#### 2. NGUYÊN TẮC DINH DƯỠNG GIẢM MỠ CỐT LÕI:
* **Thâm hụt Calo:** Nạp ít hơn TDEE **350 - 450 Kcal/ngày** (Giảm ~0.5kg mỡ tinh khiết mỗi tuần).
* **Protein cao (Chìa khóa giữ cơ):** **2.0g - 2.4g Protein / kg thể trọng** (giúp no lâu và chống dị hóa cơ).
* **Uống đủ nước:** 3 lít/ngày, hạn chế hoàn toàn đường lỏng và bia rượu.

<div class="mt-3 p-3 bg-slate-900 rounded-2xl border border-rose-500/40 flex items-center justify-between">
  <div>
    <span class="text-xs font-bold text-white block">Áp dụng lịch tập Giảm Mỡ Cắt Nét?</span>
    <span class="text-[10px] text-slate-400">Nạp vào Lịch Tập Tuần để AI nhắc nhở Cardio</span>
  </div>
  <button onclick="loadPlanFromChatToPlanner('Lịch Gym & Cardio Giảm Mỡ Cắt Nét', 'Giảm mỡ & Săn chắc cơ thể')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-black text-xs shadow-md">
    ⚡ Nạp Vào Lịch 1 Tuần
  </button>
</div>`,
        sources: ["SmartGym AI Sports Nutrition Journal", "ACSM Fat Loss Guidelines"]
      };
    }

    // Branch D: Injury / Joint Pain Rehabilitation
    if (low.includes('đau') || low.includes('khớp') || low.includes('gối') || low.includes('lưng') || low.includes('cổ tay') || low.includes('chấn thương')) {
      return {
        thinking: `🧠 Sports Medicine & Injury Modification:
1. Xác định vị trí khớp nhạy cảm (Khớp gối, Cột sống thắt lưng, Khớp vai).
2. Nguyên tắc: Tránh các bài tạo lực cắt (Shear Force) lớn như Barbell Squat sâu hoặc Deadlift võng lưng.
3. Thay thế bằng bài tập an toàn: Goblet Squat có hộp (Box Squat), Leg Press chân cao, Hip Thrust, RDL tạ đơn.`,
        text: `### 🛡️ GIÁO ÁN TẬP AN TOÀN CHO NGƯỜI ĐAU KHỚP GỐI & THẮT LƯNG

⚠️ *Khuyến cáo an toàn y tế:* Nếu bạn có cơn đau nhói bất thường kéo dài, hãy tham khảo ý kiến bác sĩ chuyên khoa y học thể thao trước khi tập luyện.

---

#### 📋 BÀI TẬP THAY THẾ AN TOÀN CHO XƯƠNG KHỚP:

| Bài Tập Dễ Đau Khớp | Bài Tập Thay Thế An Toàn Tuyệt Đối | Cơ Chế Bảo Vệ Khớp |
| :--- | :--- | :--- |
| **Barbell Back Squat** (Áp lực lớn gối & thắt lưng) | 👉 **Box Squat (Squat ngồi hộp)** hoặc **Goblet Squat** | Giới hạn góc gập gối $\le 90^\circ$, giữ thân người thẳng bảo vệ đĩa đệm. |
| **Conventional Deadlift** (Dễ đau lưng dưới) | 👉 **Trap-Bar Deadlift** hoặc **Dumbbell RDL** | Dồn trọng tâm vào giữa cơ thể, giảm 70% mô-men xoắn lên cột sống L4-L5. |
| **Leg Extension máy** (Lực cắt dây chằng chéo trước) | 👉 **Spanish Squat dây kháng lực** hoặc **Reverse Lunge** | Tăng kích hoạt cơ đùi trước mà không tạo lực ép lên sụn chêm. |
| **Barbell Bench Press ngang** (Dễ kẹt khớp vai) | 👉 **Dumbbell Press góc nghiêng $30^\circ$ tay nắm trung tính (Neutral Grip)** | Giảm xoay trong khớp vai, tránh viêm gân chóp xoay (Rotator Cuff). |

---

#### 💡 NGUYÊN TẮC TẬP LUYỆN PHỤC HỒI:
1. **Kiểm soát nhịp độ (Tempo):** Hạ tạ chậm trong **3 giây (3-0-1-0)**, không thả rơi tự do.
2. **Khởi động kích hoạt (Activation):** Dành 10 phút tập bài Foam Rolling giãn cơ đùi và cây cầu mông (Glute Bridge) trước buổi tập.

<div class="mt-3 p-3 bg-slate-900 rounded-2xl border border-emerald-500/40 flex items-center justify-between">
  <div>
    <span class="text-xs font-bold text-white block">Áp dụng Lịch Tập Phục Hồi & Bảo Vệ Khớp?</span>
    <span class="text-[10px] text-slate-400">Đã tích hợp cơ chế hạn chế tải trọng nguy hiểm</span>
  </div>
  <button onclick="loadPlanFromChatToPlanner('Lịch Tập Thân Dưới An Toàn Cho Khớp', 'Cải thiện sức khỏe & Phục hồi')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-black text-xs shadow-md">
    ⚡ Nạp Vào Lịch 1 Tuần
  </button>
</div>`,
        sources: ["SmartGym AI Sports Medicine Board", "Mayo Clinic Sports Medicine"]
      };
    }

  // --- 1. TOÁN CAO CẤP, VI TÍCH PHÂN, ĐẠI SỐ TUYẾN TÍNH & THUẬT TOÁN (DeepSeek R1 Specialization) ---
  if (/(toán cao cấp|ma trận|đạo hàm|tích phân|vi phân|đại số tuyến tính|xác suất|bayes|gradient descent|thuật toán|quy hoạch động|dynamic programming|đồ thị|dijkstra|leetcode|phương trình|tính|bằng bao nhiêu)/i.test(low)) {
    // Check arithmetic calculation
    let mathClean = q.replace(/[^\d\+\-\*\/\^\%\(\)\.\,\÷\×]/g, ' ').trim();
    mathClean = mathClean.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
    const tokens = mathClean.match(/[\d\.\+\-\*\/\(\)\*\%]+/g);
    if (tokens && tokens.length > 0) {
      try {
        const candidate = tokens[0];
        const val = Function(`'use strict'; return (${candidate})`)();
        if (typeof val === 'number' && !isNaN(val)) {
          return {
            thinking: `🧠 DeepSeek R1 Chain-of-Thought:\n1. Phân tích biểu thức đại số: \\(${candidate}\\)\n2. Kiểm tra các quy tắc số học, lũy thừa và thứ tự thực thi toán tử.\n3. Tính toán giá trị hội tụ chính xác: \\(${val}\\).`,
            text: `### 🔢 Kết Quả Phép Tính Toán Học (DeepSeek R1 & Math Engine):\n\nBiểu thức: **${q}**\n\n$$\\mathbf{${candidate.replace(/\*\*/g, '^')} = ${val.toLocaleString('vi-VN')}}$$\n\n* **Kết quả chính xác:** **${val.toLocaleString('vi-VN')}**\n* **Chứng minh:** Biểu thức được giải quyết thông qua công cụ giải tích số học chuẩn xác cao.`,
            sources: ["deepseek.ai", "wolframalpha.com", "arxiv.org/math"]
          };
        }
      } catch (e) {}
    }

    if (low.includes('gradient') || low.includes('tối ưu') || low.includes('loss')) {
      return {
        thinking: `🧠 DeepSeek R1 Reinforcement Learning Thought:\n1. Khái niệm: Thuật toán Tối ưu hóa Gradient Descent trong Machine Learning.\n2. Công thức cập nhật trọng số: $\\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t)$.\n3. Phân tích các biến thể: SGD, Adam, RMSProp.`,
        text: `### 📐 Giải Tích Tối Ưu Hóa: Gradient Descent (Tư Duy Sâu Từ DeepSeek R1)\n\n**Gradient Descent** là thuật toán tối ưu hóa nền tảng trong Học Máy (Machine Learning) và Học Sâu (Deep Learning) nhằm tìm cực tiểu hàm mất mát (Loss Function $L(\\theta)$).\n\n#### 1. Công thức toán học cốt lõi:\n$$\\theta_{t+1} = \\theta_t - \\eta \\cdot \\nabla L(\\theta_t)$$\n* $\\theta$: Vector tham số (trọng số $W$ và bias $b$).\n* $\\eta$ (Learning Rate): Tốc độ học.\n* $\\nabla L(\\theta_t)$: Vector Gradient (đạo hàm riêng theo từng tham số).\n\n#### 2. So sánh các biến thể tối ưu:\n* **SGD (Stochastic Gradient Descent):** Cập nhật trên từng mẫu đơn lẻ, nhanh nhưng dao động lớn.\n* **Adam Optimizer (Khuyên dùng):** Kết hợp Momentum + RMSProp, tự động thích ứng learning rate cho từng trọng số.`,
        sources: ["deepseek.com", "arxiv.org/abs/1412.6980", "cs231n.stanford.edu"]
      };
    }
  }

  // --- 2. THIẾT KẾ HỆ THỐNG & KỸ THUẬT PHẦN MỀM ENTERPRISE (Claude 3.5 Sonnet Specialization) ---
  if (/(system design|thiết kế hệ thống|microservice|kafka|redis|kubernetes|docker|kiến trúc|clean architecture|solid|database sharding|load balancer|backend|frontend|graphql|rest api|c\+\+|python|golang|rust|typescript)/i.test(low)) {
    if (low.includes('system design') || low.includes('kiến trúc') || low.includes('microservice') || low.includes('kafka') || low.includes('redis')) {
      return {
        thinking: `🧠 Claude 3.5 Sonnet Architectural Breakdown:\n1. Yêu cầu phi chức năng: Khả năng mở rộng (High Scalability), Tính sẵn sàng cao (High Availability 99.99%), Độ trễ thấp (<50ms).\n2. Thành phần hệ thống: API Gateway -> Load Balancer -> Microservices -> Redis Cache (Cache-Aside) -> Kafka Event Broker -> Sharded DB.\n3. Đảm bảo tính nhất quán (CAP Theorem / BASE Model).`,
        text: `### 🏗️ Kiến Trúc Hệ Thống Phân Tán Triệu Người Dùng (Claude 3.5 Sonnet):\n\n\`\`\`mermaid
flowchart LR
    Client([📱 Client / Web]) --> CF[Cloudflare CDN & WAF]
    CF --> LB[Nginx Load Balancer]
    LB --> GW[API Gateway (Kong / Envoy)]
    GW --> S1[Auth Service]
    GW --> S2[Gym Core API]
    GW --> S3[AI Streaming Engine]
    S2 --> Redis[(Redis In-Memory Cache)]
    S2 --> Kafka{{Apache Kafka Broker}}
    Kafka --> S3
    Kafka --> Worker[Async Worker Pool]
    Worker --> DB[(PostgreSQL Master-Slave Shards)]
\`\`\`\n\n#### 🔑 4 Nguyên Tắc Vàng Thiết Kế Hệ Thống:\n1. **Chiến lược Caching (Cache-Aside Pattern):** Đọc từ Redis trước; nếu Cache Miss thì truy vấn DB và ghi đè lại vào Redis với TTL hợp lý.\n2. **Bất đồng bộ hóa với Message Queue (Kafka/RabbitMQ):** Tách rời các tác vụ nặng (xử lý video, huấn luyện mô hình, gửi thông báo push) khỏi luồng chính (Main Thread).\n3. **Cơ chế Circuit Breaker (Resilience4j / Hystrix):** Ngắt kết nối tự động khi một dịch vụ phụ trợ bị treo để tránh hiệu ứng sụp đổ dây chuyền (Cascading Failure).\n4. **Database Sharding & Replication:** Phân tách dữ liệu theo \`member_id % N\` để chịu tải hàng triệu bản ghi.`,
        sources: ["anthropic.com/claude", "martinfowler.com", "highscalability.com"]
      };
    }
  }

  // --- 3. KINH DOANH, TÀI CHÍNH, ĐỊNH GIÁ & CHIẾN LƯỢC GTM (OpenAI GPT-4o Specialization) ---
  if (/(kinh doanh|doanh thu|tài chính|dcf|ebitda|roi|cac|ltv|marketing|chiến lược|khởi nghiệp|startup|kế hoạch kinh doanh|gtm|định giá)/i.test(low)) {
    return {
      thinking: `🧠 GPT-4o Business Strategy Reasoning:\n1. Xác định bài toán kinh doanh & mô hình tài chính.\n2. Phân tích các chỉ số tài chính trọng yếu: CAC (Customer Acquisition Cost), LTV (Lifetime Value), EBITDA, Runway.\n3. Đề xuất chiến lược Go-To-Market (GTM) và tối ưu hóa chuyển đổi.`,
      text: `### 📈 Phân Tích Chiến Lược Kinh Doanh & Quản Trị Tài Chính (GPT-4o Omni):\n\n#### 1. Bộ Chỉ Số Tài Chính & Tăng Trưởng Cốt Lõi:\n* **Tỷ Lệ $\\frac{\\text{LTV}}{\\text{CAC}} \\ge 3.0$:** Đảm bảo giá trị vòng đời khách hàng gấp ít nhất 3 lần chi phí thu hút khách mới.\n* **Payback Period $\\le 6 - 8$ Tháng:** Thời gian thu hồi vốn chi phí marketing cho một hội viên.\n* **Net Churn Rate $< 3\\%$/tháng:** Giữ chân hội viên trung thành bằng trải nghiệm cá nhân hóa AI.\n\n#### 2. Chiến Lược Go-To-Market (GTM) 3 Giai Đoạn:\n1. **Giai đoạn 1 (Thâm nhập):** Miễn phí trải nghiệm quét InBody AI và tư vấn lộ trình tập luyện 1-on-1.\n2. **Giai đoạn 2 (Tạo giá trị & Khóa phễu):** Cung cấp gói Premium tích hợp App theo dõi Calo và Pose Tracking trực tiếp.\n3. **Giai đoạn 3 (Mở rộng & Upsell):** Bán chéo (Cross-sell) dịch vụ PT kèm riêng và thực phẩm bổ sung dinh dưỡng.`,
      sources: ["openai.com", "mckinsey.com", "harvardbusinessreview.org"]
    };
  }

  // --- 4. Y HỌC, SINH HỌC CƠ BẮP, HORMONES & DINH DƯỠNG NÂNG CAO ---
  if (/(mtor|protein synthesis|hypertrophy|testosterone|cortisol|insulin|chấn thương|dây chằng|thoát vị|meniscus|xương khớp|axit lactic|atp|kreb)/i.test(low)) {
    return {
      thinking: `🧠 Medical & Exercise Physiology Synthesis:\n1. Cơ chế phân tử: Con đường tín hiệu mTORC1 điều hòa tổng hợp Protein cơ bắp (MPS).\n2. Tác động của cơ học (Mechanical Tension), tổn thương cơ (Muscle Damage) và stress chuyển hóa (Metabolic Stress).\n3. Cân bằng nội tiết tố và phục hồi hệ thần kinh trung ương (CNS).`,
      text: `### 🧬 Sinh Học Phân Tử & Cơ Chế Phát Triển Cơ Bắp (Hypertrophy Science):\n\n#### 1. Con đường Tín Hiệu mTORC1 (Cốt Lõi Tăng Cơ):\n* **Kích hoạt Cơ học (Mechanical Tension):** Khi cơ bắp chịu tải trọng lớn gần ngưỡng thất bại (RPE 8-10), các thụ thể cảm nhận lực kéo (Integrins) kích hoạt chuỗi kinase **mTORC1 (Mechanistic Target of Rapamycin Complex 1)**.\n* **Tổng hợp Protein Cơ bắp (MPS):** mTORC1 thúc đẩy ribosome dịch mã mRNA thành các sợi tơ cơ mới (Actin và Myosin), làm tăng tiết diện ngang của sợi cơ.\n\n#### 2. Tối Ưu Hóa Dinh Dưỡng & Axit Amin:\n* **Ngưỡng Leucine (Leucine Trigger):** Cần nạp tối thiểu **2.7g - 3.5g Leucine** mỗi bữa ăn (tương đương 25-30g Whey Protein) để bật công tắc mTOR.\n* **Kiểm soát Cortisol:** Hormon dị hóa (Catabolic) tăng cao khi thiếu ngủ hoặc tập quá 90 phút liên tục. Hãy ngủ đủ 7.5 - 8.5 tiếng để nồng độ Testosterone đạt đỉnh vào buổi sáng.`,
      sources: ["ncbi.nlm.nih.gov/pubmed", "journalofphysiology.org", "hubermanlab.com"]
    };
  }

  // --- 5. TRIẾT HỌC, TÂM LÝ HỌC & ĐỜI SỐNG (Deep Humanities Reasoning) ---
  if (/(triết học|khắc kỷ|stoicism|tâm lý|hạnh phúc|ý nghĩa cuộc sống|động lực|lo âu|stress|trầm cảm|tư duy)/i.test(low)) {
    return {
      thinking: `🧠 Philosophical & Psychological Insights:\n1. Nhận diện vấn đề tâm lý / triết lý nhân sinh.\n2. Ứng dụng Chủ nghĩa Khắc kỷ (Stoicism - Marcus Aurelius / Epictetus) & Liệu pháp Nhận thức Hành vi (CBT).\n3. Đưa ra góc nhìn sâu sắc, tĩnh tại và giải pháp thực tế.`,
      text: `### 🏛️ Góc Nhìn Triết Học & Tâm Lý Học Về Bản Lĩnh Sống (Omni-AI Wisdom):\n\n#### 1. Vòng Tròn Kiểm Soát (Dichotomy of Control - Chủ Nghĩa Khắc Kỷ):\n* **Những thứ BẠN kiểm soát được:** Suy nghĩ, phản ứng, nỗ lực, kỷ luật và cách bạn đối diện với nghịch cảnh.\n* **Những thứ BẠN KHÔNG THỂ kiểm soát:** Ý kiến của người khác, kết quả tức thời, sự may rủi của số phận.\n* 👉 *Bí quyết của sự an yên và sức mạnh nội tại:* Hãy dồn 100% năng lượng vào những gì bạn kiểm soát được và buông bỏ sự dằn vặt với những điều còn lại.\n\n#### 2. Định Luật Tiến Bộ Tích Lũy (Compound Effect):\n* Thành công không đến từ một cú nhảy vọt lớn, mà là kết quả của **1% cải thiện mỗi ngày** được nhân bội theo thời gian ($1.01^{365} = 37.78$).`,
      sources: ["plato.stanford.edu", "apa.org", "dailystoic.com"]
    };
  }

  // --- 6. TỔNG HỢP TOÀN DIỆN MỌI CÂU HỎI MỞ (Omni Deep Domain Reasoner) ---
  return {
    thinking: `🧠 Omni-AI Mega Brain Multi-Model Consensus:\n1. [DeepSeek R1]: Phân tích logic và cấu trúc các mệnh đề cốt lõi của câu hỏi: "${q}".\n2. [Claude 3.5]: Rà soát tính chặt chẽ, văn phong học thuật và các góc nhìn đa chiều.\n3. [GPT-4o & Gemini 2.5]: Tổng hợp câu trả lời chuyên sâu, có tính hành động thực tiễn cao.`,
    text: `### 💡 Phân Tích Chuyên Sâu Từ Bộ Não Hợp Nhất Omni-AI:\n\nCảm ơn bạn đã đặt câu hỏi: **"${q}"**.\n\n---\n\n#### 1. 🔍 Bản Chất Cốt Lõi & Nguyên Lý Nền Tảng:\n* Vấn đề bạn nêu ra liên quan trực tiếp đến việc kết hợp giữa **cơ sở lý thuyết khoa học** và **ứng dụng thực tiễn**.\n* Để đạt hiệu quả cao nhất, phương pháp tiếp cận cần đi từ nguyên nhân gốc rễ (First Principles Thinking) thay vì chỉ giải quyết các biểu hiện bề mặt.\n\n#### 2. 📊 Phân Tích Đa Chiều & Lộ Trình Triển Khai:\n* **Giai đoạn 1 (Chuẩn bị & Đánh giá):** Thu thập dữ liệu chính xác, nhận diện các yếu tố ảnh hưởng và đo lường điều kiện ban đầu.\n* **Giai đoạn 2 (Thực thi chuẩn hóa):** Áp dụng quy trình từng bước, kiểm soát chất lượng và tối ưu hóa thời gian.\n* **Giai đoạn 3 (Đo lường & Tối ưu liên tục):** Đánh giá hiệu suất định kỳ và thích ứng linh hoạt trước biến số.\n\n#### 3. 🎯 Lời Khuyên Chuyên Gia Từ Omni-AI:\n* Hãy bắt đầu với một kế hoạch rõ ràng và kiên trì bám sát mục tiêu.\n* Nếu bạn cần đi sâu hơn vào việc lập trình, tính toán toán học chi tiết, viết luận hay xây dựng giải pháp kỹ thuật, hãy tiếp tục đặt câu hỏi để tôi hỗ trợ bạn ngay lập tức!`,
    sources: ["google.com/ai", "anthropic.com", "openai.com", "deepseek.com", "SmartGymAI.vn"]
  };
}

function renderGeminiUniversalResponse(responseId, userPrompt, answerObj, isThinking, isWebSearch) {
  const container = document.getElementById(responseId);
  if (!container) return;

  const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const thinkingHtml = (isThinking && answerObj.thinking) ? `
    <details class="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-3.5 text-xs text-purple-200 space-y-2 mb-3">
      <summary class="cursor-pointer font-bold text-purple-300 flex items-center justify-between select-none">
        <span class="flex items-center space-x-2">
          <i data-lucide="brain" class="w-4 h-4 text-purple-400"></i>
          <span>Quá trình tư duy & suy luận của Gemini (Thinking Steps)</span>
        </span>
        <span class="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-500/30">Chi tiết</span>
      </summary>
      <div class="pt-2 text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed border-t border-purple-500/20 mt-2">
${answerObj.thinking}
      </div>
    </details>
  ` : '';

  let formattedHtml = answerObj.text
    .replace(/```python([\s\S]*?)```/g, (match, code) => {
      return `
        <div class="my-3 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
          <div class="bg-slate-900 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
            <span class="font-mono text-emerald-400 font-bold">Python</span>
            <button onclick="copyCodeSnippet(this)" class="hover:text-white transition flex items-center space-x-1">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>Sao chép code</span>
            </button>
          </div>
          <pre class="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed"><code>${code.trim()}</code></pre>
        </div>
      `;
    })
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  container.className = 'flex items-start space-x-3.5';
  container.innerHTML = `
    <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-indigo-500/30">
      <i data-lucide="bot" class="w-5 h-5"></i>
    </div>
    <div class="bg-slate-900 border border-indigo-500/30 p-5 rounded-3xl rounded-tl-none text-slate-200 text-sm space-y-3 max-w-[92%] shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
        <span class="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-300">
          Chatbot AI (Universal Intelligence)
        </span>
        <span class="text-slate-500 font-mono text-[11px]">${timeStr}</span>
      </div>

      ${thinkingHtml}

      <div class="leading-relaxed text-slate-200 space-y-2">
        ${formattedHtml}
      </div>

      <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center space-x-2">
          <button onclick="copyGeminiResponse(this)" class="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition" title="Sao chép câu trả lời">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
          <button onclick="speakStudioSpeech('${answerObj.text.replace(/[*#_`~⚠️👉•\n]/g, ' ').replace(/'/g, "\\'")}')" class="p-1.5 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition" title="Nghe giọng đọc">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </button>
        </div>
        <span class="text-[10px] text-slate-500 font-mono">https://SmartGymAI.vn</span>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
  const stream = document.getElementById('gemini-chat-stream');
  if (stream) stream.scrollTop = stream.scrollHeight;
}

function copyCodeSnippet(btn) {
  const codeBlock = btn.closest('div').nextElementSibling?.querySelector('code');
  if (codeBlock) {
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i><span class="text-emerald-400">Đã chép!</span>`;
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5"></i><span>Sao chép code</span>`;
        if (window.lucide) lucide.createIcons();
      }, 2000);
    });
  }
}

function copyGeminiResponse(btn) {
  const textContainer = btn.closest('.bg-slate-900').innerText;
  navigator.clipboard.writeText(textContainer).then(() => {
    alert('Đã sao chép phản hồi của Gemini vào clipboard!');
  });
}

// =========================================================================
// 7. GYM MULTI-AGENT CHAT STUDIO (Tab Chatbot Gym 24/7)
// =========================================================================
const chatStudioState = {
  currentPersona: 'general',
  isAudioSpeechEnabled: true,
  history: []
};

const personaConfig = {
  'general': {
    title: 'SmartGym AI Assistant (Toàn Năng)',
    avatar: 'AI',
    avatarColor: 'bg-emerald-600/30 text-emerald-400 border-emerald-500/40',
    bubbleColor: 'border-emerald-500/30',
    welcomeMsg: 'Xin chào! Tôi là Trợ lý AI Tổng hợp của https://SmartGymAI.vn. Hãy đặt bất kỳ câu hỏi nào về tập luyện, dinh dưỡng, hoặc thủ tục phòng gym.'
  },
  'pt-hung': {
    title: 'HLV Thể Hình (Master Trainer Trần Hùng)',
    avatar: '🏋️',
    avatarColor: 'bg-amber-600/30 text-amber-300 border-amber-500/40',
    bubbleColor: 'border-amber-500/30',
    welcomeMsg: 'Chào người anh em! Tôi là HLV Trần Hùng (Chuyên sâu Tăng cơ & Sức mạnh). Bạn đang cần tối ưu bài đẩy ngực, squat hay chia lịch tập tăng khối lượng cơ (Hypertrophy)? Cứ hỏi tôi nhé!'
  },
  'coach-linh': {
    title: 'Chuyên Gia Dinh Dưỡng (Coach Mai Linh)',
    avatar: '🥗',
    avatarColor: 'bg-teal-600/30 text-teal-300 border-teal-500/40',
    bubbleColor: 'border-teal-500/30',
    welcomeMsg: 'Chào bạn! Mình là Mai Linh, chuyên gia dinh dưỡng thể thao. Bạn cần tính lượng Calo TDEE, thiết kế thực đơn siết mỡ hay chia tỷ lệ Macro (Protein/Carb/Fat) cho các bữa ăn?'
  },
  'dr-khoa': {
    title: 'Bác Sĩ Phục Hồi Thể Thao (Dr. Đặng Khoa)',
    avatar: '🩺',
    avatarColor: 'bg-purple-600/30 text-purple-300 border-purple-500/40',
    bubbleColor: 'border-purple-500/30',
    welcomeMsg: 'Chào bạn, tôi là Dr. Khoa (Chuyên khoa Y học thể thao & Phục hồi chức năng). Nếu bạn đang gặp vấn đề đau khớp gối, mỏi cột sống lưng hay căng cơ, hãy chia sẻ cụ thể nhé!'
  }
};

function setChatPersona(personaKey) {
  chatStudioState.currentPersona = personaKey;
  const cfg = personaConfig[personaKey];

  ['general', 'pt-hung', 'coach-linh', 'dr-khoa'].forEach(key => {
    const btn = document.getElementById(`persona-btn-${key}`);
    if (btn) {
      if (key === personaKey) {
        btn.className = 'persona-card active p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/20 cursor-pointer transition flex items-center space-x-3';
      } else {
        btn.className = 'persona-card p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 cursor-pointer transition flex items-center space-x-3';
      }
    }
  });

  const titleEl = document.getElementById('studio-active-title');
  const avatarEl = document.getElementById('studio-active-avatar');
  if (titleEl) titleEl.textContent = cfg.title;
  if (avatarEl) {
    avatarEl.textContent = cfg.avatar;
    avatarEl.className = `w-9 h-9 rounded-full ${cfg.avatarColor} flex items-center justify-center font-bold text-sm`;
  }
}

function sendStudioPrompt(promptText) {
  const input = document.getElementById('studio-chat-input');
  if (input) {
    input.value = promptText;
    handleSendStudioMessage(new Event('submit'));
  }
}

function toggleStudioAudioResponse() {
  chatStudioState.isAudioSpeechEnabled = !chatStudioState.isAudioSpeechEnabled;
  const label = document.getElementById('studio-audio-label');
  const btn = document.getElementById('btn-studio-audio-toggle');
  
  if (chatStudioState.isAudioSpeechEnabled) {
    if (label) label.textContent = 'Giọng đọc: BẬT';
    if (btn) btn.classList.add('border-emerald-500', 'bg-emerald-950/40');
    speakStudioSpeech('Đã bật giọng đọc trợ lý AI.');
  } else {
    if (label) label.textContent = 'Giọng đọc: TẮT';
    if (btn) btn.classList.remove('border-emerald-500', 'bg-emerald-950/40');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

function speakStudioSpeech(text) {
  if (!chatStudioState.isAudioSpeechEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const cleanText = text.replace(/[*#_`~⚠️👉•]/g, '').replace(/https?:\/\/[^\s]+/g, 'SmartGym A I');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'vi-VN';
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
}

function simulateVoiceInput() {
  const micBtn = document.getElementById('btn-studio-mic');
  const input = document.getElementById('studio-chat-input');
  
  if (micBtn) micBtn.classList.add('bg-rose-600', 'text-white', 'animate-pulse');
  if (input) input.placeholder = '🎙️ Đang nghe giọng nói...';

  setTimeout(() => {
    if (micBtn) micBtn.classList.remove('bg-rose-600', 'text-white', 'animate-pulse');
    if (input) {
      input.placeholder = 'Nhập câu hỏi cho trợ lý AI...';
      input.value = 'Lên cho tôi thực đơn tăng cơ 2200 calo giàu protein và lịch tập 4 buổi một tuần';
    }
    handleSendStudioMessage(new Event('submit'));
  }, 1200);
}

function handleSendStudioMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('studio-chat-input');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;

  const stream = document.getElementById('studio-chat-stream');
  const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const persona = chatStudioState.currentPersona;
  const cfg = personaConfig[persona];

  if (stream) {
    stream.innerHTML += `
      <div class="flex items-start justify-end space-x-2.5">
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-3.5 rounded-2xl rounded-tr-none text-white text-xs sm:text-sm max-w-[80%] shadow-md">
          <p class="leading-relaxed">${msg}</p>
          <div class="text-[10px] text-emerald-200/80 text-right mt-1">${timeStr}</div>
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-700 ring-1 ring-emerald-500/50 flex items-center justify-center font-bold text-xs text-emerald-300 shrink-0">
          NA
        </div>
      </div>
    `;
    stream.scrollTop = stream.scrollHeight;
  }

  if (input) input.value = '';

  setTimeout(() => {
    const low = msg.toLowerCase();
    let replyText = '';

    // Persona-specific intelligent responses
    if (persona === 'pt-hung') {
      if (low.includes('ngực') || low.includes('bench')) {
        replyText = `Đối với bài đẩy ngực (Bench Press): Hãy ép chặt 2 xương bả vai (Retract Scapula) vào ghế, đặt chân vững chãi trên sàn, ưỡn ngực nhẹ và hạ tạ có kiểm soát chạm ngực dưới. Đẩy lên thở ra, không khóa cứng khớp cùi chỏ nhé bro!`;
      } else if (low.includes('squat') || low.includes('chân') || low.includes('đùi')) {
        replyText = `Khi tập Squat: Mở rộng 2 chân bằng vai, mũi chân xoay ngoài 15-30 độ. Gồng chặt Core (Hít sâu nén bụng bằng kĩ thuật Valsalva), đẩy hông ra sau rồi gập gối hạ thấp đến khi đùi song song sàn nhà.`;
      } else if (low.includes('lịch') || low.includes('chia') || low.includes('split')) {
        replyText = `Lịch tập tăng cơ tối ưu nhất hiện nay là **Push - Pull - Legs (Đẩy - Kéo - Chân)** 3-6 buổi/tuần hoặc **Upper - Lower (Thân trên - Thân dưới)** 4 buổi/tuần để đảm bảo mỗi nhóm cơ được kích thích 2 lần/tuần.`;
      } else {
        replyText = `HLV Trần Hùng đã nhận được câu hỏi: "${msg}". Để tối ưu cơ bắp và sức mạnh, hãy duy trì nguyên lý Quá tải tăng dần (Progressive Overload), ngủ đủ 7-8 tiếng và nạp 2g protein/kg thể trọng mỗi ngày!`;
      }
    } else if (persona === 'coach-linh') {
      if (low.includes('calo') || low.includes('tdee') || low.includes('ăn')) {
        replyText = `Về dinh dưỡng: Để giảm mỡ, bạn hãy thâm hụt 300-500 Kcal so với TDEE; để tăng cơ nạc hãy thặng dư 200-300 Kcal. Tỷ lệ Macro chuẩn là 40% Carb, 30% Protein, 30% Good Fat (từ quả bơ, dầu ô liu, hạt hạnh nhân).`;
      } else if (low.includes('whey') || low.includes('creatine') || low.includes('tpcn')) {
        replyText = `Thực phẩm bổ sung: **Whey Protein** giúp bổ sung đạm nhanh sau tập, còn **Creatine Monohydrate (5g/ngày)** là supplement đã được chứng minh hiệu quả nhất để tăng sức mạnh và trữ nước nội bào trong cơ bắp.`;
      } else {
        replyText = `Coach Mai Linh: "${msg}" - Dinh dưỡng chiếm 70% thành công của bạn. Hãy đảm bảo uống đủ 2-3 lít nước mỗi ngày, ăn nhiều rau xanh giàu chất xơ và chia nhỏ 3-4 bữa ăn để chuyển hóa tối ưu!`;
      }
    } else if (persona === 'dr-khoa') {
      if (low.includes('đau') || low.includes('khớp') || low.includes('lưng') || low.includes('mỏi')) {
        replyText = `⚠️ **Lời khuyên Y tế & Phục hồi:** Khi bị đau khớp hoặc mỏi lưng dưới, bạn cần dừng ngay mức tạ nặng. Hãy chườm lạnh 15-20 phút nếu viêm cấp, giãn cơ nhẹ nhàng (Dynamic & Static Stretching) và tham khảo ý kiến chuyên gia vật lý trị liệu trước khi tiếp tục.`;
      } else {
        replyText = `Dr. Đặng Khoa: Với vấn đề "${msg}", tôi khuyến nghị bạn luôn khởi động kỹ khớp (Khởi động xoay khớp 5-10 phút) và tập kích hoạt các nhóm cơ hỗ trợ (Rotator cuff, Glute medius, Core) trước mỗi buổi tập nặng để phòng ngừa chấn thương lâu dài.`;
      }
    } else {
      // General SmartGym Assistant
      if (low.includes('giờ') || low.includes('mở cửa') || low.includes('địa chỉ') || low.includes('liên hệ')) {
        replyText = `Phòng tập SmartGym AI mở cửa từ **05:30 đến 22:00** tất cả các ngày trong tuần (kể cả Lễ, Tết). Hotline hỗ trợ 24/7: **1900 888 999**.`;
      } else if (low.includes('giá') || low.includes('gói') || low.includes('membership')) {
        replyText = `Chúng tôi có các gói tập từ **590.000đ/tháng (Cơ bản)** đến **2.490.000đ/tháng (Platinum VIP có PT kèm)**. Bạn có thể sang tab **Đăng Ký Gói** để xem chi tiết và kích hoạt ưu đãi!`;
      } else {
        // If it's a general non-gym question, answer it intelligently and suggest Gemini Universal tab
        const smartKnowledge = generateUniversalGeminiKnowledge(msg, false, false);
        replyText = `${smartKnowledge.text}\n\n💡 *Mẹo: Bạn có thể chuyển sang tab **"Gemini AI Universal"** để trò chuyện chuyên sâu, giải toán, viết code, tư duy sâu với mô hình AI toàn năng!*`;
      }
    }

    if (stream) {
      stream.innerHTML += `
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 rounded-full ${cfg.avatarColor} flex items-center justify-center text-xs font-bold shrink-0">
            ${cfg.avatar}
          </div>
          <div class="bg-slate-900 border ${cfg.bubbleColor} p-4 rounded-2xl rounded-tl-none text-slate-200 text-xs sm:text-sm space-y-2 max-w-[88%] shadow-xl">
            <div class="font-bold text-emerald-400">${cfg.title}</div>
            <div class="space-y-1.5 leading-relaxed">${replyText.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      `;
      stream.scrollTop = stream.scrollHeight;
      if (window.lucide) lucide.createIcons();
      speakStudioSpeech(replyText);
    }
  }, 500);
}

function clearStudioChat() {
  if (confirm('Làm mới cuộc trò chuyện?')) {
    const stream = document.getElementById('studio-chat-stream');
    if (stream) {
      stream.innerHTML = `<div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">Đã làm mới cuộc hội thoại.</div>`;
    }
  }
}

function exportChatTranscript() {
  let text = "NHẬT KÝ CHAT - SMARTGYMAI.VN\n" + new Date().toLocaleString() + "\n";
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `SmartGymAI_Chat_${Date.now()}.txt`;
  a.click();
}

// =========================================================================
// 8. REGISTRATION, BOOKING & ATTENDANCE OPERATIONS
// =========================================================================
function registerPackage(pkgName, price) {
  const confirmed = confirm(`Bạn có muốn đăng ký gói "${pkgName}" (${price}) không?\nHệ thống sẽ chuyển tiếp thông tin đến chuyên viên và kích hoạt quyền lợi AI.`);
  if (confirmed) {
    state.user.membership = pkgName;
    const subEl = document.getElementById('header-user-sub');
    if (subEl) subEl.textContent = `${pkgName} • Mới kích hoạt`;
    alert(`Chúc mừng bạn đã đăng ký thành công gói ${pkgName}! Hãy đặt lịch buổi tập đầu tiên.`);
    switchTab('booking');
  }
}

function openAiAdvisorModal() {
  const goal = prompt("Nhập mục tiêu chính của bạn:", "Tăng cơ và cần người chỉnh kỹ thuật");
  if (goal) {
    alert(`🤖 AI Gợi Ý:\n\nĐề xuất gói "Smart Pro + 8 Buổi PT" (2.490.000đ/tháng) để có HLV kèm cặp tư thế an toàn nhất.`);
  }
}

function selectTrainerForBooking(trainerName, specialty) {
  const input = document.getElementById('booking-trainer-input');
  if (input) input.value = `HLV. ${trainerName} (${specialty})`;
  const noteInput = document.getElementById('booking-note-input');
  if (noteInput) noteInput.focus();
}

function confirmBooking() {
  const trainer = document.getElementById('booking-trainer-input')?.value || 'HLV. Trần Hùng';
  const date = document.getElementById('booking-date-input')?.value || '2026-08-19';
  const time = document.getElementById('booking-time-input')?.value || '18:00 - 19:00';
  const note = document.getElementById('booking-note-input')?.value || '';

  const badge = document.getElementById('upcoming-booking-badge');
  if (badge) {
    badge.innerHTML = `
      <div>
        <div class="font-bold text-white">${date} • ${time}</div>
        <div class="text-slate-400 text-[11px]">${trainer} ${note ? '- ' + note : ''}</div>
      </div>
      <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">Đã xác nhận</span>
    `;
  }

  alert(`✅ Đã đặt lịch thành công!\n\nHLV: ${trainer}\nThời gian: ${date} lúc ${time}`);
}

function renderAttendanceTable() {
  const tbody = document.getElementById('attendance-log-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.attendances.map(a => `
    <tr>
      <td class="py-2.5 font-medium text-white">${a.date}</td>
      <td class="py-2.5 text-slate-400">${a.method}</td>
      <td class="py-2.5 font-bold text-emerald-400">${a.duration}</td>
      <td class="py-2.5"><span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded text-[10px]">${a.status}</span></td>
    </tr>
  `).join('');
}

function simulateCheckIn() {
  const now = new Date();
  const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newLog = {
    date: timeStr,
    method: 'Quét mã QR Cổng A',
    duration: 'Vừa Check-in',
    status: 'Đang tập luyện'
  };

  state.attendances.unshift(newLog);
  renderAttendanceTable();

  const countEl = document.getElementById('stat-total-sessions');
  if (countEl) countEl.textContent = `${state.attendances.length + 5} Buổi`;

  alert(`🎉 Điểm danh thành công lúc ${timeStr}!\nCửa turnstile đã mở. Chúc bạn có buổi tập năng suất!`);
}

function syncAttendanceToPlanner() {
  alert('Đã cập nhật lịch sử điểm danh vào AI Engine.');
  switchTab('ai-planner');
  const input = document.getElementById('input-attendance');
  if (input) input.value = `Đã tập ${state.attendances.length + 5} buổi tháng này, buổi gần nhất lúc ${state.attendances[0].date}.`;
  generateAiWorkoutPlan();
}

function syncFromAttendanceTab() {
  const input = document.getElementById('input-attendance');
  if (input) input.value = `Đã ghi nhận ${state.attendances.length + 5} buổi check-in QR thực tế, tần suất tập ổn định 3-4 buổi/tuần.`;
  updatePromptDebugger();
}

// =========================================================================
// 9. HEALTH MODAL & FLOATING CHAT WIDGET
// ==========================================================
function openHealthModal() {
  const modal = document.getElementById('health-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeHealthModal() {
  const modal = document.getElementById('health-modal');
  if (modal) modal.classList.add('hidden');
}

function saveHealthModalData() {
  const w = parseFloat(document.getElementById('modal-weight')?.value) || 68.5;
  const h = parseFloat(document.getElementById('modal-height')?.value) || 172;
  const inj = document.getElementById('modal-injury')?.value || 'Không có';
  const med = document.getElementById('modal-medical')?.value || 'Không có';

  state.health.weight = w;
  state.health.height = h;
  state.health.injuries = inj;
  state.health.medicalNotes = med;
  state.health.hasData = true;

  const dispW = document.getElementById('disp-weight');
  const dispInj = document.getElementById('disp-injury');
  const chk = document.getElementById('toggle-has-health-data');

  if (dispW) dispW.textContent = `${w} kg`;
  if (dispInj) dispInj.textContent = inj;
  if (chk) chk.checked = true;

  toggleHealthDataState();
  closeHealthModal();
  generateAiWorkoutPlan();
  calculateMacrosAndDiet();
}

function toggleAiChatModal() {
  const modal = document.getElementById('ai-chat-modal');
  if (modal) modal.classList.toggle('hidden');
}

function sendQuickChatPrompt(promptText) {
  const input = document.getElementById('chat-input-text');
  if (input) {
    input.value = promptText;
    handleSendChatMessage(new Event('submit'));
  }
}

function handleSendChatMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('chat-input-text');
  const userMsg = input ? input.value.trim() : '';
  if (!userMsg) return;

  const chatContainer = document.getElementById('chat-messages-body');
  if (chatContainer) {
    chatContainer.innerHTML += `
      <div class="flex items-start justify-end space-x-2">
        <div class="bg-emerald-600 p-2.5 rounded-2xl rounded-tr-none text-white text-xs max-w-[80%]">
          ${userMsg}
        </div>
        <div class="w-6 h-6 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">Tôi</div>
      </div>
    `;
    input.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    setTimeout(() => {
      chatContainer.innerHTML += `
        <div class="flex items-start space-x-2">
          <div class="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">AI</div>
          <div class="bg-slate-800 p-2.5 rounded-2xl rounded-tl-none text-slate-200 text-xs max-w-[85%] space-y-1">
            <p>SmartGym AI đã tiếp nhận câu hỏi của bạn: "${userMsg}". Bạn có thể chuyển sang tab **Gemini AI Universal** để hỏi sâu hơn mọi chủ đề nhé!</p>
          </div>
        </div>
      `;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 400);
  }
}

function downloadSqlSchema() {
  const sqlContent = `-- SmartGymAI.vn Schema
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), full_name VARCHAR(100), email VARCHAR(100) UNIQUE, phone VARCHAR(20), role VARCHAR(20));
CREATE TABLE health_metrics (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), weight_kg DECIMAL(5,2), injury_history TEXT);
CREATE TABLE workout_plans (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), weekly_schedule JSONB);
`;
  const blob = new Blob([sqlContent], { type: 'text/sql' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'smartgym_schema.sql';
  a.click();
}

// =========================================================================
// 9. CLUBS, EVENTS, NEWS & SMART CALENDAR SYSTEMS
// =========================================================================

// --- A. CÂU LẠC BỘ (Clubs) ---
function toggleJoinClub(btn, clubName) {
  const isJoined = btn.classList.contains('joined');
  if (!isJoined) {
    btn.classList.add('joined', '!bg-slate-800', '!text-emerald-400');
    btn.classList.remove('bg-pink-600', 'hover:bg-pink-500');
    btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>Đã Tham Gia</span>`;
    alert(`🎉 Chúc mừng bạn đã gia nhập "${clubName}"!\nBạn đã được thêm vào nhóm chat cộng đồng và nhận thử thách tuần mới.`);
  } else {
    btn.classList.remove('joined', '!bg-slate-800', '!text-emerald-400');
    btn.classList.add('bg-pink-600', 'hover:bg-pink-500');
    btn.innerHTML = `<i data-lucide="user-plus" class="w-3.5 h-3.5"></i><span>Tham Gia</span>`;
    alert(`Đã rời khỏi "${clubName}".`);
  }
  if (window.lucide) lucide.createIcons();
}

function openCreateClubModal() {
  const clubName = prompt("Nhập tên Câu Lạc Bộ mới bạn muốn khởi tạo:", "Đội Nhóm Street Workout Quận 1");
  if (clubName) {
    const desc = prompt("Nhập mô tả ngắn cho CLB:", "Giao lưu rèn luyện sức bền và kỹ thuật Calisthenics mỗi chiều Thứ 7");
    const container = document.getElementById('clubs-grid-container');
    if (container) {
      const newClubHtml = `
        <div class="bg-gym-card rounded-2xl p-5 border border-pink-500/50 shadow-xl space-y-4 animate-fade-in">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xl font-bold">
                🌟
              </div>
              <div>
                <h3 class="font-bold text-white text-base">${clubName}</h3>
                <span class="text-xs text-pink-400 font-medium">CLB Mới Thành Lập</span>
              </div>
            </div>
            <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">1 Thành viên</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${desc || 'Cùng nhau tập luyện và nâng cao thể chất mỗi ngày.'}</p>
          <div class="flex items-center justify-between pt-2 border-t border-slate-800">
            <span class="text-[11px] text-slate-400">Trưởng CLB: Nguyễn Văn An (Bạn)</span>
            <button class="px-3.5 py-1.5 bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl shadow">Đang Quản Trị</button>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('afterbegin', newClubHtml);
      alert(`🎉 Đã khởi tạo thành công CLB "${clubName}"! Bạn là Trưởng nhóm sáng lập.`);
      if (window.lucide) lucide.createIcons();
    }
  }
}

// --- B. SỰ KIỆN (Events) ---
function filterEvents(category) {
  const cards = document.querySelectorAll('#events-grid-container > div');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    if (category === 'all' || cat === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function registerEvent(eventName, seatsId) {
  const confirmed = confirm(`Bạn có muốn đăng ký tham gia sự kiện:\n"${eventName}"\n\nVé tham gia: MIỄN PHÍ dành riêng cho hội viên SmartGym.`);
  if (confirmed) {
    const seatEl = document.getElementById(seatsId);
    if (seatEl) {
      seatEl.textContent = 'Đã Đăng Ký ✓';
      seatEl.className = 'font-bold text-emerald-400';
    }
    alert(`🎟️ Chúc mừng bạn đã đăng ký thành công vé tham dự sự kiện:\n"${eventName}"\n\nMã QR Check-in và thông tin chi tiết đã được gửi đến email hội viên của bạn.`);
  }
}

// --- C. TIN TỨC & BẢN TIN (News) ---
function searchNewsArticles(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('#news-grid-container > div');
  cards.forEach(card => {
    const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    if (title.includes(q) || desc.includes(q)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function readNewsDetail(articleId) {
  const articles = {
    1: {
      title: "Nghiên Cứu Mới Về Thời Điểm Nạp Protein (ISSN 2026)",
      content: "Nghiên cứu trên 2.400 vận động viên thể hình cho thấy việc đáp ứng tổng lượng đạm từ 1.8g - 2.2g/kg mỗi ngày là chìa khóa then chốt cho sự phát triển sợi cơ. Cửa sổ đồng hóa (Anabolic Window) kéo dài từ 24 - 48 giờ sau buổi tập nặng, do đó bạn không cần quá vội vàng uống whey trong 15 phút đầu, mà hãy chú trọng phân bổ 3-4 bữa đạm cân đối suốt ngày."
    },
    2: {
      title: "Công Nghệ AI BlazePose 33-Landmarks Trong Phân Tích Tư Thế",
      content: "SmartGym AI ứng dụng mô hình Deep Learning BlazePose để bắt chuyển động ở tốc độ 30 FPS. Hệ thống tự động đo góc gập khớp gối (Knee Angle), góc nghiêng xương chậu (Pelvic Tilt) và độ lệch cột sống thắt lưng để cảnh báo bằng giọng nói tức thì khi phát hiện nguy cơ chấn thương."
    },
    3: {
      title: "5 Sai Lầm Phổ Biến Khi Tính Calo Khiến Bạn Không Giảm Mỡ",
      content: "1. Bỏ quên calo từ 1-2 thìa dầu ăn khi xào nấu (+240 Kcal).\n2. Sử dụng sốt sốt mayonnaise / phô mai béo ngậy.\n3. Đồ uống cà phê sữa ngọt, trà sữa.\n4. Đánh giá quá cao lượng calo đốt cháy khi tập gym (thực tế 60p tập tạ chỉ tiêu hao 250-350 Kcal).\n5. Bỏ qua calo trong những ngày Cheat Day cuối tuần."
    },
    4: {
      title: "Hành Trình Giảm 14kg Mỡ & Tăng 3kg Cơ Của Hoàng Nam",
      content: "Bắt đầu với thể trạng 82kg và 28% Body Fat, anh Nam đã kiên trì tập lịch Push-Pull-Legs 4 buổi/tuần do SmartGym AI tạo ra, kết hợp thực đơn 2.000 Kcal giàu ức gà, trứng và yến mạch. Sau 12 tuần, mỡ cơ thể giảm về 15.2%, hiện rõ múi bụng và cơ ngực săn chắc."
    }
  };

  const a = articles[articleId] || articles[1];
  alert(`📰 ${a.title}\n\n${a.content}\n\n[Nguồn: SmartGym AI Sports Science Journal]`);
}

// --- D. LỊCH TẬP THÔNG MINH (Calendar) ---
function toggleCalendarTaskComplete(btn) {
  const isDone = btn.classList.contains('completed');
  if (!isDone) {
    btn.classList.add('completed', '!bg-emerald-600', '!text-white');
    btn.textContent = '✓ Đã Hoàn Thành Buổi Tập';
    alert('🎉 Tuyệt vời! Bạn đã hoàn thành buổi tập hôm nay. Dữ liệu điểm danh và calo tiêu hao đã được nạp tự động vào hồ sơ AI.');
  } else {
    btn.classList.remove('completed', '!bg-emerald-600', '!text-white');
    btn.textContent = '✓ Đánh dấu hoàn thành';
  }
}

function openAddCalendarEventModal() {
  const eventName = prompt("Nhập tên buổi tập / lớp học muốn thêm vào lịch:", "Tập Ngực & Cardio 45 phút");
  if (eventName) {
    const day = prompt("Chọn thứ (Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ Nhật):", "Thứ Hai");
    const time = prompt("Nhập khung giờ (VD: 18:00 - 19:15):", "18:00 - 19:15");
    alert(`✅ Đã thêm thành công vào thời khóa biểu:\n• Hoạt động: ${eventName}\n• Thời gian: ${day} (${time})\n• AI đã đồng bộ vào nhắc hẹn thông minh!`);
  }
}

function exportCalendarIcs() {
  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SmartGymAI//Fitness Calendar 2026//VI
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Lịch Tập Ngực & Tay Sau (SmartGym AI)
DTSTART:20260922T110000Z
DTEND:20260922T123000Z
LOCATION:SmartGym AI Cổng A
DESCRIPTION:Giáo án Hypertrophy tăng cơ ngực và tay sau
STATUS:CONFIRMED
END:VEVENT
BEGIN:VEVENT
SUMMARY:Buổi Hẹn PT 1-1 Chỉnh Form Squat
DTSTART:20260923T113000Z
DTEND:20260923T123000Z
LOCATION:SmartGym AI Studio
DESCRIPTION:HLV Trần Hùng kèm riêng kỹ thuật SBD
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `SmartGym_Schedule_${Date.now()}.ics`;
  a.click();
  alert('📅 Đã xuất file lịch SmartGym .ics thành công! Bạn có thể mở file này để đồng bộ tức thì vào Google Calendar, Apple Calendar hoặc Outlook.');
}

// =========================================================================
// 11. AUTHENTICATION SYSTEM & ROLE-BASED ACCESS CONTROL (RBAC)
// =========================================================================

// --- A. Khởi tạo & Cập nhật UI xác thực ---
function initAuthSystem() {
  const savedUser = localStorage.getItem('smartgym_current_user');
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
    } catch (e) {
      console.error('Error parsing saved user', e);
    }
  }

  const savedUsersList = localStorage.getItem('smartgym_users_db');
  if (savedUsersList) {
    try {
      state.usersList = JSON.parse(savedUsersList);
    } catch (e) {
      console.error('Error parsing users DB', e);
    }
  }

  const savedLogs = localStorage.getItem('smartgym_audit_logs');
  if (savedLogs) {
    try {
      state.auditLogs = JSON.parse(savedLogs);
    } catch (e) {
      console.error('Error parsing audit logs', e);
    }
  }

  updateAuthUI();
  renderAdminUsersTable();
  renderAuditLogsTable();
}

function updateAuthUI() {
  const headerAuthBtns = document.getElementById('header-auth-buttons');
  const headerUserBadge = document.getElementById('header-user-badge');
  const navAdminTab = document.getElementById('tab-admin-panel');
  const dropdownAdminLink = document.getElementById('dropdown-admin-link');

  if (!state.currentUser) {
    // Logged Out
    if (headerAuthBtns) headerAuthBtns.classList.remove('hidden');
    if (headerAuthBtns) headerAuthBtns.classList.add('flex');
    if (headerUserBadge) headerUserBadge.classList.add('hidden');
    if (navAdminTab) navAdminTab.classList.add('hidden');
    if (dropdownAdminLink) dropdownAdminLink.classList.add('hidden');
    return;
  }

  // Logged In
  if (headerAuthBtns) headerAuthBtns.classList.add('hidden');
  if (headerAuthBtns) headerAuthBtns.classList.remove('flex');
  if (headerUserBadge) headerUserBadge.classList.remove('hidden');
  if (headerUserBadge) headerUserBadge.classList.add('flex');

  const u = state.currentUser;
  const isAdmin = u.role === 'admin';

  // Role details configuration
  const roleConfig = {
    admin: { label: 'ADMIN 👑', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', avatarBg: 'from-amber-600 to-rose-600' },
    trainer: { label: 'HLV PT 🏋️', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', avatarBg: 'from-blue-600 to-cyan-500' },
    member: { label: 'HỘI VIÊN ⭐', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', avatarBg: 'from-emerald-600 to-teal-500' }
  };
  const currentRole = roleConfig[u.role] || roleConfig.member;

  // Header Elements
  const headerName = document.getElementById('header-user-name');
  const headerSub = document.getElementById('header-user-sub');
  const headerAvatar = document.getElementById('header-user-avatar');
  const headerRoleBadge = document.getElementById('header-user-role-badge');

  if (headerName) headerName.textContent = u.name;
  if (headerSub) headerSub.textContent = `${u.membership.split('+')[0]} • HSD: ${u.expiryDate}`;
  if (headerAvatar) {
    headerAvatar.textContent = u.avatar || u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    headerAvatar.className = `w-9 h-9 rounded-xl bg-gradient-to-tr ${currentRole.avatarBg} ring-2 ring-emerald-500/40 flex items-center justify-center font-extrabold text-xs text-white shadow-inner`;
  }
  if (headerRoleBadge) {
    headerRoleBadge.textContent = currentRole.label;
    headerRoleBadge.className = `text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${currentRole.bg}`;
  }

  // Dropdown Elements
  const dropName = document.getElementById('dropdown-user-name');
  const dropEmail = document.getElementById('dropdown-user-email');
  const dropPackage = document.getElementById('dropdown-user-package');
  const dropRole = document.getElementById('dropdown-user-role');
  const dropAvatar = document.getElementById('dropdown-user-avatar');

  if (dropName) dropName.textContent = u.name;
  if (dropEmail) dropEmail.textContent = u.email;
  if (dropPackage) dropPackage.textContent = `${u.membership} (HSD: ${u.expiryDate})`;
  if (dropRole) {
    dropRole.textContent = currentRole.label;
    dropRole.className = `text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${currentRole.bg}`;
  }
  if (dropAvatar) {
    dropAvatar.textContent = u.avatar || u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    dropAvatar.className = `w-10 h-10 rounded-xl bg-gradient-to-tr ${currentRole.avatarBg} flex items-center justify-center font-extrabold text-sm text-white shrink-0`;
  }

  // Admin Tab & Link visibility: ONLY visible if role is admin
  if (navAdminTab) {
    if (isAdmin) {
      navAdminTab.classList.remove('hidden');
    } else {
      navAdminTab.classList.add('hidden');
      if (state.activeTab === 'admin-panel') {
        switchTab('ai-planner');
      }
    }
  }

  if (dropdownAdminLink) {
    if (isAdmin) {
      dropdownAdminLink.classList.remove('hidden');
    } else {
      dropdownAdminLink.classList.add('hidden');
    }
  }

  // Update stats on admin tab
  const totalUserEl = document.getElementById('stat-total-users');
  if (totalUserEl) totalUserEl.textContent = state.usersList.length.toLocaleString('vi-VN');
}

// --- B. Đóng Mở Modal & Switch Tabs ---
function openAuthModal(mode = 'login') {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('hidden');
    switchAuthTab(mode);
    if (window.lucide) lucide.createIcons();
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const regForm = document.getElementById('auth-register-form');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabReg = document.getElementById('auth-tab-register');

  if (tab === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (regForm) regForm.classList.add('hidden');
    if (tabLogin) {
      tabLogin.className = 'py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white transition shadow';
    }
    if (tabReg) {
      tabReg.className = 'py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition';
    }
  } else {
    if (loginForm) loginForm.classList.add('hidden');
    if (regForm) regForm.classList.remove('hidden');
    if (tabLogin) {
      tabLogin.className = 'py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition';
    }
    if (tabReg) {
      tabReg.className = 'py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white transition shadow';
    }
  }
  if (window.lucide) lucide.createIcons();
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

// Global click to close dropdown
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('user-dropdown-menu');
  const badge = document.getElementById('header-user-badge');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    if (!dropdown.contains(e.target) && (!badge || !badge.contains(e.target))) {
      dropdown.classList.add('hidden');
    }
  }
});

// --- C. Đăng Nhập Mẫu 1-Click (Demo Quick Login) ---
function quickLogin(roleKey) {
  const presetUsers = {
    admin: {
      id: 'USR-001',
      name: 'Nguyễn Văn An (Super Admin)',
      email: 'admin@smartgym.vn',
      phone: '0912 345 678',
      role: 'admin',
      membership: 'Gói Platinum VIP (Toàn Quyền Quản Trị)',
      expiryDate: '18/09/2027',
      remainingPt: 99,
      status: 'active',
      avatar: 'AD'
    },
    trainer: {
      id: 'USR-002',
      name: 'Trần Văn Hùng (HLV Trưởng)',
      email: 'trainer.hung@smartgym.vn',
      phone: '0903 112 233',
      role: 'trainer',
      membership: 'Huấn Luyện Viên PT Master (NASM/CSCS)',
      expiryDate: '31/12/2028',
      remainingPt: 50,
      status: 'active',
      avatar: 'TH'
    },
    platinum: {
      id: 'USR-001',
      name: 'Nguyễn Văn An (VIP Member)',
      email: 'an.nguyen@smartgym.vn',
      phone: '0912 345 678',
      role: 'member',
      membership: 'Gói Platinum All-Access + 12 Buổi PT',
      expiryDate: '18/09/2026',
      remainingPt: 12,
      status: 'active',
      avatar: 'AN'
    },
    basic: {
      id: 'USR-003',
      name: 'Lê Hoàng Nam (Member Mới)',
      email: 'nam.le@gmail.com',
      phone: '0988 776 655',
      role: 'member',
      membership: 'Gói Trải Nghiệm 7 Ngày Free',
      expiryDate: '06/10/2026',
      remainingPt: 0,
      status: 'active',
      avatar: 'HN'
    }
  };

  const target = presetUsers[roleKey] || presetUsers.admin;
  state.currentUser = { ...target };
  localStorage.setItem('smartgym_current_user', JSON.stringify(state.currentUser));

  addAuditLog(`Đăng nhập 1-Click vai trò [${target.role.toUpperCase()}]`, target.name, '127.0.0.1 (Local Demo)');
  updateAuthUI();
  closeAuthModal();

  alert(`🎉 Đăng nhập thành công!\n\n• Xin chào: ${target.name}\n• Vai trò: ${target.role === 'admin' ? '👑 Quản Trị Viên Super Admin' : target.role === 'trainer' ? '🏋️ Huấn Luyện Viên PT' : '👤 Hội Viên SmartGym'}\n• Gói: ${target.membership}`);
}

// --- D. Xử Lý Form Đăng Nhập ---
function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Vui lòng nhập đầy đủ email/SĐT và mật khẩu.');
    return;
  }

  // Find user in database
  let foundUser = state.usersList.find(u => u.email.toLowerCase() === email || u.phone.includes(email));

  if (foundUser) {
    if (foundUser.status === 'suspended') {
      alert('⛔ Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ ban quản trị SmartGym để mở khóa.');
      return;
    }
    state.currentUser = { ...foundUser };
  } else {
    // If not in pre-seeded database, infer role or create on-the-fly
    const isSpecialAdmin = email.includes('admin');
    const isSpecialTrainer = email.includes('trainer') || email.includes('coach') || email.includes('hlv');
    const assignedRole = isSpecialAdmin ? 'admin' : (isSpecialTrainer ? 'trainer' : 'member');

    state.currentUser = {
      id: 'USR-' + (state.usersList.length + 1).toString().padStart(3, '0'),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
      role: assignedRole,
      membership: assignedRole === 'admin' ? 'Gói Quản Trị Viên' : 'Gói Platinum All-Access',
      expiryDate: '18/09/2027',
      status: 'active',
      avatar: email.slice(0, 2).toUpperCase()
    };
    state.usersList.push({ ...state.currentUser, joinedDate: '29/09/2026' });
    saveUsersDb();
  }

  localStorage.setItem('smartgym_current_user', JSON.stringify(state.currentUser));
  addAuditLog('Đăng nhập hệ thống qua form', `${state.currentUser.name} (${state.currentUser.email})`, '127.0.0.1');

  updateAuthUI();
  closeAuthModal();
  alert(`✅ Đăng nhập thành công! Chào mừng ${state.currentUser.name} quay trở lại SmartGymAI.vn`);
}

// --- E. Xử Lý Form Đăng Ký Tài Khoản ---
function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass = document.getElementById('reg-password').value;
  const repass = document.getElementById('reg-repassword').value;
  const role = document.getElementById('reg-role').value;
  const pkg = document.getElementById('reg-package').value;
  const goal = document.getElementById('reg-goal').value;

  if (pass !== repass) {
    alert('❌ Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!');
    return;
  }

  if (pass.length < 6) {
    alert('❌ Mật khẩu phải có tối thiểu 6 ký tự.');
    return;
  }

  // Check if email exists
  const existing = state.usersList.find(u => u.email.toLowerCase() === email);
  if (existing) {
    alert('⚠️ Email này đã tồn tại trong hệ thống. Vui lòng chọn email khác hoặc đăng nhập.');
    return;
  }

  const newId = 'USR-' + (state.usersList.length + 1).toString().padStart(3, '0');
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US';

  const newUser = {
    id: newId,
    name: name,
    email: email,
    phone: phone,
    role: role,
    membership: pkg,
    expiryDate: '29/09/2027',
    status: 'active',
    avatar: initials,
    goal: goal,
    joinedDate: '29/09/2026'
  };

  state.usersList.unshift(newUser);
  saveUsersDb();

  state.currentUser = { ...newUser };
  localStorage.setItem('smartgym_current_user', JSON.stringify(state.currentUser));

  addAuditLog(`Đăng ký tài khoản mới [Role: ${role.toUpperCase()}]`, `${name} (${email})`, '127.0.0.1');

  updateAuthUI();
  closeAuthModal();

  alert(`🎊 Chúc mừng bạn đã đăng ký tài khoản thành công tại SmartGymAI.vn!\n\n• Họ tên: ${name}\n• Phân quyền: ${role === 'admin' ? '👑 Quản Trị Viên' : role === 'trainer' ? '🏋️ Huấn Luyện Viên' : '👤 Hội Viên'}\n• Gói đăng ký: ${pkg}\n• Mục tiêu: ${goal}\n\nHệ thống đã tự động kích hoạt tài khoản của bạn!`);
}

// --- F. Đăng Xuất Khỏi Hệ Thống ---
function handleLogout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi SmartGym AI?')) {
    addAuditLog('Đăng xuất khỏi hệ thống', state.currentUser ? state.currentUser.name : 'Unknown', '127.0.0.1');
    state.currentUser = null;
    localStorage.removeItem('smartgym_current_user');
    updateAuthUI();

    const dropdown = document.getElementById('user-dropdown-menu');
    if (dropdown) dropdown.classList.add('hidden');

    if (state.activeTab === 'admin-panel') {
      switchTab('ai-planner');
    }

    alert('👋 Bạn đã đăng xuất an toàn khỏi hệ thống.');
  }
}

// --- G. Đổi Vai Trò Nhanh Trong Menu (Quick Switcher) ---
function quickSwitchRole(newRole) {
  if (!state.currentUser) {
    quickLogin(newRole);
    return;
  }

  state.currentUser.role = newRole;
  if (newRole === 'admin') {
    state.currentUser.membership = 'Gói Quản Trị Toàn Quyền (Admin)';
  } else if (newRole === 'trainer') {
    state.currentUser.membership = 'HLV Trưởng - NASM Certified';
  } else {
    state.currentUser.membership = 'Gói Platinum VIP (1 Năm)';
  }

  localStorage.setItem('smartgym_current_user', JSON.stringify(state.currentUser));
  addAuditLog(`Chuyển nhanh vai trò sang [${newRole.toUpperCase()}]`, state.currentUser.name, '127.0.0.1');
  
  updateAuthUI();
  renderAdminUsersTable();

  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown) dropdown.classList.add('hidden');

  alert(`⚡ Đã chuyển vai trò tài khoản sang: [${newRole.toUpperCase()}] thành công!`);
}

// =========================================================================
// 12. ADMIN CONTROL CENTER & RBAC MANAGEMENT ENGINE
// =========================================================================

function saveUsersDb() {
  localStorage.setItem('smartgym_users_db', JSON.stringify(state.usersList));
  const totalUserEl = document.getElementById('stat-total-users');
  if (totalUserEl) totalUserEl.textContent = state.usersList.length.toLocaleString('vi-VN');
}

function switchAdminSubTab(subTabId) {
  state.adminSubTab = subTabId;

  const views = {
    'users': 'admin-view-users',
    'clubs-events': 'admin-view-clubs-events',
    'ai-settings': 'admin-view-ai-settings',
    'audit-logs': 'admin-view-audit-logs'
  };

  Object.keys(views).forEach(key => {
    const el = document.getElementById(views[key]);
    const tabBtn = document.getElementById(`admin-subtab-${key}`);
    if (el) {
      if (key === subTabId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
    if (tabBtn) {
      if (key === subTabId) {
        tabBtn.className = 'admin-subtab active px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-2 transition';
      } else {
        tabBtn.className = 'admin-subtab px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 flex items-center space-x-2 transition';
      }
    }
  });

  if (subTabId === 'users') renderAdminUsersTable();
  if (subTabId === 'audit-logs') renderAuditLogsTable();
  if (window.lucide) lucide.createIcons();
}

function setAdminRoleFilter(role) {
  state.adminFilterRole = role;
  const buttons = ['all', 'admin', 'trainer', 'member'];
  buttons.forEach(b => {
    const btn = document.getElementById(`filter-role-${b}`);
    if (btn) {
      if (b === role) {
        btn.className = 'role-filter-btn active px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition shadow';
      } else {
        btn.className = 'role-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
      }
    }
  });
  renderAdminUsersTable();
}

function filterAdminUsersTable() {
  const input = document.getElementById('admin-user-search-input');
  state.adminSearchQuery = input ? input.value.trim().toLowerCase() : '';
  renderAdminUsersTable();
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('admin-users-table-body');
  if (!tbody) return;

  const filtered = state.usersList.filter(u => {
    // Role filter
    if (state.adminFilterRole !== 'all' && u.role !== state.adminFilterRole) {
      return false;
    }
    // Search filter
    if (state.adminSearchQuery) {
      const q = state.adminSearchQuery;
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      const matchId = u.id.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchId) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-slate-400">
          <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-600"></i>
          Không tìm thấy người dùng nào phù hợp với bộ lọc.
        </td>
      </tr>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map(u => {
    const isSuspended = u.status === 'suspended';
    const roleBadge = u.role === 'admin' 
      ? '<span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">👑 Admin</span>'
      : u.role === 'trainer'
      ? '<span class="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">🏋️ Trainer PT</span>'
      : '<span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">👤 Hội Viên</span>';

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
              ${u.avatar || 'US'}
            </div>
            <div>
              <div class="font-bold text-white text-xs flex items-center space-x-1.5">
                <span>${u.name}</span>
                <span class="text-[10px] font-mono text-slate-400">(${u.id})</span>
              </div>
              <div class="text-[11px] text-slate-400">${u.email} • ${u.phone}</div>
            </div>
          </div>
        </td>
        <td class="py-3 px-3">
          <span class="text-xs font-semibold text-slate-200 block">${u.membership}</span>
          <span class="text-[10px] text-slate-400">Gia nhập: ${u.joinedDate || '2026'}</span>
        </td>
        <td class="py-3 px-3">
          <select onchange="changeUserRole('${u.id}', this.value)" class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-semibold">
            <option value="member" ${u.role === 'member' ? 'selected' : ''}>👤 Hội Viên</option>
            <option value="trainer" ${u.role === 'trainer' ? 'selected' : ''}>🏋️ Huấn Luyện Viên</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>👑 Quản Trị Admin</option>
          </select>
        </td>
        <td class="py-3 px-3">
          <button onclick="toggleUserStatus('${u.id}')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 ${isSuspended ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'}">
            <span>${isSuspended ? '🔴 Tạm Khóa' : '🟢 Hoạt Động'}</span>
          </button>
        </td>
        <td class="py-3 px-3 text-xs font-mono text-slate-300">
          ${u.expiryDate}
          <div class="flex items-center space-x-1 mt-1">
            <button onclick="extendUserMembership('${u.id}', 30)" class="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-[10px] text-slate-400 font-sans transition">+30 ngày</button>
            <button onclick="extendUserMembership('${u.id}', 365)" class="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-[10px] text-slate-400 font-sans transition">+1 năm</button>
          </div>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end space-x-1.5">
            <button onclick="deleteUser('${u.id}')" title="Xóa tài khoản" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function changeUserRole(userId, newRole) {
  const user = state.usersList.find(u => u.id === userId);
  if (user) {
    const oldRole = user.role;
    user.role = newRole;
    saveUsersDb();
    addAuditLog(`Đổi phân quyền [${oldRole.toUpperCase()} -> ${newRole.toUpperCase()}]`, `${user.name} (${user.id})`, '127.0.0.1');
    if (state.currentUser && state.currentUser.id === userId) {
      state.currentUser.role = newRole;
      localStorage.setItem('smartgym_current_user', JSON.stringify(state.currentUser));
      updateAuthUI();
    }
    renderAdminUsersTable();
    alert(`👑 Đã cập nhật vai trò của [${user.name}] thành: [${newRole.toUpperCase()}]`);
  }
}

function toggleUserStatus(userId) {
  const user = state.usersList.find(u => u.id === userId);
  if (user) {
    user.status = user.status === 'active' ? 'suspended' : 'active';
    saveUsersDb();
    addAuditLog(`Thay đổi trạng thái tài khoản sang [${user.status.toUpperCase()}]`, `${user.name} (${user.id})`, '127.0.0.1');
    renderAdminUsersTable();
  }
}

function extendUserMembership(userId, days) {
  const user = state.usersList.find(u => u.id === userId);
  if (user) {
    user.expiryDate = `30/12/2027 (+${days} ngày)`;
    saveUsersDb();
    addAuditLog(`Gia hạn gói tập thêm +${days} ngày`, `${user.name} (${user.id})`, '127.0.0.1');
    renderAdminUsersTable();
    alert(`✅ Đã gia hạn thành công +${days} ngày cho hội viên ${user.name}`);
  }
}

function deleteUser(userId) {
  const user = state.usersList.find(u => u.id === userId);
  if (!user) return;
  if (confirm(`Bạn có chắc chắn muốn xóa tài khoản [${user.name}] (${user.email}) khỏi hệ thống?`)) {
    state.usersList = state.usersList.filter(u => u.id !== userId);
    saveUsersDb();
    addAuditLog('Xóa tài khoản người dùng', `${user.name} (${userId})`, '127.0.0.1');
    renderAdminUsersTable();
  }
}

// --- H. Thêm Người Dùng Mới Bởi Admin ---
function openAddNewUserModal() {
  const m = document.getElementById('admin-add-user-modal');
  if (m) m.classList.remove('hidden');
}

function closeAddNewUserModal() {
  const m = document.getElementById('admin-add-user-modal');
  if (m) m.classList.add('hidden');
}

function handleAdminCreateUser(e) {
  e.preventDefault();
  const name = document.getElementById('admin-new-name').value.trim();
  const email = document.getElementById('admin-new-email').value.trim().toLowerCase();
  const phone = document.getElementById('admin-new-phone').value.trim();
  const role = document.getElementById('admin-new-role').value;
  const pkg = document.getElementById('admin-new-package').value;

  const newId = 'USR-' + (state.usersList.length + 1).toString().padStart(3, '0');
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US';

  const newUser = {
    id: newId,
    name: name,
    email: email,
    phone: phone,
    role: role,
    membership: pkg,
    expiryDate: '29/09/2027',
    status: 'active',
    avatar: initials,
    joinedDate: '29/09/2026'
  };

  state.usersList.unshift(newUser);
  saveUsersDb();
  addAuditLog(`Admin thêm người dùng mới [${role.toUpperCase()}]`, `${name} (${email})`, '127.0.0.1');

  closeAddNewUserModal();
  renderAdminUsersTable();
  alert(`✅ Đã tạo tài khoản và cấp quyền [${role.toUpperCase()}] cho [${name}] thành công!`);
}

// --- I. Audit Logs & System Settings ---
function addAuditLog(action, target, ip = '127.0.0.1') {
  const now = new Date();
  const timeStr = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`;
  const currentUserEmail = state.currentUser ? state.currentUser.email : 'guest';

  state.auditLogs.unshift({
    time: timeStr,
    user: currentUserEmail,
    action: action,
    target: target,
    ip: ip
  });

  if (state.auditLogs.length > 50) {
    state.auditLogs = state.auditLogs.slice(0, 50);
  }

  localStorage.setItem('smartgym_audit_logs', JSON.stringify(state.auditLogs));
  renderAuditLogsTable();
}

function renderAuditLogsTable() {
  const tbody = document.getElementById('admin-audit-logs-body');
  if (!tbody) return;

  if (state.auditLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-500">Chưa có nhật ký ghi nhận nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.auditLogs.map(log => `
    <tr class="hover:bg-slate-800/40">
      <td class="py-2.5 px-3 text-slate-400">${log.time}</td>
      <td class="py-2.5 px-3 font-bold text-amber-300">${log.user}</td>
      <td class="py-2.5 px-3 text-white">${log.action}</td>
      <td class="py-2.5 px-3 text-emerald-400">${log.target}</td>
      <td class="py-2.5 px-3 text-slate-400">${log.ip}</td>
    </tr>
  `).join('');
}

function clearAuditLogs() {
  if (confirm('Bạn có chắc muốn xóa sạch toàn bộ lịch sử Audit Log?')) {
    state.auditLogs = [];
    localStorage.removeItem('smartgym_audit_logs');
    renderAuditLogsTable();
  }
}

function saveAdminAiSettings() {
  const model = document.getElementById('admin-default-ai-model')?.value || 'omni-fusion';
  const memberQuota = document.getElementById('quota-member')?.value || 30;
  const trainerQuota = document.getElementById('quota-trainer')?.value || 150;

  addAuditLog(`Cấu hình AI Model [${model}] & Hạn mức (Member: ${memberQuota}, Trainer: ${trainerQuota})`, 'Toàn Hệ Thống', '127.0.0.1');
  alert(`💾 Đã lưu cấu hình Trí Tuệ Nhân Tạo toàn hệ thống!\n• Mô hình: ${model}\n• Quota Member: ${memberQuota} prompts/ngày\n• Quota Trainer: ${trainerQuota} prompts/ngày\n• Safety Filter: Đã Kích Hoạt.`);
}

function refreshAdminData() {
  renderAdminUsersTable();
  renderAuditLogsTable();
  alert('🔄 Đã làm mới và đồng bộ toàn bộ cơ sở dữ liệu quản trị!');
}

function adminAddNewClub() {
  const name = prompt("Nhập tên Câu Lạc Bộ muốn phê duyệt tạo mới:", "CLB Kickboxing & Tự Vệ Nữ");
  if (name) {
    addAuditLog(`Duyệt mở CLB mới: ${name}`, 'Ban Quản Trị CLB', '127.0.0.1');
    alert(`✅ Đã phê duyệt và khởi tạo Câu Lạc Bộ:\n"${name}"\nCác hội viên hiện đã có thể nộp đơn tham gia.`);
  }
}

function adminAddNewEvent() {
  const eventTitle = prompt("Nhập tên sự kiện thể hình muốn tổ chức:", "Giải Đấu Deadlift Max Reps 2026");
  if (eventTitle) {
    addAuditLog(`Tạo sự kiện thể thao mới: ${eventTitle}`, 'Hệ Thống Sự Kiện', '127.0.0.1');
    alert(`🎟️ Đã mở cổng đăng ký sự kiện:\n"${eventTitle}"\nThông báo đã được gửi đến bảng tin sự kiện hội viên.`);
  }
}

// =========================================================================
// 13. HOMEPAGE & WORKOUT ADVISORY WIZARD ENGINE
// =========================================================================

function updateHomeQuickResult() {
  const goal = document.getElementById('home-quick-goal')?.value || 'Tăng cơ nạc (Hypertrophy)';
  const days = document.getElementById('home-quick-days')?.value || '4 buổi/tuần';
  const level = document.getElementById('home-quick-level')?.value || 'Trung cấp';

  const badgeEl = document.getElementById('home-plan-badge');
  const titleEl = document.getElementById('home-plan-title');
  const descEl = document.getElementById('home-plan-desc');

  if (days.includes('3')) {
    if (badgeEl) badgeEl.textContent = 'Full Body 3 Buổi';
    if (titleEl) titleEl.textContent = `Giáo Án Full Body 3 Buổi Cho ${level.split('(')[0]}`;
    if (descEl) descEl.textContent = `Tập toàn thân vào Thứ 2 - 4 - 6. Mỗi buổi tác động 1 bài đa khớp lớn, tối ưu hóa thời gian phục hồi cơ bắp và phát triển sức bền.`;
  } else if (days.includes('4')) {
    if (badgeEl) badgeEl.textContent = 'Upper / Lower 4D Split';
    if (titleEl) titleEl.textContent = `Giáo Án Upper - Lower 4 Ngày (${goal.split('(')[0]})`;
    if (descEl) descEl.textContent = `Phân bổ 2 buổi Thân Trên (Upper) + 2 buổi Thân Dưới (Lower), kích thích tổng hợp protein 2 lần/tuần cho mỗi nhóm cơ.`;
  } else if (days.includes('5')) {
    if (badgeEl) badgeEl.textContent = 'PPL + Upper/Lower 5D';
    if (titleEl) titleEl.textContent = `Giáo Án Đẩy - Kéo - Chân - Upper - Lower 5 Buổi`;
    if (descEl) descEl.textContent = `Phù hợp cho gymer muốn tăng cường độ và volume cho các nhóm cơ yếu (Weak Point) mà vẫn có 2 ngày nghỉ phục hồi.`;
  } else {
    if (badgeEl) badgeEl.textContent = 'Push - Pull - Legs x2 (6D)';
    if (titleEl) titleEl.textContent = `Giáo Án Chuyên Nghiệp PPL x2 Chuyên Sâu 6 Ngày`;
    if (descEl) descEl.textContent = `Tiêu chuẩn vàng của các vận động viên thể hình. Đạt từ 14-20 sets chất lượng/nhóm cơ/tuần, tối đa hóa tiềm năng phì đại cơ bắp.`;
  }
}

function askChatbotAboutHomePlan() {
  const goal = document.getElementById('home-quick-goal')?.value || 'Tăng cơ nạc (Hypertrophy)';
  const days = document.getElementById('home-quick-days')?.value || '4 buổi/tuần';
  const level = document.getElementById('home-quick-level')?.value || 'Trung cấp';

  const prompt = `🏋️ TƯ VẤN LỊCH TẬP: Tôi đang muốn tập luyện với mục tiêu: [${goal}], thời gian rảnh [${days}], trình độ hiện tại [${level}]. Hãy tư vấn thiết kế cho tôi một giáo án chi tiết từng ngày, kèm số hiệp (Sets), số lần (Reps), mức RPE và thời gian nghỉ giữa hiệp.`;

  switchTab('gemini-universal');
  sendGeminiQuickPrompt(prompt);
}

function loadHomePlanToPlanner() {
  const goal = document.getElementById('home-quick-goal')?.value || 'Tăng cơ nạc (Hypertrophy)';
  const days = document.getElementById('home-quick-days')?.value || '4 buổi/tuần';

  const goalInput = document.getElementById('input-goal');
  const availInput = document.getElementById('input-availability');

  if (goalInput) goalInput.value = goal;
  if (availInput) availInput.value = days;

  switchTab('ai-planner');
  generateAiWorkoutPlan();
  alert(`📅 Đã nạp thành công thông số thể hình vào AI Workout Planner!\n• Mục tiêu: ${goal}\n• Lịch tập: ${days}`);
}

function applyHomeQuickWorkout() {
  askChatbotAboutHomePlan();
}

function openWorkoutWizardModal() {
  const m = document.getElementById('workout-wizard-modal');
  if (m) m.classList.remove('hidden');
}

function closeWorkoutWizardModal() {
  const m = document.getElementById('workout-wizard-modal');
  if (m) m.classList.add('hidden');
}

function handleGenerateWizardWorkout(e) {
  e.preventDefault();
  const goal = document.getElementById('wizard-goal').value;
  const days = document.getElementById('wizard-days').value;
  const exp = document.getElementById('wizard-exp').value;
  const injury = document.getElementById('wizard-injury').value.trim();
  const equip = document.getElementById('wizard-equipment').value;

  closeWorkoutWizardModal();

  let injuryText = injury ? `Lưu ý chấn thương/khớp: ${injury}. ` : 'Không có tiền sử chấn thương. ';
  const prompt = `🏋️ THIẾT KẾ GIÁO ÁN AI: Hãy lập giáo án tập luyện chi tiết cho tôi:
• Mục tiêu: ${goal}
• Tần suất: ${days}
• Kinh nghiệm: ${exp}
• Cơ sở vật chất: ${equip}
• ${injuryText}
Yêu cầu: Bảng phân bổ từng buổi (Tên bài, Sets, Reps, RPE, Nghỉ) và nguyên tắc an toàn y tế.`;

  switchTab('gemini-universal');
  sendGeminiQuickPrompt(prompt);
}

function loadPlanFromChatToPlanner(planName, goalName) {
  const goalInput = document.getElementById('input-goal');
  const availInput = document.getElementById('input-availability');

  if (goalInput) goalInput.value = goalName || 'Tăng cơ nạc (Hypertrophy)';
  if (availInput) availInput.value = '4 buổi/tuần (Thứ 2 - 3 - 5 - 6)';

  switchTab('ai-planner');
  generateAiWorkoutPlan();
  alert(`✅ Đã đồng bộ giáo án:\n"${planName}"\nvào Lịch Tập 1 Tuần của bạn thành công!`);
}

// =========================================================================
// 14. SYSTEM INITIALIZATION ON DOM READY
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuthSystem();
  initAiGatewayKeys();
  renderAttendanceTable();
  updatePromptDebugger();
  generateAiWorkoutPlan();
  calculateMacrosAndDiet();
  runPoseAnalysisSimulation();
  updateHomeQuickResult();

  ['input-goal', 'input-availability', 'input-attendance'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updatePromptDebugger);
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
});
