let colorPalette = ["red", "blue", "green", "orange", "purple", "yellow", "cyan", "pink", "lime", "brown"];

function createRunnersForm() {
  const num = document.getElementById('numRunners').value;
  let formHtml = '';

  for (let i = 1; i <= num; i++) {
    formHtml += `
            <label for="runnerName${i}">Runner ${i} Name:</label>
            <input type="text" id="runnerName${i}" required>
        `;
  }
  formHtml += '<button onclick="startSetup()">Start Setup</button>';
  document.getElementById('runnerNamesForm').innerHTML = formHtml;
}

function startSetup() {
  const track = document.querySelector('.track');
  track.innerHTML = ''; // Clear the existing lanes and runners

  for (let i = 1; i <= document.getElementById('numRunners').value; i++) {
    const lane = document.createElement('div');
    lane.className = 'lane';

    const runner = document.createElement('div');
    runner.className = 'runner';
    runner.id = `runner${i}`;
    runner.style.backgroundColor = colorPalette[i - 1]; // Assign color from palette

    const runnerName = document.createElement('div');
    runnerName.className = 'runnerName';
    runnerName.textContent = document.getElementById(`runnerName${i}`).value;

    runner.appendChild(runnerName);
    lane.appendChild(runner);
    track.appendChild(lane);
  }

  document.getElementById('setup').style.display = 'none'; // Hide setup form
  document.getElementById('runnerNamesForm').style.display = 'none'; // Hide names form
}

let runners;
let results;
let raceInterval;

function startRace() {
  runners = document.querySelectorAll('.runner');
  results = [];
  raceInterval = setInterval(() => {
    let finishedCount = 0; // 결승선에 도착한 참가자 수를 추적하기 위한 변수
    for (let runner of runners) {
      let currentPosition = parseInt(runner.style.left) || 0;

      // 이미 결승선에 도착한 참가자는 움직이지 않게 함
      if (currentPosition >= 580) {
        finishedCount++;
        continue;  // 이 참가자에 대한 나머지 로직을 건너뛰고 다음 참가자로 넘어감
      }

      let randomDistance = Math.floor(Math.random() * 5) - 1;
      runner.style.left = (currentPosition + randomDistance) + 'px';

      // 해당 참가자가 이미 결과에 포함되지 않고 결승선을 통과한 경우
      if (currentPosition + randomDistance >= 580 && !results.includes(runner.id)) {
        results.push(runner.id);
        displayResults();
      }
    }

    // 모든 참가자가 결승선을 통과하면 interval을 중지하고 결과 표시
    if (finishedCount === runners.length) {
      clearInterval(raceInterval);
    }
  }, 33);
}

function displayResults() {
  let tableBody = document.querySelector('#resultTable tbody');
  tableBody.innerHTML = '';

  for (let i = 0; i < results.length; i++) {
    let tr = document.createElement('tr');
    let tdPosition = document.createElement('td');
    let tdRunner = document.createElement('td');

    tdPosition.textContent = i + 1;
    tdRunner.textContent = results[i];

    tr.appendChild(tdPosition);
    tr.appendChild(tdRunner);

    tableBody.appendChild(tr);
  }
}
