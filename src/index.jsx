import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import TemporaryDrawer from "./tabs";
import { createSignal } from "solid-js";

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
          }}
        >
          {allTabs[value()] ? allTabs[value()].name : "GuiTabs"}
        </a>
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
