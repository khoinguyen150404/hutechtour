// === PHẦN POPUP / NEWSLETTER (Nếu bạn vẫn dùng) ===
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("newsletterEmail");
  const submitBtn = document.getElementById("newsletterBtn");
  const message = document.getElementById("newsletterMessage");

  submitBtn.addEventListener("click", function () {
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
      message.textContent = "Vui lòng nhập email hợp lệ.";
      message.style.color = "red";
      return;
    }
    message.textContent = "Đăng ký thành công! Cảm ơn bạn.";
    message.style.color = "green";
    setTimeout(() => {
      message.textContent = "";
      emailInput.value = "";
    }, 3000);
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});

const popupButtons = document.querySelectorAll('.showPopupBtn');
const overlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closePopupBtn');

popupButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.style.display = 'flex';
    closeBtn.focus();
  });
});

closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.style.display = 'none';
});

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape" && overlay.style.display === 'flex') {
    overlay.style.display = 'none';
  }
});

const noTourBtn = document.getElementById('noTourBtn');
const overlayNoTour = document.getElementById('popupOverlay_noTour');
const closeBtnNoTour = document.getElementById('closePopupBtn_noTour');

if (noTourBtn) {
  noTourBtn.addEventListener('click', (e) => {
    e.preventDefault();
    overlayNoTour.style.display = 'flex';
  });
}

if (closeBtnNoTour) {
  closeBtnNoTour.addEventListener('click', () => {
    overlayNoTour.style.display = 'none';
  });
}

if (overlayNoTour) {
  overlayNoTour.addEventListener('click', (e) => {
    if (e.target === overlayNoTour) overlayNoTour.style.display = 'none';
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlayNoTour && overlayNoTour.style.display === 'flex') {
    overlayNoTour.style.display = 'none';
  }
});

// === PHẦN SLIDER LOGIC ===
// Lưu ý: initializeSliders() cần được gọi sau khi tourManager đã gán .innerHTML cho #slider và #hot.

