const macAddress = "14:1A:7D:DA:71:13";
const ipAddress = "127.0.0.1";

const refresh = async () => {
    const data = await fetch("http://localhost:3001/api/status");
    const text = await data.text();

    const statusText = document.getElementById("status-text");
    statusText.innerText = `${macAddress}-${ipAddress} Status: ${text}`;

    console.log(statusText);
}

refresh();

document.getElementById("register-button").addEventListener("click", async () => {
    await fetch("http://localhost:3000/api/devices", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            macAddress: macAddress,
            ipAddress: ipAddress
        })
    });

    alert("Sent register");
});

document.getElementById("refresh-button").addEventListener("click", async () => {
    await refresh();
});

document.getElementById("hit-button").addEventListener("click", async () => {
    await fetch("http://localhost:3000/api/devices/hit", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            macAddress
        })
    });

    alert("Sent hit");
});

document.getElementById("miss-button").addEventListener("click", async () => {
    alert("Sent miss");


    await fetch("http://localhost:3000/api/devices/miss", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            macAddress
        })
    });

})