const multer =
    require("multer");


const storage =
    multer.memoryStorage();


const fileFilter = (
    req,
    file,
    callback
) => {

    if (
        file.mimetype.startsWith(
            "image/"
        )
    ) {

        return callback(
            null,
            true
        );

    }


    const error =
        new Error(
            "Only image files are allowed."
        );


    callback(
        error,
        false
    );

};


const upload =
    multer({

        storage,

        limits: {

            fileSize:
                5 *
                1024 *
                1024,

        },

        fileFilter,

    });


module.exports =
    upload;