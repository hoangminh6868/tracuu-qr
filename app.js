let danhSachHoSo = [];

// 1. Tải và đọc file 'mon 2.xlsx' khi trang web vừa mở
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let response = await fetch('mon 2.xlsx');
        let arrayBuffer = await response.arrayBuffer();
        
        let workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let firstSheet = workbook.SheetNames[0]; // Lấy sheet 'DanhSach'
        let worksheet = workbook.Sheets[firstSheet];
        
        // Chuyển đổi dữ liệu Excel thành mảng JSON
        danhSachHoSo = XLSX.utils.sheet_to_json(worksheet);
        console.log("Đã tải dữ liệu thành công:", danhSachHoSo);
    } catch (error) {
        console.error("Lỗi khi đọc file Excel:", error);
    }
});

// 2. Xử lý sự kiện khi bấm nút Tra cứu hoặc submit form
document.addEventListener('DOMContentLoaded', () => {
    const lookupForm = document.querySelector('#lookup-form');
    const inputCCCD = document.querySelector('#identity-number');

    if (lookupForm && inputCCCD) {
        lookupForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn trình duyệt load lại trang
            let soCCCDCanTim = inputCCCD.value.trim();

            if (!soCCCDCanTim) {
                alert("Vui lòng nhập số căn cước công dân!");
                return;
            }

            // Tìm kiếm trong mảng dữ liệu dựa vào cột 'Số căn cước' trong file Excel
            let ketQua = danhSachHoSo.find(item => 
                String(item['Số căn cước'] || '').trim() === soCCCDCanTim
            );

            // 3. Hiển thị kết quả tra cứu ra giao diện phần 02
            if (ketQua) {
                hienThiKetQuaLenGiaoDien(ketQua);
            } else {
                hienThiKhongTimThay();
            }
        });
    }
});

// Hàm hiển thị thông tin chi tiết khi tìm thấy hồ sơ
function hienThiKetQuaLenGiaoDien(data) {
    const khuVucHienThi = document.querySelector('#result-container');
    
    if (khuVucHienThi) {
        khuVucHienThi.innerHTML = `
            <div style="background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #fed7d7;" class="space-y-3">
                <h3 style="color: #9d1d2b; font-size: 1.25rem; font-weight: bold; border-bottom: 2px solid #fed7d7; padding-bottom: 8px; margin-bottom: 12px;">Kết quả tra cứu hồ sơ sát hạch</h3>
                <p><strong>Họ và tên thí sinh:</strong> <span style="color: #1d4ed8; font-weight: 600;">${data['Họ tên thí sinh'] || 'N/A'}</span></p>
                <p><strong>Ngày sinh:</strong> ${data['Ngày sinh'] || 'N/A'}</p>
                <p><strong>Số căn cước:</strong> ${data['Số căn cước'] || 'N/A'}</p>
                <p><strong>Hạng GPLX:</strong> ${data['Hạng GPLX'] || 'N/A'}</p>
                <p><strong>Nội dung sát hạch:</strong> ${data['Nội Dung SH'] || 'N/A'}</p>
                <p><strong>Lệ phí:</strong> ${data['Số tiền'] ? data['Số tiền'] + ' k' : 'N/A'}</p>
            </div>
        `;
    }
}

// Hàm hiển thị khi không tìm thấy số CCCD
function hienThiKhongTimThay() {
    const khuVucHienThi = document.querySelector('#result-container');
    if (khuVucHienThi) {
        khuVucHienThi.innerHTML = `
            <div style="background: #fff5f5; padding: 20px; border-radius: 12px; border: 1px solid #feb2b2; text-align: center; color: #c53030;">
                <h3 style="font-weight: bold; margin-bottom: 8px;">Không tìm thấy hồ sơ</h3>
                <p>Không có thông tin thí sinh nào ứng với số căn cước này. Vui lòng kiểm tra lại!</p>
            </div>
        `;
    }
}