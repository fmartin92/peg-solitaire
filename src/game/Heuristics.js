/* in general, heuristics should accept a DecisionNode as input
and should output a DecisionNode*/

export const ALGORITHMS = new Map();
ALGORITHMS.set("Maximize descendents", randomMaxDescendents);
ALGORITHMS.set("Random choice", randomChoice);
ALGORITHMS.set("Randomized maximize descendents", randomWeightedMaxDescendents);
ALGORITHMS.set(
  "Few connected components",
  randomWeightedMaxDescendentsMinComponents
);
export const DEFAULT_ALGORITHM = "Maximize descendents";

function randomItem(items, weightFn = () => 1) {
  const weights = items.map(weightFn);
  const sumOfWeights = weights.reduce((x, y) => x + y, 0);
  const randomValue = Math.random() * sumOfWeights;
  let total = 0;
  let i = -1;
  while (total <= randomValue) {
    i++;
    total += weights[i];
  }
  return items[i];
}

function maxScoringItems(items, scoreFn) {
  const scores = items.map(scoreFn);
  const maxScore = Math.max(...scores);
  return items.filter((_, idx) => scores[idx] === maxScore);
}

function minScoringItems(items, scoreFn) {
  return maxScoringItems(items, (item) => -scoreFn(item));
}

export function randomChoice(decisionNode) {
  return randomItem(decisionNode.children);
}

export function randomMaxDescendents(decisionNode, params) {
  params = {
    height: 3,
    ...params,
  };
  const candidateItems = maxScoringItems(decisionNode.children, (child) =>
    child.getSubtreeSize(params.height)
  );
  return randomItem(candidateItems);
}

export function randomWeightedMaxDescendents(decisionNode, params) {
  params = {
    height: 4,
    pow: 20,
    ...params,
  };
  return randomItem(decisionNode.children, (child) =>
    Math.pow(child.getSubtreeSize(params.height), params.pow)
  );
}

export function randomWeightedMaxDescendentsMinComponents(
  decisionNode,
  params
) {
  params = {
    height: 4,
    pow: 20,
    maxConnectedComponents: 3,
    ...params,
  };

  const candidateItems = minScoringItems(decisionNode.children, (child) =>
    child.game.getNumConnectedComponents()
  );

  return randomItem(candidateItems, (child) =>
    Math.pow(child.getSubtreeSize(), params.pow)
  );
}
