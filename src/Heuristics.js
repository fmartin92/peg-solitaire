import { DecisionNode } from "./DecisionNode";

function randomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomChoice(gameNode, params) {
  if (!gameNode.children) {
    gameNode = new DecisionNode(gameNode.game, 2);
  }
  return randomElement(gameNode.children);
}

export function maximizeDescendents(gameNode, params) {
  if (!params.height) {
    params.height = 3;
  }
  gameNode.extendTree(params.height);
  const scores = gameNode.children.map((child) => child.getSubtreeSize());
  const maxScore = Math.max(...scores);
  const bestMoves = gameNode.children.filter(
    (_, idx) => scores[idx] === maxScore
  );
  return randomElement(bestMoves);
}

export function randomizedMaximizeDescendents(gameNode, params) {
  if (!params.height) {
    params.height = 4;
  }
  if (!params.pow) {
    params.pow = 20;
  }
  gameNode.extendTree(params.height);
  const scores = gameNode.children.map((child) =>
    Math.pow(child.getSubtreeSize(), params.pow)
  );
  const sumOfScores = scores.reduce((x, y) => x + y, 0);
  const randomValue = Math.random() * sumOfScores;
  let total = 0;
  let i = -1;
  while (total <= randomValue) {
    i++;
    total += scores[i];
  }
  return gameNode.children[i];
}
