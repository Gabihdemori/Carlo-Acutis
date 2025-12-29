// script.js - Funcionalidades COMPLETAS para o site Geração Carlo Acutis

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Site Geração Carlo Acutis carregado!');
    
    // ========== MENU RESPONSIVO ==========
    setupResponsiveMenu();
    
    // ========== ANIMAÇÕES AO ROLAR ==========
    setupScrollAnimations();
    
    // ========== MENU ATIVO AO ROLAR ==========
    setupActiveMenuHighlight();
    
    // ========== DESTAQUE PRÓXIMO ENCONTRO ==========
    highlightNextMeeting();
    
    // ========== GALERIA DE IMAGENS COM MODAL ==========
    setupGalleryModal();
    
    // ========== EFEITOS HOVER INTERATIVOS ==========
    setupHoverEffects();
    
    // ========== ATUALIZAÇÃO AUTOMÁTICA DE DATA ==========
    updateDynamicDates();
    
    // ========== FORMULÁRIO DE CONTATO ==========
    setupContactForm();
    
    // ========== BOTÃO VOLTAR AO TOPO ==========
    setupBackToTop();
    
    // ========== CARREGAMENTO DE IMAGENS OTIMIZADO ==========
    setupImageLoading();
});

// ========== FUNÇÕES PRINCIPAIS ==========

/**
 * Configura o menu responsivo para mobile/desktop
 */
function setupResponsiveMenu() {
    // Menu desktop
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Menu mobile (se existir)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileMenu);
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    function closeMobileMenu() {
        if (mobileNav) mobileNav.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Configura animações ao rolar a página
 */
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animações específicas por tipo de elemento
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animationDelay = `${entry.target.dataset.delay || '0'}ms`;
                }
                
                // Parar de observar após animação
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const animatables = document.querySelectorAll(
        '.event-card, .mission-card, .spirituality-card, ' +
        '.gallery-item, .contact-card, .timeline-item, ' +
        '.carlo-card, .meeting-card, .upcoming-card, ' +
        '.quote-card, .about-content, .hero-content > *'
    );
    
    animatables.forEach((el, index) => {
        if (el.classList.contains('timeline-item')) {
            el.dataset.delay = index * 100;
        }
        observer.observe(el);
    });
}

/**
 * Destaca o item do menu ativo conforme a rolagem
 */
function setupActiveMenuHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    // Função para atualizar menu ativo
    function updateActiveMenu() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Atualizar links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes('#')) {
                const targetId = href.split('#')[1];
                if (targetId === current) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    // Atualizar no scroll
    window.addEventListener('scroll', throttle(updateActiveMenu, 100));
    
    // Atualizar inicialmente
    updateActiveMenu();
}

/**
 * Destaca automaticamente o próximo encontro
 */
