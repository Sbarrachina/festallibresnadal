/* =========================================================
   ELS LLIBRES DEL TIÓ
   Carrusels de llibres
   ========================================================= */

   document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------
       CARRUSEL ACTIU PER AL TECLAT
       --------------------------------------------------------- */

    let activeCarousel = null;


    /* ---------------------------------------------------------
       INICIALITZAR UN CARRUSEL
       --------------------------------------------------------- */

    function initCarousel(carouselId) {

        const carousel = document.getElementById(carouselId);

        if (!carousel) {
            return;
        }

        const section = carousel.closest(".books-section");

        if (!section) {
            return;
        }

        const cards = carousel.querySelectorAll(".book-card");
        const controls = section.querySelector(".carousel-controls");
        const buttons = controls?.querySelectorAll(".carousel-button");
        const counter = controls?.querySelector(".carousel-counter");

        if (!cards.length || !buttons || buttons.length < 2 || !counter) {
            return;
        }

        const previousButton = buttons[0];
        const nextButton = buttons[1];

        let currentIndex = 0;
        let isAnimating = false;

        const totalBooks = cards.length;


        /* ---------------------------------------------------------
           ACTUALITZAR EL NÚMERO
           --------------------------------------------------------- */

        function updateCounter() {

            const current = String(currentIndex + 1).padStart(2, "0");
            const total = String(totalBooks).padStart(2, "0");

            counter.textContent = `${current} / ${total}`;
        }


        /* ---------------------------------------------------------
           ANIMACIÓ DEL CONTINGUT
           --------------------------------------------------------- */

        function animateCard(card, direction) {

            const cover = card.querySelector(".book-cover");
            const info = card.querySelector(".book-info");

            if (!cover || !info) {
                return;
            }

            cover.style.transition = "none";
            info.style.transition = "none";

            cover.style.opacity = "0";
            info.style.opacity = "0";

            cover.style.transform =
                direction === "next"
                    ? "translateX(45px) scale(0.97)"
                    : "translateX(-45px) scale(0.97)";

            info.style.transform =
                direction === "next"
                    ? "translateX(30px)"
                    : "translateX(-30px)";

            requestAnimationFrame(() => {

                cover.style.transition =
                    "opacity 0.7s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";

                info.style.transition =
                    "opacity 0.6s ease 0.12s, transform 0.7s ease 0.12s";

                cover.style.opacity = "1";
                info.style.opacity = "1";

                cover.style.transform =
                    "translateX(0) scale(1)";

                info.style.transform =
                    "translateX(0)";
            });
        }


        /* ---------------------------------------------------------
           ANAR A UN LLIBRE
           --------------------------------------------------------- */

        function goToBook(index, direction) {

            if (isAnimating || index === currentIndex) {
                return;
            }

            isAnimating = true;

            currentIndex = index;

            const card = cards[currentIndex];

            card.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });

            updateCounter();

            animateCard(card, direction);

            setTimeout(() => {
                isAnimating = false;
            }, 850);
        }


        /* ---------------------------------------------------------
           SEGÜENT
           --------------------------------------------------------- */

        function nextBook() {

            const nextIndex =
                (currentIndex + 1) % totalBooks;

            goToBook(nextIndex, "next");
        }


        /* ---------------------------------------------------------
           ANTERIOR
           --------------------------------------------------------- */

        function previousBook() {

            const previousIndex =
                (currentIndex - 1 + totalBooks) % totalBooks;

            goToBook(previousIndex, "previous");
        }


        /* ---------------------------------------------------------
           BOTÓ SEGÜENT
           --------------------------------------------------------- */

        nextButton.addEventListener("click", () => {

            nextBook();

            activeCarousel = carousel;
        });


        /* ---------------------------------------------------------
           BOTÓ ANTERIOR
           --------------------------------------------------------- */

        previousButton.addEventListener("click", () => {

            previousBook();

            activeCarousel = carousel;
        });


        /* ---------------------------------------------------------
           RATOLÍ
           --------------------------------------------------------- */

        carousel.addEventListener("mouseenter", () => {

            activeCarousel = carousel;
        });


        /* ---------------------------------------------------------
           TOUCH
           --------------------------------------------------------- */

        carousel.addEventListener("touchstart", () => {

            activeCarousel = carousel;

        }, {
            passive: true
        });


        /* ---------------------------------------------------------
           POSICIÓ INICIAL
           --------------------------------------------------------- */

        updateCounter();

        const firstCard = cards[0];

        if (firstCard) {

            const cover = firstCard.querySelector(".book-cover");
            const info = firstCard.querySelector(".book-info");

            if (cover) {

                cover.style.opacity = "1";

                cover.style.transform =
                    "translateX(0) scale(1)";
            }

            if (info) {

                info.style.opacity = "1";

                info.style.transform =
                    "translateX(0)";
            }
        }


        /* ---------------------------------------------------------
           EXPOSAR FUNCIONS PER AL TECLAT
           --------------------------------------------------------- */

        carousel.nextBook = nextBook;
        carousel.previousBook = previousBook;
    }


    /* ---------------------------------------------------------
       INICIALITZAR ELS 3 CARRUSELS
       --------------------------------------------------------- */

    initCarousel("carousel-basic");
    initCarousel("carousel-elemental");
    initCarousel("carousel-suficiencia");


    /* ---------------------------------------------------------
       TECLAT
       Només afecta el carrusel que tenim actiu
       --------------------------------------------------------- */

    document.addEventListener("keydown", (event) => {

        if (!activeCarousel) {
            return;
        }

        if (event.key === "ArrowRight") {

            activeCarousel.nextBook();

        } else if (event.key === "ArrowLeft") {

            activeCarousel.previousBook();
        }
    });

});