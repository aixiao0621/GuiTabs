import { createSignal, onCleanup, onMount } from "solid-js";
import PlayArrowIcon from "@suid/icons-material/PlayArrow";
import PauseIcon from "@suid/icons-material/Pause";
import ArrowUpwardIcon from "@suid/icons-material/ArrowUpward";

const ScrollButton = () => {
  const [isScrolling, setIsScrolling] = createSignal(false);
  const [isAtBottom, setIsAtBottom] = createSignal(false);
  const [speed, setSpeed] = createSignal(30); // 滚动速度 (像素/秒)
  const [isEditingSpeed, setIsEditingSpeed] = createSignal(false);
  const [isMinimized, setIsMinimized] = createSignal(false);

  let longPressTimer = null;
  let minimizeTimer = null;
  let resumeTimer = null;
  let animationFrameId = null;
  let sliderRef = null;

  const handleGlobalMouseUp = () => {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    if (isEditingSpeed()) {
      setIsEditingSpeed(false);
    }
    window.removeEventListener("mousemove", handleGlobalMouseMove);
    window.removeEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = (e) => {
    if (isEditingSpeed() && sliderRef) {
      const rect = sliderRef.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const minSpeed = 15;
      const maxSpeed = 80;
      const newSpeed = Math.round(minSpeed + (maxSpeed - minSpeed) * percent);
      setSpeed(newSpeed);
    }
  };

  const handleMouseDown = () => {
    longPressTimer = setTimeout(() => {
      setIsEditingSpeed(true);
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
    let accumulatedScroll = 0; // 累积滚动距离

    const scroll = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // 累积滚动距离
      accumulatedScroll += speed() * deltaTime / 1000;

      // 当累积距离大于等于1像素时才执行滚动
      if (accumulatedScroll >= 1) {
        const scrollPixels = Math.floor(accumulatedScroll);
        window.scrollBy(0, scrollPixels);
        accumulatedScroll -= scrollPixels; // 保留小数部分
      }

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

  const handleClick = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    } else if (isEditingSpeed()) {
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
        right: isMinimized() ? (isEditingSpeed() ? "20px" : "-20px") : "20px",
        "z-index": 1000,
        display: 'flex',
        "align-items": 'center',
        "justify-content": 'center',
        width: isEditingSpeed() ? '200px' : '56px',
        height: '56px',
        background: '#1976d2',
        "border-radius": isEditingSpeed() ? '28px' : '50%',
        color: 'white',
        transition: 'width 0.3s ease, border-radius 0.3s ease, right 0.5s',
        cursor: 'pointer',
        "box-shadow": '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {isEditingSpeed() ? (
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
            min="15"
            max="80"
            value={speed()}
            style={{ width: "100%", "pointer-events": "none" }}
          />
          <div style={{ "font-size": "12px", "margin-top": "4px", "pointer-events": "none" }}>{speed()} px/s</div>
        </div>
      ) : (
        isAtBottom() ? <ArrowUpwardIcon /> : isScrolling() ? <PauseIcon /> : <PlayArrowIcon />
      )}
    </div>
  );
};

export default ScrollButton;
