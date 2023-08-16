let colorPalette = ["red", "blue", "green", "orange", "purple", "yellow", "cyan", "pink", "lime", "brown"];


function createRunnersForm() {
  const runnersDataInput = document.getElementById('runnersData').value;
  let formHtml = '';

  if (runnersDataInput) {
    const runnersData = JSON.parse(runnersDataInput);
    document.getElementById('numRunners').setAttribute('value', runnersData.length)
    for (let i = 0; i < runnersData.length; i++) {
      formHtml += `
              <label for="runnerName${i + 1}">Runner ${i + 1} Name:</label>
              <input type="text" id="runnerName${i + 1}" value="${runnersData[i].name}" required>
              <label for="runnerImage${i + 1}">Runner ${i + 1} Image URL:</label>
              <input type="text" id="runnerImage${i + 1}" value="${runnersData[i].imageUrl || ''}">
          `;
    }
    document.getElementById('runnerNamesForm').innerHTML = formHtml;
    startSetup();
  } else {
    const num = document.getElementById('numRunners').value;
    for (let i = 1; i <= num; i++) {
      formHtml += `
              <label for="runnerName${i}">Runner ${i} Name:</label>
              <input type="text" id="runnerName${i}" required>
              <label for="runnerImage${i}">Runner ${i} Image URL:</label>
              <input type="text" id="runnerImage${i}">
          `;
    }
    formHtml += '<button onclick="startSetup()">Start Setup</button>';
    document.getElementById('runnerNamesForm').innerHTML = formHtml;
  }


}
// [{ "name": "Nara" }, { "name": "2" }]
function startSetup() {
  const track = document.querySelector('.track');
  track.innerHTML = '';

  for (let i = 1; i <= document.getElementById('numRunners').value; i++) {
    const lane = document.createElement('div');
    lane.className = 'lane';

    const runner = document.createElement('div');
    runner.className = 'runner';
    runner.id = `runner${i}`;

    const imageUrl = document.getElementById(`runnerImage${i}`).value;
    if (imageUrl) {
      runner.style.backgroundImage = `url(${imageUrl})`;
    } else {
      runner.style.backgroundColor = colorPalette[i - 1];
    }

    const runnerName = document.createElement('div');
    runnerName.className = 'runnerName';
    runnerName.textContent = document.getElementById(`runnerName${i}`).value;

    runner.appendChild(runnerName);
    lane.appendChild(runner);
    track.appendChild(lane);
  }

  document.getElementById('setup').style.display = 'none';
  document.getElementById('runnerNamesForm').style.display = 'none';
}

let runners;
let results;
let raceInterval;

function startRace() {
  runners = document.querySelectorAll('.runner');
  results = [];
  raceInterval = setInterval(() => {
    let finishedCount = 0;
    let maxPosition = 0;

    for (let runner of runners) {
      let currentPosition = parseInt(runner.style.left) || 0;
      if (currentPosition > maxPosition) {
        maxPosition = currentPosition;
      }
    }

    for (let runner of runners) {
      let currentPosition = parseInt(runner.style.left) || 0;

      if (currentPosition >= 800) {  // 경기장 거리를 800px로 조정
        finishedCount++;
        continue;
      }

      let randomDistance = Math.floor(Math.random() * 5) - 1;

      if (currentPosition < maxPosition - 200) {
        randomDistance += 210;
      }
      if (currentPosition < maxPosition - 50) {
        randomDistance += 1;
      }
      if (currentPosition < maxPosition - 20) {
        randomDistance += 1;
      }

      runner.style.left = (currentPosition + randomDistance) + 'px';

      if (currentPosition + randomDistance >= 800 && !results.includes(runner.id)) {  // 경기장 거리를 800px로 조정
        results.push(runner.id);
        displayResults();
      }
    }

    if (finishedCount === runners.length) {
      clearInterval(raceInterval);
    }
  }, 16.5);
}

function displayResults() {
  let tableBody = document.querySelector('#resultTable tbody');
  tableBody.innerHTML = '';

  for (let i = 0; i < results.length; i++) {
    let tr = document.createElement('tr');
    let tdPosition = document.createElement('td');
    let tdRunner = document.createElement('td');

    tdPosition.textContent = i + 1;
    tdRunner.textContent = document.getElementById(results[i]).textContent;

    tr.appendChild(tdPosition);
    tr.appendChild(tdRunner);

    tableBody.appendChild(tr);
  }
}
