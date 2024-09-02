import React from 'react';
import {deleteImages} from './services'
import LocalStates from '../utils/localStates';

type Image = {
    _id: string;
    image: string;
    addedDate: Date;
    name: string;
}

type DeleteConfirmationProps = {
    selectedImages: Set<Image>
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedImages: React.Dispatch<React.SetStateAction<Set<Image>>>;
    fetchImages: () => void;
    onClose: () => void;
    selectedImage: Image|null;
    setSelectedImage: React.Dispatch<React.SetStateAction<Image|null>>;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ selectedImages, setMessage, setSuccess, setSelectedImages, fetchImages, onClose, selectedImage, setSelectedImage }) => {
    const {alert, showAlert, hideAlert} = LocalStates()
    const handleDeleteConfirmation = async () => {
        hideAlert()
        // Convert Set to Array
        let imageIds:string[] = []
        let imageURLs:string[] = []

        if (selectedImages.size > 0) {
            let images:Image[] = []
            images = Array.from(selectedImages);
            images.forEach((element:Image) => {
                imageIds.push(element._id)
                imageURLs.push(element.image)
            });
        }
        else if (selectedImage) {
            imageIds = [selectedImage._id]
            imageURLs = [selectedImage.image]
        }
    
        const response = await deleteImages(imageIds, imageURLs);
        
        if (response.status === 200) {
            setMessage(`${response.msg}`);
            setSuccess(true)
            onClose()
            setSelectedImage(null)
            //reload Images
            fetchImages();
        
            // Clear the selected images
            setSelectedImages(new Set());
        } else {
            showAlert({text: response, type:'danger'});
        }

    }

    return (
        <div className="modal-overlay">
            <div className="deleteconfirmationmodal-content">
                <button className="modal-close" onClick={onClose}>✕</button>
                <h1 className="delete-confirmation">You're about to delete {selectedImage?._id || selectedImages.size === 1 ? '1 Image' : `${selectedImages.size} Images`} </h1>
                <p className="delete-confirmation-message">Are you sure?</p>
                {alert.show &&  (
                <p className={`alert alert-${alert.type}`}>{alert.text}</p>
                )}
                <div className="delete-confirmation-buttons">
                    <button className="delete-confirmation-cancel" onClick={onClose}>Yeah Nah</button>
                    <button className="delete-confirmation-delete" onClick={handleDeleteConfirmation}>Delete</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteConfirmation