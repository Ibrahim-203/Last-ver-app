import React, { useEffect } from 'react';

const CarouselPage = () => {
    useEffect(() => {
        // Vérifiez que Owl Carousel est chargé correctement avant de l'initialiser
        if (window.$ && window.$.fn.owlCarousel) {
            window.$("#header-carousel").owlCarousel({
                animateOut: 'fadeOut',
                loop: true,
                margin: 0,
                nav: true,
                items:1,
                stagePadding: 0,
                autoplay: true,
                smartSpeed: 500,
                dots: true,
                     navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
            });
        } else {
            console.error("Owl Carousel ou jQuery n'est pas chargé correctement.");
        }

        // Nettoie le carrousel quand le composant est démonté
        return () => {
            window.$("#header-carousel").trigger('destroy.owl.carousel');
        };
    }, []);

    return (
        <div id="header-carousel" className="header-carousel owl-carousel">
            <div className="header-carousel-item">
                <img src="./assets/images/front/carousel(1).jpg" className="img-fluid w-100" alt="Image"/>
                <div className="carousel-caption">
                <div className="container">
                            <div className="row gy-0 gx-5">
                                <div className="col-lg-0 col-xl-5"></div>
                                <div className="col-xl-7 animated fadeInLeft">
                                    <div className="text-sm-center text-md-end">
                                        <h4 className="text-primary-front text-uppercase fw-bold mb-4">Bienvenu sur notre site</h4>
                                        <h1 className="display-4 text-uppercase text-white mb-4">Simplifiez la gestion de votre énergie avec des solutions personnalisées.</h1>
                                        <p className="mb-5 fs-5">Découvrez nos solutions pour analyser, anticiper et maîtriser votre consommation énergétique, et faites le premier pas vers une gestion plus efficace et durable de vos ressources.
                                        </p>
                                        <div className="d-flex align-items-center justify-content-center justify-content-md-end">
                                            <h2 className="text-white me-2">Suivez-nous:</h2>
                                            <div className="d-flex justify-content-end ms-2">
                                                <a className="btn btn-md-square btn-light rounded-circle me-2" href=""><i className="fab fa-facebook-f"></i></a>
                                                <a className="btn btn-md-square btn-light rounded-circle mx-2" href=""><i className="fab fa-twitter"></i></a>
                                                <a className="btn btn-md-square btn-light rounded-circle mx-2" href=""><i className="fab fa-instagram"></i></a>
                                                <a className="btn btn-md-square btn-light rounded-circle ms-2" href=""><i className="fab fa-linkedin-in"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div className="header-carousel-item">
                <img src="./assets/images/front/carousel(2).jpg" className="img-fluid w-100" alt="Image"/>
                <div className="carousel-caption">
                <div className="container">
                            <div className="row g-5">
                                <div className="col-12 animated fadeInUp">
                                    <div className="text-center">
                                        <h4 className="text-primary-front text-uppercase fw-bold mb-4">Bienvenu sur notre site</h4>
                                        <h1 className="display-4 text-uppercase text-white mb-4">Analysez, évaluez, et prédisez votre consommation pour un avenir plus vert.</h1>
                                        <p className="mb-5 fs-5">Découvrez nos solutions pour analyser, anticiper et maîtriser votre consommation énergétique, et faites le premier pas vers une gestion plus efficace et durable de vos ressources.
                                        </p>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <h2 className="text-white me-2">Suivez-nous:</h2>
                                            <div className="d-flex justify-content-end ms-2">
                                                <a className="btn btn-md-square btn-light rounded-circle me-2" href=""><i className="fab fa-facebook-f"></i></a>
                                                <a className="btn btn-md-square btn-light rounded-circle mx-2" href=""><i className="fab fa-twitter"></i></a>
                                                <a className="btn btn-md-square btn-light rounded-circle mx-2" href=""><i className="fab fa-instagram"></i></a>
                                                <a className="btn btn-md-square btn-light rounded-circle ms-2" href=""><i className="fab fa-linkedin-in"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default CarouselPage;
