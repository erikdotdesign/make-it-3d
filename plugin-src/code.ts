import { scaleAndPositionNode, getAverageFontSize, validLayer, getNodeScale } from "./helpers";
import { ValidLayerType, ValidNode } from "./types";

figma.showUI(__html__, { themeColors: true, width: 816, height: 592 });

const saveToStorage = async (key: string, value: any) => {
  await figma.clientStorage.setAsync(key, value);
};

const loadFromStorage = async (key: string) => {
  const value = await figma.clientStorage.getAsync(key);
  figma.ui.postMessage({ type: "storage-loaded", key, value });
};

const getSelectionSvg = async () => {
  const selection = figma.currentPage.selection;
  const ref = selection[0];

  if (selection.length === 0 || !validLayer(ref)) {
    figma.ui.postMessage({ type: "no-selection" });
    figma.notify("Select a text or vector node");
    return;
  }

  // Flatten clone into vector outlines
  const clone = figma.flatten([(ref as ValidNode).clone()], figma.currentPage);

  // Resize clone
  const targetSize = 100;
  const scale = targetSize / Math.max(clone.width, clone.height);
  clone.resize(clone.width * scale, clone.height * scale);

  // strip style
  clone.fills = [{type: "SOLID", color: {r: 1, g: 1, b: 1}}];
  clone.strokes = [];
  clone.opacity = 1;

  // --- Create a 100x100 transparent frame ---
  const frame = figma.createFrame();
  frame.resize(targetSize, targetSize);
  frame.fills = []; // transparent
  frame.strokes = [];
  frame.clipsContent = false;

  // Center the clone inside the frame
  clone.x = (frame.width - clone.width) / 2;
  clone.y = (frame.height - clone.height) / 2;
  frame.appendChild(clone);

  // Move clone off-canvas
  frame.x = figma.viewport.bounds.x + figma.viewport.bounds.width + 100;
  frame.y = figma.viewport.bounds.y;

  try {
    const svg = await frame.exportAsync({ format: "SVG_STRING" });
    console.log(svg);
    figma.ui.postMessage({
      type: "selection-svg",
      svg
    });
  } catch (err) {
    figma.notify("Error converting selection");
    console.error(err);
  } finally {
    frame.remove(); // cleanup
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
  "get-selection-svg": () => getSelectionSvg(),
  "add-3d-text-video": (msg) => addVideoOrImage(msg),
  "add-3d-text-image": (msg) => addImage(msg.image)
};

figma.ui.onmessage = async (msg) => {
  const handler = handlers[msg.type];
  if (handler) {
    await handler(msg);
  }
};