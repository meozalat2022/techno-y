import api from
    "@/lib/api";


const sendMessage =
    async (
        contactData
    ) => {

        const response =
            await api.post(
                "/contact",
                contactData
            );


        return response.data;

    };


const contactService = {

    sendMessage,

};


export default contactService;