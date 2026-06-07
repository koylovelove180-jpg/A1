import { QrCode, PlusCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { useState } from 'react';
import { buildQrAnnouncementHtml } from '../utils/announcementHtml';

function AnnouncementQrTool({ htmlEnabled, onEnableHtml, onInsert }) {
  const [qrText, setQrText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrLabel, setQrLabel] = useState('สแกน QR Code ด้านล่าง');
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    const value = qrText.trim();
    if (!value) {
      setError('กรุณาใส่ URL หรือข้อความสำหรับ QR Code');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const dataUrl = await QRCode.toDataURL(value, {
        width: 240,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
    } catch {
      setError('สร้าง QR Code ไม่สำเร็จ กรุณาตรวจสอบข้อความอีกครั้ง');
      setQrDataUrl('');
    } finally {
      setGenerating(false);
    }
  };

  const handleInsert = () => {
    if (!qrDataUrl) {
      setError('กรุณากดสร้าง QR ก่อนแทรกลงประกาศ');
      return;
    }

    if (!htmlEnabled) {
      onEnableHtml?.();
    }

    const snippet = buildQrAnnouncementHtml(qrDataUrl, qrLabel.trim() || 'สแกน QR Code ด้านล่าง');
    onInsert(snippet);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <QrCode size={20} className="text-orange-600" />
        <p className="font-bold text-slate-950">เครื่องมือสร้าง QR Code</p>
      </div>
      <p className="text-sm leading-7 text-slate-600">
        ใส่ลิงก์หรือข้อความ แล้วกดสร้าง QR เพื่อแทรก HTML ลงประกาศให้นักเรียนสแกนได้
      </p>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">URL หรือข้อความ</span>
        <input
          type="text"
          value={qrText}
          onChange={(event) => setQrText(event.target.value)}
          placeholder="https://example.com หรือข้อความสั้น ๆ"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-orange-200 focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">ข้อความเหนือ QR (ไม่บังคับ)</span>
        <input
          type="text"
          value={qrLabel}
          onChange={(event) => setQrLabel(event.target.value)}
          placeholder="สแกน QR Code ด้านล่าง"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-orange-200 focus:ring-2"
        />
      </label>

      {error ? (
        <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          <QrCode size={18} />
          {generating ? 'กำลังสร้าง...' : 'สร้าง QR'}
        </button>
        <button
          type="button"
          onClick={handleInsert}
          disabled={!qrDataUrl}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-60"
        >
          <PlusCircle size={18} />
          แทรกลงประกาศ
        </button>
      </div>

      {qrDataUrl ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          <p className="mb-3 text-sm font-semibold text-slate-600">ตัวอย่าง QR</p>
          <img src={qrDataUrl} alt="QR Code preview" className="mx-auto h-48 w-48" />
        </div>
      ) : null}
    </div>
  );
}

export default AnnouncementQrTool;
