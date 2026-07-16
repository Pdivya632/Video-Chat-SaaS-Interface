(function (b) {
    b.fn.bcSwipe = function (c) {
        var f = { threshold: 50 };
        c && b.extend(f, c);
        this.each(function () {
            function c(a) {
                1 == a.touches.length &&
                    ((d = a.touches[0].pageX),
                        (e = !0),
                        this.addEventListener("touchmove", g, !1));
            }
            function g(a) {
                e &&
                    ((a = d - a.touches[0].pageX),
                        Math.abs(a) >= f.threshold &&
                        (h(), 0 < a ? b(this).carousel("next") : b(this).carousel("prev")));
            }
            function h() {
                this.removeEventListener("touchmove", g);
                d = null;
                e = !1;
            }
            var e = !1,
                d;
            "ontouchstart" in document.documentElement &&
                this.addEventListener("touchstart", c, !1);
        });
        return this;
    };
})(jQuery);

$(document).ready(function () {
    $(".carousel").bcSwipe({ threshold: 50 });
});


$(document).ready(function () {
    $('.carousel').slick({
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        centerMode: true,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                // centerMode: true,

            }

        }, {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                dots: true,
                infinite: true,

            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 2000,
            }
        }]
    });
});

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});
const chatButtons = document.querySelectorAll('.chat-btn');

chatButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Redirect to chat.html
        window.location.href = 'chat.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Your JavaScript code goes here
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselCards = document.querySelectorAll('.cardss');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    const cardWidth = carouselCards[0].offsetWidth + 20; // Assumes all cards have same width
    const trackWidth = cardWidth * carouselCards.length;
    carouselTrack.style.width = `${trackWidth}px`;

    let currentCardIndex = 0;
    let intervalId = setInterval(() => {
        currentCardIndex = (currentCardIndex + 1) % carouselCards.length;
        carouselTrack.style.transform = `translateX(-${currentCardIndex * cardWidth}px)`;
    }, 5000);

    prevButton.addEventListener('click', () => {
        clearInterval(intervalId);
        setTimeout(() => {
            currentCardIndex = Math.max(currentCardIndex - 1, 0);
            carouselTrack.style.transform = `translateX(-${currentCardIndex * cardWidth}px)`;
            intervalId = setInterval(() => {
                currentCardIndex = (currentCardIndex + 1) % carouselCards.length;
                carouselTrack.style.transform = `translateX(-${currentCardIndex * cardWidth}px)`;
            }, 5000);
        }, 100);
    });

    nextButton.addEventListener('click', () => {
        clearInterval(intervalId);
        setTimeout(() => {
            currentCardIndex = (currentCardIndex + 1) % carouselCards.length;
            carouselTrack.style.transform = `translateX(-${currentCardIndex * cardWidth}px)`;
            intervalId = setInterval(() => {
                currentCardIndex = (currentCardIndex + 1) % carouselCards.length;
                carouselTrack.style.transform = `translateX(-${currentCardIndex * cardWidth}px)`;
            }, 5000);
        }, 100);
    });
});

