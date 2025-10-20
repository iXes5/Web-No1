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
        const $decorateBox = $(this).closest('.decorate-box');
        const $options = $decorateBox.find('.decorate-options');
        
        // Đóng tất cả hộp thoại khác và xóa class show-options
        $('.decorate-box').not($decorateBox).removeClass('show-options');
        $('.decorate-options').not($options).hide();
        
        // Toggle hộp thoại hiện tại và class show-options
        $options.toggle();
        $decorateBox.toggleClass('show-options', $options.is(':visible'));
    });

    // Đóng khi click ra ngoài
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.decorate-box').length) {
            $('.decorate-options').hide();
            $('.decorate-box').removeClass('show-options');
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

    // ===== CHỨC NĂNG KÉO THẢ ZODIAC BOX =====
    let isZodiacDragging = false;
    let $zodiacDraggedItem = null;
    let $zodiacClone = null;
    let zodiacStartX = 0;
    let zodiacStartY = 0;
    let originalIndex = -1;

    // Helper: lấy số cột grid hiện tại từ CSS
    function getGridColumnCount($container) {
        try {
            const style = window.getComputedStyle($container[0]);
            const cols = style.gridTemplateColumns;
            if (!cols) return 5;
            return cols.split(' ').length || 5;
        } catch (e) {
            return 5;
        }
    }

    // Helper: lấy tất cả zodiac boxes (kể cả đang kéo)
    function getAllZodiacBoxes() {
        return $('.drag-drop-content .zodiac-box');
    }

    // Thêm sự kiện kéo thả cho box zodiac
    function addZodiacDragEvents($zodiacBox) {
        $zodiacBox.on('mousedown', function(e) {
            e.preventDefault();
            
            isZodiacDragging = true;
            $zodiacDraggedItem = $(this);
            zodiacStartX = e.clientX;
            zodiacStartY = e.clientY;
            
            // Lưu vị trí ban đầu từ tất cả boxes (kể cả chính nó)
            originalIndex = getAllZodiacBoxes().index($zodiacDraggedItem);
            
            // Tạo clone
            $zodiacClone = $zodiacDraggedItem.clone();
            const originalRect = $zodiacDraggedItem[0].getBoundingClientRect();
            
            $zodiacClone.addClass('dragging-clone').css({
                'position': 'fixed',
                'z-index': '1000',
                'width': originalRect.width + 'px',
                'height': originalRect.height + 'px',
                'opacity': '0.9',
                'pointer-events': 'none',
                'left': originalRect.left + 'px',
                'top': originalRect.top + 'px',
                'transform': 'rotate(5deg)'
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
        
        // Di chuyển clone
        $zodiacClone.css({
            'left': parseInt($zodiacClone.css('left')) + deltaX + 'px',
            'top': parseInt($zodiacClone.css('top')) + deltaY + 'px'
        });
        
        zodiacStartX = e.clientX;
        zodiacStartY = e.clientY;
    }

    function onZodiacMouseUp(e) {
        if (!isZodiacDragging || !$zodiacDraggedItem || !$zodiacClone) return;
        
        const $dragDropContent = $('.drag-drop-content');
        const contentRect = $dragDropContent[0].getBoundingClientRect();
        
        // Kiểm tra xem có trong vùng content không
        const isInContent = e.clientX >= contentRect.left && e.clientX <= contentRect.right &&
                        e.clientY >= contentRect.top && e.clientY <= contentRect.bottom;
        
        if (isInContent) {
            // Tính toán vị trí mới dựa trên tất cả boxes (kể cả item đang kéo)
            const $allBoxes = getAllZodiacBoxes();
            const cols = getGridColumnCount($dragDropContent);
            const boxWidth = contentRect.width / cols;
            
            const gridX = e.clientX - contentRect.left;
            const gridY = e.clientY - contentRect.top;
            
            const targetCol = Math.floor(gridX / boxWidth);
            const targetRow = Math.floor(gridY / boxWidth); // Sử dụng boxWidth cho cả chiều cao
            let targetIndex = targetRow * cols + targetCol;
            
            // Giới hạn targetIndex trong phạm vi hợp lệ
            targetIndex = Math.max(0, Math.min(targetIndex, $allBoxes.length - 1));
            
            // Chỉ di chuyển nếu vị trí thay đổi
            if (targetIndex !== originalIndex) {
                // Tách item ra khỏi vị trí hiện tại
                $zodiacDraggedItem.detach();
                
                // Chèn vào vị trí mới
                if (targetIndex === 0) {
                    // Chèn vào đầu
                    $dragDropContent.prepend($zodiacDraggedItem);
                } else if (targetIndex >= $allBoxes.length - 1) {
                    // Chèn vào cuối (trừ item đang kéo)
                    $dragDropContent.append($zodiacDraggedItem);
                } else {
                    // Chèn vào giữa
                    const $targetBox = getAllZodiacBoxes().eq(targetIndex);
                    if ($targetBox.length) {
                        $targetBox.before($zodiacDraggedItem);
                    } else {
                        $dragDropContent.append($zodiacDraggedItem);
                    }
                }
            }
        }
        
        // Dọn dẹp
        cleanupZodiacDrag();
    }

    function cleanupZodiacDrag() {
        // Xóa clone
        if ($zodiacClone) {
            $zodiacClone.remove();
            $zodiacClone = null;
        }
        
        // Reset styles
        if ($zodiacDraggedItem) {
            $zodiacDraggedItem.removeClass('dragging-original');
            $zodiacDraggedItem = null;
        }
        
        // Reset variables
        isZodiacDragging = false;
        originalIndex = -1;
        
        // Xóa sự kiện
        $(document).off('mousemove.zodiac');
        $(document).off('mouseup.zodiac');
    }

    // Thêm box zodiac mới
    $('.add-zodiac-btn').on('click', function() {
        const selectedZodiac = $('.zodiac-select').val();
        const zodiacEmoji = $('.zodiac-select option:selected').html();
        const zodiacNames = {
            rat: "Mouse",
            ox: "Buffalo", 
            tiger: "Tiger",
            cat: "Cat",
            dragon: "Dragon",
            snake: "Snake",
            horse: "Horse",
            goat: "Goat",
            monkey: "Monkey",
            rooster: "Rooster",
            dog: "Dog",
            pig: "Pig"
        };
        const zodiacName = zodiacNames[selectedZodiac] || selectedZodiac;

        const $zodiacBox = $(`
            <div class="zodiac-box" data-zodiac="${selectedZodiac}">
                <div class="zodiac-icon-box">
                    <div class="zodiac-emoji">${zodiacEmoji}</div>
                </div>
                <div class="zodiac-name-box">
                    <div class="zodiac-name">${zodiacName}</div>
                </div>
            </div>
        `);

        $('.drag-drop-content').append($zodiacBox);

        // Thêm sự kiện kéo thả cho box mới
        addZodiacDragEvents($zodiacBox);
    });

    // Thêm sự kiện kéo thả cho các box zodiac tồn tại
    getAllZodiacBoxes().each(function() {
        addZodiacDragEvents($(this));
    });
});