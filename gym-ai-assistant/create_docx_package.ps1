# Script to generate a native Office Open XML (.docx) file with Times New Roman and 13pt body font size
Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\Bao_Cao_Cac_Buoc_AI_Da_Lam.docx"
$tempDir = Join-Path $env:TEMP "docx_build_$(Get-Random)"

if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path "$tempDir\_rels" -Force | Out-Null
New-Item -ItemType Directory -Path "$tempDir\word\_rels" -Force | Out-Null

# [Content_Types].xml
$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>
'@
[System.IO.File]::WriteAllText("$tempDir\[Content_Types].xml", $contentTypes, [System.Text.Encoding]::UTF8)

# _rels/.rels
$pkgRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
'@
[System.IO.File]::WriteAllText("$tempDir\_rels\.rels", $pkgRels, [System.Text.Encoding]::UTF8)

# word/_rels/document.xml.rels
$docRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
'@
[System.IO.File]::WriteAllText("$tempDir\word\_rels\document.xml.rels", $docRels, [System.Text.Encoding]::UTF8)

# word/styles.xml - Default to Times New Roman 13pt (26 half-points)
$stylesXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="26"/>
        <w:szCs w:val="26"/>
        <w:color w:val="111827"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="300" w:lineRule="auto" w:after="160"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>
'@
[System.IO.File]::WriteAllText("$tempDir\word\styles.xml", $stylesXml, [System.Text.Encoding]::UTF8)

