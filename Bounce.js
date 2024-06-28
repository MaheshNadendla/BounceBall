      let Width;
      let ButtonRightWidth;
      let MouseRightWidth;
      let ArrowRightWidth;
      let NoOfCoins;
      let ScreenWidth;
      let TheSteps;

      let GORectBaxX;
      let GORectBaxY;
      let GORectBaxH;
      let GORectBaxW;

      let GOFont;
      let GORectTextX;
      let GORectTextY;

      function MobileView() {
        Width = 330;
        ButtonRightWidth = 230;
        MouseRightWidth = 230;
        ArrowRightWidth = 230;
        NoOfCoins = 100;
        ScreenWidth = 300;
        TheSteps = 8;

        GORectBaxX = 40;
        GORectBaxY = 230;
        GORectBaxH = 100;
        GORectBaxW = 250;

        GOFont = "30px Arial";
        GORectTextX = 90;
        GORectTextY = 290;
      }

      function DesktopView() {
        Width = 800;
        ButtonRightWidth = 700;
        MouseRightWidth = 700;
        ArrowRightWidth = 700;
        NoOfCoins = 200;
        ScreenWidth = 800;
        TheSteps = 20;

        GORectBaxX = 210;
        GORectBaxY = 230;
        GORectBaxH = 150;
        GORectBaxW = 400;

        GOFont = "50px Arial";
        GORectTextX = 280;
        GORectTextY = 320;
      }

      function HandleMediaChange(event) {
        if (event.matches) {
          console.log("Media query matches! Screen width is at least 600px.");
          // Add your JavaScript for desktop view here
          DesktopView();
        } else {
          console.log(
            "Media query does not match. Screen width is less than 600px."
          );
          MobileView();
          // Add your JavaScript for mobile view here
        }
      }

      // Create a MediaQueryList object
      const mediaQueryList = window.matchMedia("(min-width: 360px)");

      // Call the HandleMediaChange function at runtime
      HandleMediaChange(mediaQueryList);

      // Listen for changes in the media query's state
      mediaQueryList.addEventListener("change", HandleMediaChange);

      let m = 100;
      let Score = 0;
      let Lives = 3;
      let CoinsLocation = [];
      const canvas = document.getElementById("canvas");
      canvas.width = Width;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      let x = canvas.width / 2;
      let y = canvas.height - 90;
      let dx = 2;
      let dy = -2;
      const ballRadius = 10;
      let isPlaying = false;
      let p;

      function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }

      function moveBar(m) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(m, 580, 100, 20);
        ctx.closePath();
      }

      function GameEnd() {
        ctx.fillStyle = "pink";
        ctx.fillRect(GORectBaxX, GORectBaxY, GORectBaxW, GORectBaxH);
        ctx.fillStyle = "red";
        ctx.font = GOFont;
        ctx.fillText("Game Over", GORectTextX, GORectTextY);
        document.querySelector(".Reset").style.display = "block";
        isPlaying = false;
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        CreateCoins();
        moveBar(m);

        if (isPlaying) {
          if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
          }

          if (y + dy < ballRadius) {
            dy = -dy;
          }

          if (y + dy > 570 && x >= m && x <= m + 100) {
            dy = -dy;
          }

          if (y + dy > 570) {
            Lives--;
            if (Lives > 0) {
              resetBallPosition();
            } else {
              GameEnd();
              clearInterval(p);
            }
          }

          let newCoinsLocation = [];
          for (let i = 0; i < CoinsLocation.length; i++) {
            let coin = CoinsLocation[i];
            let isColliding =
              x > coin.x - ballRadius &&
              x < coin.x + 15 + ballRadius &&
              y > coin.y - ballRadius &&
              y < coin.y + 10 + ballRadius;

            if (!isColliding) {
              newCoinsLocation.push(coin);
            } else {
              Score++;
            }
          }

          if (newCoinsLocation.length == 0) {
            getRandomMultipleOf20();
          } else {
            CoinsLocation = newCoinsLocation;
          }

          x += dx;
          y += dy;
        } else {
          // Update ball position to stay on the bar when not playing
          x = m + 50;
        }

        document.querySelector(".Life").textContent = `Life : ${Lives}`;
        document.querySelector(".Score").textContent = `Score : ${Score}`;
      }

      function MoveRight() {
        if (m <= ButtonRightWidth) m += 30;
        if (!isPlaying) x = m + 50; // Move ball with the bar
        updateDragBar();
      }

      function MoveLeft() {
        if (m >= 0) m -= 30;
        if (!isPlaying) x = m + 50; // Move ball with the bar
        updateDragBar();
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" && m <= ArrowRightWidth) {
          m += 30;
          if (!isPlaying) x = m + 50; // Move ball with the bar
          updateDragBar();
        }
        if (e.key === "ArrowLeft" && m >= 0) {
          m -= 30;
          if (!isPlaying) x = m + 50; // Move ball with the bar
          updateDragBar();
        }

        if (e.key === " " && !isPlaying) {
          // Start game with spacebar
          startGame();
        }
        if (e.key === " " && isPlaying && Lives <= 0) {
          // Reset game with spacebar after game over
          CallAgain();
        }
      });

      const dragBar = document.querySelector(".drag-bar");
      let offsetX;

      dragBar.addEventListener("mousedown", (e) => {
        offsetX = e.offsetX; // Fix offsetX calculation
        document.addEventListener("mousemove", documentMouseMove);
        document.addEventListener("mouseup", documentMouseUp);

        function documentMouseMove(e) {
          let newM = e.clientX - offsetX - 50; // 50 is half of the slider width
          if (newM >= 0 && newM <= MouseRightWidth) {
            m = newM;
            dragBar.style.left = `${m}px`;
            if (!isPlaying) x = m + 50; // Move ball with the bar
          }
        }

        function documentMouseUp() {
          document.removeEventListener("mousemove", documentMouseMove);
          document.removeEventListener("mouseup", documentMouseUp);
        }
      });

      function updateDragBar() {
        dragBar.style.left = `${m}px`;
      }

      function startGame() {
        isPlaying = true;
        document.querySelector(".Play").style.display = "none";
      }

      function CallAgain() {
        x = canvas.width / 2;
        y = canvas.height - 90;
        dx = 2;
        dy = -2;
        m = 100;
        Lives = 3;
        Score = 0;
        CoinsLocation = [];
        document.querySelector(".Reset").style.display = "none";
        document.querySelector(".Play").style.display = "block";
        getRandomMultipleOf20();
        if (p) clearInterval(p);
        p = setInterval(draw, 20);
        updateDragBar();
      }

      function resetBallPosition() {
        x = m + 50;
        y = 570;
        dx = 2;
        dy = -2;
        isPlaying = false;
        document.querySelector(".Play").style.display = "block";
      }

      function getRandomMultipleOf20() {
        while (CoinsLocation.length < NoOfCoins) {
          let max = ScreenWidth;
          let step = TheSteps;
          let randomStep = Math.floor(Math.random() * (max / step + 1));
          let randomX = randomStep * step;
          let randomY = [2, 50, 100, 150, 200, 250, 300][
            Math.floor(Math.random() * 7)
          ];
          let exists = CoinsLocation.some(
            (coin) => coin.x === randomX && coin.y === randomY
          );

          if (!exists) {
            CoinsLocation.push({ x: randomX, y: randomY });
          }
        }
      }

      function CreateCoins() {
        for (let i = 0; i < CoinsLocation.length; i++) {
          let coin = CoinsLocation[i];
          ctx.beginPath();
          ctx.fillStyle = "yellow";
          ctx.fillRect(coin.x, coin.y, 15, 10);
          ctx.closePath();
        }
      }

      CallAgain();