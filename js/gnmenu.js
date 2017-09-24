var menuBtn = document.getElementById('gn-menu-btn'),
    menuSlide = document.getElementById('gn-menu-slide');

menuBtn.addEventListener('mouseenter', function() {
    menuSlide.classList.add('gn-open-all');
});

menuBtn.addEventListener('click', function() {
    menuSlide.classList.add('gn-open-all');
});

menuSlide.addEventListener('mouseenter', function() {
    menuSlide.classList.add('gn-open-all');
});

menuBtn.addEventListener('mouseleave', function() {
    menuSlide.classList.remove('gn-open-all');
});

menuSlide.addEventListener('mouseleave', function() {
    menuSlide.classList.remove('gn-open-all');
});