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

    // ===== CHỨC NĂNG ZODIAC DRAG & DROP =====
    let isZodiacDragging = false;
    let $zodiacDraggedItem = null;
    let $zodiacClone = null;
    let zodiacStartX = 0;
    let zodiacStartY = 0;
    let originalIndex = -1;

    // Thêm box zodiac mới
    $('.add-zodiac-btn').on('click', function() {
        const selectedZodiac = $('.zodiac-select').val();
        const zodiacEmoji = $('.zodiac-select option:selected').html();
        
        // Tạo box zodiac mới
        const $zodiacBox = $('<div class="zodiac-box"></div>')
            .attr('data-zodiac', selectedZodiac)
            .html(`<span class="zodiac-emoji">${zodiacEmoji}</span>`);
        
        // Thêm vào content (cuối cùng)
        $('.drag-drop-content').append($zodiacBox);
        
        // Thêm sự kiện kéo thả cho box mới
        addZodiacDragEvents($zodiacBox);
    });

    // Thêm sự kiện kéo thả cho box zodiac
    function addZodiacDragEvents($zodiacBox) {
        $zodiacBox.on('mousedown', function(e) {
            e.preventDefault();
            
            isZodiacDragging = true;
            $zodiacDraggedItem = $(this);
            zodiacStartX = e.clientX;
            zodiacStartY = e.clientY;
            
            // Lưu vị trí ban đầu
            originalIndex = $zodiacDraggedItem.index();
            
            // Tạo clone
            $zodiacClone = $zodiacDraggedItem.clone();
            const originalRect = $zodiacDraggedItem[0].getBoundingClientRect();
            
            $zodiacClone.addClass('zodiac-dragging-clone').css({
                'position': 'fixed',
                'z-index': '1000',
                'width': originalRect.width + 'px',
                'height': originalRect.height + 'px',
                'opacity': '0.9',
                'pointer-events': 'none',
                'left': originalRect.left + 'px',
                'top': originalRect.top + 'px'
            });
            
            // Đánh dấu item gốc là đang kéo
            $zodiacDraggedItem.addClass('dragging-original');
            
            // Thêm clone vào body
            $('body').append($zodiacClone);
            
            // Thêm sự kiện di chuyển và thả
            $(document).on('mousemove.zodiac', onZodiacMouseMove);
            $(document).on('mouseup.zodiac', onZodiacMouseUp);
        });
    }

    function onZodiacMouseMove(e) {
        if (!isZodiacDragging || !$zodiacClone) return;
        
        const deltaX = e.clientX - zodiacStartX;
        const deltaY = e.clientY - zodiacStartY;
        
        // Di chuyển clone tự do
        const originalRect = $zodiacDraggedItem[0].getBoundingClientRect();
        $zodiacClone.css({
            'left': originalRect.left + deltaX + 'px',
            'top': originalRect.top + deltaY + 'px'
        });
        
        // Tính toán vị trí mới trong grid
        updateDropIndicator(e.clientX, e.clientY);
    }

    function updateDropIndicator(clientX, clientY) {
        const $dragDropContent = $('.drag-drop-content');
        const contentRect = $dragDropContent[0].getBoundingClientRect();
        
        // Kiểm tra xem có trong vùng content không
        if (clientX < contentRect.left || clientX > contentRect.right ||
            clientY < contentRect.top || clientY > contentRect.bottom) {
            removeDropIndicator();
            return;
        }
        
        // Tính toán vị trí trong grid
        const gridX = clientX - contentRect.left;
        const gridY = clientY - contentRect.top;
        
        const $allBoxes = $('.zodiac-box').not('.dragging-original');
        const boxWidth = contentRect.width / 4;
        const boxHeight = boxWidth; // aspect-ratio 1:1
        
        const targetCol = Math.floor(gridX / boxWidth);
        const targetRow = Math.floor(gridY / boxHeight);
        const targetIndex = targetRow * 4 + targetCol;
        
        // Hiển thị indicator tại vị trí mới
        showDropIndicator(targetIndex);
    }

    function showDropIndicator(targetIndex) {
        const $allBoxes = $('.zodiac-box').not('.dragging-original');
        const $content = $('.drag-drop-content');
        
        // Xóa indicator cũ
        $('.drop-indicator').remove();
        
        // Tạo indicator
        const $indicator = $('<div class="drop-indicator"></div>').css({
            'position': 'absolute',
            'border': '2px dashed #627fea',
            'background-color': 'rgba(98, 127, 234, 0.1)',
            'border-radius': '8px',
            'pointer-events': 'none',
            'z-index': '999'
        });
        
        if (targetIndex >= $allBoxes.length) {
            // Thêm vào cuối
            $content.append($indicator);
        } else {
            // Chèn vào trước box tại targetIndex
            $allBoxes.eq(targetIndex).before($indicator);
        }
        
        // Đặt kích thước cho indicator
        const firstBox = $allBoxes.length > 0 ? $allBoxes[0] : $zodiacDraggedItem[0];
        if (firstBox) {
            const rect = firstBox.getBoundingClientRect();
            $indicator.css({
                'width': rect.width + 'px',
                'height': rect.height + 'px'
            });
        }
    }

    function removeDropIndicator() {
        $('.drop-indicator').remove();
    }

    function onZodiacMouseUp(e) {
        if (!isZodiacDragging || !$zodiacDraggedItem || !$zodiacClone) return;
        
        const $dragDropContent = $('.drag-drop-content');
        const contentRect = $dragDropContent[0].getBoundingClientRect();
        
        // Kiểm tra xem có trong vùng content không
        if (e.clientX >= contentRect.left && e.clientX <= contentRect.right &&
            e.clientY >= contentRect.top && e.clientY <= contentRect.bottom) {
            
            // Tính toán vị trí mới
            const gridX = e.clientX - contentRect.left;
            const gridY = e.clientY - contentRect.top;
            
            const $allBoxes = $('.zodiac-box').not('.dragging-original');
            const boxWidth = contentRect.width / 4;
            const boxHeight = boxWidth;
            
            const targetCol = Math.floor(gridX / boxWidth);
            const targetRow = Math.floor(gridY / boxHeight);
            let targetIndex = targetRow * 4 + targetCol;
            
            // Đảm bảo targetIndex hợp lệ
            targetIndex = Math.min(targetIndex, $allBoxes.length);
            
            // Di chuyển item đến vị trí mới
            if (targetIndex >= $allBoxes.length) {
                $dragDropContent.append($zodiacDraggedItem);
            } else {
                $allBoxes.eq(targetIndex).before($zodiacDraggedItem);
            }
        }
        
        // Dọn dẹp
        cleanupZodiacDrag();
    }

    function cleanupZodiacDrag() {
        // Xóa clone và indicator
        $zodiacClone.remove();
        removeDropIndicator();
        
        // Reset styles
        $zodiacDraggedItem.removeClass('dragging-original');
        
        // Reset variables
        isZodiacDragging = false;
        $zodiacDraggedItem = null;
        $zodiacClone = null;
        originalIndex = -1;
        
        // Xóa sự kiện
        $(document).off('mousemove.zodiac');
        $(document).off('mouseup.zodiac');
    }

    // Thêm sự kiện kéo thả cho các box zodiac tồn tại (nếu có)
    $('.drag-drop-content .zodiac-box').each(function() {
        addZodiacDragEvents($(this));
    });
});