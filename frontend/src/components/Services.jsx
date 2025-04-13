import React from "react";
import "./TeamsApp.css";

function Services() {
    let message = `Our research team varries from Biomedical Science, Biomedical Engineering \n and Artificial Intelligence and Web Developement`;
    return (
        <div className="team-section">
            <section className="section-white">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h2 className="text-2xl text-gray-700 font-semibold text-center mb-3">The Team Behind MotifXplorer</h2>
                            <p className="text-1xl text-gray-700 font-semibold text-center mb-3">{message}</p>
                        </div> 
                        <div className="col-sm-6 col-md-4">
                            <div className="team-item">
                                <img src="images/motoki.jpg" class="team-img" alt="pic" />
                                <h3>Dr. MOTOKI TAKAKU</h3>
                                <div className="team-info"><p>Assistant professor at University of North Dakota School of Medicine and Health Sciences</p></div>
                                <p>Dr. Motoki is the supervisor of this research work, skilled in Protein Purification, Cell Biology, Biochemistry, Molecular Biology, Genomics, Bioinformatics. </p>
                                <ul className="team-icon">
                                    <li><a href="https://www.linkedin.com/in/motoki-takaku-27837114a/" className="linkedin"><i className="fa fa-linkedin"></i></a></li>
                                    <li><a href="https://scholar.google.com/citations?user=EGtPkLQAAAAJ&hl=en" className="google"><i className="fa fa-google"></i></a></li>
                                </ul>
                            </div>
                        </div> 
                        <div className="col-sm-6 col-md-4">
                            <div className="team-item">
                                <img src="images/nazim.jpg" className="team-img" alt="pic" />
                                <h3>Nazim A. Belabbaci</h3>
                                <div className="team-info"><p>Co-Founder at DeadLine Technologies, Ph.D in Computer Science, Embedded Software Engineer</p></div>
                                <p>A highly driven tech enthusiast and a PhD Research Assistant at the University of Massachusetts Lowell, Nazim is committed to exploring innovative ways to apply new technologies such as Artificial Intelligence, Internet of Things, and Virtual Reality to the healthcare and biomedical fields.</p>
                                <ul className="team-icon">
                                    <li><a href="https://www.linkedin.com/in/nazim-a-belabbaci-357b03148/" className="linkedin"><i className="fa fa-linkedin"></i></a></li>
                                    <li><a href="https://scholar.google.com/citations?user=f7QBAtEAAAAJ&hl=en" className="google"><i className="fa fa-google"></i></a></li>
                                    <li><a href="https://github.com/NazimBL" className="github"><i className="fa fa-github"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-4">
                            <div className="team-item">
                                <img src="images/mounir.jpg" className="team-img" alt="pic" />
                                <h3>Mounir OUADI</h3>
                                <div className="team-info"><p>AI-Hardware Acceleration Engineer at Infinite Orbits, AI Research Developer</p></div>
                                <p>A Computer Engineering fresh graduate, currently working in AI Hardware Acceleration in FPGAs for Space Navigation Satellites, highly interested in integrating AI in biomedical field and in Edge-AI biomedical solutions.</p>
                                <ul className="team-icon">
                                    <li><a href="https://www.linkedin.com/in/mounir-ouadi/" className="linkedin"><i className="fa fa-linkedin"></i></a></li>
                                    <li><a href="https://github.com/mounirouadi" className="github"><i className="fa fa-github"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;
