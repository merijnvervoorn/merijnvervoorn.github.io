Splitting();

document.addEventListener('DOMContentLoaded', () => {
    const { Engine, Render, Runner, World, Bodies, Body, Events, Vector } = Matter;

    // Create engine and world
    const engine = Engine.create();
    const { world } = engine;
    engine.world.gravity.y = 0; // Disable gravity on the y-axis
    engine.world.gravity.x = 0; // Disable gravity on the x-axis

    // Get the canvas container dimensions
    const canvasContainer = document.getElementById('canvas-container');
    const containerWidth = canvasContainer.offsetWidth;
    const containerHeight = canvasContainer.offsetHeight;

    // Create renderer
    const render = Render.create({
        element: canvasContainer,
        engine: engine,
        options: {
            width: containerWidth,
            height: containerHeight,
            wireframes: false, // Enable colors
            background: 'transparent' // Transparent background
        }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add boundaries based on container size
    const boundaries = [
        Bodies.rectangle(containerWidth / 2, -10, containerWidth, 20, { isStatic: true }),
        Bodies.rectangle(containerWidth / 2, containerHeight + 10, containerWidth, 20, { isStatic: true }),
        Bodies.rectangle(-10, containerHeight / 2, 20, containerHeight, { isStatic: true }),
        Bodies.rectangle(containerWidth + 10, containerHeight / 2, 20, containerHeight, { isStatic: true })
    ];
    World.add(world, boundaries);

    // Create shapes at fixed positions
    const shapes = [
        Bodies.circle(containerWidth / 4, containerHeight / 4, 70, { restitution: 0.9, render: { fillStyle: '#B080EF' } }),
        Bodies.rectangle(containerWidth / 2, containerHeight / 2, 120, 120, { restitution: 0.9, render: { fillStyle: '#F9DB6D' } }),
        Bodies.polygon(containerWidth * 3 / 4, containerHeight * 3 / 4, 3, 80, { restitution: 0.9, render: { fillStyle: '#709AC2' } })
    ];
    World.add(world, shapes);

    // Define movement speeds and spin rates for each shape
    const movementSpeeds = [0.2, 0.5, 0.9]; // Speed for each shape
    const spinRates = [0.01, 0.02, 0.03];  // Spin rate for each shape

    // Keep track of initial positions
    const initialPositions = shapes.map(shape => ({ ...shape.position }));

    // Function to update shapes position and rotation based on scroll
    function updateShapesPosition(scrollY) {
        shapes.forEach((shape, index) => {
            const initialPosition = initialPositions[index];
            const moveAmount = movementSpeeds[index] * scrollY; // Use movement speed for each shape

            // Apply minor adjustments based on scroll
            const newPosition = {
                x: initialPosition.x,
                y: initialPosition.y - moveAmount
            };

            // Ensure shapes stay within bounds
            const boundedPosition = {
                x: Math.max(0, Math.min(containerWidth, newPosition.x)),
                y: Math.max(0, Math.min(containerHeight, newPosition.y))
            };

            // Set new position
            Body.setPosition(shape, boundedPosition);

            // Update rotation for spinning effect
            Body.setAngle(shape, shape.angle + spinRates[index]);
        });
    }

    // Track scroll position
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        updateShapesPosition(scrollY);
    });

    // Adjust for window resize
    window.addEventListener('resize', () => {
        // Recalculate container dimensions
        const newContainerWidth = canvasContainer.offsetWidth;
        const newContainerHeight = canvasContainer.offsetHeight;

        // Update canvas size
        render.canvas.width = newContainerWidth;
        render.canvas.height = newContainerHeight;

        // Update boundaries
        Body.setPosition(boundaries[0], { x: newContainerWidth / 2, y: -10 });
        Body.setPosition(boundaries[1], { x: newContainerWidth / 2, y: newContainerHeight + 10 });
        Body.setPosition(boundaries[2], { x: -10, y: newContainerHeight / 2 });
        Body.setPosition(boundaries[3], { x: newContainerWidth + 10, y: newContainerHeight / 2 });

        // Reposition shapes if necessary
        shapes.forEach(shape => {
            Body.setPosition(shape, {
                x: Math.min(Math.max(shape.position.x, 0), newContainerWidth),
                y: Math.min(Math.max(shape.position.y, 0), newContainerHeight)
            });
        });
    });
});
