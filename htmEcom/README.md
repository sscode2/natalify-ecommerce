# Natalify - Modern E-commerce Website for Bangladesh

![Natalify Logo](https://via.placeholder.com/200x80/006A4E/FFFFFF?text=Natalify)

**Natalify** is a modern, responsive e-commerce website built specifically for the Bangladeshi market. It features a beautiful UI with Bangladesh's national colors (Green, White, Orange), comprehensive product management, secure authentication, and seamless shopping experience.

## 🌟 Features

### 🛍️ Customer Features
- **Modern Homepage** with hero banner and featured products
- **Product Catalog** with search, filtering, and sorting
- **Product Details** with image gallery and specifications
- **Shopping Cart** with quantity management
- **Secure Checkout** with multiple payment options (COD, bKash)
- **User Authentication** (Login/Register)
- **Responsive Design** optimized for mobile and desktop
- **Bangladesh-focused** design and payment methods

### 👨‍💼 Admin Features
- **Admin Dashboard** with comprehensive analytics
- **Product Management** (Add, Edit, Delete products)
- **Order Management** with status tracking
- **User Management** and role-based access
- **Real-time Statistics** and reporting

### 🔧 Technical Features
- **Firebase Integration** (Firestore, Authentication, Storage, Hosting)
- **Modern JavaScript** (ES6+ modules)
- **Responsive CSS** with custom design system
- **SEO Optimized** with proper meta tags
- **Performance Optimized** with lazy loading and caching
- **Cross-browser Compatible**

## 📁 Project Structure

```
natalify/
├── index.html          # Homepage
├── shop.html           # All products page
├── product.html        # Product details page
├── cart.html           # Shopping cart & checkout
├── login.html          # Authentication page
├── dashboard.html      # Admin dashboard
├── about.html          # About us page
├── contact.html        # Contact page
├── style.css           # Main stylesheet
├── main.js             # Core JavaScript functionality
├── firebase.js         # Firebase configuration
├── auth.js             # Authentication functions
├── cart.js             # Cart management functions
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Clone or Download
Download all files to your local directory or web server.

### 2. Firebase Setup (Required)
Follow the detailed Firebase setup guide below to configure your database and authentication.

### 3. Update Configuration
Edit `firebase.js` with your Firebase project credentials.

### 4. Deploy
Upload files to your web server or use Firebase Hosting for free deployment.

## 🔥 Firebase Setup Guide

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `natalify-ecommerce` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Click **Save**

### Step 3: Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select your preferred location (closest to Bangladesh)
4. Click **Done**

### Step 4: Enable Storage

1. Go to **Storage** > **Get started**
2. Choose **Start in test mode**
3. Select same location as Firestore
4. Click **Done**

### Step 5: Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register app with name "Natalify Web"
5. Copy the configuration object

### Step 6: Update firebase.js

Replace the configuration in `firebase.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### Step 7: Set Up Firestore Collections

Create these collections in Firestore:

#### Products Collection
```javascript
// Collection: products
{
    name: "Cotton T-Shirt",
    price: 599,
    category: "Fashion",
    description: "Premium quality cotton t-shirt",
    image: "https://example.com/image.jpg",
    rating: 4.5,
    reviews: 23,
    createdAt: timestamp
}
```

#### Orders Collection
```javascript
// Collection: orders
{
    orderNumber: "ORD12345678",
    userId: "user-id",
    userEmail: "user@example.com",
    customerName: "John Doe",
    phone: "+8801712345678",
    address: "123 Street, Dhaka",
    items: [
        {
            id: "product-id",
            name: "Product Name",
            price: 599,
            quantity: 2
        }
    ],
    total: 1198,
    status: "pending", // pending, confirmed, delivered
    paymentMethod: "cod", // cod, bkash
    createdAt: timestamp
}
```

#### Users Collection
```javascript
// Collection: users
{
    uid: "firebase-user-id",
    email: "user@example.com",
    name: "User Name",
    role: "customer", // customer, admin
    createdAt: timestamp
}
```

#### Contacts Collection
```javascript
// Collection: contacts
{
    name: "Contact Name",
    email: "contact@example.com",
    phone: "+8801712345678",
    subject: "general",
    message: "Contact message",
    createdAt: timestamp
}
```

### Step 8: Set Firestore Security Rules

Go to **Firestore Database** > **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products for everyone
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow authenticated users to read/write their own orders
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to manage their profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow anyone to write to contacts (for contact form)
    match /contacts/{document} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if true;
    }
  }
}
```

### Step 9: Create Admin User

1. Register a user through the website
2. Go to Firestore Database
3. Find the user in `users` collection
4. Change `role` from `customer` to `admin`
5. Update `ADMIN_EMAIL` in `firebase.js` to match admin email

### Step 10: Deploy with Firebase Hosting (Optional)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize hosting in your project directory:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

## 🎨 Customization

### Colors
The website uses Bangladesh-inspired colors defined in CSS variables:
- Primary Green: `#006A4E`
- Secondary Green: `#00A86B`
- Accent Orange: `#FF6B35`

