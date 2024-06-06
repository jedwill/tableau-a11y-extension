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

        const altText = await getAIAltText(dataText);
        console.log("Generated Alt Text: ", altText);

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
    try {
        console.log("Sending request to AI server...");
        const response = await fetch('https://popular-quail-19.loca.lt/generate-alt-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'bypass-tunnel-reminder': 'true'
            },
            body: JSON.stringify({ text: dataText })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error generating alt text: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        return responseData.altText;
    } catch (error) {
        console.error('Error generating alt text:', error);
    }
}
