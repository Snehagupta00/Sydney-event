const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Lead = require('../models/Lead');
const { scrapeEvents } = require('../services/scraper');

router.get('/', async (req, res) => {
    try {
        const { city, search, startDate, endDate, status } = req.query;
        let query = {};

        if (city) query.city = new RegExp(city, 'i');
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { venue: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }
        if (startDate || endDate) {
            query.eventDate = {};
            if (startDate) query.eventDate.$gte = new Date(startDate);
            if (endDate) query.eventDate.$lte = new Date(endDate);
        }

        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/lead', async (req, res) => {
    try {
        const { email, consent, eventId } = req.body;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const newLead = new Lead({
            email,
            consent,
            eventRef: eventId,
            eventTitle: event.title,
            originalUrl: event.originalUrl
        });

        await newLead.save();
        res.status(201).json({ redirectUrl: event.originalUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/leads', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/import/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, userId } = req.body;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.status = 'imported';
        event.importedAt = new Date();
        event.importedBy = userId;
        event.importNotes = notes;

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/scrape', async (req, res) => {
    try {
        const count = await scrapeEvents();
        res.json({ message: `Scraped ${count} events successfully` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
