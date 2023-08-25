const getDataButton = document.getElementById('get-data-button')
const writeDataButton = document.getElementById('write-data-button')
const readDataButton = document.getElementById('read-data-button')
const deleteDataButton = document.getElementById('delete-data-button')
const distanceSpan = document.getElementById('dist-data')
const redLedStateSpan = document.getElementById('r-led-data')
const greenLedStateSpan = document.getElementById('g-led-data')


getDataButton.addEventListener('click', async (e) => {
    e.preventDefault()

    await fetch('/getDataFromSensor').then((response) => {
        response.json().then((data) => {
            distanceSpan.textContent = data.distance
            redLedStateSpan.textContent = data.redLedState
            greenLedStateSpan.textContent = data.greenLedState
        })
    })
})

writeDataButton.addEventListener('click', async (e) => {
    e.preventDefault()

    await fetch('/saveDataToDb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            distance: distanceSpan.textContent,
            redLedState: redLedStateSpan.textContent,
            greenLedState: greenLedStateSpan.textContent
        })
    })
})

readDataButton.addEventListener('click', async (e) => {
    e.preventDefault()

    const result = await fetch('/getDatafromDb', {
        method: 'GET'
    })

    const data = await result.json()

    const dataTable = document.getElementById('data-tbl')

    if (typeof(dataTable) != 'undefined' && dataTable != null) {
        dataTable.remove()
    }

    // create headers
    const headers = ["Distance", "Red Led State", "Green Led State", "Created At"]
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");

    for (let i = 0; i < 1; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < headers.length; j++) {
            const cell = document.createElement("th");
            const cellText = document.createTextNode(headers[j])
            cell.appendChild(cellText);
            row.appendChild(cell);
        }

        tblBody.appendChild(row);
    }

    for (let i = 0; i < data.length; i++) {
        const row = document.createElement("tr");
        const propertyValues = Object.values(data[i])
        propertyValues[0] = Math.round(propertyValues[0] * 10) / 10
        propertyValues[3] = propertyValues[3].replace(/[TZ]/g,' '); 

        for (let j = 0; j < 4; j++) {
            const cell = document.createElement("td");
            const cellText = document.createTextNode(propertyValues[j])
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
    
        tblBody.appendChild(row);
    }
    
    tbl.appendChild(tblBody);
    tbl.setAttribute('id', 'data-tbl')
    document.body.appendChild(tbl);
    
})

deleteDataButton.addEventListener('click', async (e) => {
    e.preventDefault()

    await fetch('/deleteDataFromDb', {
        method: 'DELETE'
    })
    
})


