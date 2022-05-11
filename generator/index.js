var QRCode = require('qrcode')

QRCode.toFile('../qr-code/qrcode.png', process.argv[2]);