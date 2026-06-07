
const problem = {
  title: "Two Sum",
  tags: ["easy", "array", "hash map"],
  story:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.",
  examples: [
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      output: "[0, 1]",
      reason: "nums[0] + nums[1] = 2 + 7 = 9",
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      output: "[1, 2]",
      reason: "nums[0] + nums[1] = 2 + 7 = 9",
    },
  ],
  constraint: [
    "2  ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i]  ≤ 10⁹",
    "-10⁹ ≤ target   ≤ 10⁹",
    "Only one valid answer exists.",
  ],
};
