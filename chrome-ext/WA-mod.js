console.log('load WA-mod');
let expression;
const doc = document;
let emojiEl;

// restart if page reloads
doc.addEventListener('click', () => {
    if (!expression) { expression = new Expression(); }
  
    if (doc.getElementById('main')) {
        // insert emoji el
        if (!doc.getElementById('main').getElementsByClassName('facial-expression').length) {
            setEmojiEl();
            setWebcamEl();
            setTimeout(() => expression.getWebcamImpression(), 1000);
        } else {
            console.log('not found or already exists');
        }
    }
});

function setWebcamEl() {
    const webcamEl = doc.createElement('video');
    webcamEl.autoplay = true;
    webcamEl.muted = 'muted';
    webcamEl.style = `
      height: 120px;
      width: 150px;
      position: absolute;
      bottom: -60px;
      left: 120px;
    `;
    doc
    .getElementById('main')
    .getElementsByClassName('facial-expression')[0]
    .insertAdjacentElement('afterend', webcamEl);

    expression.requestUserMedia(webcamEl);
}

function setEmojiEl() {
    let inputBar = doc.getElementById('main').getElementsByTagName('footer')[0];
    //   insert emoji el
    emojiEl = doc.createElement('div');
    emojiEl.classList.add('facial-expression');
    emojiEl.innerHTML = '😶';
    emojiEl.style = `
                font-size: 2.8em;
                position: absolute;
                bottom: 52px;
                left: 12px;
                z-index: 12;
            `;

    inputBar.insertAdjacentElement('beforebegin', emojiEl);
    expression.emojiEl = emojiEl;
}