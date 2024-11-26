"use client"
import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { Save, FileUp, Type, Image as ImageIcon } from 'lucide-react';
import Header from "./Header";

const WatermarkPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [watermarkType, setWatermarkType] = useState('text');
  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);
  
  // Text watermark states
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(80);
  
  // Image watermark states
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [imageSize, setImageSize] = useState(100);
  
  // Common watermark states
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);

  // Preview state
  const [previewPdfDoc, setPreviewPdfDoc] = useState(null);

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPreviewPdfDoc(pdfDoc);
        updatePreview(pdfDoc);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWatermarkImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update preview whenever watermark settings change
  useEffect(() => {
    if (previewPdfDoc) {
      updatePreview(previewPdfDoc);
    }
  }, [watermarkText, fontSize, watermarkImage, imageSize, opacity, rotation, horizontalPosition, verticalPosition, watermarkType]);

  const updatePreview = async (pdfDoc) => {
    try {
      // Clone the PDF document for preview
      const previewDoc = await PDFDocument.load(await pdfDoc.save());
      const pages = previewDoc.getPages();
  
      for (const page of pages) {
        const { width, height } = page.getSize();
  
        const x = (horizontalPosition / 100) * width;
        const y = (verticalPosition / 100) * height;
  
        if (watermarkType === 'text' && watermarkText) {
          page.drawText(watermarkText, {
            x,
            y,
            size: fontSize,
            opacity,
            rotate: degrees(rotation),
            color: rgb(0.5, 0.5, 0.5),
          });
        }
  
        if (watermarkType === 'image' && watermarkImage) {
          const img = await previewDoc.embedPng(watermarkImage);
          const scaleFactor = imageSize / 100;
          const imgDims = img.scale(0.5 * scaleFactor);
  
          page.drawImage(img, {
            x: x - imgDims.width / 2,
            y: y - imgDims.height / 2,
            width: imgDims.width,
            height: imgDims.height,
            opacity,
            rotate: degrees(rotation),
          });
        }
      }
  
      const previewBytes = await previewDoc.save();
      const blob = new Blob([previewBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfPreview(url);
  
      return () => URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };
  

  const addWatermark = async () => {
    if (!pdfFile) {
      alert('Please select a PDF first');
      return;
    }

    if (watermarkType === 'text' && !watermarkText) {
      alert('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      alert('Please select a watermark image');
      return;
    }

    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        const x = (horizontalPosition / 100) * width;
        const y = (verticalPosition / 100) * height;

        if (watermarkType === 'text' && watermarkText) {
          page.drawText(watermarkText, {
            x,
            y,
            size: fontSize,
            opacity,
            rotate: degrees(rotation),
            color: rgb(0.5, 0.5, 0.5),
          });
        }

        if (watermarkType === 'image' && watermarkImage) {
          const img = await pdfDoc.embedPng(watermarkImage);
          const scaleFactor = imageSize / 100;
          const imgDims = img.scale(0.5 * scaleFactor);

          page.drawImage(img, {
            x: x - (imgDims.width / 2),
            y: y - (imgDims.height / 2),
            width: imgDims.width,
            height: imgDims.height,
            opacity,
            rotate: degrees(rotation),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'watermarked-document.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('Error adding watermark to PDF');
    }
  };

  return (
    <>
    <Header />
    <div className="flex min-h-screen bg-purple-50 items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto flex bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-purple-100 p-6 overflow-y-auto">
          {/* PDF Upload */}
          <div className="mb-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-lg transition-colors"
            >
              <FileUp size={24} />
              SELECT PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              className="hidden"
            />
            {pdfFile && (
              <p className="mt-2 text-sm text-purple-700 text-center">
                {pdfFile.name}
              </p>
            )}
          </div>

          {/* Watermark Type Selection */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setWatermarkType('text')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                ${watermarkType === 'text' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
            >
              <Type size={20} />
              Text
            </button>
            <button
              onClick={() => setWatermarkType('image')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${watermarkType === 'image' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
            >
              <ImageIcon size={20} />
              Logo
            </button>
          </div>

          {/* Text Watermark Settings */}
          {watermarkType === 'text' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-800">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full border border-purple-300 rounded-lg p-2 text-purple-900 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter text..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-purple-800">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full text-purple-600"
                />
                <div className="flex justify-between text-xs text-purple-600">
                  <span>10px</span>
                  <span>{fontSize}px</span>
                  <span>200px</span>
                </div>
              </div>
            </div>
          )}

          {/* Image Watermark Settings */}
          {watermarkType === 'image' && (
            <div className="space-y-4 mb-6">
              <button
                onClick={() => document.getElementById('imageInput').click()}
                className="w-full py-2 px-4 border-2 border-purple-500 border-dashed rounded-lg text-purple-600 hover:border-purple-300 hover:text-purple-700"
              >
                Select Logo / Image
              </button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {watermarkImage && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-800">Image Size</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={imageSize}
                    onChange={(e) => setImageSize(parseInt(e.target.value))}
                    className="w-full text-purple-600"
                  />
                  <div className="flex justify-between text-xs text-purple-600">
                    <span>10%</span>
                    <span>{imageSize}%</span>
                    <span>200%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Common Settings */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-800">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full text-purple-600"
              />
              <div className="flex justify-between text-xs text-purple-600">
                <span>0%</span>
                <span>{Math.round(opacity * 100)}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-purple-800">Rotation</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full text-purple-600"
              />
              <div className="flex justify-between text-xs text-purple-600">
                <span>0°</span>
                <span>{rotation}°</span>
                <span>360°</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-purple-800">Horizontal Position</label>
              <input
                type="range"
                min="0"
                max="100"
                value={horizontalPosition}
                onChange={(e) => setHorizontalPosition(parseInt(e.target.value))}
                className="w-full text-purple-600"
              />
              <div className="flex justify-between text-xs text-purple-600">
                <span>Left</span>
                <span>{horizontalPosition}%</span>
                <span>Right</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-purple-800">Vertical Position</label>
              <input
                type="range"
                min="0"
                max="100"
                value={verticalPosition}
                onChange={(e) => setVerticalPosition(parseInt(e.target.value))}
                className="w-full text-purple-600"
              />
              <div className="flex justify-between text-xs text-purple-600">
                <span>Bottom</span>
                <span>{verticalPosition}%</span>
                <span>Top</span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={addWatermark}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
            disabled={!pdfFile}
          >
            <Save size={20} />
            APPLY & DOWNLOAD
          </button>
        </div>

        {/* Main Content Area - PDF Preview */}
        <div className="flex-1 p-6">
          <div className="bg-purple-0 rounded-lg shadow-lg p-6 h-full">
            {pdfPreview ? (
              <object
                data={pdfPreview}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="flex items-center justify-center h-full text-purple-400">
                  PDF preview is not supported in your browser. 
                  <br />
                  The file is still loaded and can be watermarked.
                </div>
              </object>
            ) : (
              <div className="flex items-center justify-center h-full text-purple-500">
                Select a PDF to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default WatermarkPDF;