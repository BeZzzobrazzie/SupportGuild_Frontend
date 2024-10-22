import { colorsTuple, createTheme, virtualColor } from "@mantine/core";


export const mantineTheme = createTheme({
  defaultRadius: "sm",
  cursorType: 'pointer',
  colors: {
    surface: colorsTuple("#252426"),
    secondaryLight: colorsTuple("#f8f0ea"),

    secondary: virtualColor({
      name: "secondary",
      dark: "surface",
      light: "secondaryLight",
    })
  }
})



// dark mode: 474647
// light mode: F6F0ED
// accent color: FC7A1E
// CF4D6F
// 6B9080
// 
