// Research platforms, shared by the homepage and the Hardware page.
// Sources and image provenance: docs/HARDWARE.md. The G1 and Go2 photographs
// are reference images from the original template until the lab supplies its own.

export const platforms = [
  {
    id: 'g1',
    short: 'Humanoid robot',
    title: 'Unitree G1 Humanoid',
    category: 'Humanoid robotics',
    image: '/hardware/humanoid.png',
    alt: 'Unitree G1 humanoid robot photographed outdoors.',
    width: 1206,
    height: 807,
    paragraphs: [
      <>
        The Unitree G1 is a humanoid robot designed for coordinated movement of
        its arms, legs, and torso. Its range of joint motion supports research
        on <strong>balance, locomotion, and whole-body control</strong>. A depth
        camera and 3D LiDAR provide information about the surrounding
        environment.
      </>,
      <>
        The platform supports the study of{' '}
        <strong>imitation learning and reinforcement learning</strong> for robot
        motion. It also provides a setting for testing how learned policies
        respond to <strong>physical constraints</strong>, such as joint limits,
        balance, and contact with objects. These questions connect robot
        learning with safe operation in the physical world.
      </>,
    ],
  },
  {
    id: 'go2',
    short: 'Quadruped robot',
    title: 'Unitree Go2 Quadruped',
    category: 'Legged robotics',
    image: '/hardware/unitree-go2.webp',
    alt: 'Unitree Go2 quadruped robot standing on a paved outdoor surface.',
    width: 1200,
    height: 1600,
    landscapeCrop: true,
    paragraphs: [
      <>
        The Unitree Go2 is a quadruped robot for studying{' '}
        <strong>legged locomotion and navigation</strong>. Its articulated legs
        allow it to move over uneven surfaces, while a wide-angle camera and
        LiDAR provide information about nearby obstacles.
      </>,
      <>
        Quadruped robots provide a platform for evaluating{' '}
        <strong>learned control policies</strong> beyond simulation. Research
        questions include maintaining balance, planning paths around obstacles,
        and monitoring safety as terrain and sensor observations change. These
        tasks connect <strong>perception, planning, and control</strong> in a
        physical system.
      </>,
    ],
  },
  {
    id: 'vehicle',
    short: 'Autonomous vehicle',
    title: 'Autonomous Vehicle',
    category: 'Autonomous driving',
    image: '/hardware/autonomous-vehicle.webp',
    alt: 'White autonomous vehicle with roof-mounted sensors, photographed indoors.',
    width: 1410,
    height: 918,
    paragraphs: [
      <>
        An autonomous vehicle brings{' '}
        <strong>sensing, prediction, planning, and control</strong> together on
        a physical platform. Sensors observe the surroundings, while the driving
        system uses these observations to plan and control vehicle motion.
      </>,
      <>
        Vehicle research examines how these components work together under{' '}
        <strong>uncertainty</strong>. Key questions include responding to other
        road users, adapting to changing conditions, and{' '}
        <strong>maintaining safety</strong> when observations or predictions are
        incomplete.
      </>,
    ],
  },
  {
    id: 'simulator',
    short: 'Driving simulator',
    title: 'Driving Simulator',
    category: 'Driving simulation',
    image: '/hardware/driving-simulator.webp',
    alt: 'Driving simulator with a cockpit, steering wheel, pedals, and a wide display showing a road scene.',
    width: 1440,
    height: 988,
    paragraphs: [
      <>
        The driving simulator combines a cockpit with steering controls, pedals,
        and a wide visual display. It provides a controlled setting for
        examining <strong>driving behavior</strong> and{' '}
        <strong>interaction between people and automated systems</strong>.
      </>,
      <>
        Simulation makes it possible to study road situations without exposing
        participants to traffic. It supports research on how drivers{' '}
        <strong>perceive risk</strong>, <strong>make decisions</strong>, and
        respond to the behavior of surrounding vehicles.
      </>,
    ],
  },
]
