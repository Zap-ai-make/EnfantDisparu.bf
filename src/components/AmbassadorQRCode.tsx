"use client";

import { QRCodeSVG } from "qrcode.react";
import { getShareUrl } from "@/lib/ambassador-utils";
import { Download } from "lucide-react";
import { useRef } from "react";

interface AmbassadorQRCodeProps {
  refCode: string;
  size?: number;
}

export function AmbassadorQRCode({ refCode, size = 200 }: AmbassadorQRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const shareUrl = getShareUrl(refCode);

  const downloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = size * 2;
    canvas.height = size * 2;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement("a");
      link.download = `enfantdisparu-${refCode}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={qrRef} className="bg-white p-4 rounded-xl border border-gray-100">
        <QRCodeSVG
          value={shareUrl}
          size={size}
          level="M"
          includeMargin={false}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">{shareUrl}</p>
        <button
          onClick={downloadQR}
          className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium mx-auto"
        >
          <Download className="w-4 h-4" />
          Télécharger le QR Code
        </button>
      </div>
    </div>
  );
}
