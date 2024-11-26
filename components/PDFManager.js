"use client";

import React, { useState } from "react";
import { AiOutlineFileAdd, AiOutlineCompress, AiOutlineDownload } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import PDFCatchGame from "@/components/PDFCatchGame";
import HowtoUse from "./HowtoUse";
import Header from "./Header";


const PDFManager = () => {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".pdf")) {
      toast.error("Please select a valid PDF file.");
      return;
    }
    setOriginalFile(file);
    setCompressedFile(null);
    setProgress(0);
  };

  const compressPDF = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const { PDFDocument } = await import('pdf-lib');
      
      // Read the file
      const fileData = await originalFile.arrayBuffer();
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(fileData, {
        updateMetadata: false
      });

      // Compress by removing unnecessary metadata
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
      pdfDoc.setTitle('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      
      // Get total pages
      const totalPages = pdfDoc.getPageCount();

      // Process each page
      for (let i = 0; i < totalPages; i++) {
        // Update progress
        setProgress(((i + 1) / totalPages) * 100);
      }

      // Save with compression options
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false
      });

      // Create compressed file
      const blob = new Blob([compressedBytes], { type: "application/pdf" });

      const compressedPdfFile = new File([blob], `compressed_${originalFile.name}`, {
        type: "application/pdf",
      });
      setCompressedFile(compressedPdfFile);
      toast.success("PDF compression completed! Please Click to Download PDF");
    } catch (error) {
      console.error("PDF Compression Error:", error);
      toast.error("PDF compression failed. Please try again with a different file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCompressedPDF = () => {
    if (!compressedFile) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(compressedFile);
    link.download = compressedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-purple-500">
      <Toaster />
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Select PDF */}
          <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg p-8 text-center cursor-pointer flex flex-col items-center justify-center"
            onClick={() => document.getElementById("file-input").click()}
          >
            <AiOutlineFileAdd size={50} className="text-black mb-2" />
            <span className="text-3xl font-bold text-black">SELECT PDF</span>
          </div>
          {/* Start Compress */}
          <div
            className={`bg-white rounded-lg shadow-md hover:shadow-lg p-8 text-center flex flex-col items-center justify-center ${
              !originalFile || isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={compressPDF}
          >
            <AiOutlineCompress size={50} className="text-black mb-2" />
            <span className="text-3xl font-bold text-black">
              {isProcessing ? `COMPRESSING... ${progress.toFixed(0)}%` : "START COMPRESS"}
            </span>
          </div>
          {/* Download PDF */}
          <div
            className={`bg-white rounded-lg shadow-md hover:shadow-lg p-8 text-center flex flex-col items-center justify-center ${
              !compressedFile ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={downloadCompressedPDF}
          >
            <AiOutlineDownload size={50} className="text-black mb-2" />
            <span className="text-3xl font-bold text-black">DOWNLOAD PDF</span>
          </div>
        </div>
        <input type="file" id="file-input" className="hidden" accept=".pdf" onChange={handleFileUpload} />
      </main>
      <footer className="w-full p-6 bg-gray-50 text-center text-gray-500">
        <PDFCatchGame />
        <HowtoUse />
      

        2024 PDF Compressor
      </footer>
    </div>
  );
};

export default PDFManager;