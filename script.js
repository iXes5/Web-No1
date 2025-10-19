// Kết nối hiệu ứng hover giữa navbar và footer menu
document.addEventListener('DOMContentLoaded', function() {
    const navbarMenus = document.querySelectorAll('.navbar a');
    const footerMenus = document.querySelectorAll('.footer-menu a');
    
    // Khi hover vào navbar
    navbarMenus.forEach((menu, index) => {
        menu.addEventListener('mouseover', function() {
            footerMenus[index].style.color = '#ffdfb3';
            footerMenus[index].style.backgroundColor = '#ff8407';
            menu.style.color = 'orange'; // đồng bộ màu cho chính navbar
        });
        
        menu.addEventListener('mouseout', function() {
            footerMenus[index].style.color = '#ff8407';
            footerMenus[index].style.backgroundColor = '#ffdfb3';
            menu.style.color = '#003366';
        });
    });
    
    // Khi hover vào footer
    footerMenus.forEach((menu, index) => {
        menu.addEventListener('mouseover', function() {
            navbarMenus[index].style.color = 'orange';
            menu.style.color = '#ffdfb3';
            menu.style.backgroundColor = '#ff8407';
        });
        
        menu.addEventListener('mouseout', function() {
            navbarMenus[index].style.color = '#003366';
            menu.style.color = '#ff8407';
            menu.style.backgroundColor = '#ffdfb3';
        });
    });
});

// Chức năng đóng/mở và di chuyển các box trong aside
document.addEventListener("DOMContentLoaded", () => {
    const aside = document.querySelector(".aside");
    const boxes = document.querySelectorAll(".aside-box");

    // Đóng mở nội dung như cũ
    boxes.forEach(box => {
        const toggleBtn = box.querySelector(".toggle-btn");
        toggleBtn.addEventListener("click", e => {
            e.stopPropagation();
            box.classList.toggle("closed");
            toggleBtn.textContent = box.classList.contains("closed") ? "►" : "↓";
        });
    });

    // Kéo thả bằng giữ chuột ở nút move-btn
    
});
