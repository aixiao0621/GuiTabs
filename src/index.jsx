import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import TemporaryDrawer from "./tabs";
import { createSignal } from "solid-js";
import ScrollButton from "./ScrollButton";

function App() {
  const [value, setValue] = createSignal("GuiTabs");
  let allTabs = {
    Peace: {
      name: "Peace",
      url: ["/finger/peace/1.png"],
      type: "png",
    },
    like_a_star: {
      name: "Like a star",
      url: [
        "/finger/like_a_star/1.webp",
        "/finger/like_a_star/2.webp",
        "/finger/like_a_star/3.webp",
        "/finger/like_a_star/4.webp",
        "/finger/like_a_star/5.webp",
        "/finger/like_a_star/6.webp",
        "/finger/like_a_star/7.webp",
      ],
      type: "webp",
    },
    fenyechen: {
      name: "枫叶城",
      url: [
        "/finger/fenyechen/1.png",
        "/finger/fenyechen/2.png",
        "/finger/fenyechen/3.png",
      ],
      type: "png",
    },
    time_travel: {
      name: "Time travel",
      url: [
        "/finger/time_travel/1.png",
        "/finger/time_travel/2.png",
        "/finger/time_travel/3.png",
        "/finger/time_travel/4.png",
        "/finger/time_travel/5.png",
        "/finger/time_travel/6.png",
      ],
      type: "png",
    },
    flower: {
      name: "Flower",
      url: ["/finger/flower/1.png", "/finger/flower/2.png"],
      type: "png",
    },
    qijishan: {
      name: "奇迹山",
      url: [
        "/finger/qijishan/1.webp",
        "/finger/qijishan/2.webp",
        "/finger/qijishan/3.webp",
      ],
      type: "webp",
    },
    huahai: {
      name: "花海 电吉他",
      url: ["/finger/huahai/1.png", "/finger/huahai/2.png"],
      type: "png",
    },
    april_encounter: {
      name: "April Encounter",
      url: [
        "/strum/april_encounter/1.jpg",
        "/strum/april_encounter/2.jpg",
        "/strum/april_encounter/3.jpg",
      ],
      type: "jpg",
    },
    meihaoshiwu: {
      name: "美好事物",
      url: [
        "/strum/meihaoshiwu/1.jpg",
        "/strum/meihaoshiwu/2.jpg",
        "/strum/meihaoshiwu/3.jpg",
      ],
      type: "jpg",
    },
    meihaoshiwu2017: {
      name: "美好事物 2017",
      url: [
        "/strum/meihaoshiwu2017/1.png",
        "/strum/meihaoshiwu2017/2.png",
        "/strum/meihaoshiwu2017/3.png",
      ],
      type: "png",
    },
    langbei: {
      name: "狼狈",
      url: [
        "/strum/langbei/1.png",
        "/strum/langbei/2.png",
        "/strum/langbei/3.png",
        "/strum/langbei/4.png",
      ],
      type: "png",
    },
    tkzc: {
      name: "天空之城",
      url: ["/finger/tkzc/1.png"],
      type: "png",
    },
    anheqiao: {
      name: "安和桥",
      url: ["/finger/anheqiao/1.jpg"],
      type: "jpg",
    },
    summer: {
      name: "Summer",
      url: [
        "/finger/summer/1.jpg",
        "/finger/summer/2.jpg",
        "/finger/summer/3.jpg",
        "/finger/summer/4.jpg",
      ],
      type: "jpg",
    },
    wangwang: {
      name: "往往",
      url: [
        "/strum/wangwang/1.png",
        "/strum/wangwang/2.png",
        "/strum/wangwang/3.png",
      ],
      type: "png",
    },
    chashanliu: {
      name: "下一站，茶山刘",
      url: [
        "/strum/chashanliu/1.jpg",
        "/strum/chashanliu/2.jpg",
        "/strum/chashanliu/3.jpg",
        "/strum/chashanliu/4.jpg",
      ],
      type: "jpg",
    },
    luckyone: {
      name: "Lucky One",
      url: ["/strum/luckyone/1.png"],
      type: "png",
    },
    distantechoes: {
      name: "Distant Echoes",
      url: [
        "/strum/distantechoes/1.jpg",
        "/strum/distantechoes/2.jpg",
        "/strum/distantechoes/3.jpg",
      ],
      type: "jpg",
    },
    duantan: {
      name: "短叹",
      url: [
        "/strum/duantan/1.png",
        "/strum/duantan/2.png",
        "/strum/duantan/3.png",
        "/strum/duantan/4.png",
      ],
      type: "png",
    },
    gaobai: {
      name: "告白",
      url: [
        "/strum/gaobai/1.png",
        "/strum/gaobai/2.png",
        "/strum/gaobai/3.png",
        "/strum/gaobai/4.png",
      ],
      type: "png",
    },
    xinrong: {
      name: "形容",
      url: [
        "/strum/xinrong/1.png",
        "/strum/xinrong/2.png",
        "/strum/xinrong/3.png",
        "strum/xinrong/4.png",
      ],
      type: "png",
    },
    Lagrima: {
      name: "Lagrima",
      url: ["/finger/Lagrima/1.png"],
      type: "png",
    },
    xiatiandefeng: {
      name: "夏天的风",
      url: [
        "/finger/xiatiandefeng/1.png",
        "/finger/xiatiandefeng/2.png",
        "/finger/xiatiandefeng/3.png",
        "/finger/xiatiandefeng/4.png",
      ],
      type: "tiff",
    },
    skbljs: {
      name: "斯卡布罗集市",
      url: [
        "/finger/skbljs/1.png",
      ],
      type: "png",
    },
    fretboard: {
      name: "Fretboard",
      url: [
        "/finger/fretboard/1.webp",
      ],
      type: "webp",
    },
    wlxq: {
      name: "亡灵序曲",
      url: [
        "/strum/wlxq/1.png",
        "/strum/wlxq/2.png",
        "/strum/wlxq/3.png",
        "/strum/wlxq/4.png",
        "/strum/wlxq/5.png",
        "/strum/wlxq/6.png",
        "/strum/wlxq/7.png",
        "/strum/wlxq/8.png",
        "/strum/wlxq/9.png",
        "/strum/wlxq/10.png",
        "/strum/wlxq/11.png",
        "/strum/wlxq/12.png",
        "/strum/wlxq/13.png",
        "/strum/wlxq/14.png"
      ]
    },
    xyh:{
      name: "向阳花_主音",
      url: [
        "/strum/xyh/1.png",
        "/strum/xyh/2.png",
        "/strum/xyh/3.png",
        "/strum/xyh/4.png",
        "/strum/xyh/5.png",
        "/strum/xyh/6.png"
      ]
    },
    xyh_a:{
      name: "向阳花_节奏",
      url: [
        "/strum/xyh_a/1.png",
        "/strum/xyh_a/2.png",
        "/strum/xyh_a/3.png",
        "/strum/xyh_a/4.png",
        "/strum/xyh_a/5.png",
        "/strum/xyh_a/6.png",
        "/strum/xyh_a/7.png",
        "/strum/xyh_a/8.png"
      ]
    },
    kdcm: {
      name: "开到荼蘼",
      url: [
        "/strum/kdtm/1.png"
      ]
    },
    kdcm_a :{
      name: "开到荼蘼_清音",
      url: [
        "/strum/kdtm_a/1.png"
      ]
    },
    kdcm_b :{
      name: "开到荼蘼_失真",
      url: [
        "/strum/kdtm_b/1.png",
        "/strum/kdtm_b/2.png",
        "/strum/kdtm_b/3.png",
        "/strum/kdtm_b/4.png"
      ]
    },
    hsggxh: {
      name: "红色高跟鞋",
      url: [
        "/strum/hsggxh/1.jpg",
        "/strum/hsggxh/1.jpg",
        "/strum/hsggxh/2.jpg",
        "/strum/hsggxh/3.jpg",
        "/strum/hsggxh/4.jpg",
        "/strum/hsggxh/5.jpg",
        "/strum/hsggxh/6.jpg",
        "/strum/hsggxh/7.jpg",
        "/strum/hsggxh/8.jpg",
        "/strum/hsggxh/9.jpg",
        "/strum/hsggxh/99.jpg",
      ],
      type: "jpg",

    }
  };
  return (
    <>
      <div
        style={{
          position: "fixed",
          display: "flex",
          "flex-direction": "row",
        }}
      >
        <TemporaryDrawer
          tabs={allTabs}
          onClick={(title) => {
            setValue(title);
          }}
        ></TemporaryDrawer>
        <a
          style={{
            "text-align": "right",
            "text-decoration": "",
            "font-weight": "bold",
            "margin-top": "6px",
            "font-size": "18px",
            "margin-right": !allTabs[value()] ? "50px" : "0px",
          }}
        >
          {allTabs[value()] ? allTabs[value()].name : "GuiTabs"}
        </a>
        {!allTabs[value()] && (
          <a
            href="https://github.com/aixiao0621/GuiTabs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              right: "20px",
              top: "8px",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: "#333" }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        )}

      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "justify-content": "center",
        }}
      >
        {allTabs[value()] ? (
          allTabs[value()].url.map((e, index) => {
            switch (allTabs[value()].type) {
              case "pdf":
                return <a>pdf gun !</a>;
              default:
                return (
                  <>
                    <p>第 {index + 1} 页 👇</p>
                    <img
                      src={`${e}`}
                      style={{
                        width: `auto`,
                        height: `auto`,
                        "max-width": `100%`,
                        "max-height": `100%`,
                      }}
                    ></img>
                  </>
                );
            }
          })
        ) : (
          <img
            src="index.png"
            style={{
              width: `300px`,
              height: `300px`,
            }}
          ></img>
        )}
      </div>
      {allTabs[value()] && <ScrollButton />}
    </>
  );
}

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root")
);
