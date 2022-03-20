// randomly generate windows
// collect all the divs
var divs = document.getElementsByClassName("root");
// get window width and height
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

// iterate through divs
for (var i = 0; i < divs.length; i++) {
    // shortcut! the current div in the list
    var thisDiv = divs[i];

    // get random dimensions for each element
    randomWidth = getRandomNumber(400, 600);
    randomHeight = getRandomNumber(300, 600);

    // get random positions for each element
    randomTop = getRandomNumber(0, winHeight - randomHeight);
    randomLeft = getRandomNumber(0, winWidth - randomWidth);

    // update width and height
    thisDiv.style.width = randomWidth + "px";
    thisDiv.style.height = randomHeight + "px";

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

// target elements with the "draggable" class
interact(".draggable").draggable({
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    /*modifiers: [
        interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
        }),
    ],*/
    // enable autoScroll
    autoScroll: true,

    // only draggable from titlebar
    allowFrom: ".title",

    listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,

        // call this function on every dragend event
        end(event) {
            var textEl = event.target.querySelector("p");

            textEl &&
                (textEl.textContent =
                    "moved a distance of " +
                    Math.sqrt(
                        (Math.pow(event.pageX - event.x0, 2) +
                            Math.pow(event.pageY - event.y0, 2)) |
                            0
                    ).toFixed(2) +
                    "px");
        },
    },
});

function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.transform = "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
}

// make windows resizable
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

// close window
function disappear() {
    this.style.display = "none";
}
