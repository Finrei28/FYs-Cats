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
import { useSearchParams } from 'react-router-dom';
import { FcSearch } from "react-icons/fc";

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
    const {user} = useUser();
    const [edit, setEdit] = useState<boolean>(false);
    const [editImage, setEditImage] = useState<Image | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchValue = searchParams.get('search') || '';

    const searchedImages = images.filter(image => {
        return image.name.toLowerCase().includes(searchValue.toLowerCase())
    })

    useEffect(() => {
        setVisibleImages(searchedImages.slice(0, 12))
        if (images.length > visibleImages.length) {
            setHasMore(true)
        }
    },[searchValue])
    

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
        const images = await getImages();
        if (images.success === 'true') {
            setError(false)
            setMessage('')
            const sortedImages:Image[] = images.images
                .slice() // Create a copy of the array
                .sort((a:Image, b:Image) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
            setImages(sortedImages.filter(image => {
                return image.name.toLowerCase().includes(searchValue.toLowerCase())
            }));
            setLoading(false);
            if (searchValue) {
                setVisibleImages(searchedImages.slice(0, 12))
            }
            else {
                setVisibleImages(sortedImages.slice(0, 12))
            }
        }
        else{
            setLoading(true)
            setError(true)
            setMessage(images.error)
        }
    };

    useEffect(() => {
        fetchImages()
        if (loading) {
            const interval = setInterval(() => {
                fetchImages()
            }, 5000);
            return () => clearInterval(interval)
        }
    }, [loading, success]);

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
    }, [hasMore, page, searchedImages]);

    const loadMoreImages = () => {
        const newPage = page + 1;
        let newVisibleImages:Image[] = []
        if (searchValue) {
            newVisibleImages = searchedImages.slice(0, newPage * 12);
        }
        else {
            newVisibleImages = images.slice(0, newPage * 12);
        }
        
        setVisibleImages(newVisibleImages);
        setPage(newPage);
        
        if (newVisibleImages.length >= searchedImages.length) {
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
            <p className="loading-text">Loading images</p>
        </div>  
    );

    return (

        <div className='gallery-container'>
            <div className={searchedImages.length > 0 ? "image-gallery": "image-gallery-inactive"}>
                <div className='gallery-tools'>
                    {user === 'admin' ? (
                        <div className='gallery-buttons'>
                            <div className='left-group'>
                                <button onClick={handleSelect} className='select-button'>
                                    {isSelected ? 'Deselect' : 'Select'}
                                </button>
                                <div className='search-container'>
                                    <input
                                    type='text'
                                    name='search-bar'
                                    placeholder='Search here'
                                    className='search-bar'
                                    value={searchValue}
                                    onChange={(e) => setSearchParams({ search: e.target.value })}
                                    />
                                    <div className='search-icon'>
                                        <FcSearch />
                                    </div>
                                </div>
                            </div>
                            {isSelected && selectedImages.size > 0 ? (
                                <button onClick={handleDelete} className='delete-button'>
                                    Delete
                                </button>
                            ) : (
                                <button onClick={handleAddImage} className='addImage-button'>
                                    Add New Image
                                </button>
                            )}
                        </div>
                    )
                    :
                    (
                        <div className='search-container-alone'>
                            <input
                            name='search-bar'
                            placeholder='Search here'
                            className='search-bar-alone'
                            value={searchValue}
                            onChange={(e) => setSearchParams({ search: e.target.value })}
                            />
                            <div className='search-icon'>
                                <FcSearch />
                            </div>  
                        </div>
                    )
                    }
                    
                </div>
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
                    <div className='no-data-container'>
                        <p className="no-data">No images were found</p>
                    </div>
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
