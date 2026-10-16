"use strict";

// Каждое выражение вычисляется один раз; выводятся значение и его тип.
const concatResult = "8" + 2;
const subtractResult = "8" - 2;
const explicitSum = Number("8") + 2;
const stringCompare = "12" > "3";
const strictEqual = 12 === "12";
const emptyToNumber = Number("");
const textToNumber = Number("text");
const falseStringToBoolean = Boolean("false");
const typeofNull = typeof null;
const typeofNaN = typeof NaN;

console.log('1.  "8" + 2          =', concatResult, "| тип:", typeof concatResult);
console.log('2.  "8" - 2          =', subtractResult, "| тип:", typeof subtractResult);
console.log('3.  Number("8") + 2  =', explicitSum, "| тип:", typeof explicitSum);
console.log('4.  "12" > "3"       =', stringCompare, "| тип:", typeof stringCompare);
console.log('5.  12 === "12"      =', strictEqual, "| тип:", typeof strictEqual);
console.log('6.  Number("")       =', emptyToNumber, "| тип:", typeof emptyToNumber);
console.log('7.  Number("text")   =', textToNumber, "| тип:", typeof textToNumber);
console.log('8.  Boolean("false") =', falseStringToBoolean, "| тип:", typeof falseStringToBoolean);
console.log("9.  typeof null      =", typeofNull, "| тип:", typeof typeofNull);
console.log("10. typeof NaN       =", typeofNaN, "| тип:", typeof typeofNaN);
