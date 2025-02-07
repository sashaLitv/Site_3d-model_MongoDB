const menuLinks = document.querySelectorAll('.menu-link');

function highlightSection(event) {
    event.preventDefault();
    const hash = event.target.getAttribute('href'); 
    const section = document.querySelector(hash); 

    if (section) {
        section.classList.add('highlight'); 
        
        setTimeout(() => {
            section.classList.remove('highlight');
        }, 5000); 
    }
}

menuLinks.forEach(link => {
    link.addEventListener('click', highlightSection); 
});