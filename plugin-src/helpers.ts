export const getTargetBounds = () => {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of selection) {
      const box = node.absoluteBoundingBox;
      if (!box) continue;
      if (box.x < minX) minX = box.x;
      if (box.y < minY) minY = box.y;
      if (box.x + box.width > maxX) maxX = box.x + box.width;
      if (box.y + box.height > maxY) maxY = box.y + box.height;
    }

    if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
      // fallback if no valid bounding boxes
      return null;
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  } else {
    // fallback to viewport bounds
    const vw = figma.viewport.bounds.width;
    const vh = figma.viewport.bounds.height;
    return { x: figma.viewport.center.x - vw / 2, y: figma.viewport.center.y - vh / 2, width: vw, height: vh };
  }
};

export const scaleAndPositionNode = (
  node: SceneNode,
  scalePercent = 1,
  maxWidthOption?: number
) => {
  const targetBounds = getTargetBounds() as { x: number; y: number; width: number; height: number };
  const margin = 0; // optional margin in pixels

  // Determine max width/height based on target bounds and optional maxWidthOption
  const maxWidth = Math.min(targetBounds.width * scalePercent - margin, maxWidthOption ?? Infinity);
  const maxHeight = targetBounds.height * scalePercent - margin;

  const scaleX = maxWidth / node.width;
  const scaleY = maxHeight / node.height;

  // Use the smaller scale to keep aspect ratio
  const scale = Math.min(scaleX, scaleY);

  // Apply scale
  node.resize(node.width * scale, node.height * scale);

  // Position node centered inside target bounds
  node.x = targetBounds.x + (targetBounds.width - node.width) / 2;
  node.y = targetBounds.y + (targetBounds.height - node.height) / 2;

  return scale;
};

export const getAverageFontSize = (textNode: TextNode): number => {
  if (typeof textNode.fontSize === "number") {
    return textNode.fontSize;
  }

  // Mixed font sizes → sample per character
  let total = 0;
  let count = 0;
  for (let i = 0; i < textNode.characters.length; i++) {
    const size = textNode.getRangeFontSize(i, i + 1);
    if (typeof size === "number") {
      total += size;
      count++;
    }
  }

  return count > 0 ? total / count : 12; // fallback to default
};