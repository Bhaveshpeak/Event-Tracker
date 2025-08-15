document.getElementById('fetch-btn').addEventListener('click', fetchEvents);

async function fetchEvents() {
    const date = document.getElementById('dateInput').value;
    if (!date) {
        alert('Please select a date first!');
        return;
    }

    const container = document.querySelector('main');
    container.innerHTML = '';

    try {
        const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?start=${date}&end=${date}`);
        const data = await response.json();

        if (data.events.length === 0) {
            container.innerHTML = '<p>No events found for this date.</p>';
            return;
        }

        data.events.forEach(event => {
            const eventCard = document.createElement('section');
            eventCard.className = 'event-card';

            let imageHTML = '';
            if (event.geometry && event.geometry.length > 0 && event.geometry[0].coordinates) {
                const [lon, lat] = event.geometry[0].coordinates;
                const mapboxURL = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon},${lat},6,0/600x400?access_token=1vOnQAvrxBHb8eyS7yRNtDPTVTmwhrDJud9pebXZ`;
                imageHTML = `<img src="${mapboxURL}" alt="Satellite view" />`;
            }

            eventCard.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Category:</strong> ${event.categories.map(cat => cat.title).join(', ')}</p>
                <p><strong>Date:</strong> ${event.geometry[0]?.date || 'N/A'}</p>
                ${event.description ? `<p>${event.description}</p>` : '<p>No description available.</p>'}
                ${imageHTML}
                <p><a href="${event.sources[0]?.url || '#'}" target="_blank">More info</a></p>
            `;

            container.appendChild(eventCard);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
}