function highlightNextMeeting() {
    const meetingCards = document.querySelectorAll('.meeting-card');
    if (meetingCards.length === 0) return;
    
    // Encontrar o próximo encontro baseado na data/hora
    let nextMeetingIndex = 0;
    const now = new Date();
    
    meetingCards.forEach((card, index) => {
        // Remover destaques anteriores
        card.classList.remove('featured', 'highlighted');
        
        // Remover badge "Próximo" antigo
        const oldBadge = card.querySelector('.meeting-badge, .highlight-badge');
        if (oldBadge) oldBadge.remove();
        
        // Lógica simplificada: primeiro card é o próximo
        if (index === 0) {
            nextMeetingIndex = 0;
        }
    });
    
    // Aplicar destaque
    const nextCard = meetingCards[nextMeetingIndex];
    if (nextCard) {
        nextCard.classList.add('featured', 'highlighted');
        
        // Adicionar badge "Próximo"
        const header = nextCard.querySelector('.meeting-header');
        if (header) {
            const badge = document.createElement('div');
            badge.className = 'meeting-badge';
            badge.innerHTML = '<i class="fas fa-star"></i> Próximo';
            header.appendChild(badge);
        }
        
        // Rolagem suave para o próximo encontro (opcional)
        const heroButton = document.querySelector('.hero .btn-primary');
        if (heroButton) {
            heroButton.addEventListener('click', (e) => {
                if (!e.target.hash || e.target.hash === '#meetings') {
                    e.preventDefault();
                    nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
    }
}

/**
 * Configura a galeria com modal para visualização de imagens
 */
function setupGalleryModal() {
    // Criar estrutura do modal
    const modalHTML = `
        <div class="gallery-modal" id="galleryModal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Fechar">
                    <i class="fas fa-times"></i>
                </button>
                <button class="modal-download" aria-label="Download" title="Baixar imagem">
                    <i class="fas fa-download"></i>
                </button>
                <div class="modal-image-container">
                    <img src="" alt="" class="modal-image" id="modalImage">
                    <div class="image-info">
                        <h3 class="image-title" id="imageTitle"></h3>
                        <p class="image-description" id="imageDescription"></p>
                    </div>
                </div>
                <div class="modal-navigation">
                    <button class="nav-btn prev-btn" aria-label="Imagem anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="image-counter">
                        <span id="currentImage">1</span> de <span id="totalImages">0</span>
                    </div>
                    <button class="nav-btn next-btn" aria-label="Próxima imagem">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao DOM se não existir
    if (!document.getElementById('galleryModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        setupModalFunctionality();
    }
}

/**
 * Configura a funcionalidade do modal da galeria
 */
function setupModalFunctionality() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const imageTitle = document.getElementById('imageTitle');
    const imageDescription = document.getElementById('imageDescription');
    const currentImageSpan = document.getElementById('currentImage');
    const totalImagesSpan = document.getElementById('totalImages');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Coletar todas as imagens da galeria
    function collectGalleryImages() {
        galleryImages = [];
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            let imgSrc, title, description;
            
            // Verificar se tem tag img
            const imgTag = item.querySelector('img');
            if (imgTag) {
                imgSrc = imgTag.src;
                title = imgTag.alt || '';
            } 
            // Verificar se é background-image
            else if (item.style.backgroundImage) {
                imgSrc = item.style.backgroundImage
                    .replace(/url\(["']?/, '')
                    .replace(/["']?\)/, '');
            }
            
            // Obter título e descrição
            const overlay = item.querySelector('.gallery-overlay p');
            if (overlay) {
                title = title || overlay.textContent;
                description = overlay.dataset.description || '';
            }
            
            if (imgSrc) {
                galleryImages.push({
                    src: imgSrc,
                    title: title || `Imagem ${galleryImages.length + 1}`,
                    description: description || ''
                });
            }
        });
        
        // Fallback para imagens de exemplo
        if (galleryImages.length === 0) {
            galleryImages = [
                {
                    src: 'https://images.unsplash.com/photo-1596558450255-7a73e9a6c2f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    title: 'Oração Mariana',
                    description: 'Noite de oração com a comunidade jovem'
                },
                {
                    src: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    title: 'Retiro Espiritual',
                    description: 'Momento de profundidade com Deus'
                }
            ];
        }
        
        totalImagesSpan.textContent = galleryImages.length;
    }
    
    // Abrir modal
    function openModal(index) {
        if (galleryImages.length === 0) return;
        
        currentImageIndex = index;
        updateModalImage();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focar no botão de fechar para acessibilidade
        setTimeout(() => modal.querySelector('.modal-close').focus(), 100);
    }
    
    // Atualizar imagem no modal
    function updateModalImage() {
        const imageData = galleryImages[currentImageIndex];
        modalImage.src = imageData.src;
        modalImage.alt = imageData.title;
        imageTitle.textContent = imageData.title;
        imageDescription.textContent = imageData.description;
        currentImageSpan.textContent = currentImageIndex + 1;
        
        // Pré-carregar próxima e anterior
        preloadAdjacentImages();
    }
    
    // Fechar modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Navegação
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateModalImage();
    }
    
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModalImage();
    }
    
    // Pré-carregar imagens adjacentes
    function preloadAdjacentImages() {
        const nextIndex = (currentImageIndex + 1) % galleryImages.length;
        const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        
        [nextIndex, prevIndex].forEach(idx => {
            const img = new Image();
            img.src = galleryImages[idx].src;
        });
    }
    
    // Download da imagem
    function downloadImage() {
        const imageData = galleryImages[currentImageIndex];
        const link = document.createElement('a');
        link.href = imageData.src;
        link.download = `geracao-carlo-acutis-${currentImageIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Configurar eventos
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', 'Ver imagem em tamanho maior');
        
        item.addEventListener('click', () => {
            collectGalleryImages();
            openModal(index);
        });
        
        // Permitir Enter/Space para acessibilidade
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                collectGalleryImages();
                openModal(index);
            }
        });
    });
    
    // Eventos do modal
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal-download').addEventListener('click', downloadImage);
    modal.querySelector('.next-btn').addEventListener('click', nextImage);
    modal.querySelector('.prev-btn').addEventListener('click', prevImage);
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
        }
    });
    
    // Swipe para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage(); // Swipe esquerda
            } else {
                prevImage(); // Swipe direita
            }
        }
    }
}

