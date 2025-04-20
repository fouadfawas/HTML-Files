document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.container');
    const linkContainer = document.querySelector('.link-container');

    
    function createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.top = `${y}px`;
        explosion.style.left = `${x}px`;
        document.body.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 1000); 
    }

    
    const trollface = document.querySelector('img[alt="Trollface"]');
    trollface.addEventListener('mouseenter', function() {
        trollface.style.transform = 'scale(1.2)';
    });

    trollface.addEventListener('mouseleave', function() {
        trollface.style.transform = 'scale(1)';
    });

    
    const hbombLink = document.querySelector('a img[title*="Lostwavers"]');
    hbombLink.addEventListener('click', function(event) {
        event.preventDefault();
        const rect = hbombLink.getBoundingClientRect();
        createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

        setTimeout(() => {
            window.location.href = hbombLink.parentElement.href;
        }, 1000); // Delay navigation to the link by 1 second to show explosion
    });

    
    const leMonke = document.querySelector('img[alt="Monke"]');
    leMonke.addEventListener('click', function() {
        alert("You found the secret message: H-BOMB IS EPIC!");
    });

    
    const mainHeader = document.querySelector('h1');
    mainHeader.style.position = 'relative';
    let direction = 1;
    let offset = 0;

    function animateHeader() {
        offset += direction;
        mainHeader.style.top = `${offset}px`;

        if (offset > 20 || offset < -20) {
            direction *= -1;
        }

        requestAnimationFrame(animateHeader);
    }

    animateHeader();

    
    function randomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    setInterval(() => {
        document.body.style.backgroundColor = randomColor();
    }, 3000); // Change background color every 3 seconds
});
