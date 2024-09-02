import { useEffect, useState } from 'react';
import { getImages } from '../components/services';
import ImageModal from '../components/imageModal';
import AddImageModal from '../components/addImageModal';
import DeleteConfirmation from '../components/deleteConfirmation';
import {dateFormatter} from '../utils/dateFormatter';
import '../index.css';
import LocalStates from '../utils/localStates';
import Message from '../utils/message';
import {useUser} from '../components/adminContext'
import EditModal from '../components/editModal'

type Image = {
    _id: string;
    image: string;
    addedDate: Date;
    name: string;
};

export default function fullcollectionpage() {
    const { success, setSuccess, error, setError } = LocalStates();
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [selectedImages, setSelectedImages] = useState<Set<Image>>(new Set());
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [addModal, setAddModal] = useState<boolean>(false);
    const [message, setMessage] = useState('');
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [visibleImages, setVisibleImages] = useState<Image[]>([]);
    const {user} = useUser()
    const [edit, setEdit] = useState<boolean>(false);
    const [editImage, setEditImage] = useState<Image | null>(null);

    

    const handleCheckboxChange = (image: Image) => {
        setSelectedImages(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(image)) {
                newSelected.delete(image);
            } else {
                newSelected.add(image);
            }
            return newSelected;
        });
    };
    const fetchImages = async () => {
        try {
            const images = await getImages();
            if (images.success === 'true') {
                const sortedImages = images.images
                    .slice() // Create a copy of the array
                    .sort((a:Image, b:Image) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
                setImages(sortedImages);
                setLoading(false);
                setVisibleImages(sortedImages.slice(0, 12))
            }
            else{
                setError(true)
                setMessage(images.error)
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchImages();
    }, [success]);

    useEffect(() => {
        const container = document.querySelector('.image-gallery');

        const handleScroll = () => {
            if (container) {
                const bottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 40;
                if (bottom && hasMore) {
                    loadMoreImages();
                }
            }
        };
    
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [hasMore, page, images]);

    const loadMoreImages = () => {
        const newPage = page + 1;
        const newVisibleImages = images.slice(0, newPage * 12);
        
        setVisibleImages(newVisibleImages);
        setPage(newPage);
        
        if (newVisibleImages.length >= images.length) {
            setHasMore(false);
        }
    };

    const handleImageClick = (image: Image) => {
        if (!isSelected) {
            setSelectedImage(image);
          }
        else {
            handleCheckboxChange(image);
        }
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleSelect = () => {
        if (!isSelected) {
            setSelectedImages(new Set())
        }
        setIsSelected(!isSelected);
        
    }

    const handleDelete = () => {
        setDeleteModal(true)
    }

    const closeDeleteModal = () => {
        setDeleteModal(false)
    }

    const closeAddModal = () => {
        setAddModal(false)
    }

    const handleAddImage = () => {
        setAddModal(true);
    }

    const closeEditModal = () => {
        setEdit(false)
    }
    if (loading) return (
        <div className="loading-container">
            <p className="loading-text">Loading images...</p>
        </div>  
    );


    return (

        <div className='gallery-container'>
            <div className="image-gallery">
                {user ==='admin' && 
                    <div className='gallery-buttons'>
                        <button onClick={handleSelect} className='select-button'>{isSelected? 'Deselect': 'Select'}</button>
                        {isSelected && selectedImages.size > 0 ? (
                            <button onClick={handleDelete} className='delete-button'>
                                Delete
                            </button>   
                        )
                        :
                        (
                            <button onClick={handleAddImage} className='addImage-button'>
                                Add New Image
                            </button>  
                            
                        )}
                    </div>
                }
                {visibleImages.length > 0 ? (
                    <div className="image-grid">
                        {visibleImages.map(image => (
                            <div
                                key={image._id}
                                className="image-item"
                                onClick= {() => handleImageClick(image)}
                            >
                                {isSelected && (
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.has(image)}
                                        onChange={() => handleCheckboxChange(image)}
                                        onClick={(e) => e.stopPropagation() } // Prevents triggering the image click
                                    />
                                )}
                                    
                                <img src={image.image} alt={image.name} draggable="false" loading='lazy'
                                />
                                <p>{image.name}</p>
                                <p>posted {dateFormatter(image.addedDate)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No images available</p>
                )}
                {selectedImage && (
                    <ImageModal
                        selectedImage={selectedImage}
                        onClose={handleCloseModal}
                        setDeleteModal={setDeleteModal}
                        setEdit={setEdit}
                        setSelectedImage={setSelectedImage}
                        setEditImage={setEditImage}
                    />
                )}
                {addModal && (
                    <AddImageModal
                    setSuccess={setSuccess}
                    setMessage={setMessage}
                    onClose={closeAddModal}
                    />
                )}
                {deleteModal && (
                    <DeleteConfirmation
                        selectedImages={selectedImages}
                        selectedImage={selectedImage}
                        setMessage={setMessage}
                        setSuccess={setSuccess}
                        setSelectedImages={setSelectedImages}
                        setSelectedImage={setSelectedImage}
                        fetchImages={fetchImages}
                        onClose={closeDeleteModal}
                    />
                )}
                {edit && (
                    <EditModal
                        setMessage={setMessage}
                        setSuccess={setSuccess}
                        onClose={closeEditModal}
                        setSelectedImage={setSelectedImage}
                        setEditImage={setEditImage}
                        editImage={editImage}
                        setError={setError}
                    />
                )}
            </div>
            <div>
            {(success || error) && <Message message={message} setMessage={setMessage} setsuccess={setSuccess} success={success} setError={setError}/>}
            </div>
        </div>
    );
};