function initializeSliders() {
  // === Slider 1: Tour Giá Sập Sàn ===
  const slider1   = document.getElementById('slider');
  const leftBtn1  = document.getElementById('leftBtn');
  const rightBtn1 = document.getElementById('rightBtn');

  if (!slider1 || !leftBtn1 || !rightBtn1) return;

  // 1) Lấy danh sách tất cả các .tour-card (bao gồm cả "Xem thêm")
  const cards1 = slider1.querySelectorAll('.tour-card');
  const total1 = cards1.length; // tổng số card (ở đây là 8 tour + 1 “Xem thêm” = 9)

  if (total1 === 0) return;

  // 2) Tính chiều rộng mỗi card thật CHÍNH XÁC, bao gồm margin-right
  //    (Thay vì cứng tourWidth1 = 300 như trước)
  const style1     = getComputedStyle(cards1[0]);
  const cardWidth1 = cards1[0].offsetWidth + parseInt(style1.marginRight);
  //    → ví dụ: offsetWidth = 300, marginRight = 16 → cardWidth1 = 316px

  // 3) Tính số card mà viewport (parentElement của slider) có thể hiển thị cùng lúc
  const viewportWidth1 = slider1.parentElement.clientWidth;
  const visibleCount1  = Math.floor(viewportWidth1 / cardWidth1);
  //    Ví dụ: viewportWidth1 = 1264 ⇒ visibleCount1 = Math.floor(1264 / 316) = 4

  // 4) Tính maxIndex1 để không trượt ra khoảng trống
  //    maxIndex1 = total1 - visibleCount1
  //    Ví dụ: total1 = 9, visibleCount1 = 4 ⇒ maxIndex1 = 5
  const maxIndex1 = total1 - visibleCount1;
  let index1 = 0;

  // Thực ra, khi index1 = 5, slider sẽ dịch hết 5 * 316px ⇒ hiển thị card [5,6,7,8]
  // (trong đó card 8 chính là “Xem thêm”), không còn dư trống nữa.

  function updateTransform1() {
    slider1.style.transform = `translateX(${-index1 * cardWidth1}px)`;
  }

  function next1() {
    if (index1 < maxIndex1) {
      index1++;
    } else {
      index1 = 0;
    }
    updateTransform1();
  }

  function prev1() {
    if (index1 > 0) {
      index1--;
    } else {
      index1 = maxIndex1;
    }
    updateTransform1();
  }

  // Thay đổi ở đây: không còn dùng (index + 1) % total1 
  // mà giới hạn index1 ≤ maxIndex1 để không bị trượt lố.

  // --- Phần tự động scroll và sự kiện click ---
  let autoScroll1 = true;
  let timeout1;

  leftBtn1.addEventListener('click', () => {
    prev1();
    pauseAutoScroll1();
  });
  rightBtn1.addEventListener('click', () => {
    next1();
    pauseAutoScroll1();
  });

  function pauseAutoScroll1() {
    autoScroll1 = false;
    clearTimeout(timeout1);
    timeout1 = setTimeout(() => {
      autoScroll1 = true;
    }, 10000);
  }

  setInterval(() => {
    if (autoScroll1) {
      next1();
    }
  }, 3000);

  // === Slider 2: Tour Phổ Biến Nhất ===
  const slider2   = document.getElementById('hot');
  const leftBtn2  = document.getElementById('leftBtn1');
  const rightBtn2 = document.getElementById('rightBtn1');

  if (!slider2 || !leftBtn2 || !rightBtn2) return;

  const cards2 = slider2.querySelectorAll('.tour-card');
  const total2 = cards2.length; // tổng số card (ở đây 7 tour + 1 “Xem thêm” = 8)

  if (total2 === 0) return;

  // 1) Tính chính xác chiều rộng mỗi card (offsetWidth + marginRight)
  const style2     = getComputedStyle(cards2[0]);
  const cardWidth2 = cards2[0].offsetWidth + parseInt(style2.marginRight);

  // 2) Tính số card hiển thị cùng lúc (visibleCount2)
  const viewportWidth2 = slider2.parentElement.clientWidth;
  const visibleCount2  = Math.floor(viewportWidth2 / cardWidth2);
  //    Ví dụ: viewportWidth2 = 1264 ⇒ visibleCount2 = 4

  // 3) Tính maxIndex2 = total2 - visibleCount2
  //    Ví dụ: total2 = 8, visibleCount2 = 4 ⇒ maxIndex2 = 4
  const maxIndex2 = total2 - visibleCount2;
  let index2 = 0;

  function updateTransform2() {
    slider2.style.transform = `translateX(${-index2 * cardWidth2}px)`;
  }

  function next2() {
    if (index2 < maxIndex2) {
      index2++;
    } else {
      index2 = 0;
    }
    updateTransform2();
  }

  function prev2() {
    if (index2 > 0) {
      index2--;
    } else {
      index2 = maxIndex2;
    }
    updateTransform2();
  }

  // Thay đổi tương tự: giới hạn index2 ≤ maxIndex2, không dùng modulo total2 nữa.

  let autoScroll2 = true;
  let timeout2;

  leftBtn2.addEventListener('click', () => {
    prev2();
    pauseAutoScroll2();
  });
  rightBtn2.addEventListener('click', () => {
    next2();
    pauseAutoScroll2();
  });

  function pauseAutoScroll2() {
    autoScroll2 = false;
    clearTimeout(timeout2);
    timeout2 = setTimeout(() => {
      autoScroll2 = true;
    }, 10000);
  }

  setInterval(() => {
    if (autoScroll2) {
      next2();
    }
  }, 3000);
}


