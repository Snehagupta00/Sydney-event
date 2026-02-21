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

    const match = str.match(/(\d+)\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
    if (match) {
        const day = parseInt(match[1]);
        const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const month = monthNames.indexOf(match[2]);
        const d = new Date(now.getFullYear(), month, day);
        if (d < new Date(now.setHours(0, 0, 0, 0))) d.setFullYear(d.getFullYear() + 1);
        return d;
    }

    return null;
}

const SOURCES = {
    SYDNEY: [
        {
            name: "What's On Sydney",
            url: 'https://whatson.cityofsydney.nsw.gov.au/today',
            type: 'syndey_city_council'
        },
        {
            name: "Eventbrite Sydney",
            url: 'https://www.eventbrite.com.au/d/australia--sydney/events/',
            type: 'mock'
        }
    ],
    MELBOURNE: [
        {
            name: "What's On Melbourne",
            url: 'https://whatson.melbourne.vic.gov.au/what-on',
            type: 'melbourne_mock'
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
        const { data: html } = await axios.get(source.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000
        });

        const startIdx = html.indexOf('id=\"__NEXT_DATA__\"');
        if (startIdx === -1) throw new Error('Could not find __NEXT_DATA__');
        
        const jsonStart = html.indexOf('>', startIdx) + 1;
        const jsonEnd = html.indexOf('</script>', jsonStart);
        const jsonStr = html.substring(jsonStart, jsonEnd);
        const data = JSON.parse(jsonStr);

        const sectionAdditionalData = data.props.pageProps.sectionAdditionalData || {};
        let hits = [];
        
        for (const sectionId in sectionAdditionalData) {
            const section = sectionAdditionalData[sectionId];
            if (section && section.events && section.events.hits) {
                hits = hits.concat(section.events.hits);
            }
        }

        return hits.map(hit => ({
            title: hit.name,
            originalUrl: `https://whatson.cityofsydney.nsw.gov.au/events/${hit.slug}`,
            venue: hit.venueName || 'Sydney',
            category: hit.categories || [],
            description: hit.strapline || '',
            summary: hit.strapline || '',
            imageUrl: hit.tileImageCloudinary && hit.tileImageCloudinary[0] ? hit.tileImageCloudinary[0].url : '',
            date: hit.eventUpcomingTime || hit.upcomingDate,
            eventDate: hit.upcomingDate ? new Date(hit.upcomingDate) : parseDate(hit.eventUpcomingTime),
            sourceName: source.name,
            city: 'Sydney',
            lastScrapedAt: new Date()
        }));
    } catch (err) {
        console.error(`Error scraping ${source.name}:`, err.message);
        return [];
    }
}

async function scrapeEvents() {
    let totalCount = 0;
    const allScrapedUrls = [];

    for (const source of SOURCES.SYDNEY) {
        const events = await scrapeSydneyCity(source);
        totalCount += await processEvents(events);
        allScrapedUrls.push(...events.map(e => e.originalUrl));
    }

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
            await new Event({ ...eventData, status: 'new' }).save();
            count++;
        } else {
            const changed = (
                existing.title !== eventData.title ||
                existing.date !== eventData.date ||
                existing.venue !== eventData.venue ||
                existing.description !== eventData.description ||
                existing.imageUrl !== eventData.imageUrl
            );

            Object.assign(existing, {
                ...eventData,
                lastScrapedAt: new Date()
            });

            if (changed && existing.status !== 'imported') {
                existing.status = 'updated';
            }

            if (existing.status === 'inactive') {
                existing.status = 'new';
            }

            await existing.save();
        }
    }
    return count;
}

module.exports = { scrapeEvents };
