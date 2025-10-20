// Toàn bộ chức năng sử dụng jQuery
$(document).ready(function() {
    // ===== HIỆU ỨNG HOVER NAVBAR VÀ FOOTER =====
    const $navbarMenus = $('.navbar a');
    const $footerMenus = $('.footer-menu a');
    
    // Hover navbar ảnh hưởng footer
    $navbarMenus.each(function(index) {
        $(this).on('mouseover', function() {
            $footerMenus.eq(index).css({
                'color': '#ffdfb3',
                'background-color': '#ff8407'
            });
            $(this).css('color', 'orange');
        });
        
        $(this).on('mouseout', function() {
            $footerMenus.eq(index).css({
                'color': '#ff8407',
                'background-color': '#ffdfb3'
            });
            $(this).css('color', '#003366');
        });
    });
    
    // Hover footer ảnh hưởng navbar
    $footerMenus.each(function(index) {
        $(this).on('mouseover', function() {
            $navbarMenus.eq(index).css('color', 'orange');
            $(this).css({
                'color': '#ffdfb3',
                'background-color': '#ff8407'
            });
        });
        
        $(this).on('mouseout', function() {
            $navbarMenus.eq(index).css('color', '#003366');
            $(this).css({
                'color': '#ff8407',
                'background-color': '#ffdfb3'
            });
        });
    });

    // ===== CHỨC NĂNG ĐÓNG/MỞ NEWS BOX =====
    $('.aside-box .toggle-btn').on('click', function(e) {
        e.stopPropagation();
        const $box = $(this).closest('.aside-box');
        const $btn = $(this);
        
        $box.toggleClass('closed');
        $btn.text($box.hasClass('closed') ? '►' : '↓');
    });

    // ===== CHỨC NĂNG KÉO THẢ NEWS BOX =====
    let isDragging = false;
    let $draggedItem = null;
    let $clone = null;
    let startY = 0;
    let startTop = 0;

    // Xử lý kéo thả
    $('.move-btn').on('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isDragging = true;
        $draggedItem = $(this).closest('.aside-box');
        startY = e.clientY;
        startTop = $draggedItem.offset().top;
        
        // Lấy vị trí và kích thước của aside
        const $aside = $('.aside');
        const asideOffset = $aside.offset();
        const asideLeft = asideOffset.left;
        const asideWidth = $aside.width();
        
        // Tạo clone
        $clone = $draggedItem.clone();
        $clone.addClass('dragging-clone').css({
            'position': 'absolute',
            'z-index': '1000',
            'width': asideWidth + 'px',
            'opacity': '0.8',
            'pointer-events': 'none',
            'left': asideLeft + 'px',
            'top': startTop + 'px',
            'margin': '0',
            'box-sizing': 'border-box'
        });
        
        // Ẩn item gốc
        $draggedItem.css('opacity', '0.3');
        
        // Thêm clone vào body
        $('body').append($clone);
        
        // Thêm sự kiện di chuyển và thả
        $(document).on('mousemove.drag', onMouseMove);
        $(document).on('mouseup.drag', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging || !$clone) return;
        
        const deltaY = e.clientY - startY;
        
        // Tính toán vị trí mới - không giới hạn phạm vi
        const newTop = startTop + deltaY;
        
        $clone.css('top', newTop + 'px');
    }

    function onMouseUp() {
        if (!isDragging || !$draggedItem || !$clone) return;
        
        const finalTop = $clone.offset().top;
        const $aside = $('.aside');
        const $allBoxes = $('.aside-box').not($draggedItem);
        let newPosition = null;
        
        // Tìm vị trí mới để chèn dựa trên vị trí clone
        $allBoxes.each(function() {
            const $box = $(this);
            const boxTop = $box.offset().top;
            const boxHeight = $box.outerHeight();
            const boxMiddle = boxTop + boxHeight / 2;
            
            if (finalTop < boxMiddle) {
                newPosition = $box;
                return false; // break loop
            }
        });
        
        // Di chuyển item đến vị trí mới
        if (newPosition) {
            newPosition.before($draggedItem);
        } else {
            // Nếu không tìm thấy vị trí phù hợp, thêm vào cuối
            $aside.append($draggedItem);
        }
        
        // Xóa clone và reset styles
        $clone.remove();
        $draggedItem.css('opacity', '');
        
        // Reset variables
        isDragging = false;
        $draggedItem = null;
        $clone = null;
        
        // Xóa sự kiện
        $(document).off('mousemove.drag');
        $(document).off('mouseup.drag');
    }
});