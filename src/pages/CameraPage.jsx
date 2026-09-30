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
  BACKEND_DISPLAY_URL,
  BACKEND_URL,
} from "../lib/smartSurroundShared.jsx";
import StatTile from "../components/StatTile.jsx";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function CameraPage({ gps }) {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [analysis, setAnalysis] = React.useState(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const analysisRequestRef = React.useRef(0);
  const analysisControllerRef = React.useRef(null);

  React.useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

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
    setAnalyzing(false);
    setImagePreview(URL.createObjectURL(file));
    setSelectedImage(file);
    setAnalysis(null);
    setSubmitted(false);
    setError("");
    event.target.value = "";
  };

  const analyzeRoad = async () => {
    if (!selectedImage) {
      setError("Upload an image before starting analysis.");
      return;
    }
    if (analyzing) return;

    setAnalyzing(true);
    setError("");
    setAnalysis(null);
    setSubmitted(false);

    const controller = new AbortController();
    const requestId = ++analysisRequestRef.current;
    analysisControllerRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 60000);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("description", "User-uploaded road image");
      if (gps?.lat != null && gps?.lng != null) {
        formData.append("lat", String(gps.lat));
        formData.append("lon", String(gps.lng));
      }

      const response = await fetch(`${BACKEND_URL}/api/camera/analyze`, {
        method: "POST",
        body: formData,
        cache: "no-store",
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.message || `AI server returned HTTP ${response.status}.`);
      }
      if (analysisRequestRef.current === requestId) setAnalysis(result);
    } catch (err) {
      if (analysisRequestRef.current === requestId) {
        setError(err?.name === "AbortError"
          ? "AI analysis timed out. Please try again."
          : err?.name === "TypeError"
            ? `Unable to reach the AI server at ${BACKEND_DISPLAY_URL}. Check the backend and try again.`
            : (err.message || "Unable to analyze the selected image."));
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (analysisRequestRef.current === requestId) {
        analysisControllerRef.current = null;
        setAnalyzing(false);
      }
    }
  };

  const removeImage = () => {
    analysisRequestRef.current += 1;
    analysisControllerRef.current?.abort();
    analysisControllerRef.current = null;
    setSelectedImage(null);
    setImagePreview("");
    setAnalysis(null);
    setError("");
    setSubmitted(false);
    setAnalyzing(false);
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
        {imagePreview ? (
          <img className="camera-upload-preview" src={imagePreview} alt="Selected road for analysis" />
        ) : (
          <div className="camera-upload-empty">
            <Upload size={38} />
            <strong>Upload an image to analyze</strong>
            <span>JPG, PNG, or WEBP</span>
          </div>
        )}
        {analyzing && <div className="camera-analyzing"><span />Analyzing image…</div>}
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
        <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} /> {selectedImage ? "Choose Another Image" : "Upload Image"}
        </button>
        <button type="button" className="primary-button" onClick={analyzeRoad} disabled={analyzing || !selectedImage}>
          <Camera size={16} /> {analyzing ? "Analyzing…" : "Capture & Analyze"}
        </button>
        <button type="button" className="secondary-button camera-remove-button" onClick={removeImage} disabled={!selectedImage}>
          Remove
        </button>
      </div>

      <div className="tile-grid three camera-status-grid">
        <StatTile label="Analysis Source" value="Uploaded Image" unit="" icon={<Video size={16} />} />
        <StatTile label="AI Model" value="Ready" unit="" icon={<BrainCircuit size={16} />} />
        <StatTile label="Image Status" value={analysis ? "Analyzed" : selectedImage ? "Selected" : "Waiting"} unit="" icon={<Upload size={16} />} />
      </div>

      {error && <div className="camera-error" role="alert"><strong>Analysis Error</strong><span>{error}</span></div>}

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
