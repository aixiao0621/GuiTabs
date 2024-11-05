import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@suid/material";
import { DrawerProps } from "@suid/material/Drawer";
import { createMutable } from "solid-js/store";
import MenuIcon from "@suid/icons-material/Menu";
import { QueueMusic } from "@suid/icons-material";

type Anchor = NonNullable<DrawerProps["anchor"]>;

export default function TemporaryDrawer(props) {
  const state = createMutable<{
    [K in Anchor]: boolean;
  }>({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: MouseEvent | KeyboardEvent) => {
      if (event.type === "keydown") {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === "Tab" || keyboardEvent.key === "Shift")
          return;
      }
      state[anchor] = open;
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <List>
          {Object.entries(props["tabs"]).map(([key, value]) => (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  props["onClick"](key);
                }}
              >
                <ListItemIcon>{<QueueMusic />}</ListItemIcon>
                <ListItemText primary={value["name"]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </List>
    </Box>
  );
  const anchor: Anchor = "left";
  return (
    <div>
      <Button onClick={toggleDrawer(anchor, true)}>
        <MenuIcon style={{ color: "black" }} />
      </Button>
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        sx={{ zIndex: 9999 }}
        onClose={toggleDrawer(anchor, false)}
      >
        {list(anchor)}
      </Drawer>
    </div>
  );
}
