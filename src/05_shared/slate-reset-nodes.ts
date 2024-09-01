import { Editor, Node, Point, Transforms } from "slate";

export function resetNodes<T extends Node>(
  editor: Editor,
  options: {
    nodes?: Node | Node[];
    at?: Location;
  } = {}
): void {
  const children = [...editor.children];

  children.forEach((node) =>
    editor.apply({ type: "remove_node", path: [0], node })
  );

  if (options.nodes) {
    const nodes = Node.isNode(options.nodes) ? [options.nodes] : options.nodes;

    nodes.forEach((node, i) =>
      editor.apply({ type: "insert_node", path: [i], node: node })
    );
  }

  const point =
    options.at && Point.isPoint(options.at)
      ? options.at
      : Editor.end(editor, []);

  if (point) {
    Transforms.select(editor, point);
  }
}
