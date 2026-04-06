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
      // Dynamic import to avoid SSR issues
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
      // Try with GPU fallback
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

    if (!video || !landmarker || video.readyState < 2) {
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
    } catch {
      // Silently continue
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
  videoWidth: number,
  videoHeight: number
): FaceData {
  // Key landmark indices for glasses positioning
  // 33: Right eye outer corner (camera's left)
  // 133: Right eye inner corner
  // 263: Left eye outer corner (camera's right)
  // 362: Left eye inner corner
  // 168: Glabella (between eyebrows)
  // 6: Nose bridge
  // 234: Right side of face
  // 454: Left side of face
  // 10: Top of forehead
  // 152: Chin bottom

  const leftEyeOuter = landmarks[33];
  const rightEyeOuter = landmarks[263];
  const leftEyeInner = landmarks[133];
  const rightEyeInner = landmarks[362];
  const noseBridge = landmarks[6];
  const glabella = landmarks[168];
  const faceLeft = landmarks[234];
  const faceRight = landmarks[454];

  // Calculate face center (for glasses positioning)
  const centerX = (leftEyeOuter.x + rightEyeOuter.x) / 2;
  const centerY = (leftEyeOuter.y + rightEyeOuter.y) / 2;

  // Calculate face width for scaling
  const faceWidth = Math.abs(faceRight.x - faceLeft.x);

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
    height: 0, // Not used
    rotation,
    eyeDistance,
    leftEyeOuter,
    rightEyeOuter,
    noseBridge,
    glabella,
  } as FaceData & {
    eyeDistance: number;
    leftEyeOuter: FaceLandmark;
    rightEyeOuter: FaceLandmark;
    noseBridge: FaceLandmark;
    glabella: FaceLandmark;
  };
}

export function drawGlassesOnCanvas(
  ctx: CanvasRenderingContext2D,
  face: FaceData & {
    eyeDistance: number;
    leftEyeOuter: FaceLandmark;
    rightEyeOuter: FaceLandmark;
    noseBridge: FaceLandmark;
    glabella: FaceLandmark;
  },
  glassesImage: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  scaleX: number = 1,
  scaleY: number = 1
) {
  if (!face || !glassesImage) return;

  const faceData = face;

  // Calculate glasses dimensions based on eye distance (normalized → pixels)
  const eyeDistancePx = faceData.eyeDistance * canvasWidth;
  const glassesWidth = eyeDistancePx * 2.4 * scaleX;
  const glassesHeight = glassesWidth * 0.45 * scaleY;

  // Calculate position
  const centerX = faceData.centerX * canvasWidth;
  const centerY = faceData.centerY * canvasHeight - glassesHeight * 0.05;
  const rotation = faceData.rotation;

  // 3D tilt from z-coordinates
  const leftZ = faceData.leftEyeOuter.z || 0;
  const rightZ = faceData.rightEyeOuter.z || 0;
  const tiltZ = (leftZ + rightZ) / 2;
  const perspectiveSkew = tiltZ * 0.5; // Subtle perspective

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Move to center position
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  // Apply subtle perspective transform for 3D effect
  ctx.transform(1, 0, perspectiveSkew, 1, 0, 0);

  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 4;

  // Draw glasses
  ctx.drawImage(
    glassesImage,
    -glassesWidth / 2,
    -glassesHeight / 2,
    glassesWidth,
    glassesHeight
  );

  // Remove shadow for lens reflections
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Add lens reflection effect
  const lensWidth = glassesWidth * 0.38;
  const lensHeight = glassesHeight * 0.65;
  const lensY = -glassesHeight * 0.08;

  // Left lens reflection
  const leftGrad = ctx.createLinearGradient(
    -glassesWidth * 0.27, lensY,
    -glassesWidth * 0.27, lensY + lensHeight * 0.5
  );
  leftGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  leftGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = leftGrad;
  ctx.beginPath();
  ctx.ellipse(-glassesWidth * 0.27, lensY + lensHeight * 0.2, lensWidth * 0.35, lensHeight * 0.3, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Right lens reflection
  const rightGrad = ctx.createLinearGradient(
    glassesWidth * 0.27, lensY,
    glassesWidth * 0.27, lensY + lensHeight * 0.5
  );
  rightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  rightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = rightGrad;
  ctx.beginPath();
  ctx.ellipse(glassesWidth * 0.27, lensY + lensHeight * 0.2, lensWidth * 0.35, lensHeight * 0.3, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
