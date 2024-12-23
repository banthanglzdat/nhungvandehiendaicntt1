// Khởi tạo AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Xử lý navbar khi cuộn
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Xử lý smooth scroll cho các liên kết
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Preloader
    $(window).on('load', function() {
        if ($('.preloader').length) {
            $('.preloader').fadeOut('slow');
        }
    });

    // Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').addClass('active');
        } else {
            $('.back-to-top').removeClass('active');
        }
    });

    // Gallery images data
    const galleryImages = [
        {
            src: 'images/gallery-1.jpg',
            title: 'Cổng vào nhà tù',
            description: 'Cổng chính dẫn vào khu nhà tù Buôn Ma Thuột'
        },
        {
            src: 'images/gallery-2.jpg',
            title: 'Khu giam giữ',
            description: 'Khu vực giam giữ tù nhân trong thời kỳ kháng chiến'
        },
        {
            src: 'images/gallery-3.jpg',
            title: 'Hiện vật lịch sử',
            description: 'Các hiện vật còn lưu giữ từ thời kỳ kháng chiến'
        },
        {
            src: 'images/gallery-4.jpg',
            title: 'Khu trưng bày',
            description: 'Khu vực trưng bày các hiện vật và hình ảnh lịch sử'
        }
    ];

    // Initialize gallery swiper
    let gallerySwiper;

    // Load gallery images
    function loadGalleryImages() {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;

        galleryImages.forEach(image => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <a href="${image.src}" data-lightbox="gallery" data-title="${image.description}">
                    <div class="gallery-item">
                        <img src="${image.src}" alt="${image.title}" class="img-fluid">
                        <div class="gallery-overlay">
                            <h4>${image.title}</h4>
                            <p>${image.description}</p>
                        </div>
                    </div>
                </a>
            `;
            swiperWrapper.appendChild(slide);
        });

        // Initialize Swiper after adding slides
        gallerySwiper = new Swiper('.gallerySwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 3,
                },
            }
        });
    }

    // Form validation and submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Basic validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'phone', 'date'];
            
            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (input && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else if (input) {
                    input.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                showNotification('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }
            
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            showNotification('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');
            this.reset();
        });
    }

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize everything when document is ready
    loadGalleryImages();
    
    // Initialize lightbox
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'showImageNumberLabel': false
        });
    }
    
    // Initialize 3D Map when DOM is loaded
    const map3dContainer = document.getElementById('map3dContainer');
    if (map3dContainer) {
        const map3d = new Map3D('map3dContainer');

        // Add control button handlers
        document.getElementById('zoomIn').addEventListener('click', () => {
            map3d.camera.position.multiplyScalar(0.9);
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            map3d.camera.position.multiplyScalar(1.1);
        });

        document.getElementById('resetView').addEventListener('click', () => {
            map3d.camera.position.set(5, 5, 5);
            map3d.camera.lookAt(0, 0, 0);
            map3d.controls.reset();
        });

        // Add click handler for hotspots
        map3dContainer.addEventListener('click', (event) => {
            map3d.handleHotspotClick(event);
        });

        // Hide loading overlay when model is loaded
        const loadingOverlay = document.getElementById('mapLoading');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 2000); // Adjust timing based on actual loading time
        }
    }
});

// Timeline Animation
const timeline = document.querySelector('.timeline-container');
if (timeline) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    const callbackFunc = () => {
        timelineItems.forEach(item => {
            if (isElementInViewport(item)) {
                item.classList.add('in-view');
            }
        });
    };
    
    window.addEventListener("load", callbackFunc);
    window.addEventListener("scroll", callbackFunc);
}

// Virtual Tour
const tourButtons = document.querySelectorAll('.tour-btn');
const tourViewer = document.querySelector('.tour-viewer iframe');

if (tourButtons && tourViewer) {
    tourButtons.forEach(button => {
        button.addEventListener('click', () => {
            const scene = button.dataset.scene;
            tourViewer.src = `virtual-tour/${scene}.html`;
            
            tourButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// Interactive Map
const map = document.getElementById('interactive-map');
const locationItems = document.querySelectorAll('.location-item');

if (map && locationItems) {
    // Initialize map
    const myMap = new google.maps.Map(map, {
        center: { lat: YOUR_LAT, lng: YOUR_LNG },
        zoom: 18,
        mapTypeId: 'satellite'
    });
    
    // Add markers and info windows
    locationItems.forEach(item => {
        item.addEventListener('click', () => {
            const location = item.dataset.location;
            // Update map view based on location
            // Add your map interaction code here
        });
    });
}

// Quiz System
const quizOptions = document.querySelectorAll('.quiz-options input');
if (quizOptions) {
    quizOptions.forEach(option => {
        option.addEventListener('change', () => {
            const answer = option.value;
            const question = option.closest('.quiz-question');
            
            // Clear previous results
            question.querySelectorAll('.quiz-options label').forEach(label => {
                label.classList.remove('correct', 'incorrect');
            });
            
            // Check answer
            if (answer === '1940') { // Correct answer
                option.parentElement.classList.add('correct');
            } else {
                option.parentElement.classList.add('incorrect');
            }
        });
    });
}

// Form Submissions
const feedbackForm = document.getElementById('feedbackForm');
const visitForm = document.getElementById('visitForm');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission code here
        alert('Cảm ơn bạn đã gửi góp ý!');
        feedbackForm.reset();
    });
}

if (visitForm) {
    visitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission code here
        alert('Đăng ký tham quan thành công!');
        visitForm.reset();
    });
}

// Story Modal
const readMoreButtons = document.querySelectorAll('.read-more');
if (readMoreButtons) {
    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const story = button.closest('.story-card');
            const title = story.querySelector('h3').textContent;
            const content = story.querySelector('p').textContent;
            
            // Create and show modal
            const modal = document.createElement('div');
            modal.className = 'story-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>${title}</h3>
                    <p>${content}</p>
                    <button class="close-modal">Đóng</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
        });
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize AOS
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Map initialization
const mapElement = document.getElementById('visit-map');
if (mapElement) {
    const map = new google.maps.Map(mapElement, {
        center: { lat: 12.6841, lng: 108.0377 }, // Tọa độ Buôn Ma Thuột
        zoom: 15,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    const marker = new google.maps.Marker({
        position: { lat: 12.6841, lng: 108.0377 },
        map: map,
        title: 'Nhà Đày Buôn Ma Thuột',
        animation: google.maps.Animation.DROP
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        
        // Reset form
        this.reset();
    });
}

// Add smooth scroll for info items
document.querySelectorAll('.info-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
});

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.info-item').forEach(item => {
    observer.observe(item);
});
