const move = new Moveable(document.body, {
    target: document.querySelector(".root"),
    draggable: true,
});

move.on("drag", ({ target, transform }) => {
    target.style.transform = transform;
});
