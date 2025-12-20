// documents.js
document.addEventListener('DOMContentLoaded', function() {
    // PDF Viewer functionality
    const pdfModal = document.getElementById('pdfModal');
    const closePdfModal = document.getElementById('closePdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfModalTitle = document.getElementById('pdfModalTitle');
    
    // View PDF in modal
    document.querySelectorAll('.btn-primary[target="_blank"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfUrl = this.getAttribute('href');
            const documentTitle = this.closest('.document-card').querySelector('.document-title').textContent;
            
            // Set PDF viewer
            pdfViewer.src = pdfUrl + '#view=FitH';
            pdfModalTitle.textContent = documentTitle;
            
            // Show modal
            pdfModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    if (closePdfModal) {
        closePdfModal.addEventListener('click', function() {
            pdfModal.classList.remove('active');
            pdfViewer.src = '';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal on background click
    pdfModal.addEventListener('click', function(e) {
        if (e.target === pdfModal) {
            pdfModal.classList.remove('active');
            pdfViewer.src = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            pdfModal.classList.remove('active');
            pdfViewer.src = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Make sure all document download links work properly
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Add tracking or analytics here if needed
            console.log('Downloading:', this.getAttribute('href'));
        });
    });
    
    // Update navigation active state
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});