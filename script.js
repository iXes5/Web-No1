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
