import axios from 'axios';

type loginProps = {
    userName: string;
    password: string;
};

type ImageProps = {
    name: string;
    imageValue: File;
}

type Image = {
    _id: string;
    image: string;
    addedDate: Date;
    name: string;
}


export const getImages = async () => {
    try {
        const { data: { images } } = await axios.get(`/api/v1/images`);
        return images;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
};

export const loginService = async ({ userName, password }: loginProps) => {
    try {
        const result = await axios.post(`/api/v1/admin/login`, { userName, password });
        if (result.data) {
            localStorage.setItem('username', result.data.admin.userName);
            return 'true';
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
};

export const logout = async () => {
    try {
        await axios.post(`/api/v1/admin/logout`);
        localStorage.removeItem('username');
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
        const { data: { image: { src } } } = await axios.post(`/api/v1/images/uploadImage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const image = {name, image:src}
        await axios.post(`/api/v1/images/saveImage`, image)
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
        console.log(imageIds)
        console.log(imageURLs)
        const response = await axios.delete('/api/v1/images/delete', {data: { imageIds, imageURLs }})
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
        const response = await axios.get('/api/v1/admin/getRole')
        return response.data.role
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data.msg 
        } else {
            // Handle unexpected error types
            return 'An unexpected error occurred'
        }
    }
}

export const editImageAPI = async (id:string, name:string) => {
    try {
        await axios.patch(`/api/v1/images/${id}`, {name})
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
        await axios.post(`/api/v1/admin/forgotPassword`, {email})
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
        await axios.post(`/api/v1/admin/resetPassword`, {
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