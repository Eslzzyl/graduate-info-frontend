// convert #hex notation to rgb array
function parseColor(hexString: string) {
  return [
    hexString.substring(1, 3),
    hexString.substring(3, 5),
    hexString.substring(5, 7),
  ].map((s) => { return parseInt(s, 16); })
};

// zero-pad 1 digit to 2
function pad(s: string) {
  return (s.length === 1) ? '0' + s : s;
};

function gradientColors(start: number, end: number, steps: number, gamma: number) {
  let i, j, ms, me, output = [], so = [];
  gamma = gamma || 1;
  const normalize = (channel: number) => {
    return Math.pow(channel / 255, gamma);
  };
  start = parseColor(start).map(normalize);
  end = parseColor(end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
    }
    output.push('#' + so.join(''));
  }
  return output;
};

export function getSkyColor(): string {
  const black = [0, 0, 0]
  const purple = [88, 52, 133]
  const orange = [232, 131, 72]
  const blue = [45, 221, 227]



  let htmlColor = ''
  return htmlColor
}