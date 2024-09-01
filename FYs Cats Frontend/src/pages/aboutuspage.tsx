export default function aboutuspage() {
    const defaultImage = "https://res.cloudinary.com/dpwtcr4cz/image/upload/v1724743874/FYs-Cats/tmp-1-1724743876809_qghgoq.jpg"
    const alice = "https://res.cloudinary.com/dpwtcr4cz/image/upload/v1724848884/FYs-Cats/tmp-1-1724848883192_jtntr8.jpg"
    const chloe = "https://res.cloudinary.com/dpwtcr4cz/image/upload/v1724848936/FYs-Cats/tmp-2-1724848935103_qzeezk.jpg"
    return (
        <div className="about-us-container" style={{
            backgroundImage: `url(${defaultImage})`
        }}>
            
            <div className="about-us-content">
                <h1>About Us</h1>
                <p>Our names are Alice and Chloe and we are sisters</p>
                <div className="image-grid">
                    <div className="image-item about-us">
                        <img src={chloe} draggable="false"/>
                        <p>Chloe: I was born on the 29/09/2023. I like being at my own pace. If you come near me, I might hiss at you!</p>
                    </div>
                    <div className="image-item about-us">
                            <img src={alice} draggable="false"/>
                            <p>Alice: I was born on the 29/09/2023. I like waking my mum and dad up in the morning. My butt is a bit smelly so be careful!</p>
                        </div>
                </div>
                
            </div>
        </div>
    );
}