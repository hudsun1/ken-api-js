let nextId = 1;
const images = [];

function addImage({ imageUrl, description }) {
  const item = { id: nextId++, imageUrl, description, createdAt: new Date().toISOString() };
  images.unshift(item); // newest first
  return item;
}

function listImages() {
  return images.slice();
}

module.exports = { addImage, listImages };
