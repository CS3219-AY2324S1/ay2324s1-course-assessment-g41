export enum QuestionComplexity {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum QuestionBasicCategories {
  ARRAY = "Array",
  STRING = "String",
  SORTING = "Sorting",
  LINKED_LIST = "Linked List",
  TWO_POINTERS = "Two Pointers",
  HEAP = "Heap",
  STACK = "Stack",
  QUEUE = "Queue",
  MATRIX = "Matrix",

  BACK_TRACKING = "Back Tracking",
  BINARY_SEARCH = "Binary Search",
  BIT_OPERATION = "Bit Operation",
  INTERVALS = "Intervals",
  TREE = "Tree",
}

export enum QuestionIntermediateCategories {
  SLIDING_WINDOW = "Sliding Window",
  HASH_TABLE = "Hash Table",
  MATH = "Math",
  BINARY_TREE = "Binary Tree",
  GREEDY = "Greedy",
  DFS = "Depth First Search",
  BFS = "Breadth First Search",
}

export enum QuestionAdvancedCategories {
  DYNAMIC_PROGRAMMING = "Dynamic Programming",
  DIVIDE_AND_CONQUER = "Divide and Conquer",
  BACKTRACKING = "Backtracking",
  TOPO_SORT = "Topological Sort",
  TRIE = "Trie",
  UNION_FIND = "Union Find",
  QUICKSELECT = "Quickselect",
  MONOTONIC_STACK = "Monotonic Stack",
}

export const QuestionCategories = {
  ...QuestionAdvancedCategories,
  ...QuestionBasicCategories,
  ...QuestionIntermediateCategories,
};

export interface Question {
  title: string;
  id: number;
  description: string;
  categories: string[];
  complexity: QuestionComplexity;
}
