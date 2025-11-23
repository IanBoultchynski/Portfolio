document.addEventListener('DOMContentLoaded', () => {

//navigation rouge lu
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a');
    const header = document.querySelector('header');

    const updateActiveLink = () => {
        let currentSectionId = '';
        const headerHeight = header.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; 
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.hash === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const headerHeight = header.offsetHeight;
            const offsetTop = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });


 //les filtre
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const techTags = card.querySelector('.project-tech-tags').innerText;
                
                if (filterValue === 'all' || techTags.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });


//Light
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentGallery = [];
    let currentIndex = 0;
    let isGallery = false;

    const openLightbox = () => {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        if (!lightboxVideo.paused) {
            lightboxVideo.pause();
        }
        lightboxVideo.src = ""; 
        document.body.style.overflow = 'auto'; 
    };

    const updateGalleryImage = () => {
        lightboxImg.src = currentGallery[currentIndex].trim();
    };

    // Gestionnaires d'événements
    const triggers = document.querySelectorAll('.lightbox-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();

            const type = trigger.getAttribute('data-type');
            const caption = trigger.getAttribute('data-caption');
            captionText.innerText = caption || '';

            if (type === 'image') {
                isGallery = false;
                lightboxImg.style.display = 'block';
                lightboxVideo.style.display = 'none';
                prevBtn.classList.add('hidden');
                nextBtn.classList.add('hidden');
                
                lightboxImg.src = trigger.getAttribute('data-src');
                openLightbox();

            } else if (type === 'video') {
                isGallery = false;
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                prevBtn.classList.add('hidden');
                nextBtn.classList.add('hidden');

                lightboxVideo.src = trigger.getAttribute('data-src');
                openLightbox();

            } else if (type === 'gallery') {
                isGallery = true;
                currentGallery = trigger.getAttribute('data-gallery').split(',');
                currentIndex = 0;

                lightboxImg.style.display = 'block';
                lightboxVideo.style.display = 'none';
                prevBtn.classList.remove('hidden');
                nextBtn.classList.remove('hidden');

                updateGalleryImage();
                openLightbox();
            }
        });
    });

    // Navigation Galerie
    prevBtn.addEventListener('click', () => {
        if (isGallery) {
            currentIndex = (currentIndex === 0) ? currentGallery.length - 1 : currentIndex - 1;
            updateGalleryImage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (isGallery) {
            currentIndex = (currentIndex === currentGallery.length - 1) ? 0 : currentIndex + 1;
            updateGalleryImage();
        }
    });

    // Fermeture
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        if (lightbox.classList.contains('active') && isGallery) {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });


//ajax
    const form = document.getElementById("contactForm");

    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById("form-status");
        const data = new FormData(event.target);
        
        const button = event.target.querySelector("button[type='submit']");
        const originalButtonText = button.innerText;

        button.disabled = true;
        button.innerText = "Envoi en cours...";
        button.style.cursor = "wait";

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "Merci ! Votre message a été envoyé.";
                status.style.color = "#28a745";
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Oups ! Il y a eu un problème.";
                        status.style.color = "#dc3545";
                    }
                })
            }
        }).catch(error => {
            status.innerHTML = "Oups ! Il y a eu un problème lors de l'envoi.";
            status.style.color = "#dc3545";
        }).finally(() => {
            button.disabled = false;
            button.innerText = originalButtonText;
            button.style.cursor = "pointer";
        });
    }

    form.addEventListener("submit", handleSubmit);

});


window.addEventListener('load', () => {
    const scrollContainer = document.querySelector('.image-scroll');
    
    if (scrollContainer) {
        scrollContainer.innerHTML += scrollContainer.innerHTML;
        scrollContainer.innerHTML += scrollContainer.innerHTML; 

        let scrollPos = 0; 
        const vitesse = 1.0; 
        let animationFrameId;

        function autoScroll() {
            scrollPos += vitesse;

            // Calcul précis de la largeur d'un set d'images
            const originalChildrenCount = scrollContainer.children.length / 4; 
            let originalSetWidth = 0;
            
            for (let i = 0; i < originalChildrenCount; i++) {
                originalSetWidth += scrollContainer.children[i].offsetWidth;
                if (i < originalChildrenCount - 1) { 
                    originalSetWidth += parseFloat(getComputedStyle(scrollContainer).gap || '0');
                }
            }

            if (scrollPos >= originalSetWidth) {
                scrollPos = 0; 
            }

            scrollContainer.scrollLeft = scrollPos;
            animationFrameId = requestAnimationFrame(autoScroll);
        }

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        autoScroll(); 
    }
});


//headerr

const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('nav ul');
    const navLinksMobile = document.querySelectorAll('nav ul li a');

    // Ouvrir / Fermer le menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('mobile-visible');
            menuToggle.classList.toggle('is-active');
        });
    }

    // Fermer le menu quand on clique sur un lien
    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('mobile-visible')) {
                navList.classList.remove('mobile-visible');
                menuToggle.classList.remove('is-active');
            }
        });
    });