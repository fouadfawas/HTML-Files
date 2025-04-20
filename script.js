function animateHeader() {
    const header = document.querySelector('.header h1');
    let colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    let colorIndex = 0;

    setInterval(() => {
        header.style.color = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 500);
}

function animateMarquee() {
    const marquee = document.querySelector('marquee');
    let texts = [
        'ROBLOX MEANS FUN! JOIN US IN WWW.ROBLOXMEANSFUN.COM!',
        'WELCOME TO THE BEST ROBLOX FAN SITE!',
        'GET FREE BITCOIN SPONSORED BY ROBLOX.FUN!',
        'DON\'T MISS OUT ON THE FUN, JOIN US NOW!'
    ];
    let textIndex = 0;

    setInterval(() => {
        marquee.textContent = texts[textIndex];
        textIndex = (textIndex + 1) % texts.length;
    }, 3000);
}

function bitcoinAlert() {
    const bitcoinLink = document.querySelector('.bitcoin-container a');
    bitcoinLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('You are about to be redirected to our Bitcoin sponsor page!');
        setTimeout(() => {
            window.location.href = 'bitcoin.html';
        }, 1000); // Redirect after 1 second
    });
}

function swedejakSound() {
    const swedejakImages = document.querySelectorAll('.swedejak-container a img');
    const swedejakSound = new Audio('swedejak-sound.mp3');

    swedejakImages.forEach((img) => {
        img.addEventListener('click', (event) => {
            event.preventDefault();
            swedejakSound.play();
            setTimeout(() => {
                window.location.href = event.target.parentElement.href;
            }, 1000); 
        });
    });
}

function rainbowBorder() {
    const ytImage = document.querySelector('.yt-imagelink img');
    let borderColorIndex = 0;
    let borderColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];

    setInterval(() => {
        ytImage.style.border = `5px solid ${borderColors[borderColorIndex]}`;
        borderColorIndex = (borderColorIndex + 1) % borderColors.length;
    }, 200);
}

function repeatCycle() {
    const repeatLink = document.querySelector('ul li a[href="index.html"]');
    repeatLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Repeating the cycle!');
        window.location.reload();
    });
}

function init() {
    animateHeader();
    animateMarquee();
    bitcoinAlert();
    swedejakSound();
    rainbowBorder();
    repeatCycle();
}

document.addEventListener('DOMContentLoaded', init);
