// Firebase Data Seeding Script
// Run this script once to populate your Firestore database with sample products
// Make sure to update firebase.js with your configuration first

import { 
    db, 
    collection, 
    addDoc,
    initializeAdmin 
} from './firebase.js';

// Sample products data for Bangladesh market
const sampleProducts = [
    // Fashion Category
    {
        name: "Premium Cotton T-Shirt",
        price: 599,
        category: "Fashion",
        description: "High-quality 100% cotton t-shirt perfect for everyday wear. Comfortable fit with durable stitching. Available in multiple colors and sizes.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=250&fit=crop",
        rating: 4.5,
        reviews: 23,
        specifications: {
            "Material": "100% Cotton",
            "Fit": "Regular Fit",
            "Care": "Machine Washable",
            "Origin": "Bangladesh",
            "Sizes": "S, M, L, XL, XXL"
        }
    },
    {
        name: "Denim Jeans - Classic Blue",
        price: 1899,
        category: "Fashion",
        description: "Classic blue denim jeans with perfect fit and comfort. Made with premium denim fabric and modern styling.",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=250&fit=crop",
        rating: 4.3,
        reviews: 67,
        specifications: {
            "Material": "98% Cotton, 2% Elastane",
            "Fit": "Slim Fit",
            "Wash": "Classic Blue",
            "Origin": "Bangladesh",
            "Sizes": "28-38 Waist"
        }
    },
    {
        name: "Women's Kurti - Traditional",
        price: 1299,
        category: "Fashion",
        description: "Beautiful traditional kurti with modern design. Perfect for casual and semi-formal occasions.",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=250&fit=crop",
        rating: 4.7,
        reviews: 89,
        specifications: {
            "Material": "Cotton Blend",
            "Style": "A-Line",
            "Sleeve": "3/4 Sleeve",
            "Origin": "Bangladesh",
            "Sizes": "S, M, L, XL"
        }
    },

    // Electronics Category
    {
        name: "Wireless Bluetooth Headphones",
        price: 2499,
        category: "Electronics",
        description: "Premium wireless headphones with active noise cancellation and superior sound quality. Long battery life for extended use.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=250&fit=crop",
        rating: 4.2,
        reviews: 145,
        specifications: {
            "Battery Life": "30 Hours",
            "Connectivity": "Bluetooth 5.0",
            "Noise Cancellation": "Active ANC",
            "Weight": "250g",
            "Warranty": "1 Year"
        }
    },
    {
        name: "Smartphone - Latest Model",
        price: 15999,
        category: "Electronics",
        description: "Latest smartphone with advanced camera system, fast processor, and long-lasting battery. Perfect for photography and gaming.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=250&fit=crop",
        rating: 4.6,
        reviews: 234,
        specifications: {
            "Display": "6.1 inch OLED",
            "Camera": "48MP Triple Camera",
            "Storage": "128GB",
            "RAM": "6GB",
            "Battery": "4000mAh"
        }
    },
    {
        name: "Laptop - Business Series",
        price: 45999,
        category: "Electronics",
        description: "Professional laptop perfect for business and productivity. Fast performance with excellent build quality.",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=250&fit=crop",
        rating: 4.4,
        reviews: 78,
        specifications: {
            "Processor": "Intel Core i5",
            "RAM": "8GB DDR4",
            "Storage": "256GB SSD",
            "Display": "14 inch Full HD",
            "OS": "Windows 11"
        }
    },

    // Home & Garden Category
    {
        name: "Ceramic Coffee Mug Set",
        price: 899,
        category: "Home",
        description: "Beautiful set of 4 ceramic coffee mugs with elegant design. Perfect for your morning coffee or tea time.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=250&fit=crop",
        rating: 4.8,
        reviews: 56,
        specifications: {
            "Material": "Premium Ceramic",
            "Capacity": "350ml each",
            "Set Includes": "4 Mugs",
            "Dishwasher Safe": "Yes",
            "Microwave Safe": "Yes"
        }
    },
    {
        name: "LED Table Lamp - Modern",
        price: 1599,
        category: "Home",
        description: "Modern LED table lamp with adjustable brightness and USB charging port. Perfect for study or work.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=250&fit=crop",
        rating: 4.1,
        reviews: 34,
        specifications: {
            "Light Type": "LED",
            "Power": "12W",
            "Features": "Dimmable, USB Port",
            "Material": "Metal & Plastic",
            "Warranty": "2 Years"
        }
    },
    {
        name: "Indoor Plant - Money Tree",
        price: 799,
        category: "Home",
        description: "Beautiful money tree plant perfect for indoor decoration. Low maintenance and air purifying.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=250&fit=crop",
        rating: 4.5,
        reviews: 67,
        specifications: {
            "Plant Type": "Pachira Aquatica",
            "Pot Size": "6 inch",
            "Light": "Indirect Sunlight",
            "Water": "Weekly",
            "Air Purifying": "Yes"
        }
    },

    // Sports Category
    {
        name: "Yoga Mat - Premium Quality",
        price: 1299,
        category: "Sports",
        description: "High-quality yoga mat with excellent grip and cushioning. Perfect for yoga, pilates, and fitness exercises.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=250&fit=crop",
        rating: 4.3,
        reviews: 89,
        specifications: {
            "Material": "TPE (Eco-friendly)",
            "Thickness": "6mm",
            "Size": "183cm x 61cm",
            "Weight": "1.2kg",
            "Non-slip": "Yes"
        }
    },
    {
        name: "Running Shoes - Athletic",
        price: 3499,
        category: "Sports",
        description: "Comfortable running shoes with excellent cushioning and support. Perfect for jogging and gym workouts.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=250&fit=crop",
        rating: 4.4,
        reviews: 156,
        specifications: {
            "Upper Material": "Mesh & Synthetic",
            "Sole": "Rubber with Air Cushion",
            "Weight": "280g per shoe",
            "Sizes": "6-12 UK",
            "Use": "Running, Training"
        }
    },

    // Books Category
    {
        name: "Programming Book - JavaScript",
        price: 1299,
        category: "Books",
        description: "Comprehensive guide to JavaScript programming. Perfect for beginners and intermediate developers.",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=250&fit=crop",
        rating: 4.7,
        reviews: 234,
        specifications: {
            "Pages": "450",
            "Language": "English",
            "Level": "Beginner to Intermediate",
            "Publisher": "Tech Books BD",
            "Edition": "2024"
        }
    },
    {
        name: "Bengali Novel - Classic Literature",
        price: 499,
        category: "Books",
        description: "Classic Bengali literature that captures the essence of Bengali culture and storytelling.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=250&fit=crop",
        rating: 4.6,
        reviews: 123,
        specifications: {
            "Pages": "320",
            "Language": "Bengali",
            "Genre": "Classic Literature",
            "Publisher": "Bangla Sahitya",
            "Binding": "Paperback"
        }
    },

    // Beauty Category
    {
        name: "Natural Face Cream - Moisturizing",
        price: 799,
        category: "Beauty",
        description: "Natural moisturizing face cream with organic ingredients. Suitable for all skin types.",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=250&fit=crop",
        rating: 4.2,
        reviews: 67,
        specifications: {
            "Volume": "50ml",
            "Skin Type": "All Types",
            "Ingredients": "Natural & Organic",
            "SPF": "15",
            "Cruelty Free": "Yes"
        }
    },
    {
        name: "Lipstick - Matte Finish",
        price: 599,
        category: "Beauty",
        description: "Long-lasting matte lipstick with rich color and comfortable wear. Available in multiple shades.",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=250&fit=crop",
        rating: 4.1,
        reviews: 89,
        specifications: {
            "Finish": "Matte",
            "Wear Time": "8+ Hours",
            "Weight": "3.5g",
            "Shades Available": "12",
            "Cruelty Free": "Yes"
        }
    },
    {
        name: "Hair Oil - Coconut & Argan",
        price: 699,
        category: "Beauty",
        description: "Nourishing hair oil blend with coconut and argan oil. Promotes healthy hair growth and shine.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=250&fit=crop",
        rating: 4.5,
        reviews: 145,
        specifications: {
            "Volume": "100ml",
            "Main Ingredients": "Coconut Oil, Argan Oil",
            "Hair Type": "All Types",
            "Origin": "Natural",
            "Packaging": "Glass Bottle"
        }
    }
];

