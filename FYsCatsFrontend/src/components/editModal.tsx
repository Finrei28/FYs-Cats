import React, { ChangeEvent, FormEvent, useState } from 'react';
import '../index.css'
import FormRow from '../utils/formRow';
import {editImageAPI} from './services'

type Image = {
    _id: string;
    image: string;
    addedDate: Date;
    name: string;
};

type EditModalProps = {
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setSelectedImage: React.Dispatch<React.SetStateAction<Image|null>>;
    setEditImage: React.Dispatch<React.SetStateAction<Image|null>>;
    editImage: Image|null;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: React.FC<EditModalProps> = ({setSuccess, onClose, setMessage, setSelectedImage, setEditImage, editImage, setError}) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!name) {
            setError(true)
            setMessage(`Please provide a name`)
            return;
        }
        if (editImage) {
            try {
                await editImageAPI(editImage?._id, name)
                setSelectedImage(editImage)
                setEditImage(null)
                setSuccess(true)
                setMessage(`Changes have been saved`)
                onClose()
            } catch (error) {
                
            }
        }
    }
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleClose = () => {
        setSelectedImage(editImage)
        setEditImage(null)
        onClose()
    }

    return (
        <div className="modal-overlay" >
            <div className="editimagemodal-content">
                <button className="modal-close" onClick={handleClose}>✕</button>
                <form className="add-modal" onSubmit={handleSubmit}>
                    <FormRow
                        type='text'
                        name='name'
                        label='Title'
                        value= {name}
                        handlechange={handleChange}
                    />
                    {editImage && <img src={editImage.image} alt="Image Preview" className='image-preview'/>}   
                    <button type='submit' className='add-image-button'>Save</button>
                </form>
            
            </div>
        </div>
    )
}

export default EditModal