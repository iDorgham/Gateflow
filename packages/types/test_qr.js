const CryptoJS = require('crypto-js');

function hmacSign(data, secret) {
  return CryptoJS.HmacSHA256(data, secret).toString(CryptoJS.enc.Hex);
}

const secret = "dOiCNwP+3pzjJTJQPsd0LGoDw85QvhQOywj7sccaBiCpvAVBIXLdsrG89DoKLCXK";
const qrString = "gateflow:1:eyJxcklkIjoiMjJhYTlhYjMtNWMyMy00Yzk5LWIwZmItZWZjYTgzY2Q2YmIxIiwib3JnYW5pemF0aW9uSWQiOiJjbWx3amxoanQwMDBmc3VmcngxMTJybHpwIiwidHlwZSI6IlNJTkdMRSIsIm1heFVzZXMiOjEsImV4cGlyZXNBdCI6IjIwMjYtMDItMjhUMTY6MDM6MDAuMDAwWiIsImlzc3VlZEF0IjoiMjAyNi0wMi0yMVQxODowMzoyMC42NDJaIiwibm9uY2UiOiJkMTYyODdkOS03ZDM2LTRjOTgtOWUyNS0xYzQwNjcwMTE0NmUifQ.0f816bc605ce389bd78806857b40cc40dc292bf5b5c8b73808b98ddd0b086ce7";

const parts = qrString.split(':');
const payloadAndSig = parts[2];
const dotIndex = payloadAndSig.lastIndexOf('.');
const encodedPayload = payloadAndSig.slice(0, dotIndex);
const signature = payloadAndSig.slice(dotIndex + 1);

const expectedSig = hmacSign(encodedPayload, secret);
console.log('Provided Sig:', signature);
console.log('Expected Sig:', expectedSig);
console.log('Match?', signature === expectedSig);
