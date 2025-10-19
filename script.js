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
        const asideTop = asideOffset.top;
        const asideLeft = asideOffset.left;
        const asideWidth = $aside.width();
        const asideHeight = $aside.outerHeight();
        
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
        $draggedItem.css('visibility', 'hidden');
        
        // Thêm clone vào body
        $('body').append($clone);
        
        // Thêm sự kiện di chuyển và thả
        $(document).on('mousemove.drag', onMouseMove);
        $(document).on('mouseup.drag', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging || !$clone) return;
        
        const deltaY = e.clientY - startY;
        const $aside = $('.aside');
        const asideOffset = $aside.offset();
        const asideTop = asideOffset.top;
        const asideBottom = asideTop + $aside.outerHeight();
        const cloneHeight = $clone.outerHeight();
        
        // Tính toán vị trí mới
        let newTop = startTop + deltaY;
        
        // Giới hạn phạm vi di chuyển trong aside
        // Không cho phép kéo ra khỏi aside
        if (newTop < asideTop) {
            newTop = asideTop;
        }
        if (newTop + cloneHeight > asideBottom) {
            newTop = asideBottom - cloneHeight;
        }
        
        $clone.css('top', newTop + 'px');
    }

    function onMouseUp() {
        if (!isDragging || !$draggedItem || !$clone) return;
        
        const finalTop = $clone.offset().top;
        const $aside = $('.aside');
        const $allBoxes = $('.aside-box').not($draggedItem);
        let newPosition = null;
        let inserted = false;
        
        // Tìm vị trí mới để chèn dựa trên vị trí clone
        $allBoxes.each(function() {
            const $box = $(this);
            const boxTop = $box.offset().top;
            const boxHeight = $box.outerHeight();
            const boxMiddle = boxTop + boxHeight / 2;
            
            if (finalTop < boxMiddle) {
                newPosition = $box;
                inserted = true;
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
        $draggedItem.css('visibility', '');
        
        // Reset variables
        isDragging = false;
        $draggedItem = null;
        $clone = null;
        
        // Xóa sự kiện
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

    // ===== CHỨC NĂNG XỬ LÝ TEXT (HIGHLIGHT, DELETE, RESET) =====
    // Lưu nội dung gốc để reset
    const originalContent = $('.process-text-content').html();

    $('.highlight-btn').on('click', function() {
        const regexText = $('.regex-box').val();
        if (!regexText) {
            console.log('Vui lòng nhập regex!');
            return;
        }
        
        try {
            // Sử dụng flag 'g' thay vì 'gi' để phân biệt hoa thường
            const regex = new RegExp(regexText, 'g');
            const $content = $('.process-text-content');
            let content = $content.html();
            
            // Loại bỏ các highlight cũ để tránh chồng chất
            content = content.replace(/<span class="highlighted"[^>]*>(.*?)<\/span>/gi, '$1');
            
            // Highlight text với style hiện tại từ decoration (phân biệt hoa thường)
            content = content.replace(regex, match => 
                `<span class="highlighted" style="font-weight: ${currentFontWeight}; font-style: ${currentFontStyle}; text-decoration: ${currentTextDecoration}; background-color: ${currentBgColor}; color: ${currentTextColor};">${match}</span>`
            );
            
            $content.html(content);
        } catch (e) {
            console.log('Regex không hợp lệ! Vui lòng kiểm tra lại.');
        }
    });

    $('.delete-btn').on('click', function() {
        const regexText = $('.regex-box').val();
        if (!regexText) {
            console.log('Vui lòng nhập regex!');
            return;
        }
        
        try {
            // Sử dụng flag 'g' thay vì 'gi' để phân biệt hoa thường
            const regex = new RegExp(regexText, 'g');
            const $content = $('.process-text-content');
            let content = $content.html();
            
            // Xóa cả text thường và text đã highlight khớp regex (phân biệt hoa thường)
            // Escape regexText để tránh lỗi khi có ký tự đặc biệt trong regex
            const escapedRegexText = regexText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            content = content.replace(new RegExp(`<span class="highlighted"[^>]*>(${escapedRegexText})<\/span>`, 'g'), '');
            content = content.replace(regex, '');
            
            $content.html(content);
        } catch (e) {
            console.log('Regex không hợp lệ! Vui lòng kiểm tra lại.');
        }
    });

    $('.reset-btn').on('click', function() {
        // Reset về nội dung gốc
        $('.process-text-content').html(originalContent);
        $('.regex-box').val('');
        
        // Reset style decoration về mặc định
        currentTextColor = '#333333';
        currentBgColor = '#ffffff';
        currentFontWeight = 'normal';
        currentFontStyle = 'normal';
        currentTextDecoration = 'none';
        
        // Reset các checkbox và color picker
        $('.bold-option, .italic-option, .underline-option').prop('checked', false);
        $('.text-color-picker').val('#333333');
        $('.bg-color-picker').val('#ffffff');
        
        // Cập nhật lại sample text
        updateSampleTextStyle();
    });

    // ===== NGĂN CHẶN SELECTION KHI KÉO THẢ =====
    $('.move-btn, .aside-box-bar').on('selectstart', function(e) {
        e.preventDefault();
    });
});