import React, { useRef, useEffect, useState } from "react";

function mandelbrot(c: { x: number; y: number }, maxIter = 100) {
  let z = { x: 0, y: 0 };
  let iter = 0;
  while (z.x * z.x + z.y * z.y <= 4 && iter < maxIter) {
    const xtemp = z.x * z.x - z.y * z.y + c.x;
    z.y = 2 * z.x * z.y + c.y;
    z.x = xtemp;
    iter++;
  }
  return iter;
}

const MandelbrotAutoZoom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Interessante zoom locaties in de Mandelbrot set
  const zoomTargets = [
    { x: -0.7269, y: 0.1889, name: "Spiral" },
    { x: -0.8, y: 0.156, name: "Lightning" },
    { x: -0.74529, y: 0.11307, name: "Seahorse Valley" },
    { x: -1.25066, y: 0.02012, name: "Elephant Valley" },
    { x: -0.7453, y: 0.1127, name: "Double Spiral" },
    { x: -0.16, y: 1.0405, name: "Feather" },
    { x: -1.768778833, y: -0.001738996, name: "Mini Mandelbrot" }
  ];

  const [currentTarget, setCurrentTarget] = useState(0);
  const [view, setView] = useState({ 
    x: zoomTargets[0].x, 
    y: zoomTargets[0].y, 
    scale: 2.0 
  });

  
  // Render functie
  const renderMandelbrot = (ctx: CanvasRenderingContext2D, width: number, height: number, centerX: number, centerY: number, scale: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const maxIter = 150;

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        const x0 = centerX + (px - width / 2) * (scale / width);
        const y0 = centerY + (py - height / 2) * (scale / width);
        
        const iter = mandelbrot({ x: x0, y: y0 }, maxIter);
        const index = (py * width + px) * 4;
        
        if (iter === maxIter) {
          // Zwart voor punten in de set
          data[index] = 0;     // R
          data[index + 1] = 0; // G
          data[index + 2] = 0; // B
        } else {
          // Kleurrijke gradient voor punten buiten de set
          const t = iter / maxIter;
          const hue = (t * 360 + 200) % 360;
          const saturation = 100;
          const lightness = Math.min(80, t * 100);
          
          // Convert HSL to RGB
          const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
          const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
          const m = lightness / 100 - c / 2;
          
          let r = 0, g = 0, b = 0;
          if (hue < 60) { r = c; g = x; b = 0; }
          else if (hue < 120) { r = x; g = c; b = 0; }
          else if (hue < 180) { r = 0; g = c; b = x; }
          else if (hue < 240) { r = 0; g = x; b = c; }
          else if (hue < 300) { r = x; g = 0; b = c; }
          else { r = c; g = 0; b = x; }
          
          data[index] = Math.round((r + m) * 255);     // R
          data[index + 1] = Math.round((g + m) * 255); // G
          data[index + 2] = Math.round((b + m) * 255); // B
        }
        data[index + 3] = 255; // A
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // Animatie loop
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      
      // Zoom in naar het huidige target
      setView(prevView => {
        const target = zoomTargets[currentTarget];
        const zoomSpeed = 0.02;
        const moveSpeed = 0.01;
        
        // Beweeg naar target positie
        const newX = prevView.x + (target.x - prevView.x) * moveSpeed;
        const newY = prevView.y + (target.y - prevView.y) * moveSpeed;
        
        // Zoom in
        let newScale = prevView.scale * (1 - zoomSpeed);
        
        // Als we heel ver ingezoomd zijn, ga naar volgend target
        if (newScale < 0.0001) {
          setCurrentTarget((prev) => (prev + 1) % zoomTargets.length);
          newScale = 2.0; // Reset zoom
          return {
            x: zoomTargets[(currentTarget + 1) % zoomTargets.length].x,
            y: zoomTargets[(currentTarget + 1) % zoomTargets.length].y,
            scale: newScale
          };
        }
        
        const newView = { x: newX, y: newY, scale: newScale };
        
        // Render de nieuwe frame
        renderMandelbrot(ctx, width, height, newX, newY, newScale);
        
        return newView;
      });
      
      if (isAnimating) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, currentTarget]);

  // Toggle animatie
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  // Ga naar specifiek target
  const goToTarget = (index: number) => {
    setCurrentTarget(index);
    setView({
      x: zoomTargets[index].x,
      y: zoomTargets[index].y,
      scale: 2.0
    });
  };

  // Reset naar begin
  const resetView = () => {
    setCurrentTarget(0);
    setView({ x: zoomTargets[0].x, y: zoomTargets[0].y, scale: 2.0 });
  };

  return (
    <div className="mandelbrot-auto-container">
      <div className="controls">
        <h2>🌀 Auto-Zooming Mandelbrot Explorer</h2>
        <p>Automatisch inzoomen op interessante locaties in de Mandelbrot set</p>
        
        <div className="control-buttons">
          <button onClick={toggleAnimation} className={`play-btn ${isAnimating ? 'pause' : 'play'}`}>
            {isAnimating ? '⏸️ Pauzeren' : '▶️ Afspelen'}
          </button>
          <button onClick={resetView} className="reset-btn">
            🔄 Reset
          </button>
        </div>

        <div className="current-info">
          <h3>Huidige Locatie: {zoomTargets[currentTarget].name}</h3>
          <div className="coordinates">
            <span>X: {view.x.toFixed(8)}</span>
            <span>Y: {view.y.toFixed(8)}</span>
            <span>Zoom: {(1/view.scale).toExponential(2)}x</span>
          </div>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="mandelbrot-canvas"
      />
      
      <div className="target-selector">
        <h3>🎯 Zoom Locaties:</h3>
        <div className="target-grid">
          {zoomTargets.map((target, index) => (
            <button
              key={index}
              onClick={() => goToTarget(index)}
              className={`target-btn ${index === currentTarget ? 'active' : ''}`}
            >
              {target.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MandelbrotAutoZoom;

// CSS Styles
const styles = `
  .mandelbrot-auto-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #0f0f0f, #1a1a2e, #16213e);
    min-height: 100vh;
    color: white;
  }

  .controls {
    text-align: center;
    margin-bottom: 20px;
  }

  .controls h2 {
    margin: 0 0 10px 0;
    font-size: 2.2em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .controls p {
    margin: 0 0 20px 0;
    opacity: 0.9;
    font-size: 1.1em;
  }

  .control-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
  }

  .play-btn, .reset-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1em;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }

  .play-btn.play {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: white;
  }

  .play-btn.pause {
    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
    color: white;
  }

  .reset-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
  }

  .play-btn:hover, .reset-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }

  .current-info {
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    padding: 15px;
    margin: 20px 0;
    backdrop-filter: blur(10px);
  }

  .current-info h3 {
    margin: 0 0 10px 0;
    color: #4ecdc4;
    font-size: 1.3em;
  }

  .coordinates {
    display: flex;
    justify-content: center;
    gap: 20px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    opacity: 0.8;
  }

  .mandelbrot-canvas {
    display: block;
    margin: 20px auto;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    border: 2px solid rgba(255,255,255,0.1);
  }

  .target-selector {
    text-align: center;
    margin-top: 30px;
  }

  .target-selector h3 {
    margin-bottom: 15px;
    color: #ff6b6b;
  }

  .target-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
    max-width: 800px;
    margin: 0 auto;
  }

  .target-btn {
    padding: 10px 15px;
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9em;
  }

  .target-btn:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.4);
    transform: translateY(-2px);
  }

  .target-btn.active {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    border-color: #4ecdc4;
    box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
  }

  @media (max-width: 768px) {
    .mandelbrot-canvas {
      width: 100%;
      height: auto;
    }
    
    .control-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .coordinates {
      flex-direction: column;
      gap: 5px;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}