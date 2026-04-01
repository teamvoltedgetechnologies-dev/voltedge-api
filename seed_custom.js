require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const productsList = [
    { type: 'Electrical', category: 'Power Intelligence', name: 'Sentinel L1', desc: 'Advanced load and power monitoring device designed for real-time measurement and analysis of electrical parameters.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Electrical', category: 'Power Analytics', name: 'Sentinel L2', desc: 'Advanced power analytics system designed to provide deep insights into electrical performance, energy usage patterns, and power quality.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Electrical', category: 'Panel Protection', name: 'PanelGuard PG1', desc: 'Smart electrical panel monitoring system designed to provide real-time visibility, protection, and diagnostics.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Electrical', category: 'Relay Automation', name: 'SmartRelay SR1', desc: 'Remote relay automation system designed to enable intelligent control of electrical loads from anywhere.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Machine Health', category: 'Condition Monitoring', name: 'Sentinel X1', desc: 'Intelligent machine condition monitoring system designed to track the health and performance of industrial equipment in real time.', price: 'Inquire', bgClass: 'bg-purple', iconClass: 'sensor' },
    { type: 'Machine Health', category: 'Diagnostics Analysis', name: 'Vibration Pro V1', desc: 'Advanced vibration analysis system designed for precise monitoring and diagnostics of rotating machinery.', price: 'Inquire', bgClass: 'bg-purple', iconClass: 'sensor' },
    { type: 'Energy', category: 'Backup Intelligence', name: 'EnergyVault B1', desc: 'Smart monitoring system designed for diesel generators (DG) and backup power systems to ensure reliability.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Energy', category: 'Solar Optimization', name: 'SolarGuard SG1', desc: 'Smart monitoring system designed to track and optimize the performance of solar power systems.', price: 'Inquire', bgClass: 'bg-blue', iconClass: 'node' },
    { type: 'Connectivity', category: 'IoT Gateway Backbone', name: 'MachineSync MS1', desc: 'Robust industrial IoT gateway designed to enable seamless communication between field devices and cloud platforms.', price: 'Inquire', bgClass: 'bg-cyan', iconClass: 'hub' },
    { type: 'Connectivity', category: 'Entry-Level Gateway', name: 'Nexus Lite NL1', desc: 'Compact and cost-effective IoT gateway designed for small to medium-scale deployments.', price: 'Inquire', bgClass: 'bg-cyan', iconClass: 'hub' },
    { type: 'Logistics', category: 'GPS Tracking', name: 'TransitSense F1', desc: 'Reliable GPS-based fleet tracking system designed to provide real-time location tracking and movement monitoring.', price: 'Inquire', bgClass: 'bg-cyan', iconClass: 'hub' },
    { type: 'Logistics', category: 'Fleet Intelligence', name: 'TransitSense F2', desc: 'Advanced fleet intelligence system combining real-time GPS tracking with detailed fuel monitoring capabilities.', price: 'Inquire', bgClass: 'bg-cyan', iconClass: 'hub' },
    { type: 'Logistics', category: 'Cold Chain Tracking', name: 'CargoSense C1', desc: 'Smart cold chain monitoring system designed to ensure the safe transport of temperature-sensitive goods.', price: 'Inquire', bgClass: 'bg-purple', iconClass: 'sensor' },
    { type: 'Environmental', category: 'Temperature Logger', name: 'TempLog T1', desc: 'Compact and reliable temperature data logger designed for continuous monitoring and recording of critical environments.', price: 'Inquire', bgClass: 'bg-purple', iconClass: 'sensor' },
    { type: 'Environmental', category: 'Temp & Humidity Logger', name: 'TempLog TH1', desc: 'Compact environmental data logger designed to monitor and record both temperature and humidity in real time.', price: 'Inquire', bgClass: 'bg-purple', iconClass: 'sensor' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voltedge')
.then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(productsList);
    console.log(`✅ Successfully seeded ${productsList.length} custom products into MongoDB!`);
    process.exit(0);
})
.catch(err => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
});
