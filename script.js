// Variables globals
let slideIndex = 1;
const slides = document.getElementsByClassName("slide");
const totalSlides = slides.length;

// Inicialització
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("totalSlides").textContent = totalSlides;
    showSlide(slideIndex);
    
    // Afegir event listeners per als botons
    document.getElementById("prevBtn").addEventListener('click', function() {
        changeSlide(-1);
    });
    
    document.getElementById("nextBtn").addEventListener('click', function() {
        changeSlide(1);
    });
});

// Funció per mostrar una diapositiva
function showSlide(n) {
    // Control de límits
    if (n > totalSlides) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = totalSlides;
    }
    
    // Amagar totes les diapositives
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    // Mostrar la diapositiva actual
    slides[slideIndex - 1].classList.add("active");
    
    // Actualitzar comptador
    document.getElementById("currentSlide").textContent = slideIndex;
    
    // Actualitzar estat dels botons
    document.getElementById("prevBtn").disabled = slideIndex === 1;
    document.getElementById("nextBtn").disabled = slideIndex === totalSlides;
    
    // Scroll al principi de la diapositiva
    slides[slideIndex - 1].scrollTop = 0;
}

// Funció per canviar de diapositiva
function changeSlide(n) {
    showSlide(slideIndex += n);
}

// Navegació amb teclat
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case "ArrowLeft":
        case "ArrowUp":
            event.preventDefault();
            changeSlide(-1);
            break;
        case "ArrowRight":
        case "ArrowDown":
            event.preventDefault();
            changeSlide(1);
            break;
        case "Home":
            event.preventDefault();
            slideIndex = 1;
            showSlide(slideIndex);
            break;
        case "End":
            event.preventDefault();
            slideIndex = totalSlides;
            showSlide(slideIndex);
            break;
    }
});

// Suport per a gestos tàctils (mòbils i tauletes)
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const horizontalSwipe = touchEndX - touchStartX;
    const verticalSwipe = touchEndY - touchStartY;
    
    // Només processar si el moviment horitzontal és més gran que el vertical
    if (Math.abs(horizontalSwipe) > Math.abs(verticalSwipe)) {
        if (horizontalSwipe > swipeThreshold) {
            // Swipe dret -> anterior
            changeSlide(-1);
        } else if (horizontalSwipe < -swipeThreshold) {
            // Swipe esquerra -> següent
            changeSlide(1);
        }
    }
}

// Funció per anar a una diapositiva específica (útil per a futurs desenvolupaments)
function goToSlide(n) {
    if (n >= 1 && n <= totalSlides) {
        slideIndex = n;
        showSlide(slideIndex);
    }
}

// Funció per obtenir la diapositiva actual
function getCurrentSlide() {
    return slideIndex;
}

// Funció per obtenir el nombre total de diapositives
function getTotalSlides() {
    return totalSlides;
}

// Funció per reiniciar la presentació
function resetPresentation() {
    slideIndex = 1;
    showSlide(slideIndex);
}

// Funció per mostrar el resum de diapositives (útil per a futurs desenvolupaments)
function showSlideOverview() {
    const overview = [];
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const title = slide.querySelector('h1, h2');
        if (title) {
            overview.push({
                number: i + 1,
                title: title.textContent.trim()
            });
        }
    }
    console.table(overview);
    return overview;
}

// Funció per exportar l'estructura de la presentació
function exportStructure() {
    const structure = {
        totalSlides: totalSlides,
        currentSlide: slideIndex,
        slides: []
    };
    
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const title = slide.querySelector('h1, h2');
        structure.slides.push({
            number: i + 1,
            title: title ? title.textContent.trim() : 'Sense títol',
            isActive: slide.classList.contains('active')
        });
    }
    
    return JSON.stringify(structure, null, 2);
}

