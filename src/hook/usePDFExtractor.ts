import useArticlePDFStore from '@/store/useArticlePDFStore';
import { extractTextFromPDF } from '@/utils/extractPdf';
import React from 'react';

const usePDFExtractor = () => {
  const { setArticlePDFText, clearArticlePDFText } = useArticlePDFStore();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }

    await extractTextFromPDF({ file, setArticlePDFText, clearArticlePDFText });
  };

  return { handleFileUpload };
};

export default usePDFExtractor;
