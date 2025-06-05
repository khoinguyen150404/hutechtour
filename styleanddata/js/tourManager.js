// Hàm tạo sao rating
function createStarRating(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Tạo HTML cho tour giảm giá
function createDiscountTourCard(tour) {
  return `
    <div class="tour-card hidden">
      <img src="${tour.image}" alt="${tour.ten}">
      <div class="discount-label">Giảm ${tour.giamGia}</div>
      <div class="tour-name">${tour.ten}</div>
      <div class="tour-popup">
        <h3>${tour.ten}</h3>
        <p>Thời gian: ${tour.thoiGian}</p>
        <p>Mô tả: ${tour.moTa}</p>
        <div class="tour-price">
          <div class="old-price">${tour.giaGoc} VND</div>
          <div class="new-price">${tour.giaMoi} VND</div>
        </div>
        <div class="tour-rating">
          <span class="stars">${createStarRating(tour.danhGia)}</span>
          <span class="reviews">(${tour.soLuotDanhGia} đánh giá)</span>
        </div>
        <a href="${tour.linkDatTour}?id=${tour.id}" class="book-now-btn">Đặt ngay</a>
      </div>
    </div>
  `;
}

// Tạo HTML cho tour phổ biến
function createPopularTourCard(tour) {
  return `
    <div class="tour-card hidden">
      <img src="${tour.image}" alt="${tour.ten}">
      <div class="tour-name">${tour.ten}</div>
      <div class="tour-popup">
        <h3>${tour.ten}</h3>
        <p>Thời gian: ${tour.thoiGian}</p>
        <p>Mô tả: ${tour.moTa}</p>
        <div class="tour-price">
          <div class="new-price">${tour.gia} VND</div>
        </div>
        <div class="tour-rating">
          <span class="stars">${createStarRating(tour.danhGia)}</span>
          <span class="reviews">(${tour.soLuotDanhGia} đánh giá)</span>
        </div>
        <a href="${tour.linkDatTour}?id=${tour.id}" class="book-now-btn">Đặt ngay</a>
      </div>
    </div>
  `;
}

// Khi DOM sẵn sàng, gọi loadTours()
document.addEventListener('DOMContentLoaded', loadTours);

async function loadTours() {
  try {
    const response = await fetch('assets/data/tours.json');
    const data = await response.json();

    // 1. Đổ tour giảm giá vào #slider
    const discountSlider = document.getElementById('slider');
    if (discountSlider) {
      discountSlider.innerHTML =
        data.tourGiamGia.map(tour => createDiscountTourCard(tour)).join('') +
        // (Nếu muốn thêm nút "Xem thêm" cuối slider)
        '<div class="more-button-wrapper"><a href="#" class="more-button">Xem thêm</a></div>';
    }

    // 2. Đổ tour phổ biến vào #hot
    const popularSlider = document.getElementById('hot');
    if (popularSlider) {
      popularSlider.innerHTML =
        data.tourPhoBien.map(tour => createPopularTourCard(tour)).join('') +
        '<div class="more-button-wrapper"><a href="#" class="more-button">Xem thêm</a></div>';
    }

    // 3. Khởi động slider logic và observer fade-in
    initializeSliders();
    initializeObserver();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu tour:', error);
  }
}
