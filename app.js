// Lucky Nums
luckyNumButton = document.getElementById('luckyNumButton')
luckyArea = document.getElementById('luckyNumArea')
luckyNum = document.getElementsByName('luckyNum')
luckyAPI = 'http://numbersapi.com/'

async function getLuckyNum(num){
    res = await axios.get(`http://numbersapi.com/${num}`)

    return res
}

function addLuckyNum(fact){
    td = document.createElement('td')
    tr = document.createElement('tr')
    td.innerText = fact
    tr.append(td)
    luckyArea.append(tr)
}

luckyNumButton.addEventListener('click', function(){
    // getLuckyNum(luckyNum[0].value).then(res => addLuckyNum(res.data))

    let luckyPromises = []

    for (let i = 0; i < 4; i++){
        luckyPromises.push(
            axios.get(`http://numbersapi.com/${luckyNum[0].value}`)
        );
    }

    Promise.all(luckyPromises).then(
        arr => (arr.forEach(p => addLuckyNum(p.data)))
    )
    .catch(err => console.log(err))
})

// Need to solve shuffling issues

shuffleDeckButton = document.getElementById('newDeck')
drawCardButton = document.getElementById('drawButton')
drawAllButton = document.getElementById('drawAll')
cardArea = document.getElementById('cardArea')

let deck_id;

async function shuffleNewDeck(){
    res = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')

    return res
}

async function drawCard(deck_id){
    res = await axios.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)

    return res
}

function addCard(cardNum, suit){
    newTr = document.createElement('tr')
    newTd = document.createElement('td')
    newTd.innerText = `${cardNum} of ${suit}`
    newTr.append(newTd)
    cardArea.append(newTr)
}

shuffleDeckButton.addEventListener('click', function(){
    shuffleNewDeck().then(res => deck_id = res.data.deck_id)
})


drawCardButton.addEventListener('click', function(){
    if(deck_id == undefined){
        alert('Must shuffle a new deck first!')
    } else{
        drawCard(deck_id)
            .then(res => addCard(res.data.cards[0].value, res.data.cards[0].suit))  
            .catch(err => alert('Out of cards! Shuffle Deck', err))      
    }
})

// Draw 52 cards
drawAllButton.addEventListener('click', function(){
    if(deck_id == undefined){
        alert('Must shuffle a new deck first!')
    } else{
        drawPromises = []

        for (let i = 0; i < 52; i++){
            drawPromises.push(
                axios.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
            );
        }

        Promise.all(drawPromises).then(
            arr => (arr.forEach(p => addCard(p.data.cards[0].value, p.data.cards[0].suit)))
        )
        .catch(err => console.log(err))  
    }
})