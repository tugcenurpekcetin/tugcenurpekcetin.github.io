export const robotDock = {
  // Box size
  width: 220,
  height: 240,

  // Position from viewport edges
  dockRight: 24, // px
  dockBottom: 24, // px

  // Optional deltas
  moveRight: 35, // + moves right (reduces right gap), − moves left
  moveUp: 0, // + moves up (increases bottom gap)

  // Cropping inside the box (px)
  cropRight: 60,
  cropBottom: 60,
  cropLeft: 30, // new: trim from the left
  cropUp: 0, // new: trim from the top

  // Frame adjustments inside the box
  offsetX: 0,
  offsetY: 0,
  scale: 1,
} as const
