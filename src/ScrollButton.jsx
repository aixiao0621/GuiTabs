import { createSignal, onCleanup, onMount } from "solid-js";
import Fab from "@suid/material/Fab";
import Box from "@suid/material/Box";
import PlayArrowIcon from "@suid/icons-material/PlayArrow";
import PauseIcon from "@suid/icons-material/Pause";
import ArrowUpwardIcon from "@suid/icons-material/ArrowUpward";

const ScrollButton = () => {
  const [isScrolling, setIsScrolling] = createSignal(false);
  const [isAtBottom, setIsAtBottom] = createSignal(false);
  const [bpm, setBpm] = createSignal(60);
  const [showSlider, setShowSlider] = createSignal(false);
  const [isMinimized, setIsMinimized] = createSignal(false);

  let longPressTimer;
  let minimizeTimer;
  let resumeTimer;

  const handleScroll = () => {
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    setIsAtBottom(atBottom);
    if (atBottom) {
      stopScrolling(true); // Stop scrolling when bottom is reached
    }
  };

  const handleManualScroll = () => {
    if (!isScrolling()) return;

    setIsScrolling(false); // Pause animation
    clearTimeout(resumeTimer);

    resumeTimer = setTimeout(() => {
        startScrolling();
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
      if (!isScrolling()) return;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const scrollAmount = (bpm() / 60) * (60 * deltaTime / 1000); // pixels per second
      window.scrollBy(0, scrollAmount);
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  };

  const stopScrolling = (isAutomatic = false) => {
    setIsScrolling(false);
    clearTimeout(resumeTimer);
    if (!isAutomatic) {
      setIsMinimized(false);
      clearTimeout(minimizeTimer);
    }
    window.removeEventListener("wheel", handleManualScroll);
    window.removeEventListener("touchstart", handleManualScroll);
  };

  const handleMouseDown = () => {
    longPressTimer = setTimeout(() => {
      setShowSlider(true);
    }, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(longPressTimer);
  };

  const handleClick = () => {
    if (showSlider()) {
        setShowSlider(false);
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
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        right: isMinimized() ? "-20px" : "20px",
        transition: "right 0.5s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      {showSlider() && (
        <Box sx={{
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '10px',
          marginBottom: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <input
            type="range"
            min="30"
            max="240"
            value={bpm()}
            onInput={(e) => setBpm(parseInt(e.currentTarget.value))}
            style={{
              width: "100px",
              cursor: "pointer"
            }}
          />
           <div style={{ "text-align": "center" }}>{bpm()} BPM</div>
        </Box>
      )}
      <Fab
        color="primary"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {isAtBottom() ? <ArrowUpwardIcon /> : isScrolling() ? <PauseIcon /> : <PlayArrowIcon />}
      </Fab>
    </Box>
  );
};

export default ScrollButton;
