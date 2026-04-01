require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const productsList = [
    { type: 'Electrical', category: 'Energy Monitoring', name: 'Sentinel L1', desc: 'Continuous electrical parameter monitoring (Voltage L-L, Current, kW, Power Factor, kWh) with 4G LTE remote visualization.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Machine Health', category: 'Diagnostics', name: 'Industrial IoT Master Controller', desc: 'Customized multi-sensor field device to trigger alerts on abnormal machine behavior and prevent unplanned downtimes.', price: 'Inquire', bgClass: 'bg-purple', iconClass: 'sensor' },
    { type: 'Logistics', category: 'Connectivity', name: 'Asset Connectivity Gateway', desc: 'Seamlessly bridges field devices to our robust cloud platforms via scalable architecture.', price: 'Inquire', bgClass: 'bg-cyan', iconClass: 'hub' },
    { type: 'Energy', category: 'Electrical Intelligence', name: 'Smart Power Node', desc: 'Integrates real-time current and voltage sensing for immediate localized control capability.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Machine Health', category: 'Preventative AI', name: 'Vibration & Thermal Hub', desc: 'Monitors real-time motor temperatures and mechanical vibrations for precision insights.', price: 'Inquire', bgClass: 'bg-purple', iconClass: 'sensor' },
    { type: 'Electrical', category: 'Grid Extension', name: 'Remote Control Actor', desc: 'Instantly execute shut-off protocols upon overload detection straight from the Cloud dashboard.', price: 'Inquire', bgClass: 'bg-cyan', iconClass: 'hub' },
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voltedge')
.then(async () => {
    console.log('✅ MongoDB connected successfully for seeding.');
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products.');
    
    await Product.insertMany(productsList);
    console.log('🌱 Seeded 6 products successfully into database.');
    
    process.exit(0);
})
.catch(err => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
});
