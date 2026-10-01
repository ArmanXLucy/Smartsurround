import React from "react";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Camera,
  CheckCircle2,
  FileText,
  Gauge,
  ShieldCheck,
  Upload,
  Video,
  X,
  BACKEND_URL,
} from "../lib/smartSurroundShared.jsx";
import StatTile from "../components/StatTile.jsx";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function CameraPage({ gps }) {
  // The page still receives GPS from its parent, but analysis is deliberately disabled for now.
  void gps;
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [analysis, setAnalysis] = React.useState(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [imageSource, setImageSource] = React.useState("");
  const [capturing, setCapturing] = React.useState(false);
  const [cameraPreviewOpen, setCameraPreviewOpen] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const cameraStreamRef = React.useRef(null);
  const analysisRequestRef = React.useRef(0);
  const analysisControllerRef = React.useRef(null);

  const stopCamera = React.useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraPreviewOpen(false);
  }, []);

  React.useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    stopCamera();
  }, [imagePreview, stopCamera]);

  React.useEffect(() => {
    if (cameraPreviewOpen && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraPreviewOpen]);

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setError("Choose a JPG, JPEG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }
    analysisRequestRef.current += 1;
    analysisControllerRef.current?.abort();
    analysisControllerRef.current = null;
    stopCamera();
    setAnalyzing(false);
    setImagePreview(URL.createObjectURL(file));
    setSelectedImage(file);
    setImageSource("upload");
    setAnalysis(null);
    setSubmitted(false);
    setError("");
    event.target.value = "";
  };

  // Reserved for the future road-analysis integration. It intentionally performs no action.
  const analyzeRoad = () => {};

  const captureImage = async () => {
    if (capturing || analyzing) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported by this browser. Use Upload Image instead.");
      return;
    }

    setCapturing(true);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraPreviewOpen(true);
    } catch (err) {
      setError(err?.name === "NotAllowedError" || err?.name === "SecurityError"
        ? "Camera permission was denied. Allow camera access in your browser and try again."
        : err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError"
          ? "No camera was found on this device. Use Upload Image instead."
          : (err.message || "Unable to access this device's camera."));
    } finally {
      setCapturing(false);
    }
  };

  const captureCameraFrame = () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video?.videoHeight) {
      setError("The camera preview is not ready yet. Please try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Unable to capture an image from the camera. Please try again.");
        return;
      }
      const capturedImage = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: "image/jpeg" });
      setImagePreview(URL.createObjectURL(capturedImage));
      setSelectedImage(capturedImage);
      setImageSource("capture");
      setAnalysis(null);
      setSubmitted(false);
      setError("");
      stopCamera();
    }, "image/jpeg", 0.92);
  };

  const removeImage = () => {
    analysisRequestRef.current += 1;
    analysisControllerRef.current?.abort();
    analysisControllerRef.current = null;
    stopCamera();
    setSelectedImage(null);
    setImagePreview("");
    setAnalysis(null);
    setImageSource("");
    setError("");
    setSubmitted(false);
    setAnalyzing(false);
    setCapturing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isPothole = String(analysis?.damage_type || "").toLowerCase().includes("pothole");
  const canSubmit = Boolean(isPothole && analysis?.queued_for_admin && analysis?.detection_id != null);
  const analyzedImageUrl = analysis?.image
    ? `${BACKEND_URL}${analysis.image}`
    : "";

  return (
    <div className="page-block">
      <div className="page-heading">
        <div>
          <div className="small-label">AI VISION</div>
          <h1>Camera / Road Analysis</h1>
          <p>Upload a road image and analyze it with the SmartSurround damage detection model.</p>
        </div>
        <div className="dashboard-live"><span />{analyzing ? "AI ANALYZING" : "IMAGE ANALYSIS"}</div>
      </div>

      <div className="camera-card camera-upload-card">
        {cameraPreviewOpen ? (
          <video ref={videoRef} className="camera-upload-preview" autoPlay muted playsInline aria-label="Live camera preview" />
        ) : imagePreview ? (
          <img className="camera-upload-preview" src={imagePreview} alt="Selected road for analysis" />
        ) : (
          <div className="camera-upload-empty">
            <Upload size={38} />
            <strong>Upload an image to analyze</strong>
            <span>JPG, PNG, or WEBP</span>
          </div>
        )}
        {(analyzing || capturing) && <div className="camera-analyzing"><span />{capturing ? "Opening camera…" : "Analyzing image…"}</div>}
      </div>

      <div className="camera-upload-actions">
        <input
          ref={fileInputRef}
          className="camera-file-input"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={selectImage}
          aria-label="Choose a road image"
        />
        <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()} disabled={capturing || analyzing}>
          <Upload size={16} /> Upload Image
        </button>
        {imageSource === "upload" && selectedImage && (
          <div className="camera-upload-filename" title={selectedImage.name}>
            <span>{selectedImage.name}</span>
            <button type="button" onClick={removeImage} aria-label="Remove uploaded image" title="Remove image"><X size={16} /></button>
          </div>
        )}
        {cameraPreviewOpen ? (
          <>
            <button type="button" className="secondary-button camera-capture-button" onClick={captureCameraFrame} disabled={analyzing}>
              <Camera size={16} /> Capture Frame
            </button>
            <button type="button" className="secondary-button camera-remove-button" onClick={stopCamera} disabled={analyzing}>Cancel Camera</button>
          </>
        ) : imageSource === "capture" && selectedImage ? (
          <button type="button" className="secondary-button camera-remove-button" onClick={removeImage} disabled={capturing || analyzing}>
            Remove Image
          </button>
        ) : (
          <button type="button" className="secondary-button camera-capture-button" onClick={captureImage} disabled={capturing || analyzing}>
            <Camera size={16} /> {capturing ? "Opening Camera…" : "Capture Image"}
          </button>
        )}
        <button type="button" className="primary-button" onClick={analyzeRoad} disabled={analyzing || capturing || cameraPreviewOpen || !selectedImage}>
          <BrainCircuit size={16} /> {analyzing ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      <div className="tile-grid three camera-status-grid">
        <StatTile label="Analysis Source" value={imageSource === "capture" ? "Camera Capture" : imageSource === "upload" ? "Uploaded Image" : "Waiting"} unit="" icon={<Video size={16} />} />
        <StatTile label="AI Model" value="Ready" unit="" icon={<BrainCircuit size={16} />} />
        <StatTile label="Image Status" value={analyzing ? "Analyzing" : capturing ? "Opening Camera" : cameraPreviewOpen ? "Live Preview" : analysis ? "Analyzed" : selectedImage ? "Selected" : "Waiting"} unit="" icon={<Upload size={16} />} />
      </div>

      {error && <div className="camera-error" role="alert"><strong>Camera / Analysis Error</strong><span>{error}</span></div>}

      {analysis && (
        <section className="wide-card camera-result-card" aria-labelledby="camera-result-title">
          <div className="card-header">
            <div><div className="card-label">AI ROAD ANALYSIS</div><h3 id="camera-result-title">Detection Result</h3></div>
            <BrainCircuit size={20} />
          </div>
          <div className="tile-grid three camera-result-tiles">
            <StatTile label="Road Condition" value={analysis.road_condition || "--"} unit="" icon={<Activity size={16} />} />
            <StatTile label="Damage Type" value={analysis.damage_type || "--"} unit="" icon={<ShieldCheck size={16} />} />
            <StatTile label="Confidence" value={typeof analysis.confidence === "number" ? `${(analysis.confidence * 100).toFixed(1)}%` : "--"} unit="" icon={<Gauge size={16} />} />
            <StatTile label="Severity" value={analysis.severity || "--"} unit="" icon={<AlertTriangle size={16} />} />
            <StatTile label="Admin Queue" value={analysis.queued_for_admin ? "Queued" : "Not Queued"} unit="" icon={<ShieldCheck size={16} />} />
            <StatTile label="Detection ID" value={analysis.detection_id ?? "--"} unit="" icon={<FileText size={16} />} />
          </div>
          {analyzedImageUrl && (
            <div className="camera-analyzed-image">
              <div className="card-label">ANALYZED IMAGE</div>
              <img src={analyzedImageUrl} alt="Image processed by road damage analysis" />
            </div>
          )}
          <div className={`camera-result-message ${analysis.road_condition === "damaged" ? "is-damaged" : "is-normal"}`}>
            <strong>{analysis.road_condition === "damaged" ? "Road damage detected" : "Road classified as normal"}</strong>
            <span>{analysis.queued_for_admin ? "This detection is already in the administrator verification queue." : "The image was successfully processed by the AI model."}</span>
          </div>
          {canSubmit && (
            <div className="camera-submit-area">
              {submitted ? (
                <div className="camera-submitted-message"><CheckCircle2 size={18} /> Submitted to the administrator verification queue.</div>
              ) : (
                <>
                  <p>This pothole detection is ready to be submitted. It will use the existing detection record.</p>
                  <button type="button" className="primary-button" onClick={() => setSubmitted(true)}>
                    <CheckCircle2 size={16} /> Submit
                  </button>
                </>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
