import { useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCodeLib from "qrcode";

export default function QRCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const menuUrl = "https://latavernetta.rs/jelovnik";

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, menuUrl, {
        width: 350,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
    }
  }, []);

  const downloadQR = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'la-tavernetta-jelovnik-qr.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <Card className="bg-zinc-900 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">QR Kod za Jelovnik</CardTitle>
        <CardDescription className="text-gray-400">
          Preuzmite QR kod za postavljanje na stolove restorana
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <canvas ref={canvasRef} />
        </div>
        
        <div className="text-center text-sm text-gray-400">
          <p className="font-mono text-primary">{menuUrl}</p>
        </div>
        
        <Button 
          onClick={downloadQR}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
        >
          <Download className="w-4 h-4 mr-2" />
          Preuzmi QR Kod
        </Button>
      </CardContent>
    </Card>
  );
}
