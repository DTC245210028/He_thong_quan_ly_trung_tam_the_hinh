# PowerShell script to generate a rich Word Document (.doc / HTML-MSO Format) in Times New Roman, font size 13pt
$outputFile = "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\Bao_Cao_Cac_Buoc_AI_Da_Lam.doc"

$docContent = @"
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Báo Cáo Các Bước Thực Hiện - SmartGym AI Assistant</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page {
    size: A4 portrait;
    margin: 20mm 20mm 20mm 20mm;
    mso-header-margin: 10mm;
    mso-footer-margin: 10mm;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.45;
    color: #111827;
    background-color: #ffffff;
  }
  .title-cover {
    text-align: center;
    padding: 25px 10px;
    border-bottom: 2.5pt double #047857;
    margin-bottom: 22px;
  }
  h1 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 19pt;
    font-weight: bold;
    color: #065f46;
    margin-bottom: 8px;
    text-transform: uppercase;
    line-height: 1.3;
  }
  .subtitle {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13.5pt;
    color: #374151;
    font-style: italic;
    margin-bottom: 12px;
  }
  .meta-box {
    display: inline-block;
    background-color: #f0fdf4;
    border: 1pt solid #86efac;
    border-radius: 4px;
    padding: 6px 16px;
    font-size: 12pt;
    color: #166534;
  }
  h2 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 15pt;
    font-weight: bold;
    color: #0f172a;
    border-bottom: 1.5pt solid #059669;
    padding-bottom: 4px;
    margin-top: 22px;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  h3 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13.5pt;
    font-weight: bold;
    color: #047857;
    margin-top: 16px;
    margin-bottom: 6px;
  }
  p {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: justify;
    font-size: 13pt;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 12px;
    padding-left: 28px;
    font-size: 13pt;
  }
  li {
    margin-bottom: 6px;
    text-align: justify;
  }
  .alert-box {
    background-color: #fef2f2;
    border-left: 4.5pt solid #dc2626;
    padding: 12px 16px;
    margin: 14px 0;
    border-radius: 0 4px 4px 0;
    font-size: 12.5pt;
    color: #991b1b;
    text-align: justify;
  }
  .alert-box strong {
    color: #7f1d1d;
  }
  .tip-box {
    background-color: #ecfdf5;
    border-left: 4.5pt solid #059669;
    padding: 12px 16px;
    margin: 14px 0;
    border-radius: 0 4px 4px 0;
    font-size: 12.5pt;
    color: #065f46;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 12pt;
    font-family: 'Times New Roman', Times, serif;
  }
  th {
    background-color: #065f46;
    color: #ffffff;
    font-weight: bold;
    padding: 9px 10px;
    border: 1pt solid #047857;
    text-align: left;
    font-size: 12pt;
  }
  td {
    padding: 8px 10px;
    border: 1pt solid #94a3b8;
    vertical-align: top;
    font-size: 12pt;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10.5pt;
    font-weight: bold;
  }
  .badge-green { background-color: #dcfce7; color: #166534; }
  .badge-blue { background-color: #e0f2fe; color: #075985; }
  .badge-purple { background-color: #f3e8ff; color: #6b21a8; }
</style>
</head>
<body>

<div class="title-cover">
  <h1>BÁO CÁO TOÀN DIỆN: CÁC BƯỚC XÂY DỰNG HỆ THỐNG SMARTGYMAI.VN</h1>
  <div class="subtitle">Trợ Lý Luyện Tập Cá Nhân Hóa &amp; Nền Tảng Quản Lý Phòng Gym (https://SmartGymAI.vn)</div>
  <div class="meta-box">
    <strong>Website:</strong> https://SmartGymAI.vn &nbsp;|&nbsp; <strong>Font:</strong> Times New Roman (13pt) &nbsp;|&nbsp; <strong>Ngày lập:</strong> 18/08/2026
  </div>
</div>

<h2>1. TỔNG QUAN YÊU CẦU &amp; NGUYÊN TẮC THIẾT KẾ</h2>
<p>Dự án được xây dựng nhằm giải quyết bài toán tự động hóa vận hành phòng tập thể hình kết hợp cá nhân hóa giáo án luyện tập bằng trí tuệ nhân tạo (AI), tuân thủ các nguyên tắc cốt lõi:</p>
<ul>
  <li><strong>Vai trò trợ lý:</strong> Đóng vai trò Trợ lý Gym thông minh, hỗ trợ định hướng và thiết kế lộ trình tập luyện khoa học.</li>
  <li><strong>Nguyên tắc y tế bắt buộc:</strong> Toàn bộ gợi ý lịch tập chỉ mang tính <em>tham khảo định hướng vận động</em>, tuyệt đối không thay thế chỉ định y tế hay phác đồ trị liệu của bác sĩ.</li>
  <li><strong>Cơ chế Safety Guardrail:</strong> Khi dữ liệu thể trạng hoặc tiền sử chấn thương bị thiếu hoặc chưa được xác thực, hệ thống phải kích hoạt cảnh báo nổi bật và hướng dẫn hội viên gặp trực tiếp Huấn luyện viên cá nhân (PT) hoặc Bác sĩ chuyên khoa trước khi nâng tạ nặng.</li>
</ul>

<div class="alert-box">
  <strong>⚠️ Tuyên Bố Miễn Trừ Trách Nhiệm Y Tế (Medical Disclaimer):</strong> Mọi chương trình tập luyện và dinh dưỡng do AI tính toán chỉ mang tính tham khảo. Người tập có tiền sử bệnh lý tim mạch, thoát vị đĩa đệm, đau khớp gối bắt buộc phải tham khảo ý kiến chuyên môn từ Huấn luyện viên (PT) hoặc Bác sĩ trước khi tập luyện cường độ cao.
</div>

<h2>2. BƯỚC 1: THIẾT KẾ PROMPT TEMPLATE &amp; ENGINE GỢI Ý LỊCH TẬP</h2>
<p>AI Engine tiếp nhận và phân tích 3 biến số đầu vào cốt lõi của hội viên:</p>
<ol>
  <li><code>{{goal}}</code>: Mục tiêu tập luyện (Tăng khối lượng cơ bắp Hypertrophy, Giảm mỡ Cardio, Cải thiện sức bền, Trị liệu giảm đau lưng...).</li>
  <li><code>{{availability}}</code>: Thời gian rảnh trong tuần của hội viên (ví dụ: Thứ 2, 4, 6 lúc 18h00 - 19h30 và Sáng Chủ Nhật).</li>
  <li><code>{{attendance_summary}}</code>: Lịch sử điểm danh và tần suất tập thực tế (ví dụ: Đã tập 8/12 buổi trong tháng, vừa nghỉ 4 ngày liên tiếp...).</li>
</ol>

<h3>Cấu Trúc Lịch Tập 1 Tuần Tham Khảo (Mục tiêu: Tăng Cơ &amp; Thể Lực)</h3>
<table>
  <thead>
    <tr>
      <th style="width: 14%;">Ngày</th>
      <th style="width: 26%;">Phân Loại &amp; Cường Độ</th>
      <th style="width: 12%;">Thời Lượng</th>
      <th style="width: 48%;">Nội Dung Bài Tập &amp; Chi Tiết Sets/Reps</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Thứ 2</strong></td>
      <td><span class="badge badge-green">Upper Body</span><br>Ngực - Vai - Tay sau (RPE 8)</td>
      <td>60 phút</td>
      <td>• Barbell Bench Press (4 hiệp x 8-10 reps, nghỉ 90s)<br>• Incline Dumbbell Press (3 hiệp x 10-12 reps, nghỉ 60s)<br>• Dumbbell Lateral Raise (4 hiệp x 12-15 reps)<br>• Triceps Rope Pushdown (3 hiệp x 12 reps)</td>
    </tr>
    <tr>
      <td><strong>Thứ 3</strong></td>
      <td><span class="badge badge-blue">Active Recovery</span><br>Nghỉ ngơi tích cực</td>
      <td>25 phút</td>
      <td>Đi bộ nhẹ nhàng 4,000 bước, giãn cơ bắp Foam Roller và uống đủ 2.5L nước.</td>
    </tr>
    <tr>
      <td><strong>Thứ 4</strong></td>
      <td><span class="badge badge-green">Lower Body</span><br>Đùi - Mông - Bụng (RPE 7-8)</td>
      <td>55 phút</td>
      <td>• Goblet Squat (3 hiệp x 10 reps, kiểm soát đầu gối)<br>• Romanian Deadlift (4 hiệp x 10-12 reps, giữ lưng thẳng)<br>• Leg Extension (3 hiệp x 12 reps)<br>• Plank &amp; Hanging Knee Raise (3 hiệp x 45s)</td>
    </tr>
    <tr>
      <td><strong>Thứ 5</strong></td>
      <td><span class="badge badge-blue">Rest Day</span><br>Nghỉ hoàn toàn</td>
      <td>0 phút</td>
      <td>Nghỉ ngơi để cơ bắp tổng hợp protein, ngủ đủ 7 - 8 tiếng.</td>
    </tr>
    <tr>
      <td><strong>Thứ 6</strong></td>
      <td><span class="badge badge-green">Pull Day</span><br>Lưng xô - Tay trước - Vai sau</td>
      <td>60 phút</td>
      <td>• Lat Pulldown (4 hiệp x 10-12 reps, ép bả vai)<br>• Seated Cable Row (3 hiệp x 10-12 reps)<br>• Face Pull (4 hiệp x 15 reps, chỉnh tư thế gù lưng)<br>• Dumbbell Bicep Curl (3 hiệp x 12 reps)</td>
    </tr>
    <tr>
      <td><strong>Thứ 7</strong></td>
      <td><span class="badge badge-purple">Sauna / Swim</span><br>Xông hơi &amp; Bơi lội</td>
      <td>30 phút</td>
      <td>Thư giãn xông hơi khô/ướt giúp đào thải acid lactic và giảm căng cứng cơ bắp.</td>
    </tr>
    <tr>
      <td><strong>Chủ Nhật</strong></td>
      <td><span class="badge badge-green">Full Body</span><br>Conditioning &amp; Cardio</td>
      <td>50 phút</td>
      <td>• DB Overhead Press (3x10)<br>• DB Lunge (3x10/chân)<br>• Push-ups (3xMax)<br>• Treadmill Incline Walk (15 phút đi bộ dốc 8% đốt mỡ)</td>
    </tr>
  </tbody>
</table>

<h2>3. BƯỚC 2: PHÂN TÍCH 3 QUY TRÌNH NGHIỆP VỤ BẰNG AI</h2>
<ol>
  <li>
    <strong>Quy trình Đăng ký gói tập (AI Membership Advisor):</strong>
    <p>AI phân tích ngân sách, thói quen sinh hoạt và mục tiêu của hội viên để đề xuất gói phù hợp nhất (Gói Gym Classic cho người tự tập, Gói Smart Pro kèm 8 buổi PT cho người mới cần chỉnh kỹ thuật, hoặc Gói VIP Elite có hồ bơi/sauna).</p>
  </li>
  <li>
    <strong>Quy trình Đặt lịch &amp; Dự báo lưu lượng phòng tập (Smart Booking &amp; Crowd Predictor):</strong>
    <p>Tích hợp thuật toán dự báo công suất theo từng khung giờ trong ngày (Heatmap lưu lượng), giúp hội viên chủ động đặt lịch tập vào các khung giờ vắng máy (như 13h00 - 16h30) và ghép nối đúng Huấn luyện viên chuyên môn (Master Trainer tăng cơ, PT giảm mỡ, PT phục hồi).</p>
  </li>
  <li>
    <strong>Quy trình Điểm danh thông minh (AI QR Attendance &amp; Overtraining Detection):</strong>
    <p>Quét mã QR/FaceID tự động đổi sau 60 giây tại cửa turnstile. Hệ thống tự động ghi nhận thời gian tập, tính toán chuỗi ngày tập (Streak) và nhận diện nguy cơ quá tải (nếu tập liên tục không nghỉ) để tự động nới lỏng lịch tuần tới.</p>
  </li>
</ol>

<h2>4. BƯỚC 3: THIẾT KẾ CƠ SỞ DỮ LIỆU QUAN HỆ (DATABASE SCHEMA)</h2>
<p>Cơ sở dữ liệu quan hệ được thiết kế chuẩn hóa phục vụ trực tiếp cho các luồng xử lý AI:</p>
<table>
  <thead>
    <tr>
      <th>Tên Bảng (Table)</th>
      <th>Khóa Chính &amp; Khóa Ngoại</th>
      <th>Các Trường Dữ Liệu Quan Trọng</th>
      <th>Mục Đích Sử Dụng Cho AI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>users</code></td>
      <td>id (PK)</td>
      <td>full_name, email, phone, role, fitness_goal, weekly_availability</td>
      <td>Lưu trữ hồ sơ, vai trò, mục tiêu và khung giờ rảnh.</td>
    </tr>
    <tr>
      <td><code>health_metrics</code></td>
      <td>id (PK), user_id (FK)</td>
      <td>weight_kg, height_cm, body_fat_pct, medical_notes, injury_history</td>
      <td>Tầng Safety Guardrail kiểm tra bệnh lý và tiền sử đau khớp.</td>
    </tr>
    <tr>
      <td><code>packages</code> &amp; <code>subscriptions</code></td>
      <td>id (PK), user_id (FK), package_id (FK)</td>
      <td>start_date, end_date, status, remaining_pt_sessions, price</td>
      <td>Quản lý hạn dùng, số buổi PT và quyền lợi hội viên.</td>
    </tr>
    <tr>
      <td><code>bookings</code></td>
      <td>id (PK), user_id (FK), trainer_id (FK)</td>
      <td>start_time, end_time, status, notes</td>
      <td>Quản lý lịch hẹn tập kèm HLV, tự động gửi nhắc lịch.</td>
    </tr>
    <tr>
      <td><code>attendances</code></td>
      <td>id (PK), user_id (FK)</td>
      <td>check_in_time, check_out_time, checkin_method, synced_to_ai</td>
      <td>Cung cấp dữ liệu cho thuật toán Overtraining &amp; Streak.</td>
    </tr>
    <tr>
      <td><code>workout_plans</code></td>
      <td>id (PK), user_id (FK)</td>
      <td>weekly_schedule (JSONB), ai_disclaimer, health_warning_flag</td>
      <td>Lưu trữ lịch tập 7 ngày do AI tạo kèm cờ cảnh báo an toàn.</td>
    </tr>
  </tbody>
</table>

<h2>5. BƯỚC 4: XÂY DỰNG &amp; MỞ RỘNG CÁC TÍNH NĂNG AI ĐỘT PHÁ</h2>
<p>Hệ thống được trang bị 5 module AI chuyên sâu:</p>
<ul>
  <li><strong>AI Nutrition &amp; Macro Meal Planner:</strong> Tự động tính TDEE, BMR theo công thức Mifflin-St Jeor và phân bổ chính xác lượng Protein/Carb/Fat theo gram; sinh thực đơn 4 bữa/ngày chuẩn món ăn Việt.</li>
  <li><strong>AI Computer Vision Form &amp; Posture Corrector:</strong> Mô phỏng phân tích khung xương 33 điểm (BlazePose), đo góc khớp gối, khớp hông, phát hiện lỗi gù lưng hoặc chúi gối quá mũi chân khi Squat/Deadlift.</li>
  <li><strong>Huấn Luyện Viên Giọng Nói AI (Voice Coach):</strong> Sử dụng Web Speech API đếm nhịp thở và nhắc sửa lỗi sai động tác bằng âm thanh tiếng Việt.</li>
  <li><strong>AI InBody Scan &amp; Goal Trajectory Forecaster:</strong> Phân tích thành phần cơ xương (SMM), mỡ nội tạng (Visceral Fat), tuổi sinh học và dự báo ngày hoàn thành mục tiêu.</li>
  <li><strong>Trợ Lý Chatbot AI Trực Tuyến 24/7:</strong> Tương tác trực tiếp giải đáp mọi thắc mắc của hội viên.</li>
</ul>

<h2>6. BƯỚC 5: PHÁT TRIỂN GIAO DIỆN WEB &amp; TRẢI NGHIỆM THỰC TẾ</h2>
<p>Ứng dụng đã được lập trình hoàn chỉnh với công nghệ Web hiện đại:</p>
<ul>
  <li><code>index.html</code>: Giao diện Single Page Application (SPA) đa tab với phong cách Dark Fitness cao cấp.</li>
  <li><code>style.css</code>: Hệ thống màu HSL, hiệu ứng Glassmorphism, thanh cuộn tùy chỉnh và hiệu ứng chuyển động mượt mà.</li>
  <li><code>app.js</code>: Toàn bộ engine AI xử lý lịch tập, tính toán dinh dưỡng, mô phỏng đồ họa SVG khớp xương, điểm danh QR và chatbot.</li>
</ul>

<div class="tip-box">
  <strong>📁 Vị trí thư mục dự án:</strong> <code>C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\</code><br>
  Người dùng chỉ cần mở trực tiếp file <code>index.html</code> trên trình duyệt web (Google Chrome, Microsoft Edge) để trải nghiệm toàn bộ ứng dụng!
</div>

</body>
</html>
"@

# Write to file
[System.IO.File]::WriteAllText($outputFile, $docContent, [System.Text.Encoding]::UTF8)
Write-Host "File Word (Times New Roman, 13pt) đã được tạo thành công tại: $outputFile"
