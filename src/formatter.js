export function formatString(str, params, considerPercent = true) {
  if (!str) return str;
  return str.replace(/#(\d+)((?:\[i])?)(%?)/g, function(match, g1, g2, g3, index) {
    if (params[parseInt(g1) - 1]) {
      let v = params[parseInt(g1) - 1]?.Value ?? params[parseInt(g1) - 1];
      if (g3 === '%' && considerPercent) v *= 100;
      if (typeof v === 'number') v = parseFloat(v.toFixed(3));
      return v + g3;
    } else return match;
  });
}
