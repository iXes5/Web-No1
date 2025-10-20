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
        
        // Ẩn item gốc nhẹ đi để vẫn giữ chỗ trong layout
        $draggedItem.addClass('dragging-original').css('opacity', '0.3');
        
        // Thêm clone vào body
        $('body').append($clone);
        
        // Thêm sự kiện di chuyển và thả
        $(document).on('mousemove.drag', onMouseMove);
        $(document).on('mouseup.drag', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging || !$clone) return;
        
        const deltaY = e.clientY - startY;
        
        // Tính toán vị trí mới
        const newTop = startTop + deltaY;

        // Lấy thông tin khung aside
        const $aside = $('.aside');
        const asideTop = $aside.offset().top;
        const asideHeight = $aside.outerHeight();
        const cloneHeight = $clone.outerHeight();

        // Giới hạn vị trí top
        const minTop = asideTop;
        const maxTop = asideTop + asideHeight - cloneHeight;

        // Ràng buộc vị trí
        const boundedTop = Math.min(Math.max(newTop, minTop), maxTop);

        // Cập nhật vị trí clone
        $clone.css('top', boundedTop + 'px');
    }

    function onMouseUp() {
        if (!isDragging || !$draggedItem || !$clone) return;

        const finalTop = $clone.offset().top;
        const $aside = $('.aside');

        // TÌM VỊ TRÍ MỚI: duyệt các box khác (không bao gồm item đang kéo)
        const $otherBoxes = $aside.find('.aside-box').not($draggedItem);
        let inserted = false;

        $otherBoxes.each(function() {
            const $box = $(this);
            const boxTop = $box.offset().top;
            const boxHeight = $box.outerHeight();
            const boxMiddle = boxTop + boxHeight / 2;

            if (finalTop < boxMiddle) {
                $box.before($draggedItem);
                inserted = true;
                return false; // break loop
            }
        });

        // Nếu không tìm thấy vị trí phù hợp thì append vào cuối aside
        if (!inserted) {
            $aside.append($draggedItem);
        }

        // Dọn dẹp: loại bỏ clone, phục hồi style gốc
        $clone.remove();
        $draggedItem.removeClass('dragging-original').css('opacity', '');
        isDragging = false;
        $draggedItem = null;
        $clone = null;
        $(document).off('mousemove.drag');
        $(document).off('mouseup.drag');
    }
});