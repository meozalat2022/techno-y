import api from "@/lib/api";


const getBrands = async () => {

    const response =
        await api.get(
            "/brands"
        );


    return response.data;

};


const brandService = {

    getBrands,

};


export default brandService;