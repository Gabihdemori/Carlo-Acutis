// script.js - Funcionalidades para o site Geração Carlo Acutis

document.addEventListener('DOMContentLoaded', function() {
    // Menu responsivo para mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Highlight automático do próximo encontro
    highlightNextMeeting();
    
    // Animações ao rolar a página
    setupScrollAnimations();
    
    // Destaque automático do item do menu ativo
    setupActiveMenuHighlight();
    
    // Configurar interações de hover para cards
    setupHoverEffects();
});

// Função para destacar automaticamente o próximo encontro
function highlightNextMeeting() {
    const meetingCards = document.querySelectorAll('.meeting-card');
    if (meetingCards.length > 0) {
        // Remover qualquer destaque existente
        meetingCards.forEach(card => {
            card.classList.remove('highlighted');
        });
        
        // Destacar o primeiro encontro (seria o próximo na vida real)
        meetingCards[0].classList.add('highlighted');
        
        // Adicionar badge de "Próximo"
        const meetingHeader = meetingCards[0].querySelector('.meeting-header');
        if (meetingHeader && !meetingHeader.querySelector('.highlight-badge')) {
            const badge = document.createElement('span');
            badge.className = 'highlight-badge';
            badge.textContent = 'Próximo';
            meetingHeader.appendChild(badge);
        }
    }
}

// Configurar animações ao rolar a página
function setupScrollAnimations() {
    // Observador de elementos para animações
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Elementos para observar e animar
    const elementsToAnimate = document.querySelectorAll(
        '.event-card, .mission-card, .spirituality-card, .gallery-item, .contact-card, .timeline-item'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Destacar item ativo no menu conforme a rolagem
function setupActiveMenuHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Configurar efeitos de hover interativos
function setupHoverEffects() {
    // Efeito de hover para cards de eventos
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.event-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.event-icon i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // Efeito de hover para cards de espiritualidade
    const spiritualityCards = document.querySelectorAll('.spirituality-card');
    spiritualityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.spirituality-icon i');
            if (icon) {
                icon.style.transform = 'translateY(-5px)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.spirituality-icon i');
            if (icon) {
                icon.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Efeito de clique para itens da galeria (simulação)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Em um site real, isso abriria um modal com a imagem em tamanho maior
            alert('Em um site real, isso abriria a imagem em tamanho maior. Para este exemplo, estamos apenas demonstrando a interatividade.');
        });
    });
}

// Adicionar funcionalidade de atualização automática da data do próximo encontro
function updateNextMeetingDate() {
    // Esta função poderia buscar dados de uma API ou atualizar dinamicamente
    // Para este exemplo, vamos apenas demonstrar a lógica
    const today = new Date();
    const nextSaturday = new Date(today);
    
    // Encontrar o próximo sábado
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    
    // Formatar a data
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = nextSaturday.toLocaleDateString('pt-BR', options);
    
    // Atualizar no DOM
    const dateElements = document.querySelectorAll('.event-details p:first-child strong');
    if (dateElements.length > 0) {
        // Manter o formato original para o exemplo
        // Em um caso real, poderíamos atualizar com: dateElements[0].textContent = formattedDate;
    }
}

// Inicializar funções adicionais quando a página carregar
window.addEventListener('load', function() {
    updateNextMeetingDate();
});