Array.isFilled = function (arr) {
  return Array.isArray(arr) && !!arr.length;
};
export default {
  sleep: async (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};
