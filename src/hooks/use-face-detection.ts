"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface FaceData {
  landmarks: FaceLandmark[];
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
}

interface UseFaceDetectionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  onFaceDetected?: (face: FaceData) => void;
  onFaceLost?: () => void;
}

export function useFaceDetection({
  videoRef,
  enabled,
  onFaceDetected,
  onFaceLost,
}: UseFaceDetectionOptions) {
  const faceLandmarkerRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastTimestampRef = useRef<number>(-1);
  const onFaceDetectedRef = useRef(onFaceDetected);
  const onFaceLostRef = useRef(onFaceLost);

  onFaceDetectedRef.current = onFaceDetected;
  onFaceLostRef.current = onFaceLost;

  const loadModel = useCallback(async () => {
    if (faceLandmarkerRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const { FaceLandmarker, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
      );

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );

      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading face landmark model:", err);
      try {
        const { FaceLandmarker, FilesetResolver } = await import(
          "@mediapipe/tasks-vision"
        );

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "CPU",
            },
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
            runningMode: "VIDEO",
            numFaces: 1,
          }
        );

        setIsReady(true);
        setIsLoading(false);
      } catch (err2) {
        console.error("Error loading face landmark model (CPU fallback):", err2);
        setError("No se pudo cargar el modelo de detección facial");
        setIsLoading(false);
      }
    }
  }, []);

  const detect = useCallback(() => {
    const video = videoRef.current;
    const landmarker = faceLandmarkerRef.current;

    if (!video || !landmarker) {
      animFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    // Ensure video has enough data to process
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      animFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    const now = performance.now();
    if (now === lastTimestampRef.current) {
      animFrameRef.current = requestAnimationFrame(detect);
      return;
    }
    lastTimestampRef.current = now;

    try {
      const result = landmarker.detectForVideo(video, now);

      if (result.faceLandmarks && result.faceLandmarks.length > 0) {
        const landmarks = result.faceLandmarks[0];
        const faceData = processFaceLandmarks(landmarks, video.videoWidth, video.videoHeight);
        onFaceDetectedRef.current?.(faceData);
      } else {
        onFaceLostRef.current?.();
      }
    } catch (err) {
      // Silently ignore detection errors — they're common during camera setup/teardown
      // Reset timestamp to allow fresh detection on next frame
      lastTimestampRef.current = -1;
    }

    animFrameRef.current = requestAnimationFrame(detect);
  }, [videoRef]);

  useEffect(() => {
    if (enabled && isReady) {
      lastTimestampRef.current = -1;
      animFrameRef.current = requestAnimationFrame(detect);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enabled, isReady, detect]);

  useEffect(() => {
    return () => {
      faceLandmarkerRef.current?.close();
      faceLandmarkerRef.current = null;
    };
  }, []);

  return { isLoading, isReady, error, loadModel };
}

function processFaceLandmarks(
  landmarks: FaceLandmark[],
  _videoWidth: number,
  _videoHeight: number
): FaceData & {
  eyeDistance: number;
  leftEyeOuter: FaceLandmark;
  rightEyeOuter: FaceLandmark;
  noseBridge: FaceLandmark;
  glabella: FaceLandmark;
  leftTemple: FaceLandmark;
  rightTemple: FaceLandmark;
  foreheadTop: FaceLandmark;
  chinBottom: FaceLandmark;
  faceWidth: number;
} {
  // Key landmark indices
  const leftEyeOuter = landmarks[33];
  const rightEyeOuter = landmarks[263];
  const leftEyeInner = landmarks[133];
  const rightEyeInner = landmarks[362];
  const noseBridge = landmarks[6];
  const glabella = landmarks[168];
  const faceLeft = landmarks[234];
  const faceRight = landmarks[454];
  const foreheadTop = landmarks[10];
  const chinBottom = landmarks[152];

  // Calculate face center between the eyes
  const centerX = (leftEyeOuter.x + rightEyeOuter.x) / 2;
  const centerY = (leftEyeOuter.y + rightEyeOuter.y) / 2;

  // Calculate face width and height
  const faceWidth = Math.abs(faceRight.x - faceLeft.x);
  const faceHeight = Math.abs(chinBottom.y - foreheadTop.y);

  // Calculate rotation from eye angle
  const dx = rightEyeOuter.x - leftEyeOuter.x;
  const dy = rightEyeOuter.y - leftEyeOuter.y;
  const rotation = Math.atan2(dy, dx);

  // Eye distance for glasses width
  const eyeDistance = Math.sqrt(
    Math.pow(rightEyeOuter.x - leftEyeOuter.x, 2) +
      Math.pow(rightEyeOuter.y - leftEyeOuter.y, 2)
  );

  return {
    landmarks,
    centerX,
    centerY,
    width: faceWidth,
    height: faceHeight,
    rotation,
    eyeDistance,
    leftEyeOuter,
    rightEyeOuter,
    leftEyeInner,
    rightEyeInner,
    noseBridge,
    glabella,
    leftTemple: faceLeft,
    rightTemple: faceRight,
    foreheadTop,
    chinBottom,
    faceWidth,
  };
}

/**
 * Draws photorealistic glasses on a canvas, positioned and oriented using face landmarks.
 * Optimized for AI-generated photorealistic glasses images with transparent backgrounds.
 */
export function drawGlassesOnCanvas(
  ctx: CanvasRenderingContext2D,
  face: FaceData & {
    eyeDistance: number;
    leftEyeOuter: FaceLandmark;
    rightEyeOuter: FaceLandmark;
    noseBridge: FaceLandmark;
    glabella: FaceLandmark;
    leftTemple: FaceLandmark;
    rightTemple: FaceLandmark;
    faceWidth: number;
  },
  glassesImage: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  scaleX: number = 1,
  scaleY: number = 1
) {
  if (!face || !glassesImage) return;

  // Calculate glasses dimensions based on face width (normalized → pixels)
  // Use face width for more natural proportions
  const faceWidthPx = face.faceWidth * canvasWidth;
  const glassesWidth = faceWidthPx * 1.15 * scaleX;
  const glassesHeight = glassesWidth * (glassesImage.height / glassesImage.width) * scaleY;

  // Position centered between the eyes, slightly above
  const centerX = face.centerX * canvasWidth;
  const centerY = face.centerY * canvasHeight;
  const rotation = face.rotation;

  // 3D perspective from z-coordinates
  const leftZ = face.leftEyeOuter.z || 0;
  const rightZ = face.rightEyeOuter.z || 0;
  const tiltZ = (leftZ + rightZ) / 2;
  const perspectiveSkew = tiltZ * 0.5;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // ─── STEP 1: Soft contact shadow beneath glasses ───
  // This creates the illusion that glasses are sitting ON the face
  ctx.save();
  ctx.translate(centerX + 2, centerY + 3);
  ctx.rotate(rotation);
  ctx.transform(1, 0, perspectiveSkew, 1, 0, 0);
  ctx.globalAlpha = 0.15;
  ctx.filter = 'blur(8px)';
  ctx.drawImage(
    glassesImage,
    -glassesWidth / 2 - 1,
    -glassesHeight / 2 + 3,
    glassesWidth + 2,
    glassesHeight + 2
  );
  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  ctx.restore();

  // ─── STEP 2: Second shadow layer (softer, wider) ───
  ctx.save();
  ctx.translate(centerX + 3, centerY + 5);
  ctx.rotate(rotation);
  ctx.transform(1, 0, perspectiveSkew, 1, 0, 0);
  ctx.globalAlpha = 0.06;
  ctx.filter = 'blur(16px)';
  ctx.drawImage(
    glassesImage,
    -glassesWidth / 2 - 4,
    -glassesHeight / 2 + 5,
    glassesWidth + 8,
    glassesHeight + 8
  );
  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  ctx.restore();

  // ─── STEP 3: Main glasses image with subtle drop shadow ───
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.transform(1, 0, perspectiveSkew, 1, 0, 0);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 4;

  ctx.drawImage(
    glassesImage,
    -glassesWidth / 2,
    -glassesHeight / 2,
    glassesWidth,
    glassesHeight
  );

  // Clear shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // ─── STEP 4: Subtle ambient light reflection on top of lenses ───
  // Adds realism by simulating environment light reflecting off the curved lenses
  const lensWidth = glassesWidth * 0.28;
  const lensHeight = glassesHeight * 0.6;
  const lensYOffset = glassesHeight * 0.02;

  // Left lens reflection
  ctx.save();
  ctx.globalAlpha = 0.08;
  const leftRefGrad = ctx.createRadialGradient(
    -glassesWidth * 0.24, lensYOffset - lensHeight * 0.25,
    0,
    -glassesWidth * 0.24, lensYOffset,
    lensWidth
  );
  leftRefGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  leftRefGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
  leftRefGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = leftRefGrad;
  ctx.beginPath();
  ctx.ellipse(-glassesWidth * 0.24, lensYOffset, lensWidth, lensHeight, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right lens reflection
  ctx.save();
  ctx.globalAlpha = 0.06;
  const rightRefGrad = ctx.createRadialGradient(
    glassesWidth * 0.24, lensYOffset - lensHeight * 0.25,
    0,
    glassesWidth * 0.24, lensYOffset,
    lensWidth
  );
  rightRefGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  rightRefGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
  rightRefGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = rightRefGrad;
  ctx.beginPath();
  ctx.ellipse(glassesWidth * 0.24, lensYOffset, lensWidth, lensHeight, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ─── STEP 5: Edge highlight on top frame ───
  // Simulates light catching the top edge of the frame
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-glassesWidth * 0.44, -glassesHeight * 0.38);
  ctx.quadraticCurveTo(-glassesWidth * 0.25, -glassesHeight * 0.50, 0, -glassesHeight * 0.45);
  ctx.quadraticCurveTo(glassesWidth * 0.25, -glassesHeight * 0.50, glassesWidth * 0.44, -glassesHeight * 0.38);
  ctx.stroke();
  ctx.restore();

  // ─── STEP 6: Subtle vignette at bottom of glasses for depth ───
  ctx.save();
  ctx.globalAlpha = 0.03;
  const bottomVignette = ctx.createLinearGradient(0, glassesHeight * 0.15, 0, glassesHeight * 0.5);
  bottomVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomVignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = bottomVignette;
  ctx.fillRect(-glassesWidth / 2, -glassesHeight / 2, glassesWidth, glassesHeight);
  ctx.restore();

  ctx.restore();
}
