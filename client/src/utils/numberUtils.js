// Functions for formatting numbers

export function formatWithCommas(input) {
  let number;

  if (typeof input === "string") {
    number = parseFloat(input);
  } else {
    number = input;
  }

  if (isNaN(number)) {
    throw new Error(
      "Input must be a number or a string that can be converted to a number"
    );
  }

  // Get the number of decimal places
  const decimalPlaces = (() => {
    const match = number.toString().match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
      return 0;
    }
    return Math.max(
      0,
      (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
    );
  })();

  // Convert the number to a string using toFixed, which avoids exponential notation
  let numberStr = number.toFixed(decimalPlaces);

  // Split the number into two parts at the decimal point
  const [wholePart, fractionalPart] = numberStr.split(".");

  // Format the whole part with commas
  const formattedWholePart = parseFloat(wholePart).toLocaleString("en-US");

  // If there is a fractional part, add it back after the decimal point
  if (fractionalPart !== undefined) {
    return `${formattedWholePart}.${fractionalPart}`;
  } else {
    return formattedWholePart;
  }
}

export function formatWithSepoliaETH(number) {
  return `SepoliaETH ${number} `;
}

export function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var f = parseInt(x.toString().split("+")[1]);
    if (f > 20) {
      f -= 20;
      x /= Math.pow(10, f);
      x += new Array(f + 1).join("0");
    }
  }
  return x;
}
