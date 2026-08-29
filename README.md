# URL Shortener API

A simple REST API for creating and managing shortened URLs using Node.js, Express, and MongoDB.

## Features

* Create short URLs
* Redirect short URLs to their original destinations
* Track URL click counts
* Prevent duplicate URLs
* URL validation
* IP-based rate limiting
* Request logging
* MongoDB indexing for short-code lookups
* Unique 8-character short codes using Nano ID

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Nano ID**

## Project Structure

```text
URL-Shortner/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── url.controller.js
│   ├── middlewares/
│   │   ├── logs.middleware.js
│   │   └── rate_lmt.middleware.js
│   ├── models/
│   │   └── url.model.js
│   ├── routes/
│   │   └── url.route.js
│   └── app.js
│
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## API Endpoints

### Create Short URL

```http
POST /api/url/upload
```

Request:

```json
{
  "url": "https://www.example.com"
}
```

Response:

```json
{
  "message": "URL shortened successfully",
  "URL": "aB3xYz12"
}
```

If the URL already exists, the existing short code is returned.

---

### Redirect to Original URL

```http
GET /api/url/fetch/:shortCode
```

Example:

```http
GET /api/url/fetch/aB3xYz12
```

The API finds the original URL, increments its click count, and redirects the user to the original destination.

## Rate Limiting

The API uses an IP-based **Token Bucket rate limiter**.

Different limits are applied to URL creation and URL redirection endpoints to help prevent excessive requests.

## Database

Each URL is stored with:

```text
shortCode
originalURL
clicks
createdAt
updatedAt
```

`shortCode` is indexed and unique for efficient lookups and to prevent duplicate short codes.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd URL-Shortner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### 4. Start the application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

## Example

Create a short URL:

```bash
curl -X POST http://localhost:3000/api/url/upload \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.example.com"}'
```

Then use the returned short code:

```text
GET /api/url/fetch/<shortCode>
```

## Future Improvements

* Swagger/OpenAPI documentation
* User authentication
* URL expiration
* Custom short codes
* Redis-based rate limiting
* URL analytics
* Automated tests
* Deployment
