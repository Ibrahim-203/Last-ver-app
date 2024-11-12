import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CarouselPage from '../component/CarouselPage';
import axios from 'axios';

const StartPage = () => {
    const [active, setActive] = useState("accueil")
    const [infoClient, setInfoClient] = useState([])

    const getClientThinking = async (data) => {

        try {
          const response = await axios.get(`http://localhost:3001/info`);
          
          setInfoClient(response.data)
          
          // getClients(); // Recharger les données après l'insertion
        } catch (error) {
          console.error('Erreur lors de l\'envoi des données:', error);
        }
      }
    useEffect(()=>{
        getClientThinking()
    },[])
    useEffect(()=>{
        infoClient.forEach((item)=>{
            console.log(item);
            
        })
        // console.log(infoClient.forEach((item)=>item));
        
    },[infoClient])
    return (
        <div className='body-front'>
        {/* Spinner Start */}
        {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-primary-front" style={{width: "3rem", height: "3rem"}} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div> */}
        {/* Spinner End */}

        {/* Topbar Start */}
        {/* <div className="container-fluid topbar bg-light px-5 d-none d-lg-block">
            <div className="row gx-0 align-items-center">
                <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                    <div className="d-flex flex-wrap">
                        <a href="#" className="text-muted small me-4"><i className="fas fa-map-marker-alt text-primary-front me-2"></i>Find A Location</a>
                        <a href="tel:+01234567890" className="text-muted small me-4"><i className="fas fa-phone-alt text-primary-front me-2"></i>+01234567890</a>
                        <a href="mailto:example@gmail.com" className="text-muted small me-0"><i className="fas fa-envelope text-primary-front me-2"></i>Example@gmail.com</a>
                    </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                    <div className="d-inline-flex align-items-center" style={{height: "45px"}}>
                        <a href="#"><small className="me-3 text-dark"><i className="fa fa-user text-primary-front me-2"></i>Register</small></a>
                        <a href="#"><small className="me-3 text-dark"><i className="fa fa-sign-in-alt text-primary-front me-2"></i>Login</small></a>
                        <div className="dropdown">
                            <a href="#" className="dropdown-toggle text-dark" data-bs-toggle="dropdown"><small><i className="fa fa-home text-primary-front me-2"></i> My Dashboard</small></a>
                            <div className="dropdown-menu rounded">
                                <a href="#" className="dropdown-item"><i className="fas fa-user-alt me-2"></i> My Profile</a>
                                <a href="#" className="dropdown-item"><i className="fas fa-comment-alt me-2"></i> Inbox</a>
                                <a href="#" className="dropdown-item"><i className="fas fa-bell me-2"></i> Notifications</a>
                                <a href="#" className="dropdown-item"><i className="fas fa-cog me-2"></i> Account Settings</a>
                                <a href="#" className="dropdown-item"><i className="fas fa-power-off me-2"></i> Log Out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
        {/* Topbar End */}

        {/* Navbar & Hero Start */}
        <div className="container-fluid position-relative p-0">
            <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                <a href="" className="navbar-brand p-0">
                    <img src="./assets/images/front/logo.jpeg" style={{borderRadius:"50% "}} alt=""/>
                    {/* <img src="img/logo.png" alt="Logo"> */}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="fa fa-bars"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0">
                        <a href="#" onClick={()=>setActive("accueil")} className={`nav-item nav-link-hover ${active==="accueil" && "active"}`}>Accueil</a>
                        <a href="#about" onClick={()=>setActive("about")} className={`nav-item nav-link-hover ${active==="about" && "active"}`}>A propos</a>
                        <a href="#service" onClick={()=>setActive("service")} className={`nav-item nav-link-hover ${active==="service" && "active"}`}>Services</a>
                        <a href="#" className="nav-item nav-link-hover">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Carousel Start */}
            {/* <div className="header-carousel owl-carousel">
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
            </div> */}
            <CarouselPage/>
            {/*  Carousel End  */}
        </div>
        {/* Navbar & Hero End */}


        {/* Abvout Start */}
        <div className="container-fluid about py-5" id="about">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-xl-7 wow fadeInLeft" data-wow-delay="0.2s">
                        <div>
                            <h4 className="text-primary-front">Nous concernant</h4>
                            <h1 className="display-5 mb-4">Mieux connaître notre entreprise</h1>
                            <p className="mb-4">Passionnés par l'innovation et engagés pour une gestion énergétique responsable, nous avons créé des outils puissants pour vous aider à maîtriser et optimiser votre consommation d'énergie. Notre mission est de simplifier la transition vers une consommation plus intelligente et durable, en mettant la technologie au service de vos besoins énergétiques.</p>
                            {/* <div className="row g-4">
                                <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex">
                                        <div><i className="fas fa-lightbulb fa-3x text-primary-front"></i></div>
                                        <div className="ms-4">
                                            <h4>Consultant busness</h4>
                                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex">
                                        <div><i className="bi bi-bookmark-heart-fill fa-3x text-primary-front"></i></div>
                                        <div className="ms-4">
                                            <h4>Année d'expertise</h4>
                                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <a href="#" className="btn btn-primary rounded-pill py-3 px-5 flex-shrink-0">Decouvrir</a>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex">
                                        <i className="fas fa-phone-alt fa-2x text-primary-front me-4"></i>
                                        <div>
                                            <h4>Nous appeler</h4>
                                            <p className="mb-0 fs-5" style={{letterSpacing: "1px"}}>+261 32 xx xxx xx</p>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-xl-5 wow fadeInRight" data-wow-delay="0.2s">
                        <div className="bg-primary rounded-front position-relative overflow-hidden">
                            <img src="./assets/images/front/about(1).jpg" className="img-fluid rounded-md w-100" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* About End */}

        {/* Services Start */}
        <div className="container-fluid service pb-5" id="service">
            <div className="container pb-5">
                <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{maxWidth: "800px;"}}>
                    <h4 className="text-primary-front">Notre Services</h4>
                    <h1 className="display-5 mb-4">Profiter des meilleurs services</h1>
                    <p className="mb-0">Nos services vous offrent une vision complète de votre consommation énergétique. De l'évaluation de vos besoins actuels à la prédiction de votre consommation future, nos outils sont conçus pour vous aider à optimiser et gérer efficacement vos ressources énergétiques. Que ce soit pour suivre vos habitudes de consommation ou planifier pour demain, nous vous accompagnons dans chaque étape pour une énergie plus durable et maîtrisée.
                    </p>
                </div>
                <div className="">
                    <div className="row">
                        <div className="col-md-6">
                        <div className="service-item  m-2" data-wow-delay="0.2s">
                            <div className="service-img">
                                <img src="./assets/images/front/diment.jpg" className="img-fluid rounded-top w-100" style={{height:"337px"}} alt="Image"/>
                            </div>
                            <div className="rounded-bottom p-4">
                                <a href="#" className="h4 d-inline-block mb-4">Evaluation de consommation</a>
                                <p className="mb-4">Évaluez votre installation vous-même, avec l'expertise d'un professionnel, grâce à notre web app intuitive.
                                </p>
                                <NavLink className="btn btn-primary rounded-pill py-2 px-4" to="/installation">Commencer</NavLink>
                            </div>
                        </div>
                        </div>
                        <div className="col-md-6">
                        <div className="service-item m-2" data-wow-delay="0.4s">
                            <div className="service-img">
                                <img src="./assets/images/front/service(2).jpg" style={{height:"337px"}} className="img-fluid rounded-top w-100" alt="Image"/>
                            </div>
                            <div className="rounded-bottom p-4">
                                <a href="#" className="h4 d-inline-block mb-4">Services IA</a>
                                <p className="mb-4">Anticipez vos besoins énergétiques avec précision grâce à des prédictions basées sur des données en temps réel et des modèles avancés.
                                </p>
                                <NavLink className="btn btn-primary rounded-pill py-2 px-4" to="/excel">Commencer</NavLink>
                            </div>
                        </div>
                        </div>
                    </div>
                        
                        
                </div>
            </div>
        </div>
        {/* Services End */}

        {/* Team Start */}
        {/* <div className="container-fluid team pb-5">
            <div className="container pb-5">
                <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{maxWidth: "800px;"}}>
                    <h4 className="text-primary-front">Notre équipe</h4>
                    <h1 className="display-5 mb-4">Faire notre rencontre</h1>
                    <p className="mb-0">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur adipisci facilis cupiditate recusandae aperiam temporibus corporis itaque quis facere, numquam, ad culpa deserunt sint dolorem autem obcaecati, ipsam mollitia hic.
                    </p>
                </div>
                <div className="row g-4">
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                        <div className="team-item">
                            <div className="team-img">
                                <img src="./assets/images/front/team-1.jpg" className="img-fluid" alt=""/>
                            </div>
                            <div className="team-title">
                                <h4 className="mb-0">David James</h4>
                                <p className="mb-0">Profession</p>
                            </div>
                            <div className="team-icon">
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-linkedin-in"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-0" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.4s">
                        <div className="team-item">
                            <div className="team-img">
                                <img src="./assets/images/front/team-2.jpg" className="img-fluid" alt=""/>
                            </div>
                            <div className="team-title">
                                <h4 className="mb-0">David James</h4>
                                <p className="mb-0">Profession</p>
                            </div>
                            <div className="team-icon">
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-linkedin-in"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-0" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.6s">
                        <div className="team-item">
                            <div className="team-img">
                                <img src="./assets/images/front/team-3.jpg" className="img-fluid" alt=""/>
                            </div>
                            <div className="team-title">
                                <h4 className="mb-0">David James</h4>
                                <p className="mb-0">Profession</p>
                            </div>
                            <div className="team-icon">
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-linkedin-in"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-0" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                        <div className="team-item">
                            <div className="team-img">
                                <img src="./assets/images/front/team-4.jpg" className="img-fluid" alt=""/>
                            </div>
                            <div className="team-title">
                                <h4 className="mb-0">David James</h4>
                                <p className="mb-0">Profession</p>
                            </div>
                            <div className="team-icon">
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href=""><i className="fab fa-linkedin-in"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-0" href=""><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
        {/* Team End */}

        {/* Testimonial Start */}
        <div className="container-fluid testimonial pb-5">
            <div className="container pb-5">
                <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{maxWidth: "800px;"}}>
                    <h4 className="text-primary-front">Avis</h4>
                    <h1 className="display-5 mb-4">Notre client</h1>
                    <p className="mb-0">Lisez ici les avis que nos visiteurs nous ont laissé durant leurs utilisation de notre application.
                    </p>
                </div>
                <div className="row">
                    
                        {infoClient && infoClient.map((item, id)=>{
 
                            return<div className="col-md-4" key={id}> 
                            <div className="card p-2">
                            <div className="card-header text-center">
                                <i className='fa fa-user' style={{fontSize:"3rem"}}></i>
                            </div>
                            <div className="card-content">
                                <h5 className='text-center'>{item.nom} {item.prenom}</h5>
                                <p className='text-center'>{item.commentaire}</p>
                                <div className="d-flex mt-3 align-items-center justify-content-between">
                                    <p>Avis: {item.satisfaction}/5</p>
                                   <p className='m-0'>recommandation : {item.recommandation}/10</p>
                                </div>
                            </div>
                        </div>
                        </div>
                        })}
                </div>
                {/* <div className="owl-carousel testimonial-carousel wow fadeInUp" data-wow-delay="0.2s">
                    {infoClient.length>0 && infoClient.map(()=>(
                        <div className="testimonial-item">
                        <div className="testimonial-quote-left">
                            <i className="fas fa-quote-left fa-2x"></i>
                        </div>
                        <div className="testimonial-img">
                            <img src="./assets/images/front/testimonial-1.jpg" className="img-fluid" alt="Image"/>
                        </div>
                        <div className="testimonial-text">
                            <p className="mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis blanditiis excepturi quisquam temporibus voluptatum reprehenderit culpa, quasi corrupti laborum accusamus.
                            </p>
                        </div>
                        <div className="testimonial-title">
                            <div>
                                <h4 className="mb-0">Person Name</h4>
                                <p className="mb-0">Profession</p>
                            </div>
                            <div className="d-flex text-primary-front">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                        </div>
                        <div className="testimonial-quote-right">
                            <i className="fas fa-quote-right fa-2x"></i>
                        </div>
                    </div>
                    ))}
                </div> */}
            </div>
        </div>
        {/* Testimonial End */}

        {/* Footer Start */}
        <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
            <div className="container py-5 border-start-0 border-end-0" style={{border: "1px solid", borderColor: "rgb(255, 255, 255, 0.08);"}}>
                <div className="row g-5">
                    <div className="col-md-6 col-lg-6 col-xl-4">
                        <div className="footer-item">
                            <a href="#" className="p-0">
                                    <img src="./assets/images/front/logo.jpeg" style={{borderRadius:"50% ", width:"70px", height:"70px"}} alt=""/>
                                {/* <img src="img/logo.png" alt="Logo"> */}
                            </a>
                            <p className="mb-4 text-light">Cette site fait l'intemédiaire entre notre application de prédiction et de dimensionnement.</p>
                        </div>
                    </div>
                    {/* <div className="col-md-6 col-lg-6 col-xl-2">
                        <div className="footer-item">
                            <h4 className="text-white mb-4">Quick Links</h4>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> About Us</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Feature</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Attractions</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Tickets</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Blog</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Contact us</a>
                        </div>
                    </div> */}
                    {/* <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="footer-item">
                            <h4 className="text-white mb-4">Support</h4>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Privacy Policy</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Terms & Conditions</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Disclaimer</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Support</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> FAQ</a>
                            <a href="#"><i className="fas fa-angle-right me-2"></i> Help</a>
                        </div>
                    </div> */}
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="footer-item">
                            <h4 className="text-white mb-4">Contact Info</h4>
                            <div className="d-flex align-items-start">
                                <i className="fas fa-map-marker-alt text-primary-front me-3 mt-2"></i>
                                <p className="text-white mb-0">LOT IVL 176 N, Anosivavaka First Floor, Antananarivo 101 Madagascar</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fas fa-envelope text-primary-front me-3"></i>
                                <p className="text-white mb-0">s.hafizat@wattec.mg</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fa fa-phone-alt text-primary-front me-3"></i>
                                <p className="text-white mb-0">(+261) 32 91 591 56</p>
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <i className="fab fa-firefox-browser text-primary-front me-3"></i>
                                <p className="text-white mb-0">www.wattec.mg</p>
                            </div>
                            {/* <div className="d-flex">
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i className="fab fa-facebook-f text-white"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i className="fab fa-twitter text-white"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i className="fab fa-instagram text-white"></i></a>
                                <a className="btn btn-primary btn-sm-square rounded-circle me-0" href="#"><i className="fab fa-linkedin-in text-white"></i></a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Footer End */}
        
        {/* Copyright Start */}
        <div className="container-fluid copyright py-4">
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-md-0">
                        <span className="text-white"><a href="#" className=" text-white"><i className="fas fa-copyright text-light me-2"></i>HAFIZAT 2024</a>| Tous droit reservé.|</span>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Back to Top --> */}
        <a href="#" className="btn btn-primary btn-lg-square rounded-circle back-to-top"><i className="fa fa-arrow-up"></i></a>   
        </div>
    );
};

export default StartPage;