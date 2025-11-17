import React from 'react'

export const AboutUS = () => {
    return (
        <div>
            <section id="about" className="py-20 bg-base-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-heading font-bold text-base-content mb-4">
                            About PawsHome
                        </h2>
                        <p className="text-xl text-base-content/70 font-body max-w-3xl mx-auto">
                            PawsHome is a passionate community dedicated to connecting loving families with pets in need of a forever home. Our mission is to make pet adoption a simple, joyful, and safe experience for everyone.
                        </p>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop"
                                alt="Happy dog"
                                className="rounded-2xl shadow-lg w-full"
                            />
                        </div>
                        <div className="lg:w-1/2 font-body text-lg text-base-content/80">
                            <p className="mb-4">
                                We believe every pet deserves a second chance. Our platform features pets from trusted shelters and rescue organizations. We provide detailed profiles and a seamless adoption process to help you find your perfect match.
                            </p>
                            <p>
                                Beyond adoption, PawsHome is a hub for pet lovers. You can support our cause through donation campaigns, ensuring that every animal receives the care it needs until it finds its family. Join us in making a difference, one paw at a time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
