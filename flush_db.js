require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voltedge')
.then(async () => {
    console.log('✅ Connecting to MongoDB Cluster...');
    const deleted = await Product.deleteMany({});
    console.log(`🧹 Successfully removed ${deleted.deletedCount} products from the database.`);
    process.exit(0);
})
.catch(err => {
    console.error('❌ Database flush error:', err);
    process.exit(1);
});
