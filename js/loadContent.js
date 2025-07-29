// Content loader class
class ContentLoader {
    static async loadServices() {
        try {
            const response = await fetch('partials/services.html');
            const html = await response.text();
            document.getElementById('servicesContainer').innerHTML = html;
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }
    
    static async loadGallery() {
        try {
            const response = await fetch('partials/gallery.html');
            const html = await response.text();
            document.getElementById('galleryContainer').innerHTML = html;
        } catch (error) {
            console.error('Error loading gallery:', error);
        }
    }
    
    static async loadContactInfo() {
        try {
            const response = await fetch('partials/contact-info.html');
            const html = await response.text();
            document.getElementById('contactInfoContainer').innerHTML = html;
        } catch (error) {
            console.error('Error loading contact info:', error);
        }
    }
    
    static async loadContactForm() {
        try {
            const response = await fetch('partials/contact-form.html');
            const html = await response.text();
            document.getElementById('contactFormContainer').innerHTML = html;
        } catch (error) {
            console.error('Error loading contact form:', error);
        }
    }
    
    static async loadFooter() {
        try {
            const response = await fetch('partials/footer.html');
            const html = await response.text();
            document.getElementById('footerContainer').innerHTML = html;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
    
    static async loadAll() {
        await Promise.all([
            this.loadServices(),
            this.loadGallery(),
            this.loadContactInfo(),
            this.loadContactForm(),
            this.loadFooter()
        ]);
    }
}
