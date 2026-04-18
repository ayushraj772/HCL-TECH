require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Hospital = require('../models/Hospital');
const Vaccine = require('../models/Vaccine');
const Slot = require('../models/Slot');
const User = require('../models/User');

function loadJSON(name) {
  const p = path.join(__dirname, '..', '..', '..', 'database', 'seed', name);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

(async () => {
  try {
    await connectDB();
    await Promise.all([
      Hospital.deleteMany({}),
      Vaccine.deleteMany({}),
      Slot.deleteMany({}),
      User.deleteMany({}),
    ]);

    const hospitalsData = loadJSON('hospitals.json');
    const vaccinesData = loadJSON('vaccines.json');
    const usersData = loadJSON('users.json');

    const hospitals = await Hospital.insertMany(hospitalsData);
    const hospitalMap = Object.fromEntries(hospitals.map(h => [h.name, h._id]));

    const vaccineDocs = vaccinesData.map(v => ({
      ...v,
      hospitalId: hospitalMap[v.hospitalName],
      hospitalName: undefined,
    }));
    const vaccines = await Vaccine.insertMany(vaccineDocs);

    const today = new Date().toISOString().slice(0, 10);
    const capacities = [10, 15, 20, 25, 30, 40, 50];
    const slotDocs = [];
    for (const v of vaccines) {
      for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const cap = capacities[Math.floor(Math.random() * capacities.length)];
        slotDocs.push({
          hospitalId: v.hospitalId,
          vaccineId: v._id,
          date: d.toISOString().slice(0, 10),
          totalCapacity: cap,
          bookedCount: 0,
          pricePerDose: v.pricePerDose,
        });
      }
    }
    await Slot.insertMany(slotDocs);

    for (const u of usersData) await User.create(u);

    console.log('Seed complete:', {
      hospitals: hospitals.length,
      vaccines: vaccines.length,
      slots: slotDocs.length,
      users: usersData.length,
      startDate: today,
    });
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
})();
