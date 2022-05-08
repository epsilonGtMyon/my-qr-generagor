(function () {
  const sourceTextElem = document.querySelector("#sourceText");
  const sourceColorElem = document.querySelector("#sourceColor");
  const generateButtonElem = document.querySelector("#generateButton");
  const imageContainerElem = document.querySelector("#imageContainer");
  const qrImageElem = document.querySelector("#qrImage");
  const saveImageButtonElem = document.querySelector("#saveImageButton");
  const saveAsSVGButtonElem = document.querySelector("#saveAsSVGButton");
  const shareButtonElem = document.querySelector("#shareButton");

  let lastQrParameter = {
    sourceText: "",
    sourceColor: ""
  }

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

    lastQrParameter.sourceText = text
    lastQrParameter.sourceColor = color

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

  saveImageButtonElem.addEventListener("click", () => {
    // ここの変換の仕方は今回の本質ではないので 適当に実装
    //https://zenn.dev/skryo/articles/7d7f1ce601510b

    const svgNode = qrImageElem.parentNode;
    const svgText = new XMLSerializer().serializeToString(svgNode);

    const canvas = document.createElement("canvas");
    canvas.width = svgNode.width.baseVal.value;
    canvas.height = svgNode.height.baseVal.value;

    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      const a = document.createElement("a");
      const svgUrl = canvas.toDataURL("image/png");
      a.href = svgUrl
      a.download = `qrcode-${getFileSuffix()}`;
      
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(svgUrl);
    };
    image.src =
      "data:image/svg+xml;charset=utf-8;base64," +
      btoa(unescape(encodeURIComponent(svgText)));
  });

  saveAsSVGButtonElem.addEventListener("click", () => {
    const svgNode = qrImageElem.parentNode;
    const svgText = new XMLSerializer().serializeToString(svgNode);
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

  shareButtonElem.addEventListener("click", () => {
    const param = new URLSearchParams();
    param.append("sourceText", lastQrParameter.sourceText)
    param.append("sourceColor", lastQrParameter.sourceColor)

    navigator.share({
      title: "QR生成",
      text: "QR生成",
      url: "?" + param.toString()
    })
  });

  //--------------------------------
  //onload
  (function () {
    const param = new URLSearchParams(location.search);
    const sourceText = param.get("sourceText");
    const sourceColor = param.get("sourceColor");

    if (!sourceText) {
      return;
    }

    sourceTextElem.value = sourceText;
    if (sourceColor){
      sourceColorElem.value = sourceColor;
    }
    generateButtonElem.click();
  })();
})();
