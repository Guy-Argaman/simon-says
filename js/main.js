$(document).ready(function () {
    const gameMemory = [];
    let currentSequence = [...gameMemory];
    let gameOver = true;
    let sequenceFlashing = false;
    let level = 1;
    let sound1 = new Audio('sound1.mp3');
    let sound2 = new Audio('sound2.mp3');
    let sound3 = new Audio('sound3.mp3');
    let sound4 = new Audio('sound4.mp3');

    function playSound(audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
    }

    $('button.game-start').on('click', function (e) {
        gameOver = false;
        $(this).attr('aria-hidden', true).fadeOut();
        $('.level').attr('aria-hidden', false).fadeIn();
        setTimeout(() => {
            flashSequence();
            $('.simon-buttons--row button').attr('disabled', false);
        }, 700);
    });

    $('.simon-buttons--row button').on('click', function (e) {
        if (gameOver || sequenceFlashing) return;
        $(this).hasClass('red') ? playSound(sound1) : '';
        $(this).hasClass('blue') ? playSound(sound2) : '';
        $(this).hasClass('yellow') ? playSound(sound3) : '';
        $(this).hasClass('green') ? playSound(sound4) : '';
        if ($(this)[0] === currentSequence.shift()) {
            if (currentSequence.length === 0) {
                $('.simon-buttons--row button').attr('disabled', true);
                setTimeout(() => {
                    levelUp();
                    flashSequence();
                    $('.simon-buttons--row button').attr('disabled', false);
                }, 1500);
            }
        } else {
            level = 1;
            $('.level span').text(level);
            gameOver = true;
            gameMemory.length = 0;
            currentSequence = [];
            $('.simon-buttons--row button').attr('disabled', true);
            $('button.game-start').attr('aria-hidden', false).fadeIn();
            $('.level').attr('aria-hidden', true).fadeOut();
        }
    });

    function levelUp() {
        level++;
        $('.level span').text(level);
    }

    function flashSequence() {
        sequenceFlashing = true;
        $('.level, .simon-buttons, .simon-buttons--row button').addClass('sequence-running');
        let button = selectRandomButton();
        gameMemory.push(button);
        currentSequence = [...gameMemory];
        async function flashButtonWithDelay(button, delay) {
            return new Promise(resolve => {
                setTimeout(() => {
                    $(button).addClass('selected');
                    $(button).hasClass('red') ? playSound(sound1) : '';
                    $(button).hasClass('blue') ? playSound(sound2) : '';
                    $(button).hasClass('yellow') ? playSound(sound3) : '';
                    $(button).hasClass('green') ? playSound(sound4) : '';
                    setTimeout(() => {
                        $(button).removeClass('selected');
                        resolve();
                    }, 700);
                }, delay);
            });
        }

        (async () => {
            for (let i = 0; i < currentSequence.length; i++) {
                let randomButton = currentSequence[i];
                await flashButtonWithDelay(randomButton, 200 * i);
                await new Promise(resolve => setTimeout(resolve, 150));
            }
            sequenceFlashing = false;
            $('.level, .simon-buttons, .simon-buttons--row button').removeClass('sequence-running');
        })();
    }

    function selectRandomButton() {
        return $('.simon-buttons--row button')[getRandomInt(0, 4)];
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
});