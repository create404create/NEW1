const apiUrls = [
    "https://api.uspeoplesearch.net/tcpa/v1?x=",
    "https://api.uspeoplesearch.net/tcpa/report?x="
];

async function checkDNCStatus() {
    const phoneNumber = document.getElementById("phoneNumber").value;
    if (!phoneNumber) {
        alert("Please enter a phone number");
        return;
    }

    const resultDiv = document.getElementById("result");
    const output = document.getElementById("output");
    const button = document.querySelector("button");

    // Disable button and show loading state
    button.disabled = true;
    button.textContent = "Checking...";
    output.textContent = "Loading...";
    resultDiv.style.display = "none";

    try {
        const results = await getDNCResults(phoneNumber);
        output.textContent = JSON.stringify(results, null, 2);
        resultDiv.style.display = "block"; // Show results
    } catch (error) {
        output.textContent = "Error: " + error.message;
        resultDiv.style.display = "block";
    } finally {
        // Re-enable button
        button.disabled = false;
        button.textContent = "Check DNC Status";
    }
}

async function getDNCResults(phoneNumber) {
    const results = [];

    for (const url of apiUrls) {
        try {
            const response = await fetch(url + phoneNumber);
            if (!response.ok) {
                throw new Error("API request failed");
            }
            const data = await response.json();
            results.push(data); // Collect API response data
        } catch (error) {
            results.push({ error: error.message });
        }
    }

    return results;
}
