import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/**
 * ImageCropperModal — shows a WhatsApp-style crop dialog.
 * Props:
 *   imageSrc   : object URL of the selected image (string)
 *   onComplete : (croppedDataUrl) => void — called with the final base64 data URL
 *   onCancel   : () => void
 */
const ImageCropperModal = ({ imageSrc, onComplete, onCancel }) => {
    const imgRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);

    // When the image loads, start with a centred square crop
    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
            width,
            height
        );
        setCrop(initialCrop);
    }, []);

    const handleDone = () => {
        const image = imgRef.current;
        if (!image || !completedCrop) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const canvas = document.createElement("canvas");
        const SIZE = 400; // output resolution
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            SIZE,
            SIZE
        );

        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => onComplete(reader.result);
            reader.readAsDataURL(blob);
        }, "image/jpeg", 0.9);
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                maxWidth: "480px",
                width: "90%",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
            }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "18px", color: "#fff", fontWeight: 600 }}>
                        Crop Profile Photo
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: "13px", color: "#aaa" }}>
                        Drag to reposition
                    </div>
                </div>

                {/* Crop area */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, pct) => setCrop(pct)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                        circularCrop
                        minWidth={60}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop"
                            onLoad={onImageLoad}
                            style={{ maxHeight: "340px", maxWidth: "100%", display: "block" }}
                        />
                    </ReactCrop>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "8px 20px", borderRadius: "20px",
                            border: "1px solid #555", background: "transparent",
                            color: "#ccc", cursor: "pointer", fontSize: "14px"
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDone}
                        disabled={!completedCrop}
                        style={{
                            padding: "8px 24px", borderRadius: "20px",
                            background: completedCrop ? "#25d366" : "#555",
                            border: "none", color: "#fff",
                            cursor: completedCrop ? "pointer" : "default",
                            fontSize: "14px", fontWeight: 600,
                            transition: "background 0.2s"
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
