import Quagga from '@ericblade/quagga2';

const handleBarcodeUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      Quagga.decodeSingle({
        src: e.target.result,
        decoder: {
          readers: ["ean_reader", "code_128_reader"] // ISBNs are usually EAN-13
        },
        locate: true, // find the barcode in the image
      }, (result) => {
        if (result && result.codeResult) {
          const isbn = result.codeResult.code;
          fetchBookDetails(isbn);
        } else {
          alert("Could not detect barcode. Please enter details manually.");
        }
      });
    };
    reader.readAsDataURL(file);
  }
};