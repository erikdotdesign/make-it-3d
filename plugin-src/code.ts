import { scaleAndPositionNode } from "./helpers";

figma.showUI(__html__, { themeColors: true, width: 816, height: 592 });

const saveToStorage = async (key: string, value: any) => {
  await figma.clientStorage.setAsync(key, value);
};

const loadFromStorage = async (key: string) => {
  const value = await figma.clientStorage.getAsync(key);
  figma.ui.postMessage({ type: "storage-loaded", key, value });
};

const getTextSelection = async () => {
  const selection = figma.currentPage.selection;

  if (selection.length === 0 || selection[0].type !== "TEXT") {
    figma.ui.postMessage({ type: "no-selection" });
    figma.notify("Select a text node");
    return;
  }

  // Clone selection so we don’t affect originals
  const clone: TextNode = selection[0].clone();

  // Flatten
  const node = figma.flatten([clone], figma.currentPage);

  // Move the node (either the clone or the group) off-canvas
  node.x = figma.viewport.bounds.x + figma.viewport.bounds.width + 100;
  node.y = figma.viewport.bounds.y;

  try {
    const bytes = await node.exportAsync({ format: "SVG" });
    figma.ui.postMessage({
      type: "text-selection",
      svgBytes: Array.from(bytes),
    });
  } catch (err) {
    figma.notify("Error converting selection");
    console.error(err);
  } finally {
    node.remove(); // cleanup
  }
};

const addImage = async (img: string, disclaimer = false) => {
  // Fallback to image
  const base64 = img.split(",")[1];
  const data = figma.base64Decode(base64);
  const image = figma.createImage(data);

  const node = figma.createRectangle();
  node.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: image.hash }];
  node.name = "3d-text";
  scaleAndPositionNode(node, 1, 1200);
  figma.currentPage.selection = [node];
  if (disclaimer) {
    figma.notify(`🦩 Image added (a Figma pro plan is required for video 😢)`);
  } else {
    figma.notify(`🦩 Image added`);
  }
};

const addVideoOrImage = async (msg: { video: string; image: string }) => {
  try {
    // Try video first
    const base64 = msg.video.split(",")[1];
    const data = figma.base64Decode(base64);
    const video = await figma.createVideoAsync(data);

    const node = figma.createRectangle();
    node.fills = [{ type: "VIDEO", scaleMode: "FILL", videoHash: video.hash }];
    node.name = "3d-text";
    scaleAndPositionNode(node, 1, 1200);
    figma.currentPage.selection = [node];
    figma.notify(`🦩 Video added`);
  } catch {
    // Fallback to image
    addImage(msg.image, true);
  }
};

const handlers: Record<string, (msg: any) => void | Promise<void>> = {
  "save-storage": (msg) => saveToStorage(msg.key, msg.value),
  "load-storage": (msg) => loadFromStorage(msg.key),
  "get-text-selection": () => getTextSelection(),
  "add-3d-text-video": (msg) => addVideoOrImage(msg),
  "add-3d-text-image": (msg) => addImage(msg.image)
};

figma.ui.onmessage = async (msg) => {
  const handler = handlers[msg.type];
  if (handler) {
    await handler(msg);
  }
};