// Functions for formatting numbers

export function formatWithCommas(input) {
  let number;

  // Check if input is a string
  if (typeof input === "string") {
    // Convert string to number
    number = parseFloat(input);
  } else {
    number = input;
  }

  // Check if the number is NaN (Not a Number), which means the input string couldn't be converted to a number
  if (isNaN(number)) {
    throw new Error(
      "Input must be a number or a string that can be converted to a number"
    );
  }

  return number.toLocaleString("en-US");
}

export function formatWithSepoliaETH(number) {
  return `SepoliaETH ${number} `;
}
