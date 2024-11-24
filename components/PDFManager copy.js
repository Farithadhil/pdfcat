"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // Correct import for browser compatibility
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry"; // Worker file
import { AiOutlineFileAdd, AiOutlineCompress, AiOutlineDownload } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFManager = () => {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionQuality, setCompressionQuality] = useState(50);

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
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const pdfData = e.target.result;
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        const compressedPdfDoc = await PDFDocument.create();

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1 - compressionQuality / 100 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          const jpegUrl = canvas.toDataURL("image/jpeg", 0.9);
          const jpegImageBytes = await fetch(jpegUrl).then((r) => r.arrayBuffer());

          const jpegImage = await compressedPdfDoc.embedJpg(jpegImageBytes);
          const newPage = compressedPdfDoc.addPage([viewport.width, viewport.height]);
          newPage.drawImage(jpegImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });

          setProgress((pageNum / pdf.numPages) * 100);
        }

        const pdfBytes = await compressedPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const compressedPdfFile = new File([blob], `compressed_${originalFile.name}`, { type: "application/pdf" });

        setCompressedFile(compressedPdfFile);
        setIsProcessing(false);
        toast.success("PDF compression completed!");
      };
      fileReader.readAsArrayBuffer(originalFile);
    } catch (error) {
      console.error("PDF Compression Error:", error);
      toast.error("PDF compression failed.");
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
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <a href="/" className="block">
                <img src="/PDF-CAT-LOGO-long.svg" alt="PDF Compressor Logo" className="w-auto h-12" />
              </a>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg p-8 text-center cursor-pointer"
            onClick={() => document.getElementById("file-input").click()}
          >
            <AiOutlineFileAdd size={36} />
            <span>SELECT PDF</span>
          </div>
          <div
            className={`bg-white rounded-lg shadow-md hover:shadow-lg p-8 text-center ${
              !originalFile || isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={compressPDF}
          >
            <AiOutlineCompress size={36} />
            <span>{isProcessing ? `COMPRESSING... ${progress.toFixed(0)}%` : "START COMPRESS"}</span>
          </div>
          <div
            className={`bg-white rounded-lg shadow-md hover:shadow-lg p-8 text-center ${
              !compressedFile ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={downloadCompressedPDF}
          >
            <AiOutlineDownload size={36} />
            <span>DOWNLOAD PDF</span>
          </div>
        </div>
        <input type="file" id="file-input" className="hidden" accept=".pdf" onChange={handleFileUpload} />
      </main>
      <footer className="max-w-7xl mx-auto p-6 bg-gray-50 text-center text-gray-500">
        © 2024 PDF Compressor
      </footer>
    </div>
  );
};

export default PDFManager;
