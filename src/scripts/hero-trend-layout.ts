// The exported product SVG has no React resize hook. Fit its original plot to
// the frame while keeping the product's axis margins, text and stroke sizes.
export function createTrendLayout(frame: HTMLElement) {
  const svg = frame.querySelector<SVGSVGElement>('svg')!;
  const [, , originalWidth, originalHeight] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number);
  const number = (node: Element, name: string) => Number(node.getAttribute(name));
  const xLabels = Array.from(svg.querySelectorAll<SVGTextElement>('[data-testid="trend-x-axis-label"]')).map(node => ({ node, x: number(node, 'x'), bottom: originalHeight - number(node, 'y') }));
  const yLabels = Array.from(svg.querySelectorAll<SVGTextElement>('[data-testid="trend-y-axis-label"]')).map(node => {
    const line = node.parentElement!.querySelector('line')!;
    return { node, line, y: number(line, 'y1'), baseline: number(node, 'y') - number(line, 'y1'), right: originalWidth - number(line, 'x2') };
  });
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-testid^="trend-gap-"]')).map(node => ({ node, data: node.getAttribute('d')! }));
  const left = Math.min(...xLabels.map(label => label.x));
  const right = originalWidth - Math.max(...xLabels.map(label => label.x));
  const top = Math.min(...yLabels.map(label => label.y));
  const bottom = originalHeight - Math.max(...yLabels.map(label => label.y));
  let previousSize = '';

  return () => {
    // client dimensions exclude the outer marketing camera's scale transform.
    const width = frame.clientWidth, height = frame.clientHeight;
    if (width <= left + right || height <= top + bottom) return;
    const size = `${width} ${height}`;
    if (size === previousSize) return;
    previousSize = size;
    const sx = (width - left - right) / (originalWidth - left - right);
    const sy = (height - top - bottom) / (originalHeight - top - bottom);
    const tx = left * (1 - sx), ty = top * (1 - sy);
    svg.setAttribute('viewBox', `0 0 ${size}`);
    paths.forEach(({ node, data }) => {
      // Product paths use absolute M/L/C coordinate pairs. Reflow the actual
      // coordinates so pathLength-based reveals still reach the final point.
      node.setAttribute('d', data.replace(/(-?[\d.]+(?:e[+-]?\d+)?),(-?[\d.]+(?:e[+-]?\d+)?)/gi, (_, x, y) => `${Number(x) * sx + tx},${Number(y) * sy + ty}`));
    });
    svg.querySelectorAll('linearGradient').forEach(gradient => gradient.setAttribute('y2', String(height - bottom)));
    svg.querySelectorAll('filter').forEach(filter => { filter.setAttribute('width', String(width)); filter.setAttribute('height', String(height)); });
    xLabels.forEach(({ node, x, bottom: labelBottom }) => {
      node.setAttribute('x', String(x * sx + tx));
      node.setAttribute('y', String(height - labelBottom));
    });
    yLabels.forEach(({ node, line, y, baseline, right: lineRight }) => {
      const position = y * sy + ty;
      node.setAttribute('y', String(position + baseline));
      line.setAttribute('y1', String(position));
      line.setAttribute('y2', String(position));
      line.setAttribute('x2', String(width - lineRight));
    });
  };
}
