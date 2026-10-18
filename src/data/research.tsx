// Shared wording and ordering for the homepage and Research page.
// Source: ACES Lab introduction poster supplied by the lab, 18 October 2026.
export const researchAreas = [
  {
    id: 'safety',
    title: 'Trustworthy safety-critical systems',
    summary: (
      <>
        We study <strong>risk perception and prediction</strong>,
        decision-making, and runtime safety for autonomous vehicles and robots.
      </>
    ),
    description: (
      <>
        <p>
          We study how autonomous vehicles and robots{' '}
          <strong>perceive risk</strong>, predict how a situation may develop,
          and make decisions under uncertainty. Our work connects risk
          perception, cognition, decision-making, and{' '}
          <strong>runtime safety</strong>, with a focus on interactions among
          people, vehicles, and the road environment.
        </p>
        <p>
          We develop a unified risk field theory to describe these interactions
          and support <strong>uncertainty-aware risk prediction</strong>. We
          combine knowledge and data for risk-sensitive decision-making, and use
          physical models with learned corrections to support{' '}
          <strong>safe, adaptive control</strong> during operation.
        </p>
      </>
    ),
    image: '/aces/publications/react.webp',
    alt: 'Research on collision avoidance for autonomous driving',
    paperKeys: ['huang-2026-08', 'huang-2026-09'],
  },
  {
    id: 'world-models',
    title: 'Generative AI and world models',
    summary: (
      <>
        We use language, diffusion, and multimodal models for{' '}
        <strong>
          prediction, reasoning, and long-tail scenario generation
        </strong>
        .
      </>
    ),
    description: (
      <>
        <p>
          We use{' '}
          <strong>
            large language models, diffusion models, and multimodal models
          </strong>{' '}
          to predict behavior, reason about interactions, and generate driving
          scenarios. We focus on <strong>long-tail scenarios</strong>: rare
          events and difficult interactions that are important for safety but
          poorly represented in everyday driving data.
        </p>
        <p>
          We study how <strong>world models</strong> can represent an
          environment and predict how it changes as people and vehicles act. Our
          goal is to generate realistic scenarios with controllable conditions
          and risk levels, so that autonomous systems can be{' '}
          <strong>trained, tested, and evaluated</strong> across a wider range
          of situations.
        </p>
      </>
    ),
    image: '/aces/publications/risk-controllable-diffusion.webp',
    alt: 'Research on generating driving scenarios with diffusion models',
    paperKeys: ['huang-2026-03', 'huang-2026-06'],
  },
  {
    id: 'agents',
    title: 'Foundation models and agents',
    summary: (
      <>
        We develop <strong>memory-augmented and model-driven agents</strong>{' '}
        that use foundation models to perceive, reason, and act in the physical
        world.
      </>
    ),
    description: (
      <>
        <p>
          We study how <strong>foundation models</strong> support perception,
          reasoning, and decision-making in driving and robotics. Our agents
          combine observations and task instructions with{' '}
          <strong>memory</strong> and models of their environment to plan
          actions and respond to changing conditions.
        </p>
        <p>
          We focus on <strong>memory-augmented and model-driven agents</strong>{' '}
          for embodied intelligence. We study how they can retain useful
          experience, use tools such as simulation and planning, and learn from
          the results of their actions. The aim is to make their decisions more
          reliable during <strong>long-horizon tasks and interaction</strong>{' '}
          with people and other agents.
        </p>
      </>
    ),
    image: '/aces/publications/safedrive.webp',
    alt: 'Research on language models for driving decisions',
    paperKeys: ['huang-2025-13', 'huang-2026-04'],
  },
] as const
