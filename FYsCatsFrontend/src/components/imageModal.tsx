import React from 'react';
import '../index.css'
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useUser } from './adminContext';

type Image = {
    _id: string;
    image: string;
    addedDate: Date;
    name: string;
};

interface ImageModalProps {
    selectedImage: Image|null;
    onClose: () => void;
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>;
    setEditImage: React.Dispatch<React.SetStateAction<Image | null>>;
}

const ImageModal: React.FC<ImageModalProps> = ({ selectedImage, onClose, setDeleteModal, setEdit, setSelectedImage, setEditImage}) => {
    const {user} = useUser()

    const handleEdit = () => {
        setEdit(true)
        setEditImage(selectedImage)
        setSelectedImage(null)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content">
                <img src={selectedImage?.image} alt={selectedImage?.name} draggable="false" onClick={(e) => e.stopPropagation()}/>
                    {user && <>
                        <div className='image-modal-tool' onClick={(e) => e.stopPropagation()}>
                        <div className='edit-button' >
                            <CiEdit onClick={handleEdit}/>
                        </div>
                        <div className='modal-delete-button'>
                            <MdDeleteOutline onClick={() => setDeleteModal(true)}/>
                        </div>
                        </div>
                    </>
                    }
                
            </div>
            
        </div>
    );
};

export default ImageModal;
