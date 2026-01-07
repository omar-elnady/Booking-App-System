import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Download,
  Share2,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetQRCode } from "@/hooks/useTickets";
import QRCodeLib from "qrcode";

export default function QRCodeModal({ booking, isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  const { data: qrData, isLoading } = useGetQRCode(booking?._id, isOpen);

  const getLocalized = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[i18n.language] || field.en || "";
  };

  useEffect(() => {
    if (qrData?.qrCode && booking) {
      const generateImage = async () => {
        try {
          const eventName = getLocalized(booking.event?.name);
          const qrPayload = `Booking ID: ${booking._id}
Event: ${eventName}
Event ID: ${booking.event?._id}
User ID: ${booking.user}
Ticket Status: ${booking.status}
Payment Status: ${booking.paymentStatus}
QR Code: ${qrData.qrCode}`;
          const dataUrl = await QRCodeLib.toDataURL(qrPayload, {
            width: 400,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          setQrCodeDataUrl(dataUrl);
        } catch (err) {
          console.error("QR generation error:", err);
        }
      };
      generateImage();
    }
  }, [qrData, booking]);

  if (!booking) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `ticket-${booking._id}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleShare = async () => {
    const eventName = getLocalized(booking.event?.name);
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName || "Event Ticket",
          text: `My ticket for ${eventName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share error:", err);
      }
    }
  };

  const handleGetDirections = () => {
    const venue = getLocalized(booking.event?.venue);
    const encodedVenue = encodeURIComponent(venue);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedVenue}`,
      "_blank"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            {t("tickets.yourTicket") || "Your Ticket"}
          </DialogTitle>
          <DialogDescription>
            {t("tickets.scanAtVenue") ||
              "Show this QR code at the venue entrance"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">
              {getLocalized(booking.event?.name)}
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(booking.event?.date).toLocaleDateString(
                  i18n.language,
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {getLocalized(booking.event?.venue)}
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant={booking.scanned ? "secondary" : "default"}>
                {booking.scanned
                  ? t("tickets.scanned") || "Scanned"
                  : t("tickets.valid") || "Valid"}
              </Badge>
              <Badge variant="outline">
                {t("tickets.booking")} #{booking._id.slice(-6)}
              </Badge>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 border-border">
            {isLoading || !qrCodeDataUrl ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("tickets.generatingQR") || "Generating QR Code..."}
                </p>
              </div>
            ) : (
              <>
                <img src={qrCodeDataUrl} alt="QR Code" className="w-64 h-64" />
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  {t("tickets.qrInstruction") ||
                    "Scan this code at the venue entrance"}
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!qrCodeDataUrl}
            >
              <Download className="h-4 w-4 mr-1" />
              {t("buttons.download") || "Download"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={!navigator.share}
            >
              <Share2 className="h-4 w-4 mr-1" />
              {t("buttons.share") || "Share"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleGetDirections}>
              <MapPin className="h-4 w-4 mr-1" />
              {t("buttons.directions") || "Directions"}
            </Button>
          </div>

          {/* Warning */}
          {booking.scanned && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-600 dark:text-yellow-500">
                ⚠️{" "}
                {t("tickets.alreadyScanned") ||
                  "This ticket has already been scanned"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