/**
 * Configura efeitos hover interativos
 */
function setupHoverEffects() {
    // Cards com ícones
    const iconCards = document.querySelectorAll('.event-card, .spirituality-card, .upcoming-card');
    
    iconCards.forEach(card => {
        const icon = card.querySelector('.event-icon i, .spirituality-icon i, .upcoming-icon i');
        if (!icon) return;
        
        card.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px) scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Cards com elevação
    const hoverCards = document.querySelectorAll('.card, .meeting-card, .mission-card');
    
    hoverCards.forEach(card => {
        if (card.classList.contains('featured')) return;
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 15px 35px rgba(115, 47, 55, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
    
    // Botões com efeito
    const buttons = document.querySelectorAll('.btn:not(.btn-link)');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(1px)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-2px)';
        });
    });
}

/**
 * Atualiza datas dinâmicas no site
 */
function updateDynamicDates() {
    // Atualizar data do próximo encontro
    const today = new Date();
    const nextSaturday = new Date(today);
    
    // Encontrar próximo sábado
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    
    // Formatar data
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = nextSaturday.toLocaleDateString('pt-BR', options);
    
    // Atualizar elementos com data
    document.querySelectorAll('.next-event-date, .event-date, [data-date="next-saturday"]').forEach(el => {
        if (el.classList.contains('next-event-date') || el.dataset.date === 'next-saturday') {
            el.textContent = formattedDate;
        }
    });
    
    // Atualizar ano no footer
    const currentYear = today.getFullYear();
    document.querySelectorAll('[data-current-year]').forEach(el => {
        el.textContent = currentYear;
    });
    
    // Atualizar versículo da semana (simulação)
    updateWeeklyVerse();
}

/**
 * Atualiza o versículo da semana (simulação)
 */
function updateWeeklyVerse() {
    const verses = [
        { text: "Eu vim para que tenham vida e a tenham em abundância.", ref: "João 10:10" },
        { text: "Para Deus tudo é possível.", ref: "Mateus 19:26" },
        { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
        { text: "O Senhor é meu pastor, nada me faltará.", ref: "Salmos 23:1" },
        { text: "Amai-vos uns aos outros como eu vos amei.", ref: "João 13:34" }
    ];
    
    // Usar o dia da semana como índice (0-6) para rotacionar versículos
    const dayOfWeek = new Date().getDay();
    const verse = verses[dayOfWeek % verses.length];
    
    document.querySelectorAll('.bible-verse, [data-verse="weekly"]').forEach(el => {
        const textEl = el.querySelector('.verse-text, p');
        const refEl = el.querySelector('.verse-ref, .verse-reference');
        
        if (textEl) textEl.textContent = `"${verse.text}"`;
        if (refEl) refEl.textContent = verse.ref;
    });
}

/**
 * Configura o formulário de contato
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação básica
        const name = this.querySelector('[name="name"]');
        const email = this.querySelector('[name="email"]');
        const message = this.querySelector('[name="message"]');
        
        if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
    
        if (!isValidEmail(email.value)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simulação de envio
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

/**
 * Configura o botão "Voltar ao Topo"
 */
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(backToTop);
    
    // Mostrar/ocultar botão
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Rolagem suave ao topo
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Acessibilidade: permitir navegação por teclado
    backToTop.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/**
 * Configura carregamento otimizado de imagens
 */
function setupImageLoading() {
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src], .gallery-item');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.tagName === 'IMG' && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores antigos
        images.forEach(img => {
            if (img.tagName === 'IMG' && img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}

/**
 * Mostra notificação (toast)
 */
function showNotification(message, type = 'info') {
    // Remover notificação anterior
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Fechar">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Fechar automaticamente após 5 segundos
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
    
    function closeNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            if (notif.parentNode) notif.parentNode.removeChild(notif);
        }, 300);
    }
}

