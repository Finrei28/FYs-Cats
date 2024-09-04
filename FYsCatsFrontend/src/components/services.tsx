import axios from 'axios';
const URL = import.meta.env.VITE_BASE_URL;

type loginProps = {
    userName: string;
    password: string;
};

type ImageProps = {
    name: string;
    imageValue: File;
}

type Comment = {
    _id?: string;
    imageId: string;
    comment: string;
    userId: string | null;
    usersName: string | null;
    postedDate?: Date;
}

type User = {
    userName: string;
    name: string;
    password: string;
    email: string;
}


export const getImages = async () => {
    try {
        const { data: { images } } = await axios.get(`${URL}/api/v1/images`);
        return {success:'true', images:images}
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {success:'false', error: error.response.data.msg }
        } else {
            // Handle unexpected error types
            return {success:'false', error: 'An unexpected error occurred' }
        }
    }
};

export const loginService = async ({ userName, password }: loginProps) => {
    
    try {
        const result = await axios.post(`${URL}/api/v1/admin/login`, { userName, password } , {
            withCredentials: true
        });
        if (result.data) {
            const id = result.data.user.userId
            const name = result.data.user.name
            const role = result.data.user.role
            localStorage.setItem('name', name);
            localStorage.setItem('id', id);
            return {success:'true', name:name, role:role, id:id}
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {success:'false', error: error.response.data.msg }
        } else {
            // Handle unexpected error types
            return {success:'false', error: 'An unexpected error occurred' }
        }
    }
};

export const logout = async () => {
    try {
        await axios.post(`${URL}/api/v1/admin/logout`, {}, {
            withCredentials: true
        });
        localStorage.removeItem('name');
        localStorage.removeItem('id')
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
};

export const addImage = async ({name, imageValue}: ImageProps) => {
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', imageValue); // Append the file to FormData

        // Upload image to the backend
        const { data: { image: { src } } } = await axios.post(`${URL}/api/v1/images/uploadImage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const image = {name, image:src}
        await axios.post(`${URL}/api/v1/images/saveImage`, image)
        return { success: true, image };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
}

export const deleteImages = async (imageIds:string[], imageURLs:string[]) => {
    try {
        const response = await axios.delete(`${URL}/api/v1/images/delete`, {data: { imageIds, imageURLs }})
        return {status: response.status, msg: response.data.msg}
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
    
}

export const getRole = async () => {
    try {
        const response = await axios.get(`${URL}/api/v1/admin/getRole`, {
            withCredentials: true
        })
        return {success: 'true', role: response.data.role}
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {success: 'true', error: error.response.data.msg }
        } else {
            // Handle unexpected error types
            return {success: 'true', error: 'An unexpected error occurred' }
        }
    }
}

export const editImageAPI = async (id:string, name:string) => {
    try {
        await axios.patch(`${URL}/api/v1/images/${id}`, {name})
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
}

export const sendForgotEmail = async (email:string) => {
    try {
        await axios.post(`${URL}/api/v1/admin/forgotPassword`, {email})
        return 'true'
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
}

export const resetPassword = async (password:string, token:string, email:string) => {
    try {
        await axios.post(`${URL}/api/v1/admin/resetPassword`, {
            password,
            token,
            email,
        }); 
        return 'true'
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
}

export const getCommentsAPI = async (id:string) => {
    try {
        const response = await axios.get(`${URL}/api/v1/comments/${id}`)
        const comments = response.data.comments;
        return ({success:'true', comments:comments})
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return  ({success:'false', error:error.response.data.msg })
        } else {
            // Handle unexpected error types
            return ({success:'false', error: 'An unexpected error occurred' })
        }
    }
}

export const sendCommentAPI = async (comment: Comment) => {
    try {
        await axios.post(`${URL}/api/v1/comments`, {imageId: comment.imageId, comment:comment.comment, userId:comment.userId, usersName:comment.usersName})
        return 'true'
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
    }

export const createAccountAPI = async (user: User) => {
    try {
        await axios.post(`${URL}/api/v1/user`, user)
        return {success: 'true'}
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {success: 'false', error: error.response.data.msg}
        } else {
            // Handle unexpected error types
            return {success: 'false', error: 'An unexpected error occurred'}
        }
    }
}

export const verifyEmailAPI = async (userName:string, code:string) => {
    try {
        await axios.post(`${URL}/api/v1/user/registerVerification`, {userName, verificationCode: code})
        return {success: 'true'}
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {success: 'false', error: error.response.data.msg}
        } else {
            // Handle unexpected error types
            return {success: 'false', error: 'An unexpected error occurred'}
        }
    }
}

export const resendVerificationCodeAPI = async (userName: string) => {
    try {
        await axios.post(`${URL}/api/v1/user/resendVerificationCode`, {userName})
        return {success: 'true'}
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {success: 'false', error: error.response.data.msg}
        } else {
            // Handle unexpected error types
            return {success: 'false', error: 'An unexpected error occurred'}
        }
    }
}