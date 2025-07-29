// Main application
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize utilities
    Utilities.initParticles();
    Utilities.lazyLoadImages();
    
    // Load all content
    await ContentLoader.loadAll();
    
    // Loading screen
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.querySelector('.loading-screen').classList.add('hidden');
        }, 2000);
        
        // Try to play background music
        tryPlayMusic();
    });
    
    // Background Music Control
    const bgMusic = document.getElementById('bgMusic');
    let isMusicPlaying = false;
    
    function tryPlayMusic() {
        bgMusic.volume = 0.3;
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isMusicPlaying = true;
            })
            .catch(error => {
                isMusicPlaying = false;
                document.addEventListener('click', function() {
                    if (!isMusicPlaying) {
                        bgMusic.play().then(_ => {
                            isMusicPlaying = true;
                        });
                    }
                }, { once: true });
            });
        }
    }
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        Utilities.playSound('buttonSound');
    });
    
    // Search Toggle for Mobile
    const searchToggle = document.getElementById('searchToggle');
    const navSearch = document.getElementById('navSearch');
    
    searchToggle.addEventListener('click', function() {
        navSearch.classList.toggle('active');
        Utilities.playSound('buttonSound');
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Scroll Animation for Gallery
    function animateOnScroll() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const windowHeight = window.innerHeight;
        
        galleryItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < windowHeight - 100) {
                item.style.animation = `fadeInUpItem 0.5s ${index * 0.1}s forwards ease-out`;
            }
        });
    }
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Detail Toggle
    document.querySelectorAll('.btn-detail').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const expandedContent = document.getElementById(targetId);
            if (!expandedContent) return;
            expandedContent.classList.toggle('active');
            
            if (expandedContent.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-chevron-up"></i> Sembunyikan Detail';
                this.classList.add('active');
                Utilities.scrollTo(expandedContent);
            } else {
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Detail Produk';
                this.classList.remove('active');
            }
            Utilities.playSound('buttonSound');
        });
    });
    
    // Gallery Carousel Thumbnail Click
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const mainImageId = this.dataset.mainImage;
            const mainImage = document.getElementById(mainImageId);
            if (!mainImage) return;
            mainImage.src = this.src;
            
            this.parentElement.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            Utilities.playSound('buttonSound');
        });
    });
    
    // Image Zoom Modal
    const imageModal = document.getElementById('imageModal');
    const zoomedImage = document.getElementById('zoomedImage');
    if (imageModal && zoomedImage) {
        document.querySelectorAll('.gallery-main-image').forEach(img => {
            img.addEventListener('click', function() {
                zoomedImage.src = this.src;
                imageModal.classList.add('show');
            });
        });
        document.querySelector('.close-image-modal').addEventListener('click', () => imageModal.classList.remove('show'));
    }
    
    // Price calculations
    function updateTotalPrice(detailsContainer) {
        const activeVariation = detailsContainer.querySelector('.price-variation.active');
        const quantityInput = detailsContainer.querySelector('.quantity-input');
        if (!activeVariation || !quantityInput) return;
        
        const price = parseFloat(activeVariation.dataset.price);
        const quantity = parseInt(quantityInput.value);
        const totalPrice = price * quantity;
        
        const formattedPrice = Utilities.formatCurrency(totalPrice);
        const totalPriceValueEl = detailsContainer.querySelector('.total-price-value');
        if (totalPriceValueEl) totalPriceValueEl.textContent = formattedPrice;
    }
    
    // Event delegation for price variations
    document.addEventListener('click', function(e) {
        if (e.target.closest('.price-variation')) {
            const variation = e.target.closest('.price-variation');
            const container = variation.closest('.gallery-details');
            container.querySelectorAll('.price-variation').forEach(v => v.classList.remove('active'));
            variation.classList.add('active');
            updateTotalPrice(container);
            Utilities.playSound('buttonSound');
        }
        
        if (e.target.closest('.quantity-btn.plus')) {
            const btn = e.target.closest('.quantity-btn.plus');
            const container = btn.closest('.gallery-details');
            const quantityInput = container.querySelector('.quantity-input');
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateTotalPrice(container);
            Utilities.playSound('buttonSound');
        }
        
        if (e.target.closest('.quantity-btn.minus')) {
            const btn = e.target.closest('.quantity-btn.minus');
            const container = btn.closest('.gallery-details');
            const quantityInput = container.querySelector('.quantity-input');
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
                updateTotalPrice(container);
                Utilities.playSound('buttonSound');
            }
        }
        
        if (e.target.closest('.quantity-input')) {
            const input = e.target.closest('.quantity-input');
            const container = input.closest('.gallery-details');
            updateTotalPrice(container);
        }
        
        if (e.target.closest('.btn-preorder-toggle')) {
            const button = e.target.closest('.btn-preorder-toggle');
            const preorderForm = button.closest('.gallery-details').querySelector('.preorder-form');
            if (!preorderForm) return;
            preorderForm.classList.toggle('active');
            button.classList.toggle('active');
            button.innerHTML = button.classList.contains('active') ? 
                '<i class="fas fa-times"></i> Batal Pre-Order' : 
                '<i class="fas fa-calendar-check"></i> Pre-Order';
            Utilities.playSound('buttonSound');
        }
    });
    
    // WhatsApp message generation
    function getWhatsAppMessage(detailsContainer, type = 'order') {
        const productTitleEl = detailsContainer.querySelector('.gallery-title');
        const productCodeEl = detailsContainer.querySelector('.gallery-code');
        const quantityInput = detailsContainer.querySelector('.quantity-input');
        const unitSelect = detailsContainer.querySelector('.unit-select');
        const totalPriceEl = detailsContainer.querySelector('.total-price-value');
        
        if (!productTitleEl || !productCodeEl || !quantityInput || !unitSelect || !totalPriceEl) return null;
        
        const productTitle = productTitleEl.textContent.trim();
        const productCode = productCodeEl.textContent.trim();
        const quantity = quantityInput.value;
        const unit = unitSelect.value;
        const totalPrice = totalPriceEl.textContent.trim();
        
        if (type === 'preorder') {
            const dpInput = detailsContainer.querySelector('.preorder-input');
            if (!dpInput || !dpInput.value || dpInput.value <= 0) {
                alert('Mohon masukkan nominal DP yang valid.');
                return null;
            }
            const dpValue = Utilities.formatCurrency(dpInput.value);
            return encodeURIComponent(`Halo, saya ingin PRE-ORDER:\n\n*Produk:* ${productTitle} (${productCode})\n*Jumlah:* ${quantity} ${unit}\n*Total Harga:* ${totalPrice}\n*DP:* ${dpValue}\n\nMohon info lebih lanjut.`);
        }
        
        return encodeURIComponent(`Halo, saya ingin memesan:\n\n*Produk:* ${productTitle} (${productCode})\n*Jumlah:* ${quantity} ${unit}\n*Total Harga:* ${totalPrice}\n\nMohon info lebih lanjut.`);
    }
    
    // Order buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-order')) {
            const button = e.target.closest('.btn-order');
            const detailsContainer = button.closest('.gallery-details');
            const message = getWhatsAppMessage(detailsContainer, 'order');
            if (message) window.open(`https://wa.me/${CONFIG.CONTACT.whatsapp}?text=${message}`, '_blank');
            Utilities.playSound('buttonSound');
        }
        
        if (e.target.closest('.btn-preorder')) {
            const button = e.target.closest('.btn-preorder');
            const detailsContainer = button.closest('.gallery-details');
            const message = getWhatsAppMessage(detailsContainer, 'preorder');
            if (message) window.open(`https://wa.me/${CONFIG.CONTACT.whatsapp}?text=${message}`, '_blank');
            Utilities.playSound('buttonSound');
        }
    });
    
    // Quick order modal
    const quickOrderBtn = document.getElementById('quick-order');
    const orderModal = document.getElementById('orderModal');
    if (quickOrderBtn && orderModal) {
        const closeModalBtn = orderModal.querySelector('.close-modal');
        quickOrderBtn.addEventListener('click', () => { 
            orderModal.classList.add('show'); 
            Utilities.playSound('buttonSound'); 
        });
        closeModalBtn.addEventListener('click', () => orderModal.classList.remove('show'));
        window.addEventListener('click', e => { 
            if (e.target === orderModal) orderModal.classList.remove('show'); 
        });
    }
    
    // Filter items
    function filterItems(attribute, value) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.display = (value === 'all' || item.dataset[attribute] === value) ? 'block' : 'none';
        });
        Utilities.playSound('buttonSound');
    }
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterItems('type', this.dataset.type);
        });
    });
    
    // Product category buttons
    document.querySelectorAll('.product-category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.product-category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterItems('category', this.dataset.category);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    Utilities.scrollTo(target);
                }
            }
        });
    });
    
    // Form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', function(e) { 
        e.preventDefault(); 
        alert("Form submitted!"); // Placeholder for actual form submission
    });
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) newsletterForm.addEventListener('submit', function(e) { 
        e.preventDefault(); 
        alert("Subscribed!"); // Placeholder for actual subscription
    });
    
    const quickOrderForm = document.getElementById('quickOrderForm');
    if (quickOrderForm) quickOrderForm.addEventListener('submit', function(e) { 
        e.preventDefault(); 
        alert("Quick order sent!"); // Placeholder for actual order submission
    });
});
