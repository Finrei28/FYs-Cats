import React, { useEffect, useState } from 'react';
import '../index.css'
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useUser } from './adminContext';
import {getCommentsAPI, sendCommentAPI} from './services'
import {dateFormatter} from '../utils/dateFormatter';
import { IoIosSend } from "react-icons/io";
import { useAuth } from '../components/authContext';

type Image = {
    _id: string;
    image: string;
    addedDate: Date;
    name: string;
}

type Comment = {
    _id?: string;
    imageId: string;
    comment: string;
    userId: string | null;
    usersName: string | null;
    postedDate?: Date;
}

interface ImageModalProps {
    selectedImage: Image;
    onClose: () => void;
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>;
    setEditImage: React.Dispatch<React.SetStateAction<Image | null>>;
}

const ImageModal: React.FC<ImageModalProps> = ({ selectedImage, onClose, setDeleteModal, setEdit, setSelectedImage, setEditImage}) => {
    const {user} = useUser()
    const {id, name} = useAuth()
    const [comments, setComments] = useState<Array<Comment>>(new Array())
    const [comment, setComment] = useState('')
    const handleEdit = () => {
        setEdit(true)
        setEditImage(selectedImage)
        setSelectedImage(null)
    }

    const getComments = async (id:string) => {
        const comments = await getCommentsAPI(id);
        setComments(comments.comments)

    }

    useEffect(() => {
        getComments(selectedImage?._id)
    }, [])

    const handleSendComment = async (comment: Comment) => {
        if (!comment.comment) {
            return
        }
        const result = await sendCommentAPI(comment);
        if (result === 'true') {
            getComments(selectedImage?._id)
            setComment('')
            return
        }

    }


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {user === 'admin' && (
                <div className="image-modal-tool">
                    <div className="edit-button">
                    <CiEdit onClick={handleEdit} />
                    </div>
                    <div className="modal-delete-button">
                    <MdDeleteOutline onClick={() => setDeleteModal(true)} />
                    </div>
                </div>
                )}
                <div className="image-container">
                    <img src={selectedImage?.image} alt={selectedImage?.name} draggable="false"/>
                </div>
                <div className="divider"></div>
                <div className='comments-container'>
                    <div className='title comments'>
                        <h1>Comments</h1>
                    </div>
                        <div className='comment-section'>
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment._id}>
                                        <p className='comment-user'>{comment.usersName}</p>
                                        <p className='comment-comment'>{comment.comment}</p>
                                        <p className='comment-date'>{comment.postedDate ? dateFormatter(comment.postedDate) : ''}</p>
                                        <div className={comments[comments.length-1] === comment ? 'comment-divider last' : 'comment-divider'}/>
                                    </div>
                                ))
                            )
                            :
                            (
                                <p style={{textAlign:'center'}}>No Comments</p>
                            ) }

                        </div>
                        <div className="comment-input-container"> 
                            <textarea
                                
                                name="comment-input"
                                value={comment}
                                className="comment-input"
                                placeholder={id ? 'Send your thoughts!' : 'Please sign in to start commenting!'}
                                disabled={!id}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent default form submission
                                        handleSendComment({ comment, userId: id, usersName: name, imageId: selectedImage._id });
                                    }
                                }}
                            />
                            <IoIosSend type='onsubmit' className="comment-button" onClick={() => handleSendComment({comment, userId:id, usersName:name, imageId:selectedImage._id})}/>
                        </div>
                </div>
            </div>
        </div>

    );
};

export default ImageModal;
