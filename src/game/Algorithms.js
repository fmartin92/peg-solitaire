const HEIGHT_PARAM = { height: { name: "Height", min: 2, max: 6, default: 2 } };
const WEIGHTED_SAMPLING_PARAM = {
  pow: { name: "Power", min: 1, max: 40, default: 25 },
};

export const RandomChoice = {
  name: "Random choice",
  params: {},
  play: (decisionNode) => randomItem(decisionNode.children),
};

export const RandomMaxDescendants = {
  name: "Maximize descendants",
  params: { ...HEIGHT_PARAM },
  play: (decisionNode, params) => {
    const candidateItems = maxScoringItems(decisionNode.children, (child) =>
      child.getSubtreeSize(params.height)
    );
    return randomItem(candidateItems);
  },
};

export const RandomWeightedMaxDescendants = {
  name: "Randomized maximize descendants",
  params: {
    ...HEIGHT_PARAM,
    ...WEIGHTED_SAMPLING_PARAM,
  },
  play: (decisionNode, params) => {
    return randomItem(decisionNode.children, (child) =>
      Math.pow(child.getSubtreeSize(params.height), params.pow)
    );
  },
};

export const RandomWeightedMaxDescendantsMinComponents = {
  name: "Few connected components",
  params: {
    ...HEIGHT_PARAM,
    ...WEIGHTED_SAMPLING_PARAM,
  },
  play: (decisionNode, params) => {
    const candidateItems = minScoringItems(decisionNode.children, (child) =>
      child.game.getNumConnectedComponents()
    );

    return randomItem(candidateItems, (child) =>
      Math.pow(child.getSubtreeSize(params.height), params.pow)
    );
  },
};

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

export const ALGORITHMS = [
  RandomChoice,
  RandomMaxDescendants,
  RandomWeightedMaxDescendants,
  RandomWeightedMaxDescendantsMinComponents,
];

export const DEFAULT_ALGORITHM = RandomMaxDescendants;
