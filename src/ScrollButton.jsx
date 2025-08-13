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
  let isLongPressing = false;

  const handleGlobalEnd = () => {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    isLongPressing = false;
    if (isEditingSpeed()) {
      setIsEditingSpeed(false);
    }
    window.removeEventListener("mousemove", handleGlobalMove);
    window.removeEventListener("mouseup", handleGlobalEnd);
    window.removeEventListener("touchmove", handleGlobalMove);
    window.removeEventListener("touchend", handleGlobalEnd);
  };

  const handleGlobalMove = (e) => {
    if (isEditingSpeed() && sliderRef) {
      const rect = sliderRef.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const minSpeed = 5;
      const maxSpeed = 80;
      const newSpeed = Math.round(minSpeed + (maxSpeed - minSpeed) * percent);
      setSpeed(newSpeed);
    }
  };

  const handleStart = (e) => {
    // 阻止触摸事件的默认行为和事件冒泡
    if (e.type === 'touchstart') {
      e.preventDefault();
      e.stopPropagation();
    }

    // 清除之前的定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }

    isLongPressing = true;
    longPressTimer = setTimeout(() => {
      if (isLongPressing) {
        setIsEditingSpeed(true);
        window.addEventListener("mousemove", handleGlobalMove);
        window.addEventListener("touchmove", handleGlobalMove, { passive: false });
      }
    }, 500);

    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchend", handleGlobalEnd);
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

    // 只有在用户手动滚动页面时才设置自动恢复，点击按钮停止不会触发恢复
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
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchmove", handleGlobalMove);
      window.removeEventListener("touchend", handleGlobalEnd);
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

  const stopScrolling = (isAutomatic = false, preventResume = false) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    setIsScrolling(false);

    // 如果是手动停止（点击按钮），清除恢复定时器
    if (preventResume) {
      clearTimeout(resumeTimer);
    }

    if (!isAutomatic) {
      setIsMinimized(false);
      clearTimeout(minimizeTimer);
    }
    window.removeEventListener("wheel", handleManualScroll);
    window.removeEventListener("touchstart", handleManualScroll);
  };

  const handleClick = (e) => {
    // 如果正在编辑速度，不处理点击
    if (isEditingSpeed()) {
      return;
    }

    // 如果刚刚完成长按操作，不执行点击逻辑
    if (longPressTimer || isLongPressing) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
      isLongPressing = false;
      return;
    }

    // 阻止事件冒泡
    e.stopPropagation();

    if (isAtBottom()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsAtBottom(false);
      return;
    }
    if (isScrolling()) {
      stopScrolling(false, true); // 手动停止，阻止自动恢复
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
      onMouseDown={handleStart}
      onTouchStart={handleStart}
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
