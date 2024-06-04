export function deepEquals(a, b) {
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return a === b;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEquals(a[key], b[key])) return false;
  }

  return true;
}

export function extractCommonAttributes(objects) {
  const commonAttributes = {};
  const varyingAttributes = {};

  // Iterate through each object in the array
  objects.forEach((obj) => {
    // Iterate through each attribute in the object
    for (const key in obj) {
      if (objects.every((o) => deepEquals(o[key], obj[key]))) {
        commonAttributes[key] = obj[key];
      } else {
        varyingAttributes[key] = varyingAttributes[key] || [];
        varyingAttributes[key].push(obj[key]);
      }
    }
  });

  // Combine common attributes with varying attributes
  return { ...commonAttributes, ...varyingAttributes };
}