// Function to seed products data
async function seedProducts() {
    console.log('🌱 Starting to seed products data...');
    
    try {
        for (let i = 0; i < sampleProducts.length; i++) {
            const product = sampleProducts[i];
            const docRef = await addDoc(collection(db, 'products'), {
                ...product,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`✅ Added product: ${product.name} (ID: ${docRef.id})`);
        }
        
        console.log(`🎉 Successfully added ${sampleProducts.length} products to the database!`);
        
    } catch (error) {
        console.error('❌ Error seeding products:', error);
    }
}

// Function to create sample admin user data
async function createAdminUserData() {
    console.log('👤 Creating admin user data...');
    
    try {
        await addDoc(collection(db, 'users'), {
            email: 'admin@natalify.com',
            name: 'Admin User',
            role: 'admin',
            createdAt: new Date()
        });
        
        console.log('✅ Admin user data created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
}

// Function to create sample orders (for demo purposes)
async function seedSampleOrders() {
    console.log('📦 Creating sample orders...');
    
    const sampleOrders = [
        {
            orderNumber: 'ORD12345678',
            customerName: 'Ahmed Rahman',
            phone: '+8801712345678',
            email: 'ahmed@example.com',
            address: '123 Dhanmondi Road, Dhaka 1205',
            items: [
                {
                    id: 'sample-1',
                    name: 'Premium Cotton T-Shirt',
                    price: 599,
                    quantity: 2
                }
            ],
            total: 1198,
            status: 'pending',
            paymentMethod: 'cod',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
            orderNumber: 'ORD12345679',
            customerName: 'Fatima Khan',
            phone: '+8801812345678',
            email: 'fatima@example.com',
            address: '456 Gulshan Avenue, Dhaka 1212',
            items: [
                {
                    id: 'sample-2',
                    name: 'Wireless Bluetooth Headphones',
                    price: 2499,
                    quantity: 1
                }
            ],
            total: 2499,
            status: 'confirmed',
            paymentMethod: 'bkash',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
            orderNumber: 'ORD12345680',
            customerName: 'Karim Hassan',
            phone: '+8801912345678',
            email: 'karim@example.com',
            address: '789 Uttara Sector 7, Dhaka 1230',
            items: [
                {
                    id: 'sample-3',
                    name: 'Yoga Mat - Premium Quality',
                    price: 1299,
                    quantity: 1
                },
                {
                    id: 'sample-4',
                    name: 'LED Table Lamp - Modern',
                    price: 1599,
                    quantity: 1
                }
            ],
            total: 2898,
            status: 'delivered',
            paymentMethod: 'cod',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
    ];
    
    try {
        for (const order of sampleOrders) {
            const docRef = await addDoc(collection(db, 'orders'), order);
            console.log(`✅ Added order: ${order.orderNumber} (ID: ${docRef.id})`);
        }
        
        console.log(`🎉 Successfully added ${sampleOrders.length} sample orders!`);
        
    } catch (error) {
        console.error('❌ Error seeding orders:', error);
    }
}

// Main seeding function
async function seedDatabase() {
    console.log('🚀 Starting database seeding process...');
    console.log('⚠️  Make sure you have updated firebase.js with your project configuration!');
    
    try {
        // Initialize admin
        await initializeAdmin();
        console.log('✅ Admin initialization completed');
        
        // Seed products
        await seedProducts();
        
        // Create admin user data
        await createAdminUserData();
        
        // Seed sample orders
        await seedSampleOrders();
        
        console.log('🎊 Database seeding completed successfully!');
        console.log('📝 Next steps:');
        console.log('   1. Go to your website and test the functionality');
        console.log('   2. Login with admin@natalify.com / admin123');
        console.log('   3. Check the admin dashboard');
        console.log('   4. Test placing orders as a customer');
        
    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        console.log('🔧 Troubleshooting:');
        console.log('   1. Check your Firebase configuration in firebase.js');
        console.log('   2. Ensure Firestore database is created and accessible');
        console.log('   3. Verify your internet connection');
        console.log('   4. Check browser console for detailed error messages');
    }
}

// Export functions for manual use
export {
    seedProducts,
    createAdminUserData,
    seedSampleOrders,
    seedDatabase
};

// Auto-run seeding when script is loaded directly
// Uncomment the line below to run seeding automatically
// seedDatabase();

console.log('📋 Data seeding script loaded!');
console.log('🔧 To seed your database, run: seedDatabase()');
console.log('📚 Or use individual functions:');
console.log('   - seedProducts()');
console.log('   - createAdminUserData()');
console.log('   - seedSampleOrders()');