// Funció per cercar contingut en les diapositives
function searchInSlides(searchTerm) {
    const results = [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const text = slide.textContent.toLowerCase();
        
        if (text.includes(lowerSearchTerm)) {
            const title = slide.querySelector('h1, h2');
            results.push({
                slideNumber: i + 1,
                title: title ? title.textContent.trim() : 'Sense títol',
                match: true
            });
        }
    }
    
    console.log(`S'han trobat ${results.length} coincidències per "${searchTerm}":`);
    console.table(results);
    return results;
}

// Funció per navegar a la primera coincidència
function goToFirstMatch(searchTerm) {
    const results = searchInSlides(searchTerm);
    if (results.length > 0) {
        goToSlide(results[0].slideNumber);
    } else {
        alert(`No s'han trobat coincidències per "${searchTerm}"`);
    }
}

// Funció per mostrar ajuda
function showHelp() {
    const help = `
Comandes de navegació:
- Fletxa esquerra/dreta: Canviar diapositiva
- Fletxa amunt/avall: Canviar diapositiva
- Home: Anar a la primera diapositiva
- End: Anar a l'última diapositiva
- Swipe (mòbil): Lliscar esquerra/dreta

Funcions disponibles a la consola:
- goToSlide(n): Anar a la diapositiva n
- getCurrentSlide(): Obtenir diapositiva actual
- getTotalSlides(): Obtenir total de diapositives
- resetPresentation(): Reiniciar presentació
- showSlideOverview(): Mostrar resum de diapositives
- exportStructure(): Exportar estructura JSON
- searchInSlides(term): Cercar contingut
- goToFirstMatch(term): Anar a primera coincidència
- showHelp(): Mostrar aquesta ajuda
    `;
    console.log(help);
    alert(help);
}

// Funció per animar transicions suaus
function smoothTransition(callback) {
    const currentSlide = slides[slideIndex - 1];
    currentSlide.style.transition = 'opacity 0.3s';
    currentSlide.style.opacity = '0';
    
    setTimeout(() => {
        callback();
        currentSlide.style.opacity = '1';
    }, 300);
}

// Funció per mode presentació (pantalla completa)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error intentant activar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Afegir funcions a l'objecte window per accés global
window.goToSlide = goToSlide;
window.getCurrentSlide = getCurrentSlide;
window.getTotalSlides = getTotalSlides;
window.resetPresentation = resetPresentation;
window.showSlideOverview = showSlideOverview;
window.exportStructure = exportStructure;
window.searchInSlides = searchInSlides;
window.goToFirstMatch = goToFirstMatch;
window.showHelp = showHelp;
window.toggleFullscreen = toggleFullscreen;

// Auto-guardar estat a localStorage
function saveState() {
    localStorage.setItem('currentSlide', slideIndex);
}

function loadState() {
    const savedSlide = localStorage.getItem('currentSlide');
    if (savedSlide) {
        slideIndex = parseInt(savedSlide);
        showSlide(slideIndex);
    }
}

// Guardar estat cada vegada que es canvia de diapositiva
const originalChangeSlide = changeSlide;
window.changeSlide = function(n) {
    originalChangeSlide(n);
    saveState();
};

// Carregar estat al iniciar
window.addEventListener('load', function() {
    loadState();
});

// Preventir comportament per defecte en algunes tecles
document.addEventListener('keydown', function(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
    }
});

// Funció per mode nocturn (futur desenvolupament)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Carregar preferència de mode nocturn
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Funció per mostrar informació de la presentació
function showPresentationInfo() {
    const info = `
Informació de la Presentació:
- Títol: Fisiologia i Ball
- Total de diapositives: ${totalSlides}
- Diapositiva actual: ${slideIndex}
- Progrés: ${Math.round((slideIndex / totalSlides) * 100)}%
    `;
    alert(info);
}

window.showPresentationInfo = showPresentationInfo;

// Exportar totes les funcions per a ús extern
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        goToSlide,
        getCurrentSlide,
        getTotalSlides,
        resetPresentation,
        showSlideOverview,
        exportStructure,
        searchInSlides,
        goToFirstMatch,
        showHelp,
        toggleFullscreen,
        toggleDarkMode,
        showPresentationInfo
    };
}
