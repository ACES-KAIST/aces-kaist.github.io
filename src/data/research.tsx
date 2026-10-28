// Shared wording and ordering for the homepage, Research page and menu.
// Source: ACES Lab introduction poster supplied by the lab, 18 October 2026.
// Titles and framing revised on 28 October 2026 to foreground embodied
// intelligence and robotics; confirm wording with the lab director.

export const researchIntro = {
  title: 'Embodied intelligence for safe autonomy',
  lead: (
    <>
      We develop{' '}
      <strong>safe, adaptive, and trustworthy embodied systems</strong>:
      autonomous vehicles and robots that perceive risk, reason about the
      physical world, and act among people. Our research connects safety, world
      models, and embodied agents so that these systems can operate under
      uncertainty in real environments.
    </>
  ),
}

// One loop of embodied intelligence, one research direction per step.
export const researchLoop = [
  {
    id: 'safety',
    verb: 'Perceive & assess',
    text: 'Read the scene as risk: who is around, how they may move, and how close the system is to harm.',
  },
  {
    id: 'world-models',
    verb: 'Predict & imagine',
    text: 'Model how the world evolves as people, vehicles and robots act, including rare and dangerous cases.',
  },
  {
    id: 'agents',
    verb: 'Reason & act',
    text: 'Plan and act with foundation-model agents that remember, use tools and learn from outcomes.',
  },
] as const

export const researchAreas = [
  {
    id: 'safety',
    short: 'Safety-critical autonomy',
    title: 'Safety-critical embodied autonomy',
    summary: (
      <>
        We study how autonomous vehicles and robots{' '}
        <strong>perceive risk, predict what happens next, and stay safe</strong>{' '}
        while acting among people.
      </>
    ),
    description: (
      <>
        <p>
          Embodied systems share physical space with people. We study how{' '}
          <strong>autonomous vehicles and robots perceive risk</strong>, predict
          how a situation may develop, and make decisions under uncertainty. Our
          work connects risk perception, cognition, decision-making, and{' '}
          <strong>runtime safety</strong>, with a focus on interactions among
          people, vehicles, and the road environment.
        </p>
        <p>
          We develop a <strong>unified risk field theory</strong> to describe
          these interactions and support{' '}
          <strong>uncertainty-aware risk prediction</strong>. We combine
          knowledge and data for risk-sensitive decision-making, and use
          physical models with learned corrections to keep control{' '}
          <strong>safe and adaptive</strong> while the system operates.
        </p>
      </>
    ),
    keywords: [
      'Unified risk field',
      'Risk prediction',
      'Decision-making',
      'Runtime safety',
      'Human–machine interaction',
    ],
    image: '/aces/publications/lead.webp',
    video: '/aces/research/lead.mp4',
    alt: 'LEAD: adaptive decision-making for autonomous driving in dynamic environments.',
    paperKeys: ['huang-2026-08', 'huang-2026-09'],
  },
  {
    id: 'world-models',
    short: 'World models',
    title: 'World models for embodied agents',
    summary: (
      <>
        We use language, diffusion, and multimodal models to{' '}
        <strong>predict, reason, and generate long-tail scenarios</strong> in
        which embodied agents are trained and tested.
      </>
    ),
    description: (
      <>
        <p>
          An embodied agent has to anticipate how the world will respond to its
          actions. We use{' '}
          <strong>
            large language models, diffusion models, and multimodal models
          </strong>{' '}
          to predict behavior, reason about interactions, and generate driving
          scenarios. We focus on <strong>long-tail scenarios</strong>: rare
          events and difficult interactions that are important for safety but
          poorly represented in everyday data.
        </p>
        <p>
          We study how <strong>world models</strong> can represent an
          environment and predict how it changes as people, vehicles, and robots
          act. Our goal is to generate realistic scenarios with controllable
          conditions and risk levels, so that autonomous systems can be{' '}
          <strong>trained, tested, and evaluated</strong> across a wider range
          of situations before they act in the physical world.
        </p>
      </>
    ),
    keywords: [
      'World models',
      'Diffusion models',
      'Large language models',
      'Long-tail scenarios',
      'Controllable generation',
    ],
    image: '/aces/publications/risk-controllable-diffusion.webp',
    alt: 'Risk-controllable multi-view diffusion for driving scenario generation.',
    paperKeys: ['huang-2026-03', 'huang-2026-06'],
  },
  {
    id: 'agents',
    short: 'Embodied agents',
    title: 'Embodied foundation models and robot agents',
    summary: (
      <>
        We build <strong>memory-augmented, model-driven agents</strong> on
        foundation models that perceive, reason, and act in the physical world,
        on vehicles and robots.
      </>
    ),
    description: (
      <>
        <p>
          We study how <strong>foundation models</strong> support perception,
          reasoning, and decision-making for <strong>embodied agents</strong> in
          driving and robotics. Our agents combine observations and task
          instructions with <strong>memory</strong> and models of their
          environment to plan actions and respond to changing conditions.
        </p>
        <p>
          We focus on <strong>memory-augmented and model-driven agents</strong>{' '}
          for embodied intelligence on vehicles and robots. We study how they
          can retain useful experience, use tools such as simulation and
          planning, and learn from the results of their actions. The aim is to
          make their decisions more reliable during{' '}
          <strong>long-horizon tasks and physical interaction</strong> with
          people and other agents.
        </p>
      </>
    ),
    keywords: [
      'Foundation models',
      'Embodied agents',
      'Memory',
      'Tool use',
      'Long-horizon tasks',
    ],
    image: '/aces/publications/safedrive.webp',
    alt: 'Research on language models for driving decisions.',
    paperKeys: ['huang-2025-13', 'huang-2026-04'],
  },
] as const

export type ResearchArea = (typeof researchAreas)[number]