### Fonts
Uses Google Fonts "Inter" for modern, clean typography.

### Images
Replace placeholder images with actual product images. Recommended size: 300x250px for product cards.

## 📱 Demo Accounts

For testing purposes, the website includes demo accounts:

### Admin Account
- **Email:** admin@natalify.com
- **Password:** admin123
- **Access:** Full admin dashboard

### Customer Account
- **Email:** user@example.com
- **Password:** user123
- **Access:** Regular shopping features

## 🛠️ Development

### Local Development
1. Use a local web server (Live Server extension in VS Code)
2. Ensure Firebase configuration is correct
3. Test all features before deployment

### Adding Products
Use the admin dashboard to add products, or manually add to Firestore:
1. Go to Firestore Database
2. Select `products` collection
3. Add document with required fields

### Managing Orders
Orders are automatically created when customers checkout. Admins can:
1. View all orders in dashboard
2. Update order status
3. View order details

## 🔒 Security

### Authentication
- Firebase Authentication handles user management
- Role-based access control for admin features
- Secure password requirements

### Database Security
- Firestore security rules protect sensitive data
- Users can only access their own orders
- Admin-only access to product management

### Payment Security
- Cash on Delivery (COD) - No sensitive payment data stored
- bKash integration planned for future updates

## 📊 Analytics & Monitoring

### Firebase Analytics
Enable Google Analytics in Firebase for:
- User behavior tracking
- Conversion monitoring
- Performance insights

### Performance Monitoring
Enable Firebase Performance Monitoring for:
- Page load times
- Network request monitoring
- User experience metrics

## 🚀 Deployment Options

### 1. Firebase Hosting (Recommended)
- Free SSL certificate
- Global CDN
- Easy deployment
- Custom domain support

### 2. Traditional Web Hosting
- Upload files via FTP
- Ensure HTTPS is enabled
- Configure proper file permissions

### 3. GitHub Pages
- Free hosting for static sites
- Automatic deployment from repository
- Custom domain support

## 🔧 Troubleshooting

### Common Issues

#### Firebase Connection Issues
- Check internet connection
- Verify Firebase configuration
- Ensure project is active in Firebase Console

#### Authentication Not Working
- Check if Email/Password is enabled in Firebase Auth
- Verify security rules allow user creation
- Check browser console for errors

#### Products Not Loading
- Verify Firestore database has products collection
- Check security rules allow read access
- Ensure proper data structure

#### Admin Dashboard Access Denied
- Verify user role is set to 'admin' in Firestore
- Check ADMIN_EMAIL in firebase.js
- Ensure user is logged in

### Getting Help
1. Check browser console for error messages
2. Verify Firebase project configuration
3. Review Firestore security rules
4. Test with demo accounts first

## 📈 Future Enhancements

### Planned Features
- [ ] Advanced search with filters
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Multi-language support (Bengali/English)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Discount/coupon system

### Payment Integration
- [ ] bKash API integration
- [ ] Nagad payment gateway
- [ ] Rocket payment option
- [ ] Bank transfer support

### Advanced Features
- [ ] Real-time chat support
- [ ] Push notifications
- [ ] Social media login
- [ ] Advanced product recommendations
- [ ] Bulk order management
- [ ] Vendor/seller marketplace

## 🤝 Contributing

We welcome contributions to improve Natalify! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 📞 Support

For support and questions:
- **Email:** support@natalify.com
- **Phone:** +880 171-234-5678
- **Website:** [Contact Form](contact.html)

## 🙏 Acknowledgments

- Firebase for backend services
- Google Fonts for typography
- Bangladesh flag colors for inspiration
- Open source community for tools and libraries

---

**Made with ❤️ in Bangladesh**

*Natalify - Modern Shopping Experience in Bangladesh*
