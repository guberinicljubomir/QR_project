// carousel.js - ZAJEDNIČKI JAVASCRIPT ZA SVE STRANICE

class Carousel {
    constructor(containerId, images, captions = []) {
        this.container = document.getElementById(containerId);
        this.slides = [];
        this.currentSlide = 0;
        this.totalSlides = 3; // Uvijek 3 slike
        this.autoSlideInterval = null;
        
        // Inicijalizacija
        this.init();
    }
    
    init() {
        // Kreiraj slajdove ako ne postoje
        this.createSlides();
        
        // Kreiraj indikatore
        this.createIndicators();
        
        // Dodaj event listeners
        this.addEventListeners();
        
        // Pokreni automatski slider
        this.startAutoSlide();
        
        // Ažuriraj prikaz
        this.updateCarousel();
    }
    
    createSlides() {
        const slidesContainer = this.container.querySelector('.carousel-slides');
        const existingSlides = slidesContainer.querySelectorAll('.carousel-slide');
        
        // Ako već postoje slajdovi, samo ih uzmi
        if (existingSlides.length > 0) {
            this.slides = Array.from(existingSlides);
            this.totalSlides = this.slides.length;
            return;
        }
        
        // Kreiraj 3 slajda
        for (let i = 0; i < this.totalSlides; i++) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <div class="slide-bg" id="slide${i + 1}"></div>
                <div class="slide-fallback" id="fallback${i + 1}" style="display: none;">
                    <div>
                        <i class="fas fa-image"></i><br>
                        Slika ${i + 1}
                    </div>
                </div>
            `;
            slidesContainer.appendChild(slide);
            this.slides.push(slide);
        }
    }
    
    createIndicators() {
        const indicatorsContainer = this.container.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === this.currentSlide) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    addEventListeners() {
        // Prev/next dugmad
        const prevBtn = this.container.querySelector('.carousel-btn.prev');
        const nextBtn = this.container.querySelector('.carousel-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Pause auto slide on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Touch events za mobilne
        let startX = 0;
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoSlide();
        });
        
        this.container.addEventListener('touchend', (e) => {
            if (!startX) return;
            
            const endX = e.changedTouches[0].clientX;
            const threshold = 50;
            
            if (startX - endX > threshold) {
                this.nextSlide();
            } else if (endX - startX > threshold) {
                this.prevSlide();
            }
            
            this.startAutoSlide();
            startX = 0;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT') return;
            
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    updateCarousel() {
        const slidesContainer = this.container.querySelector('.carousel-slides');
        slidesContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Ažuriraj indikatore
        const indicators = this.container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Ažuriraj image info
        const imageInfo = document.getElementById('imageInfo');
        if (imageInfo) {
            imageInfo.textContent = `Slika ${this.currentSlide + 1}/${this.totalSlides}`;
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateCarousel();
        }
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Menja svakih 5 sekundi
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Inicijalizacija karusela kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    // Proveri da li postoji karusel na ovoj stranici
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        // Kreiraj karusel instancu
        window.carousel = new Carousel('carouselContainer');
        
        // Proveri da li se slike učitalo
        setTimeout(() => {
            for (let i = 1; i <= 3; i++) {
                const fallback = document.getElementById(`fallback${i}`);
                const slideBg = document.getElementById(`slide${i}`);
                
                if (slideBg && slideBg.style.backgroundImage) {
                    const img = new Image();
                    img.src = slideBg.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                    
                    img.onerror = function() {
                        if (fallback) {
                            slideBg.style.display = 'none';
                            fallback.style.display = 'flex';
                        }
                    };
                }
            }
        }, 1000);
    }
});