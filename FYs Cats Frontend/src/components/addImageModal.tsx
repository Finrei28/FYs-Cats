import React, { ChangeEvent, FormEvent, useState } from 'react';
import '../index.css'
import FormRow from '../utils/formRow';
import {addImage} from './services'
import LocalStates from '../utils/localStates';

type AddImageModalProps = {
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}


const AddImageModal: React.FC<AddImageModalProps> = ({ setSuccess, setMessage, onClose }) => {
    const {alert, showAlert, hideAlert} = LocalStates()
    const [file, setFile] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name:'',
        imageValue:''
    })
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'imageValue' && e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setFile(file);
          setPreviewSrc(URL.createObjectURL(file));  // Create a preview URL
        } 
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        
      };

      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        hideAlert();
        const { name } = formData;
        if (!name) {
            showAlert({text: `Please provide an Image Title`, type:'danger'})
            return
        }
    
        if (file) {
          const imageRequest = { name, imageValue: file };
          const result  = await addImage(imageRequest);
          if (result.success) {
            setMessage('Image has been added successfully')
            setSuccess(true)
            onClose()
        } else {
            showAlert({text: result, type:'danger'})
            // Optionally, display error to user or take other action
        }
        }
      };

    return (
        <div className="modal-overlay" >
            <div className="addimagemodal-content">
            <button className="modal-close" onClick={onClose}>✕</button>
            <form className="add-modal" onSubmit={handleSubmit}>
                <FormRow
                    type='text'
                    name='name'
                    label='Title'
                    value= {formData.name}
                    handlechange={handleChange}
                />
                <FormRow
                    type='file'
                    name='imageValue'
                    label='Upload Image'
                    value= {formData.imageValue}
                    handlechange={handleChange}
                />
                {previewSrc && <img src={previewSrc} alt="Image Preview" className='image-preview'/>}
                {alert.show &&  (
                <p className={`alert alert-${alert.type}`}>{alert.text}</p>
                )}
                <button type='submit' className='add-image-button'>Add New Image</button>
            </form>
            
            </div>
        </div>
    );
}

export default AddImageModal