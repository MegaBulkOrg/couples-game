(function(){
    document.addEventListener('DOMContentLoaded', _ => {
        const toastEl = document.querySelector('.toast'),
              form = document.querySelector('.settings'),
              clock = document.querySelector('.clock'),
              board = document.querySelector('.board'),
              playAgain = document.querySelector('.play-again');
        let cardsQuantity = 0,
            couplesQuantity = 0,
            timerOn = false,
            timerValue = 60,
            tempTimer = timerValue,
            timerGo = null,
            numsArray = [],
            numsArrayCount = 0,
            compareMode = false,
            firstCard = null,
            secondCard = null,
            foundCouples = 0;
        function gameStart () {
            form.classList.remove('active');
            form.classList.add('hidden');
            board.classList.remove('hidden');
            board.classList.add('active');
        }
        function shuffle(arr) {
            let j;
            for(let i = arr.length - 1; i > 0; i--){
                j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
        function couplesArray() {
            couplesQuantity = cardsQuantity / 2;
            for (let i=0; i<couplesQuantity; i++) {
                numsArray.push(i);
                numsArray.push(i);
            }
        }
        function cardOpen() {
            this!=firstCard ? compare(this) : null
        }
        function cardsCreate(){
            numsArray = shuffle(numsArray);
            for (let i = cardsQuantity; i>0; i--) {
                let cardWrapper = document.createElement('div');
                cardWrapper.classList.add('card-wrapper');
                let cardFront = document.createElement('div');
                cardFront.classList.add('card-front');
                cardWrapper.append(cardFront);
                let cardBack = document.createElement('div');
                cardBack.classList.add('card-back');
                cardBack.textContent = numsArray[numsArrayCount];
                cardWrapper.append(cardBack);
                cardWrapper.setAttribute('data-num', numsArray[numsArrayCount]);
                numsArrayCount++;
                board.append(cardWrapper);
                cardWrapper.addEventListener('click', cardOpen);
            }
            numsArrayCount = 0;
        }
        function timerStart() {
            tempTimer--;
            if (tempTimer < 0) {
                clearInterval(timerGo);
                gameFinish('loss')
            } else {
                clock.textContent = tempTimer;
                tempTimer <= 10 ? clock.classList.add('animate__animated', 'animate__heartBeat', 'animate__infinite') : null
            }
        }
        function timerCreate() {
            clock.textContent = timerValue;
            timerGo = setInterval(timerStart, 1000);
        }
        function gameCreate() {
            couplesArray();
            cardsCreate();
            gameStart();
            if (timerOn) timerCreate()
        }
        function closeBothCards(first, second) {
            first.classList.remove('opened');
            first = null;
            second.classList.remove('opened');
            second = null;
        }
        function gameRestart() {
            document.location.reload();
        }
        function gameFinish(result) {
            clock.classList.remove('animate__animated', 'animate__heartBeat', 'animate__infinite');
            if (result === 'win') {
                if (timerOn) clearInterval(timerGo)
                setTimeout(_ => clock.textContent = 'Ура! Вы нашли все пары!', 750);
            }
            if (result === 'loss') {
                clock.textContent = 'Время вышло';
                document.querySelectorAll('.card-wrapper').forEach(currentCard => {
                    currentCard.removeEventListener('click', cardOpen);
                    currentCard.classList.add('opened');
                })
            }
            setTimeout(_ => {
              playAgain.classList.remove('hidden');
              playAgain.classList.add('active');
              playAgain.addEventListener('click', gameRestart);
            }, 750);
        }
        function compare(el) {
          el.classList.add('opened');
          if (!compareMode) {
              secondCard && secondCard.classList.contains('opened') ? setTimeout(closeBothCards, 500, firstCard, secondCard) : null
              compareMode = true;
              firstCard = el;
          } else {
              secondCard = el;
              if (firstCard.dataset.num === el.dataset.num) {
                  el.removeEventListener('click', cardOpen);
                  firstCard.removeEventListener('click', cardOpen);
                  firstCard = null;
                  secondCard = null;
                  foundCouples < couplesQuantity-1 ? foundCouples++ : gameFinish('win')
              }
              compareMode = false;
          }
        }
        form.addEventListener('submit', form => {
            form.preventDefault();
            cardsQuantity = document.querySelector('input[name="cards-quantity"]').value;
            timerOn = document.querySelector('input[name="timer"]').checked;
            if ((cardsQuantity >= 2 && cardsQuantity <= 50) && cardsQuantity%2 === 0) {
              gameCreate();
            } else {
              const toast = new bootstrap.Toast(toastEl);
              toast.show();
            }
        });
    })
})();
