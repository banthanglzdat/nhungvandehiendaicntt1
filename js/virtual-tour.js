function startVirtualTour() {
    // Chuyển hướng đến trang tour ảo
    window.location.href = 'virtual-tour/scene1.html';
}

// Khởi tạo các điều khiển tour ảo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem có đang ở trang tour ảo không
    if (window.location.pathname.includes('virtual-tour')) {
        initializePannellum();
    }
});

function initializePannellum() {
    pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": "../images/360/scene1.jpg",
        "autoLoad": true,
        "autoRotate": -2,
        "compass": true,
        "hotSpots": [
            {
                "pitch": -10,
                "yaw": 30,
                "type": "info",
                "text": "Cổng vào chính"
            },
            {
                "pitch": -10,
                "yaw": 120,
                "type": "scene",
                "text": "Đi đến sân trong",
                "sceneId": "scene2"
            }
        ]
    });
}
