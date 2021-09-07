const part={
    background: {
      color: {
        value: "#ffffff",
      },
    },
    fpsLimit: 150,
    interactivity: {
      detectsOn: "canvas",
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 400,
          duration: 0.5,
          opacity: 0.8,
          size: 40,
        },
        push: {
          quantity: 1,
        },
        repulse: {
          distance: 50,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#0000a0",
      },
      links: {
        color: "#0000ff",
        distance: 80,
        enable: true,
        opacity: 0.5,
        width: 5,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outMode: "bounce",
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          value_area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 5,
      },
      shape: {
        type: "circle",
      },
      size: {
        random: true,
        value: 5,
      },
    },
    detectRetina: true,
  }

  export default part