const slugify = require("slugify");
const Product = require("../models/Product");

const generateUniqueSlug = async (title, currentProductId = null) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };

    if (currentProductId) {
      query._id = { $ne: currentProductId };
    }

    const existingProduct = await Product.findOne(query);

    if (!existingProduct) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

module.exports = generateUniqueSlug;