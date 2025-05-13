const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-button");
const resultDiv = document.getElementById("result");
const timeDisplay = document.getElementById("time-display");

let player = { x: 200, y: 200, size: 30 };
let obstacles = [];
let gameRunning = false;
let startTime;
let elapsedTime = 0; // 경과 시간

function drawPlayer() {
  ctx.fillStyle = "lime"; // 플레이어 색상
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2); // 원 형태로 플레이어 그리기
  ctx.fill();
}

function drawObstacle(obstacle) {
  ctx.fillStyle = "red"; // 장애물 색상
  ctx.beginPath();
  ctx.arc(obstacle.x, obstacle.y, obstacle.size, 0, Math.PI * 2); // 원 형태로 장애물 그리기
  ctx.fill();
}

function spawnObstacles(count) {
  obstacles = []; // 장애물 배열 초기화
  for (let i = 0; i < count; i++) {
    const edge = Math.floor(Math.random() * 4); // 장애물이 어느 방향에서 나올지
    const margin = 50;
    let obstacle = { size: 20 + Math.random() * 20 }; // 랜덤 크기

    if (edge === 0) { // top
      obstacle.x = Math.random() * canvas.width;
      obstacle.y = -margin;
    } else if (edge === 1) { // bottom
      obstacle.x = Math.random() * canvas.width;
      obstacle.y = canvas.height + margin;
    } else if (edge === 2) { // left
      obstacle.x = -margin;
      obstacle.y = Math.random() * canvas.height;
    } else { // right
      obstacle.x = canvas.width + margin;
      obstacle.y = Math.random() * canvas.height;
    }

    // 장애물 속도를 더 빠르게 설정
    const dx = player.x - obstacle.x;
    const dy = player.y - obstacle.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const speed = 16 + Math.random() * 8;  // 더 빠르게 설정
    obstacle.speedX = (dx / magnitude) * speed;
    obstacle.speedY = (dy / magnitude) * speed;

    obstacles.push(obstacle); // 장애물 배열에 추가
  }
}

function detectCollision(obstacle) {
  const dx = obstacle.x - player.x;
  const dy = obstacle.y - player.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obstacle.size + player.size / 2; // 충돌 검사
}

function endGame(win) {
  gameRunning = false;
  canvas.style.display = "none";
  startBtn.style.display = "inline-block";
  resultDiv.innerText = win ? "🎉 승리! 1초 버텼습니다!" : "💀 패배! 다시 도전하세요!";
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // 화면 초기화

  // 플레이어 그리기
  drawPlayer();

  // 장애물 이동
  obstacles.forEach(obstacle => {
    obstacle.x += obstacle.speedX;
    obstacle.y += obstacle.speedY;
    drawObstacle(obstacle);

    // 충돌 체크
    if (detectCollision(obstacle)) {
      endGame(false);
      return;
    }
  });

  // 경과 시간 계산 (밀리초 단위)
  elapsedTime = (Date.now() - startTime) / 1000; // 초로 변환

  // 소수점 두 자릿수까지 표시
  timeDisplay.innerText = `경과 시간: ${elapsedTime.toFixed(2)}초`; // 소수점 두 자릿수까지 표시

  // 1초 경과 체크
  if (elapsedTime >= 1) {
    endGame(true);
    return;
  }

  requestAnimationFrame(update); // 반복 호출로 애니메이션처럼 업데이트
}

startBtn.addEventListener("click", () => {
  resultDiv.innerText = "";
  canvas.style.display = "block";
  startBtn.style.display = "none";

  // 초기 위치
  player.x = 200;
  player.y = 200;

  spawnObstacles(3);  // 장애물 3개 생성

  gameRunning = true;
  startTime = Date.now(); // 게임 시작 시간 기록
  elapsedTime = 0; // 경과 시간 초기화
  update(); // 게임 루프 시작
});

// 마우스 클릭 또는 터치로 플레이어 이동
function movePlayer(e) {
  if (!gameRunning) return;
  e.preventDefault();  // 터치 및 마우스에서 기본 동작 방지 (스크롤 등)

  const rect = canvas.getBoundingClientRect();
  const touchX = (e.clientX || e.touches[0].clientX) - rect.left;
  const touchY = (e.clientY || e.touches[0].clientY) - rect.top;

  player.x = touchX;
  player.y = touchY;
}

// 마우스 클릭 이벤트
canvas.addEventListener("mousedown", movePlayer);

// 터치 이벤트 (모바일)
canvas.addEventListener("touchstart", movePlayer);
canvas.addEventListener("touchmove", movePlayer);
