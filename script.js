(function () {
  const sourceTextElem = document.querySelector("#sourceText");
  const sourceColorElem = document.querySelector("#sourceColor");
  const generateButtonElem = document.querySelector("#generateButton");
  const imageContainerElem = document.querySelector("#imageContainer");
  const qrImageElem = document.querySelector("#qrImage");
  const saveAsSVGButtonElem = document.querySelector("#saveAsSVGButton");

  function clearQrImage() {
    while (qrImageElem.firstChild) {
      qrImageElem.removeChild(qrImageElem.firstChild);
    }
  }

  function getFileSuffix() {
    const d = new Date();
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const date = `0${d.getDate()}`.slice(-2);

    const hour = `0${d.getHours()}`.slice(-2);
    const minute = `0${d.getMinutes()}`.slice(-2);
    const second = `0${d.getSeconds()}`.slice(-2);

    return `${year}${month}${date}-${hour}${minute}${second}`;
  }

  generateButtonElem.addEventListener("click", () => {
    const text = sourceTextElem.value;
    const color = sourceColorElem.value;

    clearQrImage();

    if (text === "") {
      window.alert("文字列を入力してください。");
      return;
    }
    const qrcode = new QRCode(qrImageElem, {
      width: 200,
      height: 200,
      colorDark: color,
      useSVG: true,
    });
    qrcode.makeCode(text);

    if (imageContainerElem.classList.contains("invisible")) {
      imageContainerElem.classList.remove("invisible");
    }
  });

  saveAsSVGButtonElem.addEventListener("click", () => {
    const svgText = new XMLSerializer().serializeToString(
      qrImageElem.parentNode
    );
    const svgBlob = new Blob([svgText], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const a = document.createElement("a");
    a.href = svgUrl;
    a.download = `qrcode-${getFileSuffix()}`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(svgUrl);
  });

  //--------------------------------
  //onload
  (function () {
    const param = new URLSearchParams(location.search);
    const sourceText = param.get("sourceText");

    if (!sourceText) {
      return;
    }

    sourceTextElem.value = sourceText;
    generateButtonElem.click();
  })();
})();
