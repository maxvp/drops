// randomly place windows
// collect all the divs
var divs = document.getElementsByClassName("root");
// get window width and height
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

// i stands for "index". you could also call this banana or haircut. it's a variable
for (var i = 0; i < divs.length; i++) {
    // shortcut! the current div in the list
    var thisDiv = divs[i];

    // get random numbers for each element
    randomTop = getRandomNumber(400, winHeight - 400);
    randomLeft = getRandomNumber(400, winWidth - 400);

    // update top and left position
    thisDiv.style.top = randomTop + "px";
    thisDiv.style.left = randomLeft + "px";
}

// function that returns a random number between a min and max
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// interactive.js moveable windows

const position = { x: 0, y: 0 };

interact(".draggable").draggable({
    listeners: {
        start(event) {
            console.log(event.type, event.target);
        },
        move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
    },
    allowFrom: ".title",
});

interact(".resizable").resizable({
    edges: { top: true, left: true, bottom: true, right: true },
    listeners: {
        move: function (event) {
            let { x, y } = event.target.dataset;

            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
                width: `${event.rect.width}px`,
                height: `${event.rect.height}px`,
                transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });
        },
    },
});
