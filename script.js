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
        const cloneHeight = $clone.outerHeight();
        const finalCenter = finalTop + cloneHeight / 2;

        const $aside = $('.aside');

        // Lấy các box khác (không bao gồm item đang kéo)
        const $otherBoxes = $aside.find('.aside-box').not($draggedItem);
        let inserted = false;

        // Duyệt các box và so sánh tâm clone với tâm box
        $otherBoxes.each(function() {
            const $box = $(this);
            const boxTop = $box.offset().top;
            const boxHeight = $box.outerHeight();
            const boxMiddle = boxTop + boxHeight / 2;

            if (finalCenter < boxMiddle) {
                $box.before($draggedItem);
                inserted = true;
                return false; // break
            }
        });

        // Nếu không chèn ở giữa bất kỳ box nào, append vào cuối (đảm bảo có thể drop xuống dưới box cuối)
        if (!inserted) {
            $aside.append($draggedItem);
        }

        // Dọn dẹp: remove clone, phục hồi style gốc
        $clone.remove();
        $draggedItem.removeClass('dragging-original').css('opacity', '');
        isDragging = false;
        $draggedItem = null;
        $clone = null;
        $(document).off('mousemove.drag');
        $(document).off('mouseup.drag');
    }

    // ===== CHỨC NĂNG TEXT DECORATION =====
    // Biến lưu trữ style hiện tại
    let currentTextColor = '#333333';
    let currentBgColor = '#ffffff';
    let currentFontWeight = 'normal';
    let currentFontStyle = 'normal';
    let currentTextDecoration = 'none';

    // Mở/đóng hộp thoại decoration
    $(document).on('click', '.decorate-icon', function(e) {
        e.stopPropagation();
        const $options = $(this).siblings('.decorate-options');
        
        // Đóng tất cả hộp thoại khác
        $('.decorate-options').not($options).hide();
        
        // Toggle hộp thoại hiện tại
        $options.toggle();
    });

    // Đóng khi click ra ngoài
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.decorate-box').length) {
            $('.decorate-options').hide();
        }
    });

    // Cập nhật style mẫu
    function updateSampleTextStyle() {
        const $box = $('.decorate-box');
        const $sample = $box.find('.sample-text');

        // Cập nhật style cho sample text
        $sample.css({
            'font-weight': currentFontWeight,
            'font-style': currentFontStyle,
            'text-decoration': currentTextDecoration,
            'background-color': currentBgColor,
            'color': currentTextColor
        });
    }

    // Xử lý thay đổi màu chữ
    $(document).on('input change', '.text-color-picker', function() {
        currentTextColor = $(this).val();
        updateSampleTextStyle();
    });

    // Xử lý thay đổi màu nền
    $(document).on('input change', '.bg-color-picker', function() {
        currentBgColor = $(this).val();
        updateSampleTextStyle();
    });

    // Xử lý thay đổi style chữ (bold, italic, underline)
    $(document).on('change', '.bold-option', function() {
        currentFontWeight = $(this).is(':checked') ? 'bold' : 'normal';
        updateSampleTextStyle();
    });

    $(document).on('change', '.italic-option', function() {
        currentFontStyle = $(this).is(':checked') ? 'italic' : 'normal';
        updateSampleTextStyle();
    });

    $(document).on('change', '.underline-option', function() {
        currentTextDecoration = $(this).is(':checked') ? 'underline' : 'none';
        updateSampleTextStyle();
    });

    // ===== CHỨC NĂNG XỬ LÝ TEXT (HIGHLIGHT) =====
    // Lưu nội dung gốc để reset
    const originalContent = $('.process-text-content').html();

    $('.highlight-btn').on('click', function() {
        const regexText = $('.regex-box').val();
        if (!regexText) {
            console.log('Vui lòng nhập regex!');
            return;
        }
        
        try {
            const regex = new RegExp(regexText, 'g');
            const $content = $('.process-text-content');
            let content = $content.html();
            
            // LỖI: Không loại bỏ các highlight cũ trước khi highlight mới
            // content = content.replace(/<span class="highlighted"[^>]*>(.*?)<\/span>/gi, '$1');
            
            // Highlight text với style hiện tại từ decoration
            content = content.replace(regex, match => 
                `<span class="highlighted" style="font-weight: ${currentFontWeight}; font-style: ${currentFontStyle}; text-decoration: ${currentTextDecoration}; background-color: ${currentBgColor}; color: ${currentTextColor};">${match}</span>`
            );
            
            $content.html(content);
        } catch (e) {
            console.log('Regex không hợp lệ! Vui lòng kiểm tra lại.');
        }
    });
});