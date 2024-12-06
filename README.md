# Polyp Observer

A 3D cellular automata visualization tool that allows real-time exploration and manipulation of Conway's Game of Life rules in three dimensions.

## Controls

- **Mouse**: Orbit around the automata
- **Scroll**: Zoom in/out
- **Click**: Select a layer to focus
- **SURV**: Input survival rules (0-8 neighbors)
- **BIRTH**: Input birth rules (0-8 neighbors)
- **Restart**: Generate new random initial state

## Default Rules

The default ruleset (B3/S23) is the classic Conway's Game of Life rule:
- SURVIVAL: 23 (cells survive with 2 or 3 neighbors)
- BIRTH: 3 (new cells are born with exactly 3 neighbors)

## Technical Details

Built with:
- React + TypeScript
- Three.js + React Three Fiber

- Instance-based rendering for performance
- Real-time frustum culling
- Smooth camera animations

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
