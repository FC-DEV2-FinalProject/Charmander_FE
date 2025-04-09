import { pdfjs } from 'react-pdf';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

export const extractTextFromPDF = async ({
  file,
  setArticlePDFText,
  clearArticlePDFText,
}: {
  file: File;
  // eslint-disable-next-line no-unused-vars
  setArticlePDFText: (text: string) => void;
  clearArticlePDFText: () => void;
}): Promise<void> => {
  clearArticlePDFText();
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = async () => {
    try {
      const loadingTask = pdfjs.getDocument(
        new Uint8Array(reader.result as ArrayBuffer)
      );
      const pdf = await loadingTask.promise;

      let extractedText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        extractedText +=
          textContent.items
            .map((item) => {
              if ('str' in item) {
                return (item as TextItem).str;
              }
              return '';
            })
            .join(' ') + '\n';
      }

      setArticlePDFText(extractedText);
    } catch (error) {
      alert(error);
    }
  };
};
