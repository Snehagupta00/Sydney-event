const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

function parseDate(dateStr) {
    const now = new Date();
    const str = dateStr.toLowerCase();

    if (str.includes('today')) return new Date(now.setHours(0, 0, 0, 0));
    if (str.includes('tomorrow')) {
        const d = new Date(now);
        d.setDate(d.getDate() + 1);
        return new Date(d.setHours(0, 0, 0, 0));
    }

    // Try parsing strings like "Fri 20 Feb"
    const match = str.match(/(\d+)\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
    if (match) {
        const day = parseInt(match[1]);
        const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const month = monthNames.indexOf(match[2]);
        const d = new Date(now.getFullYear(), month, day);
        // If the date is in the past, assume it's next year
        if (d < new Date(now.setHours(0, 0, 0, 0))) d.setFullYear(d.getFullYear() + 1);
        return d;
    }

    return null;
}

const SOURCES = {
    SYDNEY: [
        {
            name: "What's On Sydney",
            url: 'https://whatson.cityofsydney.nsw.gov.au/whats-on-today',
            type: 'syndey_city_council'
        },
        {
            name: "Eventbrite Sydney",
            url: 'https://www.eventbrite.com.au/d/australia--sydney/events/',
            type: 'mock' // Demonstrating multi-source capability
        }
    ],
    MELBOURNE: [
        {
            name: "What's On Melbourne",
            url: 'https://whatson.melbourne.vic.gov.au/what-on',
            type: 'melbourne_mock' // Using a mock pattern for demo
        }
    ]
};

async function scrapeSydneyCity(source) {
    if (source.type === 'mock') {
        return [
            {
                title: "Sydney Harbour Night Run",
                originalUrl: "https://www.eventbrite.com.au/mock-run",
                venue: "Circular Quay",
                category: ["Sports"],
                description: "A beautiful night run around the harbour.",
                summary: "A beautiful night run around the harbour.",
                imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
                date: "Fri 28 Feb",
                eventDate: parseDate("Fri 28 Feb"),
                sourceName: source.name,
                city: 'Sydney',
                lastScrapedAt: new Date()
            }
        ];
    }

    try {
        const { data } = await axios.get(source.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });
        const $ = cheerio.load(data);
        const events = [];

        $('.event_tile').each((i, el) => {
            const title = $(el).find('.event_tile-name-link').text().trim();
            const relativeUrl = $(el).find('.event_tile-link').attr('href');
            const originalUrl = relativeUrl ? `https://whatson.cityofsydney.nsw.gov.au${relativeUrl}` : null;
            const venue = $(el).find('.event_card_location-content span').text().trim();
            const category = $(el).find('.event_tile-category-link').text().trim();
            const description = $(el).find('.event_tile-description').text().trim() || $(el).find('.event_tile-summary').text().trim();

            let imageUrl = '';
            const style = $(el).find('.image_background-image').attr('style');
            if (style) {
                const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (match) imageUrl = match[1];
            }

            const dateText = $(el).find('.event_tile-footer-item').first().text().trim();

            if (title && originalUrl) {
                events.push({
                    title,
                    originalUrl,
                    venue,
                    category: category ? [category] : [],
                    description,
                    summary: description,
                    imageUrl,
                    date: dateText,
                    eventDate: parseDate(dateText),
                    sourceName: source.name,
                    city: 'Sydney',
                    lastScrapedAt: new Date()
                });
            }
        });
        return events;
    } catch (err) {
        console.error(`Error scraping ${source.name}:`, err.message);
        return [];
    }
}

