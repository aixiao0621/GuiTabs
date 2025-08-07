import { createSignal, onCleanup, onMount } from "solid-js";
import PlayArrowIcon from "@suid/icons-material/PlayArrow";
import PauseIcon from "@suid/icons-material/Pause";
import ArrowUpwardIcon from "@suid/icons-material/ArrowUpward";

const SPEED_FACTOR = 0.4;

const ScrollButton = () => {
  const [isScrolling, setIsScrolling] = createSignal(false);
  const [isAtBottom, setIsAtBottom] = createSignal(false);
  const [bpm, setBpm] = createSignal(80);
  const [isEditingBpm, setIsEditingBpm] = createSignal(false);
  const [isMinimized, setIsMinimized] = createSignal(false);

  let longPressTimer = null;
  let minimizeTimer = null;
  let resumeTimer = null;
  let animationFrameId = null;
  let sliderRef = null;

  const handleGlobalMouseUp = () => {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    if (isEditingBpm()) {
      setIsEditingBpm(false);
    }
    window.removeEventListener("mousemove", handleGlobalMouseMove);
    window.removeEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = (e) => {
    if (isEditingBpm() && sliderRef) {
      const rect = sliderRef.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const minBpm = 40;
      const maxBpm = 180;
      const newBpm = Math.round(minBpm + (maxBpm - minBpm) * percent);
      setBpm(newBpm);
    }
  };

  const handleMouseDown = () => {
    longPressTimer = setTimeout(() => {
      setIsEditingBpm(true);
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }, 500);
    window.addEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleScroll = () => {
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    setIsAtBottom(atBottom);
    if (atBottom) {
      stopScrolling(true);
    }
  };

  const handleManualScroll = () => {
    if (!isScrolling()) return;

    cancelAnimationFrame(animationFrameId);
    setIsScrolling(false);
    clearTimeout(resumeTimer);

    resumeTimer = setTimeout(() => {
      if (!isAtBottom()) {
        startScrolling();
      }
    }, 1000);
  };

  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleManualScroll);
      window.removeEventListener("touchstart", handleManualScroll);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      clearTimeout(longPressTimer);
      clearTimeout(minimizeTimer);
      clearTimeout(resumeTimer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });
  });

  const startScrolling = () => {
    setIsScrolling(true);
    setIsMinimized(false);
    clearTimeout(minimizeTimer);
    minimizeTimer = setTimeout(() => {
      if (isScrolling()) {
        setIsMinimized(true);
      }
    }, 5000);

    window.addEventListener("wheel", handleManualScroll);
    window.addEventListener("touchstart", handleManualScroll);

    let lastTime = performance.now();
    const scroll = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const scrollAmount = (bpm() * SPEED_FACTOR) * deltaTime / 1000;
      window.scrollBy(0, scrollAmount);
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
  };

  const stopScrolling = (isAutomatic = false) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    setIsScrolling(false);
    clearTimeout(resumeTimer);
    if (!isAutomatic) {
      setIsMinimized(false);
      clearTimeout(minimizeTimer);
    }
    window.removeEventListener("wheel", handleManualScroll);
    window.removeEventListener("touchstart", handleManualScroll);
  };

  const handleClick = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    } else if (isEditingBpm()) {
        return;
    }

    if (isAtBottom()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsAtBottom(false);
      return;
    }
    if (isScrolling()) {
      stopScrolling();
    } else {
      startScrolling();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: isMinimized() ? (isEditingBpm() ? "20px" : "-20px") : "20px",
        "z-index": 1000,
        display: 'flex',
        "align-items": 'center',
        "justify-content": 'center',
        width: isEditingBpm() ? '200px' : '56px',
        height: '56px',
        background: '#1976d2',
        "border-radius": isEditingBpm() ? '28px' : '50%',
        color: 'white',
        transition: 'width 0.3s ease, border-radius 0.3s ease, right 0.5s',
        cursor: 'pointer',
        "box-shadow": '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {isEditingBpm() ? (
        <div
          ref={sliderRef}
          style={{
            width: '100%',
            padding: '0 20px',
            display: 'flex',
            "flex-direction": 'column',
            "align-items": 'center',
            "justify-content": 'center'
          }}
        >
          <input
            type="range"
            min="40"
            max="180"
            value={bpm()}
            style={{ width: "100%", "pointer-events": "none" }}
          />
          <div style={{ "font-size": "12px", "margin-top": "4px", "pointer-events": "none" }}>{bpm()} BPM</div>
        </div>
      ) : (
        isAtBottom() ? <ArrowUpwardIcon /> : isScrolling() ? <PauseIcon /> : <PlayArrowIcon />
      )}
    </div>
  );
};

export default ScrollButton;
