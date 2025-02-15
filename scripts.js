document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (!this.classList.contains('auth-link')) { 
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            alert(`Thank you for your message, ${name}! We will get back to you soon.`);
            this.reset();
        });
    }

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    function initMap() {
        const location = { lat: 37.4275, lng: -122.1697 };
        const mapElement = document.getElementById('map-container');
        
        if (mapElement) {
            const map = new google.maps.Map(mapElement, {
                zoom: 15,
                center: location,
                styles: [
                    {
                        featureType: "all",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#003366" }]
                    }
                ]
            });
            
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: 'Excellence Academy'
            });
        }
    }

    if (typeof google !== 'undefined') {
        initMap();
    } else {
        console.error('Google Maps API not loaded');
    }
});