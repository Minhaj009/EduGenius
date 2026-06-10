// Vulnerable JavaScript file for testing GuardianAgent scan flow
const API_KEY = "sk-1234567890abcdef";

function runExpression(input) {
  // Insecure eval usage
  return eval(input);
}

console.log("Loaded test_flaw.js");
console.log("Using API Key configuration placeholder:", API_KEY);
