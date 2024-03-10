export function parsePointsToCoordinates(points) {
  return points.map((point) => `lng: ${point[1]}, lat:${point[0]}`).join('; ');
}

export function parseCoordinatesToPoints(coordinates) {
  if (typeof coordinates !== 'string' || coordinates.trim() === '') {
    throw new Error('Invalid coordinates string');
  }

  return coordinates.split('; ').map((s) => {
    const parts = s.match(/lng: ([^,]+), lat:([^;]+)/);
    if (!parts || parts.length !== 3) {
      throw new Error(`Invalid coordinate format: ${s}`);
    }
    const lng = parseFloat(parts[1].trim());
    const lat = parseFloat(parts[2].trim());

    if (isNaN(lng) || isNaN(lat)) {
      throw new Error(`Invalid numerical values for coordinates: ${lng}, ${lat}`);
    }

    return [lat, lng];
  });
}