# word/document.xml
$documentXml = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <!-- TITLE -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="240" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:sz w:val="38"/>
          <w:szCs w:val="38"/>
          <w:color w:val="065F46"/>
        </w:rPr>
        <w:t>BÁO CÁO CÁC BƯỚC XÂY DỰNG SMARTGYMAI.VN</w:t>
      </w:r>
    </w:p>

    <!-- SUBTITLE -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="300"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:i/>
          <w:sz w:val="26"/>
          <w:szCs w:val="26"/>
          <w:color w:val="374151"/>
        </w:rPr>
        <w:t>Nền Tảng Trợ Lý Gym AI &amp; Quản Lý Phòng Tập (https://SmartGymAI.vn)</w:t>
      </w:r>
    </w:p>

    <!-- SECTION 1 -->
    <w:p>
      <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:sz w:val="30"/>
          <w:szCs w:val="30"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>1. NGUYÊN TẮC VẬN HÀNH &amp; AN TOÀN Y TẾ</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>Hệ thống SmartGym AI được thiết kế với vai trò Trợ lý Luyện tập Thông minh, tuân thủ nghiêm ngặt nguyên tắc: Mọi gợi ý chỉ mang tính chất tham khảo, không thay thế tư vấn y tế hay phác đồ trị liệu. Khi dữ liệu sức khỏe hoặc tiền sử chấn thương chưa được cập nhật đầy đủ, hệ thống tự động kích hoạt cờ cảnh báo bắt buộc và hướng dẫn hội viên gặp trực tiếp Huấn luyện viên cá nhân (PT) hoặc Bác sĩ chuyên khoa trước khi bắt đầu bài tập cường độ cao.</w:t>
      </w:r>
    </w:p>

    <!-- SECTION 2 -->
    <w:p>
      <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:sz w:val="30"/>
          <w:szCs w:val="30"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>2. BƯỚC 1: THIẾT KẾ PROMPT AI &amp; GỢI Ý LỊCH TẬP 1 TUẦN</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>AI Engine xử lý 3 biến số đầu vào: {{goal}} (Mục tiêu tập), {{availability}} (Khung giờ rảnh) và {{attendance_summary}} (Lịch sử điểm danh thực tế). Lịch tập 7 ngày được phân bổ khoa học giữa các nhóm cơ (Upper Body, Lower Body, Pull Day, Conditioning) kết hợp ngày nghỉ phục hồi tích cực (Active Recovery, Sauna/Bơi lội) nhằm tối ưu khả năng phát triển cơ bắp và tránh nguy cơ quá tải.</w:t>
      </w:r>
    </w:p>

    <!-- SECTION 3 -->
    <w:p>
      <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:sz w:val="30"/>
          <w:szCs w:val="30"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>3. BƯỚC 2: PHÂN TÍCH 3 QUY TRÌNH NGHIỆP VỤ BẰNG AI</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• Đăng ký gói tập: AI tư vấn gói tối ưu (Classic, Pro + PT, VIP Elite) theo ngân sách và mục tiêu thể hình.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• Đặt lịch tập &amp; PT: Tích hợp Heatmap dự báo mật độ phòng tập theo giờ giúp hội viên tránh giờ cao điểm và ghép HLV đúng chuyên môn.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• Điểm danh thông minh: Quét QR mã động tại cửa turnstile, tính toán chuỗi ngày tập (Streak) và nhận diện nguy cơ quá tải (Overtraining detection) để tự động điều chỉnh lịch tập.</w:t>
      </w:r>
    </w:p>

    <!-- SECTION 4 -->
    <w:p>
      <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:sz w:val="30"/>
          <w:szCs w:val="30"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>4. BƯỚC 3: THIẾT KẾ CƠ SỞ DỮ LIỆU QUAN HỆ (SCHEMA &amp; ERD)</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>Bao gồm 7 bảng dữ liệu chuẩn hóa: users (hội viên/HLV), health_metrics (chỉ số cơ thể, tiền sử bệnh lý), packages &amp; subscriptions (gói tập, hạn dùng, lượt PT), bookings (lịch đặt chỗ), attendances (lịch sử điểm danh QR) và workout_plans (lịch tập JSON sinh từ AI).</w:t>
      </w:r>
    </w:p>

    <!-- SECTION 5 -->
    <w:p>
      <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:sz w:val="30"/>
          <w:szCs w:val="30"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>5. BƯỚC 4: MỞ RỘNG CÁC TÍNH NĂNG AI ĐỘT PHÁ</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• AI Nutrition &amp; Macro: Tính TDEE, BMR và lượng Protein/Carb/Fat chuẩn xác; sinh thực đơn món ăn Việt 4 bữa/ngày.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• AI Computer Vision Form Corrector: Mô phỏng phân tích khung xương 33 điểm, góc khớp gối, khớp hông, phát hiện lỗi chúi gối hoặc gù lưng khi Squat.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• HLV Giọng Nói AI (Voice Coach): Phát âm thanh hướng dẫn nhịp thở và chỉnh tư thế trực tiếp bằng tiếng Việt.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• AI InBody Scan &amp; Goal Trajectory: Dự báo thời điểm đạt mục tiêu thể hình theo tuần (Goal ETA).</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>• Trợ Lý Chatbot AI 24/7: Trả lời trực tuyến mọi thắc mắc tập luyện và chế độ ăn.</w:t>
      </w:r>
    </w:p>

    <!-- SECTION 6 -->
    <w:p>
      <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:sz w:val="30"/>
          <w:szCs w:val="30"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>6. BƯỚC 5: PHÁT TRIỂN GIAO DIỆN WEB &amp; TRẢI NGHIỆM THỰC TẾ</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:sz w:val="26"/><w:szCs w:val="26"/>
        </w:rPr>
        <w:t>Ứng dụng hoàn chỉnh được xây dựng tại thư mục: C:\Users\Andiez\.gemini\antigravity\scratch\gym-ai-assistant\ bao gồm các file index.html, style.css, app.js. Người dùng có thể mở trực tiếp index.html bằng trình duyệt web để thao tác và kiểm tra tất cả các tính năng AI.</w:t>
      </w:r>
    </w:p>

    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/>
    </w:sectPr>
  </w:body>
</w:document>
'@
[System.IO.File]::WriteAllText("$tempDir\word\document.xml", $documentXml, [System.Text.Encoding]::UTF8)

# Zip into .docx
if (Test-Path $docxPath) { Remove-Item -Force $docxPath }
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $docxPath)
Remove-Item -Recurse -Force $tempDir

Write-Host "Native DOCX (Times New Roman, 13pt) created successfully at: $docxPath"