async function scrapeEvents() {
    let totalCount = 0;
    const allScrapedUrls = [];

    // Scrape Sydney - City Council
    for (const source of SOURCES.SYDNEY) {
        const events = await scrapeSydneyCity(source);
        totalCount += await processEvents(events);
        allScrapedUrls.push(...events.map(e => e.originalUrl));
    }

    // Sydney Mock Expansion
    const extraSydney = [
        {
            title: "Bondi Beach Yoga Flow",
            originalUrl: "https://bondiyoga.com.au/mock-flow",
            venue: "Bondi Pavilion",
            category: ["Wellness"],
            description: "Sunrise yoga session overlooking the ocean.",
            summary: "Sunrise yoga session overlooking the ocean.",
            imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
            date: "Sun 23 Feb",
            eventDate: parseDate("Sun 23 Feb"),
            sourceName: "Bondi Life",
            city: "Sydney",
            lastScrapedAt: new Date()
        },
        {
            title: "Enmore Theatre Late Night Comedy",
            originalUrl: "https://enmoretheatre.com.au/mock-funny",
            venue: "Enmore Theatre",
            category: ["Comedy"],
            description: "Sydney's best comedians in a late night showcase.",
            summary: "Sydney's best comedians in a late night showcase.",
            imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=800&q=80",
            date: "Wed 26 Feb",
            eventDate: parseDate("Wed 26 Feb"),
            sourceName: "Enmore Comedy",
            city: "Sydney",
            lastScrapedAt: new Date()
        },
        {
            title: "Oxford Street Drag Brunch",
            originalUrl: "https://narrrowway.com/mock-brunch-party",
            venue: "The Stonewall Hotel",
            category: ["Entertainment"],
            description: "High energy drag performances and bottomless brunch.",
            summary: "High energy drag performances and bottomless brunch.",
            imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
            date: "Sat 22 Feb",
            eventDate: parseDate("Sat 22 Feb"),
            sourceName: "Oxford St Guide",
            city: "Sydney",
            lastScrapedAt: new Date()
        }
    ];
    totalCount += await processEvents(extraSydney);
    allScrapedUrls.push(...extraSydney.map(e => e.originalUrl));

    // Melbourne Mock Expansion
    const melbourneMock = [
        {
            title: "Melbourne Coffee Festival",
            originalUrl: "https://whatson.melbourne.vic.gov.au/mock-coffee-fest",
            venue: "Convention Centre",
            category: ["Food"],
            description: "A celebration of all things coffee in Melbourne.",
            summary: "A celebration of all things coffee in Melbourne.",
            imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
            date: "Sat 22 Feb",
            eventDate: parseDate("Sat 22 Feb"),
            sourceName: "What's On Melbourne",
            city: "Melbourne",
            lastScrapedAt: new Date()
        },
        {
            title: "St Kilda Twilight Market",
            originalUrl: "https://stkildatwilightmarket.com/mock-market-sun",
            venue: "O'Donnell Gardens",
            category: ["Market"],
            description: "Art, food, and music under the palms.",
            summary: "Art, food, and music under the palms.",
            imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80",
            date: "Thu 27 Feb",
            eventDate: parseDate("Thu 27 Feb"),
            sourceName: "St Kilda Events",
            city: "Melbourne",
            lastScrapedAt: new Date()
        },
        {
            title: "Lygon Street Festa",
            originalUrl: "https://lygonfesta.com/mock",
            venue: "Lygon Street",
            category: ["Cultural"],
            description: "Little Italy comes alive with food and music.",
            summary: "Little Italy comes alive with food and music.",
            imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
            date: "Sun 23 Feb",
            eventDate: parseDate("Sun 23 Feb"),
            sourceName: "Melbourne Italy",
            city: "Melbourne",
            lastScrapedAt: new Date()
        }
    ];
    totalCount += await processEvents(melbourneMock);
    allScrapedUrls.push(...melbourneMock.map(e => e.originalUrl));

    // Cleanup: Mark events not seen in this scrape as 'inactive'
    // But NEVER mark 'imported' events as inactive — they're production assets
    await Event.updateMany(
        {
            originalUrl: { $nin: allScrapedUrls },
            status: { $nin: ['inactive', 'imported'] }
        },
        { status: 'inactive' }
    );

    return totalCount;
}

async function processEvents(scrapedEvents) {
    let count = 0;
    for (const eventData of scrapedEvents) {
        const existing = await Event.findOne({ originalUrl: eventData.originalUrl });

        if (!existing) {
            // Brand new event — mark as 'new'
            await new Event({ ...eventData, status: 'new' }).save();
            count++;
        } else {
            // Detect if key fields have changed since last scrape
            const changed = (
                existing.title !== eventData.title ||
                existing.date !== eventData.date ||
                existing.venue !== eventData.venue ||
                existing.description !== eventData.description ||
                existing.imageUrl !== eventData.imageUrl
            );

            // Update fields from scrape
            Object.assign(existing, {
                ...eventData,
                lastScrapedAt: new Date()
            });

            // Only change status if the event was changed AND not already 'imported'
            if (changed && existing.status !== 'imported') {
                existing.status = 'updated';
            }

            // If event was inactive but now seen again, revive it
            if (existing.status === 'inactive') {
                existing.status = 'new';
            }

            await existing.save();
        }
    }
    return count;
}

module.exports = { scrapeEvents };
