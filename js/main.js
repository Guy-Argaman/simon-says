$(document).ready(function () {
    const gameMemory = [];
    let currentSequence = [...gameMemory];
    let gameOver = true;
    let sequenceFlashing = false;
    let level = 1;

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
        if ($(this)[0] === currentSequence.shift()) {
            if (currentSequence.length === 0) {
                levelUp();
                flashSequence();
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
        $('.level, .simon-buttons').addClass('sequence-running');
        let button = selectRandomButton();
        gameMemory.push(button);
        currentSequence = [...gameMemory];
        async function flashButtonWithDelay(button, delay) {
            return new Promise(resolve => {
                setTimeout(() => {
                    $(button).addClass('selected');
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
            $('.level,.simon-buttons').removeClass('sequence-running');
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