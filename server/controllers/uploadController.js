const cloudinary =
    require("../config/cloudinary");

const asyncHandler =
    require("../middleware/asyncHandler");

const {
    successResponse,
} =
    require("../utils/apiResponse");

const MESSAGES =
    require("../constants/messages");


const uploadImage =
    asyncHandler(async (req, res) => {

        if (
            !req.files ||
            req.files.length === 0
        ) {

            res.status(400);

            throw new Error(
                MESSAGES.UPLOAD.NO_IMAGES
            );

        }


        const uploadedImages = [];


        for (const file of req.files) {

            const uploadResult =
                await cloudinary
                    .uploader
                    .upload(

                        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,

                        {
                            folder:
                                "technoy/products",
                        }

                    );


            uploadedImages.push({

                url:
                    uploadResult.secure_url,

                publicId:
                    uploadResult.public_id,

            });

        }


        return successResponse(

            res,

            {
                images:
                    uploadedImages,
            },

            MESSAGES.UPLOAD.SUCCESS

        );

    });


const deleteImage =
    asyncHandler(async (req, res) => {

        const {
            publicId,
        } =
            req.body;


        if (
            !publicId ||
            typeof publicId !== "string"
        ) {

            res.status(400);

            throw new Error(
                "Image public ID is required."
            );

        }


        const result =
            await cloudinary
                .uploader
                .destroy(
                    publicId
                );


        if (
            ![
                "ok",
                "not found",
            ].includes(
                result.result
            )
        ) {

            res.status(400);

            throw new Error(
                "Unable to delete image."
            );

        }


        return successResponse(

            res,

            null,

            "Image deleted successfully"

        );

    });


module.exports = {

    uploadImage,

    deleteImage,

};