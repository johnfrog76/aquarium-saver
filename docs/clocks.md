# The room clock

This page covers the motion and lighting rules every tank follows. The room
has its own clocks, and the rules are what make the tank restful rather than
busy.

- **No room clock under seven seconds.** Corals pulse on clocks between 7.3
  and 13.2 seconds; the clam breathes over 9.3 with the exhale held; a discus
  drifts over 43; a school over 37; a pearl grows for most of 37 to 47. The
  floor is the room's, not an atom's: a fin's flutter, a tail's wag, a
  shrimp's antenna twitch and a bubble's rise are motions inside one atom,
  and run faster.
- **Uneven keyframes, and more rest than motion.** A coral spends more than
  half its cycle between beats. A fish drifts to a pause it has reached and
  stays there. Nothing stops dead.
- **Negative phase on every instance.** Every clock is mid-cycle on the first
  frame, so nothing is ever *about to* happen.
- **One current.** Plants and corals bend like trees, trunk a little, crown
  more, tips most and last, on one shared 9.5 second current, each meeting the
  beat a little late.
- **One light.** A pendant over the garden, a cool LED bar over the reef.
  Brightest at the surface, caustics on the sand, dim at the glass, and the
  room behind falls off into the dark.
- **Reduced motion is the resting pose.** The static geometry *is* the rest
  state, so `prefers-reduced-motion` shows a tank at rest, not frame zero.

The clocks are set per instance through the custom properties described in
[The atom library](atoms.md). Several of these rules are checked rather than
asserted; see [How the checks run](checks.md).
