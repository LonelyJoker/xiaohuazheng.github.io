var menuBtn = document.getElementById('nav-menu-btn'),
    menuSlide = document.getElementById('nav-menu-slide');
menuBtn.addEventListener('mouseenter', function() {
    menuSlide.classList.add('nav-open-all');
});
menuBtn.addEventListener('click', function() {
    menuSlide.classList.add('nav-open-all');
});
menuSlide.addEventListener('mouseenter', function() {
    menuSlide.classList.add('nav-open-all');
});
menuBtn.addEventListener('mouseleave', function() {
    menuSlide.classList.remove('nav-open-all');
});
menuSlide.addEventListener('mouseleave', function() {
    menuSlide.classList.remove('nav-open-all');
});