// === PHẦN FADE‐IN KHI CUỘN (IntersectionObserver) ===
function initializeObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.tour-card').forEach(card => {
    observer.observe(card);
  });
}

    // Hàm tải dữ liệu và điền vào dropdown
    async function loadTours() {
      const response = await fetch('assets/data/tours.json');
      const data = await response.json();
      console.log(data); // Kiểm tra dữ liệu tải được từ JSON

      // Lấy danh sách điểm đến duy nhất từ cả tour giảm giá và tour phổ biến
      const diemDens = [
        ...new Set([
          ...data.tourGiamGia.map(t => t.ten),
          ...data.tourPhoBien.map(t => t.ten)
        ])
      ].sort();

      const selectDiemDen = document.getElementById('selectDiemDen');
      diemDens.forEach(diemDen => {
        const option = document.createElement('option');
        option.value = diemDen;
        option.textContent = diemDen;
        selectDiemDen.appendChild(option);
      });

      // Lấy danh sách thời gian duy nhất từ cả tour giảm giá và tour phổ biến
      const thoiGians = [
        ...new Set([
          ...data.tourGiamGia.map(t => t.thoiGian),
          ...data.tourPhoBien.map(t => t.thoiGian)
        ])
      ].sort();

      const selectThoiGian = document.getElementById('selectThoiGian');
      thoiGians.forEach(tg => {
        const option = document.createElement('option');
        option.value = tg;
        option.textContent = tg;
        selectThoiGian.appendChild(option);
      });

      // Lấy danh sách loại tour duy nhất từ cả tour giảm giá và tour phổ biến
      const theLoais = [
        ...new Set([
          ...data.tourGiamGia.map(t => t.theLoai),
          ...data.tourPhoBien.map(t => t.theLoai)
        ])
      ].sort();

      const selecttheLoai = document.getElementById('selecttheLoai');
      theLoais.forEach(lt => {
        const option = document.createElement('option');
        option.value = lt;
        option.textContent = lt;
        selecttheLoai.appendChild(option);
      });
    }

    // Hàm lọc tour dựa trên các tiêu chí
    function filterTours(tours, filters) {
      return tours.filter(tour => {
        const matchDiemDen = !filters.diemDen.length || filters.diemDen.includes(tour.ten);
        const matchThoiGian = !filters.thoiGian.length || filters.thoiGian.includes(tour.thoiGian);
        const matchTheLoai = !filters.theLoai.length || filters.theLoai.includes(tour.theLoai);
        const matchMua = !filters.mua.length || filters.mua.includes(tour.mua);
        return matchDiemDen && matchThoiGian && matchTheLoai && matchMua;
      });
    }

    // Hàm tạo thẻ tour để hiển thị
    function createTourCard(tour) {
      const card = document.createElement('div');
      card.className = 'tour-card';
      card.style.width = '200px';
      card.style.border = '1px solid #ccc';
      card.style.borderRadius = '8px';
      card.style.padding = '10px';
      card.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = tour.image;
      img.alt = tour.ten;
      img.style.width = '100%';
      img.style.borderRadius = '8px 8px 0 0';

      const title = document.createElement('h4');
      title.textContent = tour.ten;
      title.style.margin = '10px 0 5px 0';

      const desc = document.createElement('p');
      desc.textContent = tour.moTa;
      desc.style.fontSize = '14px';
      desc.style.height = '40px';
      desc.style.overflow = 'hidden';

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);

      card.addEventListener('click', () => {
        // Lưu dữ liệu tour vào sessionStorage
        sessionStorage.setItem('selectedTour', JSON.stringify(tour));
        // Chuyển sang trang payment.html với id tour
        window.location.href = `payment.html?id=${tour.id}`;
      });

      return card;
    }

    document.addEventListener('DOMContentLoaded', async () => {
      await loadTours();

      document.getElementById('btnTimTour').addEventListener('click', () => {
        const diemDen = document.getElementById('selectDiemDen').value;
        const thoiGian = document.getElementById('selectThoiGian').value;
        const theLoai = document.getElementById('selecttheLoai').value;
        const mua = document.getElementById('selectMua').value;

        if (!diemDen && !thoiGian && !theLoai && !mua) {
          alert('Vui lòng chọn ít nhất một tiêu chí tìm kiếm.');
          return;
        }

        const params = new URLSearchParams();
        if (diemDen) params.append('diemDen', diemDen);
        if (thoiGian) params.append('thoiGian', thoiGian);
        if (theLoai) params.append('theLoai', theLoai);
        if (mua) params.append('mua', mua);

        window.location.href = 'searchbox.html?' + params.toString();
      });
    });

 