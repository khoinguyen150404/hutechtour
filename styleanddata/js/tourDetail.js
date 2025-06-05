// Hàm lấy thông tin tour từ ID
async function getTourById(tourId) {
    try {
        const response = await fetch('assets/data/tours.json');
        const data = await response.json();
        
        // Tìm trong cả hai danh sách tour
        let tour = data.tourGiamGia.find(t => t.id === tourId);
        if (!tour) {
            tour = data.tourPhoBien.find(t => t.id === tourId);
        }
        return tour;
    } catch (error) {
        console.error('Lỗi khi tải thông tin tour:', error);
        return null;
    }
}

// Hàm tạo HTML cho rating stars
function createStarRating(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5-rating);
}

// Hàm hiển thị thông tin tour trên trang payment
async function displayTourDetail() {
    // Lấy ID tour từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    
    if (!tourId) {
        console.error('Không tìm thấy ID tour trong URL');
        return;
    }

    const tour = await getTourById(tourId);
    if (!tour) {
        console.error('Không tìm thấy thông tin tour');
        return;
    }

    // Cập nhật thông tin tour trên trang
    document.querySelector('.tour-title').textContent = tour.ten;
    document.querySelector('.tour-image').src = tour.image;
    document.querySelector('.tour-duration').textContent = `Thời gian: ${tour.thoiGian}`;
    document.querySelector('.tour-description').textContent = tour.moTa;
    
    const priceElement = document.querySelector('.tour-price');
    if (tour.giamGia) {
        // Tour giảm giá
        priceElement.innerHTML = `
            <div class="old-price">${tour.giaGoc} VND</div>
            <div class="new-price">${tour.giaMoi} VND</div>
            <div class="discount">Giảm ${tour.giamGia}</div>
        `;
    } else {
        // Tour phổ biến
        priceElement.innerHTML = `
            <div class="price">${tour.gia} VND</div>
        `;
    }

    document.querySelector('.tour-rating').innerHTML = `
        <span class="stars">${createStarRating(tour.danhGia)}</span>
        <span class="reviews">(${tour.soLuotDanhGia} đánh giá)</span>
    `;
}

// Chạy khi trang được tải
document.addEventListener('DOMContentLoaded', displayTourDetail);
