const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertButton = document.getElementById("convert");
const errorMessage = document.getElementById("error");
const copyButton = document.getElementById("copy");
const copyStatus = document.getElementById("copy-status");

const output = {
    C: document.getElementById("celsius"),
    F: document.getElementById("fahrenheit"),
    K: document.getElementById("kelvin")
};

let latestResults = null;

function formatTemperature(value) {
    const rounded = Math.abs(value) < 0.0000005 ? 0 : value;
    return Number(rounded.toFixed(2)).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        useGrouping: false
    });
}

function resetResults() {
    latestResults = null;

    Object.values(output).forEach(element => {
        element.innerHTML = `— <small>${element === output.K ? "K" : element === output.C ? "°C" : "°F"}</small>`;
    });

    copyButton.disabled = true;
    copyStatus.textContent = "";
}

function convertTemperature() {
    const rawValue = temperatureInput.value.trim();
    const value = Number(rawValue);
    const unit = unitSelect.value;

    errorMessage.textContent = "";
    copyStatus.textContent = "";

    if (rawValue === "" || !Number.isFinite(value)) {
        errorMessage.textContent = "Please enter a valid temperature.";
        resetResults();
        return;
    }

    let celsius;

    if (unit === "C") {
        celsius = value;
    } else if (unit === "F") {
        celsius = (value - 32) * 5 / 9;
    } else {
        celsius = value - 273.15;
    }

    if (celsius < -273.15) {
        errorMessage.textContent =
            "Temperature cannot be below absolute zero (−273.15°C).";
        resetResults();
        return;
    }

    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;

    latestResults = { celsius, fahrenheit, kelvin };

    output.C.innerHTML = `${formatTemperature(celsius)} <small>°C</small>`;
    output.F.innerHTML = `${formatTemperature(fahrenheit)} <small>°F</small>`;
    output.K.innerHTML = `${formatTemperature(kelvin)} <small>K</small>`;

    copyButton.disabled = false;
}

convertButton.addEventListener("click", convertTemperature);

temperatureInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        convertTemperature();
    }
});

temperatureInput.addEventListener("input", () => {
    errorMessage.textContent = "";
    copyStatus.textContent = "";
});

unitSelect.addEventListener("change", () => {
    errorMessage.textContent = "";
    copyStatus.textContent = "";
});

document.querySelectorAll(".example").forEach(button => {
    button.addEventListener("click", () => {
        temperatureInput.value = button.dataset.value;
        unitSelect.value = button.dataset.unit;
        convertTemperature();
    });
});

copyButton.addEventListener("click", async () => {
    if (!latestResults) return;

    const text = [
        `Celsius: ${formatTemperature(latestResults.celsius)} °C`,
        `Fahrenheit: ${formatTemperature(latestResults.fahrenheit)} °F`,
        `Kelvin: ${formatTemperature(latestResults.kelvin)} K`
    ].join("\n");

    try {
        await navigator.clipboard.writeText(text);
        copyStatus.textContent = "Results copied successfully.";
    } catch {
        copyStatus.textContent =
            "Copy is unavailable here. You can select and copy the results manually.";
    }
});
