document.addEventListener('DOMContentLoaded', function () {
    tableau.extensions.initializeAsync().then(() => {
        console.log("Extension initialized.");
    }).catch((err) => {
        console.error("Error initializing Tableau extension:", err);
    });

    document.getElementById('generate-alt-text').addEventListener('click', generateAltText);
});

async function generateAltText() {
    try {
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const worksheet = dashboard.worksheets[0];

        const dataTable = await worksheet.getSummaryDataAsync();
        console.log("Data Table: ", dataTable);

        const dataText = summarizeData(dataTable);
        console.log("Data Text: ", dataText);

        // Call AI model to generate alt text
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
    const response = await fetch('http://localhost:5000/generate-alt-text', {
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
