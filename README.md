# ken-api

Simple QR API

Endpoints:

- GET / -> JSON status
- GET /qr?text=Hello%20World&size=300 -> returns PNG image of QR
- GET /qr/dataurl?text=Hello%20World -> returns JSON { dataUrl }
- GET /qr/images?q=Hello&count=3 -> returns JSON { images: [{ imageUrl, description }, ...] }
- POST /qr/upload -> accepts JSON { imageUrl, description }, returns 201 with created item

Examples:

- curl "http://127.0.0.1:3000/qr/images?q=Hi&count=2"
- curl -X POST -H "Content-Type: application/json" -d '{"imageUrl":"https://example.com/pic.png","description":"Example image"}' http://127.0.0.1:3000/qr/upload

Run:

- npm install
- npm run dev (requires nodemon)
- npm start
