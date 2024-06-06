document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    tableau.extensions.initializeAsync().then(() => {
        console.log("Extension initialized.");
        document.getElementById('generate-alt-text').addEventListener('click', generateAltText);
    }).catch((err) => {
        console.error("Error initializing Tableau extension:", err);
    });
});

async function generateAltText() {
    try {
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        console.log("Dashboard: ", dashboard);

        const worksheet = dashboard.worksheets[0];
        console.log("Worksheet: ", worksheet);

        const dataTable = await worksheet.getSummaryDataAsync();
        console.log("Data Table: ", dataTable);

        const dataText = summarizeData(dataTable);
        console.log("Data Text: ", dataText);

        // Use the ngrok URL here
        const altText = await getAIAltText(dataText);
        console.log("Generated Alt Text: ", altText);

        // Display the generated alt text
        document.getElementById('alt-text-container').innerText = altText;
    } catch (error) {
        console.error("Error generating alt text:", error);
    }
}

function summarizeData(dataTable) {
    let summary = "";
    dataTable.data.forEach(row => {
        summary += row.map(cell => cell.formattedValue).join(' ') + '\n';
    });
    return summary;
}

async function getAIAltText(dataText) {
    console.log("Sending request to AI server...");
    const response = await fetch('https://8bfc-2601-14f-8381-8de0-8406-366b-831-9987.ngrok-free.app/generate-alt-text', { // Replace with ngrok URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: dataText })
    });
    const result = await response.json();
    console.log("AI Response: ", result);
    return result.altText;
}
