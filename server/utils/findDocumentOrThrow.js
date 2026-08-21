const findDocumentOrThrow = async (
    Model,
    filter,
    entityName,
    session = null
) => {

    let query = Model.findOne(filter);

    if (session) {
        query = query.session(session);
    }

    const document = await query;

    if (!document) {
        throw new Error(
            `${entityName} not found.`
        );
    }

    return document;

};

module.exports = findDocumentOrThrow;