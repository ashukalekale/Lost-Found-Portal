# Lost & Found Portal 🔍

A modern web application to help users find and post lost or found items in their community.

## Features

✨ **Core Features:**
- User authentication (Register & Login)
- Post lost or found items with images
- Search items by name, location, and type
- View detailed item information
- Comment on items to provide information
- Success stories showcasing reunited items
- Responsive design for mobile and desktop

## Tech Stack

**Frontend:**
- React 19.2
- React Router DOM 7.13
- Vite (fast build tool)
- CSS3

**Backend:**
- Node.js
- Express.js 5.2
- MongoDB with Mongoose
- CORS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB connection string (provided in `.env`)

### Installation

1. **Clone/Navigate to the project:**
   ```bash
   cd lost-found-portal
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm start
# or
node server.js
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or shown in terminal)

## Project Structure

```
lost-found-portal/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Item.js          # Item (lost/found) schema
│   │   └── Comment.js       # Comments schema
│   ├── routes/
│   │   ├── userRoutes.js    # Auth endpoints
│   │   ├── itemRoutes.js    # Item CRUD endpoints
│   │   └── commentRoutes.js # Comment endpoints
│   ├── server.js            # Express app setup
│   ├── package.json
│   └── .env                 # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx     # Navigation bar
    │   │   ├── Footer.jsx     # Footer
    │   │   └── Layout.jsx     # Main layout wrapper
    │   ├── pages/
    │   │   ├── Login.jsx           # Login page
    │   │   ├── Register.jsx        # Registration page
    │   │   ├── Dashboard.jsx       # Home/dashboard page
    │   │   ├── Search.jsx          # Search items page
    │   │   ├── PostItem.jsx        # Post new item page
    │   │   ├── ItemDetails.jsx     # Item details & comments
    │   │   └── SuccessStories.jsx  # Success stories page
    │   ├── styles/
    │   │   ├── search.css
    │   │   ├── postitem.css
    │   │   ├── itemdetails.css
    │   │   ├── successstories.css
    │   │   └── dashboard.css
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

## API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /:id` - Get user details

### Item Routes (`/api/items`)
- `POST /` - Create a new item
- `GET /` - Get all items (with optional filters: search, location, type, status)
- `GET /:id` - Get item details
- `PUT /:id` - Update item
- `DELETE /:id` - Delete item

### Comment Routes (`/api/comments`)
- `POST /` - Add comment to item
- `GET /:itemId` - Get comments for an item
- `DELETE /:id` - Delete comment

## Usage Guide

### 1. Register/Login
- Click "Register" to create a new account
- Fill in name, email, phone (optional), and password
- Or login with existing credentials

### 2. Post an Item
- Navigate to "Post Item" page
- Select type (Lost or Found)
- Fill in item details: name, category, description, location
- Add contact information
- Optionally upload an image
- Click "Post Item"

### 3. Search for Items
- Go to "Search" page
- Enter item name, location, or type
- Browse search results
- Click on any item to view details

### 4. View Item Details
- See full item information
- Read comments from other users
- Add your own comments
- Contact the item poster if matched

### 5. Success Stories
- View items that have been successfully reunited
- Share your own success story

## Color Scheme

The app uses a modern purple/pink color scheme:
- Primary: `#c43796` (Deep Pink)
- Secondary: `#d95c9f` (Light Pink)
- Background: `#f5e9ff` (Light Purple)
- Text: `#453d4f` (Dark Gray)

## Features to Extend

Future enhancement ideas:
- Email notifications
- Item matching algorithm
- User profiles with posted items history
- Rating and review system
- Map integration for location
- Social media sharing
- Admin dashboard
- Image gallery for items
- Saved/bookmarked items

## Environment Variables

Backend `.env` file:
```
MONGO_URL=your_mongodb_connection_string
```

## Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
- Ready to deploy as-is
- Update MongoDB URI for production

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Support

For issues or questions, please open an issue in the project repository.

---

**Made with ❤️ for the community**
