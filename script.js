document.addEventListener('DOMContentLoaded', function () {
    tableau.extensions.initializeAsync().then(() => {
        console.log("Extension initialized.");
    });

    document.getElementById('generate-alt-text').addEventListener('click', generateAltText);
});

async function generateAltText() {
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    const worksheet = dashboard.worksheets[0];

    const dataTable = await worksheet.getSummaryDataAsync();
    const dataText = summarizeData(dataTable);

    // Call AI model to generate alt text
    const altText = await getAIAltText(dataText);

    // Display the generated alt text
    document.getElementById('alt-text-container').innerText = altText;
}

function summarizeData(dataTable) {
    let summary = "";
    dataTable.data.forEach(row => {
        summary += row.map(cell => cell.formattedValue).join(' ') + '\n';
    });
    return summary;
}

async function getAIAltText(dataText) {
    const response = await fetch('http://localhost:5000/generate-alt-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: dataText })
    });
    const result = await response.json();
    return result.altText;
}
