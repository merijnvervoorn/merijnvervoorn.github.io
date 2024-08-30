Splitting();


document.addEventListener('DOMContentLoaded', () => {
    const { Engine, Render, Runner, World, Bodies, Body, Events, Mouse, Vector } = Matter;

    // Create engine and world
    const engine = Engine.create();
    const { world } = engine;
    engine.world.gravity.y = 0; // Disable gravity on the y-axis
    engine.world.gravity.x = 0; // Disable gravity on the x-axis

    // Create renderer
    const render = Render.create({
        element: document.getElementById('canvas-container'),
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false, // Enable colors
            background: 'transparent' // Transparent background
        }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add boundaries
    const boundaries = [
        Bodies.rectangle(window.innerWidth / 2, -10, window.innerWidth, 20, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 10, window.innerWidth, 20, { isStatic: true }),
        Bodies.rectangle(-10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth + 10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })
    ];
    World.add(world, boundaries);

    // Function to get a random position within canvas bounds
    function getRandomPosition(width, height) {
        return {
            x: Math.random() * (width/1.5),
            y: Math.random() * height
        };
    }

    // Get canvas dimensions
    const canvasWidth = render.options.width;
    const canvasHeight = render.options.height;

    // Add shapes with random positions
    const shapes = [
        Bodies.circle(getRandomPosition(canvasWidth, canvasHeight).x, getRandomPosition(canvasWidth, canvasHeight).y, 70, { restitution: 0.9, render: { fillStyle: '#B080EF' } }),
        Bodies.rectangle(getRandomPosition(canvasWidth, canvasHeight).x, getRandomPosition(canvasWidth, canvasHeight).y, 120, 120, { restitution: 0.9, render: { fillStyle: '#F9DB6D' } }),
        Bodies.polygon(getRandomPosition(canvasWidth, canvasHeight).x, getRandomPosition(canvasWidth, canvasHeight).y, 3, 80, { restitution: 0.9, render: { fillStyle: '#709AC2' } })
    ];
    World.add(world, shapes);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    render.mouse = mouse;

    // Function to check if mouse is near a shape and apply force
    Events.on(engine, 'beforeUpdate', () => {
        shapes.forEach(shape => {
            const distance = Vector.magnitude(Vector.sub(mouse.position, shape.position));
            const minDistance = 60; // Minimum distance to apply force

            if (distance < minDistance) {
                // Calculate force direction away from mouse cursor
                const forceDirection = Vector.normalise(Vector.sub(shape.position, mouse.position));
                const forceMagnitude = 0.05; // Adjust force magnitude for a stronger or weaker push

                // Apply force away from the mouse
                Body.applyForce(shape, shape.position, Vector.mult(forceDirection, forceMagnitude));
            }
        });
    });

    // Adjust for window resize
    window.addEventListener('resize', () => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
        Body.setPosition(boundaries[0], { x: window.innerWidth / 2, y: -10 });
        Body.setPosition(boundaries[1], { x: window.innerWidth / 2, y: window.innerHeight + 10 });
        Body.setPosition(boundaries[2], { x: -10, y: window.innerHeight / 2 });
        Body.setPosition(boundaries[3], { x: window.innerWidth + 10, y: window.innerHeight / 2 });
    });
});
