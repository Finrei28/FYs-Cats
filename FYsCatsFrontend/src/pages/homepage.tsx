import { useEffect, useState } from "react"
import { getImages } from "../components/services";
import '../index.css'
import { useSearchParams } from "react-router-dom";
import { useImageContext } from '../components/imageContext';

type Image = {
    _id: string,
    image: string,
    addedDate: Date,
    name: string,
}

type HomepageProp = {
    homeFirstRender: boolean
    setHomeFirstRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function homepage({homeFirstRender, setHomeFirstRender}: HomepageProp) {
    const { setCurrentImage } = useImageContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const imageNum = parseInt(searchParams.get('imageNum') || '0', 10);
    const [images, setImages] = useState<Image[]>([]);
    useEffect(() => {
        const getImage = async () => {
            const images = await getImages();
            if (images.success === 'true') {
                setImages(images.images);
            }

        };
        getImage();
    }, []);

    let sortedImages:Image[] = []
    if (images.length > 0) {
        sortedImages = images
            .slice() // Create a copy of the array
            .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
    }

    const updateImage = (index: number) => {
        if (sortedImages.length === 0) return; // Exit if there are no images
        const newIndex = (index + sortedImages.length) % sortedImages.length; // Ensure index wraps around
        setSearchParams({ imageNum: newIndex.toString() });
    };

    const nextSlide = () => {
        if (sortedImages.length > 0) {
            updateImage(imageNum + 1);
            if (imageNum === sortedImages.length-1) {
                setHomeFirstRender(false);
            }
        }
    };
    
    
    const prevSlide = () => {
        if (sortedImages.length > 0 && !(imageNum === 0 && homeFirstRender)) {
            updateImage(imageNum - 1);
        }
    };

    useEffect(() => {
        if (sortedImages.length > 0) {
            const interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
            return () => clearInterval(interval); // Clean up interval on unmount
        }
    }, [imageNum, images]);

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (event.deltaY < 0) {
                prevSlide(); // Scroll up
            } else if (event.deltaY > 0) {
                nextSlide(); // Scroll down
            }
        };

        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [images, imageNum]);


    // Ensure only the current slide is displayed
    const currentImage = sortedImages[imageNum];
    useEffect(() => {
        if (currentImage) {
            setCurrentImage(currentImage);
        }
    }, [currentImage])

    return (
        <div className="homepage-container">
            {currentImage ? (
                <div className="picture active">
                    <img src={currentImage.image} alt={currentImage.name} draggable="false"/>
                </div>
            ) : (
                <div className="loading-container">
                    <p className="loading-text">Loading image</p>
                </div>
            )}
            <button className="prev homepage-button" onClick={prevSlide}>&#10094;</button>
            <button className="next homepage-button" onClick={nextSlide}>&#10095;</button>
        </div>
    );
}