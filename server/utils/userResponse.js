const userResponse = (user) => ({

    _id:
        user._id,

    firstName:
        user.firstName,

    lastName:
        user.lastName,

    email:
        user.email,

    phone:
        user.phone,

    role:
        user.role,

});


module.exports =
    userResponse;