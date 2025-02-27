// CDN을 사용하는 경우 import 문이 필요 없습니다
const pdfjsLib = window["pdfjs-dist/build/pdf"];
console.log(typeof pdfjsLib.getDocument);
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const pdfUrl = "./test.pdf";

async function loadPDF() {
  try {
    const doc = await pdfjsLib.getDocument(pdfUrl).promise; // .promise 추가
    console.log("PDF document:", doc);
  } catch (error) {
    console.error("PDF 로딩 에러:", error);
  }
}

document
  .getElementById("pdfInput")
  .addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async function () {
      const pdfData = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1); // 첫 번째 페이지 변환
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.getElementById("pdfCanvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      // Canvas 데이터를 이미지로 변환
      const imageDataUrl = canvas.toDataURL("image/png");
      const result = await Tesseract.recognize(
        imageDataUrl,
        "kor+eng", // 한국어와 영어 인식
        {
          logger: (m) => console.log(m), // 진행 상황 로깅
        }
      );
      console.log(imageDataUrl, result, "ㅁㄴㅇㄹ");
      document.getElementById('textArea').value = result.data.text;
    };
  });

// async function extractTextFromPDF() {
//   try {
//     // fetch로 PDF 파일 가져오기
//     const response = await fetch("./test.pdf");
//     const pdfData = await response.arrayBuffer();

//     const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(pdfData) })
//       .promise;

//     let extractedText = "";
//     console.log(pdf.numPages,pdfData, "ㅁㄴㅇㄹ");
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       console.log(content, "ㅁㄴㅇㄹ");
//       const pageText = content.items.map((item) => item.str).join(" ");
//       extractedText += pageText + "\n";
//     }

//     console.log(extractedText,'ㅁㄴㅇㄹ');
//   } catch (error) {
//     console.error("PDF 처리 중 오류:", error);
//   }
// }

// extractTextFromPDF();

// loadPDF();
