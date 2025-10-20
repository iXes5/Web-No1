// script.js — toàn bộ logic (jQuery required)
$(document).ready(function() {
    // ===== NAVBAR <-> FOOTER HOVER =====
    const $navbarMenus = $('.navbar a');
    const $footerMenus = $('.footer-menu a');

    $navbarMenus.each(function(index) {
        $(this).on('mouseover', function() {
            $footerMenus.eq(index).css({'color': '#ffdfb3','background-color': '#ff8407'});
            $(this).css('color', 'orange');
        });
        $(this).on('mouseout', function() {
            $footerMenus.eq(index).css({'color': '#ff8407','background-color': '#ffdfb3'});
            $(this).css('color', '#003366');
        });
    });

    $footerMenus.each(function(index) {
        $(this).on('mouseover', function() {
            $navbarMenus.eq(index).css('color', 'orange');
            $(this).css({'color': '#ffdfb3','background-color': '#ff8407'});
        });
        $(this).on('mouseout', function() {
            $navbarMenus.eq(index).css('color', '#003366');
            $(this).css({'color': '#ff8407','background-color': '#ffdfb3'});
        });
    });

    // ===== ASIDE: TOGGLE CONTENT =====
    $(document).on('click', '.aside-box .toggle-btn', function(e) {
        e.stopPropagation();
        const $box = $(this).closest('.aside-box');
        $box.toggleClass('closed');
        $(this).text($box.hasClass('closed') ? '►' : '↓');
    });

    // ===== ASIDE: DRAG TO REORDER (vertical drag by move-btn) =====
    let isDraggingAside = false;
    let $asideDragged = null;
    let $asideClone = null;
    let asideStartY = 0;
    let asideStartTop = 0;

    $(document).on('mousedown', '.aside-box .move-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        isDraggingAside = true;
        $asideDragged = $(this).closest('.aside-box');
        asideStartY = e.clientY;
        asideStartTop = $asideDragged.offset().top;

        const $aside = $('.aside');
        const asideOffset = $aside.offset();
        const asideLeft = asideOffset.left;
        const asideWidth = $aside.width();

        $asideClone = $asideDragged.clone();
        $asideClone.addClass('dragging-clone').css({
            position: 'absolute',
            zIndex: 2000,
            width: asideWidth + 'px',
            opacity: 0.9,
            pointerEvents: 'none',
            left: asideLeft + 'px',
            top: asideStartTop + 'px',
            margin: 0,
            boxSizing: 'border-box'
        });

        $asideDragged.addClass('dragging-original').css('opacity', '0.3');
        $('body').append($asideClone);

        $(document).on('mousemove.aside', onAsideMouseMove);
        $(document).on('mouseup.aside', onAsideMouseUp);
    });

    function onAsideMouseMove(e) {
        if (!isDraggingAside || !$asideClone) return;
        const deltaY = e.clientY - asideStartY;
        const newTop = asideStartTop + deltaY;

        const $aside = $('.aside');
        const asideTop = $aside.offset().top;
        const asideHeight = $aside.outerHeight();
        const cloneHeight = $asideClone.outerHeight();

        const minTop = asideTop;
        const maxTop = asideTop + asideHeight - cloneHeight;
        const boundedTop = Math.min(Math.max(newTop, minTop), maxTop);

        $asideClone.css('top', boundedTop + 'px');
    }

    function onAsideMouseUp() {
        if (!isDraggingAside || !$asideDragged || !$asideClone) return;
        const finalTop = $asideClone.offset().top;
        const cloneHeight = $asideClone.outerHeight();
        const finalCenter = finalTop + cloneHeight / 2;

        const $aside = $('.aside');
        const $otherBoxes = $aside.find('.aside-box').not($asideDragged);
        let inserted = false;

        $otherBoxes.each(function() {
            const $box = $(this);
            const boxTop = $box.offset().top;
            const boxHeight = $box.outerHeight();
            const boxMiddle = boxTop + boxHeight / 2;
            if (finalCenter < boxMiddle) {
                $box.before($asideDragged);
                inserted = true;
                return false;
            }
        });

        if (!inserted) $aside.append($asideDragged);

        $asideClone.remove();
        $asideDragged.removeClass('dragging-original').css('opacity', '');
        isDraggingAside = false;
        $asideDragged = null;
        $asideClone = null;
        $(document).off('mousemove.aside');
        $(document).off('mouseup.aside');
    }

    // ===== TEXT DECORATION (sample box, color pickers, options) =====
    let currentTextColor = '#333333';
    let currentBgColor = '#ffffff';
    let currentFontWeight = 'normal';
    let currentFontStyle = 'normal';
    let currentTextDecoration = 'none';

    $(document).on('click', '.decorate-icon', function(e) {
        e.stopPropagation();
        const $decorateBox = $(this).closest('.decorate-box');
        const $options = $decorateBox.find('.decorate-options');
        $('.decorate-box').not($decorateBox).removeClass('show-options');
        $('.decorate-options').not($options).hide();
        $options.toggle();
        $decorateBox.toggleClass('show-options', $options.is(':visible'));
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.decorate-box').length) {
            $('.decorate-options').hide();
            $('.decorate-box').removeClass('show-options');
        }
    });

    function updateSampleTextStyle() {
        const $box = $('.decorate-box');
        const $sample = $box.find('.sample-text');
        $sample.css({
            'font-weight': currentFontWeight,
            'font-style': currentFontStyle,
            'text-decoration': currentTextDecoration,
            'background-color': currentBgColor,
            'color': currentTextColor
        });
    }

    $(document).on('input change', '.text-color-picker', function() {
        currentTextColor = $(this).val();
        updateSampleTextStyle();
    });
    $(document).on('input change', '.bg-color-picker', function() {
        currentBgColor = $(this).val();
        updateSampleTextStyle();
    });
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

    // ===== TEXT PROCESSING (highlight, delete, reset) =====
    const originalContent = $('.process-text-content').html();

    $('.highlight-btn').on('click', function() {
        const regexText = $('.regex-box').val();
        if (!regexText) { console.log('Vui lòng nhập regex!'); return; }
        try {
            const regex = new RegExp(regexText, 'g');
            const $content = $('.process-text-content');
            let content = $content.html();
            content = content.replace(/<span class="highlighted"[^>]*>(.*?)<\/span>/gi, '$1');
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
        if (!regexText) { console.log('Vui lòng nhập regex!'); return; }
        try {
            const regex = new RegExp(regexText, 'g');
            const $content = $('.process-text-content');
            let content = $content.html();

            // Remove highlighted and plain matches
            const escapedRegexText = regexText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            content = content.replace(new RegExp(`<span class="highlighted"[^>]*>(${escapedRegexText})<\/span>`, 'g'), '');
            content = content.replace(regex, '');
            $content.html(content);
        } catch (e) {
            console.log('Regex không hợp lệ! Vui lòng kiểm tra lại.');
        }
    });

    $('.reset-btn').on('click', function() {
        $('.process-text-content').html(originalContent);
        $('.regex-box').val('');
        currentTextColor = '#333333';
        currentBgColor = '#ffffff';
        currentFontWeight = 'normal';
        currentFontStyle = 'normal';
        currentTextDecoration = 'none';
        $('.bold-option, .italic-option, .underline-option').prop('checked', false);
        $('.text-color-picker').val('#333333');
        $('.bg-color-picker').val('#ffffff');
        updateSampleTextStyle();
    });

    // ===== DRAG & DROP ZODIAC (clone as visible item + placeholder) =====
    let isZodiacDragging = false;
    let $zodiacDraggedItem = null;
    let $zodiacClone = null;
    let $zodiacPlaceholder = null;
    let startOffsetX = 0;
    let startOffsetY = 0;
    let originalZodiacIndex = -1;

    // Helpers
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
    function getAllZodiacBoxes() {
        return $('.drag-drop-content .zodiac-box');
    }

    // Start dragging (delegate)
    $(document).on('mousedown', '.zodiac-box', function(e) {
        // only start drag on left mouse button
        if (e.which !== 1) return;
        e.preventDefault();

        $zodiacDraggedItem = $(this);
        originalZodiacIndex = getAllZodiacBoxes().index($zodiacDraggedItem);

        const rect = $zodiacDraggedItem[0].getBoundingClientRect();

        // Create visible clone that follows cursor
        $zodiacClone = $zodiacDraggedItem.clone()
            .addClass('zodiac-clone')
            .css({
                position: 'fixed',
                top: rect.top + 'px',
                left: rect.left + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px',
                zIndex: 9999,
                pointerEvents: 'none',
                boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                borderRadius: '10px',
                transform: 'scale(1.03)',
                transition: 'transform 0.08s ease'
            });
        $('body').append($zodiacClone);

        // Placeholder where item was (dashed border)
        $zodiacPlaceholder = $('<div class="zodiac-placeholder"></div>').css({
            width: rect.width + 'px',
            height: rect.height + 'px'
        });
        $zodiacDraggedItem.after($zodiacPlaceholder);

        // Remove the real item from layout (detach) so the placeholder occupies its place
        $zodiacDraggedItem.detach();

        startOffsetX = e.clientX - rect.left;
        startOffsetY = e.clientY - rect.top;

        isZodiacDragging = true;

        $(document).on('mousemove.zodiac', onZodiacMouseMove);
        $(document).on('mouseup.zodiac', onZodiacMouseUp);
    });

    function onZodiacMouseMove(e) {
        if (!isZodiacDragging || !$zodiacClone) return;

        const x = e.clientX - startOffsetX;
        const y = e.clientY - startOffsetY;

        // move clone
        $zodiacClone.css({ left: x + 'px', top: y + 'px' });

        // calculate target placeholder position
        const $dragDropContent = $('.drag-drop-content');
        const contentRect = $dragDropContent[0].getBoundingClientRect();
        const $allBoxes = getAllZodiacBoxes().not($zodiacPlaceholder);
        const cols = getGridColumnCount($dragDropContent);
        const boxWidth = contentRect.width / cols;
        const firstBox = $allBoxes.first()[0];
        const boxHeight = firstBox ? firstBox.getBoundingClientRect().height + 8 : boxWidth;

        const gridX = e.clientX - contentRect.left;
        const gridY = e.clientY - contentRect.top;

        let targetCol = Math.floor(gridX / boxWidth);
        let targetRow = Math.floor(gridY / boxHeight);

        if (targetCol < 0) targetCol = 0;
        if (targetRow < 0) targetRow = 0;

        let targetIndex = targetRow * cols + targetCol;
        targetIndex = Math.max(0, Math.min(targetIndex, $allBoxes.length));

        // If placeholder isn't already at targetIndex, move it
        const currentIndex = $zodiacPlaceholder.index();
        if (targetIndex !== currentIndex) {
            if (targetIndex >= $allBoxes.length) {
                $dragDropContent.append($zodiacPlaceholder);
            } else {
                $allBoxes.eq(targetIndex).before($zodiacPlaceholder);
            }
        }
    }

    function onZodiacMouseUp(e) {
        if (!isZodiacDragging) return;

        // If mouse up is inside drag area and we have a placeholder -> insert before placeholder
        if ($zodiacPlaceholder && $zodiacPlaceholder.length) {
            $zodiacPlaceholder.before($zodiacDraggedItem);
            $zodiacPlaceholder.remove();
        } else {
            // if no placeholder found (edge case), append to container
            $('.drag-drop-content').append($zodiacDraggedItem);
        }

        // remove clone
        if ($zodiacClone) $zodiacClone.remove();

        // cleanup
        isZodiacDragging = false;
        $zodiacClone = null;
        $zodiacDraggedItem = null;
        $zodiacPlaceholder = null;
        $(document).off('mousemove.zodiac', onZodiacMouseMove);
        $(document).off('mouseup.zodiac', onZodiacMouseUp);
    }

    // ===== ADD NEW ZODIAC BOX =====
    $('.add-zodiac-btn').on('click', function() {
        const selectedZodiac = $('.zodiac-select').val();
        const zodiacEmoji = $('.zodiac-select option:selected').html();
        const zodiacNames = {
            rat: "Mouse", ox: "Buffalo", tiger: "Tiger", cat: "Cat",
            dragon: "Dragon", snake: "Snake", horse: "Horse", goat: "Goat",
            monkey: "Monkey", rooster: "Rooster", dog: "Dog", pig: "Pig"
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
        // No extra binding required because we use delegated mousedown on '.zodiac-box'
    });

    // ensure existing boxes are draggable (delegated handler covers them)

    // ===== SAFETY: cancel drag if user presses Escape =====
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && isZodiacDragging) {
            // return item to original place
            if ($zodiacClone) $zodiacClone.remove();
            if ($zodiacPlaceholder && $zodiacPlaceholder.length) {
                $zodiacPlaceholder.before($zodiacDraggedItem);
                $zodiacPlaceholder.remove();
            } else {
                $('.drag-drop-content').append($zodiacDraggedItem);
            }
            isZodiacDragging = false;
            $zodiacClone = null;
            $zodiacDraggedItem = null;
            $zodiacPlaceholder = null;
            $(document).off('mousemove.zodiac', onZodiacMouseMove);
            $(document).off('mouseup.zodiac', onZodiacMouseUp);
        }
    });
}); // end document.ready

// ===== RESPONSIVE SUPPORT =====
function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 576;
    
    if (isMobile) {
        // Tạm thời vô hiệu hóa drag & drop trên mobile để tránh xung đột với touch events
        $('.zodiac-box').css('cursor', 'default');
        $('.move-btn').css('cursor', 'default');
    } else {
        // Khôi phục lại trên desktop
        $('.zodiac-box').css('cursor', 'pointer');
        $('.move-btn').css('cursor', 'ns-resize');
    }
}

// Gọi hàm khi load và resize
$(window).on('load resize', handleResponsiveLayout);