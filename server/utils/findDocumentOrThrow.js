const findDocumentOrThrow = async (
    Model,
    filter,
    entityName
) => {

    const document = await Model.findOne(filter);

    if (!document) {
        throw new Error(`${entityName} not found.`);
    }

    return document;

};

module.exports = findDocumentOrThrow;