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

// 2. Xử lý sự kiện khi bấm nút Tra cứu
document.addEventListener('DOMContentLoaded', () => {
    const btnTraCuu = document.querySelector('button'); // Nút tra cứu màu đỏ
    const inputCCCD = document.querySelector('input[type="text"]'); // Ô nhập số căn cước

    if (btnTraCuu && inputCCCD) {
        btnTraCuu.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn trình duyệt load lại trang
            let soCCCDCanTim = inputCCCD.value.trim();

            if (!soCCCDCanTim) {
                alert("Vui lòng nhập số căn cước công dân!");
                return;
            }

            // Tìm kiếm trong mảng dữ liệu dựa vào cột 'Số căn cước'
            let ketQua = danhSachHoSo.find(item => 
                String(item['Số căn cước'] || '').trim() === soCCCDCanTim
            );

            // 3. Hiển thị kết quả tra cứu ra giao diện phần 02
            if (ketQua) {
                hienThiKetQuaLenGiaoDien(ketQua);
            } else {
                alert("Không tìm thấy thông tin hồ sơ cho số căn cước này!");
            }
        });
    }
});

// Hàm hiển thị thông tin chi tiết lên phần "Kết quả tra cứu"
function hienThiKetQuaLenGiaoDien(data) {
    // Tìm khu vực chứa nội dung kết quả (phần 02 trên giao diện của bạn)
    const khuVucHienThi = document.querySelector('.p-6') || document.querySelector('div.space-y-4');
    
    if (khuVucHienThi) {
        khuVucHienThi.innerHTML = `
            <div class="bg-white p-5 rounded-xl shadow-md border border-red-100 space-y-3">
                <h3 class="font-bold text-xl text-red-800 border-b pb-2">Kết quả tra cứu hồ sơ sát hạch</h3>
                <p><strong>Họ và tên thí sinh:</strong> <span class="text-blue-700 font-semibold">${data['Họ tên thí sinh'] || 'N/A'}</span></p>
                <p><strong>Ngày sinh:</strong> ${data['Ngày sinh'] || 'N/A'}</p>
                <p><strong>Số căn cước:</strong> ${data['Số căn cước'] || 'N/A'}</p>
                <p><strong>Hạng GPLX:</strong> ${data['Hạng GPLX'] || 'N/A'}</p>
                <p><strong>Nội dung sát hạch:</strong> ${data['Nội Dung SH'] || 'N/A'}</p>
                <p><strong>Lệ phí:</strong> ${data['Số tiền'] ? data['Số tiền'] + ' k' : 'N/A'}</p>
            </div>
        `;
    }
}