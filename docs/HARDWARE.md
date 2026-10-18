# Hardware page maintenance

The Hardware page is maintained in `src/app/hardware/page.tsx`. Its four entries are Unitree G1 Humanoid, Unitree Go2 Quadruped, Autonomous Vehicle, and Driving Simulator. All images use `assetPath` so they work at a GitHub Pages project path.

## Images

| Entry                 | Website asset                             | Original image                                                                              |
| --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| Unitree G1 Humanoid   | `public/hardware/humanoid.png`            | Existing Stanford ASL template photograph; replace when the lab provides its G1 photograph. |
| Unitree Go2 Quadruped | `public/hardware/unitree-go2.webp`        | Existing Stanford ASL template photograph, `public/hardware/quad.png`.                      |
| Autonomous Vehicle    | `public/hardware/autonomous-vehicle.webp` | User-provided `../LabDevice/图片 1.png`.                                                    |
| Driving Simulator     | `public/hardware/driving-simulator.webp`  | User-provided `../LabDevice/图片 2.png`.                                                    |

The two user-provided photographs were identified by visual inspection. Their full framing is preserved. The WebP files were generated with Sharp at quality 88, with a maximum width of 1440 px and height of 1600 px, without enlargement. The original files are unchanged. No image content was generated, removed, or retouched.

The G1 and Go2 photographs are reference images from the original template. They do not document the lab's robot configurations or facilities. Source records are kept here rather than displayed as captions on the page.

## Descriptions and sources

Checked on 2026-10-18:

- [Stanford ASL Hardware](https://stanfordasl.github.io/hardware/): identifies the original Unitree G1 and Go2 photographs. Statements about Stanford ASL experiments and installed configurations are not used as claims about ACES Lab.
- [Unitree G1](https://www.unitree.com/g1/): supports the general description of humanoid motion, depth camera, 3D LiDAR, imitation learning, and reinforcement learning. The page does not state a joint count or assume a specific G1 variant.
- [Unitree Go2](https://www.unitree.com/go2/): supports the description of quadruped locomotion, a wide-angle camera, and LiDAR. The page does not assume an EDU model, depth camera, foot force sensors, or a particular onboard computer.

Vehicle and simulator descriptions explain their general research uses and the visible equipment. They do not claim a vehicle model, sensor specification, simulator manufacturer, motion platform, deployment permission, or completed experiment. Update these details only when the lab provides verified information.
