import api from "@/lib/api";


const uploadImages = async files => {

    const formData =
        new FormData();


    files.forEach(file => {

        formData.append(
            "images",
            file
        );

    });


    const response =
        await api.post(
            "/upload",
            formData
        );


    return (
        response.data
            ?.data
            ?.images ||
        []
    );

};


const deleteImage = async publicId => {

    const response =
        await api.delete(
            "/upload",
            {
                data: {
                    publicId,
                },
            }
        );


    return response.data;

};


const uploadService = {

    uploadImages,

    deleteImage,

};


export default uploadService;