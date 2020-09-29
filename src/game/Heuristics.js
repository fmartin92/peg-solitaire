import { DecisionNode } from "./DecisionNode";

export const ALGORITHMS = new Map();
ALGORITHMS.set("Maximize descendents", maximizeDescendents);
ALGORITHMS.set("Random choice", randomChoice);
ALGORITHMS.set(
  "Randomized maximize descendents",
  randomizedMaximizeDescendents
);
ALGORITHMS.set(
  "Few connected components",
  randomizedMaximizeDescendentsFewConnectedComponents
);
export const DEFAULT_ALGORITHM = "Maximize descendents";

function randomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomChoice(gameNode) {
  if (!gameNode.children) {
    gameNode = new DecisionNode(gameNode.game, 2);
  }
  return randomElement(gameNode.children);
}

export function maximizeDescendents(gameNode, params) {
  params = {
    height: 3,
    ...params,
  };
  gameNode.extendTree(params.height);
  const scores = gameNode.children.map((child) => child.getSubtreeSize());
  const maxScore = Math.max(...scores);
  const bestMoves = gameNode.children.filter(
    (_, idx) => scores[idx] === maxScore
  );
  return randomElement(bestMoves);
}

export function randomizedMaximizeDescendents(gameNode, params) {
  params = {
    height: 4,
    pow: 20,
    ...params
  };
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

export function randomizedMaximizeDescendentsFewConnectedComponents(gameNode, params) {
  params = {
    height: 4,
    pow: 20,
    maxConnectedComponents: 3,
    ...params
  };

  gameNode.extendTree(params.height);

  const numConnectedComponents =
    gameNode.children.map(child => child.game.getNumConnectedComponents());
  const minNumConnectedComponents = Math.min(...numConnectedComponents);
  const children =
    gameNode.children.filter((_, i) => numConnectedComponents[i] === minNumConnectedComponents);

  const scores = children.map((child) =>
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
  return children[i];
}
