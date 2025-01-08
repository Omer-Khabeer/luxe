const faker = require('faker');
const client = require('./sanitySetup');

async function createProduct() {
  const title = faker.commerce.productName();
  const description = faker.commerce.productDescription();
  const price = faker.commerce.price();
  const image = faker.image.imageUrl();

  const doc = {
    _type: 'product',
    title: title,
    description: description,
    price: parseFloat(price),
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-url-placeholder' // You need to replace this with references to actual image assets in Sanity
      }
    }
  };

  try {
    const res = await client.create(doc);
    console.log('Product created', res);
  } catch (err) {
    console.error('Failed to create product', err.message);
  }
}

async function generateProducts(numProducts = 10) {
  for (let i = 0; i < numProducts; i++) {
    await createProduct();
  }
}

generateProducts(20); // Generates 20 dummy products
