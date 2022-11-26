class UNO {
    constructor() {
        this.reset();
    }

    startGame() {
        this.started = true;
        this.shuffleCards();
        var i = 0;
        var rand = Math.floor(Math.random() * 2);
        for (var player in this.cards) {
            for (var j = 0; j < 4; j++) {
                this.cards[player].push({ name: this.cardDeck.pop() });
            }
            if (i === rand) {
                this.waitingFor = player;
            }
            i++;
        }
        console.log(this.cards);
    }

    reset() {
        this.cardDeck = [
            'blue_0', 'blue_1', 'blue_2', 'blue_3',
            'blue_4', 'blue_5', 'blue_6', 'blue_7',
            'blue_8', 'blue_9', 'blue_picker', 'blue_skip',
            'blue_1', 'blue_2', 'blue_3',
            'blue_4', 'blue_5', 'blue_6', 'blue_7',
            'blue_8', 'blue_9', 'blue_picker', 'blue_skip',
            'green_0', 'green_1', 'green_2', 'green_3',
            'green_4', 'green_5', 'green_6', 'green_7',
            'green_8', 'green_9', 'green_picker', 'green_skip',
            'green_1', 'green_2', 'green_3',
            'green_4', 'green_5', 'green_6', 'green_7',
            'green_8', 'green_9', 'green_picker', 'green_skip',
            'red_0', 'red_1', 'red_2', 'red_3',
            'red_4', 'red_5', 'red_6', 'red_7',
            'red_8', 'red_9', 'red_picker', 'red_skip',
            'red_1', 'red_2', 'red_3',
            'red_4', 'red_5', 'red_6', 'red_7',
            'red_8', 'red_9', 'red_picker', 'red_skip',
            'yellow_0', 'yellow_1', 'yellow_2', 'yellow_3',
            'yellow_4', 'yellow_5', 'yellow_6', 'yellow_7',
            'yellow_8', 'yellow_9', 'yellow_picker', 'yellow_skip',
            'yellow_1', 'yellow_2', 'yellow_3',
            'yellow_4', 'yellow_5', 'yellow_6', 'yellow_7',
            'yellow_8', 'yellow_9', 'yellow_picker', 'yellow_skip',
        ]

        this.playedCards = [];

        this.started = false;
        this.cards = {};
        this.waitingFor = '';
        this.playerCount = 0;
        this.top = 'none';
    }

    shuffleCards() {
        this.cardDeck.concat(this.playedCards);
        this.playedCards = [];

        for (let i = this.cardDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cardDeck[i], this.cardDeck[j]] = [this.cardDeck[j], this.cardDeck[i]];
        }
    }

    addPlayer(player) {
        this.cards[player] = [];
        this.playerCount += 1;
    }

    removePlayer(player) {
        delete this.cards[player];
        this.playerCount -= 1;
    }

    playCard(player, card) {
        var cardInfo = card.split('_');
        console.log("card: ", cardInfo);

        var topInfo = this.top.split('_');
        console.log("top: ", topInfo);

        var cardColor = cardInfo[0];
        var cardType = cardInfo[1];

        var topColor = topInfo[0];
        var topType = topInfo[1];

        if (this.top === 'none' || cardColor === topColor || cardType === topType) {
            console.log('can play');
            this.cards[player] = this.cards[player].filter((item) => item.name != card);
            this.top = card;
            this.playedCards.push(card);

            if (this.cards[player].length === 0) {
                console.log('finish');
                this.started = false;
                return;
            }
            
            var opponent = '';

            for (var curr in this.cards) {
                if (player !== curr) {
                    opponent = curr;
                    break;
                }
            }

            var curr = opponent;

            if (cardType === 'picker') {
                this.drawCard(opponent, 2);
                curr = player;
            } else if (cardType === 'skip') {
                curr = player;
            }

            while (true) {
                if (this.canPlay(curr)) {
                    break;
                }
                this.drawCard(curr, 1);
                console.log(this.cardDeck.length);
                if (this.canPlay(curr)) {
                    break;
                }
                curr = curr === player ? opponent : player;
            }

            if (curr === opponent) {
                this.switchPlayer();
            }
        }
    }

    drawCard(player, num) {
        if (this.cardDeck.length < num) {
            this.shuffleCards();
        }

        for (var i = 0; i < num; i++) {
            this.cards[player].push({ name: this.cardDeck.pop() });
        }
    }

    canPlay(player) {
        // console.log('player: ', player);
        var result = false;

        var topInfo = this.top.split('_');
        var topColor = topInfo[0];
        var topType = topInfo[1];

        for (var i = 0; i < this.cards[player].length; i++) {
            // console.log('player card: ', this.cards[player][i]);
            var cardInfo = this.cards[player][i].name.split('_');

            var cardColor = cardInfo[0]; 
            var cardType = cardInfo[1];
            
            if (this.top === 'none' || cardColor === topColor || cardType === topType) {
                result = true;
            }
        }

        return result;
    }

    switchPlayer() {
        for (var currPlayer in this.cards) {
            if (this.waitingFor !== currPlayer) {
                this.waitingFor = currPlayer;
                break;
            }
        }
    }
}

export default UNO;