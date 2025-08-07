import { createSignal, onCleanup, onMount } from "solid-js";
import PlayArrowIcon from "@suid/icons-material/PlayArrow";
import PauseIcon from "@suid/icons-material/Pause";
import ArrowUpwardIcon from "@suid/icons-material/ArrowUpward";

const SPEED_FACTOR = 0.4; // Adjust this to control scroll speed

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

  const handleMouseDown = (e) => {
    if (isEditingBpm()) return;
    longPressTimer = setTimeout(() => {
      e.preventDefault();
      setIsEditingBpm(true);
      longPressTimer = null;
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  const handleSliderMouseUp = () => {
    setIsEditingBpm(false);
  };

  const handleClick = () => {
    if (isEditingBpm() || longPressTimer) {
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
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {isEditingBpm() ? (
        <div
          style={{
            width: '100%',
            padding: '0 20px',
            display: 'flex',
            "flex-direction": 'column',
            "align-items": 'center',
            "justify-content": 'center'
          }}
          onMouseUp={handleSliderMouseUp}
          onTouchEnd={handleSliderMouseUp}
        >
          <input
            type="range"
            min="40"
            max="180"
            value={bpm()}
            onInput={(e) => {
              e.stopPropagation();
              setBpm(parseInt(e.currentTarget.value))
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", cursor: "pointer" }}
          />
          <div style={{ "font-size": "12px", "margin-top": "4px" }}>{bpm()} BPM</div>
        </div>
      ) : (
        isAtBottom() ? <ArrowUpwardIcon /> : isScrolling() ? <PauseIcon /> : <PlayArrowIcon />
      )}
    </div>
  );
};

export default ScrollButton;
