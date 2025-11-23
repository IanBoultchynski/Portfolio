const scrollContainer = document.querySelector('.image-scroll');


scrollContainer.innerHTML += scrollContainer.innerHTML;
scrollContainer.innerHTML += scrollContainer.innerHTML; // Duplique une troisième fois pour plus de sûreté

let scrollPos = 0; 
const vitesse = 1.1; 

let animationFrameId;

function autoScroll() {
    scrollPos += vitesse;


    const originalChildrenCount = scrollContainer.children.length / 4; // Si on a dupliqué 3 fois
    let originalSetWidth = 0;
    for (let i = 0; i < originalChildrenCount; i++) {
        originalSetWidth += scrollContainer.children[i].offsetWidth;
        if (i < originalChildrenCount - 1) { // Ajoute le gap
            originalSetWidth += parseFloat(getComputedStyle(scrollContainer).gap || '0');
        }
    }

    if (scrollPos >= originalSetWidth) {
        scrollPos = 0; // Réinitialise à la position 0 du début du premier jeu dupliqué
    }

    scrollContainer.scrollLeft = scrollPos;
    animationFrameId = requestAnimationFrame(autoScroll);
}

// Pour s'assurer que l'autoScroll démarre après que le DOM soit complètement chargé et stylé.
window.addEventListener('load', () => {
    // Annule tout autoScroll précédent au cas où (rechargement partiel, etc.)
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    autoScroll(); // Démarre l'animation
});


document.addEventListener('DOMContentLoaded', () => {

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a');


    const updateActiveLink = () => {
        let currentSectionId = '';
        const headerHeight = document.querySelector('header').offsetHeight; // Obtient la hauteur du header dynamiquement

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 1; // Décalage basé sur la hauteur dynamique du header
            // -1 pour s'assurer que le changement de section est lisse
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

    updateActiveLink(); 
    window.addEventListener('scroll', updateActiveLink);

    // Smooth scrolling pour les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const offsetTop = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });

});


var form = document.getElementById("contactForm");

async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("form-status");
    var data = new FormData(event.target);
    
    // 1. On cible le bouton et on sauvegarde son texte original
    var button = event.target.querySelector("button[type='submit']");
    var originalButtonText = button.innerText;

    // 2. On désactive le bouton et on change le texte
    button.disabled = true;
    button.innerText = "Envoi en cours...";
    button.style.cursor = "wait"; // Change le curseur pour indiquer l'attente

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Merci ! Votre message a été envoyé.";
            status.style.color = "green";
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oups ! Il y a eu un problème.";
                    status.style.color = "red";
                }
            })
        }
    }).catch(error => {
        status.innerHTML = "Oups ! Il y a eu un problème lors de l'envoi.";
        status.style.color = "red";
    }).finally(() => {
    
        button.disabled = false;
        button.innerText = originalButtonText;
        button.style.cursor = "pointer";
    });
}

form.addEventListener("submit", handleSubmit);



// --- FILTRE PAR TECHNOLOGIE (SMART MATCH) ---
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Gestion du style "Active"
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // 2. Récupère la techno qu'on veut filtrer (ex: "PHP")
        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            // On récupère juste le texte des badges de cette carte
            const techTags = card.querySelector('.project-tech-tags').innerText;

            // Si c'est "all" OU si les badges contiennent le mot clé (ex: PHP)
            if (filterValue === 'all' || techTags.includes(filterValue)) {
                card.style.display = 'flex';
                // Petite animation pour que ce soit fluide
                card.style.opacity = '0';
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.style.display = 'none';
            }
        });
    });
});