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
    let draggingBox = null;
    let placeholder = null;

    boxes.forEach(box => {
        const moveBtn = box.querySelector(".move-btn");

        moveBtn.addEventListener("mousedown", e => {
            e.preventDefault();
            draggingBox = box;
            box.classList.add("dragging");

            // tạo placeholder để giữ vị trí
            placeholder = document.createElement("div");
            placeholder.className = "placeholder";
            placeholder.style.height = `${box.offsetHeight}px`;
            aside.insertBefore(placeholder, box.nextSibling);

            // đặt vị trí tuyệt đối để box theo chuột
            box.style.width = `${box.offsetWidth}px`;
            box.style.position = "absolute";
            box.style.zIndex = "1000";
            const rect = box.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;

            function onMouseMove(eMove) {
                box.style.top = `${eMove.clientY - offsetY}px`;
                box.style.left = `${rect.left}px`;

                // xác định vị trí thả tạm
                const boxesArray = Array.from(aside.querySelectorAll(".aside-box:not(.dragging)"));
                const hovered = boxesArray.find(b => {
                    const r = b.getBoundingClientRect();
                    return eMove.clientY < r.top + r.height / 2;
                });
                if (hovered) {
                    aside.insertBefore(placeholder, hovered);
                } else {
                    aside.appendChild(placeholder);
                }
            }

            function onMouseUp() {
                // thả box vào chỗ placeholder
                box.classList.remove("dragging");
                box.style.position = "";
                box.style.top = "";
                box.style.left = "";
                box.style.zIndex = "";
                box.style.width = "";
                aside.insertBefore(box, placeholder);
                placeholder.remove();

                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                draggingBox = null;
                placeholder = null;
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    });
});
