# ken-api

Simple QR API

Endpoints:

- GET / -> JSON status
- GET /qr?text=Hello%20World&size=300 -> returns PNG image of QR
- GET /qr/dataurl?text=Hello%20World -> returns JSON { dataUrl }
- GET /qr/images -> returns rows from the `qr_test` table (SELECT * FROM qr_test); supports query param `page` (default 1); returns 50 images per page
- POST /qr/upload -> accepts JSON { image_url (required), description (optional), title (optional) }, returns 201 with created item (response keys are the DB column names, snake_case)
- GET /qr/dummy -> returns an HTML upload page where you can select a file and submit description/title
- POST /qr/dummy -> accepts multipart/form-data with field `file` (image), optional fields `description` and `title`; stores file in `/uploads` and returns the created row

Example test using the web UI:

- Open http://127.0.0.1:3000/qr/dummy in your browser, choose a file and click Upload

Or via curl:
- curl -X POST -F "file=@/path/to/file.png" -F "description=From curl" -F "title=UploadTest" http://127.0.0.1:3000/qr/dummy

Examples:

- curl "http://127.0.0.1:3000/qr/images?q=Hi&count=2"
- curl -X POST -H "Content-Type: application/json" -d '{"imageUrl":"https://example.com/pic.png","description":"Example image"}' http://127.0.0.1:3000/qr/upload

Example response from GET /qr/images:
{
  "images": [
    { "id": 1, "image_url": "https://...", "description": "...", "created_at": "..." },
    { "image_url": "http://127.0.0.1:3000/qr?text=Hi%201&size=300", "description": "QR for: Hi 1" }
  ]
}

Run:

- npm install
- npm run dev (requires nodemon)
- npm start
