// Create a new worker file for computations
self.onmessage = (e) => {
  const { generations, cameraPosition } = e.data;
  // Perform calculations
  const visibleVoxels = computeVisibleVoxels(generations, cameraPosition);
  self.postMessage(visibleVoxels);
}; 