const exactTranslations = {
    "Invalid email or password.":
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.",

    "Invalid credentials.":
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.",

    "Email or password is invalid.":
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.",

    "Email already exists":
        "يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.",

    "Email already exists.":
        "يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.",

    "Email is already registered.":
        "يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.",

    "Validation failed":
        "بعض البيانات المدخلة غير صحيحة. راجع الحقول وحاول مرة أخرى.",

    "Validation failed.":
        "بعض البيانات المدخلة غير صحيحة. راجع الحقول وحاول مرة أخرى.",

    "First name is required.":
        "الاسم الأول مطلوب.",

    "Last name is required.":
        "اسم العائلة مطلوب.",

    "Email is required.":
        "البريد الإلكتروني مطلوب.",

    "Password is required.":
        "كلمة المرور مطلوبة.",

    "Phone number is required.":
        "رقم الموبايل مطلوب.",

    "Reset token is required.":
        "رابط إعادة تعيين كلمة المرور غير صالح.",

    "Enter a valid Egyptian mobile number.":
        "أدخل رقم موبايل مصري صحيح مكوّن من 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015.",

    "A valid email address is required.":
        "أدخل بريدًا إلكترونيًا صحيحًا.",

    "First name must be between 2 and 50 characters.":
        "الاسم الأول يجب أن يكون بين حرفين و50 حرفًا.",

    "Last name must be between 2 and 50 characters.":
        "اسم العائلة يجب أن يكون بين حرفين و50 حرفًا.",

    "Password must be between 8 and 128 characters.":
        "كلمة المرور يجب أن تكون بين 8 و128 حرفًا.",

    "Email is too long.":
        "البريد الإلكتروني أطول من الحد المسموح.",

    "Password is too long.":
        "كلمة المرور أطول من الحد المسموح.",

    "Too many login attempts. Please try again later.":
        "تم إجراء محاولات تسجيل دخول كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",

    "Too many registration attempts. Please try again later.":
        "تم إجراء محاولات إنشاء حساب كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",

    "Too many registration attempts. Please try again later":
        "تم إجراء محاولات إنشاء حساب كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",

    "Too many password reset requests. Please try again later.":
        "تم إرسال طلبات كثيرة لإعادة تعيين كلمة المرور. انتظر قليلًا ثم حاول مرة أخرى.",

    "Too many reset password attempts. Please try again later.":
        "تم إجراء محاولات كثيرة لإعادة تعيين كلمة المرور. انتظر قليلًا ثم حاول مرة أخرى.",

    "Route not found":
        "تعذر الوصول إلى الخدمة المطلوبة.",

    "Unauthorized":
        "يرجى تسجيل الدخول أولًا.",

    "Not authorized":
        "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
};


const normalizeMessage = value =>
    String(
        value || ""
    ).trim();


const translateKnownMessage = message => {

    const normalized =
        normalizeMessage(
            message
        );


    if (!normalized) {
        return "";
    }


    if (
        exactTranslations[
            normalized
        ]
    ) {
        return exactTranslations[
            normalized
        ];
    }


    const lower =
        normalized
            .toLowerCase();


    if (
        lower.includes(
            "invalid email"
        ) &&
        lower.includes(
            "password"
        )
    ) {
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    }


    if (
        lower.includes(
            "invalid credentials"
        )
    ) {
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    }


    if (
        lower.includes(
            "email"
        ) &&
        (
            lower.includes(
                "already exists"
            ) ||
            lower.includes(
                "already registered"
            )
        )
    ) {
        return "يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.";
    }


    if (
        lower.includes(
            "token"
        ) &&
        (
            lower.includes(
                "expired"
            ) ||
            lower.includes(
                "invalid"
            )
        )
    ) {
        return "رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته.";
    }


    if (
        lower.includes(
            "too many"
        ) &&
        lower.includes(
            "login"
        )
    ) {
        return "تم إجراء محاولات تسجيل دخول كثيرة. انتظر قليلًا ثم حاول مرة أخرى.";
    }


    if (
        lower.includes(
            "too many"
        ) &&
        lower.includes(
            "password"
        )
    ) {
        return "تم إرسال طلبات كثيرة لإعادة تعيين كلمة المرور. انتظر قليلًا ثم حاول مرة أخرى.";
    }


    return normalized;
};


export default function getApiErrorMessage(
    error,
    fallback = "حدث خطأ غير متوقع."
) {

    /*
     * A failed HTTP request never reached the API,
     * so there is no server message to translate.
     */
    if (
        error?.request &&
        !error?.response
    ) {
        return "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.";
    }


    const data =
        error?.response?.data;


    /*
     * express-validator responses may include
     * several field errors. Show the first useful
     * one because it tells the customer what to fix.
     */
    const validationErrors =
        Array.isArray(
            data?.errors
        )
            ? data.errors
            : [];


    const firstValidationError =
        validationErrors.find(
            item =>
                item?.msg ||
                item?.message
        );


    const rawMessage =
        firstValidationError
            ?.msg ||
        firstValidationError
            ?.message ||
        data?.message ||
        error?.message ||
        fallback;


    const translated =
        translateKnownMessage(
            rawMessage
        );


    /*
     * Login deliberately uses one combined message
     * for both a wrong email and a wrong password.
     * This avoids revealing whether an account exists.
     */
    if (
        error?.response
            ?.status === 401 &&
        (
            String(
                data?.message ||
                ""
            )
                .toLowerCase()
                .includes(
                    "password"
                ) ||
            String(
                data?.message ||
                ""
            )
                .toLowerCase()
                .includes(
                    "credential"
                )
        )
    ) {
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    }


    return (
        translated ||
        fallback
    );
}