/**
 * Função throttle para otimizar eventos de scroll/resize
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Inicializa funcionalidades quando a página carrega completamente
 */
window.addEventListener('load', function() {
    // Adicionar classe de carregamento completo
    document.body.classList.add('loaded');
    
    // Inicializar tooltips (se existirem)
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            this.tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
    
    // Log de performance
    console.log('🚀 Site otimizado e carregado em', performance.now().toFixed(2), 'ms');
});

// ========== CSS DINÂMICO PARA O MODAL ==========
const modalCSS = `
.gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.gallery-modal.active {
    display: flex;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    z-index: 10000;
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-close, .modal-download {
    position: absolute;
    top: 15px;
    background: rgba(115, 47, 55, 0.9);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10001;
    transition: all 0.3s;
}

.modal-close:hover, .modal-download:hover {
    background: #722F37;
    transform: scale(1.1);
}

.modal-close {
    right: 15px;
}

.modal-download {
    right: 65px;
}

.modal-image-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow: hidden;
}

.modal-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.image-info {
    text-align: center;
    padding: 15px;
    max-width: 800px;
}

.image-title {
    color: #722F37;
    margin-bottom: 5px;
    font-size: 1.3rem;
}

.image-description {
    color: #666;
    font-size: 0.95rem;
}

.modal-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f9f7f2;
    border-top: 1px solid #eaeaea;
}

.nav-btn {
    background: #722F37;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
}

.nav-btn:hover {
    background: #5a252c;
    transform: scale(1.1);
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.image-counter {
    font-weight: 600;
    color: #722F37;
    font-size: 1rem;
}

/* Notificações */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 99999;
    transform: translateX(150%);
    transition: transform 0.3s ease;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #2ecc71;
}

.notification.error {
    border-left: 4px solid #e74c3c;
}

.notification.info {
    border-left: 4px solid #3498db;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.notification i {
    font-size: 1.2rem;
}

.notification.success i {
    color: #2ecc71;
}

.notification.error i {
    color: #e74c3c;
}

.notification-close {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.3s;
}

.notification-close:hover {
    color: #333;
    background: #f5f5f5;
}

/* Botão Voltar ao Topo */
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #722F37;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(115, 47, 55, 0.3);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
}

.back-to-top:hover {
    background: #5a252c;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(115, 47, 55, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
    }
    
    .modal-image {
        max-height: 60vh;
    }
    
    .modal-close, .modal-download {
        top: 10px;
        right: 10px;
    }
    
    .modal-download {
        right: 60px;
    }
    
    .modal-navigation {
        padding: 10px;
    }
    
    .notification {
        left: 20px;
        right: 20px;
        max-width: none;
    }
    
    .back-to-top {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
    }
}

@media (max-width: 480px) {
    .modal-image {
        max-height: 50vh;
    }
    
    .image-info {
        padding: 10px;
    }
    
    .image-title {
        font-size: 1.1rem;
    }
    
    .notification {
        padding: 12px 15px;
        font-size: 0.9rem;
    }
}
`;

// Adicionar CSS dinâmico ao documento
document.head.insertAdjacentHTML('beforeend', `<style>${modalCSS}</style>`);